# NotSoAnonymous Portal - Feature Guide

## 🎭 Overview

The NotSoAnonymous Portal is the central mission control for the OWASP Bootcamp workshop. It provides a gamified, hacker-themed experience that tracks student progress through all security challenges.

## 🚀 Key Features

### 1. First-Time Setup
**URL:** http://localhost:3100/setup

On first visit, students create their hacker identity:
- **Username:** Local account (not shared externally)
- **Password:** Secure, bcrypt-hashed storage
- **Hacker Alias:** Optional cool name (e.g., "CyberPhantom", "DataGhost")

**Security:** All data stored locally only, never sent to external servers.

### 2. Mission Control Dashboard
**URL:** http://localhost:3100/dashboard

The main hub featuring:
- **Progress Overview:** 4 stat cards showing:
  - Challenges Pwned (completed count)
  - Total Challenges (16 total)
  - Reputation Points (100-300 pts per challenge)
  - Mission Complete percentage
  
- **Progress Bar:** Animated visual progress with glowing effects

- **Attack Methodology Stages:** 5 cards representing hacking phases:
  1. 🔍 **Recon** - Reconnaissance (3 challenges)
  2. 📡 **Scanning** - Vulnerability identification (3 challenges)
  3. 🔓 **Initial Access** - Exploitation (4 challenges)
  4. 🔐 **Maintained Access** - Persistence (2 challenges, optional)
  5. 👻 **Cover Tracks** - Cleanup (2 challenges, optional)

### 3. Stage Challenge Pages
**URL:** http://localhost:3100/stage/{stage_id}

Each stage page displays:
- **Stage Description:** Context for the attack phase
- **Challenge Cards:** Each showing:
  - Title and OWASP category (A01-A10)
  - Difficulty badge (Easy/Medium/Hard/Expert)
  - Points value
  - Real-world scenario description
  - Link to target lab (3001-3010)
  - Collapsible hint section
  - Flag submission form
  - Attempt counter

- **Real-time Flag Submission:**
  - Enter flag format: NSA{...}
  - Instant feedback (success/failure)
  - Automatic redirect to victory page at 100%

### 4. Victory/Diploma Page
**URL:** http://localhost:3100/victory

Celebratory page featuring:
- **Animated confetti** in hacker colors
- **Glitch effects** on title
- **Digital diploma** with:
  - Student's hacker alias
  - Completion date
  - Total points earned
  - List of skills mastered
  - "NotSoAnonymous Collective" signature
  
- **Share功能:** Copy achievement to clipboard for social media
- **Continuous animations:** Floating emojis and confetti

## 🎨 Design Theme

### Cyberpunk/Hacker Aesthetic
- **Color Palette:**
  - Terminal Green: #00ff41
  - Neon Blue: #00d4ff
  - Neon Pink: #ff006e
  - Neon Purple: #8b5cf6
  - Warning Red: #ff0040
  - Dark backgrounds with transparency

- **Visual Effects:**
  - Animated background grid
  - Scanline overlay effect
  - Glowing text shadows
  - Hover animations and transitions
  - Pulsing progress bars
  - Floating elements

- **Typography:**
  - **Headings:** Orbitron (futuristic, bold)
  - **Body:** Share Tech Mono (monospace, terminal-like)

### Meme-Worthy Elements
- 🎭 NotSoAnonymous collective branding
- 💀 Evil Capitalistic Corp as the target
- Sarcastic security commentary
- CTF-style flags with l33t speak: NSA{FL4G_H3R3}
- Victory screen quote: "We are all script kiddies on this blessed day"

## 🗄️ Database Schema

### Tables

**portal_users:**
- id (serial PK)
- username (unique)
- password_hash (bcrypt)
- hacker_alias
- created_at

**challenge_stages:**
- id (serial PK)
- stage_name (Recon, Scanning, etc.)
- stage_order (1-5)
- description
- icon (emoji)

**challenges:**
- id (serial PK)
- stage_id (FK)
- owasp_category (A01-A10)
- title
- description
- difficulty (Easy/Medium/Hard/Expert)
- points (100-300)
- flag (NSA{...})
- hint
- lab_url

**user_progress:**
- id (serial PK)
- user_id (FK)
- challenge_id (FK)
- completed (boolean)
- completed_at
- flag_submitted
- attempts

## 🔒 Security Considerations

### What's Intentionally Vulnerable (For Learning)
- The target labs (ports 3001-3010) contain OWASP vulnerabilities
- The Citadel app (port 3000) is intentionally vulnerable

### What's Secure (Portal Itself)
- ✅ Bcrypt password hashing
- ✅ Parameterized SQL queries (no injection)
- ✅ HttpOnly cookies
- ✅ Local-only operation (no external APIs)
- ✅ Session validation on every request
- ✅ Input validation on forms

## 📊 Challenge Mapping

### By OWASP Category:
- **A01 (Broken Access):** Scanning, Maintained Access
- **A02 (Misconfiguration):** Recon
- **A03 (Supply Chain):** Scanning
- **A04 (Crypto Failures):** Initial Access
- **A05 (Injection):** Initial Access
- **A06 (Insecure Design):** Scanning
- **A07 (Auth Failures):** Initial Access, Maintained Access
- **A08 (Integrity):** Initial Access
- **A09 (Logging):** Recon, Cover Tracks
- **A10 (Exceptions):** Recon, Cover Tracks

### By Hacking Stage:
- **Recon (Passive):** Information gathering, no exploitation
- **Scanning (Active):** Probing, vulnerability identification
- **Initial Access:** Exploitation to gain entry
- **Maintained Access:** Persistence, privilege escalation
- **Cover Tracks:** Log manipulation, evidence removal

## 🎯 Learning Objectives

Students will:
1. **Understand** real-world attack methodology
2. **Practice** each phase of a security assessment
3. **Map** OWASP vulnerabilities to attack stages
4. **Experience** gamified learning with CTF-style challenges
5. **Build** confidence through progressive difficulty
6. **Celebrate** achievements with tangible rewards

## 🔧 Technical Stack

- **Backend:** Node.js + Express
- **Database:** PostgreSQL 16
- **Template Engine:** EJS
- **Styling:** Custom CSS with animations
- **Authentication:** bcrypt + cookie-based sessions
- **Deployment:** Docker Compose

## 📝 Flag Format

All flags follow the format: `NSA{SOMETHING_IN_L33T_SP34K}`

Examples:
- `NSA{DEBUG_1S_N0T_4_F3ATUR3}`
- `NSA{1NJ3CT_Y0UR_W4Y_1N}`
- `NSA{N0_L0GS_N0_CR1M3}`

## 🎬 User Journey

1. **First Visit:** Redirected to /setup
2. **Create Identity:** Choose username, password, alias
3. **Dashboard:** See all stages and progress
4. **Choose Stage:** Start with Recon (easiest)
5. **Complete Challenge:**
   - Read description
   - Access vulnerable lab
   - Find vulnerability
   - Discover flag
   - Submit in portal
   - Get points!
6. **Progress Through Stages:** Move from Recon → Scanning → Initial Access
7. **Achieve Victory:** Complete all challenges
8. **Receive Diploma:** Celebrate with animations
9. **Share Achievement:** Social media bragging rights

## 🌟 What Makes It "Meme-Worthy"

1. **Over-the-top hacker aesthetic** - Maximum cyberpunk vibes
2. **NotSoAnonymous collective** - Self-aware hacker group name
3. **Evil Capitalistic Corp** - Comically villainous target
4. **L33t speak flags** - Classic hacker culture
5. **Terminal green everywhere** - Hollywood hacker stereotype
6. **"Script kiddies" quote** - Humble self-deprecation
7. **Confetti on victory** - Unexpectedly wholesome celebration
8. **Glitch effects** - Maximum digital corruption aesthetics
9. **Floating emojis** - 💀🔥⚡🏴‍☠️
10. **"Pwned" terminology** - Classic gaming/hacking slang

This portal transforms a serious security workshop into an engaging, memorable experience that students will actually want to complete!
