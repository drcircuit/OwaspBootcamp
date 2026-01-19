# A02: Security Misconfiguration - Instructor Writeup

**Lab URL:** http://localhost:3002  
**Topic:** OWASP Top 10 2025 - A02: Security Misconfiguration  
**Difficulty:** Easy → Medium → Hard  
**Theme:** BeanScene Coffee Shop

---

## Overview

This lab teaches students about Security Misconfiguration through progressive challenges at a fictional "BeanScene Coffee Shop". Students learn to identify debug endpoints, exposed configurations, and default credentials.

### Learning Objectives
- Identify information disclosure through debug endpoints
- Discover configuration leaks containing sensitive credentials
- Exploit default credentials in production systems
- Understand proper configuration management

---

## EXAMPLE: Getting Started Guide

**URL:** http://localhost:3002/example  
**Purpose:** Educational walkthrough teaching system enumeration and diagnostic access

### Part 1: System Enumeration
**Objective:** Discover all systems through ID enumeration

**Solution:**
```bash
# Test all system IDs
curl http://localhost:3002/api/example/systems/100  # Espresso Machine
curl http://localhost:3002/api/example/systems/101  # Grinder Control
curl http://localhost:3002/api/example/systems/102  # Milk Steamer
curl http://localhost:3002/api/example/systems/103  # Maintenance System (hidden)
```

**Flag:** `FLAG{ST0R3_SYST3M_3NUM3R4T3D}` (found at ID 103)

**Teaching Point:** Predictable system IDs allow complete enumeration of infrastructure.

### Part 2: Diagnostic Access
**Objective:** Access unprotected diagnostic endpoints

**Solution:**
```bash
curl http://localhost:3002/api/example/diagnostic
```

**Flag:** `FLAG{D14GN0ST1C_4CC3SS3D}`

**Teaching Point:** Debug and diagnostic endpoints left enabled in production expose system information.

### Part 3: Auth System Check
**Objective:** Access authentication check endpoint

**Solution:**
```bash
curl http://localhost:3002/api/example/auth-check
```

**Flag:** `FLAG{4UTH_SYST3M_CH3CK3D}`

**Teaching Point:** Even "check" endpoints can leak information about authentication mechanisms.

---

## LAB 1: Staff Dashboard (EASY - Recon)

**URL:** http://localhost:3002/lab1  
**Challenge:** Discover debug information endpoint  
**Stage:** Recon  

### Vulnerability
Debug endpoint left enabled in production environment, exposing system information.

### Exploitation Steps

1. **Reconnaissance:** Explore the staff dashboard page
2. **API Discovery:** Look for debug or system-info endpoints
3. **Access Endpoint:**
   ```bash
   curl http://localhost:3002/api/staff/system-info
   ```

### Flag
`FLAG{D3BUG_1NF0_3XP0S3D}`

### Sensitive Data Exposed
```json
{
  "success": true,
  "flag": "FLAG{D3BUG_1NF0_3XP0S3D}",
  "systemInfo": {
    "nodeVersion": "v18.17.0",
    "platform": "linux",
    "memory": {
      "total": "8 GB",
      "used": "2.4 GB"
    },
    "database": {
      "host": "db.beanscene.local",
      "status": "connected"
    },
    "debugMode": true
  }
}
```

### Vulnerable Code Pattern
```javascript
app.get('/api/staff/system-info', (req, res) => {
    // VULNERABILITY: No authentication check on debug endpoint
    res.json({
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage(),
        database: { host: process.env.DB_HOST },
        debugMode: true
    });
});
```

### Secure Implementation
```javascript
app.get('/api/staff/system-info', (req, res) => {
    // Verify authentication and admin role
    if (!req.session || req.session.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    // In production, this endpoint should not exist at all
    if (process.env.NODE_ENV === 'production') {
        return res.status(404).json({ error: 'Not found' });
    }
    
    // Minimal info if really needed
    res.json({ status: 'operational' });
});
```

### Teaching Points
- Debug endpoints must be disabled in production
- System information aids attackers in reconnaissance
- Use environment variables to control debug features

---

## LAB 2: Store Settings (MEDIUM - Scanning)

**URL:** http://localhost:3002/lab2  
**Challenge:** Discover exposed configuration file with credentials  
**Stage:** Scanning  

### Vulnerability
Configuration endpoint accessible without authentication, exposing all production secrets and credentials.

### Exploitation Steps

1. **Reconnaissance:** Visit store settings page
2. **API Discovery:** Test for common config endpoints
3. **Access Configuration:**
   ```bash
   curl http://localhost:3002/api/settings/config
   ```

### Flag
`FLAG{C0NF1G_L34K3D}`

### Critical Data Exposed
```json
{
  "success": true,
  "flag": "FLAG{C0NF1G_L34K3D}",
  "config": {
    "database": {
      "host": "db.beanscene.local",
      "username": "coffee_admin",
      "password": "Bean$cene2024!",
      "port": 5432
    },
    "paymentGateway": {
      "provider": "Square",
      "apiKey": "sq0atp-BeanScene_Live_Token_xyz789",
      "secretKey": "MLHV6GRVNB4XQ"
    },
    "jwtSecret": "beanscene_jwt_secret_key",
    "sessionSecret": "coffee-shop-session-2024",
    "adminEmail": "admin@beanscene.coffee"
  }
}
```

### Impact
- **Database Compromise:** Full database credentials exposed
- **Payment System:** Live payment gateway credentials leaked
- **Session Security:** JWT and session secrets compromised
- **Administrative Access:** Admin email discovered

### Vulnerable Code Pattern
```javascript
app.get('/api/settings/config', (req, res) => {
    // CRITICAL VULNERABILITY: No authentication, exposes all secrets
    res.json({
        database: {
            host: process.env.DB_HOST,
            username: process.env.DB_USER,
            password: process.env.DB_PASS  // NEVER expose passwords!
        },
        paymentGateway: {
            apiKey: process.env.PAYMENT_API_KEY,  // NEVER expose API keys!
            secretKey: process.env.PAYMENT_SECRET
        },
        jwtSecret: process.env.JWT_SECRET,
        sessionSecret: process.env.SESSION_SECRET
    });
});
```

### Secure Implementation
```javascript
// Configuration should NEVER be exposed via API
// If config management is needed:

app.get('/api/settings/view', async (req, res) => {
    // 1. Require authentication and admin role
    if (!req.session || req.session.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    // 2. Only return non-sensitive configuration
    res.json({
        storeName: process.env.STORE_NAME,
        timezone: process.env.TIMEZONE,
        // NEVER include passwords, API keys, or secrets
    });
});

// 3. Use secret management services (AWS Secrets Manager, HashiCorp Vault)
// 4. Rotate secrets regularly
// 5. Log all configuration access attempts
```

### Teaching Points
- Secrets should never be in source code or exposed via APIs
- Use environment variables with secret management services
- Configuration endpoints should not exist in production
- Implement proper access controls on administrative functions

---

## LAB 3: Manager Portal (HARD - Initial Access)

**URL:** http://localhost:3002/lab3  
**Challenge:** Gain access using default credentials  
**Stage:** Initial Access  

### Vulnerability
Default administrator credentials not changed in production deployment.

### Exploitation Steps

1. **Reconnaissance:** Find the manager login page
2. **Test Common Defaults:** Try common username/password combinations
3. **Successful Login:**
   ```bash
   curl -X POST http://localhost:3002/api/manager/login \
     -H "Content-Type: application/json" \
     -d '{"username": "admin", "password": "beanscene"}'
   ```

### Flag
`FLAG{D3F4ULT_CR3DS_US3D}`

### Common Default Credentials to Test
- `admin:admin`
- `admin:password`
- `admin:beanscene` ✓ (successful)
- `manager:manager`
- `root:root`

### Response on Successful Login
```json
{
  "success": true,
  "message": "Login successful!",
  "flag": "FLAG{D3F4ULT_CR3DS_US3D}",
  "user": {
    "username": "admin",
    "role": "manager",
    "access": "full"
  }
}
```

### Vulnerable Code Pattern
```javascript
const DEFAULT_ADMIN = {
    username: 'admin',
    password: 'beanscene'  // VULNERABILITY: Hardcoded default credentials
};

app.post('/api/manager/login', (req, res) => {
    const { username, password } = req.body;
    
    // VULNERABILITY: Accepts default credentials
    if (username === DEFAULT_ADMIN.username && 
        password === DEFAULT_ADMIN.password) {
        res.json({
            success: true,
            flag: 'FLAG{D3F4ULT_CR3DS_US3D}',
            user: { username, role: 'manager', access: 'full' }
        });
    }
});
```

### Secure Implementation
```javascript
// 1. Force password change on first login
app.post('/api/manager/login', async (req, res) => {
    const { username, password } = req.body;
    
    // 2. Check against database (with hashed passwords)
    const user = await db.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
    );
    
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
        // 3. Log failed attempts
        await logFailedLogin(username, req.ip);
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 4. Check if default password still in use
    if (user.is_default_password) {
        return res.status(403).json({
            error: 'Password change required',
            redirect: '/change-password'
        });
    }
    
    // 5. Implement account lockout after failed attempts
    if (user.failed_attempts >= 5) {
        return res.status(423).json({ error: 'Account locked' });
    }
    
    // 6. Create secure session
    req.session.userId = user.id;
    req.session.role = user.role;
    
    res.json({ success: true, user: { username, role: user.role } });
});
```

### Teaching Points
- Never use default credentials in production
- Force password changes on initial setup
- Implement strong password policies
- Use password hashing (bcrypt, Argon2)
- Implement account lockout after failed attempts
- Log all authentication attempts

---

## Common Student Questions

**Q: Why is misconfiguration so common?**  
A: Developers often enable debug features during development and forget to disable them. Default configurations are rarely changed. DevOps complexity leads to overlooked settings.

**Q: How can we prevent these issues in CI/CD?**  
A: Use configuration scanning tools, secrets detection (git-secrets, TruffleHog), infrastructure-as-code validation, and automated security testing in pipelines.

**Q: What tools detect misconfigurations?**  
A: Nikto, Nmap, OWASP ZAP, Burp Suite, custom scripts, cloud security posture management tools (CSPM).

**Q: Should we remove debug endpoints or just protect them?**  
A: Remove them entirely in production builds. If absolutely needed, protect with authentication, authorization, and IP whitelisting.

---

## Remediation Summary

### Key Takeaways
1. ✅ Disable debug features in production
2. ✅ Never expose configuration via APIs
3. ✅ Use secret management services
4. ✅ Force default credential changes
5. ✅ Implement proper access controls
6. ✅ Regular security audits of configurations

### Prevention Checklist
- [ ] All debug endpoints disabled in production
- [ ] No hardcoded secrets in code
- [ ] Environment-specific configurations
- [ ] Default credentials changed/disabled
- [ ] Configuration access requires authentication
- [ ] Secrets stored in vault/secret manager
- [ ] Regular configuration security reviews
- [ ] Automated misconfiguration scanning

### Tools & Resources
- **Scanning:** Nikto, OWASP ZAP, Lynis
- **Secrets Detection:** git-secrets, TruffleHog, GitGuardian
- **Secret Management:** HashiCorp Vault, AWS Secrets Manager, Azure Key Vault
- **Standards:** CIS Benchmarks, NIST guidelines

---

## Additional Resources
- [OWASP Security Misconfiguration](https://owasp.org/Top10/A05_2021-Security_Misconfiguration/)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/)
- [OWASP Configuration Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Configuration_Management_Cheat_Sheet.html)
