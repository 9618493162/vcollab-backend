const hpp = require('hpp');
const helmet = require('helmet');

// Data sanitization middleware (generic - works with any database)
const sanitizeData = (req, res, next) => {
    // Remove MongoDB-specific operators and dangerous characters
    const sanitize = (obj) => {
        if (typeof obj === 'object' && obj !== null) {
            for (let key in obj) {
                // Remove keys starting with $ or containing dots (MongoDB operators)
                if (key.startsWith('$') || key.includes('.')) {
                    delete obj[key];
                    console.warn(`🚨 Potential NoSQL injection attempt detected: ${key}`);
                } else {
                    obj[key] = sanitize(obj[key]);
                }
            }
        }
        return obj;
    };

    if (req.body && typeof req.body === 'object') {
        req.body = sanitize({ ...req.body });
    }
    if (req.query && typeof req.query === 'object') {
        req.query = sanitize({ ...req.query });
    }
    if (req.params && typeof req.params === 'object') {
        req.params = sanitize({ ...req.params });
    }

    next();
};

// HTTP Parameter Pollution protection
const preventParameterPollution = hpp({
    whitelist: ['page', 'limit', 'sort', 'fields', 'search', 'status', 'type']
});

// Advanced Helmet configuration
const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "ws:", "wss:"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    xssFilter: true
});

// Request size limits
const requestSizeLimits = {
    json: { limit: '10mb' },
    urlencoded: { extended: true, limit: '10mb' }
};

// Sanitize user input (remove dangerous characters)
const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            // Remove script tags, event handlers, and potentially dangerous content
            return obj
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/data:text\/html/gi, '');
        }
        if (typeof obj === 'object' && obj !== null) {
            for (let key in obj) {
                obj[key] = sanitize(obj[key]);
            }
        }
        return obj;
    };

    if (req.body) req.body = sanitize(req.body);
    if (req.query) req.query = sanitize(req.query);
    if (req.params) req.params = sanitize(req.params);
    
    next();
};

// Detect suspicious patterns
const detectSuspiciousActivity = (req, res, next) => {
    const suspiciousPatterns = [
        /(\$where|\$ne|\$gt|\$lt)/i,           // NoSQL injection
        /(union.*select|insert.*into)/i,       // SQL injection
        /(<script|javascript:|onerror=)/i,     // XSS
        /(\.\.\/|\.\.\\)/,                     // Path traversal
        /(%00|%0d%0a)/i,                       // Null byte injection
        /(eval\(|exec\(|system\()/i           // Code execution
    ];

    const checkString = JSON.stringify({
        body: req.body,
        query: req.query,
        params: req.params
    });

    for (const pattern of suspiciousPatterns) {
        if (pattern.test(checkString)) {
            console.error(`🚨 SECURITY ALERT: Suspicious pattern detected from IP ${req.ip}`);
            console.error(`Pattern: ${pattern}`);
            console.error(`Request: ${req.method} ${req.originalUrl}`);
            
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Suspicious activity detected'
            });
        }
    }

    next();
};

// CORS security with origin validation
const corsOptions = {
    origin: '*', // Allow all origins temporarily for Railway deployment
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    maxAge: 86400 // 24 hours
};

// Request logging for security auditing
const logSecurityEvent = (req, res, next) => {
    const securityLog = {
        timestamp: new Date().toISOString(),
        ip: req.ip,
        method: req.method,
        url: req.originalUrl,
        userAgent: req.get('user-agent'),
        userId: req.user?.id || 'anonymous'
    };

    // Log to console (in production, send to logging service)
    if (process.env.NODE_ENV === 'production') {
        console.log('🔒 Security Log:', JSON.stringify(securityLog));
    }

    next();
};

// Prevent brute force on sensitive endpoints
const loginAttempts = new Map();

const bruteForceProtection = (req, res, next) => {
    const identifier = req.body.email || req.ip;
    const attempts = loginAttempts.get(identifier) || { count: 0, lastAttempt: Date.now() };

    // Reset after 15 minutes
    if (Date.now() - attempts.lastAttempt > 15 * 60 * 1000) {
        attempts.count = 0;
    }

    attempts.count++;
    attempts.lastAttempt = Date.now();
    loginAttempts.set(identifier, attempts);

    // Block after 5 failed attempts
    if (attempts.count > 5) {
        console.error(`🚨 Brute force attempt detected: ${identifier}`);
        return res.status(429).json({
            success: false,
            message: 'Too many login attempts. Please try again in 15 minutes.'
        });
    }

    // Success callback to reset counter
    res.on('finish', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
            loginAttempts.delete(identifier);
        }
    });

    next();
};

// Clean up old login attempts every hour
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of loginAttempts.entries()) {
        if (now - value.lastAttempt > 60 * 60 * 1000) {
            loginAttempts.delete(key);
        }
    }
}, 60 * 60 * 1000);

// Security headers middleware
const setSecurityHeaders = (req, res, next) => {
    // Additional security headers not covered by Helmet
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Remove server identification
    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');
    
    next();
};

// Audit trail for critical operations
const auditTrail = (action) => {
    return (req, res, next) => {
        const audit = {
            action,
            timestamp: new Date().toISOString(),
            userId: req.user?.id || 'anonymous',
            ip: req.ip,
            userAgent: req.get('user-agent'),
            method: req.method,
            url: req.originalUrl,
            body: action.includes('password') ? '[REDACTED]' : req.body
        };

        console.log('📋 Audit:', JSON.stringify(audit));
        
        // In production, save to database or logging service
        // await AuditLog.create(audit);
        
        next();
    };
};

module.exports = {
    sanitizeData,
    preventParameterPollution,
    helmetConfig,
    requestSizeLimits,
    sanitizeInput,
    detectSuspiciousActivity,
    corsOptions,
    logSecurityEvent,
    bruteForceProtection,
    setSecurityHeaders,
    auditTrail
};
