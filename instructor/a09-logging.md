# A09: Security Logging and Monitoring Failures - Instructor Writeup

**Lab URL:** http://localhost:3009  
**Topic:** OWASP Top 10 2025 - A09: Security Logging and Monitoring Failures  
**Difficulty:** Easy → Medium → Hard  
**Theme:** Art Gallery HARVEST Museum 🎨

---

## Overview

This lab demonstrates security logging vulnerabilities through an art gallery management system. Students learn about missing audit trails, PII exposure in logs, and unauthorized log tampering.

### Learning Objectives
- Understand the importance of audit logging for critical operations
- Identify PII exposure risks in security logs
- Recognize log tampering and deletion vulnerabilities
- Learn secure logging practices and log management

---

## Challenge Summary

| Lab | Vulnerability | Solution | Flag |
|-----|---------------|----------|------|
| Lab 1 | Missing Audit Logs | Delete artwork without audit trail | `HARVEST{N0_4UD1T_TR41L}` |
| Lab 2 | PII in Logs | Request visitor data and observe sensitive data logging | `HARVEST{P11_1N_L0GS}` |
| Lab 3 | Unauthorized Log Clearing | Clear audit logs without authentication | `HARVEST{L0G_T4MP3R1NG}` |

---

## LAB 1: Artwork Management - Missing Audit Trail

**Difficulty:** Easy  
**Stage:** Recon

### Vulnerability
Critical deletion operations are not logged in the audit trail, making it impossible to track who deleted valuable artwork records. This creates insurance claim issues and prevents forensic investigation.

### Exploitation
```bash
# Test artwork deletion without audit logging
curl -X DELETE http://localhost:3009/api/artwork/1234

# Response shows the flag and vulnerability
{
  "success": true,
  "message": "Artwork deleted successfully",
  "deletedArtwork": {...},
  "auditLogged": false,
  "flag": "HARVEST{N0_4UD1T_TR41L}",
  "vulnerability": "Critical deletion operation not logged in audit trail"
}
```

### Vulnerable Code
```javascript
app.delete('/api/artwork/:id', (req, res) => {
    const artworkId = parseInt(req.params.id);
    
    // VULNERABLE: No audit logging for deletion
    const artwork = artworkDatabase.find(art => art.id === artworkId);
    
    if (!artwork) {
        return res.status(404).json({
            success: false,
            message: 'Artwork not found'
        });
    }
    
    // Remove artwork without logging
    const index = artworkDatabase.indexOf(artwork);
    artworkDatabase.splice(index, 1);
    
    // No audit trail created - vulnerability!
    res.json({
        success: true,
        message: 'Artwork deleted',
        deletedArtwork: artwork,
        auditLogged: false  // No record of who deleted what and when
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
        // Write audit logs to separate file
        new winston.transports.File({ 
            filename: 'audit.log',
            level: 'info'
        }),
        // Send to SIEM or centralized logging
        new winston.transports.Http({
            host: 'siem.company.com',
            port: 443,
            ssl: true
        })
    ]
});

// Middleware to extract user context
function getUserContext(req) {
    return {
        userId: req.user?.id || 'anonymous',
        username: req.user?.username || 'unknown',
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        sessionId: req.session?.id
    };
}

app.delete('/api/artwork/:id', async (req, res) => {
    const artworkId = parseInt(req.params.id);
    const userContext = getUserContext(req);
    
    // Find artwork before deletion
    const artwork = artworkDatabase.find(art => art.id === artworkId);
    
    if (!artwork) {
        // Log failed attempt
        auditLogger.warn('Artwork deletion failed - not found', {
            event: 'artwork_deletion_failed',
            artworkId,
            reason: 'not_found',
            ...userContext
        });
        
        return res.status(404).json({
            success: false,
            message: 'Artwork not found'
        });
    }
    
    // SECURE: Log before deletion
    auditLogger.info('Artwork deletion initiated', {
        event: 'artwork_deleted',
        artworkId: artwork.id,
        artworkTitle: artwork.title,
        artworkValue: artwork.price,
        previousState: artwork,
        ...userContext
    });
    
    // Perform deletion
    const index = artworkDatabase.indexOf(artwork);
    artworkDatabase.splice(index, 1);
    
    // Log successful deletion
    auditLogger.info('Artwork deletion completed', {
        event: 'artwork_deletion_success',
        artworkId: artwork.id,
        ...userContext
    });
    
    res.json({
        success: true,
        message: 'Artwork deleted',
        auditLogged: true
    });
});
```

### What Should Be Logged

**Always Log These Events:**
- Authentication attempts (success and failure)
- Authorization failures (access denied)
- Data modifications (create, update, delete)
- Administrative actions
- Security configuration changes
- High-value transactions
- System errors and exceptions

**Each Log Entry Should Include:**
- Timestamp (ISO 8601 format with timezone)
- Event type/action
- User identifier (username, user ID)
- Source IP address
- Result (success/failure)
- Resource affected
- Before/after state (for modifications)

### Common Questions

**Q: Should we log every single request?**  
A: No. Focus on security-relevant events. Don't log routine health checks or static asset requests. Balance between completeness and log volume.

**Q: How long should we retain logs?**  
A: Depends on compliance requirements:
- PCI DSS: 1 year minimum
- HIPAA: 6 years
- SOX: 7 years
- General best practice: 90 days online, 1+ year archive

**Q: What if logging fails?**  
A: Critical operations should fail safely. If audit logging is mandatory, reject the operation if logging fails.

---

## LAB 2: Visitor Tracking - PII Exposure in Logs

**Difficulty:** Medium  
**Stage:** Scanning

### Vulnerability
Visitor access logs contain full Personally Identifiable Information (PII) including Social Security Numbers and credit card numbers. This creates GDPR/CCPA compliance violations and increases breach impact.

### Exploitation
```bash
# Request visitor data - observe sensitive data in logs
curl -X GET http://localhost:3009/api/visitor/9999

# Response shows flag and PII exposure
{
  "success": true,
  "visitor": {
    "id": 9999,
    "name": "Jane Smith",
    "ssn": "123-45-6789",
    "creditCard": "4532-1234-5678-9010",
    ...
  },
  "logEntry": {
    "timestamp": "2024-01-15T10:30:00Z",
    "action": "visitor_access",
    "visitorData": {
      "ssn": "123-45-6789",        // EXPOSED!
      "creditCard": "4532-1234-5678-9010"  // EXPOSED!
    }
  },
  "flag": "HARVEST{P11_1N_L0GS}",
  "vulnerability": "Sensitive PII (SSN, credit card) logged in plaintext"
}
```

### Vulnerable Code
```javascript
app.get('/api/visitor/:id', (req, res) => {
    const visitorId = parseInt(req.params.id);
    
    // Simulated visitor data with PII
    const visitorData = {
        id: visitorId,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        ssn: '123-45-6789',
        creditCard: '4532-1234-5678-9010',
        address: '123 Main St, Anytown, USA',
        visitDate: '2024-01-15'
    };
    
    // VULNERABLE: Log contains full PII including sensitive data
    const logEntry = {
        timestamp: new Date().toISOString(),
        action: 'visitor_access',
        visitorData: visitorData,  // Full object with SSN and CC!
        ipAddress: req.ip
    };
    
    visitorAccess.push(logEntry);
    
    res.json({
        success: true,
        visitor: visitorData
    });
});
```

### Secure Implementation
```javascript
const crypto = require('crypto');

// Redact sensitive fields from objects
function redactSensitiveData(data) {
    const redacted = { ...data };
    
    // Redact specific fields
    const sensitiveFields = ['ssn', 'creditCard', 'password', 'apiKey'];
    sensitiveFields.forEach(field => {
        if (redacted[field]) {
            redacted[field] = '[REDACTED]';
        }
    });
    
    return redacted;
}

// Hash sensitive identifiers for correlation
function hashIdentifier(value, salt = process.env.LOG_SALT) {
    return crypto
        .createHmac('sha256', salt)
        .update(value)
        .digest('hex')
        .substring(0, 16);  // First 16 chars for brevity
}

// Mask credit card numbers
function maskCreditCard(cc) {
    if (!cc) return null;
    // Keep last 4 digits only
    return `****-****-****-${cc.slice(-4)}`;
}

// Mask email addresses
function maskEmail(email) {
    if (!email) return null;
    const [localPart, domain] = email.split('@');
    return `${localPart[0]}***@${domain}`;
}

app.get('/api/visitor/:id', (req, res) => {
    const visitorId = parseInt(req.params.id);
    
    // Retrieve visitor data
    const visitorData = {
        id: visitorId,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        ssn: '123-45-6789',
        creditCard: '4532-1234-5678-9010',
        address: '123 Main St, Anytown, USA',
        visitDate: '2024-01-15'
    };
    
    // SECURE: Create sanitized log entry
    const logEntry = {
        timestamp: new Date().toISOString(),
        action: 'visitor_access',
        visitorId: visitorData.id,  // Use ID instead of full data
        visitorNameHash: hashIdentifier(visitorData.name),
        emailMasked: maskEmail(visitorData.email),
        // DO NOT log SSN or credit card
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
    };
    
    // Log with sanitized data
    auditLogger.info('Visitor data accessed', logEntry);
    
    // Return full data to authorized user (separate from logging)
    res.json({
        success: true,
        visitor: visitorData
    });
});
```

### PII Protection Best Practices

**Never Log:**
- Passwords (even hashed)
- Credit card numbers (full PAN)
- Social Security Numbers / National IDs
- API keys or secrets
- Authentication tokens
- Biometric data
- Health information (HIPAA)

**Log with Caution (Consider Masking):**
- Email addresses (mask: j***@example.com)
- Phone numbers (mask: ***-***-1234)
- IP addresses (may be PII under GDPR)
- Names (consider hashing)
- Physical addresses

**Safe to Log:**
- User IDs (numeric identifiers)
- Session IDs (if cryptographically random)
- Timestamps
- Action types
- Resource IDs
- HTTP status codes
- Error codes (without sensitive details)

### Data Minimization in Logs
```javascript
// Bad: Logging entire request body
logger.info('User registration', { body: req.body });

// Good: Log only what's needed
logger.info('User registration', {
    userId: newUser.id,
    username: req.body.username,
    accountType: req.body.accountType,
    registrationMethod: 'email'
});
```

### Common Questions

**Q: Can we store hashed PII in logs?**  
A: Hashing helps but doesn't eliminate PII concerns. Use salted hashes to prevent rainbow table attacks. Consider if you really need to correlate this data.

**Q: What about debug logs in production?**  
A: Never enable debug logging in production. Debug logs often contain sensitive data. Use different log levels: ERROR, WARN, INFO for production.

**Q: How do we comply with GDPR "right to be forgotten"?**  
A: Store minimal PII in logs. If you must log PII, maintain a mapping table that allows you to identify and purge logs related to a specific user.

---

## LAB 3: Audit System - Unauthorized Log Clearing

**Difficulty:** Hard  
**Stage:** Initial Access

### Vulnerability
Audit logs can be cleared without authentication or authorization, allowing attackers to erase forensic evidence and cover their tracks. This completely undermines security monitoring.

### Exploitation
```bash
# Clear all audit logs without any authentication
curl -X DELETE http://localhost:3009/api/audit-logs

# Response shows the flag and successful clearing
{
  "success": true,
  "message": "Audit logs cleared",
  "logsDeleted": 156,
  "flag": "HARVEST{L0G_T4MP3R1NG}",
  "vulnerability": "Audit logs can be cleared without authentication or authorization",
  "impact": "Attackers can erase forensic evidence and cover their tracks"
}
```

### Vulnerable Code
```javascript
app.delete('/api/audit-logs', (req, res) => {
    // VULNERABLE: No authentication or authorization check
    const logCount = auditLog.length;
    
    // Clear all audit logs without any access control
    auditLog.length = 0;
    
    return res.json({
        success: true,
        message: 'Audit logs cleared',
        logsDeleted: logCount
    });
});
```

### Secure Implementation

**Option 1: Prevent Log Deletion Entirely**
```javascript
// Best practice: Logs should be immutable
// Send logs to external SIEM/logging service
// Never expose log deletion endpoints

const winston = require('winston');
const { Loggly } = require('winston-loggly-bulk');

const auditLogger = winston.createLogger({
    transports: [
        // Local file (append-only)
        new winston.transports.File({
            filename: 'audit.log',
            options: { flags: 'a' }  // Append-only mode
        }),
        // External SIEM (immutable)
        new Loggly({
            token: process.env.LOGGLY_TOKEN,
            subdomain: 'your-domain',
            tags: ['audit'],
            json: true
        })
    ]
});

// No deletion endpoint - logs are immutable
```

**Option 2: Highly Restricted Log Management**
```javascript
const jwt = require('jsonwebtoken');

// Authentication middleware
function requireAuth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// Authorization middleware
function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        // Log unauthorized attempt
        auditLogger.warn('Unauthorized log management attempt', {
            event: 'unauthorized_log_access',
            userId: req.user.id,
            username: req.user.username,
            ipAddress: req.ip,
            requestedAction: 'delete_logs'
        });
        
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

// Log archive endpoint (not deletion)
app.post('/api/audit-logs/archive', requireAuth, requireAdmin, async (req, res) => {
    const { beforeDate } = req.body;
    
    // Validate date
    const archiveDate = new Date(beforeDate);
    if (isNaN(archiveDate.getTime())) {
        return res.status(400).json({ error: 'Invalid date' });
    }
    
    // Must be at least 90 days old
    const minArchiveAge = 90 * 24 * 60 * 60 * 1000;
    if (Date.now() - archiveDate.getTime() < minArchiveAge) {
        return res.status(400).json({ 
            error: 'Logs must be at least 90 days old to archive' 
        });
    }
    
    // LOG THE ARCHIVAL ACTION ITSELF
    auditLogger.info('Log archival initiated', {
        event: 'logs_archived',
        performedBy: req.user.username,
        userId: req.user.id,
        archiveDate: beforeDate,
        ipAddress: req.ip,
        timestamp: new Date().toISOString()
    });
    
    // Move logs to archive storage (don't delete)
    const archivedLogs = auditLog.filter(log => 
        new Date(log.timestamp) < archiveDate
    );
    
    // Store in cold storage / S3 / backup
    await archiveLogsToStorage(archivedLogs, archiveDate);
    
    // Remove from active log (but preserved in archive)
    auditLog = auditLog.filter(log => 
        new Date(log.timestamp) >= archiveDate
    );
    
    res.json({
        success: true,
        message: 'Logs archived successfully',
        archivedCount: archivedLogs.length,
        archivedTo: `logs-${archiveDate.toISOString().split('T')[0]}.archive`
    });
});

// Never allow complete log deletion
// If you must purge logs, require multi-party authorization
app.delete('/api/audit-logs/purge', requireAuth, requireAdmin, async (req, res) => {
    const { confirmationCode, approvalToken } = req.body;
    
    // Require multiple approvals
    if (!confirmationCode || !approvalToken) {
        return res.status(400).json({ 
            error: 'Multi-party approval required' 
        });
    }
    
    // Verify approvals from multiple admins
    const approval = await verifyMultiPartyApproval(
        confirmationCode, 
        approvalToken
    );
    
    if (!approval.valid) {
        auditLogger.warn('Log purge attempt with invalid approval', {
            event: 'log_purge_denied',
            userId: req.user.id,
            ipAddress: req.ip
        });
        return res.status(403).json({ error: 'Invalid approval' });
    }
    
    // LOG THE PURGE ACTION (to external system)
    await logToExternalSIEM({
        event: 'CRITICAL_logs_purged',
        performedBy: req.user.username,
        approvedBy: approval.approvers,
        purgeReason: req.body.reason,
        ipAddress: req.ip,
        timestamp: new Date().toISOString()
    });
    
    // Purge local logs
    const purgedCount = auditLog.length;
    auditLog.length = 0;
    
    res.json({
        success: true,
        message: 'Logs purged',
        purgedCount,
        warning: 'This action has been logged to external SIEM'
    });
});
```

### Log Integrity Protection

**File Integrity Monitoring:**
```javascript
const fs = require('fs');
const crypto = require('crypto');

// Calculate hash of log file
function calculateLogHash(filename) {
    const hash = crypto.createHash('sha256');
    const data = fs.readFileSync(filename);
    hash.update(data);
    return hash.digest('hex');
}

// Store hash in separate location
function storeLogIntegrityHash(filename, hash) {
    const metadata = {
        filename,
        hash,
        timestamp: new Date().toISOString()
    };
    
    // Store in blockchain or write-once storage
    fs.appendFileSync('log-integrity.db', JSON.stringify(metadata) + '\n');
}

// Verify log integrity
function verifyLogIntegrity(filename) {
    const currentHash = calculateLogHash(filename);
    const storedHash = retrieveStoredHash(filename);
    
    if (currentHash !== storedHash) {
        // ALERT: Log tampering detected!
        alertSecurityTeam('Log tampering detected', {
            filename,
            expectedHash: storedHash,
            actualHash: currentHash
        });
        return false;
    }
    
    return true;
}

// Run integrity checks periodically
setInterval(() => {
    if (!verifyLogIntegrity('audit.log')) {
        console.error('LOG TAMPERING DETECTED!');
    }
}, 60000);  // Check every minute
```

**Cryptographic Signing:**
```javascript
// Sign each log entry
function signLogEntry(entry) {
    const message = JSON.stringify(entry);
    const signature = crypto
        .createSign('RSA-SHA256')
        .update(message)
        .sign(privateKey, 'hex');
    
    return {
        ...entry,
        signature
    };
}

// Verify log entry signature
function verifyLogEntry(entry) {
    const { signature, ...data } = entry;
    const message = JSON.stringify(data);
    
    return crypto
        .createVerify('RSA-SHA256')
        .update(message)
        .verify(publicKey, signature, 'hex');
}

// Write signed entry
function writeAuditLog(entry) {
    const signedEntry = signLogEntry(entry);
    auditLogger.info(signedEntry);
}
```

### Immutable Log Storage Solutions

**AWS CloudWatch Logs:**
- Logs cannot be modified after writing
- IAM policies control access
- Retention policies prevent premature deletion

**Azure Monitor:**
- Immutable blob storage for logs
- WORM (Write Once Read Many) support
- Azure AD role-based access

**Splunk / ELK Stack:**
- Centralized logging with access controls
- Index retention policies
- Role-based access to log data

**Blockchain-based Audit Logs:**
```javascript
// Simplified blockchain concept for audit logs
class AuditBlockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }
    
    createGenesisBlock() {
        return {
            index: 0,
            timestamp: Date.now(),
            data: 'Genesis Block',
            previousHash: '0',
            hash: this.calculateHash(0, Date.now(), 'Genesis Block', '0')
        };
    }
    
    calculateHash(index, timestamp, data, previousHash) {
        return crypto
            .createHash('sha256')
            .update(index + timestamp + JSON.stringify(data) + previousHash)
            .digest('hex');
    }
    
    addBlock(data) {
        const lastBlock = this.chain[this.chain.length - 1];
        const newBlock = {
            index: lastBlock.index + 1,
            timestamp: Date.now(),
            data,
            previousHash: lastBlock.hash
        };
        newBlock.hash = this.calculateHash(
            newBlock.index,
            newBlock.timestamp,
            newBlock.data,
            newBlock.previousHash
        );
        
        this.chain.push(newBlock);
        return newBlock;
    }
    
    verifyIntegrity() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            
            // Verify hash
            const calculatedHash = this.calculateHash(
                currentBlock.index,
                currentBlock.timestamp,
                currentBlock.data,
                currentBlock.previousHash
            );
            
            if (currentBlock.hash !== calculatedHash) {
                return false;  // Block tampered
            }
            
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;  // Chain broken
            }
        }
        return true;
    }
}

// Usage
const auditChain = new AuditBlockchain();
auditChain.addBlock({ event: 'user_login', userId: 123 });
auditChain.addBlock({ event: 'artwork_deleted', artworkId: 456 });

// Verify integrity
if (!auditChain.verifyIntegrity()) {
    console.error('AUDIT LOG TAMPERING DETECTED!');
}
```

### Common Questions

**Q: How do we prevent log tampering by root/admin users?**  
A: Use external SIEM or cloud logging services that admins don't control. Implement separation of duties - logging infrastructure managed by separate team.

**Q: What if logs consume too much disk space?**  
A: Implement log rotation with archival to cold storage (S3 Glacier, tape). Never delete recent logs. Compress old logs.

**Q: How do we handle log retention compliance?**  
A: Automate archival based on retention policies. For PCI DSS: 1 year active + 3 months archive. For HIPAA: 6 years. Use lifecycle policies in S3.

**Q: Should we encrypt logs?**  
A: Yes, encrypt logs at rest and in transit. Use KMS or similar key management. But ensure encryption doesn't prevent log analysis.

---

## Real-World Impact

### Case Study 1: Uber Data Breach Cover-Up (2016)
- Attackers stole 57 million user records
- Uber paid hackers $100,000 to delete data and keep quiet
- Failed to log security events properly
- Delayed disclosure for over a year
- **Impact:** $148 million fine, executive prosecuted

### Case Study 2: Equifax Breach (2017)
- 147 million people affected
- Poor logging delayed breach detection by months
- No visibility into what data was accessed
- Inadequate monitoring of database access
- **Impact:** $700 million settlement, CEO resigned

### Case Study 3: Capital One Breach (2019)
- 100 million customers affected
- Attacker used SSRF vulnerability
- Inadequate logging made forensic analysis difficult
- Couldn't determine full extent of access
- **Impact:** $80 million fine

### Teaching Points
- **Detection Time:** Average breach takes 207 days to detect (IBM Cost of Data Breach Report)
- **Cost Multiplier:** Breaches detected in <200 days cost 38% less
- **Forensics:** Without logs, determining breach scope is impossible
- **Compliance:** Inadequate logging violates PCI DSS, HIPAA, SOX, GDPR

---

## Remediation Checklist

### Logging Strategy
- [ ] Log all authentication attempts (success and failure)
- [ ] Log authorization failures
- [ ] Log data modifications (CRUD operations on sensitive data)
- [ ] Log administrative actions
- [ ] Log security configuration changes
- [ ] Include sufficient context (who, what, when, where, result)

### PII Protection
- [ ] Never log passwords
- [ ] Redact credit card numbers (keep last 4 digits max)
- [ ] Redact SSN/national IDs
- [ ] Hash or mask email addresses
- [ ] Avoid logging full PII objects
- [ ] Implement automated PII scanning in logs

### Log Integrity
- [ ] Send logs to external SIEM
- [ ] Implement write-only log storage
- [ ] Use cryptographic signatures
- [ ] Enable file integrity monitoring
- [ ] Restrict log deletion to authorized admins only
- [ ] Log all log management actions

### Monitoring & Alerting
- [ ] Alert on repeated authentication failures
- [ ] Alert on authorization violations
- [ ] Alert on unusual patterns (time, location, volume)
- [ ] Alert on critical operations (bulk deletions, config changes)
- [ ] Implement automated incident response

### Retention & Compliance
- [ ] Define retention policies per compliance requirements
- [ ] Automate log archival
- [ ] Compress archived logs
- [ ] Test log restoration procedures
- [ ] Document log retention policies

---

## Log Analysis & Detection

### Security Events to Monitor

**Authentication Anomalies:**
```javascript
// Pattern: Multiple failed logins
if (failedLogins > 5 within 10 minutes) {
    alert('Possible brute force attack');
}

// Pattern: Login from new location
if (loginLocation !== previousLocations) {
    alert('Login from unusual location');
}

// Pattern: Login outside business hours
if (loginTime is 2am-6am && user.role === 'employee') {
    alert('After-hours access');
}
```

**Data Access Anomalies:**
```javascript
// Pattern: Bulk data export
if (recordsAccessed > 1000 in one session) {
    alert('Possible data exfiltration');
}

// Pattern: Access to sensitive customer
if (customerAccessed is VIP && accessor is not assigned) {
    alert('Unauthorized VIP customer access');
}
```

**Privilege Escalation:**
```javascript
// Pattern: Rapid role changes
if (userRole changed twice in 24 hours) {
    alert('Suspicious privilege changes');
}

// Pattern: Admin action by non-admin
if (action.requiresAdmin && !user.isAdmin) {
    alert('Unauthorized admin action');
}
```

### SIEM Integration Example
```javascript
const SplunkLogger = require('splunk-logging').Logger;

const splunkLogger = new SplunkLogger({
    token: process.env.SPLUNK_TOKEN,
    url: process.env.SPLUNK_URL,
    maxRetries: 3,
    maxBatchCount: 10
});

// Send structured events to Splunk
function logSecurityEvent(event) {
    const payload = {
        message: {
            ...event,
            source: 'artgallery-api',
            sourcetype: 'security-audit',
            event_type: 'security'
        },
        severity: event.severity || 'info'
    };
    
    splunkLogger.send(payload, (err, resp, body) => {
        if (err) {
            console.error('Failed to send to Splunk:', err);
            // Fallback to local logging
            fs.appendFileSync('audit-backup.log', JSON.stringify(event) + '\n');
        }
    });
}
```

---

## Additional Resources

- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [OWASP Security Logging Project](https://owasp.org/www-project-security-logging/)
- [NIST SP 800-92: Guide to Computer Security Log Management](https://csrc.nist.gov/publications/detail/sp/800-92/final)
- [CIS Critical Security Controls - Log Management](https://www.cisecurity.org/controls/audit-log-management)
- [PCI DSS Logging Requirements](https://www.pcisecuritystandards.org/)
- [GDPR Article 32: Security of Processing](https://gdpr-info.eu/art-32-gdpr/)

---

## Teaching Tips

### Lab 1 Teaching Points
- Explain why inventory management needs audit trails
- Discuss insurance claim scenarios
- Compare to cash register receipts in retail
- Ask: "How would you prove you didn't delete something?"

### Lab 2 Teaching Points
- Show real GDPR fines for log exposure
- Discuss logs as "data at rest" under privacy laws
- Compare to leaving customer files on the street
- Exercise: Have students identify PII in sample logs

### Lab 3 Teaching Points
- Explain forensic investigation challenges
- Discuss separation of duties concept
- Show log tampering examples from real breaches
- Ask: "How do you trust logs if admins can delete them?"

### Discussion Questions
1. What's the difference between monitoring and logging?
2. How do you balance security logging with user privacy?
3. When is it acceptable to log user actions?
4. How long should different types of logs be retained?
5. What logs would you need to investigate a data breach?

### Common Student Mistakes
- Logging too much (everything)
- Logging too little (nothing security-relevant)
- Logging PII without sanitization
- Not including enough context in log entries
- Treating logging as an afterthought
- Not testing log analysis during incidents

---

## Secure Logging Quick Reference

```javascript
// ✅ GOOD: Secure audit logging
auditLogger.info('User deleted artwork', {
    event: 'artwork_deleted',
    userId: req.user.id,
    username: req.user.username,
    artworkId: artwork.id,
    artworkTitle: artwork.title,
    artworkValue: artwork.price,
    ipAddress: req.ip,
    timestamp: new Date().toISOString(),
    result: 'success'
});

// ❌ BAD: Missing audit log
artworkDatabase.splice(index, 1);
// No logging!

// ❌ BAD: PII in logs
logger.info('User registered', {
    userData: req.body  // Contains password, SSN, etc.
});

// ✅ GOOD: Sanitized logging
logger.info('User registered', {
    userId: newUser.id,
    username: newUser.username,
    accountType: newUser.accountType
    // No PII
});

// ❌ BAD: Deletable logs
app.delete('/api/logs', (req, res) => {
    logs.length = 0;  // Anyone can delete!
});

// ✅ GOOD: Immutable logs
// No deletion endpoint - logs sent to external SIEM
// Archive only with multi-party approval
```
