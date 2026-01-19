# OWASP Bootcamp - Instructor Guide

## 📚 Detailed Writeups Available!

**NEW:** Comprehensive play-by-play writeups for all challenges are now available in the **`instructor/`** directory:

- **📖 View in Browser:** Open `instructor/index.html` for an interactive, syntax-highlighted viewer
- **📝 Individual Writeups:** One markdown file per OWASP topic (A01-A10) plus Citadel
- **🎯 Complete Solutions:** Step-by-step exploitation, vulnerable code, secure implementations, and teaching tips

**Quick Access:** `file:///path/to/OwaspBootcamp/instructor/index.html`

---

## 🎯 NEW CHALLENGE STRUCTURE

**Important Change:** All labs have been restructured to follow professional CTF methodology:

### Per OWASP Topic:
- **1 Example/Walkthrough**: Educational content with vulnerable/secure code comparison
- **3 Progressive Labs**: Easy → Medium → Hard, covering Recon → Scanning → Initial Access → Advanced stages
- **NO Exploit Buttons**: Students must use real tools (curl, Burp Suite, Postman, DevTools)
- **Subtle Hints Only**: Labs have collapsible hints that guide without giving away solutions
- **Citadel (Final Exam)**: Realistic vulnerable application with NO hints

### Portal Navigation:
- **By Stage**: Recon → Scanning → Initial Access → Maintained Access → Cover Tracks
- **By Topic**: View all challenges for a specific OWASP category (A01, A02, etc.)
- Access via `http://localhost:3100/topic/A01` for topic-based view

### Instructor Resources:
- **Detailed Writeups:** `instructor/` directory contains complete solutions for all labs
- **Interactive Viewer:** `instructor/index.html` provides a beautiful browsing experience
- **Teaching Guide:** Each writeup includes common questions, teaching points, and remediation advice

## Workshop Overview

**Duration**: 6-7 hours (including breaks)  
**Target Audience**: Developers, security engineers, QA testers  
**Prerequisites**: Basic web development knowledge, understanding of HTTP

## Learning Objectives

By the end of this workshop, students will be able to:
1. Identify the OWASP Top 10 2025 vulnerabilities
2. Understand how each vulnerability can be exploited
3. Implement secure coding practices to prevent each vulnerability
4. Perform basic security testing on web applications

## Workshop Schedule

### Session 1: Introduction & Setup (30 min)

**Topics:**
- Introduction to OWASP and OWASP Top 10
- Why security matters in software development
- Overview of workshop structure
- Setup verification

**Activities:**
- Introduce yourself and the workshop
- Ensure all students can access the labs
- Quick demo of the Citadel application

**Talking Points:**
- OWASP Top 10 has evolved - 2025 includes new categories (A03, A10)
- These vulnerabilities represent real-world attack patterns
- Security is everyone's responsibility, not just the security team

### Session 2: Instructional Labs (2.5-3 hours)

**NEW STRUCTURE:** Each OWASP topic now has **1 Example + 3 Progressive Labs**

#### Teaching Approach per Topic (30-40 min each):

1. **Example/Walkthrough** (10 min)
   - Walk through the example page together
   - Explain vulnerable vs. secure code side-by-side
   - Demonstrate tool usage (curl, Burp Suite, browser DevTools)
   - **Important:** No exploit buttons - show real tool commands
   - Students follow along on their machines

2. **Lab 1 (Easy - Recon/Scanning)** (5-10 min)
   - Students work independently or in pairs
   - Provide subtle guidance if stuck
   - Focus: Discovery and reconnaissance

3. **Lab 2 (Medium - Initial Access)** (10-15 min)
   - Students exploit the vulnerability
   - Minimal hints - let them figure it out
   - Focus: Exploitation and gaining access

4. **Lab 3 (Hard - Advanced)** (10-15 min)
   - Advanced exploitation or persistence
   - Students should struggle a bit - it's intentional
   - Focus: Maintained access or covering tracks

#### A01: Broken Access Control (30 min)

**Example Walkthrough:**
- Show IDOR vulnerability in code
- Demonstrate using curl: `curl http://localhost:3001/api/example/user/1`
- Explain authorization checks and how to implement them

**Lab 1 (Easy):** User Enumeration
- Students discover sequential user IDs
- Tools: curl or browser
- Hint if stuck: "Try different user IDs starting from 1"

**Lab 2 (Medium):** Access Other Profiles  
- Students exploit IDOR to view other users' data
- Tools: curl, Burp Suite, or browser DevTools
- Hint if stuck: "What happens if you change the ID parameter?"

**Lab 3 (Hard):** Privilege Escalation
- Students access admin account
- Tools: Enumeration + exploitation
- Hint if stuck: "Admin is just another user..."

#### A02: Security Misconfiguration (20 min)

**Key Concepts:**
- Debug endpoints in production
- Verbose error messages
- Default credentials
- Missing security headers

**Demo:**
- Access /debug endpoint showing sensitive info
- Show stack traces exposing application structure
- Demonstrate X-Powered-By header leaking tech stack

**Common Questions:**
- Q: "Why are default configurations dangerous?"
  - A: Attackers know default settings and actively scan for them
- Q: "What security headers should we use?"
  - A: CSP, HSTS, X-Frame-Options, X-Content-Type-Options

#### A03: Software Supply Chain Failures (20 min)

**Key Concepts:**
- Vulnerable dependencies
- Dependency confusion attacks
- Compromised packages
- No integrity verification

**Demo:**
- Run `npm audit` to show vulnerabilities
- Explain transitive dependencies
- Show how one package pulls in many others

**Common Questions:**
- Q: "How often should we update dependencies?"
  - A: Regularly, with testing. Use automated tools like Dependabot
- Q: "Can we trust all npm packages?"
  - A: No, always verify and audit third-party code

#### A04: Cryptographic Failures (20 min)

**Key Concepts:**
- Plain text password storage
- Weak hashing algorithms (MD5, SHA1)
- Hard-coded encryption keys
- Missing TLS

**Demo:**
- Show user database with plain text passwords
- Compare MD5 hash (weak) vs bcrypt (strong)
- Explain rainbow table attacks

**Common Questions:**
- Q: "Why can't we use SHA-256 for passwords?"
  - A: Too fast. Use slow hashing functions designed for passwords
- Q: "How do we manage encryption keys?"
  - A: Use environment variables, key vaults, never hard-code

#### A05: Injection (20 min)

**Key Concepts:**
- SQL injection
- NoSQL injection
- OS command injection
- LDAP injection

**Demo:**
- Show SQL injection with `' OR '1'='1`
- Demonstrate how parameterized queries prevent injection
- Show the difference in generated SQL

**Common Questions:**
- Q: "Is input validation enough?"
  - A: No, always use parameterized queries/prepared statements
- Q: "What about stored procedures?"
  - A: Better, but can still be vulnerable if built with concatenation

#### A06: Insecure Design (20 min)

**Key Concepts:**
- Missing threat modeling
- No rate limiting
- Flawed business logic
- Security as an afterthought

**Demo:**
- Show unlimited transaction attempts
- Explain how design flaws differ from implementation bugs
- Discuss threat modeling during design phase

**Common Questions:**
- Q: "When should we think about security?"
  - A: From the start, during design phase
- Q: "What is threat modeling?"
  - A: Systematic process to identify potential threats

#### A07: Authentication Failures (20 min)

**Key Concepts:**
- Weak password policies
- Credential stuffing
- Session fixation
- No MFA

**Demo:**
- Show predictable session IDs
- Demonstrate weak password acceptance
- Explain brute force attacks

**Common Questions:**
- Q: "How long should sessions last?"
  - A: Balance security and UX, use absolute and idle timeouts
- Q: "Is MFA really necessary?"
  - A: Yes, it's one of the most effective security controls

#### A08: Software and Data Integrity Failures (20 min)

**Key Concepts:**
- Unsigned updates
- No integrity verification
- Insecure CI/CD
- Deserialization attacks

**Demo:**
- Show update without signature
- Explain how to verify checksums
- Discuss SRI for CDN resources

**Common Questions:**
- Q: "What is code signing?"
  - A: Cryptographic verification that code hasn't been tampered with
- Q: "How do we secure our CI/CD pipeline?"
  - A: Least privilege, audit logs, secure credentials storage

#### A09: Security Logging and Alerting Failures (20 min)

**Key Concepts:**
- Missing security event logging
- No monitoring or alerting
- Logs contain sensitive data
- No log retention

**Demo:**
- Show critical operations with no logging
- Discuss what should and shouldn't be logged
- Explain SIEM integration

**Common Questions:**
- Q: "How long should we keep logs?"
  - A: Depends on compliance requirements, typically 90+ days
- Q: "Can we log passwords?"
  - A: NEVER log passwords, tokens, or PII

#### A10: Mishandling of Exceptional Conditions (20 min)

**Key Concepts:**
- Stack trace exposure
- Unhandled exceptions
- Information disclosure
- Unsafe failure states

**Demo:**
- Trigger errors showing stack traces
- Show unhandled exception crashing server
- Compare generic vs. detailed error messages

**Common Questions:**
- Q: "How do we debug without detailed errors?"
  - A: Log detailed errors server-side, show generic messages to users
- Q: "What about development vs production?"
  - A: Use environment-specific error handling

### Break (15 minutes)

Encourage students to:
- Stretch and move around
- Discuss what they've learned
- Ask questions informally

### Session 3: Citadel Challenge (2-3 hours)

**Introduction (15 min):**
- Explain the Citadel challenge
- Show the main application interface
- Explain how to find and exploit vulnerabilities
- Set expectations (not everyone will find all vulnerabilities)

**Challenge Time (2-2.5 hours):**
- Students work individually or in small groups
- Circulate and provide hints as needed
- Don't give away answers immediately

**Hints to Provide:**
- If stuck on A01: "Try changing the user ID in the URL"
- If stuck on A05: "What happens if you use single quotes in search?"
- If stuck on A02: "Look for debug or admin endpoints"

**Success Indicators:**
Students should be able to:
1. Access other users' profiles (A01)
2. Find the debug endpoint (A02)
3. Understand dependency risks (A03)
4. See plain text passwords (A04)
5. Perform SQL injection (A05)
6. Spam transactions (A06)
7. Get predictable session IDs (A07)
8. See unsigned updates (A08)
9. Notice missing logs (A09)
10. Trigger error stack traces (A10)

### Session 4: Review & Discussion (30 min)

**Activities:**
1. **Group Discussion** (15 min)
   - Ask students to share their findings
   - Discuss most interesting vulnerabilities
   - Real-world examples

2. **Key Takeaways** (10 min)
   - Security is a continuous process
   - Defense in depth
   - Security champions in every team
   - Keep learning

3. **Resources & Next Steps** (5 min)
   - OWASP resources
   - Security training platforms (HackTheBox, TryHackMe)
   - Security certifications (OSCP, CEH)
   - Bug bounty programs

## Teaching Tips

### Do's ✅
- Encourage questions throughout
- Use real-world examples
- Share your own security mistakes
- Make it fun and engaging
- Emphasize that security is everyone's job
- Provide context for each vulnerability

### Don'ts ❌
- Don't shame students for not knowing
- Don't rush through the material
- Don't skip the hands-on practice
- Don't make it too theoretical
- Don't ignore questions
- Don't forget to emphasize ethical use

## Technical Tips

### If Docker Issues Occur:
```bash
# Restart Docker Desktop
# Or restart specific container
docker-compose restart citadel

# Check logs
docker-compose logs citadel

# Rebuild if needed
docker-compose build --no-cache citadel
docker-compose up -d citadel
```

### If Ports Are Taken:
Edit `docker-compose.yml` and change port mappings:
```yaml
ports:
  - "3100:3000"  # Use 3100 instead of 3000
```

### Performance Issues:
- Start only necessary containers
- Increase Docker memory allocation
- Close unnecessary applications

## Assessment Ideas

### Knowledge Check (Optional):
1. Name three OWASP Top 10 2025 vulnerabilities
2. What's the difference between encoding and encryption?
3. Why is client-side validation not security?
4. Name two ways to prevent SQL injection
5. What should you log and what shouldn't you log?

### Practical Exercise:
- Give students vulnerable code snippets
- Ask them to identify the vulnerability
- Ask them to fix it

## Additional Resources

- [OWASP Top 10 2025](https://owasp.org/Top10/2025/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)

## Feedback & Improvement

After the workshop:
1. Collect student feedback
2. Note which concepts were difficult
3. Identify technical issues
4. Update materials accordingly

---

**Good luck with your workshop! 🎓🔒**
