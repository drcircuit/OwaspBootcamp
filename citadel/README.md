# Evil Capitalistic Corp - Citadel Challenge

## Overview

The Citadel challenge is a comprehensive security training application that implements an onion-layer vulnerability chain covering multiple OWASP Top 10 categories. The challenge simulates a greedy corporate web application with intentional security flaws for educational purposes.

## Vulnerability Chain

The challenge implements vulnerabilities across 4 main OWASP categories with 2 embedded challenges each:

### 🔴 A01: Broken Access Control

**Challenge 1: User Enumeration & IDOR (Insecure Direct Object Reference)**
- Navigate to `/employees` to see the employee directory
- User profiles are accessible via `/user/{id}` without authorization
- Enumerate users by incrementing IDs: /user/1, /user/2, /user/3, /user/4...
- Admin user (ID 4) contains flag in notes field

**Challenge 2: Privilege Escalation**
- Admin panel at `/admin` checks user permissions
- Vulnerability: Role check uses `user_id` query parameter
- Access admin panel: `/admin?user_id=4` (using admin's user ID)
- Bypasses authentication by exploiting parameter-based access control

**Flags:**
- `NSA{BR0K3N_4CC3SS_PWN3D}` - Found in admin user profile

### 🟠 A04: Cryptographic Failures

**Challenge 1: Password Hash Exposure**
- Debug endpoint `/debug/users` exposes password hashes
- Admin password uses weak MD5 hashing
- Hash: `5f4dcc3b5aa765d61d8327deb882cf99`
- Crack using online tools (e.g., CrackStation) to reveal: `password`

**Challenge 2: Weak Session Management**
- Session cookies are just user IDs (no encryption)
- Login at `/login` with cracked credentials
- Username: `admin`, Password: `password`
- Session management allows easy session hijacking

**Flags:**
- `NSA{CR4CK3D_TH3_H4SH}` - Found in sensitive_data table

### 🔵 A05: Injection (SQL)

**Challenge 1: Basic SQL Injection**
- Product search at `/search` is vulnerable
- SQL injection through search input
- Try: `' OR '1'='1` to retrieve all products
- Error messages reveal SQL structure

**Challenge 2: UNION-based SQL Injection**
- API endpoint `/api/search?q=` allows advanced injection
- Extract sensitive data using UNION attacks
- Example payload: `' UNION SELECT id, data, secret_level, user_id::text FROM sensitive_data--`
- Extracts flags and confidential information from database

**Flags:**
- Extracted from `sensitive_data` table via SQL injection

### 🟣 A06: Insecure Design

**Challenge 1: Price Manipulation**
- Checkout endpoint `/api/checkout` trusts client-side price
- Send POST request with manipulated price value
- Example: `{"product_id":1,"price":0.01,"quantity":1}`
- Business logic flaw allows purchasing at any price

**Challenge 2: Race Condition**
- Withdrawal endpoint `/api/withdraw` has non-atomic operations
- Send concurrent withdrawal requests
- Exploit race condition to withdraw more than available balance
- Example: 4 simultaneous $300 withdrawals from $1000 balance

**Flags:**
- `NSA{PR1C3_M4N1PUL4T10N}` - Returned on successful price manipulation
- `NSA{R4C3_C0ND1T10N_3XPL01T3D}` - Returned on successful race condition exploit

### ⚫ Final Challenge: Remote Code Execution

**Command Injection**
- Admin panel includes command execution feature
- Accessible after gaining admin access
- Allows custom commands without sanitization
- Execute: `cat /root/ckret.txt` to retrieve final flag

**Final Flag:**
- `NSA{C1T4D3L_H4S_F4LL3N_R00T_4CC3SS}` - Displayed with congratulatory message

## Corporate Greed Theme

The application satirizes excessive corporate greed with:
- Executives with exorbitant salaries
- Stats showing massive CEO bonuses vs minimal employee raises
- Overpriced products with buzzwords ("AI-Powered", "Blockchain Solution")
- Satirical company messaging about shareholder value

## Hints System

Built-in hints page at `/hints` provides:
- Complete walkthrough of vulnerability chain
- Step-by-step exploitation instructions
- Command examples for each challenge
- Progressive disclosure from beginner to advanced techniques

## Technical Stack

- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Views**: EJS templates
- **Containerization**: Docker Compose

## Running the Challenge

```bash
docker compose up -d citadel citadel-db
```

Access at: `http://localhost:3000`

## Security Notice

⚠️ **EDUCATIONAL PURPOSES ONLY** ⚠️

This application contains intentional security vulnerabilities for training purposes. Never deploy this application in a production environment or on publicly accessible infrastructure.

## Learning Objectives

By completing this challenge, users will:
1. Understand common web application vulnerabilities
2. Learn exploitation techniques for OWASP Top 10 issues
3. Practice privilege escalation methodologies
4. Gain experience with SQL injection attacks
5. Recognize insecure design patterns
6. Understand the importance of defense-in-depth

## Credits

Created for OWASP Bootcamp security training program.
