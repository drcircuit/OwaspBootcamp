# A04: Cryptographic Failures - Instructor Writeup

**Lab URL:** http://localhost:3004  
**Topic:** OWASP Top 10 2025 - A04: Cryptographic Failures  
**Difficulty:** Easy → Medium → Hard  
**Theme:** PowerFit Gym

---

## Overview

This lab teaches cryptographic failures using a fitness center theme. The challenges demonstrate weak encryption, exposed secrets, and insecure key management that stem from poor cryptographic practices.

### Learning Objectives
- Identify weak cryptographic implementations
- Understand secure key storage and rotation
- Learn about strong encryption algorithms
- Recognize plaintext storage of sensitive data

---

## Challenge Summary

| Lab | Vulnerability | Endpoint | Flag |
|-----|---------------|----------|------|
| Example Part 1 | System Enumeration | `/api/example/systems/103` | `FLAG{ST0R3_SYST3M_3NUM3R4T3D}` |
| Example Part 2 | Diagnostic Access | `/api/example/diagnostic` | `FLAG{D14GN0ST1C_4CC3SS3D}` |
| Example Part 3 | Auth Check | `/api/example/auth-check` | `FLAG{4UTH_SYST3M_CH3CK3D}` |
| Lab 1 | Debug Endpoint | `GET /api/staff/system-info` | `FLAG{D3BUG_1NF0_3XP0S3D}` |
| Lab 2 | Weak Crypto Keys | `GET /api/settings/config` | `FLAG{C0NF1G_L34K3D}` |
| Lab 3 | Default Credentials | `POST /api/manager/login` (admin:beanscene) | `FLAG{D3F4ULT_CR3DS_US3D}` |

---

## LAB 1: Staff Dashboard - Weak Hashing Discovery

**Difficulty:** Easy  
**Stage:** Recon

### Exploitation
```bash
curl http://localhost:3004/api/staff/system-info
```

### Key Exposed Data
- Node.js version and platform
- Memory usage statistics
- Database host information
- Debug mode status

### Cryptographic Context
System information helps attackers identify vulnerable crypto libraries and outdated versions with known weaknesses.

### Teaching Points
- Version disclosure aids reconnaissance for crypto vulnerabilities
- Outdated crypto libraries are common attack vectors
- Regular updates essential for crypto security

---

## LAB 2: Store Settings - Weak Keys & Secrets

**Difficulty:** Medium  
**Stage:** Scanning

### Exploitation
```bash
curl http://localhost:3004/api/settings/config
```

### Critical Cryptographic Failures
```json
{
  "database": {
    "password": "Bean$cene2024!"  // Weak, predictable password
  },
  "jwtSecret": "beanscene_jwt_secret_key",  // Short, guessable secret
  "sessionSecret": "gym-shop-session-2024",  // Predictable pattern
  "paymentGateway": {
    "apiKey": "sq0atp-BeanScene_Live_Token_xyz789"  // Exposed in clear text
  },
  "encryption": {
    "algorithm": "DES",  // Weak encryption algorithm
    "key": "gym12345"    // Short key, insufficient entropy
  }
}
```

### Cryptographic Issues Identified

1. **Weak Password:** Predictable pattern, insufficient entropy
2. **Short JWT Secret:** Can be brute-forced
3. **Weak Algorithm:** DES is deprecated (use AES-256-GCM)
4. **Insufficient Key Length:** 8 characters vs. 32+ bytes required
5. **No Key Rotation:** Static keys never changed
6. **Plaintext Storage:** Secrets stored without encryption

### Secure Implementation
```javascript
const crypto = require('crypto');

// 1. Generate strong secrets
const jwtSecret = crypto.randomBytes(64).toString('hex');
const sessionSecret = crypto.randomBytes(64).toString('hex');

// 2. Use strong encryption
const algorithm = 'aes-256-gcm';
const key = crypto.randomBytes(32);  // 256 bits
const iv = crypto.randomBytes(16);   // 128-bit IV

// 3. Store in secret manager, not config files
const secrets = await secretsManager.getSecret('app/production/secrets');

// 4. Rotate regularly
if (secrets.age_days > 90) {
    await rotateSecrets();
}
```

### Teaching Points
- Use cryptographically secure random number generators
- Minimum 256-bit keys for symmetric encryption
- AES-256-GCM is current standard
- Store secrets in dedicated secret managers
- Implement regular key rotation
- Never hardcode encryption keys

---

## LAB 3: Manager Portal - Password Storage Failure

**Difficulty:** Hard  
**Stage:** Initial Access

### Exploitation
```bash
curl -X POST http://localhost:3004/api/manager/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "beanscene"}'
```

### Cryptographic Failure
Default credentials represent multiple crypto failures:
1. **No Password Hashing:** Stored in plaintext or weak hash
2. **Weak Password Policy:** Simple, guessable password allowed
3. **No Salting:** Even if hashed, likely no unique salt per user
4. **No Key Derivation Function:** Should use bcrypt/Argon2

### Vulnerable Code
```javascript
// BAD: Plaintext password comparison
const DEFAULT_ADMIN = {
    username: 'admin',
    password: 'beanscene'  // Plaintext!
};

if (password === DEFAULT_ADMIN.password) {
    // Grant access
}
```

### Secure Implementation
```javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12;

// Registration: Hash password with bcrypt
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    
    // 1. Enforce password policy
    if (password.length < 12) {
        return res.status(400).json({ error: 'Password must be 12+ characters' });
    }
    
    // 2. Hash with bcrypt (includes salt automatically)
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    
    // 3. Store hash, never plaintext
    await db.query(
        'INSERT INTO users (username, password_hash) VALUES ($1, $2)',
        [username, passwordHash]
    );
});

// Login: Compare with bcrypt
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    const user = await db.query(
        'SELECT password_hash FROM users WHERE username = $1',
        [username]
    );
    
    // bcrypt.compare automatically handles salt
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Success
});
```

### Modern Alternatives to bcrypt
- **Argon2:** Winner of Password Hashing Competition
- **scrypt:** Memory-hard function
- **PBKDF2:** Older but still acceptable with high iterations

```javascript
const argon2 = require('argon2');

// Hashing
const hash = await argon2.hash(password);

// Verification
const isValid = await argon2.verify(hash, password);
```

---

## Cryptographic Best Practices

### Key Generation
```javascript
// Symmetric keys
const aesKey = crypto.randomBytes(32);  // 256 bits

// Asymmetric keys (RSA)
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});
```

### Secure Encryption
```javascript
function encrypt(plaintext, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
    };
}

function decrypt(encrypted, key, iv, authTag) {
    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        key,
        Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
}
```

### Secure Hashing
```javascript
// For passwords: Use bcrypt or Argon2
const bcrypt = require('bcrypt');
const passwordHash = await bcrypt.hash(password, 12);

// For data integrity: Use SHA-256 or better
const hash = crypto.createHash('sha256').update(data).digest('hex');

// For HMACs: Use HMAC-SHA256
const hmac = crypto.createHmac('sha256', secretKey).update(data).digest('hex');
```

---

## Common Student Questions

**Q: Why is AES-256 better than DES?**  
A: DES uses 56-bit keys (breakable in hours). AES-256 uses 256-bit keys (would take billions of years with current technology).

**Q: What's the difference between encryption and hashing?**  
A: Encryption is reversible (decrypt to get original). Hashing is one-way (cannot reverse). Use encryption for data, hashing for passwords.

**Q: Why use bcrypt instead of SHA-256 for passwords?**  
A: SHA-256 is too fast—attackers can try billions of passwords per second. bcrypt is intentionally slow and memory-hard, making brute force attacks impractical.

**Q: How long should encryption keys be?**  
A: Symmetric: 256 bits minimum (AES-256). Asymmetric: 2048 bits minimum (4096 recommended for RSA).

---

## Remediation Checklist

- [ ] Use AES-256-GCM for symmetric encryption
- [ ] RSA 4096 or ECC P-256 for asymmetric encryption
- [ ] bcrypt (12+ rounds) or Argon2 for password hashing
- [ ] SHA-256+ for data integrity checks
- [ ] 256-bit keys from crypto.randomBytes()
- [ ] Store secrets in vault/secret manager
- [ ] Implement key rotation (90-day maximum)
- [ ] TLS 1.3 for data in transit
- [ ] Never hardcode keys in source code
- [ ] Encrypt sensitive data at rest
- [ ] Use authenticated encryption (GCM mode)

---

## Additional Resources
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [NIST Guidelines on Cryptography](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)
- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)
