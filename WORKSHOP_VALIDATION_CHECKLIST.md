# Workshop Validation Checklist

## Pre-Workshop Startup Tests

### ✅ Database Consistency
- [ ] Portal DB has 21 challenge INSERT statements (7 per OWASP topic except Citadel)
- [ ] All A07 flags use PAWSPA{} prefix
- [ ] All A09 flags use HARVEST{} prefix  
- [ ] All A10 flags use HARVEST{} prefix
- [ ] All other topics (A01-A06, A08) use NSA{} prefix

### ✅ Documentation Complete
- [ ] 12 instructor writeup files exist (A01-A10 + Citadel + README)
- [ ] A09 writeup covers all 3 labs with HARVEST flags
- [ ] A10 writeup covers all 3 labs with HARVEST flags
- [ ] All writeups match current lab implementations

### 🔧 System Startup Tests (Run Workshop)

```bash
# Start workshop
cd /home/runner/work/OwaspBootcamp/OwaspBootcamp
./start.sh

# OR manual start:
docker compose up -d

# Wait for services
sleep 30

# Check all containers running
docker compose ps
```

Expected: 13 containers running (portal, portal-db, citadel, citadel-db, lab-a01 through lab-a10)

### 🌐 Endpoint Accessibility Tests

Test each service is accessible:

```bash
# Portal
curl -I http://localhost:3100

# Citadel
curl -I http://localhost:3000

# All Labs
for i in {1..10}; do
  printf "A$(printf "%02d" $i): "
  curl -s -o /dev/null -w "%{http_code}" http://localhost:300$i
  echo ""
done
```

Expected: All return 200 OK

### 🏴 Flag Verification Tests

For each lab, test that flags match between portal DB and lab implementation:

#### A01 - Broken Access Control
```bash
# Lab implementation check
curl http://localhost:3001/api/example/part1/member/108 | grep "NSA{D3VT00LS_M4ST3R}"
curl http://localhost:3001/api/example/part2/test | grep "NSA{CURL_C0MM4ND3R}"
```

Expected: Flags found in responses

#### A07 - Authentication Failures (PAWSPA)
```bash
# Test Lab 1 weak password
curl -X POST http://localhost:3007/api/lab1/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123"}' | grep "PAWSPA{W3AK_PAWSW0RD_P0L1CY}"
```

Expected: PAWSPA flag returned

#### A09 - Logging (HARVEST)
```bash
# Test Lab 1 audit trail
curl -X DELETE http://localhost:3009/api/lab1/artworks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer curator_token" | grep "HARVEST{N0_4UD1T_TR41L}"
```

Expected: HARVEST flag returned

#### A10 - Exceptions (HARVEST)
```bash
# Test Lab 1 verbose errors
curl http://localhost:3010/api/lab1/artwork/invalid | grep "HARVEST{V3RB0S3_3RR0RS}"
```

Expected: HARVEST flag returned

### 📊 Portal Integration Tests

1. **User Registration:**
```bash
# Access portal
curl http://localhost:3100

# Register test user (requires UI interaction)
# - Visit http://localhost:3100
# - Create hacker alias
# - Verify dashboard loads
```

2. **Challenge Listing:**
```bash
# Get challenges from portal API
curl http://localhost:3100/api/challenges

# Verify all 51 challenges loaded:
# - A01-A10: 7 each (4 example parts + 3 labs) = 70 total
# - But some topics have fewer, expected ~50-55
```

3. **Flag Submission:**
```bash
# Submit a flag (requires authenticated session)
curl -X POST http://localhost:3100/api/submit-flag \
  -H "Content-Type: application/json" \
  -H "Cookie: session=YOUR_SESSION" \
  -d '{"challengeId": 1, "flag": "NSA{D3VT00LS_M4ST3R}"}'
```

Expected: `{"success": true, "message": "Correct flag!"}`

### 📚 Instructor Resources Tests

```bash
# Verify all writeups exist
ls -1 instructor/

# Expected files:
# - README.md
# - a01-broken-access.md
# - a02-misconfiguration.md
# - a03-supply-chain.md
# - a04-crypto.md
# - a05-injection.md
# - a06-insecure-design.md
# - a07-auth-failures.md
# - a08-integrity.md
# - a09-logging.md          ← NEW
# - a10-exceptions.md       ← NEW
# - citadel.md

# Open interactive viewer
open instructor/index.html
# OR
firefox instructor/index.html
```

Expected: All 12 files present, viewer works

### 🎓 End-to-End Workshop Simulation

**Scenario:** New student completes first challenge

1. **Portal Setup** (5 min)
   - [ ] Student visits http://localhost:3100
   - [ ] Creates hacker alias successfully
   - [ ] Dashboard shows all challenges
   - [ ] Progress tracker shows 0% complete

2. **A01 Example Part 1** (10 min)
   - [ ] Student opens http://localhost:3001/example
   - [ ] Reads tutorial steps
   - [ ] Opens DevTools (F12)
   - [ ] Finds API call to /api/example/part1/member/108
   - [ ] Sees flag: NSA{D3VT00LS_M4ST3R}
   - [ ] Submits flag in portal
   - [ ] Portal accepts flag and updates progress

3. **A01 Lab 1** (15 min)
   - [ ] Student opens http://localhost:3001/lab1
   - [ ] Explores employee directory
   - [ ] Discovers /api/members endpoint
   - [ ] Tests different user IDs
   - [ ] Finds user with ID 105
   - [ ] Gets flag: NSA{F0UND_TH3_US3RS}
   - [ ] Submits in portal
   - [ ] Progress updates to show Lab 1 complete

4. **Instructor Verification**
   - [ ] Opens instructor/a01-broken-access.md
   - [ ] Follows solution steps
   - [ ] Verifies exploitation works as documented
   - [ ] Can explain vulnerability to students

### 🐛 Common Issues to Check

**Issue: Portal won't connect to database**
```bash
# Check portal logs
docker compose logs portal

# Look for: "Database connection established"
# If "ETIMEDOUT" - networking issue (Ubuntu)
```

**Issue: Labs return 404**
```bash
# Check which containers are running
docker compose ps

# Restart specific lab
docker compose restart lab-a01-broken-access
```

**Issue: Flags don't match**
```bash
# Check current flags in portal DB
docker compose exec portal-db psql -U portal_user -d portal -c \
  "SELECT owasp_category, title, flag FROM challenges WHERE owasp_category IN ('A07', 'A09', 'A10');"

# Should show PAWSPA for A07, HARVEST for A09 and A10
```

**Issue: Instructor writeups missing**
```bash
# Verify files created
ls -lh instructor/a09-logging.md
ls -lh instructor/a10-exceptions.md

# Should both exist and be >20KB
```

## Success Criteria

Workshop is ready when:
- ✅ All 13 containers start successfully
- ✅ All 12 lab URLs are accessible (portal + citadel + 10 labs)
- ✅ Portal loads and allows user registration
- ✅ All challenges appear in portal dashboard
- ✅ Sample flag can be submitted and accepted
- ✅ All instructor writeups are accessible
- ✅ No flag mismatches between DB and labs
- ✅ A07 uses PAWSPA prefix
- ✅ A09/A10 use HARVEST prefix
- ✅ End-to-end challenge completion works

## Known Limitations (To be addressed in future PRs)

- ⚠️ Labs use simplistic vulnerability patterns (flags in responses)
- ⚠️ Examples are too obvious (explicit hints everywhere)
- ⚠️ Doesn't reflect real-world code patterns
- ⚠️ Requires minimal reconnaissance

See `REALISM_IMPROVEMENTS.md` and `CRITICAL_TRADEOFF_DECISION.md` for details on future improvements.
