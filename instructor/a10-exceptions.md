# A10: Server-Side Request Forgery (SSRF) - Mishandling of Exceptional Conditions - Instructor Writeup

**Lab URL:** http://localhost:3010  
**Topic:** OWASP Top 10 2025 - A10: Server-Side Request Forgery  
**Subtopic:** Mishandling of Exceptional Conditions / Exception Handling  
**Difficulty:** Easy → Medium → Hard  
**Theme:** Art Gallery HARVEST Museum 🎨

---

## Overview

This lab demonstrates security vulnerabilities caused by improper exception handling in a community center class registration system. Students learn how verbose error messages, exposed stack traces, and improperly handled exceptions can leak sensitive system information and undermine security monitoring.

### Learning Objectives
- Understand how error messages can leak sensitive information
- Identify stack trace exposure vulnerabilities
- Recognize problems with overly generic error handling
- Learn proper exception handling and error disclosure practices
- Understand the balance between helpful errors and security

---

## Challenge Summary

| Lab | Vulnerability | Solution | Flag |
|-----|---------------|----------|------|
| Lab 1 | Verbose Error Messages | Query non-existent class ID (e.g., 999) | `HARVEST{V3RB0S3_3RR0RS}` |
| Lab 2 | Stack Trace Exposure | Submit invalid registration (class ID 999) | `HARVEST{ST4CK_TR4C3_L34K}` |
| Lab 3 | Silent Failure (Authorization Masked) | Access member config endpoint | `HARVEST{S1L3NT_F41LUR3}` |

---

## LAB 1: Class Search - Verbose Error Messages

**Difficulty:** Easy  
**Stage:** Information Disclosure

### Vulnerability
Error messages expose internal database structure, collection names, available IDs, and system implementation details. This information helps attackers understand the system architecture and enumerate valid resources.

### Exploitation
```bash
# Request a non-existent class to trigger verbose error
curl -X GET http://localhost:3010/api/class/999

# Try other invalid IDs to see consistent verbose errors
curl -X GET http://localhost:3010/api/class/9999

# Even malformed IDs trigger helpful debugging info
curl -X GET http://localhost:3010/api/class/abc
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Class not found in database.classes collection",
  "details": {
    "queriedId": 999,
    "availableIds": [1, 2, 3, 4],
    "databaseType": "In-memory object store",
    "collectionName": "classes",
    "totalRecords": 4
  },
  "flag": "HARVEST{V3RB0S3_3RR0RS}",
  "vulnerability": "Error message reveals internal database structure and implementation details",
  "impact": "Attackers learn about data organization and can enumerate valid IDs",
  "secureAlternative": "Return generic 'Class not found' without exposing system details"
}
```

### Vulnerable Code
```javascript
app.get('/api/class/:id', (req, res) => {
    const classId = parseInt(req.params.id);
    
    try {
        const classInfo = database.classes.find(c => c.id === classId);
        
        if (!classInfo) {
            // VULNERABLE: Verbose error reveals database structure
            return res.status(404).json({
                success: false,
                error: 'Class not found in database.classes collection',
                details: {
                    queriedId: classId,
                    availableIds: database.classes.map(c => c.id),
                    databaseType: 'In-memory object store',
                    collectionName: 'classes',
                    totalRecords: database.classes.length
                }
            });
        }
        
        res.json({
            success: true,
            class: classInfo
        });
    } catch (err) {
        // Even more verbose error
        res.status(500).json({
            success: false,
            error: err.message,
            stack: err.stack
        });
    }
});
```

### Secure Implementation
```javascript
const logger = require('winston');

// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

app.get('/api/class/:id', (req, res) => {
    const classId = parseInt(req.params.id);
    
    try {
        // Validate input
        if (isNaN(classId) || classId <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid class ID'
            });
        }
        
        const classInfo = database.classes.find(c => c.id === classId);
        
        if (!classInfo) {
            // SECURE: Generic error message to client
            logger.warn('Class not found', {
                classId,
                ip: req.ip,
                timestamp: new Date().toISOString()
            });
            
            return res.status(404).json({
                success: false,
                error: 'Class not found'
            });
        }
        
        res.json({
            success: true,
            class: classInfo
        });
    } catch (err) {
        // SECURE: Log detailed error server-side
        logger.error('Error fetching class', {
            classId,
            error: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString(),
            userId: req.user?.id,
            ip: req.ip
        });
        
        // Return generic error to client
        res.status(500).json({
            success: false,
            error: 'An error occurred while retrieving class information'
        });
    }
});
```

### Teaching Points

**What Information Was Leaked?**
1. **Database structure** - "database.classes collection"
2. **Technology stack** - "In-memory object store"
3. **Valid ID enumeration** - All existing class IDs exposed
4. **Collection naming** - Internal schema conventions revealed
5. **Record counts** - Database size information

**Why This Matters:**
- Attackers can enumerate all valid resource IDs
- Technology stack info helps target known vulnerabilities
- Database structure aids SQL injection attempts
- Information reduces attacker's reconnaissance time

**Best Practices:**
- Return generic user-friendly messages to clients
- Log detailed errors server-side for debugging
- Use error tracking services (Sentry, Rollbar)
- Different messages for different error types (400 vs 404 vs 500)
- Never expose internal paths, queries, or stack traces

### Common Student Questions

**Q: "How do I debug if errors are generic?"**
**A:** Use server-side logging with unique error IDs. When a user reports an error, they can provide the error ID, which you use to find the detailed logs.

```javascript
const errorId = crypto.randomUUID();
logger.error('Class fetch failed', { errorId, classId, error: err.stack });
res.status(500).json({ error: 'An error occurred', errorId });
```

**Q: "Isn't showing all valid IDs helpful for the API?"**
**A:** No. Use proper API documentation (OpenAPI/Swagger) to describe endpoints. Error messages should not be used as documentation. Exposing valid IDs helps attackers enumerate resources.

---

## LAB 2: Registration System - Stack Trace Exposure

**Difficulty:** Medium  
**Stage:** Information Disclosure

### Vulnerability
Full stack traces, framework versions, file paths, and internal error codes are exposed to clients. This provides attackers with a detailed map of the application's internal structure and technology stack.

### Exploitation
```bash
# Submit registration for non-existent class to trigger stack trace
curl -X POST http://localhost:3010/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 1,
    "classId": 999,
    "sessionDate": "2024-02-15"
  }'

# Try other invalid data to see what errors expose
curl -X POST http://localhost:3010/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": 999,
    "classId": 1,
    "sessionDate": "invalid-date"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Class ID 999 does not exist in classes table",
  "errorCode": "CLASS_NOT_FOUND",
  "stackTrace": "Error: Class ID 999 does not exist in classes table\n    at /app/src/server.js:606:25\n    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)\n    ...",
  "internalError": {
    "file": "/app/src/registration/RegistrationService.js",
    "line": 156,
    "query": "SELECT * FROM classes WHERE id = 999"
  },
  "framework": "Express.js v4.18.2",
  "nodeVersion": "v18.17.0",
  "flag": "HARVEST{ST4CK_TR4C3_L34K}",
  "vulnerability": "Full stack traces and internal paths exposed in error responses",
  "impact": "Reveals framework versions, file structure, and code organization",
  "secureAlternative": "Log detailed errors server-side, return generic message to client"
}
```

### Vulnerable Code
```javascript
app.post('/api/register', (req, res) => {
    const { memberId, classId, sessionDate } = req.body;
    
    try {
        const classInfo = database.classes.find(c => c.id === classId);
        
        if (!classInfo) {
            // VULNERABLE: Throw error that will expose stack trace
            const error = new Error(`Class ID ${classId} does not exist in classes table`);
            error.code = 'CLASS_NOT_FOUND';
            error.query = `SELECT * FROM classes WHERE id = ${classId}`;
            error.file = '/app/src/registration/RegistrationService.js';
            error.line = 156;
            throw error;
        }
        
        database.registrations.push({
            memberId,
            classId,
            sessionDate,
            registeredAt: new Date().toISOString()
        });
        
        res.json({
            success: true,
            message: 'Registration successful',
            registration: { memberId, classId, sessionDate }
        });
    } catch (err) {
        // VULNERABLE: Expose full stack trace and internal details
        res.status(500).json({
            success: false,
            error: err.message,
            errorCode: err.code,
            stackTrace: err.stack,
            internalError: {
                file: err.file || 'Unknown',
                line: err.line || 'Unknown',
                query: err.query || 'N/A'
            },
            framework: 'Express.js v4.18.2',
            nodeVersion: process.version
        });
    }
});
```

### Secure Implementation
```javascript
const logger = require('winston');
const { v4: uuidv4 } = require('uuid');

// Define custom error classes for better error handling
class ApplicationError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}

class ValidationError extends ApplicationError {
    constructor(message) {
        super(message, 400);
    }
}

class NotFoundError extends ApplicationError {
    constructor(resource) {
        super(`${resource} not found`, 404);
    }
}

// Centralized error handler middleware
function errorHandler(err, req, res, next) {
    // Generate unique error ID for tracking
    const errorId = uuidv4();
    
    // Log full error details server-side
    logger.error('Request error', {
        errorId,
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode || 500,
        path: req.path,
        method: req.method,
        body: req.body,
        userId: req.user?.id,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString()
    });
    
    // Determine if error is operational (expected) or programming error
    if (err.isOperational) {
        // Send user-friendly message for operational errors
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
            errorId
        });
    }
    
    // For programming errors, send generic message
    res.status(500).json({
        success: false,
        error: 'An unexpected error occurred',
        errorId,
        message: 'Please contact support if the problem persists'
    });
}

app.post('/api/register', async (req, res, next) => {
    try {
        const { memberId, classId, sessionDate } = req.body;
        
        // Validate input
        if (!memberId || !classId || !sessionDate) {
            throw new ValidationError('Missing required fields');
        }
        
        // Validate class exists
        const classInfo = database.classes.find(c => c.id === classId);
        if (!classInfo) {
            throw new NotFoundError('Class');
        }
        
        // Validate member exists
        const member = database.members.find(m => m.id === memberId);
        if (!member) {
            throw new NotFoundError('Member');
        }
        
        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(sessionDate)) {
            throw new ValidationError('Invalid date format. Use YYYY-MM-DD');
        }
        
        // Check capacity
        if (classInfo.enrolled >= classInfo.capacity) {
            throw new ValidationError('Class is full');
        }
        
        // Process registration
        database.registrations.push({
            memberId,
            classId,
            sessionDate,
            registeredAt: new Date().toISOString()
        });
        
        // Update enrollment count
        classInfo.enrolled++;
        
        res.json({
            success: true,
            message: 'Registration successful',
            registration: { memberId, classId, sessionDate }
        });
    } catch (err) {
        // Pass to error handler middleware
        next(err);
    }
});

// Register error handler (must be after all routes)
app.use(errorHandler);
```

### Advanced Error Handling Patterns

**Environment-Aware Error Responses:**
```javascript
function errorHandler(err, req, res, next) {
    const errorId = uuidv4();
    
    // Log error
    logger.error('Request error', {
        errorId,
        message: err.message,
        stack: err.stack,
        // ... other details
    });
    
    // Development vs Production responses
    const response = {
        success: false,
        errorId
    };
    
    if (process.env.NODE_ENV === 'development') {
        // More details in development for debugging
        response.error = err.message;
        response.stack = err.stack;
    } else {
        // Generic messages in production
        if (err.isOperational) {
            response.error = err.message;
        } else {
            response.error = 'An unexpected error occurred';
        }
    }
    
    res.status(err.statusCode || 500).json(response);
}
```

**Sanitize Database Errors:**
```javascript
function sanitizeDatabaseError(err) {
    // Don't expose database-specific errors
    if (err.code === '23505') {  // PostgreSQL unique violation
        return new ValidationError('This record already exists');
    }
    
    if (err.code === '23503') {  // Foreign key violation
        return new ValidationError('Referenced record not found');
    }
    
    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return new ValidationError('Referenced record not found');
    }
    
    // Generic database error
    return new ApplicationError('Database operation failed', 500);
}

app.post('/api/register', async (req, res, next) => {
    try {
        // ... registration logic
        await database.registrations.create(data);
    } catch (err) {
        // Sanitize database errors before passing to handler
        next(sanitizeDatabaseError(err));
    }
});
```

### Teaching Points

**What Information Was Leaked?**
1. **Framework version** - "Express.js v4.18.2" (can target known CVEs)
2. **Node.js version** - Helps identify platform vulnerabilities
3. **File paths** - "/app/src/registration/RegistrationService.js"
4. **Code structure** - Stack trace shows call hierarchy
5. **SQL queries** - Exposes database schema and query patterns
6. **Line numbers** - Makes code review easier for attackers

**Why This Matters:**
- Framework versions may have known vulnerabilities
- File paths reveal project structure
- Stack traces show code flow and dependencies
- Query strings expose database schema
- Attackers can craft targeted exploits

**Best Practices:**
1. **Never expose stack traces** to clients in production
2. **Use structured logging** (JSON format for parsing)
3. **Centralize error handling** with middleware
4. **Generate error IDs** for correlation between logs and user reports
5. **Sanitize database errors** before sending to clients
6. **Distinguish error types** (validation, not found, auth, server)
7. **Use error monitoring** services for aggregation and alerting

### Common Student Questions

**Q: "How do I show validation errors without exposing sensitive info?"**
**A:** Validation errors are safe to show as long as they don't reveal business logic or sensitive constraints:
```javascript
// SAFE
"Email format is invalid"
"Password must be at least 12 characters"

// UNSAFE
"Username 'admin' already exists" (reveals valid usernames)
"Age must match database constraint CHECK (age >= 21)" (reveals schema)
```

**Q: "What's the difference between operational and programmer errors?"**
**A:** 
- **Operational errors** are expected: validation failures, not found, network timeout
- **Programmer errors** are bugs: null pointer, undefined variable, syntax error

Handle operational errors gracefully with user-friendly messages. Programmer errors should crash in development but be caught and logged in production.

---

## LAB 3: Member Portal - Silent Failure (Authorization Masking)

**Difficulty:** Hard  
**Stage:** Authorization Bypass

### Vulnerability
Authorization failures are masked as generic 500 errors instead of proper 403 responses. This prevents security monitoring systems from detecting unauthorized access attempts and can inadvertently leak information through overly generic error handling.

### Exploitation
```bash
# Attempt to access member configuration (requires admin authorization)
curl -X GET http://localhost:3010/api/member/config

# The generic 500 error hides that this is actually an authorization failure
# Security monitoring cannot distinguish this from a real server error
```

**Expected Response:**
```json
{
  "success": false,
  "message": "An error occurred while processing your request",
  "errorCode": "INTERNAL_ERROR",
  "flag": "HARVEST{S1L3NT_F41LUR3}",
  "vulnerability": "Authorization failure masked as generic server error",
  "impact": "Security monitoring cannot detect unauthorized access attempts",
  "actualIssue": "This should return 403 Forbidden, not 500 Internal Server Error",
  "secureAlternative": "Use proper HTTP status codes: 403 for authorization failures, distinct from 500 server errors"
}
```

### Vulnerable Code
```javascript
app.get('/api/member/config', (req, res) => {
    // Simulated authorization check
    const isAuthorized = false;
    
    if (!isAuthorized) {
        // VULNERABLE: Return 500 instead of 403, hiding security violation
        return res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request',
            errorCode: 'INTERNAL_ERROR'
        });
    }
    
    // This would be the actual config if authorized
    res.json({
        success: true,
        config: database.config
    });
});
```

### Secure Implementation
```javascript
const logger = require('winston');

// Authentication middleware
function requireAuth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        // Log authentication attempt
        logger.warn('Unauthenticated request', {
            path: req.path,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
        
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }
    
    try {
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (err) {
        logger.warn('Invalid authentication token', {
            path: req.path,
            ip: req.ip
        });
        
        return res.status(401).json({
            success: false,
            error: 'Invalid authentication token'
        });
    }
}

// Authorization middleware
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        
        if (!allowedRoles.includes(req.user.role)) {
            // SECURE: Log authorization failure
            logger.warn('Authorization failure', {
                userId: req.user.id,
                username: req.user.username,
                requiredRoles: allowedRoles,
                userRole: req.user.role,
                path: req.path,
                method: req.method,
                ip: req.ip,
                timestamp: new Date().toISOString()
            });
            
            // SECURE: Return proper 403 status
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }
        
        next();
    };
}

// Protected endpoint with proper authorization
app.get('/api/member/config', 
    requireAuth,
    requireRole('admin', 'manager'),
    (req, res, next) => {
        try {
            // Log successful access
            logger.info('Config accessed', {
                userId: req.user.id,
                username: req.user.username,
                role: req.user.role
            });
            
            res.json({
                success: true,
                config: {
                    // Only expose non-sensitive config
                    facilities: database.facilities,
                    availableClasses: database.classes.length
                }
            });
        } catch (err) {
            next(err);  // Pass to error handler
        }
    }
);
```

### HTTP Status Code Best Practices

**Proper Status Codes for Security:**
```javascript
// 401 Unauthorized - Authentication required or failed
app.get('/api/protected', (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            error: 'Authentication required'
        });
    }
});

// 403 Forbidden - Authenticated but not authorized
app.get('/api/admin', (req, res) => {
    if (req.user.role !== 'admin') {
        logger.warn('Authorization denied', { userId: req.user.id, path: req.path });
        return res.status(403).json({
            error: 'Access denied'
        });
    }
});

// 404 Not Found - Resource doesn't exist (or user shouldn't know it exists)
app.get('/api/resource/:id', (req, res) => {
    const resource = findResource(req.params.id);
    
    // For sensitive resources, use 404 even if unauthorized
    // This prevents information disclosure about resource existence
    if (!resource || !canAccess(req.user, resource)) {
        return res.status(404).json({
            error: 'Resource not found'
        });
    }
});

// 429 Too Many Requests - Rate limiting triggered
app.use('/api/login', rateLimiter, (req, res) => {
    // Rate limiter middleware would return 429 if exceeded
});

// 500 Internal Server Error - Actual server errors
app.get('/api/data', (req, res) => {
    try {
        const data = processData();
        res.json({ data });
    } catch (err) {
        logger.error('Server error', { error: err });
        res.status(500).json({
            error: 'An unexpected error occurred'
        });
    }
});
```

### Security Monitoring and Alerting

**Implement Security Event Logging:**
```javascript
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

// Configure security event logging
const securityLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        // Log to file
        new winston.transports.File({ 
            filename: 'security-events.log',
            level: 'warn'
        }),
        // Send to centralized logging (ELK stack)
        new ElasticsearchTransport({
            level: 'warn',
            clientOpts: { node: process.env.ELASTICSEARCH_URL },
            index: 'security-events'
        })
    ]
});

// Log security events
function logSecurityEvent(eventType, details) {
    securityLogger.warn('Security event', {
        eventType,
        ...details,
        timestamp: new Date().toISOString()
    });
}

// Authorization failures
app.get('/api/admin', requireAuth, (req, res) => {
    if (req.user.role !== 'admin') {
        logSecurityEvent('AUTHORIZATION_FAILURE', {
            userId: req.user.id,
            username: req.user.username,
            attemptedResource: req.path,
            requiredRole: 'admin',
            userRole: req.user.role,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
        
        return res.status(403).json({ error: 'Access denied' });
    }
    // ... handle request
});

// Failed login attempts
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    const user = await authenticateUser(username, password);
    
    if (!user) {
        logSecurityEvent('LOGIN_FAILURE', {
            username,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
        
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // ... successful login
});

// Suspicious patterns (e.g., multiple auth failures from same IP)
function detectSuspiciousActivity() {
    // Check for multiple failures from same IP
    const recentFailures = getRecentSecurityEvents('LOGIN_FAILURE', '5m');
    const ipCounts = {};
    
    recentFailures.forEach(event => {
        ipCounts[event.ip] = (ipCounts[event.ip] || 0) + 1;
    });
    
    Object.entries(ipCounts).forEach(([ip, count]) => {
        if (count >= 5) {
            logSecurityEvent('SUSPICIOUS_ACTIVITY', {
                type: 'BRUTE_FORCE_ATTEMPT',
                ip,
                failureCount: count,
                timeWindow: '5 minutes'
            });
            
            // Implement IP blocking or rate limiting
            blockIP(ip, '1 hour');
        }
    });
}
```

### Teaching Points

**The Problem with Silent Failures:**

1. **Security Monitoring Blind Spots:**
   - SIEM systems can't distinguish auth failures from server errors
   - Alert fatigue from too many 500 errors
   - Inability to detect brute force or enumeration attacks

2. **Compliance Issues:**
   - PCI-DSS requires logging of access control failures
   - GDPR requires logging of unauthorized access attempts
   - SOC 2 requires monitoring of security events

3. **Incident Response:**
   - Can't identify attack patterns
   - Delayed detection of breaches
   - Incomplete forensic data

**Why Proper Status Codes Matter:**

| Status | Meaning | Security Monitoring |
|--------|---------|-------------------|
| 401 | Authentication required | Track credential failures, brute force |
| 403 | Authorization denied | Track privilege escalation attempts |
| 404 | Not found | Track enumeration attempts |
| 429 | Rate limited | Track automated attack tools |
| 500 | Server error | Track actual system failures |

**Best Practices:**

1. **Use correct HTTP status codes** for their intended purpose
2. **Log all security-relevant events** (auth failures, authz failures, suspicious activity)
3. **Distinguish between error types** in monitoring systems
4. **Alert on patterns** (multiple 403s from same user, IP)
5. **Balance security and usability** (don't expose too much or too little)
6. **Use structured logging** for easy parsing and aggregation
7. **Implement rate limiting** on authentication endpoints
8. **Send alerts** for suspicious patterns (SIEM integration)

### Common Student Questions

**Q: "Why is 404 sometimes better than 403 for security?"**
**A:** For sensitive resources, returning 404 instead of 403 prevents information disclosure:
- **403**: "This resource exists, but you can't access it" (confirms existence)
- **404**: "Resource not found" (doesn't confirm existence)

Use 404 when you don't want to reveal that a resource exists. Use 403 when access control is the primary concern and you want to log authorization attempts.

**Q: "Won't logging every 401/403 create too many logs?"**
**A:** Yes, but that's valuable security data! Implement:
- Log aggregation and analysis tools
- Alert only on patterns (5+ failures in 10 min)
- Different log levels (INFO for single failure, WARN for patterns)
- Log retention policies (keep security logs for 90+ days)

---

## Error Handling Strategy Matrix

### Client-Facing Error Messages

| Error Type | Status Code | Client Message | Server Logs |
|------------|-------------|----------------|-------------|
| Validation error | 400 | Specific field errors | Input data, validation rules |
| Authentication missing | 401 | "Authentication required" | IP, user agent, attempted resource |
| Authentication invalid | 401 | "Invalid credentials" | Username (not password), IP, failed attempts count |
| Authorization failed | 403 | "Access denied" | User ID, role, attempted resource, required permissions |
| Resource not found | 404 | "Resource not found" | Requested resource ID, user context |
| Rate limit exceeded | 429 | "Too many requests" | IP, user ID, rate limit rules, time window |
| Server error | 500 | "An unexpected error occurred" | Full error details, stack trace, request context |

### Development vs Production

**Development Environment:**
```javascript
if (process.env.NODE_ENV === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.statusCode || 500).json({
            error: err.message,
            stack: err.stack,
            details: err.details,
            request: {
                method: req.method,
                path: req.path,
                body: req.body,
                headers: req.headers
            }
        });
    });
}
```

**Production Environment:**
```javascript
if (process.env.NODE_ENV === 'production') {
    app.use((err, req, res, next) => {
        // Log full details server-side
        logger.error('Request error', {
            errorId: req.errorId,
            error: err.message,
            stack: err.stack,
            // ... all details
        });
        
        // Send minimal info to client
        res.status(err.statusCode || 500).json({
            error: err.isOperational ? err.message : 'An unexpected error occurred',
            errorId: req.errorId
        });
    });
}
```

---

## Real-World Examples

### Case Study 1: Stack Overflow (2013)
- **Issue:** Error messages exposed database connection strings
- **Impact:** Database credentials visible to users
- **Fix:** Implemented proper error sanitization

### Case Study 2: Ruby on Rails Applications
- **Issue:** Development mode errors in production
- **Impact:** Full stack traces with source code exposed
- **Fix:** Proper environment configuration and error pages

### Case Study 3: ASP.NET Applications
- **Issue:** Yellow Screen of Death (YSOD) in production
- **Impact:** Detailed error messages with file paths and stack traces
- **Fix:** Custom error pages and proper error handling configuration

---

## Remediation Checklist

- [ ] Never expose stack traces in production
- [ ] Use proper HTTP status codes (401, 403, 404, 500)
- [ ] Log detailed errors server-side only
- [ ] Implement centralized error handling
- [ ] Generate unique error IDs for tracking
- [ ] Sanitize database errors before sending to clients
- [ ] Use error monitoring service (Sentry, Rollbar)
- [ ] Log all security events (auth/authz failures)
- [ ] Implement rate limiting on sensitive endpoints
- [ ] Set up alerts for suspicious patterns
- [ ] Use different error messages for dev vs prod
- [ ] Include error IDs in client responses
- [ ] Monitor error rates and patterns
- [ ] Implement circuit breakers for external dependencies

---

## Lab Validation Commands

```bash
# Lab 1: Verbose Errors
curl -s http://localhost:3010/api/class/999 | jq .

# Lab 2: Stack Traces
curl -s -X POST http://localhost:3010/api/register \
  -H "Content-Type: application/json" \
  -d '{"memberId":1,"classId":999,"sessionDate":"2024-02-15"}' | jq .

# Lab 3: Silent Failures
curl -s http://localhost:3010/api/member/config | jq .
```

---

## Additional Resources

- [OWASP Error Handling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [Node.js Error Handling Best Practices](https://nodejs.org/en/docs/guides/error-handling/)
- [Express.js Error Handling](https://expressjs.com/en/guide/error-handling.html)
- [HTTP Status Code Definitions (RFC 7231)](https://tools.ietf.org/html/rfc7231#section-6)
- [Sentry Error Monitoring](https://sentry.io/)
