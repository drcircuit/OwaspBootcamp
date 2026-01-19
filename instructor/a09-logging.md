# A09: Security Logging and Monitoring Failures - Instructor Writeup

**Lab URL:** http://localhost:3009  
**Topic:** OWASP Top 10 2025 - A09: Security Logging and Monitoring Failures  
**Difficulty:** Easy → Medium → Hard  
**Theme:** ArtSpace Gallery 🎨

---

## Overview

This lab demonstrates logging and monitoring failures through an art gallery management system. Students learn about missing audit logs, PII exposure in logs, and evidence destruction vulnerabilities.

### Learning Objectives
- Understand importance of security logging
- Identify sensitive data leakage in logs
- Learn about audit trail protection
- Implement secure logging practices

---

## Challenge Summary

| Lab | Vulnerability | Solution | Flag |
|-----|---------------|----------|------|
| Lab 1 | Missing Audit Logs | Delete artwork without logging | `ARTSPACE{UN4UD1T3D_1NV3NT0RY}` |
| Lab 2 | PII in Logs | View visitor logs exposing PII | `ARTSPACE{P11_1N_L0G5}` |
| Lab 3 | Log Tampering | Clear audit logs without authorization | `ARTSPACE{N0_4UD1T_TR41L}` |

---

## LAB 1: Gallery Management - Missing Audit Logs

**Difficulty:** Easy  
**Stage:** Recon

### Vulnerability
Critical operations (artwork deletion) have no audit logging, making forensic investigation impossible.

### Exploitation
```bash
# Delete artwork - no logging occurs
curl -X DELETE http://localhost:3009/api/gallery/artwork/1
```

### Vulnerable Code
```javascript
app.delete('/api/gallery/artwork/:id', (req, res) => {
    const artworkId = req.params.id;
    
    // VULNERABILITY: Critical operation with NO logging
    const deleted = artworks.splice(artworkId, 1);
    
    res.json({
        success: true,
        flag: 'ARTSPACE{UN4UD1T3D_1NV3NT0RY}',
        message: 'Artwork deleted with no audit trail'
    });
});
```

### Secure Implementation
```javascript
const winston = require('winston');

// Configure structured logging
const auditLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'audit.log' }),
        new winston.transports.Console()
    ]
});

app.delete('/api/gallery/artwork/:id', async (req, res) => {
    const artworkId = req.params.id;
    const userId = req.session.userId;
    const artwork = await db.getArtwork(artworkId);
    
    if (!artwork) {
        return res.status(404).json({ error: 'Artwork not found' });
    }
    
    // Authorization check
    if (!await canDeleteArtwork(userId, artwork)) {
        // Log failed authorization attempt
        auditLogger.warn('Unauthorized deletion attempt', {
            event: 'artwork_deletion_denied',
            userId: userId,
            artworkId: artworkId,
            ipAddress: req.ip,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
        });
        
        return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Perform deletion
    await db.deleteArtwork(artworkId);
    
    // Audit log successful deletion
    auditLogger.info('Artwork deleted', {
        event: 'artwork_deleted',
        userId: userId,
        username: req.session.username,
        artworkId: artworkId,
        artworkTitle: artwork.title,
        artworkValue: artwork.estimatedValue,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
        beforeState: artwork,  // Store complete before state
        sessionId: req.session.id
    });
    
    res.json({ success: true });
});
```

### Events That Must Be Logged

**Authentication:**
- Login attempts (success/failure)
- Logout events
- Password changes
- MFA setup/changes
- Account lockouts
- Session creation/destruction

**Authorization:**
- Access denied events
- Privilege escalation attempts
- Role changes

**Data Access:**
- Sensitive data access
- Bulk data exports
- Database query failures

**Critical Operations:**
- Create/Update/Delete of important resources
- Configuration changes
- System settings modifications
- User management actions

**Security Events:**
- Failed input validation
- SQL injection attempts
- XSS attempts
- CSRF token mismatches
- Rate limit violations

### Teaching Points
- Log all security-relevant events
- Include context: who, what, when, where, why
- Use structured logging (JSON format)
- Never log sensitive data (passwords, tokens, PII)
- Centralize logs for analysis

---

## LAB 2: Visitor Check-in - PII Exposure in Logs

**Difficulty:** Medium  
**Stage:** Scanning

### Vulnerability
Application logs contain Personally Identifiable Information (PII), creating privacy and compliance violations (GDPR, CCPA).

### Exploitation
```bash
# Check in visitor - PII logged
curl -X POST http://localhost:3009/api/visitor/checkin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "creditCard": "4532-xxxx-xxxx-1234"
  }'

# View logs - PII exposed
curl http://localhost:3009/api/logs/visitors
```

### Vulnerable Code
```javascript
app.post('/api/visitor/checkin', (req, res) => {
    const { name, email, phone, creditCard } = req.body;
    
    // VULNERABILITY: Logging full PII
    console.log('Visitor check-in:', {
        name: name,
        email: email,
        phone: phone,
        creditCard: creditCard,  // NEVER log this!
        timestamp: new Date()
    });
    
    res.json({ success: true });
});

app.get('/api/logs/visitors', (req, res) => {
    // VULNERABILITY: Exposing logs with PII
    const logs = getVisitorLogs();
    res.json({
        flag: 'ARTSPACE{P11_1N_L0G5}',
        logs: logs  // Contains PII
    });
});
```

### Secure Implementation
```javascript
// Data sanitization for logging
function sanitizeForLogging(data) {
    const sanitized = { ...data };
    
    // Remove sensitive fields
    delete sanitized.password;
    delete sanitized.ssn;
    delete sanitized.creditCard;
    delete sanitized.bankAccount;
    
    // Mask email (keep domain for analysis)
    if (sanitized.email) {
        const [local, domain] = sanitized.email.split('@');
        sanitized.email = `${local[0]}***@${domain}`;
    }
    
    // Mask phone
    if (sanitized.phone) {
        sanitized.phone = `***-***-${sanitized.phone.slice(-4)}`;
    }
    
    // Mask name
    if (sanitized.name) {
        const parts = sanitized.name.split(' ');
        sanitized.name = `${parts[0][0]}*** ${parts[1] ? parts[1][0] + '***' : ''}`.trim();
    }
    
    return sanitized;
}

app.post('/api/visitor/checkin', async (req, res) => {
    const visitorData = req.body;
    
    // Store full data in database (encrypted)
    await db.insertVisitor(visitorData);
    
    // Log ONLY non-PII data
    auditLogger.info('Visitor check-in', {
        event: 'visitor_checkin',
        visitorId: generatedId,  // Use ID instead of name
        emailDomain: visitorData.email.split('@')[1],  // Domain only
        timestamp: new Date().toISOString(),
        ipAddress: req.ip,
        // NO personal identifiers
    });
    
    res.json({ success: true, visitorId: generatedId });
});

// Logs endpoint - secured and sanitized
app.get('/api/logs/visitors', async (req, res) => {
    // 1. Authentication required
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // 2. Authorization - admin only
    if (req.session.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    
    // 3. Audit the log access
    auditLogger.info('Audit log accessed', {
        event: 'audit_log_access',
        userId: req.session.userId,
        timestamp: new Date().toISOString()
    });
    
    // 4. Return sanitized logs
    const logs = await db.getAuditLogs();
    const sanitized = logs.map(log => sanitizeForLogging(log));
    
    res.json({ logs: sanitized });
});
```

### Data Classification

**Never Log:**
- Passwords (plaintext or hashed)
- API keys, tokens, secrets
- Credit card numbers
- Social Security Numbers
- Banking information
- Health information (PHI)
- Session tokens
- Encryption keys

**Sanitize Before Logging:**
- Email addresses (mask or use domain only)
- Phone numbers (mask all but last 4)
- Names (use IDs instead)
- IP addresses (may be PII under GDPR)
- User-Agent strings (may contain personal info)

**Safe to Log:**
- User IDs (non-identifying)
- Event types
- Timestamps
- HTTP methods and status codes
- Resource IDs
- Error types (not error details with PII)

### Teaching Points
- PII in logs violates GDPR, CCPA, HIPAA
- Use pseudonymization (IDs instead of names)
- Encrypt logs at rest
- Restrict log access to authorized personnel
- Implement log retention policies

---

## LAB 3: Audit Management - Log Tampering

**Difficulty:** Hard  
**Stage:** Initial Access

### Vulnerability
Logs can be cleared without authorization or audit trail, allowing attackers to cover their tracks.

### Exploitation
```bash
# Clear all logs - no authorization check
curl -X POST http://localhost:3009/api/audit/clear
```

### Vulnerable Code
```javascript
app.post('/api/audit/clear', (req, res) => {
    // VULNERABILITY: No authorization, no audit of log clearing
    logs = [];  // Clear all logs
    
    res.json({
        success: true,
        flag: 'ARTSPACE{N0_4UD1T_TR41L}',
        message: 'Logs cleared with no audit trail'
    });
});
```

### Secure Implementation
```javascript
app.post('/api/audit/clear', async (req, res) => {
    const userId = req.session.userId;
    
    // 1. Authentication required
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // 2. Authorization - superadmin only
    const user = await db.getUser(userId);
    if (user.role !== 'superadmin') {
        // Log unauthorized attempt
        auditLogger.warn('Unauthorized log deletion attempt', {
            event: 'log_deletion_denied',
            userId: userId,
            role: user.role,
            timestamp: new Date().toISOString(),
            ipAddress: req.ip
        });
        
        return res.status(403).json({ error: 'Forbidden' });
    }
    
    // 3. Require MFA for critical operation
    const mfaToken = req.body.mfaToken;
    if (!await verifyMFA(userId, mfaToken)) {
        return res.status(403).json({ error: 'MFA required' });
    }
    
    // 4. Archive logs before clearing (don't actually delete)
    const archivePath = await archiveLogs();
    
    // 5. Audit the log clearing action
    auditLogger.critical('Audit logs archived', {
        event: 'logs_archived',
        userId: userId,
        username: user.username,
        archivePath: archivePath,
        logCount: logs.length,
        timestamp: new Date().toISOString(),
        ipAddress: req.ip,
        mfaVerified: true
    });
    
    // 6. Clear in-memory logs (archived on disk)
    logs = [];
    
    res.json({ success: true, archived: archivePath });
});

// Better: Logs should be write-only with retention policy
async function archiveLogs() {
    const timestamp = Date.now();
    const archivePath = `/var/log/audit/archive-${timestamp}.log.gz`;
    
    // Compress logs
    await compressLogs(logs, archivePath);
    
    // Upload to immutable storage (S3 with object lock, Azure immutable storage)
    await uploadToImmutableStorage(archivePath);
    
    // Cryptographically sign archive
    const signature = signFile(archivePath, PRIVATE_KEY);
    await storeSignature(archivePath, signature);
    
    return archivePath;
}
```

### Log Protection Best Practices

**1. Write-Only Logs:**
```javascript
// Application can only append, not modify or delete
const logStream = fs.createWriteStream('audit.log', { flags: 'a' });

auditLogger.add(new winston.transports.Stream({
    stream: logStream
}));

// Separate process/service manages log rotation
```

**2. Centralized Logging:**
```javascript
// Send logs to centralized system (ELK, Splunk, CloudWatch)
const { WinstonCloudWatch } = require('winston-cloudwatch');

auditLogger.add(new WinstonCloudWatch({
    logGroupName: 'production-audit-logs',
    logStreamName: 'application-server-1',
    awsRegion: 'us-east-1'
}));
```

**3. Log Signing:**
```javascript
const crypto = require('crypto');

function signLogEntry(logEntry, privateKey) {
    const logString = JSON.stringify(logEntry);
    const signature = crypto
        .sign('sha256', Buffer.from(logString), privateKey)
        .toString('base64');
    
    return {
        ...logEntry,
        signature: signature
    };
}

// Verify log chain hasn't been tampered
function verifyLogChain(logs, publicKey) {
    for (const log of logs) {
        const { signature, ...data } = log;
        const logString = JSON.stringify(data);
        
        const isValid = crypto.verify(
            'sha256',
            Buffer.from(logString),
            publicKey,
            Buffer.from(signature, 'base64')
        );
        
        if (!isValid) {
            throw new Error(`Log entry ${log.id} signature invalid - tampering detected`);
        }
    }
    return true;
}
```

**4. Immutable Storage:**
```javascript
// AWS S3 with Object Lock
const s3 = new AWS.S3();

await s3.putObject({
    Bucket: 'audit-logs',
    Key: `logs/${timestamp}.log`,
    Body: logData,
    ObjectLockMode: 'GOVERNANCE',  // Or 'COMPLIANCE'
    ObjectLockRetainUntilDate: new Date(Date.now() + 365*24*60*60*1000)  // 1 year
}).promise();
```

---

## Monitoring and Alerting

### Critical Alerts
```javascript
// Alert on suspicious patterns
function analyzeSecurityEvents(events) {
    // Multiple failed logins
    const failedLogins = events.filter(e => 
        e.event === 'login_failed' && 
        e.timestamp > Date.now() - 5*60*1000  // Last 5 minutes
    );
    
    if (failedLogins.length > 5) {
        sendAlert({
            severity: 'HIGH',
            type: 'Brute Force Attack',
            details: `${failedLogins.length} failed login attempts`,
            userId: failedLogins[0].userId
        });
    }
    
    // Privilege escalation
    const privEsc = events.filter(e => 
        e.event === 'role_changed' && 
        e.newRole === 'admin'
    );
    
    if (privEsc.length > 0) {
        sendAlert({
            severity: 'CRITICAL',
            type: 'Privilege Escalation',
            details: 'User role changed to admin',
            userId: privEsc[0].userId
        });
    }
    
    // Unusual data access
    const dataAccess = events.filter(e => 
        e.event === 'data_export' && 
        e.recordCount > 1000
    );
    
    if (dataAccess.length > 0) {
        sendAlert({
            severity: 'HIGH',
            type: 'Bulk Data Export',
            details: `${dataAccess[0].recordCount} records exported`,
            userId: dataAccess[0].userId
        });
    }
}

// Run analysis every minute
setInterval(() => {
    const recentEvents = getRecentEvents();
    analyzeSecurityEvents(recentEvents);
}, 60000);
```

---

## Remediation Checklist

- [ ] All security events logged (auth, authz, data access)
- [ ] Structured logging format (JSON)
- [ ] No PII in logs (sanitized)
- [ ] No secrets in logs (passwords, tokens, keys)
- [ ] Centralized log management (ELK, Splunk, CloudWatch)
- [ ] Log access restricted to authorized personnel
- [ ] Logs protected from tampering (write-only, signed)
- [ ] Log retention policy implemented
- [ ] Real-time alerting on critical events
- [ ] Regular log review and analysis
- [ ] Incident response plan includes log analysis

---

## Additional Resources
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [NIST SP 800-92: Guide to Computer Security Log Management](https://csrc.nist.gov/publications/detail/sp/800-92/final)
- [CIS Critical Security Controls](https://www.cisecurity.org/controls/)
