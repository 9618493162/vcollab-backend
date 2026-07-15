# 🔒 VCollab Backend - Security Documentation

**Version:** 1.0.0  
**Last Updated:** January 2025  
**Security Level:** Production-Ready 🛡️

---

## 📋 Table of Contents

1. [Security Overview](#security-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Data Protection](#data-protection)
4. [Network Security](#network-security)
5. [Input Validation](#input-validation)
6. [Logging & Monitoring](#logging--monitoring)
7. [Deployment Security](#deployment-security)
8. [Security Best Practices](#security-best-practices)
9. [Incident Response](#incident-response)

---

## 🛡️ Security Overview

### Implemented Security Features:

✅ **Authentication**
- JWT with access/refresh tokens
- Bcrypt password hashing (10 rounds)
- Token rotation on refresh
- Session management with MongoDB store

✅ **Authorization**
- Role-based access control (user/admin)
- Protected routes with middleware
- Audit trail for sensitive operations

✅ **Data Protection**
- Input sanitization (XSS prevention)
- NoSQL injection protection
- SQL injection prevention
- Path traversal prevention

✅ **Network Security**
- Helmet.js security headers
- CORS with origin validation
- Rate limiting (5 levels)
- DDoS protection

✅ **Monitoring**
- Winston logging (rotating files)
- Security event logging
- Audit trail
- Suspicious activity detection

---

## 🔐 Authentication & Authorization

### JWT Token System

**Access Tokens:**
- Expiry: 15 minutes
- Payload: `{ id: userId }`
- Algorithm: HS256
- Stored: Client-side (memory/local storage)

**Refresh Tokens:**
- Expiry: 7 days
- Stored: Database + Client
- Rotation: New token on each refresh
- Revocation: Old token invalidated

**Implementation:**
```javascript
// Login generates both tokens
POST /api/auth/login
Response: { accessToken, refreshToken, user }

// Refresh when access token expires
POST /api/auth/refresh-token
Body: { refreshToken }
Response: { accessToken, refreshToken }

// Logout revokes refresh token
POST /api/auth/logout
Body: { refreshToken }
```

### Password Security

**Hashing:**
- Algorithm: bcrypt
- Rounds: 10 (2^10 = 1024 iterations)
- Salt: Automatically generated per password

**Password Policy:**
- Minimum length: 6 characters
- Must contain at least one number
- Configurable in `src/config/security.js`

**Password Reset Flow:**
1. User requests reset: `POST /api/auth/forgot-password`
2. Server generates secure token (32 bytes, SHA-256 hashed)
3. Email sent with reset link
4. Token expires in 1 hour
5. User resets: `POST /api/auth/reset-password`
6. Token marked as used

### Session Management

**Features:**
- MongoDB session store (persistent)
- HTTP-only cookies (XSS protection)
- Secure flag in production (HTTPS only)
- SameSite: strict (CSRF protection)
- Session timeout: 24 hours
- Activity tracking (IP, user agent)
- Session hijacking detection

**Configuration:**
```javascript
// .env
SESSION_SECRET=your-secret-key
COOKIE_DOMAIN=localhost
STRICT_SESSION_SECURITY=true
```

### Brute Force Protection

**Login Attempts:**
- Max attempts: 5 per 15 minutes
- Tracked by: email + IP address
- Lockout: 15 minutes
- Auto-cleanup: Hourly

**Triggered on:**
- `/api/auth/login`
- `/api/auth/register`
- `/api/auth/reset-password`

---

## 🔐 Data Protection

### Input Sanitization

**XSS Prevention:**
- Remove `<script>` tags
- Remove event handlers (`onclick`, `onerror`, etc.)
- Remove `javascript:` protocol
- Remove data URIs (`data:text/html`)

**Implementation:**
```javascript
// Applied to all requests
app.use(sanitizeInput);

// Sanitizes: req.body, req.query, req.params
```

### NoSQL Injection Prevention

**MongoDB Sanitization:**
- Replace special characters: `$`, `.`
- Remove operators: `$where`, `$ne`, `$gt`, etc.
- Validate ObjectId format

**Implementation:**
```javascript
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize({ replaceWith: '_' }));
```

### HTTP Parameter Pollution (HPP)

**Protection:**
- Prevent array parameter attacks
- Whitelist safe parameters
- Remove duplicate parameters

**Whitelisted Parameters:**
```javascript
['page', 'limit', 'sort', 'fields', 'search', 'status', 'type']
```

### Suspicious Activity Detection

**Monitored Patterns:**
- NoSQL injection attempts
- SQL injection attempts
- XSS attempts
- Path traversal attempts
- Null byte injection
- Code execution attempts

**Response:**
- Log security event
- Return 403 Forbidden
- Alert administrators (in production)

---

## 🌐 Network Security

### Helmet.js Security Headers

**Enabled Headers:**
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

**Configuration:**
See `src/middleware/security.js` - `helmetConfig`

### CORS Configuration

**Allowed Origins:**
```javascript
[
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
]
```

**Settings:**
- Credentials: Enabled
- Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Max Age: 24 hours

**Origin Validation:**
- Checks against whitelist
- Blocks unauthorized origins
- Logs blocked attempts

### Rate Limiting

**Five Levels:**

| Type | Limit | Window | Endpoints |
|------|-------|--------|-----------|
| General API | 100 req | 15 min | `/api/*` |
| Authentication | 5 req | 15 min | Login, Register |
| Password Reset | 3 req | 1 hour | Forgot/Reset password |
| File Upload | 20 req | 1 hour | All uploads |
| Meeting Creation | 50 req | 1 hour | Create meeting |

**Response Headers:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642348800
```

**Rate Limit Exceeded:**
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later"
}
```

### DDoS Protection

**Implemented Measures:**
- Rate limiting (all endpoints)
- Request size limits (10MB)
- Timeout limits (30 seconds)
- Connection limits (Socket.IO)
- Slow request detection

**Recommendations:**
- Use Cloudflare or similar CDN
- Configure load balancer
- Enable WAF (Web Application Firewall)

---

## ✅ Input Validation

### Express-Validator

**Validation Rules:**

**Registration:**
```javascript
- fullName: 2-50 characters, trimmed
- email: valid email, normalized
- password: min 6 chars, must contain number
```

**Login:**
```javascript
- email: valid email, required
- password: required
```

**Meeting Creation:**
```javascript
- title: 1-100 characters
- description: max 500 characters
- date: ISO8601 format
- time: HH:MM format
- type: enum ['Public', 'Private']
```

**Validation Error Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### File Upload Validation

**Avatar:**
- Max size: 10MB
- Allowed types: JPEG, PNG, GIF, WebP
- Extension check + MIME type check

**Meeting Files:**
- Max size: 50MB
- Allowed types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, images

**Recordings:**
- Max size: 500MB
- Allowed types: WEBM, MP4, MKV
- Duration tracking

---

## 📊 Logging & Monitoring

### Winston Logging

**Log Levels:**
- `error`: Errors and exceptions
- `warn`: Warning messages
- `info`: General information
- `debug`: Debug information (development only)

**Log Files:**

| Type | File | Retention | Max Size |
|------|------|-----------|----------|
| General | `application-YYYY-MM-DD.log` | 14 days | 20MB |
| Error | `error-YYYY-MM-DD.log` | 30 days | 20MB |
| Security | `security-YYYY-MM-DD.log` | 90 days | 20MB |
| Exceptions | `exceptions-YYYY-MM-DD.log` | 30 days | 20MB |

**Log Format:**
```
2025-01-15 10:30:45 [INFO]: User login successful
2025-01-15 10:31:12 [ERROR]: Database connection failed
```

### Security Event Logging

**Logged Events:**
- User registration
- User login/logout
- Password changes
- Password reset requests
- Profile updates
- Admin actions
- File uploads
- Suspicious activity
- Failed authentication attempts
- Session hijacking attempts

**Log Entry Example:**
```json
{
  "event": "user_login",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "userId": "507f1f77bcf86cd799439011",
  "ip": "192.168.1.100",
  "userAgent": "Mozilla/5.0...",
  "method": "POST",
  "url": "/api/auth/login"
}
```

### Audit Trail

**Critical Operations Tracked:**
- User registration
- User login
- Password change
- Password reset
- Profile update
- Admin actions (user/meeting deletion)
- File uploads
- Meeting recordings

**Audit Log Storage:**
- Development: Console + File
- Production: Database + External service (Sentry, LogRocket)

### HTTP Request Logging

**Morgan Format:**
```
192.168.1.100 POST /api/auth/login 200 45ms - 1234
```

**Includes:**
- IP address
- HTTP method
- URL path
- Status code
- Response time
- Response size

---

## 🚀 Deployment Security

### Production Checklist

**Before Deployment:**

1. ✅ **Change All Secrets**
   ```env
   JWT_SECRET=<random-256-bit-string>
   JWT_REFRESH_SECRET=<random-256-bit-string>
   SESSION_SECRET=<random-256-bit-string>
   ```

2. ✅ **Enable HTTPS**
   - Obtain SSL certificate
   - Configure reverse proxy (Nginx)
   - Redirect HTTP to HTTPS

3. ✅ **Configure Database**
   - Use production MongoDB cluster
   - Enable authentication
   - Configure firewall rules
   - Set up backups

4. ✅ **Set Environment**
   ```env
   NODE_ENV=production
   COOKIE_DOMAIN=yourdomain.com
   FRONTEND_URL=https://yourdomain.com
   ```

5. ✅ **Configure CORS**
   - Update allowed origins
   - Remove development URLs

6. ✅ **Enable Monitoring**
   - Set up error tracking (Sentry)
   - Configure uptime monitoring
   - Set up log aggregation

7. ✅ **Security Hardening**
   - Disable unnecessary endpoints
   - Review rate limits
   - Configure firewall
   - Enable DDoS protection

### Environment Variables

**Production Requirements:**
```env
# Required
NODE_ENV=production
PORT=5003
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-secret>
JWT_REFRESH_SECRET=<strong-secret>
SESSION_SECRET=<strong-secret>

# Email (Required for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-password

# Frontend
FRONTEND_URL=https://yourdomain.com
COOKIE_DOMAIN=yourdomain.com

# Optional
STRICT_SESSION_SECURITY=true
```

### Reverse Proxy Configuration

**Nginx Example:**
```nginx
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker Security

**Dockerfile Best Practices:**
```dockerfile
# Use specific version
FROM node:18-alpine

# Don't run as root
USER node

# Copy only necessary files
COPY --chown=node:node . .

# Use multi-stage builds
# Scan for vulnerabilities
```

---

## 🔧 Security Best Practices

### For Developers

1. **Never Commit Secrets**
   - Use `.env` files (gitignored)
   - Use secret managers in production
   - Rotate secrets regularly

2. **Validate All Input**
   - Server-side validation is mandatory
   - Client-side validation is a bonus
   - Sanitize user input

3. **Use Prepared Statements**
   - Mongoose queries are safe by default
   - Avoid string concatenation in queries

4. **Implement Least Privilege**
   - Users get minimal permissions
   - Admins get elevated permissions
   - Service accounts get specific permissions

5. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm audit fix
   npm update
   ```

6. **Use HTTPS Everywhere**
   - Development: Use ngrok or similar
   - Production: Valid SSL certificate

7. **Implement CSRF Protection**
   - SameSite cookies: strict
   - CSRF tokens for state-changing operations

8. **Secure File Uploads**
   - Validate file types
   - Limit file sizes
   - Scan for malware (production)
   - Store outside web root

### For Administrators

1. **Monitor Logs Regularly**
   - Check security logs daily
   - Set up alerts for suspicious activity
   - Review audit trail

2. **Backup Regularly**
   - Database backups: Daily
   - File uploads: Daily
   - Configuration: Version control

3. **Update Regularly**
   - Security patches: Immediately
   - Dependencies: Monthly
   - OS updates: Weekly

4. **Review Access**
   - User accounts: Quarterly
   - Admin accounts: Monthly
   - API keys: Quarterly

5. **Test Security**
   - Penetration testing: Annually
   - Vulnerability scanning: Monthly
   - Code reviews: Per release

---

## 🚨 Incident Response

### Security Incident Types

**1. Unauthorized Access**
- Symptoms: Failed login attempts, unusual access patterns
- Response: Lock account, force password reset, review logs

**2. Data Breach**
- Symptoms: Unusual data access, data exfiltration
- Response: Isolate system, investigate, notify users, report to authorities

**3. DDoS Attack**
- Symptoms: Slow response, high traffic, service unavailable
- Response: Enable DDoS protection, block IPs, scale resources

**4. Malware/Ransomware**
- Symptoms: File encryption, unusual behavior, ransom demand
- Response: Isolate system, restore from backup, scan all systems

### Incident Response Steps

1. **Detect**
   - Monitor logs and alerts
   - User reports
   - Automated detection

2. **Contain**
   - Isolate affected systems
   - Block malicious IPs
   - Disable compromised accounts

3. **Investigate**
   - Review logs
   - Identify entry point
   - Determine scope

4. **Remediate**
   - Remove malicious code
   - Patch vulnerabilities
   - Restore from backup

5. **Recover**
   - Restore services
   - Verify integrity
   - Monitor for reinfection

6. **Report**
   - Document incident
   - Notify stakeholders
   - Report to authorities (if required)

7. **Learn**
   - Post-mortem analysis
   - Update procedures
   - Implement preventive measures

### Emergency Contacts

```
Security Team: security@yourdomain.com
System Admin: admin@yourdomain.com
On-Call Engineer: +1-XXX-XXX-XXXX
```

### Reporting Security Issues

If you discover a security vulnerability, please email:
**security@yourdomain.com**

Do NOT create public GitHub issues for security vulnerabilities.

---

## 📚 Additional Resources

### Security Tools

- **OWASP ZAP** - Web security scanner
- **nmap** - Network scanner
- **Burp Suite** - Web vulnerability scanner
- **npm audit** - Dependency vulnerability checker

### Security Standards

- **OWASP Top 10** - Web application security risks
- **CWE/SANS Top 25** - Most dangerous software errors
- **PCI DSS** - Payment card industry standard
- **GDPR** - Data protection regulation

### Security Training

- OWASP Testing Guide
- Web Security Academy
- HackTheBox
- TryHackMe

---

## ✅ Security Compliance

### OWASP Top 10 (2021) Coverage

| Risk | Status | Implementation |
|------|--------|----------------|
| A01:2021 – Broken Access Control | ✅ | JWT auth, role-based access, session management |
| A02:2021 – Cryptographic Failures | ✅ | bcrypt hashing, JWT signing, HTTPS enforcement |
| A03:2021 – Injection | ✅ | Input sanitization, NoSQL injection prevention |
| A04:2021 – Insecure Design | ✅ | Security by design, threat modeling |
| A05:2021 – Security Misconfiguration | ✅ | Helmet headers, secure defaults, error handling |
| A06:2021 – Vulnerable Components | ✅ | Dependency scanning, regular updates |
| A07:2021 – Identification and Authentication | ✅ | JWT tokens, brute force protection, MFA ready |
| A08:2021 – Software and Data Integrity | ✅ | Audit logging, checksums, version control |
| A09:2021 – Security Logging & Monitoring | ✅ | Winston logging, security events, audit trail |
| A10:2021 – Server-Side Request Forgery | ✅ | URL validation, whitelist approach |

---

**Security Version:** 1.0.0  
**Last Security Audit:** January 2025  
**Next Audit Due:** July 2025

**Remember:** Security is an ongoing process, not a one-time implementation.
