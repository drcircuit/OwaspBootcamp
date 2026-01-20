# OWASP Bootcamp Workshop - NotSoAnonymous Edition 🎭

A comprehensive, hands-on workshop covering the OWASP Top 10 2025 security vulnerabilities with a **hacker-themed twist**! Join the NotSoAnonymous collective in exposing Evil Capitalistic Corp's security failures through real-world attack scenarios.

This workshop runs as a self-contained local cluster using Docker Compose with lightweight containers optimized for Azure VDI environments.

## 🎯 What's New in This Edition

### 🎭 NotSoAnonymous Portal - Mission Control
A brand new **student progress tracking portal** featuring:
- 🏆 Track your progress through all challenges
- 🎯 Follow real hacking methodology: Recon → Scanning → Initial Access → Maintained Access → Cover Tracks
- 🎉 **Epic victory animation and diploma** when you complete 100% of challenges
- 🔐 Local-only authentication (first-time setup on initial visit)
- 💀 Cyberpunk/hacker themed UI - totally meme-worthy!

### 🏴 The Storyline
You're part of the **NotSoAnonymous** hacker collective, and your mission is to expose the security failures of **Evil Capitalistic Corp (ECC)**. Each challenge represents a real-world vulnerability in their systems that you must identify and exploit.

### 🎯 Attack Methodology
Challenges are now organized by **professional hacking stages**:
1. **Recon** 🔍 - Passive information gathering about the target
2. **Scanning** 📡 - Active probing to identify vulnerabilities
3. **Initial Access** 🔓 - Exploitation to gain entry
4. **Maintained Access** 🔐 - Establishing persistence (optional advanced)
5. **Cover Tracks** 👻 - Hiding evidence of intrusion (optional advanced)

## 🎯 Workshop Structure

The workshop is divided into three modes:

### 1. **NotSoAnonymous Portal** (NEW! - Port 3100)
Your mission control hub where you:
- Set up your hacker identity on first visit
- Track progress through all challenges
- Follow the professional attack methodology
- Earn reputation points for each exploit
- Get your diploma when you complete 100%
- Experience epic hacker-themed design with animations

### 2. **Instructional Labs** (Individual Concepts)
Each OWASP Top 10 topic now follows a **structured learning path**:

#### **Example/Walkthrough** (1 per topic)
- Educational content explaining the vulnerability
- Side-by-side comparison of vulnerable vs. secure code
- Demonstrates proper tool usage (curl, Burp Suite, sqlmap)
- **NO exploit buttons** - teaches methodology, not shortcuts
- Some topics (A01, A05, A07) have multi-part examples teaching different tools

#### **Progressive Labs** (3 per topic)
- **Lab 1 (Easy)**: Recon/Scanning stage - discover the vulnerability
- **Lab 2 (Medium)**: Initial Access stage - exploit the vulnerability
- **Lab 3 (Hard)**: Maintained Access/Cover Tracks - advanced exploitation
- Subtle hints only - students must use real pentesting tools
- Each lab awards points and flags upon completion

### 3. **Citadel Mode** (Full Application - Final Exam)
A realistic vulnerable web application disguised as "Evil Capitalistic Corp" corporate website:
- **Looks like a real corporate website** - no OWASP references or educational hints
- Contains all OWASP Top 10 2025 vulnerabilities naturally integrated
- Students must discover and exploit vulnerabilities without guidance
- Break through multiple security layers to achieve objectives
- Practice complete penetration testing techniques
- Apply knowledge from all instructional labs
- Discover flags embedded naturally in the application

## 🔒 OWASP Top 10 2025 Coverage

Each topic includes **1 example + 3 progressive labs**:

| # | Vulnerability | Port | Structure |
|---|---------------|------|-----------|
| A01 | Broken Access Control | 3001 | Example + Lab 1 (Enumeration) + Lab 2 (IDOR) + Lab 3 (Privilege Escalation) |
| A02 | Security Misconfiguration | 3002 | Example + Lab 1 (Debug) + Lab 2 (Config Leak) + Lab 3 (Admin Panel) |
| A03 | Software Supply Chain | 3003 | Example + Lab 1 (Version Discovery) + Lab 2 (CVE Scanning) + Lab 3 (Path Traversal) |
| A04 | Cryptographic Failures | 3004 | Example + Lab 1 (Weak Hash) + Lab 2 (Crack Hash) + Lab 3 (Plaintext) |
| A05 | Injection | 3005 | Example + Lab 1 (Find Inputs) + Lab 2 (Detect SQLi) + Lab 3 (Auth Bypass) |
| A06 | Insecure Design | 3006 | Example + Lab 1 (Rate Limiting) + Lab 2 (Logic Flaw) + Lab 3 (Race Condition) |
| A07 | Authentication Failures | 3007 | Example + Lab 1 (Weak Password) + Lab 2 (Session Analysis) + Lab 3 (Session Hijacking) |
| A08 | Integrity Failures | 3008 | Example + Lab 1 (Update Mechanism) + Lab 2 (Missing Checksum) + Lab 3 (Malicious Upload) |
| A09 | Security Logging Failures | 3009 | Example + Lab 1 (Missing Logs) + Lab 2 (Log Leaks) + Lab 3 (Cover Tracks) |
| A10 | Exception Mishandling | 3010 | Example + Lab 1 (Trigger Errors) + Lab 2 (Stack Traces) + Lab 3 (Suppress Evidence) |
| **Citadel** | All Vulnerabilities (Exam) | 3000 | Realistic "Evil Capitalistic Corp" corporate site - all vulnerabilities, no OWASP hints |

## 🚀 Quick Start

### Prerequisites

- Docker (20.10+)
- Docker Compose (2.0+)
- 4GB RAM minimum
- 10GB disk space

### Starting the Workshop

**Recommended (especially on Ubuntu/Linux):**
```bash
# Clone the repository
git clone https://github.com/drcircuit/OwaspBootcamp.git
cd OwaspBootcamp

# Use the start script (handles Ubuntu networking issues automatically)
./start.sh
```

The start script will:
- Check Docker availability
- Detect and fix Ubuntu/Linux networking issues automatically
- Offer clean rebuild options
- Start all containers
- Verify connectivity

**Manual start (if you prefer):**
```bash
# Start all containers
docker compose up -d

# View logs
docker compose logs -f

# Stop all containers
docker compose down
```

### Starting Individual Labs

```bash
# Start only specific labs
docker compose up -d lab-a01-broken-access
docker compose up -d lab-a05-injection

# Start just the Citadel
docker compose up -d citadel citadel-db
```

## 📚 Lab Access

Once started, access the services at:

- **🎭 NotSoAnonymous Portal (Mission Control)**: http://localhost:3100 ⭐ **START HERE!**
- **Citadel (Main App)**: http://localhost:3000
- **A01 - Broken Access Control**: http://localhost:3001
- **A02 - Security Misconfiguration**: http://localhost:3002
- **A03 - Supply Chain Failures**: http://localhost:3003
- **A04 - Cryptographic Failures**: http://localhost:3004
- **A05 - Injection**: http://localhost:3005
- **A06 - Insecure Design**: http://localhost:3006
- **A07 - Authentication Failures**: http://localhost:3007
- **A08 - Integrity Failures**: http://localhost:3008
- **A09 - Logging Failures**: http://localhost:3009
- **A10 - Exception Mishandling**: http://localhost:3010

## 💻 Azure VDI Setup

For students using Azure VDI machines:

1. Ensure Docker Desktop is running
2. Open PowerShell or Command Prompt as Administrator
3. Navigate to the workshop directory
4. Run `docker-compose up -d`
5. Access labs via web browser at localhost addresses above

**Note**: Containers are optimized for low resource usage:
- Lightweight Alpine Linux base images
- Minimal dependencies
- Single-process containers
- No development dependencies in production builds

## 🎓 Workshop Flow

### Recommended Order:

1. **Portal Setup** (5 min)
   - Visit http://localhost:3100
   - Create your hacker identity
   - Get familiar with the mission control dashboard

2. **Introduction** (15 min)
   - OWASP Top 10 overview
   - Hacking methodology explanation
   - Workshop structure and goals

3. **Attack Stages** (3-4 hours)
   - **Stage 1: Recon** - Information gathering challenges
   - **Stage 2: Scanning** - Vulnerability identification
   - **Stage 3: Initial Access** - Exploitation and entry
   - Work through challenges in each stage
   - Submit flags to track progress
   - Instructor-led with hands-on practice

4. **Break** (15 min)

5. **Citadel Challenge** (2-3 hours)
   - Apply learned concepts to break the full Citadel app
   - Capture flags for each vulnerability
   - Group or individual work

6. **Victory Celebration** 🎉
   - Complete all challenges
   - Get your diploma
   - Share your achievement

7. **Review & Discussion** (30 min)
   - Share findings
   - Discuss real-world applications
   - Q&A

## 📚 For Instructors

**NEW:** Comprehensive instructor writeups now available!

The `instructor/` directory contains detailed play-by-play solutions for all challenges:
- **📖 Interactive Viewer:** Open `instructor/index.html` in your browser
- **📝 Individual Writeups:** Complete solutions for each OWASP topic (A01-A10) + Citadel
- **🎯 Teaching Resources:** Vulnerable code examples, secure implementations, common questions, and remediation checklists

See `instructor/README.md` for full details on using the writeups during workshops.

## ⚠️ Important Security Notice

**WARNING**: This workshop contains deliberately vulnerable applications for educational purposes only.

- ❌ **NEVER** deploy these applications to production
- ❌ **NEVER** expose these applications to the internet
- ❌ **NEVER** use these code patterns in real applications
- ✅ **ONLY** use in isolated, local development environments
- ✅ **ALWAYS** clean up containers after the workshop

## 🛠️ Troubleshooting

### Ubuntu: Cannot access localhost / Database connection timeouts

If you're on **Ubuntu/Linux** and experience either of these symptoms:
- Cannot access http://localhost:3100 (connection times out)
- Portal shows "Database error" or logs show `ETIMEDOUT` connecting to database
- Logs show: `connect ETIMEDOUT 172.x.x.x:5432`

This is due to Docker bridge networking issues on native Linux - containers cannot communicate with each other or with the host. The root cause is usually iptables FORWARD chain blocking traffic.

**Easiest fix - Use the start script:**
```bash
./start.sh
```
The start script automatically detects and fixes these issues.

**Quick manual fix:**
```bash
# Run the Ubuntu setup script to configure networking
sudo ./ubuntu-setup.sh

# Then restart containers
docker compose down
docker compose up -d
```

**What this fixes:**
- Enables IP forwarding (required for Docker bridge networking)
- Sets iptables FORWARD chain to ACCEPT (allows inter-container traffic)
- Restarts Docker to reset iptables rules
- Configures UFW to work with Docker (if UFW is active)
- Adds firewall rules for Docker bridge networks

**Manual fix (if script doesn't work):**
```bash
# 1. Enable IP forwarding
sudo sysctl -w net.ipv4.ip_forward=1
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf

# 2. Set iptables FORWARD chain to ACCEPT (critical!)
sudo iptables -P FORWARD ACCEPT

# 3. Add Docker-specific FORWARD rules
sudo iptables -I FORWARD -i docker0 -j ACCEPT
sudo iptables -I FORWARD -o docker0 -j ACCEPT

# 4. If using UFW, configure it to work with Docker
if command -v ufw &> /dev/null && ufw status | grep -q "active"; then
  # Allow Docker bridge networks
  sudo ufw allow from 172.25.0.0/16
  sudo ufw allow to 172.25.0.0/16
  
  # Add forwarding rules for Docker interfaces
  sudo sed -i '/^COMMIT$/i \
-A ufw-before-forward -i docker0 -j ACCEPT\n\
-A ufw-before-forward -o docker0 -j ACCEPT\n\
-A ufw-before-forward -i br-+ -j ACCEPT\n\
-A ufw-before-forward -o br-+ -j ACCEPT' /etc/ufw/before.rules
  
  sudo ufw reload
fi

# 5. Restart Docker
sudo systemctl restart docker

# 6. Restart containers
docker compose down
docker compose up -d
```

**Still not working?** Check:
- Container status: `docker compose ps`
- Container logs: `docker compose logs portal`
- Port binding: `docker compose port portal 3100`
- From inside container: `docker compose exec portal curl localhost:3100`

### Port conflicts / "address already in use"
If you see errors like `failed to bind host port... address already in use`, containers are already running.

```bash
# Stop all running containers first
docker compose down

# Or use the cleanup script
./cleanup.sh

# Then start fresh
docker compose up -d
```

### Containers won't start
```bash
# Check Docker is running
docker ps

# Stop any running containers
docker compose down

# Rebuild containers
docker compose build --no-cache
docker compose up -d
```

### Database schema errors (e.g., "column c.challenge_order does not exist")
If you see errors about missing columns when clicking on topics in the portal:

```bash
# Option 1: Restart the portal to run migrations (preferred)
docker compose restart portal

# Option 2: If restart doesn't work, recreate with fresh database
docker compose down -v
docker compose up -d
```

**Note:** The portal now automatically runs database migrations on startup to add any missing columns. Simply restarting the portal container should fix schema-related errors.

### Out of memory
```bash
# Stop unnecessary containers
docker compose down

# Start only needed labs
docker compose up -d lab-a01-broken-access
```

### Clean up everything
```bash
# Remove all containers and volumes
docker compose down -v

# Remove all images
docker compose down --rmi all
```

## 📖 Additional Resources

- [OWASP Top 10 2025](https://owasp.org/Top10/2025/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

## 📝 License

MIT License - See LICENSE file for details

## 👥 Contributing

This is an educational project. Contributions welcome via pull requests.

---

**Built for security education by the OWASP community** 🛡️ 
