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
**Challenge:** Discover dependency versions through exposed endpoint  
**Stage:** Recon  

### Vulnerability
Application exposes exact dependency versions, allowing attackers to identify known CVEs and vulnerable packages. This is a supply chain reconnaissance issue.

### Exploitation Steps

1. **Reconnaissance:** Look for version disclosure endpoints
2. **Access Dependencies Info:**
   ```bash
   curl http://localhost:3003/api/staff/dependencies
   ```

3. **Analyze Versions:** Check exposed versions against CVE databases:
   ```bash
   # Example: Check for known vulnerabilities
   # lodash 4.17.11 - CVE-2019-10744 (Prototype Pollution)
   # jsonwebtoken 8.3.0 - CVE-2022-23529
   # express 4.16.4 - Multiple known issues
   ```

### Flag
`FLAG{V3RS10N_D1SCL0SUR3_D3P3ND3NC13S}`

### Sensitive Data Exposed
```json
{
  "dependencies": {
    "express": "4.16.4",
    "lodash": "4.17.11",        // CVE-2019-10744
    "request": "2.88.0",        // Deprecated
    "moment": "2.24.0",
    "jsonwebtoken": "8.3.0",    // CVE-2022-23529
    "mongoose": "5.7.5"
  },
  "npm_version": "6.4.1",
  "node_version": "v14.17.0"
}
```

### Supply Chain Attack Vector
1. Attacker identifies specific vulnerable versions
2. Looks up known CVEs for those versions
3. Crafts exploits targeting those specific vulnerabilities
4. Examples:
   - lodash 4.17.11: Prototype pollution attacks
   - jsonwebtoken 8.3.0: Secret/key confusion
   - express 4.16.4: Various middleware bypasses

### Vulnerable Code Pattern
```javascript
app.get('/api/staff/dependencies', (req, res) => {
    // VULNERABILITY: Exposing exact dependency versions
    const packageJson = require('./package.json');
    res.json({
        dependencies: packageJson.dependencies,
        npm_version: process.env.npm_config_npm_version
    });
});
```

### Secure Implementation
```javascript
app.get('/api/staff/dependencies', (req, res) => {
    // 1. Never expose dependency versions
    return res.status(404).json({ error: 'Not found' });
});

// 2. Use X-Powered-By headers carefully
app.disable('x-powered-by');

// 3. Remove version info from responses
// 4. Regular dependency updates
// 5. Use npm audit / snyk for vulnerability scanning
```

### Prevention
```bash
# Regular dependency audits
npm audit
npm audit fix

# Update dependencies regularly
npm update

# Use Snyk or similar tools
snyk test
snyk monitor

# Check for outdated packages
npm outdated
```

### Teaching Points
- Version disclosure aids reconnaissance phase of attacks
- Specific versions can be matched to known CVEs
- Regular dependency updates are critical
- Use tools like npm audit, Snyk, Dependabot
- Different from misconfiguration - this is about supply chain visibility
- Real CVEs exist for these specific versions

---

## LAB 2: Store Settings (MEDIUM - Scanning)

**URL:** http://localhost:3003/lab2  
**Challenge:** Discover exposed package.json file revealing dependency tree  
**Stage:** Scanning  

### Vulnerability
package.json file accessible via web, exposing complete dependency tree with exact versions. Attackers can map out entire supply chain and identify multiple attack vectors.

### Exploitation Steps

1. **Common File Discovery:**
   ```bash
   # Try common Node.js files
   curl http://localhost:3003/package.json
   curl http://localhost:3003/package-lock.json
   curl http://localhost:3003/npm-shrinkwrap.json
   ```

2. **Analyze Dependencies:**
   - Identify all packages and versions
   - Cross-reference with CVE databases
   - Find deprecated or unmaintained packages

### Flag
`FLAG{P4CK4G3_J50N_3XP0S3D}`

### Critical Data Exposed
```json
{
  "name": "pageturner-bookstore",
  "version": "1.0.0",
  "dependencies": {
    "express": "4.16.4",
    "lodash": "4.17.11",      // CVE-2019-10744
    "moment": "2.24.0",
    "jsonwebtoken": "8.3.0",  // CVE-2022-23529
    "bcrypt": "3.0.6",
    "mongoose": "5.7.5",
    "request": "2.88.0",      // Deprecated
    "xml2js": "0.4.19",       // CVE-2023-0842
    "handlebars": "4.1.2"     // Multiple CVEs
  },
  "flag": "FLAG{P4CK4G3_J50N_3XP0S3D}"
}
```

### Supply Chain Attack Opportunities
1. **Direct Vulnerabilities:** Identify CVEs in dependencies
2. **Transitive Dependencies:** Analyze sub-dependencies
3. **Deprecated Packages:** Find unmaintained code (request, moment)
4. **Version Pinning:** Exact versions never updated
5. **Attack Surface Mapping:** Complete tech stack revealed

### Real CVE Examples Found
- **lodash 4.17.11**: CVE-2019-10744 (Prototype Pollution)
- **jsonwebtoken 8.3.0**: CVE-2022-23529 (Key confusion)
- **xml2js 0.4.19**: CVE-2023-0842 (Prototype Pollution)
- **handlebars 4.1.2**: CVE-2019-19919, CVE-2021-23369
- **request 2.88.0**: Deprecated, no security updates

### Impact
- Complete supply chain visibility for attackers
- Multiple CVE exploitation paths
- Transitive dependency vulnerabilities
- Technology stack fingerprinting
- Planning sophisticated supply chain attacks

### Vulnerable Code Pattern
```javascript
// Misconfigured static file serving
app.use(express.static('.'));  // Serves entire directory!

// Or explicit route (for demos/debugging)
app.get('/package.json', (req, res) => {
    res.sendFile(__dirname + '/package.json');
});
```

### Secure Implementation
```javascript
// 1. Never serve project root
app.use(express.static('public'));  // Only public directory

// 2. Explicitly block sensitive files
app.use((req, res, next) => {
    const blockedFiles = ['package.json', 'package-lock.json', 
                          '.env', 'yarn.lock', 'composer.json'];
    if (blockedFiles.includes(req.path.slice(1))) {
        return res.status(404).send('Not Found');
    }
    next();
});

// 3. Use .gitignore for sensitive files
// 4. Configure web server (nginx/Apache) to block these files
```

### Web Server Configuration (nginx)
```nginx
location ~ /(package\.json|package-lock\.json|yarn\.lock|composer\.json)$ {
    deny all;
    return 404;
}
```

### Detection & Prevention
```bash
# Scan for exposed files
curl https://target.com/package.json
curl https://target.com/package-lock.json

# Automated scanning
nuclei -u https://target.com -t exposed-files
```

### Teaching Points
- package.json reveals complete dependency tree
- Exact versions enable targeted CVE exploitation
- Different from version endpoint - this is actual project file
- Transitive dependencies also exposed
- Use npm audit, Snyk, Dependabot for monitoring
- Regular updates critical for supply chain security
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
**Challenge:** Exploit path traversal vulnerability in dependency  
**Stage:** Initial Access  

### Vulnerability
Path traversal vulnerability inherited from vulnerable dependency (file-handler package). This demonstrates how supply chain vulnerabilities can be exploited to access sensitive files.

### Exploitation Steps

1. **Identify File Download Functionality:**
   ```bash
   curl "http://localhost:3003/api/files/download?file=sample.pdf"
   ```

2. **Test for Path Traversal:**
   ```bash
   # Try directory traversal payloads
   curl "http://localhost:3003/api/files/download?file=../package.json"
   curl "http://localhost:3003/api/files/download?file=../.env"
   curl "http://localhost:3003/api/files/download?file=../../../etc/passwd"
   ```

### Flag
`FLAG{P4TH_TR4V3RS4L_VULN_D3P}`

### Response on Successful Exploitation
```json
{
  "success": true,
  "flag": "FLAG{P4TH_TR4V3RS4L_VULN_D3P}",
  "vulnerability": "Path traversal via vulnerable dependency",
  "message": "File download processed with directory traversal",
  "warning": "Vulnerable package allows accessing files outside intended directory!",
  "example_payloads": [
    "../../../etc/passwd",
    "..\\..\\..\\windows\\system32\\config\\sam",
    "../.env",
    "../package.json"
  ],
  "cve_reference": "Similar to CVE-2017-16119 (fresh), CVE-2020-28460 (path-parse)",
  "vulnerable_package": "file-handler@1.2.3",
  "fix": "Update to file-handler@2.0.0 or use path.resolve() to prevent traversal"
}
```

### Supply Chain Context
This vulnerability demonstrates:
- **Inherited Vulnerabilities:** Vulnerable code in dependencies
- **Transitive Risk:** Sub-dependencies can have vulnerabilities
- **Version-Specific CVEs:** Specific versions have known exploits
- **Update Urgency:** Critical to patch vulnerable dependencies

### Real CVE Examples
- **CVE-2017-16119** (fresh): Path traversal in file serving
- **CVE-2020-28460** (path-parse): Path traversal vulnerability
- **CVE-2021-23343** (path-parse): Another traversal issue
- **CVE-2018-3728** (hoek): Prototype pollution
- **CVE-2019-10744** (lodash): Prototype pollution

### Impact
- **Sensitive File Access:** .env files, configuration, credentials
- **System Files:** /etc/passwd, Windows SAM database
- **Source Code:** Access to application code
- **Private Keys:** SSH keys, SSL certificates
- **Database Files:** SQLite, local databases

### Vulnerable Code Pattern
```javascript
// Using vulnerable file-handler package
const fileHandler = require('file-handler'); // v1.2.3 (vulnerable)

app.get('/api/files/download', (req, res) => {
    const filename = req.query.file;
    
    // VULNERABILITY: No sanitization, relies on vulnerable package
    fileHandler.serveFile(filename, res);
    // Package doesn't sanitize ../ sequences
});
```

### Secure Implementation
```javascript
const path = require('path');

app.get('/api/files/download', (req, res) => {
    const filename = req.query.file;
    const baseDir = path.join(__dirname, 'uploads');
    
    // 1. Sanitize input
    if (filename.includes('..') || filename.includes('\\')) {
        return res.status(400).json({ error: 'Invalid filename' });
    }
    
    // 2. Use path.resolve to prevent traversal
    const requestedPath = path.resolve(baseDir, filename);
    
    // 3. Verify path is within allowed directory
    if (!requestedPath.startsWith(baseDir)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    // 4. Check file exists and serve
    if (fs.existsSync(requestedPath)) {
        res.sendFile(requestedPath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});
```

### Detection & Prevention

**Dependency Scanning:**
```bash
# Audit dependencies for known CVEs
npm audit
npm audit fix

# Use Snyk
snyk test
snyk monitor

# GitHub Dependabot
# Automatically creates PRs for vulnerable dependencies
```

**Testing for Path Traversal:**
```bash
# Manual testing
curl "http://target/download?file=../../../etc/passwd"
curl "http://target/download?file=..\\..\\..\\windows\\system32\\config\\sam"

# Automated scanning
nuclei -u https://target.com -t path-traversal
```

### Teaching Points
- Vulnerabilities in dependencies affect your application
- Path traversal is common in file handling libraries
- Regular dependency updates are critical
- Use static analysis tools (npm audit, Snyk, Semgrep)
- Different from misconfiguration - this is code-level vulnerability
- Supply chain attacks can happen through compromised packages
- Trust but verify - audit your dependencies
- Use package-lock.json to pin versions but still update regularly
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
