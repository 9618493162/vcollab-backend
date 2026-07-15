const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const recordingRoutes = require("./routes/recordingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const roomRoutes = require("./routes/roomRoutes");
const { apiLimiter } = require("./middleware/rateLimiter");

// Security imports
const {
    helmetConfig,
    sanitizeData,
    preventParameterPollution,
    sanitizeInput,
    detectSuspiciousActivity,
    corsOptions,
    setSecurityHeaders,
    logSecurityEvent
} = require("./middleware/security");

const { httpLogger, logger } = require("./middleware/logger");
const { sessionMiddleware, trackSessionActivity, detectSessionHijacking } = require("./middleware/sessionManager");

const app = express();

// Trust proxy (for rate limiting and logging behind reverse proxy)
app.set('trust proxy', 1);

// HTTP request logging (Morgan + Winston)
app.use(httpLogger);

// Security headers (Helmet with custom config)
app.use(helmetConfig);
app.use(setSecurityHeaders);

// CORS with origin validation
app.use(cors(corsOptions));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session management
app.use(sessionMiddleware(process.env.MONGODB_URI));
app.use(trackSessionActivity);
app.use(detectSessionHijacking);

// Data sanitization (NoSQL injection prevention)
app.use(sanitizeData);

// HTTP Parameter Pollution prevention
app.use(preventParameterPollution);

// XSS protection
app.use(sanitizeInput);

// Detect suspicious activity
app.use(detectSuspiciousActivity);

// Security event logging
app.use(logSecurityEvent);


// Serve uploaded files statically (with security)
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
    dotfiles: 'deny',
    index: false,
    maxAge: '1d',
    setHeaders: (res, path) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Content-Security-Policy', "default-src 'none'");
    }
}));

// Health check endpoint (before rate limiting)
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Routes
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "VCollab Backend API v1.0",
        version: "1.0.0",
        security: "enabled",
        endpoints: {
            auth: "/api/auth",
            meetings: "/api/meetings",
            recordings: "/api/recordings",
            uploads: "/api/uploads",
            rooms: "/api/rooms",
            admin: "/api/admin"
        },
        status: "operational"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/recordings", recordingRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/admin", adminRoutes);

// Serve frontend for all non-API routes (SPA support)
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    } else {
        res.status(404).json({
            success: false,
            message: "API endpoint not found"
        });
    }
});

// 404 handler for API routes only
app.use('/api/*', (req, res) => {
    logger.warn(`404 - API Not Found: ${req.method} ${req.originalUrl} from ${req.ip}`);
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    // Log error with context
    logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userId: req.user?.id
    });

    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(err.status || 500).json({ 
        success: false,
        message: err.message || "Something went wrong!",
        error: isDevelopment ? err.message : undefined,
        stack: isDevelopment ? err.stack : undefined
    });
});

// Log successful startup
logger.info('Application middleware configured successfully');

module.exports = app;
