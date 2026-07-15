const session = require('express-session');
const MongoStore = require('connect-mongo');
const { logger } = require('./logger');

// Session configuration
const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'vcollab-session-secret-change-in-production',
    name: 'vcollab.sid', // Custom session cookie name (don't use default 'connect.sid')
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true, // Prevent XSS attacks
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict', // CSRF protection
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        domain: process.env.COOKIE_DOMAIN || undefined
    },
    // Store sessions in MongoDB (if available)
    store: undefined
};

// Initialize session store
const initializeSessionStore = (mongoUri) => {
    if (!mongoUri) {
        logger.warn('MongoDB URI not provided, using in-memory session store (not recommended for production)');
        return sessionConfig;
    }

    try {
        sessionConfig.store = MongoStore.create({
            mongoUrl: mongoUri,
            ttl: 24 * 60 * 60, // 1 day
            autoRemove: 'native', // Use MongoDB's TTL to automatically remove expired sessions
            touchAfter: 24 * 3600, // Lazy session update
            crypto: {
                secret: process.env.SESSION_SECRET || 'vcollab-session-secret'
            }
        });
        logger.info('✅ Session store configured with MongoDB');
    } catch (error) {
        logger.error('Failed to initialize MongoDB session store:', error);
        logger.warn('Falling back to in-memory session store');
    }

    return sessionConfig;
};

// Session middleware with error handling
const sessionMiddleware = (mongoUri) => {
    const config = initializeSessionStore(mongoUri);
    const sessionHandler = session(config);

    return (req, res, next) => {
        sessionHandler(req, res, (err) => {
            if (err) {
                logger.error('Session error:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Session error occurred'
                });
            }
            next();
        });
    };
};

// Session security helpers
const regenerateSession = (req) => {
    return new Promise((resolve, reject) => {
        req.session.regenerate((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

const destroySession = (req) => {
    return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
            if (err) reject(err);
            else resolve();
        });
    });
};

// Middleware to ensure session is authenticated
const requireSession = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({
            success: false,
            message: 'Session required'
        });
    }
    next();
};

// Session activity tracker (for security monitoring)
const trackSessionActivity = (req, res, next) => {
    if (req.session) {
        req.session.lastActivity = new Date();
        req.session.ip = req.ip;
        req.session.userAgent = req.get('user-agent');
    }
    next();
};

// Detect session hijacking attempts
const detectSessionHijacking = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return next();
    }

    const currentIP = req.ip;
    const currentUserAgent = req.get('user-agent');

    // Check if IP or user agent changed
    if (req.session.ip && req.session.ip !== currentIP) {
        logger.warn('Potential session hijacking detected:', {
            userId: req.session.userId,
            oldIP: req.session.ip,
            newIP: currentIP,
            sessionId: req.sessionID
        });

        // Optionally, destroy session and require re-authentication
        if (process.env.STRICT_SESSION_SECURITY === 'true') {
            destroySession(req);
            return res.status(401).json({
                success: false,
                message: 'Session security violation detected. Please login again.'
            });
        }
    }

    if (req.session.userAgent && req.session.userAgent !== currentUserAgent) {
        logger.warn('User agent changed in session:', {
            userId: req.session.userId,
            oldUA: req.session.userAgent,
            newUA: currentUserAgent,
            sessionId: req.sessionID
        });
    }

    next();
};

// Cleanup expired sessions (for in-memory store)
const cleanupExpiredSessions = () => {
    // This is automatically handled by MongoStore
    // For in-memory store, implement cleanup logic here if needed
    logger.info('Session cleanup task executed');
};

// Run cleanup every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

module.exports = {
    sessionMiddleware,
    regenerateSession,
    destroySession,
    requireSession,
    trackSessionActivity,
    detectSessionHijacking
};
