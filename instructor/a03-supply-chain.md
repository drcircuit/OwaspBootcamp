# A03: Software and Data Supply Chain Failures - Instructor Writeup

**Lab URL:** http://localhost:3003  
**Topic:** OWASP Top 10 2025 - A03: Software and Data Supply Chain Failures  
**Difficulty:** Easy → Medium → Hard  
**Theme:** PageTurner Books

---

## Overview

This lab teaches students about supply chain security vulnerabilities through progressive challenges at a fictional "PageTurner Books" store. Students learn to identify vulnerable dependencies, exposed configurations from upstream sources, and default credentials that persist from development templates.

### Learning Objectives
- Understand supply chain attack vectors
- Identify vulnerable dependencies and default configurations
- Recognize risks from development templates and boilerplates
- Learn proper dependency management and security practices

---

## EXAMPLE: Getting Started Guide

**URL:** http://localhost:3003/example  
**Purpose:** Educational walkthrough teaching system enumeration and diagnostic access

### Part 1: System Enumeration
**Objective:** Discover all backend systems through ID enumeration

**Solution:**
```bash
# Test all system IDs to find hidden systems
curl http://localhost:3003/api/example/systems/100  # Inventory System
curl http://localhost:3003/api/example/systems/101  # Point of Sale
curl http://localhost:3003/api/example/systems/102  # Customer Database
curl http://localhost:3003/api/example/systems/103  # Maintenance System (hidden)
```

**Flag:** `FLAG{ST0R3_SYST3M_3NUM3R4T3D}` (found at ID 103)

**Teaching Point:** Supply chain templates often include more systems than needed. Unnecessary systems increase attack surface.

### Part 2: Diagnostic Access
**Objective:** Access debug endpoints left from development

**Solution:**
```bash
curl http://localhost:3003/api/example/diagnostic
```

**Flag:** `FLAG{D14GN0ST1C_4CC3SS3D}`

**Teaching Point:** Development and diagnostic endpoints from upstream templates are often forgotten in production deployments.

### Part 3: Auth System Check
**Objective:** Test authentication mechanisms

**Solution:**
```bash
curl http://localhost:3003/api/example/auth-check
```

**Flag:** `FLAG{4UTH_SYST3M_CH3CK3D}`

**Teaching Point:** Authentication systems copied from templates may have weak default configurations.

---

## LAB 1: Staff Dashboard (EASY - Recon)

**URL:** http://localhost:3003/lab1  
**Challenge:** Discover debug information endpoint from upstream dependency  
**Stage:** Recon  

### Vulnerability
Debug endpoint included in a boilerplate template or framework, left enabled in production. This represents a common supply chain risk where inherited code contains security issues.

### Exploitation Steps

1. **Reconnaissance:** Explore the staff dashboard
2. **Framework Fingerprinting:** Identify common framework patterns
3. **Access Debug Endpoint:**
   ```bash
   curl http://localhost:3003/api/staff/system-info
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
    "debugMode": true,
    "framework": "express-admin-template"
  }
}
```

### Supply Chain Context
This vulnerability likely originated from:
- A boilerplate template or starter project
- A third-party admin dashboard framework
- Copy-pasted code from Stack Overflow or tutorials
- Development scaffolding tools that include debug features

### Vulnerable Code Pattern
```javascript
// Inherited from express-admin-template package
const adminTemplate = require('express-admin-template');

app.use('/api/staff', adminTemplate.routes);
// Problem: Template includes /system-info endpoint with no auth
```

### Secure Implementation
```javascript
// 1. Review all inherited routes from templates
// 2. Explicitly disable debug features in production

if (process.env.NODE_ENV !== 'production') {
    // Only enable in development
    app.get('/api/staff/system-info', authMiddleware, adminOnly, (req, res) => {
        res.json({ status: 'operational' });
    });
}

// 3. Use minimal templates and understand what you include
// 4. Regular dependency audits
```

### Teaching Points
- Understand all code in your dependencies
- Review template/boilerplate code before production
- Disable development features in production
- Regularly audit dependencies with `npm audit` or similar tools

---

## LAB 2: Store Settings (MEDIUM - Scanning)

**URL:** http://localhost:3003/lab2  
**Challenge:** Discover exposed configuration endpoint from template  
**Stage:** Scanning  

### Vulnerability
Configuration management endpoint inherited from an admin template or framework, exposing all production secrets. This represents the risk of using templates with insecure defaults.

### Exploitation Steps

1. **Template Analysis:** Identify framework or template being used
2. **Common Endpoints:** Test for typical config endpoints
3. **Access Configuration:**
   ```bash
   curl http://localhost:3003/api/settings/config
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
      "username": "books_admin",
      "password": "Bean$cene2024!",
      "port": 5432
    },
    "paymentGateway": {
      "provider": "Square",
      "apiKey": "sq0atp-BeanScene_Live_Token_xyz789",
      "secretKey": "MLHV6GRVNB4XQ"
    },
    "jwtSecret": "beanscene_jwt_secret_key",
    "sessionSecret": "books-session-2024",
    "vendorAPI": {
      "endpoint": "https://api.bookvendor.com",
      "apiKey": "vendor_key_abc123"
    }
  }
}
```

### Supply Chain Context
Configuration exposure often comes from:
- Admin panel templates with built-in config viewers
- Framework scaffolding with example config endpoints
- Development utilities not removed before deployment
- Cloned projects with insecure patterns

### Impact
- **Database Compromise:** Full database access
- **Payment System:** Live payment gateway credentials
- **Session Security:** Can forge authentication tokens
- **Third-Party APIs:** Vendor API keys exposed
- **Supply Chain Attack:** Credentials could be used to compromise vendors

### Vulnerable Code Pattern
```javascript
// From template: express-config-manager v1.2.3
const configManager = require('express-config-manager');

// Template has insecure default: exposes /api/settings/config
app.use('/api/settings', configManager({
    expose: true,  // INSECURE DEFAULT!
    auth: false    // INSECURE DEFAULT!
}));
```

### Secure Implementation
```javascript
// 1. Don't use config management packages with insecure defaults
// 2. If needed, properly configure them

const configManager = require('express-config-manager');

app.use('/api/settings', 
    authMiddleware,
    adminOnly,
    configManager({
        expose: process.env.NODE_ENV !== 'production',
        auth: true,
        whitelist: ['storeName', 'timezone', 'locale'],  // Only non-sensitive
        blacklist: ['password', 'secret', 'key', 'token']  // Never expose
    })
);

// 3. Better: Don't expose config via API at all
// 4. Use environment variables and secret managers
```

### Teaching Points
- Review default configurations of all dependencies
- Never expose secrets via APIs
- Use secret management services (AWS Secrets Manager, HashiCorp Vault)
- Implement dependency security scanning in CI/CD

---

## LAB 3: Manager Portal (HARD - Initial Access)

**URL:** http://localhost:3003/lab3  
**Challenge:** Exploit default credentials from development template  
**Stage:** Initial Access  

### Vulnerability
Default administrator credentials from template or boilerplate not changed during deployment. This is a critical supply chain failure where insecure defaults persist to production.

### Exploitation Steps

1. **Template Research:** Identify the framework/template used
2. **Search for Default Credentials:** Check template documentation
3. **Test Common Defaults:**
   ```bash
   # Try template-specific defaults
   curl -X POST http://localhost:3003/api/manager/login \
     -H "Content-Type: application/json" \
     -d '{"username": "admin", "password": "beanscene"}'
   ```

### Flag
`FLAG{D3F4ULT_CR3DS_US3D}`

### Common Template Default Credentials
Many popular templates ship with default credentials:
- `admin:admin`
- `admin:password`
- `admin:beanscene` ✓ (from BeanScene template)
- `admin:123456`
- `demo:demo`
- `test:test`

### Response on Successful Login
```json
{
  "success": true,
  "message": "Login successful!",
  "flag": "FLAG{D3F4ULT_CR3DS_US3D}",
  "user": {
    "username": "admin",
    "role": "manager",
    "access": "full",
    "template": "BeanScene Admin Template v2.1"
  },
  "warning": "Default credentials detected - change immediately!"
}
```

### Supply Chain Context
Default credentials are a supply chain issue because:
- Templates include them for quick setup
- Documentation often lists them
- Developers forget to change them
- Automated scripts may rely on them
- No forced password change on first login

### Real-World Examples
- **WordPress:** admin:admin (common in quick installs)
- **Jenkins:** admin:password (default in many containers)
- **Grafana:** admin:admin (default credentials)
- **MongoDB:** No authentication by default (until recently)

### Vulnerable Code Pattern
```javascript
// Hardcoded in template source code
const DEFAULT_CREDENTIALS = {
    username: 'admin',
    password: 'beanscene',  // From BeanScene template
    role: 'manager'
};

app.post('/api/manager/login', (req, res) => {
    const { username, password } = req.body;
    
    // VULNERABILITY: Accepts hardcoded defaults
    if (username === DEFAULT_CREDENTIALS.username && 
        password === DEFAULT_CREDENTIALS.password) {
        res.json({
            success: true,
            flag: 'FLAG{D3F4ULT_CR3DS_US3D}',
            user: DEFAULT_CREDENTIALS
        });
    }
});
```

### Secure Implementation
```javascript
app.post('/api/manager/login', async (req, res) => {
    const { username, password } = req.body;
    
    // 1. Check database, not hardcoded values
    const user = await db.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
    );
    
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // 2. Force password change if still using default
    if (user.password_source === 'default' || user.is_default_password) {
        return res.status(403).json({
            error: 'Password change required',
            redirect: '/change-password',
            message: 'Default credentials must be changed before first use'
        });
    }
    
    // 3. Check password age and strength
    if (user.password_age_days > 90) {
        return res.status(403).json({
            error: 'Password expired',
            redirect: '/change-password'
        });
    }
    
    res.json({ success: true, user: { username, role: user.role } });
});

// 4. Setup wizard that forces credential configuration
app.get('/setup', (req, res) => {
    if (await hasDefaultCredentials()) {
        // Force setup before allowing any other access
        res.render('setup-wizard');
    } else {
        res.redirect('/');
    }
});
```

### Teaching Points
- **Never** deploy with default credentials
- Implement forced password change on first login
- Use setup wizards for initial configuration
- Document all default credentials that exist
- Scan for common defaults in security testing
- Use password managers and generate strong passwords

---

## Supply Chain Security Best Practices

### Dependency Management
1. **Audit Dependencies:**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Check for Known Vulnerabilities:**
   ```bash
   npm install -g snyk
   snyk test
   ```

3. **Review Dependency Changes:**
   ```bash
   npm outdated
   npm diff <package>@<version>
   ```

4. **Use Lock Files:**
   - Commit `package-lock.json` or `yarn.lock`
   - Ensures reproducible builds

5. **Minimal Dependencies:**
   - Only include what you need
   - Review all transitive dependencies

### Template Security
1. **Review Template Code:**
   - Understand all included features
   - Remove unnecessary functionality
   - Check for hardcoded credentials

2. **Update Templates:**
   - Keep templates and frameworks updated
   - Subscribe to security advisories

3. **Security Scanning:**
   - SAST tools (SonarQube, Snyk Code)
   - DAST tools (OWASP ZAP, Burp Suite)
   - Dependency scanning (Dependabot, Snyk)

### Configuration Security
1. **Environment-Specific Config:**
   ```javascript
   // development.env
   DEBUG=true
   LOG_LEVEL=debug
   
   // production.env
   DEBUG=false
   LOG_LEVEL=error
   ```

2. **Secret Management:**
   - Use AWS Secrets Manager, Azure Key Vault, HashiCorp Vault
   - Never commit secrets to version control
   - Rotate secrets regularly

3. **Least Privilege:**
   - Database users with minimal permissions
   - API keys with restricted scopes
   - Service accounts for specific purposes

---

## Common Student Questions

**Q: How do we know what dependencies are safe?**  
A: Use `npm audit`, Snyk, or similar tools. Check GitHub security advisories. Review package popularity, maintenance status, and security track record.

**Q: Should we avoid all templates and frameworks?**  
A: No, but understand what you're including. Use well-maintained, popular templates with active security practices. Review and customize before production.

**Q: What about supply chain attacks like SolarWinds?**  
A: Use Software Bill of Materials (SBOM), verify package signatures, use private registries, implement zero-trust architecture, and monitor for unusual behavior.

**Q: How often should we update dependencies?**  
A: Regularly! Security patches immediately. Minor updates monthly. Major updates quarterly with testing. Use automated tools like Dependabot.

---

## Remediation Summary

### Key Takeaways
1. ✅ Audit all dependencies regularly
2. ✅ Review template/boilerplate code before use
3. ✅ Change all default credentials immediately
4. ✅ Disable debug features in production
5. ✅ Use secret management services
6. ✅ Implement supply chain security scanning
7. ✅ Maintain Software Bill of Materials (SBOM)

### Prevention Checklist
- [ ] All dependencies audited with `npm audit` or Snyk
- [ ] Default credentials changed/removed
- [ ] Debug endpoints disabled in production
- [ ] Template code reviewed and unnecessary features removed
- [ ] Secrets not hardcoded or committed to git
- [ ] Environment-specific configurations in place
- [ ] Lock files committed to version control
- [ ] Automated dependency updates configured (Dependabot)
- [ ] SBOM generated and maintained
- [ ] Supply chain security scanning in CI/CD

### Tools & Resources
- **Dependency Scanning:** npm audit, Snyk, WhiteSource, OWASP Dependency-Check
- **SBOM Tools:** Syft, CycloneDX, SPDX
- **Secret Scanning:** git-secrets, TruffleHog, GitGuardian
- **Supply Chain Security:** Sigstore, SLSA Framework, in-toto

---

## Additional Resources
- [OWASP Software and Data Integrity Failures](https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/)
- [SLSA Framework](https://slsa.dev/)
- [Sigstore](https://www.sigstore.dev/)
- [npm Best Practices](https://docs.npmjs.com/misc/security)
- [NIST SSDF](https://csrc.nist.gov/Projects/ssdf)
