# OWASP Bootcamp - Student Guide 🎭

## Welcome to NotSoAnonymous! 👋

You're about to join the **NotSoAnonymous hacker collective** and learn about the most critical security vulnerabilities in web applications through hands-on practice targeting **Evil Capitalistic Corp (ECC)**. This guide will help you get started on your mission.

## 🎯 The Mission

Evil Capitalistic Corp has terrible security practices, and it's your job to expose them! You'll learn real-world hacking techniques following professional attack methodology:

1. **Recon** 🔍 - Gather intelligence about the target
2. **Scanning** 📡 - Identify vulnerabilities
3. **Initial Access** 🔓 - Exploit vulnerabilities to gain entry
4. **Maintained Access** 🔐 - Establish persistence (advanced)
5. **Cover Tracks** 👻 - Hide your activities (advanced)

## What You'll Learn

By the end of this workshop, you'll understand:
- The OWASP Top 10 2025 vulnerabilities
- How attackers exploit these vulnerabilities
- How to write secure code to prevent them
- How to test applications for security issues

## Setup Instructions

### Prerequisites
- Docker Desktop installed and running
- Web browser (Chrome, Firefox, or Edge recommended)
- Text editor (VS Code, Notepad++, etc.) for viewing code

### Starting the Workshop

1. **Open Terminal/PowerShell** in the workshop directory

2. **Start all services (including the portal):**
   ```bash
   docker compose up -d
   ```
   
3. **Wait for containers to start** (30-60 seconds)

4. **Verify everything is running:**
   ```bash
   docker compose ps
   ```
   
   You should see 14 containers running (portal + portal-db + citadel + citadel-db + 10 labs).

5. **🎭 Open your browser** and navigate to http://localhost:3100
   - This is your **Mission Control** - the NotSoAnonymous Portal
   - Create your hacker identity on first visit
   - Track your progress through all challenges

## Lab Structure

### 0. **NotSoAnonymous Portal** - Your Mission Control (NEW! ⭐)

**Access:** http://localhost:3100

Your central hub where you:
- Set up your hacker identity (username, password, hacker alias)
- View all challenges organized by hacking stage
- Track completion progress
- Submit flags when you complete challenges
- Get your diploma when you complete 100% 🎉
- Enjoy the epic hacker-themed design!

### 1. **Instructional Labs** (Ports 3001-3010)

Each lab teaches ONE vulnerability:

| Lab | URL | What You'll Learn |
|-----|-----|-------------------|
| A01 | http://localhost:3001 | Broken Access Control |
| A02 | http://localhost:3002 | Security Misconfiguration |
| A03 | http://localhost:3003 | Supply Chain Failures |
| A04 | http://localhost:3004 | Cryptographic Failures |
| A05 | http://localhost:3005 | Injection Attacks |
| A06 | http://localhost:3006 | Insecure Design |
| A07 | http://localhost:3007 | Authentication Failures |
| A08 | http://localhost:3008 | Integrity Failures |
| A09 | http://localhost:3009 | Logging Failures |
| A10 | http://localhost:3010 | Exception Mishandling |

**Each lab shows:**
- ❌ A vulnerable implementation
- ✅ A secure implementation
- 📚 Explanation of the vulnerability

### 2. **Citadel Challenge** (Port 3000)

The Citadel is a complete web application with ALL 10 vulnerabilities. Your mission:
- Find and exploit each vulnerability
- Break through the security layers
- Apply what you learned in the instructional labs

**Access:** http://localhost:3000

## How to Use the Workshop

### Recommended Workflow:

**START HERE:** Visit http://localhost:3100

1. **Set up your hacker identity** (first visit)
   - Choose a username and password
   - Pick a cool hacker alias (optional but recommended!)
   - This is stored locally only - never sent externally

2. **Explore Mission Control Dashboard**
   - View all hacking stages
   - See your progress and points
   - Choose which stage to start with

3. **Work Through Challenges by Stage**
   - Click on a stage (e.g., "Recon")
   - Read each challenge description
   - Click the lab URL to access the vulnerable app
   - Find and exploit the vulnerability
   - Look for the flag (format: NSA{...})
   - Submit the flag in the portal
   - Get points and move to next challenge!

4. **Follow the Attack Methodology**
   - Start with **Recon** - Learn to gather information
   - Move to **Scanning** - Identify vulnerabilities
   - Then **Initial Access** - Exploit and gain entry
   - (Optional) Advanced stages for extra credit

5. **Celebrate Your Victory! 🎉**
   - Complete all challenges to get 100%
   - Watch the epic victory animation
   - Get your NotSoAnonymous diploma
   - Share your achievement!

### Step 1: Portal-Guided Learning (Recommended for Most Students)

Use the portal to guide you through challenges organized by hacking stages:

1. **Visit** http://localhost:3100
2. **Set up** your hacker identity
3. **Pick a stage** (start with Recon)
4. **Complete challenges** in that stage
5. **Submit flags** to track progress
6. **Move to next stage**

The portal tracks everything and shows you exactly what to do next!

### Step 2: Direct Lab Exploration (Alternative Approach)

If you prefer exploring labs directly without the portal:

1. **Visit** individual lab URLs (3001-3010)
2. **Read** the vulnerability explanation
3. **Try** the vulnerable endpoint
4. **Compare** with the secure implementation
5. **Take notes** on key concepts

But remember: The portal makes it way more fun and tracks your progress!

### Step 3: Citadel Challenge

After completing instructional labs:

1. **Visit** http://localhost:3000
2. **Explore** the application
3. **Find** the 10 vulnerabilities
4. **Exploit** each one using techniques from the labs
5. **Document** your findings

## Tips for Success

### Do ✅
- Take your time - understanding is more important than speed
- Experiment and try different inputs
- Ask questions when stuck
- Take notes on key concepts
- Think like an attacker AND a defender

### Don't ❌
- Skip the instructional labs
- Give up if something doesn't work immediately
- Worry about breaking anything - these are isolated containers
- Be afraid to ask for help

## Common Issues & Solutions

### Can't Access a Lab
**Problem:** Browser shows "Can't connect"  
**Solution:**
```bash
# Check if containers are running
docker compose ps

# If not running, start them
docker compose up -d

# Check logs for errors
docker compose logs citadel
```

### Containers Won't Start
**Problem:** Docker compose up fails  
**Solution:**
```bash
# Check Docker Desktop is running
# Restart Docker Desktop if needed

# Check for port conflicts
# Close applications using ports 3000-3010

# Try rebuilding
docker compose build --no-cache
docker compose up -d
```

### Port Already in Use
**Problem:** Port 3000 is already in use  
**Solution:** Stop the conflicting application or ask your instructor for help

### Out of Memory
**Problem:** Docker runs out of memory  
**Solution:**
```bash
# Stop all containers
docker compose down

# Start only the lab you're working on
docker compose up -d lab-a01-broken-access
```

## Practice Scenarios

### Scenario 1: Access Control
You're testing user profile access. Can you:
1. View your own profile?
2. View another user's profile?
3. Access admin data?

### Scenario 2: SQL Injection
You're testing a search feature. Can you:
1. Search for products normally?
2. Use special characters to break the query?
3. Extract data from other tables?

### Scenario 3: Authentication
You're testing login functionality. Can you:
1. Log in with weak passwords?
2. Predict session tokens?
3. Stay logged in forever?

## Key Concepts to Remember

### Security Fundamentals
1. **Never trust user input** - Always validate and sanitize
2. **Defense in depth** - Multiple layers of security
3. **Principle of least privilege** - Give minimum necessary access
4. **Fail securely** - Deny access when errors occur
5. **Security by design** - Think about security from the start

### Common Patterns
- **Vulnerable**: String concatenation for SQL queries
- **Secure**: Parameterized queries

- **Vulnerable**: Predictable session IDs (1, 2, 3...)
- **Secure**: Random, cryptographically secure tokens

- **Vulnerable**: Client-side validation only
- **Secure**: Server-side validation always

## After the Workshop

### Continue Learning
- [OWASP Top 10](https://owasp.org/Top10/2025/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security) (Free!)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [HackTheBox](https://www.hackthebox.com/)
- [TryHackMe](https://tryhackme.com/)

### Practice More
- Set up OWASP WebGoat
- Join CTF competitions
- Read security blogs
- Follow security researchers on Twitter/X

### Contribute
- Report bugs in your applications
- Share knowledge with your team
- Participate in bug bounty programs
- Join the OWASP community

## Cleanup

When done with the workshop:

```bash
# Stop all containers
docker compose down

# Remove everything including volumes
docker compose down -v

# Remove images too (optional)
docker compose down --rmi all
```

## Important Reminders

⚠️ **WARNING**: 
- These are DELIBERATELY VULNERABLE applications
- NEVER deploy them to production
- NEVER expose them to the internet
- ONLY use for learning in isolated environments

## Getting Help

During the workshop:
1. Check this guide first
2. Review the lab instructions
3. Ask your neighbor
4. Raise your hand for instructor help

After the workshop:
- OWASP community forums
- Security Stack Exchange
- Your local security meetup

---

## Quick Reference

### Essential Commands

```bash
# Start everything
docker compose up -d

# Stop everything
docker compose down

# View logs
docker compose logs -f

# Check status
docker compose ps

# Restart a service
docker compose restart citadel

# Start one lab only
docker compose up -d lab-a01-broken-access
```

### All Lab URLs

- Citadel: http://localhost:3000
- A01: http://localhost:3001
- A02: http://localhost:3002
- A03: http://localhost:3003
- A04: http://localhost:3004
- A05: http://localhost:3005
- A06: http://localhost:3006
- A07: http://localhost:3007
- A08: http://localhost:3008
- A09: http://localhost:3009
- A10: http://localhost:3010

---

**Have fun learning! Remember: Security is everyone's responsibility.** 🔒

**Questions?** Ask your instructor!
