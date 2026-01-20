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

### Exploitation Steps

1. **Reconnaissance:** Visit the employee directory page
2. **Identify API:** Notice the `/api/members/user/:id` endpoint
3. **Enumerate:** Try IDs 1 through 5:
   ```bash
   curl http://localhost:3001/api/members/user/1
   curl http://localhost:3001/api/members/user/2
   curl http://localhost:3001/api/members/user/3
   curl http://localhost:3001/api/members/user/4
   curl http://localhost:3001/api/members/user/5
   ```
4. **Capture Flag:** Access all employee records to get the flag

### Flag
`NSA{F0UND_TH3_US3RS}`

### Sensitive Data Exposed
- Employee names, titles, departments
- Email addresses and employee IDs
- Hire dates and job roles
- Manager and executive information
- Security clearance levels

### Vulnerable Code Pattern
```javascript
app.get('/api/members/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    // VULNERABILITY: No check if current user should access this data
    if (user) {
        res.json({ success: true, user: user });
    }
});
```

### Secure Implementation
```javascript
app.get('/api/members/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const requestingUser = req.session.userId; // From authenticated session
    
    // Only allow users to view their own profile, or make this a public directory
    if (userId !== requestingUser && req.session.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    const user = users.find(u => u.id === userId);
    if (user) {
        res.json({ success: true, user: user });
    }
});
```

### Hints for Students
- "The API lets you view member profiles by ID"
- "Try different member IDs to see what information is exposed"
- "What happens when you enumerate through all IDs?"

---

## LAB 2: My Profile (MEDIUM - Initial Access)

**URL:** http://localhost:3001/lab2  
**Challenge:** Access other users' private profiles (IDOR vulnerability)  
**Stage:** Initial Access  

### Vulnerability
Insecure Direct Object Reference (IDOR) - accessing other users' private profiles without authorization.

### Exploitation Steps

1. **Identify Pattern:** Log in as Sarah (user ID 2)
2. **Access Own Profile:** Visit `/api/profile/user/2` - works as expected
3. **Test IDOR:** Change URL to `/api/profile/user/1`, `/api/profile/user/3`, or `/api/profile/user/4`
4. **Capture Flag:** Access any profile other than ID 2

### Flag
`FLAG{1D0R_PR0F1L3_4CC3SS_V1OL4T10N}`

### Sensitive Data Exposed
- Full email addresses
- Credit card last 4 digits
- Membership renewal dates
- Private role information

### Vulnerable Code Pattern
```javascript
app.get('/api/profile/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    // VULNERABILITY: Checks if user exists, but NOT if current user should access it
    if (user) {
        // Displays flag when accessing someone else's profile
        if (userId !== CURRENT_USER_ID) {
            user.flag = 'FLAG{1D0R_PR0F1L3_4CC3SS_V1OL4T10N}';
        }
        res.json({ success: true, profile: user });
    }
});
```

### Root Cause
The application verifies the requested user exists but never checks if the authenticated user has permission to view that profile.

### Secure Implementation
```javascript
app.get('/api/profile/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const requestingUserId = req.session.userId; // From authenticated session
    
    // SECURITY: Verify requesting user can only access their own profile
    if (userId !== requestingUserId) {
        return res.status(403).json({ error: 'Unauthorized access' });
    }
    
    const user = users.find(u => u.id === userId);
    if (user) {
        res.json({ success: true, profile: user });
    }
});
```

### Hints for Students
- "Your profile URL contains your user ID"
- "What happens if you change the ID in the URL?"
- "Can you access other members' private information?"

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
