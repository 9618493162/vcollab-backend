const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for logs
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        if (Object.keys(meta).length > 0) {
            log += ` ${JSON.stringify(meta)}`;
        }
        if (stack) {
            log += `\n${stack}`;
        }
        return log;
    })
);

// Console format (colorized for development)
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
    })
);

// Daily rotating file transport for general logs
const fileRotateTransport = new DailyRotateFile({
    filename: path.join(logsDir, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: logFormat
});

// Daily rotating file transport for error logs
const errorFileRotateTransport = new DailyRotateFile({
    filename: path.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d',
    level: 'error',
    format: logFormat
});

// Daily rotating file transport for security logs
const securityFileRotateTransport = new DailyRotateFile({
    filename: path.join(logsDir, 'security-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '90d',
    format: logFormat
});

// Create Winston logger
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    defaultMeta: { service: 'vcollab-backend' },
    transports: [
        fileRotateTransport,
        errorFileRotateTransport
    ],
    exceptionHandlers: [
        new DailyRotateFile({
            filename: path.join(logsDir, 'exceptions-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d'
        })
    ],
    rejectionHandlers: [
        new DailyRotateFile({
            filename: path.join(logsDir, 'rejections-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '30d'
        })
    ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat
    }));
}

// Security logger (separate instance for security events)
const securityLogger = winston.createLogger({
    level: 'info',
    format: logFormat,
    defaultMeta: { service: 'vcollab-security' },
    transports: [
        securityFileRotateTransport,
        new winston.transports.Console({
            format: consoleFormat
        })
    ]
});

// Morgan middleware for HTTP request logging
const morgan = require('morgan');

// Custom Morgan format
const morganFormat = ':remote-addr :method :url :status :response-time ms - :res[content-length]';

// Create Morgan middleware
const httpLogger = morgan(morganFormat, {
    stream: {
        write: (message) => {
            logger.info(message.trim());
        }
    },
    skip: (req) => {
        // Skip logging for health checks and static files
        return req.url === '/health' || req.url.startsWith('/uploads/');
    }
});

// Log levels:
// error: 0
// warn: 1
// info: 2
// http: 3
// verbose: 4
// debug: 5
// silly: 6

// Helper functions
const logError = (error, context = {}) => {
    logger.error({
        message: error.message,
        stack: error.stack,
        ...context
    });
};

const logWarning = (message, context = {}) => {
    logger.warn({
        message,
        ...context
    });
};

const logInfo = (message, context = {}) => {
    logger.info({
        message,
        ...context
    });
};

const logDebug = (message, context = {}) => {
    logger.debug({
        message,
        ...context
    });
};

const logSecurity = (event, details = {}) => {
    securityLogger.info({
        event,
        timestamp: new Date().toISOString(),
        ...details
    });
};

// Middleware to log security events
const securityEventLogger = (eventType) => {
    return (req, res, next) => {
        logSecurity(eventType, {
            userId: req.user?.id || 'anonymous',
            ip: req.ip,
            userAgent: req.get('user-agent'),
            method: req.method,
            url: req.originalUrl
        });
        next();
    };
};

// Log unhandled rejections and exceptions
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    // Give time for logs to be written
    setTimeout(() => {
        process.exit(1);
    }, 1000);
});

module.exports = {
    logger,
    securityLogger,
    httpLogger,
    logError,
    logWarning,
    logInfo,
    logDebug,
    logSecurity,
    securityEventLogger
};
