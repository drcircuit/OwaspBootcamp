# A10: Server-Side Request Forgery (SSRF) - Instructor Writeup

**Lab URL:** http://localhost:3010  
**Topic:** OWASP Top 10 2025 - A10: Mishandling of Exceptional Conditions  
**Difficulty:** Easy → Medium → Hard  
**Theme:** CommunityHub 🏠

---

## Overview

This lab demonstrates error handling vulnerabilities through a community center management system. Students learn about verbose error messages, stack trace leakage, and silent failures that hide security violations.

### Learning Objectives
- Understand information disclosure through errors
- Identify stack trace leakage risks
- Learn about secure error handling
- Implement proper exception management

---

## Challenge Summary

| Lab | Vulnerability | Solution | Flag |
|-----|---------------|----------|------|
| Lab 1 | Verbose Error Messages | Access invalid class ID to trigger error | `COMMUNITY{3RR0R_D1SCL0SUR3}` |
| Lab 2 | Stack Trace Exposure | Submit invalid registration to get stack trace | `COMMUNITY{ST4CK_TR4C3_L34K}` |
| Lab 3 | Silent Security Failures | Access restricted config - generic error hides violation | `COMMUNITY{S1L3NT_F41LUR3}` |

---

## LAB 1: Class Listing - Verbose Error Messages

**Difficulty:** Easy  
**Stage:** Recon

### Vulnerability
Detailed error messages expose internal system information including database schema, validation logic, and framework details.

### Exploitation
```bash
# Request invalid class ID
curl http://localhost:3010/api/class/999

# Request with invalid format
curl http://localhost:3010/api/class/abc
```

### Vulnerable Response
```json
{
  "error": "Database query failed",
  "details": "MongoDB query error: Collection 'classes' does not contain document with _id: 999",
  "database": "MongoDB v5.0.3",
  "collection": "classes",
  "query": "db.classes.findOne({_id: 999})",
  "flag": "COMMUNITY{3RR0R_D1SCL0SUR3}",
  "stack": "at /app/server.js:145:22"
}
```

### Vulnerable Code
```javascript
app.get('/api/class/:id', async (req, res) => {
    const classId = req.params.id;
    
    try {
        const classData = await db.collection('classes').findOne({ _id: parseInt(classId) });
        
        if (!classData) {
            // VULNERABILITY: Exposes database details
            return res.status(404).json({
                error: 'Database query failed',
                details: `MongoDB query error: Collection 'classes' does not contain document with _id: ${classId}`,
                database: 'MongoDB v5.0.3',
                collection: 'classes',
                query: `db.classes.findOne({_id: ${classId}})`,
                flag: 'COMMUNITY{3RR0R_D1SCL0SUR3}'
            });
        }
        
        res.json(classData);
        
    } catch (err) {
        // VULNERABILITY: Exposes error details
        res.status(500).json({
            error: err.message,
            stack: err.stack
        });
    }
});
```

### Secure Implementation
```javascript
const winston = require('winston');

// Configure error logger
const errorLogger = winston.createLogger({
    level: 'error',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log' })
    ]
});

// Error handling middleware
function errorHandler(err, req, res, next) {
    // Generate unique error ID for correlation
    const errorId = crypto.randomBytes(8).toString('hex');
    
    // Log detailed error server-side
    errorLogger.error('Request failed', {
        errorId: errorId,
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        userId: req.session?.userId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });
    
    // Determine error type
    let statusCode = 500;
    let errorType = 'ServerError';
    
    if (err instanceof ValidationError) {
        statusCode = 400;
        errorType = 'ValidationError';
    } else if (err instanceof AuthenticationError) {
        statusCode = 401;
        errorType = 'AuthenticationError';
    } else if (err instanceof AuthorizationError) {
        statusCode = 403;
        errorType = 'AuthorizationError';
    } else if (err instanceof NotFoundError) {
        statusCode = 404;
        errorType = 'NotFoundError';
    }
    
    // Send generic error to client
    res.status(statusCode).json({
        error: errorType,
        message: getGenericErrorMessage(errorType),
        errorId: errorId,  // For support/debugging correlation
        // NO stack trace, NO internal details
    });
}

function getGenericErrorMessage(errorType) {
    const messages = {
        'ValidationError': 'Invalid input provided',
        'AuthenticationError': 'Authentication required',
        'AuthorizationError': 'Access denied',
        'NotFoundError': 'Resource not found',
        'ServerError': 'An error occurred. Please try again later.'
    };
    
    return messages[errorType] || messages['ServerError'];
}

// Apply error handler
app.use(errorHandler);

// Secure route implementation
app.get('/api/class/:id', async (req, res, next) => {
    try {
        const classId = parseInt(req.params.id);
        
        // Input validation
        if (isNaN(classId) || classId < 1) {
            throw new ValidationError('Invalid class ID');
        }
        
        const classData = await db.collection('classes').findOne({ _id: classId });
        
        if (!classData) {
            throw new NotFoundError('Class not found');
        }
        
        res.json(classData);
        
    } catch (err) {
        next(err);  // Pass to error handler
    }
});
```

### Generic Error Messages

**Good (Generic):**
- "Invalid input provided"
- "Resource not found"
- "An error occurred"
- "Authentication required"
- "Access denied"

**Bad (Detailed):**
- "Table 'users' doesn't exist in database"
- "SQL syntax error at line 45"
- "Cannot find module '/app/secrets.js'"
- "Password must be at least 12 characters" (reveals password policy)
- "Username 'admin' not found" (reveals valid usernames)

### Teaching Points
- Generic errors to users, detailed logs server-side
- Use error IDs to correlate logs with user reports
- Never expose stack traces in production
- Don't reveal internal paths, database structure, or framework versions
- Log errors with full context for debugging

---

## LAB 2: Registration - Stack Trace Exposure

**Difficulty:** Medium  
**Stage:** Scanning

### Vulnerability
Unhandled exceptions expose full stack traces revealing application structure, file paths, frameworks, and code logic.

### Exploitation
```bash
# Submit invalid registration
curl -X POST http://localhost:3010/api/register \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid", "age": "abc"}'
```

### Vulnerable Response
```json
{
  "error": "Registration failed",
  "flag": "COMMUNITY{ST4CK_TR4C3_L34K}",
  "stack": "ValidationError: Invalid email format\n    at validateEmail (/app/server.js:234:11)\n    at registerUser (/app/controllers/user.js:56:5)\n    at /app/server.js:189:23\n    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)",
  "system": {
    "node": "v18.17.0",
    "express": "4.18.2",
    "workingDirectory": "/app",
    "framework": "Express"
  }
}
```

### Vulnerable Code
```javascript
app.post('/api/register', async (req, res) => {
    try {
        const { email, age, name } = req.body;
        
        // Validation throws errors
        validateEmail(email);
        validateAge(age);
        
        await db.insertUser({ email, age, name });
        res.json({ success: true });
        
    } catch (err) {
        // VULNERABILITY: Exposes full stack trace and system info
        res.status(400).json({
            error: 'Registration failed',
            flag: 'COMMUNITY{ST4CK_TR4C3_L34K}',
            stack: err.stack,  // Full stack trace!
            system: {
                node: process.version,
                express: require('express/package.json').version,
                workingDirectory: process.cwd(),
                framework: 'Express'
            }
        });
    }
});
```

### Secure Implementation
```javascript
// Custom error classes
class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
        this.statusCode = 400;
    }
}

class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DatabaseError';
        this.statusCode = 500;
    }
}

// Validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email format', 'email');
    }
}

function validateAge(age) {
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
        throw new ValidationError('Age must be between 13 and 120', 'age');
    }
}

// Secure route
app.post('/api/register', async (req, res, next) => {
    try {
        const { email, age, name } = req.body;
        
        // Validate inputs (throws ValidationError)
        validateEmail(email);
        validateAge(age);
        
        if (!name || name.length < 2) {
            throw new ValidationError('Name must be at least 2 characters', 'name');
        }
        
        // Database operation
        try {
            await db.insertUser({ email, age: parseInt(age), name });
        } catch (dbErr) {
            throw new DatabaseError('Registration failed');
        }
        
        res.json({ success: true });
        
    } catch (err) {
        // Pass to error handler middleware
        next(err);
    }
});

// Global error handler (from Lab 1)
app.use((err, req, res, next) => {
    const errorId = crypto.randomBytes(8).toString('hex');
    
    // Detailed server-side logging
    errorLogger.error('Registration error', {
        errorId,
        name: err.name,
        message: err.message,
        stack: err.stack,
        field: err.field,
        body: req.body,
        userId: req.session?.userId,
        ipAddress: req.ip,
        timestamp: new Date().toISOString()
    });
    
    // Generic client-side response
    if (err instanceof ValidationError) {
        res.status(400).json({
            error: 'ValidationError',
            message: err.message,  // Safe to show validation messages
            field: err.field,       // Which field failed
            errorId: errorId
            // NO stack trace
        });
    } else {
        res.status(err.statusCode || 500).json({
            error: 'RegistrationError',
            message: 'Registration failed. Please try again.',
            errorId: errorId
            // NO stack trace, NO system info
        });
    }
});
```

### Production Error Handling

**Environment-Specific Behavior:**
```javascript
// Error handler that adapts to environment
app.use((err, req, res, next) => {
    const errorId = crypto.randomBytes(8).toString('hex');
    
    // Always log server-side
    errorLogger.error('Error', {
        errorId,
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method
    });
    
    // Development: Detailed errors for debugging
    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode || 500).json({
            error: err.name,
            message: err.message,
            stack: err.stack,
            errorId: errorId
        });
    }
    
    // Production: Generic errors only
    res.status(err.statusCode || 500).json({
        error: 'Error',
        message: 'An error occurred. Please contact support with error ID.',
        errorId: errorId
    });
});
```

### Teaching Points
- Stack traces reveal application structure to attackers
- Use custom error classes for better control
- Environment-specific error handling (dev vs prod)
- Always log detailed errors server-side
- Provide error IDs for support correlation

---

## LAB 3: Member Config - Silent Security Failures

**Difficulty:** Hard  
**Stage:** Initial Access

### Vulnerability
Security violations (authentication/authorization failures) are caught and masked with generic errors, hiding attacks from monitoring systems.

### Exploitation
```bash
# Access restricted endpoint without auth
curl http://localhost:3010/api/member/config
```

### Vulnerable Code
```javascript
app.get('/api/member/config', async (req, res) => {
    try {
        // Check authentication
        if (!req.session || !req.session.userId) {
            throw new Error('Unauthorized access attempt');
        }
        
        // Check authorization
        const user = await db.getUser(req.session.userId);
        if (user.role !== 'admin') {
            throw new Error('Insufficient privileges');
        }
        
        const config = await db.getConfig();
        res.json(config);
        
    } catch (err) {
        // VULNERABILITY: Catches security errors and hides them
        // Attacker doesn't know they were blocked, no alert generated
        res.status(500).json({
            error: 'Internal server error',
            flag: 'COMMUNITY{S1L3NT_F41LUR3}',
            message: 'Security violation masked as generic error'
        });
    }
});
```

### Secure Implementation
```javascript
// Custom error classes for security events
class AuthenticationError extends Error {
    constructor(message = 'Authentication required') {
        super(message);
        this.name = 'AuthenticationError';
        this.statusCode = 401;
        this.securityEvent = true;  // Flag for monitoring
    }
}

class AuthorizationError extends Error {
    constructor(message = 'Access denied') {
        super(message);
        this.name = 'AuthorizationError';
        this.statusCode = 403;
        this.securityEvent = true;
    }
}

// Authentication middleware
function requireAuth(req, res, next) {
    if (!req.session || !req.session.userId) {
        return next(new AuthenticationError());
    }
    next();
}

// Authorization middleware
function requireRole(role) {
    return async (req, res, next) => {
        const user = await db.getUser(req.session.userId);
        
        if (user.role !== role) {
            return next(new AuthorizationError());
        }
        
        next();
    };
}

// Secure route
app.get('/api/member/config', 
    requireAuth,
    requireRole('admin'),
    async (req, res, next) => {
        try {
            const config = await db.getConfig();
            res.json(config);
        } catch (err) {
            next(err);
        }
    }
);

// Security-aware error handler
app.use((err, req, res, next) => {
    const errorId = crypto.randomBytes(8).toString('hex');
    
    // Log ALL errors
    errorLogger.error('Request error', {
        errorId,
        name: err.name,
        message: err.message,
        statusCode: err.statusCode,
        url: req.url,
        method: req.method,
        userId: req.session?.userId,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });
    
    // Security events trigger alerts
    if (err.securityEvent) {
        // Log to security monitoring system
        securityLogger.warn('Security violation', {
            errorId,
            type: err.name,
            userId: req.session?.userId,
            ipAddress: req.ip,
            url: req.url,
            timestamp: new Date().toISOString()
        });
        
        // Check for patterns (multiple failures from same IP)
        const recentFailures = await getRecentSecurityFailures(req.ip);
        if (recentFailures.length > 5) {
            await sendSecurityAlert({
                severity: 'HIGH',
                type: 'Multiple security violations',
                ipAddress: req.ip,
                failureCount: recentFailures.length
            });
        }
    }
    
    // Send appropriate response
    res.status(err.statusCode || 500).json({
        error: err.name || 'Error',
        message: err.message,
        errorId: errorId
    });
});
```

### Security Monitoring Integration

```javascript
// Real-time security monitoring
class SecurityMonitor {
    constructor() {
        this.recentEvents = new Map();
    }
    
    recordEvent(ipAddress, eventType) {
        if (!this.recentEvents.has(ipAddress)) {
            this.recentEvents.set(ipAddress, []);
        }
        
        const events = this.recentEvents.get(ipAddress);
        events.push({
            type: eventType,
            timestamp: Date.now()
        });
        
        // Keep only last 10 minutes
        const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
        this.recentEvents.set(
            ipAddress,
            events.filter(e => e.timestamp > tenMinutesAgo)
        );
        
        // Check for suspicious patterns
        this.analyzePattern(ipAddress, events);
    }
    
    analyzePattern(ipAddress, events) {
        // 5+ auth failures in 10 minutes
        const authFailures = events.filter(e => 
            e.type === 'AuthenticationError' || 
            e.type === 'AuthorizationError'
        );
        
        if (authFailures.length >= 5) {
            this.triggerAlert({
                severity: 'HIGH',
                type: 'Brute Force / Unauthorized Access Attempt',
                ipAddress: ipAddress,
                eventCount: authFailures.length,
                timeWindow: '10 minutes'
            });
            
            // Consider IP blocking
            this.blockIP(ipAddress, 3600);  // Block for 1 hour
        }
    }
    
    async triggerAlert(alert) {
        // Send to monitoring system (PagerDuty, Slack, etc.)
        await notificationService.send(alert);
        
        // Log to SIEM
        await siemLogger.alert(alert);
    }
    
    blockIP(ipAddress, duration) {
        // Add to rate limiter or firewall
        rateLimiter.block(ipAddress, duration);
    }
}

const securityMonitor = new SecurityMonitor();

// Integrate with error handler
app.use((err, req, res, next) => {
    // ... logging code ...
    
    if (err.securityEvent) {
        securityMonitor.recordEvent(req.ip, err.name);
    }
    
    // ... response code ...
});
```

### Teaching Points
- Security violations must be logged and monitored
- Don't mask authentication/authorization failures
- Implement pattern detection for attacks
- Alert on suspicious activity
- Use proper HTTP status codes (401, 403)
- Integrate with SIEM systems

---

## Error Handling Best Practices

### HTTP Status Codes

**Use Appropriate Codes:**
- **200 OK:** Successful request
- **400 Bad Request:** Invalid input
- **401 Unauthorized:** Authentication required
- **403 Forbidden:** Authenticated but not authorized
- **404 Not Found:** Resource doesn't exist
- **500 Internal Server Error:** Unexpected server error
- **503 Service Unavailable:** Temporary outage

### Error Response Structure

```javascript
{
    "error": "ErrorType",          // Error category
    "message": "User-friendly message",
    "errorId": "abc123",           // For correlation
    "timestamp": "2025-01-19T10:30:00Z",
    // NO: stack, system info, internal details
}
```

---

## Remediation Checklist

- [ ] Generic error messages in production
- [ ] Detailed errors logged server-side only
- [ ] No stack traces exposed to clients
- [ ] Custom error classes for different error types
- [ ] Proper HTTP status codes
- [ ] Error IDs for log correlation
- [ ] Security events trigger alerts
- [ ] Pattern detection for attacks
- [ ] Environment-specific error handling
- [ ] Integration with monitoring/SIEM systems
- [ ] Regular security log review

---

## Additional Resources
- [OWASP Error Handling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html)
- [HTTP Status Codes](https://httpstatuses.com/)
- [Winston Logger](https://github.com/winstonjs/winston)
