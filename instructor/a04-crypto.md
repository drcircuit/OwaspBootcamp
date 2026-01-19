# A04: Cryptographic Failures - Instructor Writeup

**Lab URL:** http://localhost:3004  
**Topic:** OWASP Top 10 2025 - A04: Cryptographic Failures  
**Difficulty:** Easy → Medium → Hard  
**Theme:** PowerFit Gym

---

## Overview

This lab teaches cryptographic failures using a fitness center theme. The challenges demonstrate encoding vs encryption, weak hashing algorithms, and hardcoded encryption keys.

### Learning Objectives
- Understand difference between encoding and encryption
- Identify weak cryptographic algorithms (MD5, SHA1)
- Recognize hardcoded keys and secrets in source code
- Learn proper cryptographic practices

---

## Challenge Summary

| Lab | Vulnerability | Endpoint | Flag |
|-----|---------------|----------|------|
| Lab 1 | Base64 Encoding (Not Encryption) | `GET /api/member/token` | `FLAG{B4S364_N0T_3NCRYPT10N}` |
| Lab 2 | MD5 Password Hashing | `GET /api/users/export` | `FLAG{W34K_H4SH1NG_MD5_CR4CK3D}` |
| Lab 3 | Hardcoded Encryption Keys | `GET /api/secure/config` | `FLAG{H4RDC0D3D_3NCRYPT10N_K3YS}` |

---

## LAB 1: Member Portal - Base64 Encoding Confusion

**Difficulty:** Easy  
**Stage:** Recon

### Vulnerability
Application uses Base64 encoding for "encryption" of sensitive member data. Base64 is encoding, not encryption - it's trivially reversible.

### Exploitation
```bash
# Get the "encrypted" token
curl "http://localhost:3004/api/member/token?id=12345"

# Response includes base64 token
# Decode it:
echo "eyJpZCI6IjEyMzQ1IiwidXNlcm5hbWUiOiJqb2huX2RvZSIsImVtYWlsIjoiam9obkBwb3dlcmZpdC5neW0iLCJtZW1iZXJzaGlwIjoiUHJlbWl1bSIsImNyZWRpdENhcmQiOiI0NTMyLTEyMzQtNTY3OC05MDEyIiwic3NuIjoiMTIzLTQ1LTY3ODkiLCJmbGFnIjoiRkxBR3tCNFMzNjRfTjBUXzNOQ1JZUFRJME59In0=" | base64 -d
```

### Decoded Data
```json
{
  "id": "12345",
  "username": "john_doe",
  "email": "john@powerfit.gym",
  "membership": "Premium",
  "creditCard": "4532-1234-5678-9012",
  "ssn": "123-45-6789",
  "flag": "FLAG{B4S364_N0T_3NCRYPT10N}"
}
```

### Critical Issues
- **Not Encryption:** Base64 is encoding, anyone can decode
- **Sensitive Data:** Credit cards, SSN exposed
- **False Security:** Looks secure but provides zero protection
- **Common Mistake:** Developers confuse encoding with encryption

### Vulnerable Code
```javascript
// WRONG: This is encoding, not encryption!
const memberData = { /* sensitive data */ };
const token = Buffer.from(JSON.stringify(memberData)).toString('base64');
```

### Secure Implementation
```javascript
const crypto = require('crypto');

// Proper encryption with AES-256-GCM
function encryptData(data, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
    };
}

// Key should be from environment/secret manager
const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const token = encryptData(memberData, encryptionKey);
```

### Teaching Points
- Base64 is encoding (reversible), NOT encryption
- Use proper encryption algorithms (AES-256-GCM)
- Never expose sensitive data even if "encoded"
- Different from misconfiguration - this is crypto misunderstanding

---

## LAB 2: User Export - Weak Password Hashing (MD5)

**Difficulty:** Medium  
**Stage:** Scanning

### Vulnerability
Application uses MD5 for password hashing. MD5 is cryptographically broken and unsuitable for passwords - hashes can be cracked in seconds using rainbow tables or hashcat.

### Exploitation
```bash
# Get user export with MD5 hashes
curl http://localhost:3004/api/users/export
```

### Response Data
```json
{
  "users": [
    {
      "id": 1,
      "username": "trainer_mike",
      "password_hash": "4a7d1ed414474e4033ac29ccb8653d9b",  // fitness123
      "role": "trainer"
    },
    {
      "id": 2,
      "username": "admin",
      "password_hash": "8d3533d75ae2c3966d7e0d4fcc69216b",  // powerfit2024
      "role": "admin"
    },
    {
      "id": 3,
      "username": "reception",
      "password_hash": "40be4e59b9a2a2b5dffb918c0e86b3d7",  // welcome
      "role": "staff"
    }
  ],
  "flag": "FLAG{W34K_H4SH1NG_MD5_CR4CK3D}"
}
```

### Cracking MD5 Hashes

**Method 1: Online Rainbow Tables**
```bash
# Visit crackstation.net or md5decrypt.net
# Paste hash: 4a7d1ed414474e4033ac29ccb8653d9b
# Result: fitness123
```

**Method 2: Hashcat (Local)**
```bash
# Save hashes to file
echo "4a7d1ed414474e4033ac29ccb8653d9b" > hashes.txt

# Crack with wordlist
hashcat -m 0 -a 0 hashes.txt rockyou.txt

# Or brute force
hashcat -m 0 -a 3 hashes.txt ?a?a?a?a?a?a?a?a
```

**Method 3: John the Ripper**
```bash
john --format=Raw-MD5 hashes.txt
```

### Why MD5 is Broken
1. **Speed:** Billions of hashes/second on GPU
2. **Rainbow Tables:** Pre-computed hash databases
3. **No Salt:** Same password = same hash
4. **Collision Attacks:** Can generate matching hashes
5. **Deprecated:** Not suitable since 1996

### Vulnerable Code
```javascript
const crypto = require('crypto');

// WRONG: MD5 for passwords
function hashPassword(password) {
    return crypto.createHash('md5')
        .update(password)
        .digest('hex');
}
```

### Secure Implementation
```javascript
const bcrypt = require('bcrypt');
// or
const argon2 = require('argon2');

// Option 1: bcrypt (industry standard)
async function hashPassword(password) {
    const saltRounds = 12;  // Cost factor
    return await bcrypt.hash(password, saltRounds);
}

async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

// Option 2: Argon2 (recommended by OWASP)
async function hashPasswordArgon2(password) {
    return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,  // 64 MB
        timeCost: 3,        // Iterations
        parallelism: 4      // Threads
    });
}

async function verifyPasswordArgon2(hash, password) {
    return await argon2.verify(hash, password);
}
```

### Teaching Points
- MD5/SHA1 are broken for passwords
- Use bcrypt, Argon2, or PBKDF2
- Always use salt (bcrypt/Argon2 do this automatically)
- Higher cost = slower = more secure
- Different from encoding - this is weak cryptography
- Real passwords crack in seconds with MD5
- Use cryptographically secure random number generators
- Minimum 256-bit keys for symmetric encryption
- AES-256-GCM is current standard
- Store secrets in dedicated secret managers
- Implement regular key rotation
- Never hardcode encryption keys

---

## LAB 3: Secure Config - Hardcoded Encryption Keys

**Difficulty:** Hard  
**Stage:** Initial Access

### Vulnerability
Encryption keys hardcoded directly in source code. This completely negates encryption - anyone with source access can decrypt all data.

### Exploitation
```bash
curl http://localhost:3004/api/secure/config
```

### Response Data
```json
{
  "flag": "FLAG{H4RDC0D3D_3NCRYPT10N_K3YS}",
  "encryption_keys": {
    "encryption_key": "powerfit_secret_key_2024",
    "iv": "1234567890123456",
    "jwt_secret": "gym_jwt_secret_key_hardcoded",
    "api_key": "PF-API-KEY-12345678-HARDCODED"
  },
  "encrypted_sample": "3f2a8b9c1d...",
  "message": "Keys in source code = no security!"
}
```

### Decrypting the Data
```javascript
const crypto = require('crypto');

// Keys from source code (exposed!)
const key = Buffer.from('powerfit_secret_key_2024').slice(0, 32);
const iv = Buffer.from('1234567890123456');

// Decrypt
const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');

console.log(decrypted);  // 'admin:SuperSecret123!'
```

### Critical Issues

1. **Source Code Exposure:** Keys visible in code
2. **Version Control:** Keys in Git history forever
3. **Shared Secrets:** Same keys across environments
4. **No Rotation:** Static keys never change
5. **False Security:** Encryption useless if keys are public

### Real-World Examples

**GitHub Secrets Exposed:**
- AWS keys in public repos → $50k+ bills
- API keys → data breaches
- Database credentials → full compromise

**Mobile Apps:**
- APK decompilation reveals hardcoded keys
- iOS apps reverse-engineered for API keys
- React Native bundle analysis

**Configuration Files:**
- Keys in config.json committed to Git
- .env files accidentally pushed
- Docker images with embedded secrets

### Vulnerable Code
```javascript
// CRITICAL VULNERABILITY: Hardcoded keys
const ENCRYPTION_KEY = 'powerfit_secret_key_2024';  // In source!
const JWT_SECRET = 'gym_jwt_secret_key_hardcoded';  // In source!
const API_KEY = 'PF-API-KEY-12345678-HARDCODED';    // In source!

function encryptData(data) {
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(ENCRYPTION_KEY).slice(0, 32),
        Buffer.from('1234567890123456')
    );
    return cipher.update(data, 'utf8', 'hex') + cipher.final('hex');
}
```

### Secure Implementation

**Option 1: Environment Variables**
```javascript
// Load from environment
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const JWT_SECRET = process.env.JWT_SECRET;

// Keys not in source code!
```

**Option 2: Secret Management (Best)**
```javascript
// AWS Secrets Manager
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

async function getEncryptionKey() {
    const secret = await secretsManager.getSecretValue({
        SecretId: 'prod/powerfit/encryption-key'
    }).promise();
    
    return Buffer.from(JSON.parse(secret.SecretString).key, 'hex');
}

// Or HashiCorp Vault
const vault = require('node-vault')({
    endpoint: process.env.VAULT_ADDR,
    token: process.env.VAULT_TOKEN
});

async function getSecret(path) {
    const result = await vault.read(`secret/data/${path}`);
    return result.data.data;
}
```

**Option 3: Key Derivation**
```javascript
const crypto = require('crypto');

// Derive key from password (for user data)
function deriveKey(password, salt) {
    return crypto.pbkdf2Sync(
        password,
        salt,
        100000,  // Iterations
        32,      // Key length (256 bits)
        'sha256'
    );
}
```

### Prevention Checklist

- [ ] Never commit secrets to version control
- [ ] Use .gitignore for .env files
- [ ] Scan repos with tools (truffleHog, git-secrets)
- [ ] Rotate keys if accidentally exposed
- [ ] Use secret management services (AWS, Vault)
- [ ] Different keys per environment (dev/staging/prod)
- [ ] Implement key rotation policies
- [ ] Use CI/CD secret injection
- [ ] Monitor for exposed secrets (GitHub alerts)

### Tools for Detection
```bash
# Scan Git history for secrets
trufflehog --regex --entropy=False https://github.com/user/repo

# Prevent commits with secrets
git-secrets --install
git-secrets --register-aws

# GitHub Secret Scanning (automatic)
# Detects common secret patterns in public repos
```

### Teaching Points
- Hardcoded keys = no encryption security
- Source code access = full compromise
- Use environment variables or secret managers
- Different from weak algorithms - this is key management failure
- Keys in Git history are permanent
- Real-world: GitHub has leaked billions in losses from exposed keys

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
