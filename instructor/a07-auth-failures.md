# A07: Identification and Authentication Failures - Instructor Writeup

**Lab URL:** http://localhost:3007  
**Topic:** OWASP Top 10 2025 - A07: Identification and Authentication Failures  
**Difficulty:** Easy → Medium → Hard  
**Theme:** PawSpa Pet Grooming 🐾

---

## Overview

This lab demonstrates authentication vulnerabilities through a pet grooming service. Students learn about weak password policies, predictable session IDs, and session hijacking attacks.

### Learning Objectives
- Understand password policy weaknesses
- Identify predictable session tokens
- Exploit session management vulnerabilities
- Learn secure authentication practices

---

## Challenge Summary

| Lab | Vulnerability | Solution | Flag |
|-----|---------------|----------|------|
| Lab 1 | Weak Password Policy | Register with weak password (< 6 chars) | `PAWSPA{W3AK_PAWSW0RD_P0L1CY}` |
| Lab 2 | Predictable Session IDs | Login multiple times, observe sequential IDs | `PAWSPA{S3SS10N_PR3D1CT4BL3_P3TS}` |
| Lab 3 | Session Hijacking | Use predictable session ID (5001, 5002, 5003) | `PAWSPA{S3SS10N_H1J4CK3D_SP4}` |

---

## LAB 1: Registration - Weak Password Policy

**Difficulty:** Easy  
**Stage:** Recon

### Vulnerability
Password policy accepts extremely weak passwords, making accounts vulnerable to brute force attacks.

### Exploitation
```bash
# Test with very weak passwords
curl -X POST http://localhost:3007/api/lab1/register \
  -H "Content-Type: application/json" \
  -d '{"username": "test", "password": "123"}'

# Even weaker
curl -X POST http://localhost:3007/api/lab1/register \
  -H "Content-Type: application/json" \
  -d '{"username": "test2", "password": "a"}'
```

### Vulnerable Code
```javascript
app.post('/api/lab1/register', (req, res) => {
    const { username, password } = req.body;
    
    // WEAK: Only checks length > 0
    if (password.length > 0) {
        // Flags for various weak passwords
        if (password.length < 6 || 
            /^\d+$/.test(password) ||  // All numeric
            password === 'password' ||
            password === 'abc') {
            
            return res.json({
                success: true,
                flag: 'PAWSPA{W3AK_PAWSW0RD_P0L1CY}',
                message: 'Weak password accepted - policy insufficient'
            });
        }
    }
});
```

### Secure Implementation
```javascript
const validator = require('validator');
const zxcvbn = require('zxcvbn');  // Password strength estimator

app.post('/api/lab1/register', (req, res) => {
    const { username, password, email } = req.body;
    
    // 1. Length requirement
    if (password.length < 12) {
        return res.status(400).json({ 
            error: 'Password must be at least 12 characters' 
        });
    }
    
    // 2. Complexity requirements
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!(hasUppercase && hasLowercase && hasNumbers && hasSpecial)) {
        return res.status(400).json({
            error: 'Password must contain uppercase, lowercase, numbers, and special characters'
        });
    }
    
    // 3. Check against common passwords
    const commonPasswords = ['password', 'Password123!', '12345678', 'qwerty'];
    if (commonPasswords.includes(password)) {
        return res.status(400).json({ 
            error: 'Password is too common' 
        });
    }
    
    // 4. Check against username and email
    if (password.toLowerCase().includes(username.toLowerCase()) ||
        password.toLowerCase().includes(email.split('@')[0].toLowerCase())) {
        return res.status(400).json({ 
            error: 'Password cannot contain username or email' 
        });
    }
    
    // 5. Strength estimation
    const strength = zxcvbn(password);
    if (strength.score < 3) {  // 0-4 scale, require at least 3
        return res.status(400).json({
            error: 'Password is too weak',
            feedback: strength.feedback
        });
    }
    
    // 6. Check against breach database (Have I Been Pwned API)
    const breachCount = await checkBreachedPassword(password);
    if (breachCount > 0) {
        return res.status(400).json({
            error: 'Password has been compromised in a data breach'
        });
    }
    
    // Password is strong - proceed with registration
});
```

### Password Policy Best Practices
- **Minimum 12 characters** (NIST recommends 8, but 12+ is better)
- **Maximum length:** 128+ characters (allow passphrases)
- **Complexity:** Mix of character types (but length more important)
- **No common passwords:** Check against breach databases
- **No personal info:** Username, email, name, etc.
- **Password strength meter:** Show feedback to users

---

## LAB 2: Login - Predictable Session IDs

**Difficulty:** Medium  
**Stage:** Scanning

### Vulnerability
Session IDs are sequential integers (1000, 1001, 1002...), making them easily guessable.

### Exploitation
```bash
# Login multiple times and observe session IDs
curl -X POST http://localhost:3007/api/lab2/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "pass1"}' \
  -c cookies1.txt

curl -X POST http://localhost:3007/api/lab2/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user2", "password": "pass2"}' \
  -c cookies2.txt

curl -X POST http://localhost:3007/api/lab2/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user3", "password": "pass3"}' \
  -c cookies3.txt

# Session IDs are 1001, 1002, 1003 - predictable!
```

### Vulnerable Code
```javascript
let sessionCounter = 1000;

app.post('/api/lab2/login', (req, res) => {
    const { username, password } = req.body;
    
    if (authenticateUser(username, password)) {
        // VULNERABLE: Sequential session ID
        sessionCounter++;
        const sessionId = sessionCounter.toString();
        
        res.cookie('session', sessionId);
        
        if (sessionCounter > 1003) {
            res.json({
                flag: 'PAWSPA{S3SS10N_PR3D1CT4BL3_P3TS}',
                sessionId: sessionId
            });
        }
    }
});
```

### Secure Implementation
```javascript
const crypto = require('crypto');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

// Option 1: Use express-session middleware
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,  // HTTPS only
        httpOnly: true,  // No JavaScript access
        maxAge: 30 * 60 * 1000,  // 30 minutes
        sameSite: 'strict'  // CSRF protection
    },
    genid: (req) => {
        // Cryptographically secure random session ID
        return crypto.randomBytes(32).toString('hex');
    }
}));

// Option 2: Manual secure session generation
function generateSecureSessionId() {
    // 256 bits of entropy
    return crypto.randomBytes(32).toString('hex');
}

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (authenticateUser(username, password)) {
        const sessionId = generateSecureSessionId();
        
        // Store in Redis/database with expiration
        await redis.setex(`session:${sessionId}`, 1800, JSON.stringify({
            userId: user.id,
            username: user.username,
            createdAt: Date.now()
        }));
        
        res.cookie('session', sessionId, {
            secure: true,
            httpOnly: true,
            maxAge: 30 * 60 * 1000,
            sameSite: 'strict'
        });
        
        res.json({ success: true });
    }
});
```

### Session Security Best Practices
- **Cryptographically random:** Use crypto.randomBytes()
- **Sufficient entropy:** At least 128 bits (16 bytes)
- **HTTPOnly flag:** Prevent JavaScript access
- **Secure flag:** HTTPS only
- **SameSite:** CSRF protection
- **Short expiration:** 15-30 minutes for sensitive apps
- **Regenerate on login:** New session ID after authentication
- **Destroy on logout:** Clean up server-side session data

---

## LAB 3: Profile Access - Session Hijacking

**Difficulty:** Hard  
**Stage:** Initial Access

### Vulnerability
Pre-seeded sessions with predictable IDs allow attackers to hijack other users' sessions.

### Exploitation
```bash
# Try predictable session IDs
curl -X GET http://localhost:3007/api/lab3/profile \
  -b "session=5001"  # Alice's session

curl -X GET http://localhost:3007/api/lab3/profile \
  -b "session=5002"  # Bob's session

curl -X GET http://localhost:3007/api/lab3/profile \
  -b "session=5003"  # Charlie's session
```

### Pre-seeded Sessions
```javascript
// VULNERABLE: Hardcoded predictable sessions
const sessions = {
    '5001': { username: 'alice', role: 'customer' },
    '5002': { username: 'bob', role: 'groomer' },
    '5003': { username: 'charlie', role: 'admin' }
};

app.get('/api/lab3/profile', (req, res) => {
    const sessionId = req.cookies.session;
    
    // No validation of session ownership
    if (sessions[sessionId]) {
        res.json({
            flag: 'PAWSPA{S3SS10N_H1J4CK3D_SP4}',
            user: sessions[sessionId]
        });
    }
});
```

### Secure Session Validation
```javascript
app.get('/api/profile', async (req, res) => {
    const sessionId = req.cookies.session;
    
    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // 1. Retrieve session from secure store
    const sessionData = await redis.get(`session:${sessionId}`);
    
    if (!sessionData) {
        // Session expired or invalid
        res.clearCookie('session');
        return res.status(401).json({ error: 'Session expired' });
    }
    
    const session = JSON.parse(sessionData);
    
    // 2. Validate session age
    const sessionAge = Date.now() - session.createdAt;
    if (sessionAge > 30 * 60 * 1000) {  // 30 minutes
        await redis.del(`session:${sessionId}`);
        res.clearCookie('session');
        return res.status(401).json({ error: 'Session expired' });
    }
    
    // 3. IP address validation (optional, be careful with proxies)
    if (session.ipAddress && session.ipAddress !== req.ip) {
        await redis.del(`session:${sessionId}`);
        res.clearCookie('session');
        
        // Alert user of suspicious activity
        await sendSecurityAlert(session.userId, 'Session hijacking attempt');
        
        return res.status(401).json({ error: 'Session invalid' });
    }
    
    // 4. User-Agent validation (optional)
    if (session.userAgent && session.userAgent !== req.get('User-Agent')) {
        // Log but don't necessarily block (UA can change legitimately)
        await logSuspiciousActivity(session.userId, 'User-Agent mismatch');
    }
    
    // 5. Extend session expiration on activity
    await redis.expire(`session:${sessionId}`, 1800);  // 30 minutes
    
    // Return user data
    const user = await db.getUserById(session.userId);
    res.json({ user });
});
```

### Session Security Enhancements

**Multi-Factor Session Tokens:**
```javascript
// Combine multiple values for enhanced security
function createSessionToken(userId, userAgent, ipAddress) {
    const payload = {
        userId,
        userAgent,
        ipAddress,
        timestamp: Date.now(),
        nonce: crypto.randomBytes(16).toString('hex')
    };
    
    // Sign with HMAC
    const message = JSON.stringify(payload);
    const signature = crypto
        .createHmac('sha256', process.env.SESSION_SECRET)
        .update(message)
        .digest('hex');
    
    return `${Buffer.from(message).toString('base64')}.${signature}`;
}

function verifySessionToken(token, userAgent, ipAddress) {
    const [messageB64, signature] = token.split('.');
    const message = Buffer.from(messageB64, 'base64').toString();
    
    // Verify signature
    const expectedSignature = crypto
        .createHmac('sha256', process.env.SESSION_SECRET)
        .update(message)
        .digest('hex');
    
    if (signature !== expectedSignature) {
        return null;  // Tampered
    }
    
    const payload = JSON.parse(message);
    
    // Verify User-Agent and IP
    if (payload.userAgent !== userAgent || payload.ipAddress !== ipAddress) {
        return null;  // Hijacked
    }
    
    // Verify age
    if (Date.now() - payload.timestamp > 30 * 60 * 1000) {
        return null;  // Expired
    }
    
    return payload;
}
```

---

## Multi-Factor Authentication (MFA)

### TOTP Implementation
```javascript
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

// Enable MFA for user
app.post('/api/mfa/enable', async (req, res) => {
    const secret = speakeasy.generateSecret({
        name: `PawSpa (${req.user.email})`
    });
    
    // Store secret in database
    await db.updateUser(req.user.id, {
        mfaSecret: secret.base32,
        mfaEnabled: false  // Not enabled until verified
    });
    
    // Generate QR code for user to scan
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    
    res.json({ qrCode, secret: secret.base32 });
});

// Verify and enable MFA
app.post('/api/mfa/verify', async (req, res) => {
    const { token } = req.body;
    const user = await db.getUser(req.user.id);
    
    const verified = speakeasy.totp.verify({
        secret: user.mfaSecret,
        encoding: 'base32',
        token: token,
        window: 2  // Allow 2 time steps before/after
    });
    
    if (verified) {
        await db.updateUser(req.user.id, { mfaEnabled: true });
        res.json({ success: true });
    } else {
        res.status(400).json({ error: 'Invalid token' });
    }
});

// Login with MFA
app.post('/api/login', async (req, res) => {
    const { username, password, mfaToken } = req.body;
    
    // Step 1: Verify password
    const user = await authenticateUser(username, password);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Step 2: Check if MFA is enabled
    if (user.mfaEnabled) {
        if (!mfaToken) {
            return res.status(403).json({ 
                error: 'MFA required',
                requiresMFA: true 
            });
        }
        
        // Verify MFA token
        const verified = speakeasy.totp.verify({
            secret: user.mfaSecret,
            encoding: 'base32',
            token: mfaToken,
            window: 2
        });
        
        if (!verified) {
            return res.status(401).json({ error: 'Invalid MFA token' });
        }
    }
    
    // Create session
    const sessionId = crypto.randomBytes(32).toString('hex');
    await createSession(sessionId, user.id);
    
    res.json({ success: true });
});
```

---

## Remediation Checklist

- [ ] Password minimum 12 characters
- [ ] Password complexity requirements
- [ ] Check passwords against breach database
- [ ] Cryptographically random session IDs (32+ bytes)
- [ ] Session cookies: httpOnly, secure, sameSite
- [ ] Session expiration (15-30 minutes)
- [ ] Regenerate session ID on login
- [ ] Implement MFA for sensitive accounts
- [ ] Account lockout after failed attempts
- [ ] Password reset with secure tokens
- [ ] Security logging for authentication events

---

## Additional Resources
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [NIST Digital Identity Guidelines](https://pages.nist.gov/800-63-3/)
- [Have I Been Pwned API](https://haveibeenpwned.com/API/v3)
