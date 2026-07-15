// Security Configuration
// Centralized security settings for the application

module.exports = {
    // JWT Configuration
    jwt: {
        accessTokenExpiry: '15m',
        refreshTokenExpiry: '7d',
        algorithm: 'HS256',
        issuer: 'vcollab-backend',
        audience: 'vcollab-client'
    },

    // Password Policy
    password: {
        minLength: 6,
        requireNumber: true,
        requireUppercase: false,
        requireLowercase: false,
        requireSpecialChar: false,
        bcryptRounds: 10
    },

    // Session Configuration
    session: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        rolling: true,
        touchAfter: 24 * 3600 // Lazy session update
    },

    // Rate Limiting
    rateLimit: {
        general: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100
        },
        auth: {
            windowMs: 15 * 60 * 1000,
            max: 5
        },
        passwordReset: {
            windowMs: 60 * 60 * 1000, // 1 hour
            max: 3
        },
        upload: {
            windowMs: 60 * 60 * 1000,
            max: 20
        },
        meeting: {
            windowMs: 60 * 60 * 1000,
            max: 50
        }
    },

    // File Upload Limits
    fileUpload: {
        avatar: {
            maxSize: 10 * 1024 * 1024, // 10MB
            allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        },
        meetingFile: {
            maxSize: 50 * 1024 * 1024, // 50MB
            allowedTypes: [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain',
                'image/jpeg',
                'image/png',
                'image/gif'
            ]
        },
        recording: {
            maxSize: 500 * 1024 * 1024, // 500MB
            allowedTypes: ['video/webm', 'video/mp4', 'video/x-matroska']
        }
    },

    // CORS Settings
    cors: {
        allowedOrigins: [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:5173',
            'http://127.0.0.1:5173'
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        maxAge: 86400 // 24 hours
    },

    // Content Security Policy
    csp: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", 'ws:', 'wss:'],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },

    // Helmet Configuration
    helmet: {
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: { policy: 'cross-origin' },
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
    },

    // Brute Force Protection
    bruteForce: {
        maxAttempts: 5,
        windowMs: 15 * 60 * 1000, // 15 minutes
        blockDuration: 15 * 60 * 1000 // 15 minutes
    },

    // Suspicious Activity Detection
    suspiciousPatterns: [
        /(\$where|\$ne|\$gt|\$lt|\$regex)/i,      // NoSQL injection
        /(union.*select|insert.*into|drop.*table)/i, // SQL injection
        /(<script|javascript:|onerror=|onload=)/i,    // XSS
        /(\.\.\/|\.\.\\|%2e%2e)/i,                    // Path traversal
        /(%00|%0d%0a|\x00)/i,                          // Null byte injection
        /(eval\(|exec\(|system\(|passthru\()/i        // Code execution
    ],

    // Logging Configuration
    logging: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        retentionDays: {
            general: 14,
            error: 30,
            security: 90,
            audit: 365
        },
        maxFileSize: '20m'
    },

    // Security Headers
    headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    },

    // Trusted Proxies (for production behind load balancer)
    trustedProxies: [
        'loopback',
        'linklocal',
        'uniquelocal'
    ],

    // Cookie Security
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        domain: process.env.COOKIE_DOMAIN
    },

    // Input Sanitization
    sanitization: {
        removeScriptTags: true,
        removeEventHandlers: true,
        removeJavaScriptProtocol: true,
        removeDataURIs: true
    },

    // Database Security
    database: {
        sanitizeQueries: true,
        preventInjection: true,
        useParameterizedQueries: true
    },

    // API Security
    api: {
        versionHeader: 'X-API-Version',
        requestIdHeader: 'X-Request-ID',
        maxBodySize: '10mb',
        timeout: 30000 // 30 seconds
    },

    // WebSocket Security
    websocket: {
        origins: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        transports: ['websocket', 'polling'],
        maxHttpBufferSize: 1e8, // 100MB
        pingTimeout: 60000,
        pingInterval: 25000
    },

    // Audit Configuration
    audit: {
        enabled: true,
        logToDatabase: false, // Set to true to store in database
        logToFile: true,
        sensitiveFields: ['password', 'token', 'secret', 'apiKey'],
        events: [
            'user_registration',
            'user_login',
            'user_logout',
            'password_change',
            'password_reset',
            'profile_update',
            'admin_action',
            'file_upload',
            'meeting_created',
            'recording_started',
            'user_deleted'
        ]
    },

    // Production Recommendations
    production: {
        useHTTPS: true,
        useHSTS: true,
        secureCookies: true,
        strictCSP: true,
        enableMonitoring: true,
        useSecretManager: true, // Use AWS Secrets Manager, Azure Key Vault, etc.
        useTURNServer: true,
        enableBackups: true,
        useLoadBalancer: true,
        useCDN: true
    }
};
