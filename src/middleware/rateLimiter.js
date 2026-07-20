const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Auth endpoints rate limiter (stricter)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Increased for testing - Limit each IP to 50 auth requests per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later'
    },
    skipSuccessfulRequests: true // Don't count successful requests
});

// File upload rate limiter
const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // Limit each IP to 20 uploads per hour
    message: {
        success: false,
        message: 'Too many file uploads, please try again later'
    }
});

// Meeting creation rate limiter
const meetingLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 50, // Limit each IP to 50 meeting creations per hour
    message: {
        success: false,
        message: 'Too many meetings created, please try again later'
    }
});

// Password reset rate limiter (very strict)
const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Only 3 password reset attempts per hour
    message: {
        success: false,
        message: 'Too many password reset requests, please try again later'
    }
});

// Token generation rate limiter (for LiveKit)
const tokenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 token requests per 15 minutes
    message: {
        success: false,
        message: 'Too many token requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    apiLimiter,
    authLimiter,
    uploadLimiter,
    meetingLimiter,
    passwordResetLimiter,
    tokenLimiter // Added for LiveKit token generation security
};
