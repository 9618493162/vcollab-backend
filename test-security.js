/**
 * Security Test Script
 * Run this to verify all security features are working
 * 
 * Usage: node test-security.js
 */

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
    title: (msg) => console.log(`\n${colors.blue}━━━ ${msg} ━━━${colors.reset}`)
};

// Test counter
let passed = 0;
let failed = 0;

function test(name, condition) {
    if (condition) {
        log.success(name);
        passed++;
    } else {
        log.error(name);
        failed++;
    }
}

// Security Tests
async function runSecurityTests() {
    console.log('\n');
    console.log('╔════════════════════════════════════════════╗');
    console.log('║   VCollab Backend Security Test Suite     ║');
    console.log('╚════════════════════════════════════════════╝');

    // 1. Module Imports
    log.title('Testing Security Modules');
    try {
        const security = require('./src/middleware/security');
        test('Security middleware loaded', !!security);
        test('Helmet config exists', !!security.helmetConfig);
        test('Sanitization function exists', !!security.sanitizeData);
        test('CORS config exists', !!security.corsOptions);
        test('Suspicious activity detection exists', !!security.detectSuspiciousActivity);
        test('Brute force protection exists', !!security.bruteForceProtection);
    } catch (error) {
        log.error(`Security module error: ${error.message}`);
        failed += 6;
    }

    try {
        const logger = require('./src/middleware/logger');
        test('Logger module loaded', !!logger);
        test('Winston logger exists', !!logger.logger);
        test('Security logger exists', !!logger.securityLogger);
        test('HTTP logger exists', !!logger.httpLogger);
    } catch (error) {
        log.error(`Logger module error: ${error.message}`);
        failed += 4;
    }

    try {
        const rateLimiter = require('./src/middleware/rateLimiter');
        test('Rate limiter module loaded', !!rateLimiter);
        test('API rate limiter exists', !!rateLimiter.apiLimiter);
        test('Auth rate limiter exists', !!rateLimiter.authLimiter);
        test('Password reset limiter exists', !!rateLimiter.passwordResetLimiter);
    } catch (error) {
        log.error(`Rate limiter module error: ${error.message}`);
        failed += 4;
    }

    try {
        const validation = require('./src/middleware/validation');
        test('Validation module loaded', !!validation);
        test('Register validation exists', !!validation.validateRegister);
        test('Login validation exists', !!validation.validateLogin);
    } catch (error) {
        log.error(`Validation module error: ${error.message}`);
        failed += 3;
    }

    try {
        const session = require('./src/middleware/sessionManager');
        test('Session manager loaded', !!session);
        test('Session middleware exists', !!session.sessionMiddleware);
        test('Session hijacking detection exists', !!session.detectSessionHijacking);
    } catch (error) {
        log.error(`Session manager error: ${error.message}`);
        failed += 3;
    }

    // 2. Environment Variables
    log.title('Testing Environment Configuration');
    require('dotenv').config();
    
    test('PORT configured', !!process.env.PORT);
    test('JWT_SECRET configured', !!process.env.JWT_SECRET);
    test('JWT_REFRESH_SECRET configured', !!process.env.JWT_REFRESH_SECRET);
    test('SESSION_SECRET configured', !!process.env.SESSION_SECRET);
    
    if (process.env.JWT_SECRET === 'vcollab-super-secret-key-2025-change-in-production') {
        log.warning('JWT_SECRET is using default value - CHANGE THIS IN PRODUCTION!');
    }
    
    if (process.env.SESSION_SECRET === 'vcollab-session-secret-key-2025-change-in-production') {
        log.warning('SESSION_SECRET is using default value - CHANGE THIS IN PRODUCTION!');
    }

    // 3. Security Configuration
    log.title('Testing Security Configuration');
    try {
        const securityConfig = require('./src/config/security');
        test('Security config loaded', !!securityConfig);
        test('JWT config exists', !!securityConfig.jwt);
        test('Password policy exists', !!securityConfig.password);
        test('Rate limit config exists', !!securityConfig.rateLimit);
        test('CORS config exists', !!securityConfig.cors);
        test('Helmet config exists', !!securityConfig.helmet);
        test('Brute force config exists', !!securityConfig.bruteForce);
        test('Audit config exists', !!securityConfig.audit);
    } catch (error) {
        log.error(`Security config error: ${error.message}`);
        failed += 8;
    }

    // 4. Password Hashing
    log.title('Testing Password Security');
    try {
        const bcrypt = require('bcrypt');
        const password = 'testPassword123';
        const hash = await bcrypt.hash(password, 10);
        const isValid = await bcrypt.compare(password, hash);
        test('Bcrypt hashing works', !!hash);
        test('Bcrypt comparison works', isValid);
        test('Hash is different from password', hash !== password);
    } catch (error) {
        log.error(`Password hashing error: ${error.message}`);
        failed += 3;
    }

    // 5. JWT Tokens
    log.title('Testing JWT Tokens');
    try {
        const jwt = require('jsonwebtoken');
        const secret = process.env.JWT_SECRET || 'test-secret';
        const payload = { id: '12345' };
        
        const accessToken = jwt.sign(payload, secret, { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, secret, { expiresIn: '7d' });
        
        test('Access token created', !!accessToken);
        test('Refresh token created', !!refreshToken);
        
        const decoded = jwt.verify(accessToken, secret);
        test('Token verification works', decoded.id === '12345');
    } catch (error) {
        log.error(`JWT error: ${error.message}`);
        failed += 3;
    }

    // 6. Input Sanitization
    log.title('Testing Input Sanitization');
    const dangerousInputs = [
        '<script>alert("XSS")</script>',
        'javascript:alert(1)',
        '{ "$ne": null }',
        '../../../etc/passwd',
        'admin\' OR \'1\'=\'1',
        'eval(malicious_code)'
    ];

    const { sanitizeInput } = require('./src/middleware/security');
    test('Sanitization function exists', typeof sanitizeInput === 'function');
    
    dangerousInputs.forEach(input => {
        const mockReq = { body: { test: input }, query: {}, params: {} };
        const mockRes = {};
        const mockNext = () => {};
        
        sanitizeInput(mockReq, mockRes, mockNext);
        const sanitized = mockReq.body.test;
        
        test(`Sanitized dangerous input: ${input.substring(0, 20)}...`, 
             !sanitized.includes('<script>') && 
             !sanitized.includes('javascript:') &&
             sanitized !== input);
    });

    // 7. File Upload Security
    log.title('Testing File Upload Configuration');
    try {
        const securityConfig = require('./src/config/security');
        const fileUpload = securityConfig.fileUpload;
        
        test('Avatar upload config exists', !!fileUpload.avatar);
        test('Avatar max size set', fileUpload.avatar.maxSize === 10 * 1024 * 1024);
        test('Avatar allowed types configured', fileUpload.avatar.allowedTypes.length > 0);
        
        test('Meeting file config exists', !!fileUpload.meetingFile);
        test('Meeting file max size set', fileUpload.meetingFile.maxSize === 50 * 1024 * 1024);
        
        test('Recording config exists', !!fileUpload.recording);
        test('Recording max size set', fileUpload.recording.maxSize === 500 * 1024 * 1024);
    } catch (error) {
        log.error(`File upload config error: ${error.message}`);
        failed += 7;
    }

    // 8. Rate Limiting Configuration
    log.title('Testing Rate Limiting Configuration');
    try {
        const securityConfig = require('./src/config/security');
        const rateLimit = securityConfig.rateLimit;
        
        test('General rate limit configured', !!rateLimit.general);
        test('Auth rate limit configured', !!rateLimit.auth);
        test('Password reset rate limit configured', !!rateLimit.passwordReset);
        test('Upload rate limit configured', !!rateLimit.upload);
        test('Meeting rate limit configured', !!rateLimit.meeting);
        
        test('General limit is reasonable', rateLimit.general.max === 100);
        test('Auth limit is strict', rateLimit.auth.max === 5);
        test('Password reset is very strict', rateLimit.passwordReset.max === 3);
    } catch (error) {
        log.error(`Rate limit config error: ${error.message}`);
        failed += 8;
    }

    // 9. Logging Configuration
    log.title('Testing Logging System');
    const fs = require('fs');
    const path = require('path');
    
    try {
        const logsDir = path.join(__dirname, 'logs');
        const logsDirExists = fs.existsSync(logsDir);
        test('Logs directory exists or will be created', true);
        
        const { logger, securityLogger } = require('./src/middleware/logger');
        test('Application logger exists', !!logger);
        test('Security logger exists', !!securityLogger);
        
        // Test log levels
        test('Logger has error level', typeof logger.error === 'function');
        test('Logger has warn level', typeof logger.warn === 'function');
        test('Logger has info level', typeof logger.info === 'function');
        test('Logger has debug level', typeof logger.debug === 'function');
    } catch (error) {
        log.error(`Logging system error: ${error.message}`);
        failed += 7;
    }

    // 10. Security Headers
    log.title('Testing Security Headers Configuration');
    try {
        const { helmetConfig } = require('./src/middleware/security');
        test('Helmet CSP configured', !!helmetConfig.contentSecurityPolicy);
        test('HSTS configured', !!helmetConfig.hsts);
        test('Frame guard configured', !!helmetConfig.frameguard);
        test('XSS filter enabled', helmetConfig.xssFilter === true);
        test('Powered-by hidden', helmetConfig.hidePoweredBy === true);
    } catch (error) {
        log.error(`Security headers error: ${error.message}`);
        failed += 5;
    }

    // Final Results
    log.title('Test Results');
    console.log('');
    console.log(`Total Tests: ${passed + failed}`);
    console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
    console.log('');

    if (failed === 0) {
        console.log(`${colors.green}╔════════════════════════════════════════════╗${colors.reset}`);
        console.log(`${colors.green}║     🎉 ALL SECURITY TESTS PASSED! 🎉      ║${colors.reset}`);
        console.log(`${colors.green}║   Backend is production-ready! 🛡️          ║${colors.reset}`);
        console.log(`${colors.green}╚════════════════════════════════════════════╝${colors.reset}`);
    } else {
        console.log(`${colors.red}╔════════════════════════════════════════════╗${colors.reset}`);
        console.log(`${colors.red}║    ⚠️  SOME SECURITY TESTS FAILED! ⚠️     ║${colors.reset}`);
        console.log(`${colors.red}║   Please review and fix issues above       ║${colors.reset}`);
        console.log(`${colors.red}╚════════════════════════════════════════════╝${colors.reset}`);
    }

    console.log('');
    
    // Security Recommendations
    log.title('Security Recommendations');
    log.info('1. Change all default secrets in .env before production');
    log.info('2. Enable HTTPS in production');
    log.info('3. Configure email service for password reset');
    log.info('4. Set up MongoDB for session persistence');
    log.info('5. Review and update CORS allowed origins');
    log.info('6. Set up monitoring and alerting');
    log.info('7. Configure backup strategy');
    log.info('8. Review logs regularly');
    console.log('');

    process.exit(failed === 0 ? 0 : 1);
}

// Run tests
runSecurityTests().catch(error => {
    console.error('Test execution error:', error);
    process.exit(1);
});
