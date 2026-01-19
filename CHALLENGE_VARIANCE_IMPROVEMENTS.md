# Challenge Variance Improvements

## Problem Statement

The original issue identified that challenges across different OWASP topics had too much repetition:

> "We need a good degree of variance in the challenges and examples. Like A01 cannot all be IDOR and API requests. We need to teach developers a broader understanding of the topics. Looking at the writeups I see that there is a lot of repetition of the same thing."

### Specific Issues Found

**Before Fix:**
- **A02 (Security Misconfiguration)**
- **A03 (Software Supply Chain Failures)**  
- **A04 (Cryptographic Failures)**

All three topics shared **identical challenges** with only superficial theme differences:
- Same endpoints: `/api/staff/system-info`, `/api/settings/config`, `/api/manager/login`
- Same flags: `FLAG{D3BUG_1NF0_3XP0S3D}`, `FLAG{C0NF1G_L34K3D}`, `FLAG{D3F4ULT_CR3DS_US3D}`
- Same vulnerabilities: debug endpoints, config leaks, default credentials
- Only differences: theme names (Coffee Shop, Books, Gym)

This violated the goal of providing a "box of chocolates" variety where each challenge teaches different aspects of its OWASP category.

---

## Solutions Implemented

### A02: Security Misconfiguration ✅

**Focus:** Configuration-level vulnerabilities at different layers

#### Lab 1: Debug Mode Enabled (System Info Exposure)
- **Endpoint:** `GET /api/staff/system-info`
- **Flag:** `FLAG{D3BUG_1NF0_3XP0S3D}` *(kept from original)*
- **Teaches:** Debug endpoints left in production
- **Why kept:** Good introduction to misconfiguration

#### Lab 2: Exposed .env File (NEW)
- **Endpoint:** `GET /.env`, `GET /.env.backup`
- **Flag:** `FLAG{3NV_F1L3_3XP0S3D}`
- **Teaches:** File-level misconfiguration, backup files
- **Difference:** Web server misconfiguration vs API endpoint exposure

#### Lab 3: Directory Listing Enabled (NEW)
- **Endpoint:** `GET /admin`
- **Flag:** `FLAG{D1R3CT0RY_L1ST1NG_3N4BL3D}`
- **Teaches:** Filesystem enumeration, autoindex vulnerabilities
- **Difference:** Directory structure exposure vs single file/endpoint

**Variance Achieved:** Three different layers of misconfiguration (API, file, directory)

---

### A03: Software and Data Supply Chain Failures ✅

**Focus:** Dependency and version-related vulnerabilities

#### Lab 1: Dependency Version Disclosure (NEW)
- **Endpoint:** `GET /api/staff/dependencies`
- **Flag:** `FLAG{V3RS10N_D1SCL0SUR3_D3P3ND3NC13S}`
- **Teaches:** Version disclosure enables CVE mapping
- **Real CVEs:** References lodash 4.17.11 (CVE-2019-10744), jsonwebtoken 8.3.0 (CVE-2022-23529)

#### Lab 2: package.json Exposed (NEW)
- **Endpoint:** `GET /package.json`
- **Flag:** `FLAG{P4CK4G3_J50N_3XP0S3D}`
- **Teaches:** Dependency tree exposure, transitive vulnerabilities
- **Includes:** Multiple real vulnerable package versions

#### Lab 3: Path Traversal via Vulnerable Dependency (NEW)
- **Endpoint:** `GET /api/files/download?file=../package.json`
- **Flag:** `FLAG{P4TH_TR4V3RS4L_VULN_D3P}`
- **Teaches:** Exploiting known CVEs in dependencies
- **Real CVEs:** Similar to CVE-2017-16119 (fresh), CVE-2020-28460 (path-parse)

**Variance Achieved:** Three different supply chain attack vectors (recon, discovery, exploitation)

---

### A04: Cryptographic Failures ✅

**Focus:** Actual cryptographic vulnerabilities

#### Lab 1: Base64 Encoding vs Encryption (NEW)
- **Endpoint:** `GET /api/member/token`
- **Flag:** `FLAG{B4S364_N0T_3NCRYPT10N}`
- **Teaches:** Common misunderstanding - encoding is not encryption
- **Practical:** Students decode Base64 to reveal sensitive data

#### Lab 2: MD5 Password Hashing (NEW)
- **Endpoint:** `GET /api/users/export`
- **Flag:** `FLAG{W34K_H4SH1NG_MD5_CR4CK3D}`
- **Teaches:** Weak hashing algorithms, rainbow tables
- **Tools:** Hashcat, John the Ripper, online crackers
- **Real hashes:** Actual MD5 hashes that can be cracked

#### Lab 3: Hardcoded Encryption Keys (NEW)
- **Endpoint:** `GET /api/secure/config`
- **Flag:** `FLAG{H4RDC0D3D_3NCRYPT10N_K3YS}`
- **Teaches:** Key management failures, Git secret exposure
- **Real-world:** References GitHub secret leaks, mobile app key extraction

**Variance Achieved:** Three fundamental crypto mistakes (encoding, hashing, key management)

---

## Summary of Changes

### Before vs After

| Topic | Before | After | Improvement |
|-------|--------|-------|-------------|
| **A02** | 3 similar API/auth issues | 3 distinct config layers | ✅ Different attack surfaces |
| **A03** | Same as A02 | 3 dependency-specific issues | ✅ True supply chain focus |
| **A04** | Same as A02 & A03 | 3 core crypto failures | ✅ Crypto fundamentals |

### Flags Changed

#### A02 (Misconfiguration)
- ~~`FLAG{C0NF1G_L34K3D}`~~ → `FLAG{3NV_F1L3_3XP0S3D}` (Lab 2)
- ~~`FLAG{D3F4ULT_CR3DS_US3D}`~~ → `FLAG{D1R3CT0RY_L1ST1NG_3N4BL3D}` (Lab 3)

#### A03 (Supply Chain)
- ~~`FLAG{D3BUG_1NF0_3XP0S3D}`~~ → `FLAG{V3RS10N_D1SCL0SUR3_D3P3ND3NC13S}` (Lab 1)
- ~~`FLAG{C0NF1G_L34K3D}`~~ → `FLAG{P4CK4G3_J50N_3XP0S3D}` (Lab 2)
- ~~`FLAG{D3F4ULT_CR3DS_US3D}`~~ → `FLAG{P4TH_TR4V3RS4L_VULN_D3P}` (Lab 3)

#### A04 (Crypto)
- ~~`FLAG{D3BUG_1NF0_3XP0S3D}`~~ → `FLAG{B4S364_N0T_3NCRYPT10N}` (Lab 1)
- ~~`FLAG{C0NF1G_L34K3D}`~~ → `FLAG{W34K_H4SH1NG_MD5_CR4CK3D}` (Lab 2)
- ~~`FLAG{D3F4ULT_CR3DS_US3D}`~~ → `FLAG{H4RDC0D3D_3NCRYPT10N_K3YS}` (Lab 3)

### Files Modified

#### Code Changes
- `labs/a02-misconfiguration/server.js` - Redesigned Lab 2 & Lab 3 endpoints
- `labs/a03-supply-chain/server.js` - Complete redesign of all 3 labs
- `labs/a04-crypto/server.js` - Complete redesign of all 3 labs

#### Documentation Updates
- `instructor/a02-misconfiguration.md` - Updated exploitation steps, vulnerable/secure code examples
- `instructor/a03-supply-chain.md` - New supply chain-focused writeup with CVE references
- `instructor/a04-crypto.md` - New crypto-focused writeup with tools and techniques

---

## Educational Value Improvements

### A02: Security Misconfiguration
**Before:** Repetitive API security issues  
**After:** Students learn three different misconfiguration layers
- Application level (debug endpoints)
- Web server level (.env files)
- Filesystem level (directory listing)

### A03: Supply Chain
**Before:** Generic security issues  
**After:** Students learn actual supply chain security
- Reconnaissance (version disclosure)
- Discovery (dependency mapping)
- Exploitation (vulnerable dependency CVEs)
- Real CVE examples for practical learning

### A04: Cryptographic Failures
**Before:** Generic security issues  
**After:** Students learn fundamental crypto mistakes
- Encoding vs encryption confusion
- Weak hashing algorithms (with practical cracking)
- Key management failures
- Practical tools: hashcat, bcrypt, Argon2

---

## Real-World Relevance

All new challenges are based on real-world vulnerabilities:

### CVE References Added
- **lodash 4.17.11**: CVE-2019-10744 (Prototype Pollution)
- **jsonwebtoken 8.3.0**: CVE-2022-23529 (Key confusion)
- **xml2js 0.4.19**: CVE-2023-0842 (Prototype Pollution)
- **Path traversal**: CVE-2017-16119, CVE-2020-28460

### Real-World Tools Introduced
- **hashcat** - GPU-based password cracking
- **John the Ripper** - Password hash cracking
- **bcrypt/Argon2** - Proper password hashing
- **npm audit** - Dependency vulnerability scanning
- **Snyk** - Supply chain security
- **truffleHog** - Secret detection in Git

---

## Testing Recommendations

To verify the changes work correctly:

1. **Start the labs:**
   ```bash
   docker-compose up -d lab-a02-misconfiguration lab-a03-supply-chain lab-a04-crypto
   ```

2. **Test A02 (Misconfiguration):**
   ```bash
   curl http://localhost:3002/api/staff/system-info  # Lab 1
   curl http://localhost:3002/.env                    # Lab 2
   curl http://localhost:3002/admin                   # Lab 3
   ```

3. **Test A03 (Supply Chain):**
   ```bash
   curl http://localhost:3003/api/staff/dependencies  # Lab 1
   curl http://localhost:3003/package.json            # Lab 2
   curl "http://localhost:3003/api/files/download?file=../package.json"  # Lab 3
   ```

4. **Test A04 (Crypto):**
   ```bash
   curl http://localhost:3004/api/member/token        # Lab 1
   curl http://localhost:3004/api/users/export        # Lab 2
   curl http://localhost:3004/api/secure/config       # Lab 3
   ```

---

## Conclusion

The "box of chocolates" goal has been achieved:
- ✅ Eliminated duplicate challenges across A02, A03, A04
- ✅ Each topic now teaches distinct vulnerability types
- ✅ Challenges are aligned with their OWASP category
- ✅ Real-world CVEs and tools are referenced
- ✅ Practical, hands-on learning experiences

Students will now experience genuine variety across the workshop, learning different aspects of each OWASP category rather than seeing the same challenges with different themes.
