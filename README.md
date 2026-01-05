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
Each lab focuses on a single OWASP vulnerability with:
- Clear explanation of the vulnerability
- Side-by-side comparison of vulnerable vs. secure code
- Interactive demonstrations
- Hands-on exercises
- Real-world context and tools

### 3. **Citadel Mode** (Full Application)
A complete vulnerable web application containing all OWASP Top 10 2025 vulnerabilities where students:
- Break through multiple security layers
- Practice penetration testing techniques
- Apply knowledge from instructional labs

## 🔒 OWASP Top 10 2025 Coverage

| # | Vulnerability | Port | Description |
|---|---------------|------|-------------|
| A01 | Broken Access Control | 3001 | Unauthorized access to resources |
| A02 | Security Misconfiguration | 3002 | Exposed debug endpoints, verbose errors |
| A03 | Software Supply Chain Failures | 3003 | Vulnerable dependencies, integrity issues |
| A04 | Cryptographic Failures | 3004 | Weak encryption, plain text passwords |
| A05 | Injection | 3005 | SQL, NoSQL, OS command injection |
| A06 | Insecure Design | 3006 | Flawed business logic, no rate limiting |
| A07 | Authentication Failures | 3007 | Weak passwords, predictable sessions |
| A08 | Software/Data Integrity Failures | 3008 | Unsigned updates, no checksums |
| A09 | Security Logging Failures | 3009 | Missing security event logging |
| A10 | Mishandling Exceptional Conditions | 3010 | Information disclosure via errors |
| **Citadel** | All Vulnerabilities | 3000 | Complete vulnerable web application |

## 🚀 Quick Start

### Prerequisites

- Docker (20.10+)
- Docker Compose (2.0+)
- 4GB RAM minimum
- 10GB disk space

### Starting the Workshop

```bash
# Clone the repository
git clone https://github.com/drcircuit/OwaspBootcamp.git
cd OwaspBootcamp

# Start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all containers
docker-compose down
```

### Starting Individual Labs

```bash
# Start only specific labs
docker-compose up -d lab-a01-broken-access
docker-compose up -d lab-a05-injection

# Start just the Citadel
docker-compose up -d citadel citadel-db
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

## ⚠️ Important Security Notice

**WARNING**: This workshop contains deliberately vulnerable applications for educational purposes only.

- ❌ **NEVER** deploy these applications to production
- ❌ **NEVER** expose these applications to the internet
- ❌ **NEVER** use these code patterns in real applications
- ✅ **ONLY** use in isolated, local development environments
- ✅ **ALWAYS** clean up containers after the workshop

## 🛠️ Troubleshooting

### Containers won't start
```bash
# Check Docker is running
docker ps

# Check port conflicts
netstat -ano | findstr :3000

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d
```

### Out of memory
```bash
# Stop unnecessary containers
docker-compose down

# Start only needed labs
docker-compose up -d lab-a01-broken-access
```

### Clean up everything
```bash
# Remove all containers and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all
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
