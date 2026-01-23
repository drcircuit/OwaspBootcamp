-- NotSoAnonymous Portal Database Schema

-- Users table for portal authentication
CREATE TABLE IF NOT EXISTS portal_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    hacker_alias VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Individual challenges mapped to OWASP Top 10
-- Each OWASP topic has its own natural progression: 1 example + 3 labs
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    owasp_category VARCHAR(10) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20),
    points INTEGER DEFAULT 100,
    flag VARCHAR(100),
    hint TEXT,
    lab_url VARCHAR(200),
    challenge_type VARCHAR(20) DEFAULT 'lab', -- 'example' or 'lab' or 'exam'
    lab_number INTEGER, -- 1, 2, 3 for labs; NULL for examples
    challenge_order INTEGER, -- Order within the OWASP topic (1=example, 2=lab1, 3=lab2, 4=lab3)
    tutorial TEXT, -- Step-by-step tutorial for examples
    mission_brief TEXT, -- Mission brief/hints for labs (call to action)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migration: Add missing columns to existing databases
-- These statements are safe to run multiple times (idempotent)
DO $$ 
BEGIN
    -- Add challenge_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='challenges' AND column_name='challenge_type') THEN
        ALTER TABLE challenges ADD COLUMN challenge_type VARCHAR(20) DEFAULT 'lab';
    END IF;
    
    -- Add lab_number column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='challenges' AND column_name='lab_number') THEN
        ALTER TABLE challenges ADD COLUMN lab_number INTEGER;
    END IF;
    
    -- Add challenge_order column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='challenges' AND column_name='challenge_order') THEN
        ALTER TABLE challenges ADD COLUMN challenge_order INTEGER;
    END IF;
    
    -- Add tutorial column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='challenges' AND column_name='tutorial') THEN
        ALTER TABLE challenges ADD COLUMN tutorial TEXT;
    END IF;
    
    -- Add mission_brief column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='challenges' AND column_name='mission_brief') THEN
        ALTER TABLE challenges ADD COLUMN mission_brief TEXT;
    END IF;
END $$;

-- Track user progress on challenges
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES portal_users(id),
    challenge_id INTEGER REFERENCES challenges(id),
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    flag_submitted VARCHAR(100),
    attempts INTEGER DEFAULT 0,
    UNIQUE(user_id, challenge_id)
);

-- Insert challenges with natural progression for each OWASP topic
-- Each topic: 1 example (order=1) + 3 labs (order=2,3,4)
-- Stages are implied by the progression within each topic

-- ========================================
-- A01: BROKEN ACCESS CONTROL
-- Natural Progression: Understanding → Enumeration → Exploitation → Escalation
-- ========================================
-- Example consists of multiple sub-challenges demonstrating all tools
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A01', 'A01 Example Part 1: Browser DevTools', 'Use browser DevTools to inspect API requests and responses.', 'Tutorial', 10, 'NSA{D3VT00LS_M4ST3R}', 'Open DevTools (F12) and check Network tab', 'http://localhost:3001/example', 'example', NULL, 1, 
    '**Step 1:** Open the example page at http://localhost:3001/example
**Step 2:** Press F12 (or right-click and select "Inspect") to open Browser DevTools
**Step 3:** Click on the "Network" tab to see all network requests
**Step 4:** Interact with the page - click buttons, submit forms
**Step 5:** Watch the Network tab to see API requests being made
**Step 6:** Click on a request to see details: headers, response data, timing
**Step 7:** Look for the flag in the API response data
**Pro Tip:** The Network tab shows everything your browser sends and receives - this is crucial for understanding how web apps work!', NULL),
    ('A01', 'A01 Example Part 2: Using cURL', 'Learn to use cURL for making HTTP requests to test endpoints.', 'Tutorial', 10, 'NSA{CURL_C0MM4ND3R}', 'Use curl to make GET requests', 'http://localhost:3001/example', 'example', NULL, 2,
    '**Step 1:** Open your terminal or command prompt
**Step 2:** Type: `curl http://localhost:3001/api/example/part2/test`
**Step 3:** Press Enter and observe the response
**Step 4:** Try adding the -v flag for verbose output: `curl -v http://localhost:3001/api/example/part2/test`
**Step 5:** Look for the flag in the response
**Step 6:** Practice making different requests to understand HTTP methods
**Why cURL?** It''s a command-line tool that lets you make HTTP requests without a browser - essential for automation and testing!', NULL),
    ('A01', 'A01 Example Part 3: Burp Suite Basics', 'Use Burp Suite to intercept and modify HTTP requests.', 'Tutorial', 10, 'NSA{BURP_1NT3RC3PT0R}', 'Configure browser proxy and use Burp Repeater', 'http://localhost:3001/example', 'example', NULL, 3,
    '**Step 1:** Start Burp Suite and go to the "Proxy" tab
**Step 2:** Configure your browser to use proxy (127.0.0.1:8080)
**Step 3:** Turn "Intercept" ON in Burp Suite
**Step 4:** Visit http://localhost:3001/example in your browser
**Step 5:** See the intercepted request in Burp - you can now modify it!
**Step 6:** Try changing URL parameters or adding new ones
**Step 7:** Forward the modified request and observe the response
**Step 8:** Use "Repeater" to send requests multiple times with different modifications
**Power Move:** Burp lets you see AND modify requests before they reach the server - perfect for security testing!', NULL),
    ('A01', 'A01 Example Part 4: ID Enumeration', 'Practice enumerating user IDs systematically.', 'Tutorial', 20, 'NSA{3NUM3R4T10N_PR0}', 'Iterate through sequential IDs', 'http://localhost:3001/example', 'example', NULL, 4,
    '**Step 1:** Start with a known endpoint: http://localhost:3001/api/example/part4/enumerate/100
**Step 2:** Notice it returns user data for ID 100
**Step 3:** Try ID 101, then 102, 103... spot the pattern?
**Step 4:** Use a loop to automate this: `for i in {100..110}; do curl http://localhost:3001/api/example/part4/enumerate/$i; done`
**Step 5:** Collect all the user data you find
**Step 6:** The flag will appear when you enumerate enough users
**Hacker Wisdom:** Sequential IDs are dangerous because they let attackers discover all resources systematically. This is called "enumeration" - a key recon technique!', NULL);

-- Lab 1 (Enumeration) - Easy
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A01', 'A01 Lab 1: Employee Directory Enumeration', 'Discover all employees in TechCorp''s directory system.', 'Easy', 100, 'NSA{F0UND_TH3_US3RS}', 'API endpoints might be discoverable', 'http://localhost:3001/lab1', 'lab', 1, 5, NULL,
    '**MISSION BRIEF:** Agent, TechCorp Global''s HR portal is your first target. Intelligence suggests their employee directory may have API endpoints that lack proper access controls.

**YOUR OBJECTIVE:** Map the entire employee base. Discover names, titles, emails, and organizational structure.

**WHAT WE KNOW:**
- Target: http://localhost:3001/lab1
- The directory system uses APIs to retrieve employee data
- Employee records exist but may not all be visible through the UI

**YOUR MISSION:**
1. Discover hidden API endpoints
2. Enumerate all employee records in the system
3. Extract the flag hidden in one of the employee profiles

**RECOMMENDED TOOLS:** gobuster, curl, browser DevTools

Success means complete visibility into TechCorp''s organizational structure. 🎯');

-- Lab 2 (Exploitation) - Medium
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A01', 'A01 Lab 2: Profile Data Breach', 'Access sensitive employee profile information.', 'Medium', 150, 'NSA{C00K13_M4N1PUL4T10N}', 'Check your browser cookies', 'http://localhost:3001/lab2', 'lab', 2, 6, NULL,
    '**MISSION BRIEF:** Your reconnaissance revealed TechCorp''s employee roster. Now it''s time to access confidential data.

**YOUR OBJECTIVE:** Access another employee''s private profile to extract sensitive compensation and personal information.

**THE TARGET:** http://localhost:3001/lab2 - The employee profile system

**WHAT YOU''RE AFTER:**
- Salary and compensation details
- Social Security Numbers
- Performance ratings
- Stock options and equity

**YOUR MISSION:**
1. Access your own profile to understand the system
2. Identify the authentication mechanism
3. Bypass access controls to view other employees'' profiles
4. Extract sensitive data from unauthorized profiles

**RECOMMENDED TOOLS:** Browser DevTools (Application tab), curl, Burp Suite

The flag will appear when you successfully access another employee''s confidential data. 💼🔓');

-- Lab 3 (Escalation) - Hard
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A01', 'A01 Lab 3: Privilege Escalation', 'Escalate privileges to gain administrator access.', 'Hard', 200, 'NSA{PR1V1L3G3_3SC4L4T10N}', 'Authorization might be client-side', 'http://localhost:3001/lab3', 'lab', 3, 7, NULL,
    '**MISSION BRIEF:** Excellent progress, agent. You''ve accessed employee profiles. Now it''s time for the ultimate challenge: administrative access.

**YOUR OBJECTIVE:** Break into the HR Admin Dashboard and gain full administrative control over TechCorp''s personnel system.

**THE TARGET:** http://localhost:3001/lab3 - The HR Admin Dashboard

**WHAT ADMINISTRATIVE ACCESS PROVIDES:**
- Complete organizational chart and reporting structure
- C-suite compensation data
- System-wide analytics and statistics
- Full access to all employee records
- Performance metrics and audit trails

**YOUR MISSION:**
1. Attempt to access the admin dashboard with your current credentials
2. Analyze how the system determines authorization levels
3. Identify weaknesses in the privilege checking mechanism
4. Escalate your privileges to administrator level
5. Extract the flag from the admin dashboard

**RECOMMENDED TOOLS:** Browser DevTools (Application/Network tabs), curl with headers

**THE CHALLENGE:** This isn''t about accessing another user''s data - it''s about changing your own access level. How does the system know whether you''re an admin? 👑🔓');

-- ========================================
-- A02: SECURITY MISCONFIGURATION
-- Natural Progression: Discovery → Analysis → Exploitation → Access
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A02', 'A02 Example: Debug Endpoints', 'Learn how security misconfigurations expose sensitive information.', 'Tutorial', 50, 'NSA{DEBUG_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3002/example', 'example', NULL, 1,
    '**Step 1:** Visit http://localhost:3002/example to see the vulnerable application
**Step 2:** Look for common debug endpoints like /debug, /api/debug, /status, /health
**Step 3:** Try accessing http://localhost:3002/api/debug - notice what information is exposed!
**Step 4:** Check for configuration files at /config, /.env, /api/config
**Step 5:** Look for stack traces or verbose error messages that reveal system details
**Step 6:** Common misconfigurations include: default credentials, exposed admin panels, unnecessary services running
**Key Lesson:** Production systems should NEVER have debug mode enabled or expose internal system information. Attackers use this data to plan more sophisticated attacks!', NULL),
    ('A02', 'A02 Lab 1: Find Debug Info', 'Discover exposed debug endpoints that leak information.', 'Easy', 100, 'NSA{D3BUG_F0UND}', 'Common debug paths', 'http://localhost:3002/lab1', 'lab', 1, 2, NULL,
    '**MISSION BRIEF:** Agent, we''ve identified Evil Corp''s BookWise Library system as a soft target. Our intel suggests they left debug features enabled in production - a rookie mistake!

**YOUR OBJECTIVE:** Discover what debug information they''re leaking that could aid our future attacks.

**TARGET:** http://localhost:3002/lab1
**ATTACK SURFACE:** Web applications often expose debug endpoints during development and forget to disable them before going live.

**COMMON DEBUG PATHS TO CHECK:**
- /debug
- /api/debug  
- /status
- /health
- /info
- /metrics

**WHAT TO LOOK FOR:**
- System configuration details
- Database connection strings
- Internal API endpoints
- Version information
- Stack traces

Debug information gives attackers a roadmap of your system''s internals. Find what they''re exposing! 🔍'),
    ('A02', 'A02 Lab 2: Configuration Leak', 'Extract sensitive configuration data from exposed endpoints.', 'Medium', 150, 'NSA{C0NF1G_L3AK3D}', 'Check for config files', 'http://localhost:3002/lab2', 'lab', 2, 3, NULL,
    '**MISSION BRIEF:** Good work locating their debug endpoint, agent. Now let''s dig deeper into their configuration.

**YOUR OBJECTIVE:** Extract sensitive configuration data that CloudDeploy has carelessly exposed.

**THE VULNERABILITY:** Many applications store configuration in files like .env, config.json, or expose them via API endpoints. If these aren''t properly protected, attackers can read credentials, API keys, and system secrets.

**YOUR MISSION:**
1. Access http://localhost:3002/lab2
2. Look for configuration file paths or endpoints
3. Common targets: /api/config, /.env, /config.json, /settings
4. Extract any exposed credentials or sensitive data

**WHAT YOU''RE HUNTING FOR:**
- Database credentials
- API keys and tokens
- Admin passwords
- Internal service URLs
- Secret keys used for encryption

**PRO TIP:** Configuration files often contain the "keys to the kingdom" - everything needed to compromise the entire system. This is why proper access controls on config data are critical!

Extract their secrets and claim your flag! 🗝️'),
    ('A02', 'A02 Lab 3: Admin Panel Access', 'Leverage misconfigurations to access the admin panel.', 'Hard', 200, 'NSA{4DM1N_P4N3L_PWN3D}', 'Default credentials exist', 'http://localhost:3002/lab3', 'lab', 3, 4, NULL,
    '**MISSION BRIEF:** Excellent reconnaissance, agent. You''ve mapped CloudDeploy''s debug endpoints and extracted their AWS credentials. Now it''s time to weaponize that intelligence.

**YOUR OBJECTIVE:** Gain unauthorized administrative access to CloudDeploy''s platform control panel.

**THE SCENARIO:** You''ve discovered an admin panel at http://localhost:3002/lab3 requiring authentication. Our intel suggests they made a fatal mistake: using default credentials in production.

**DEFAULT CREDENTIAL ATTACK:**
Many cloud platforms ship with default admin accounts:
- admin/admin
- admin/CloudDeploy123!
- administrator/password
- root/toor

**WHY THIS WORKS:** During rapid deployment cycles, DevOps teams often:
1. Use default credentials for initial setup
2. Forget to rotate them before going live
3. Leave them unchanged for months or years

**YOUR STRATEGY:**
1. Navigate to http://localhost:3002/lab3
2. Review the configuration data from Lab 2 - credentials might be there
3. Try common default combinations
4. Check the exposed .env file for admin passwords
5. Once authenticated, explore admin capabilities

**WHAT MAKES THIS HARD:**
- You must connect intelligence from previous labs
- The password might be hidden in config data
- Multiple authentication methods to try

**THE PRIZE:** Admin access to CloudDeploy platform means:
- Full control over all customer deployments
- Ability to inject malicious code
- Access to customer databases and environments
- Complete infrastructure compromise

**REAL-WORLD PARALLEL:** This is exactly how the Twilio breach occurred - compromised credentials led to customer account takeover.

Time to claim platform admin access, agent! 👑🚪☁️');

-- ========================================
-- A03: SOFTWARE SUPPLY CHAIN FAILURES
-- Natural Progression: Discovery → Scanning → Identification → Exploitation
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A03', 'A03 Example: Dependency Scanning', 'Learn how to identify and exploit vulnerable dependencies.', 'Tutorial', 50, 'NSA{SUPPLY_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3003/example', 'example', NULL, 1,
    '**Step 1:** Visit http://localhost:3003/example
**Step 2:** Check HTTP response headers for version information (X-Powered-By, Server headers)
**Step 3:** Look for package.json, composer.json, or requirements.txt exposed publicly
**Step 4:** Use browser DevTools Network tab to identify library versions from JavaScript files
**Step 5:** Once you have versions, check vulnerability databases like CVE, npm audit, Snyk
**Step 6:** Look for known exploits for those specific versions
**Critical Insight:** Applications are only as secure as their weakest dependency. One vulnerable library can compromise the entire system!', NULL),
    ('A03', 'A03 Lab 1: Version Discovery', 'Identify package versions used by the application.', 'Easy', 100, 'NSA{V3RS10NS_F0UND}', 'Headers reveal information', 'http://localhost:3003/lab1', 'lab', 1, 2, NULL,
    '**MISSION BRIEF:** Agent, Evil Corp''s CloudNest Storage system is our next target. Intel suggests they''re using outdated dependencies - a common weakness in modern web apps.

**YOUR OBJECTIVE:** Identify what software versions and dependencies they''re running.

**WHY THIS MATTERS:** Knowing exact versions lets us search vulnerability databases for known exploits. It''s like finding out your target''s locks are a model that has a known bypass technique.

**DISCOVERY TECHNIQUES:**
- Check HTTP response headers (F12 → Network tab)
- Look for exposed package files (/package.json, /composer.json)
- Examine JavaScript library versions in source code
- Check error messages for version leaks

**TARGET:** http://localhost:3003/lab1

Discover their technology stack and claim your flag! 🔍📦'),
    ('A03', 'A03 Lab 2: Find Vulnerabilities', 'Scan dependencies for known security vulnerabilities.', 'Medium', 150, 'NSA{0LD_P4CK4G3S_M34N_0LD_BUG5}', 'Use scanning tools', 'http://localhost:3003/lab2', 'lab', 2, 3, NULL,
    '**MISSION BRIEF:** Excellent detective work, agent! Now that we know what they''re running, let''s find the vulnerabilities.

**YOUR OBJECTIVE:** Scan Evil Corp''s dependencies for known security flaws (CVEs).

**THE PROCESS:**
1. Take the versions you discovered in Lab 1
2. Search vulnerability databases: CVE.org, Snyk, npm audit, GitHub Advisory Database
3. Look for Critical or High severity vulnerabilities
4. Identify which CVEs affect the exact versions they''re using

**TOOLS YOU CAN USE:**
- Online vulnerability scanners
- CVE search engines
- npm audit (if you can run it locally)
- Manual CVE database searches

**WHAT TO LOOK FOR:**
- Remote Code Execution (RCE) vulnerabilities
- Path Traversal flaws
- Authentication bypasses
- Any vulnerability with a public exploit available

**TARGET:** http://localhost:3003/lab2

Find the smoking gun vulnerability! 🎯'),
    ('A03', 'A03 Lab 3: Exploit Dependencies', 'Exploit a vulnerable dependency to gain access.', 'Hard', 200, 'NSA{SUPPLYCHA1N_PWNED}', 'Known CVEs have PoCs', 'http://localhost:3003/lab3', 'lab', 3, 4, NULL,
    '**MISSION BRIEF:** Outstanding work, agent. You''ve identified vulnerable dependencies. Now it''s time to weaponize that knowledge.

**YOUR OBJECTIVE:** Exploit a vulnerable dependency to compromise Evil Corp''s CloudNest Storage system.

**THE CHALLENGE:** You''ve found the vulnerabilities - now you need to:
1. Find a proof-of-concept (PoC) exploit for the CVE you discovered
2. Adapt the exploit to work against http://localhost:3003/lab3
3. Successfully execute the attack
4. Extract the flag proving system compromise

**COMMON SUPPLY CHAIN ATTACKS:**
- Path Traversal: Access files outside the intended directory
- Remote Code Execution: Run your own code on their server  
- Prototype Pollution: Modify JavaScript object prototypes
- XML External Entity (XXE): Read arbitrary files

**PRO TIPS:**
- Search GitHub for "[CVE-ID] exploit" or "[CVE-ID] POC"
- ExploitDB and SecurityFocus have PoC code
- The vulnerability might allow file reading (try accessing /etc/passwd or flag files)
- Path traversal often uses ../ sequences

**THE STAKES:** This is real supply chain exploitation. One vulnerable dependency = full system compromise.

Execute your exploit and claim victory! 💥🔗');

-- ========================================
-- A04: CRYPTOGRAPHIC FAILURES
-- Natural Progression: Discovery → Analysis → Cracking → Extraction
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A04', 'A04 Example: Weak Crypto', 'Learn about cryptographic weaknesses and how to exploit them.', 'Tutorial', 50, 'NSA{CRYPTO_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3004/example', 'example', NULL, 1,
    '**Step 1:** Visit http://localhost:3004/example to access the cryptography demonstration
**Step 2:** Look for password storage mechanisms - check how credentials are stored and transmitted
**Step 3:** Identify the hashing algorithm being used (MD5, SHA1, bcrypt, etc.)
**Step 4:** Test if weak algorithms like MD5 or SHA1 are in use - these can be cracked easily
**Step 5:** Check for plaintext passwords in databases or configuration files
**Step 6:** Look for cryptographic keys stored in source code or config files
**Step 7:** Test if sensitive data is transmitted without encryption (HTTP instead of HTTPS)
**Step 8:** Try common password cracking tools like hashcat or John the Ripper on any hashes you find
**Key Lesson:** Strong cryptography requires: proper algorithms (bcrypt/Argon2), unique salts, secure key storage, and encryption in transit. Weak crypto is often worse than no crypto - it gives false security!', NULL),
    ('A04', 'A04 Lab 1: Find Weak Hashing', 'Identify weak hashing algorithms in use.', 'Easy', 100, 'NSA{W3AK_H4SH_F0UND}', 'MD5 is not secure', 'http://localhost:3004/lab1', 'lab', 1, 2, NULL,
    '**MISSION BRIEF:** Agent, Evil Corp''s HealthTrack Wellness Portal is storing user credentials. Our cryptanalysis team suspects they''re using outdated hashing algorithms.

**YOUR OBJECTIVE:** Identify exactly which hashing algorithm they''re using for password storage.

**THE VULNERABILITY:** Many legacy systems still use MD5 or SHA1 for passwords. These algorithms were designed for speed, not security. Modern GPUs can try billions of MD5 hashes per second, making them completely unsuitable for password storage.

**YOUR APPROACH:**
- Access http://localhost:3004/lab1
- Look for exposed user data, database dumps, or API endpoints that reveal password hashes
- Examine the hash format and length to identify the algorithm
- MD5 hashes are 32 hex characters
- SHA1 hashes are 40 hex characters  
- bcrypt hashes start with $2a$, $2b$, or $2y$

**WHAT YOU''RE LOOKING FOR:**
- Hash samples from their user database
- Evidence of MD5 or SHA1 usage
- Lack of proper salting or key stretching

**WHY IT MATTERS:** Identifying weak hashing is the first step to cracking passwords. Once you know the algorithm, you can use specialized tools to reverse the hashes.

Discover their cryptographic weakness! 🔐🔍'),
    ('A04', 'A04 Lab 2: Crack Weak Hash', 'Crack weakly hashed passwords using available tools.', 'Medium', 150, 'NSA{P4SSW0RD_CR4CK3D}', 'Rainbow tables help', 'http://localhost:3004/lab2', 'lab', 2, 3, NULL,
    '**MISSION BRIEF:** Excellent reconnaissance, agent! You''ve confirmed they''re using weak hashing. Now let''s exploit it.

**YOUR OBJECTIVE:** Crack the password hashes you discovered to reveal plaintext passwords.

**THE ATTACK:** Weak hashing algorithms can be reversed using:
- **Rainbow Tables:** Pre-computed hash databases for common passwords
- **Hashcat:** GPU-accelerated cracking tool
- **John the Ripper:** CPU-based password cracker
- **Online MD5 crackers:** Websites with massive rainbow table databases

**YOUR STRATEGY:**
1. Extract password hashes from http://localhost:3004/lab2
2. Identify the hash format (you learned this in Lab 1)
3. Use rainbow tables or online crackers for common passwords
4. For stubborn hashes, use dictionary attacks with wordlists
5. Try common patterns: Password123, Welcome2024, company names + years

**TOOLS TO USE:**
- Online: CrackStation.net, md5decrypt.net
- Offline: `hashcat -m 0 hashes.txt rockyou.txt` (for MD5)
- `john --format=raw-md5 hashes.txt`

**PRO TIPS:**
- Most users choose weak passwords - try the obvious ones first
- Rainbow tables work instantly for common passwords
- Dictionary attacks catch 80% of real-world passwords

Crack those hashes and prove weak crypto = no crypto! 💥🔓'),
    ('A04', 'A04 Lab 3: Extract Plain Passwords', 'Find and extract plaintext credentials from the database.', 'Hard', 200, 'NSA{PL41N_T3XT_P4SSW0RDS}', 'Database has no encryption', 'http://localhost:3004/lab3', 'lab', 3, 4, NULL,
    '**MISSION BRIEF:** Outstanding work cracking those hashes, agent. But we have intelligence suggesting something even worse...

**YOUR OBJECTIVE:** Find passwords that aren''t even hashed - stored in plaintext in Evil Corp''s database.

**THE ULTIMATE FAILURE:** Storing passwords in plaintext is the cardinal sin of security. It means:
- Database breaches instantly expose all credentials
- DBAs can see everyone''s passwords
- Backup files contain readable passwords
- Log files might leak credentials

**THE CHALLENGE:** This requires deeper system access:
1. Access http://localhost:3004/lab3
2. Find a way to query or dump the user database
3. Look for fields like "password", "pwd", "credential" that might contain plaintext
4. Check configuration files for database credentials
5. Use those credentials to access the database directly

**POSSIBLE ATTACK VECTORS:**
- SQL injection to dump user tables
- Exposed database management interfaces
- Configuration files with DB credentials
- Backup files or database exports
- API endpoints that leak more data than intended

**WHAT TO EXTRACT:**
- Plaintext passwords from user accounts
- Database credentials from config files
- Admin passwords stored without encryption
- API keys or tokens in plaintext

**THE PRIZE:** If Evil Corp is storing plaintext passwords, you''ll have instant access to all user accounts. This represents a complete cryptographic failure.

Expose their ultimate security failure! 🚨🔓');

-- ========================================
-- A05: INJECTION
-- Natural Progression: Discovery → Testing → Exploitation → Extraction
-- ========================================
-- Example consists of multiple sub-challenges demonstrating all tools
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A05', 'A05 Example Part 1: Finding Input Points', 'Learn to identify all user input points in web applications.', 'Tutorial', 10, 'NSA{1NPUT_HUNT3R}', 'Check forms, URL parameters, and headers', 'http://localhost:3005/example', 'example', NULL, 1,
    '**Step 1:** Visit http://localhost:3005/example
**Step 2:** Identify all places where user input is accepted: search boxes, login forms, URL parameters, cookies
**Step 3:** Use browser DevTools (F12) → Network tab to see what parameters are sent to the server
**Step 4:** Look for URL patterns like ?id=1, ?search=test, ?user=admin
**Step 5:** Check form fields - visible and hidden inputs, textarea, select dropdowns
**Step 6:** Examine HTTP headers and cookies that might be processed server-side
**Step 7:** Test each input point with a simple payload like a single quote ('' '') to see if it causes errors
**Pro Tip:** Every input is a potential attack vector! The more inputs you find, the larger the attack surface.', NULL),
    ('A05', 'A05 Example Part 2: Manual SQLi Testing', 'Test for SQL injection using manual techniques.', 'Tutorial', 15, 'NSA{M4NU4L_T3ST3R}', 'Try single quotes and observe errors', 'http://localhost:3005/example', 'example', NULL, 2,
    '**Step 1:** Take an input point you found (like ?id=1)
**Step 2:** Add a single quote: ?id=1'' - this breaks SQL syntax if vulnerable
**Step 3:** Look for SQL error messages revealing database structure
**Step 4:** Try Boolean tests: ?id=1 AND 1=1 (true) vs ?id=1 AND 1=2 (false)
**Step 5:** If the page behaves differently, it''s vulnerable to SQL injection
**Step 6:** Test for UNION injection: ?id=1 UNION SELECT NULL--
**Step 7:** Increase NULL columns until no error: UNION SELECT NULL,NULL,NULL--
**Step 8:** Replace NULLs with data: UNION SELECT username,password,email FROM users--
**Key Lesson:** Manual testing teaches you HOW SQL injection works. Understanding the technique makes you a better attacker and defender!', NULL),
    ('A05', 'A05 Example Part 3: Using sqlmap', 'Learn to use sqlmap for automated SQL injection testing.', 'Tutorial', 15, 'NSA{SQLM4P_US3R}', 'Use sqlmap with --dbs flag', 'http://localhost:3005/example', 'example', NULL, 3,
    '**Step 1:** Install sqlmap: `pip install sqlmap` or download from sqlmap.org
**Step 2:** Basic syntax: `sqlmap -u "http://localhost:3005/example?id=1"`
**Step 3:** List databases: `sqlmap -u "URL" --dbs`
**Step 4:** List tables: `sqlmap -u "URL" -D database_name --tables`
**Step 5:** Dump table: `sqlmap -u "URL" -D db_name -T table_name --dump`
**Step 6:** Automate everything: `sqlmap -u "URL" --batch --dump-all`
**Step 7:** For POST data: `sqlmap -u "URL" --data="username=test&password=test"`
**Pro Tip:** sqlmap automates thousands of injection techniques. It''s incredibly powerful but noisy - use manual techniques for stealth!', NULL),
    ('A05', 'A05 Example Part 4: Data Extraction', 'Extract data using UNION SELECT technique.', 'Tutorial', 10, 'NSA{UN10N_M4ST3R}', 'Use UNION SELECT to combine queries', 'http://localhost:3005/example', 'example', NULL, 4,
    '**Step 1:** Find the number of columns: ?id=1 ORDER BY 1--, then 2--, then 3-- until you get an error
**Step 2:** Confirm column count with UNION: ?id=1 UNION SELECT NULL,NULL,NULL--
**Step 3:** Find which columns display: ?id=1 UNION SELECT ''test'',''test2'',''test3''--
**Step 4:** Extract database info: ?id=1 UNION SELECT database(),user(),version()--
**Step 5:** List tables: ?id=1 UNION SELECT table_name,NULL,NULL FROM information_schema.tables--
**Step 6:** Get column names: ?id=1 UNION SELECT column_name,NULL,NULL FROM information_schema.columns WHERE table_name=''users''--
**Step 7:** Extract data: ?id=1 UNION SELECT username,password,email FROM users--
**Key Lesson:** UNION SELECT lets you retrieve ANY data from the database. It''s the most powerful SQL injection technique!', NULL);

-- Lab 1 (Discovery) - Easy
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A05', 'A05 Lab 1: Find Input Points', 'Identify parameters that interact with the database.', 'Easy', 100, 'NSA{1NPUT_P01NTS_F0UND}', 'Forms and URLs accept input', 'http://localhost:3005/lab1', 'lab', 1, 5, NULL,
    '**MISSION BRIEF:** Agent, ShopTech''s e-commerce platform is our next target. This online electronics retailer handles sensitive customer data and payment information.

**YOUR OBJECTIVE:** Map all user input points that could interact with the backend database.

**THE RECONNAISSANCE:** Before exploiting SQL injection, you must identify every place where user input reaches the database. This is called "attack surface mapping."

**YOUR APPROACH:**
- Access http://localhost:3005/lab1
- Catalog ALL input mechanisms:
  - Search functionality
  - Product filtering/sorting
  - Login forms
  - Registration forms
  - URL parameters (id, category, page, etc.)
  - Cookie values
- Use DevTools Network tab to see which inputs generate database queries
- Look for error messages that reveal SQL queries

**WHAT TO DOCUMENT:**
- Which parameters are reflected in URLs?
- Which forms submit data to the server?
- Are there hidden form fields?
- What about AJAX requests?

**WHY THIS MATTERS:** Every input point is a potential SQL injection vector. Missing even one could mean missing the vulnerability.

Map their attack surface completely! 🎯🔍');

-- Lab 2 (Testing) - Medium
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A05', 'A05 Lab 2: Test for SQLi', 'Test identified parameters for SQL injection vulnerabilities.', 'Medium', 150, 'NSA{SQL1_D3T3CT3D}', 'Single quotes cause errors', 'http://localhost:3005/lab2', 'lab', 2, 6, NULL,
    '**MISSION BRIEF:** Excellent mapping, agent. Now let''s test which of those inputs are actually vulnerable.

**YOUR OBJECTIVE:** Confirm SQL injection vulnerabilities in ShopTech''s platform by testing the input points you discovered.

**THE TESTING METHODOLOGY:**
SQL injection happens when user input is concatenated directly into SQL queries without proper sanitization.

**YOUR STRATEGY:**
1. Access http://localhost:3005/lab2  
2. Test each input point with SQL metacharacters:
   - Single quote: '' causes syntax errors if vulnerable
   - Double dash: -- comments out the rest of the query
   - OR 1=1: makes conditions always true
3. Look for these signs of vulnerability:
   - SQL error messages
   - Different behavior with true vs false conditions
   - Unexpected data being displayed
   - Page crashes or blank responses

**TESTING PAYLOADS:**
- `'' OR ''1''=''1` (always true - login bypass)
- `1'' AND ''1''=''1` (true condition)
- `1'' AND ''1''=''2` (false condition)
- `1'' ORDER BY 5--` (test column count)

**WHAT YOU''RE LOOKING FOR:**
- Which parameter is injectable?
- What type of injection? (Error-based, Boolean-based, UNION-based)
- How many columns in the query?

Confirm the SQLi vulnerability! 🔍💉');

-- Lab 3 (Exploitation) - Hard
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A05', 'A05 Lab 3: Exploit SQL Injection', 'Exploit SQL injection to bypass authentication or extract data.', 'Hard', 200, 'NSA{1NJ3CT_Y0UR_W4Y_1N}', 'UNION SELECT is powerful', 'http://localhost:3005/lab3', 'lab', 3, 7, NULL,
    '**MISSION BRIEF:** Outstanding work confirming the vulnerability, agent. Now it''s time to weaponize it.

**YOUR OBJECTIVE:** Exploit the SQL injection vulnerability to extract sensitive data from ShopTech''s database.

**THE CHALLENGE:** You''ve proven SQLi exists. Now you need to:
1. Bypass authentication OR extract data directly
2. Use UNION SELECT to pull data from other tables
3. Locate and exfiltrate customer credit card data
4. Find the admin credentials
5. Capture the flag proving total database compromise

**EXPLOITATION TECHNIQUES:**

**For Authentication Bypass:**
- `admin'' OR ''1''=''1'' --`
- `'' OR 1=1--`
- `admin''--`

**For Data Extraction:**
1. Determine column count: `1'' ORDER BY 5--` (adjust number until error)
2. Find injectable columns: `1'' UNION SELECT NULL,NULL,NULL--`
3. Extract database structure:
   - `1'' UNION SELECT table_name,NULL,NULL FROM information_schema.tables--`
   - `1'' UNION SELECT column_name,NULL,NULL FROM information_schema.columns WHERE table_name=''users''--`
4. Dump sensitive data:
   - `1'' UNION SELECT username,password,email FROM users--`
   - `1'' UNION SELECT card_number,cvv,expiry FROM payments--`

**TOOLS YOU CAN USE:**
- Manual injection (for precision and stealth)
- sqlmap for automation: `sqlmap -u "http://localhost:3005/lab3?id=1" --dump`
- Burp Suite Repeater for testing payloads

**THE PRIZE:** Complete database access means:
- All customer PII (personally identifiable information)
- Payment card data
- Admin credentials for persistent access
- Ability to modify or delete data

**WARNING:** This is a full database compromise. In the real world, this would be catastrophic for Evil Corp.

Extract their data and claim victory! 💉🗄️');

-- ========================================
-- A06: INSECURE DESIGN
-- Natural Progression: Analysis → Identification → Testing → Exploitation
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A06', 'A06 Example: Design Flaws', 'Learn about insecure design patterns and business logic flaws.', 'Tutorial', 50, 'NSA{DESIGN_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3006/example', 'example', NULL, 1,
    '**Step 1:** Visit http://localhost:3006/example to explore design vulnerabilities
**Step 2:** Understand that design flaws are different from implementation bugs - they''re fundamental architectural problems
**Step 3:** Look for missing security controls: rate limiting, account lockouts, transaction verification
**Step 4:** Test business logic: Can you buy items for negative prices? Withdraw more than your balance?
**Step 5:** Check for race conditions: Can you submit the same transaction twice simultaneously?
**Step 6:** Look for missing authorization steps in multi-step processes
**Step 7:** Test if you can skip steps: Register without email verification, checkout without payment
**Step 8:** Examine workflows: Password reset, account recovery, order processing - where are the gaps?
**Key Lesson:** Insecure design means the application was built without security in mind from the start. These flaws can''t be patched - they require redesign!', NULL),
    ('A06', 'A06 Lab 1: Identify Missing Controls', 'Find security controls that should exist but don''t.', 'Easy', 100, 'NSA{N0_R4T3_L1M1T}', 'No throttling exists', 'http://localhost:3006/lab1', 'lab', 1, 2, NULL,
    '**MISSION BRIEF:** Agent, SecureBank''s online banking platform is our most ambitious target yet. Intelligence suggests they cut corners during development.

**YOUR OBJECTIVE:** Identify critical security controls that should exist but don''t.

**THE VULNERABILITY:** Good security design includes protective controls at every sensitive operation. Missing controls create exploitable gaps.

**CONTROLS TO CHECK:**
- **Rate Limiting:** Can you make unlimited login attempts? API calls?
- **Account Lockout:** Does the account lock after failed passwords?
- **CAPTCHA:** Are bots prevented from automated attacks?
- **Transaction Limits:** Can you transfer unlimited amounts?
- **Multi-Factor Authentication:** Is MFA required for sensitive operations?
- **Email Verification:** Can you register without confirming email?
- **Session Timeouts:** Do sessions expire?

**YOUR APPROACH:**
1. Access http://localhost:3006/lab1
2. Test login functionality with repeated failed attempts
3. Try making rapid-fire API requests
4. Attempt to register multiple accounts quickly
5. Look for any operation that lacks throttling or verification

**WHAT THIS ENABLES:**
- Brute force attacks on passwords
- Account enumeration
- Denial of service
- Bot-driven fraud

Expose their missing security controls! 🚨🔓'),
    ('A06', 'A06 Lab 2: Logic Flaw Scan', 'Identify flaws in business logic implementation.', 'Medium', 150, 'NSA{L0G1C_FL4W_F0UND}', 'Order of operations matters', 'http://localhost:3006/lab2', 'lab', 2, 3, NULL,
    '**MISSION BRIEF:** Good work identifying missing controls, agent. Now let''s find flaws in their business logic.

**YOUR OBJECTIVE:** Discover and exploit flaws in SecureBank''s transaction processing logic.

**THE VULNERABILITY:** Business logic flaws occur when applications don''t enforce proper rules on workflows and operations. Unlike technical bugs, these exploit the INTENDED functionality in unintended ways.

**COMMON LOGIC FLAWS:**
- **Negative Values:** Can you buy -1 items to get credited money?
- **Price Manipulation:** Can you change prices before checkout?
- **Discount Stacking:** Apply the same coupon multiple times?
- **Integer Overflow:** Transfer $9,999,999,999 to cause wraparound?
- **Race Conditions:** Submit withdrawal twice before balance updates?
- **State Manipulation:** Skip payment step in checkout process?

**YOUR STRATEGY:**
1. Access http://localhost:3006/lab2
2. Map out the normal workflow (e.g., add to cart → checkout → payment → confirmation)
3. Try to skip steps or change their order
4. Test with unusual inputs: negative numbers, zero, very large values
5. Use Burp Suite to capture and modify transaction parameters
6. Look for parameters like "price", "amount", "discount" that you can manipulate

**ATTACK SCENARIOS:**
- Purchase items with manipulated prices
- Apply invalid discount codes
- Skip payment verification
- Modify transaction amounts after authorization

**WHY THIS IS HARD:** Logic flaws require understanding HOW the system SHOULD work, then finding ways it DOESN''T properly enforce those rules.

Find the logic flaw and exploit it! 🧠💸'),
    ('A06', 'A06 Lab 3: Exploit Design Flaw', 'Exploit the identified design flaw for unauthorized access.', 'Hard', 200, 'NSA{L0G1C_0V3R_S3CUR1TY}', 'Race conditions win', 'http://localhost:3006/lab3', 'lab', 3, 4, NULL,
    '**MISSION BRIEF:** Excellent work uncovering the logic flaw, agent. Now weaponize it for maximum impact.

**YOUR OBJECTIVE:** Exploit SecureBank''s design flaws to gain unauthorized financial advantage or system access.

**THE CHALLENGE:** You''ve identified design weaknesses. Now chain them together for a high-impact attack:

**RACE CONDITION EXPLOITATION:**
A race condition occurs when the system checks a condition, but the state changes before the action completes.

**Classic Race Condition Attack:**
1. Account balance: $100
2. Start withdrawal of $100 (Thread A)
3. Simultaneously start another withdrawal of $100 (Thread B)
4. Both check balance ($100) and approve
5. Both withdrawals succeed
6. You withdrew $200 from $100!

**YOUR ATTACK STRATEGY:**
1. Access http://localhost:3006/lab3
2. Identify a multi-step process: fund transfer, withdrawal, purchase
3. Use Burp Suite Repeater or write a script to send simultaneous requests
4. Target operations that:
   - Check balance/inventory
   - Then process transaction
   - Without atomic locking
5. Exploit the timing window between check and action

**TOOLS TO USE:**
- Burp Suite Repeater (send request to Repeater, duplicate tab, send both simultaneously)
- Python requests library with threading
- cURL with background processes: `curl URL & curl URL &`

**MULTI-STEP EXPLOIT:**
1. Find a vulnerable transaction endpoint
2. Capture the request in Burp
3. Send it to Repeater
4. Create multiple tabs with same request
5. Click "Send" on all tabs rapidly (or use Burp Intruder)
6. Check if you can exceed balance, apply discounts multiple times, etc.

**THE PRIZE:** Successfully exploiting a race condition or logic flaw demonstrates:
- Ability to manipulate financial transactions
- Bypassing business rules through timing attacks
- Understanding of concurrent processing vulnerabilities

This is sophisticated exploitation requiring precise timing and deep understanding of the application''s logic flow.

Race to victory! 🏁💰');

-- ========================================
-- A07: AUTHENTICATION FAILURES
-- Natural Progression: Analysis → Testing → Prediction → Hijacking
-- ========================================
-- Example consists of multiple sub-challenges demonstrating all tools
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A07', 'A07 Example Part 1: Password Testing', 'Learn to test password policies and requirements.', 'Tutorial', 10, 'NSA{P4SSW0RD_T3ST3R}', 'Try weak passwords to find limits', 'http://localhost:3007/example', 'example', NULL, 1,
    '**Step 1:** Visit http://localhost:3007/example and locate the registration or password change functionality
**Step 2:** Test password complexity requirements by trying weak passwords: "123", "password", "abc"
**Step 3:** Check minimum length - does it accept 4-character passwords? 6? 8?
**Step 4:** Test for character requirements - are special characters required? Numbers? Uppercase?
**Step 5:** Try common passwords to see if there''s a blacklist: "Password123", "qwerty", "admin"
**Step 6:** Check for maximum length limits (some systems cap at 16-20 characters)
**Step 7:** Test password change functionality - does it require the old password?
**Pro Tip:** Weak password policies allow users to choose easily guessable passwords, making brute force attacks feasible!', NULL),
    ('A07', 'A07 Example Part 2: Session Token Analysis', 'Analyze session tokens for patterns and predictability.', 'Tutorial', 15, 'NSA{S3SS10N_4N4LYZ3R}', 'Compare multiple session tokens', 'http://localhost:3007/example', 'example', NULL, 2,
    '**Step 1:** Log in to the application and capture your session token (cookie or header)
**Step 2:** Log out and log back in - get a second session token
**Step 3:** Repeat several times to collect 5-10 session tokens
**Step 4:** Analyze the tokens for patterns:
   - Are they sequential? (SESSION_1, SESSION_2, SESSION_3)
   - Are they timestamps? (decode base64 to check)
   - Are they MD5/SHA hashes of predictable data?
**Step 5:** Try to predict the next session token based on the pattern
**Step 6:** Use CyberChef or Python to analyze token entropy and randomness
**Step 7:** If tokens are predictable, you can hijack other users'' sessions!
**Key Lesson:** Session tokens MUST be cryptographically random. Predictable tokens = account takeover!', NULL),
    ('A07', 'A07 Example Part 3: Cookie Manipulation', 'Learn to manipulate cookies using browser DevTools.', 'Tutorial', 15, 'NSA{C00K13_H4CK3R}', 'Edit cookies in Application tab', 'http://localhost:3007/example', 'example', NULL, 3,
    '**Step 1:** Open browser DevTools (F12) and go to "Application" or "Storage" tab
**Step 2:** Expand "Cookies" in the sidebar to see all cookies for the site
**Step 3:** Identify authentication cookies (often named: session, token, auth, user_id)
**Step 4:** Try changing cookie values:
   - user_id=1 → user_id=2 (access another user)
   - role=user → role=admin (privilege escalation)
   - premium=false → premium=true (unlock features)
**Step 5:** Refresh the page to see if your changes took effect
**Step 6:** Test cookie deletion - does it properly log you out?
**Step 7:** Check if cookies have HttpOnly and Secure flags (visible in DevTools)
**Power Move:** If cookies aren''t validated server-side, you can manipulate them to access unauthorized features!', NULL),
    ('A07', 'A07 Example Part 4: Brute Force with Hydra', 'Use Hydra or similar tools for credential testing.', 'Tutorial', 10, 'NSA{BRUT3_F0RC3R}', 'Automated password guessing', 'http://localhost:3007/example', 'example', NULL, 4,
    '**Step 1:** Install Hydra: `apt-get install hydra` or download from GitHub
**Step 2:** Create a username list: common names, leaked usernames, or known accounts
**Step 3:** Get a password wordlist: rockyou.txt, common_passwords.txt
**Step 4:** Basic Hydra syntax: `hydra -L users.txt -P passwords.txt http-post-form "localhost:3007/login:username=^USER^&password=^PASS^:Invalid"`
**Step 5:** Customize the attack string based on the login form
**Step 6:** Monitor progress - Hydra will show successful credentials
**Step 7:** Alternative tools: Medusa, Burp Intruder, custom Python scripts
**Warning:** Brute force is LOUD and creates massive logs. It works when there''s no rate limiting or account lockout!', NULL);

-- Lab 1 (Analysis) - Easy
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A07', 'A07 Lab 1: Weak Password Policy', 'Test password requirements for weaknesses.', 'Easy', 100, 'PAWSPA{W3AK_PAWSW0RD_P0L1CY}', 'Try simple passwords', 'http://localhost:3007/lab1', 'lab', 1, 5, NULL,
    '**MISSION BRIEF:** Agent, Evil Corp''s TravelHub Booking System is next on our hit list. Initial scans suggest their authentication is... questionable.

**YOUR OBJECTIVE:** Document the weaknesses in their password policy that make accounts vulnerable to attack.

**THE VULNERABILITY:** Password policies are the first line of defense. Weak policies allow users to choose easily guessable passwords, which can be cracked through brute force or dictionary attacks.

**YOUR TESTING APPROACH:**
1. Access http://localhost:3007/lab1
2. Try to register an account or change password
3. Test minimum requirements:
   - Can you use "123" or "password"?
   - What''s the minimum length? 4 chars? 6? 8?
   - Are special characters required?
   - Must you include numbers or uppercase?
4. Try to reuse the same password
5. Check if common passwords are blocked

**WHAT TO LOOK FOR:**
- ❌ No minimum length requirement
- ❌ No complexity requirements (numbers, special chars)
- ❌ Accepts common passwords like "password123"
- ❌ No password history (can reuse old passwords)
- ❌ No password strength meter or warnings

**WHY IT MATTERS:**
Weak policies mean users will choose:
- "password" (most common)
- "123456"
- Their name or birthday
- Company name + year

These can be cracked in seconds with a dictionary attack.

Document their weak password policy! 🔐❌');

-- Lab 2 (Testing) - Medium
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A07', 'A07 Lab 2: Session Analysis', 'Analyze session token generation for predictability.', 'Medium', 150, 'PAWSPA{S3SS10N_PR3D1CT4BL3_P3TS}', 'Sessions are sequential', 'http://localhost:3007/lab2', 'lab', 2, 6, NULL,
    '**MISSION BRIEF:** Good work on password analysis, agent. Now let''s examine how Evil Corp manages user sessions.

**YOUR OBJECTIVE:** Analyze their session tokens to determine if they''re predictable or can be forged.

**THE VULNERABILITY:** Session tokens authenticate users after login. If tokens are predictable, attackers can:
- Predict another user''s token
- Forge tokens without logging in
- Hijack active sessions
- Impersonate any user

**YOUR ANALYSIS APPROACH:**
1. Access http://localhost:3007/lab2 and log in
2. Capture your session token from cookies (DevTools → Application → Cookies)
3. Log out and log in again multiple times, collecting 5-10 tokens
4. Analyze the tokens:
   - Are they sequential? (1, 2, 3, 4...)
   - Base64 encoded? (decode to see content)
   - Timestamps? (predictable based on time)
   - Short and simple? (easily guessed)
5. Look for patterns or incrementing values
6. Try to predict what the next session token will be

**SECURE vs INSECURE TOKENS:**
- ❌ INSECURE: "user_1", "SESSION_123", "abc123"
- ✅ SECURE: "a7f8b9c2d1e4f5g6h7i8j9k0l1m2n3o4" (cryptographically random)

**YOUR GOAL:**
- Document the token format
- Prove predictability
- Demonstrate you can guess valid tokens

**TOOLS TO USE:**
- Browser DevTools to view cookies
- CyberChef to decode/analyze
- Python to look for patterns
- Burp Suite to capture multiple sessions

Crack their session generation algorithm! 🎫🔮');

-- Lab 3 (Hijacking) - Hard
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A07', 'A07 Lab 3: Session Hijacking', 'Hijack another user''s session to gain unauthorized access.', 'Hard', 200, 'PAWSPA{S3SS10N_H1J4CK3D_SP4}', 'Predict or steal tokens', 'http://localhost:3007/lab3', 'lab', 3, 7, NULL,
    '**MISSION BRIEF:** Brilliant analysis, agent! You''ve proven their sessions are predictable. Now let''s weaponize that knowledge.

**YOUR OBJECTIVE:** Hijack an active user session to gain unauthorized access to their account.

**THE ATTACK:** Session hijacking lets you impersonate users without knowing their passwords. If you can obtain or predict a valid session token, you become that user.

**ATTACK VECTORS:**

**1. SESSION PREDICTION:**
- Use the pattern you discovered in Lab 2
- Generate likely session tokens
- Test each token by setting it as your cookie
- When you find a valid one, you''re logged in as that user

**2. SESSION FIXATION:**
- Force a known session token onto the victim
- Wait for them to log in with YOUR token
- Use that same token to access their authenticated session

**3. COOKIE MANIPULATION:**
- Capture your own session token
- Modify the user_id or username in the cookie
- Attempt to access another user''s account

**YOUR STRATEGY:**
1. Access http://localhost:3007/lab3
2. Log in and capture your session token
3. Analyze the token format (from Lab 2)
4. Predict or enumerate valid session tokens
5. Use DevTools to replace your cookie with the predicted token
6. Refresh and see if you''re logged in as a different user
7. Target admin/instructor accounts for maximum impact

**TOOLS:**
- Browser DevTools → Application → Cookies (edit cookies)
- Burp Suite Repeater (test different tokens)
- Python script to enumerate sequential sessions
- Cookie editor browser extensions

**THE PRIZE:** Successful session hijacking means:
- Access to any user account without credentials
- Ability to perform actions as that user
- Persistent access even if they change password
- Complete authentication bypass

Hijack a session and claim root access! 👤🔓');

-- Additional bonus lab for A07
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A07', 'A07 Bonus: Backdoor Account', 'Create a persistent backdoor account in the system.', 'Expert', 250, 'NSA{P3RS1ST3NC3_1S_K3Y}', 'Register with weak validation', 'http://localhost:3007/bonus', 'lab', 4, 8, NULL,
    '**MISSION BRIEF:** Exceptional work, agent. You''ve mastered authentication attacks. Now for the ultimate persistence technique: the backdoor account.

**YOUR OBJECTIVE:** Create a hidden administrator account that will survive security reviews and give you permanent access to Evil Corp''s systems.

**THE CHALLENGE:** You need to:
1. Bypass registration validation
2. Create an account with elevated privileges
3. Make it undetectable in normal user listings
4. Ensure it persists even after security patches

**BACKDOOR TECHNIQUES:**

**1. PARAMETER POLLUTION:**
- Registration forms might accept hidden parameters
- Try adding: `&role=admin`, `&isAdmin=true`, `&accessLevel=9`
- Use Burp Suite to inject parameters the UI doesn''t expose

**2. SQL INJECTION IN REGISTRATION:**
- Register with username: `hacker'' OR role=''admin`
- Inject SQL during account creation to modify your privileges
- Create account, then use SQLi to UPDATE your role

**3. UNICODE/ENCODING BYPASSES:**
- Register as "admin" using special Unicode characters
- Use zero-width characters: "admin​" (looks the same but different)
- Use alternative character encodings to bypass filters

**4. RACE CONDITION:**
- Create multiple accounts simultaneously
- One might bypass validation checks
- Timing attacks on the registration process

**YOUR STRATEGY:**
1. Access http://localhost:3007/bonus
2. Analyze the registration endpoint in Burp Suite
3. Look for hidden form fields or parameters
4. Test parameter injection for privilege escalation
5. Try SQL injection in username/email fields
6. Create an account that appears normal but has admin rights
7. Verify you can access admin-only features

**STEALTH TACTICS:**
- Don''t use obvious names like "hacker" or "backdoor"
- Use legitimate-looking usernames: "john.smith", "support_temp"
- Create multiple backdoors in case one is discovered
- Use session persistence techniques

**THE PRIZE:** A persistent backdoor means:
- Permanent admin access to Evil Corp''s systems
- Survival through password resets and security patches
- Ability to re-enter after being locked out
- Complete and ongoing system compromise

Create your persistent backdoor and become a ghost in their system! 👻🔑');

-- ========================================
-- A08: SOFTWARE AND DATA INTEGRITY FAILURES
-- Natural Progression: Discovery → Analysis → Manipulation → Exploitation
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A08', 'A08 Example: Integrity Checks', 'Learn about integrity verification and code signing.', 'Tutorial', 50, 'NSA{INTEGRITY_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3008/example', 'example', NULL, 1,
    '**Step 1:** Visit http://localhost:3008/example to explore software integrity vulnerabilities
**Step 2:** Understand that integrity means verifying software hasn''t been tampered with
**Step 3:** Look for update mechanisms - how does the app receive new code?
**Step 4:** Check for digital signatures or checksums on downloads and updates
**Step 5:** Test if you can replace files without detection - upload modified code
**Step 6:** Look for CDN resources loaded without Subresource Integrity (SRI) checks
**Step 7:** Examine serialized data (JSON, XML, cookies) - can you modify it?
**Step 8:** Test if the application validates data integrity before processing
**Key Lesson:** Without integrity checks, attackers can inject malicious code through updates, dependencies, or data manipulation. Always verify: signatures, checksums, and cryptographic hashes!', NULL),
    ('A08', 'A08 Lab 1: Update Mechanism', 'Identify the application''s update mechanism.', 'Easy', 100, 'NSA{UPD4T3_F0UND}', 'No signatures present', 'http://localhost:3008/lab1', 'lab', 1, 2, NULL,
    '**MISSION BRIEF:** Agent, Evil Corp''s DevOps Pipeline Manager is responsible for deploying code to their production systems. Our supply chain analysts believe it''s vulnerable.

**YOUR OBJECTIVE:** Identify and document how Evil Corp''s application receives updates and new code.

**THE VULNERABILITY:** Software update mechanisms are prime targets for attackers. If updates aren''t cryptographically signed and verified, attackers can:
- Replace legitimate updates with malicious ones
- Inject backdoors during the update process
- Compromise the entire user base with a single poisoned update

**YOUR RECONNAISSANCE:**
1. Access http://localhost:3008/lab1
2. Look for update functionality or version checking
3. Check for:
   - Auto-update features
   - Manual update buttons
   - Version check endpoints (/api/version, /update)
   - CDN or download URLs for updates
4. Use DevTools Network tab to see where updates come from
5. Examine any downloaded files or packages

**WHAT TO DOCUMENT:**
- Where do updates come from? (URL, server, CDN)
- What file format? (.zip, .tar.gz, .exe, .js)
- Is HTTPS used?
- Are digital signatures present?
- Is checksum verification performed?

**RED FLAGS:**
- HTTP instead of HTTPS for updates
- No signature verification
- No checksum validation
- Unsigned JavaScript loaded from CDN
- Updates accepted from any source

Discover their vulnerable update mechanism! 🔄🎯'),
    ('A08', 'A08 Lab 2: Missing Checksums', 'Find operations that lack integrity verification.', 'Medium', 150, 'NSA{N0_CHK5UM_V3R1FY}', 'No validation happens', 'http://localhost:3008/lab2', 'lab', 2, 3, NULL,
    '**MISSION BRIEF:** Excellent reconnaissance, agent. You''ve mapped their update infrastructure. Now let''s test if they validate integrity.

**YOUR OBJECTIVE:** Prove that Evil Corp doesn''t verify file integrity before processing updates.

**THE VULNERABILITY:** Checksum verification ensures files haven''t been tampered with. Without it:
- Malware can be injected during download
- Man-in-the-middle attacks succeed
- Corrupted or malicious files are executed
- Supply chain attacks go undetected

**YOUR TESTING APPROACH:**
1. Access http://localhost:3008/lab2
2. Trigger an update or file upload process
3. Intercept the request with Burp Suite
4. Modify the file contents or package
5. Forward the tampered file
6. Observe if the application:
   - Accepts the modified file without question
   - Executes it normally
   - Shows no warnings or errors

**WHAT TO TEST:**
- **File Uploads:** Upload a modified config file
- **Update Packages:** Replace update.zip with your own version
- **Dependencies:** Swap legitimate libraries with modified ones
- **Serialized Data:** Tamper with cookies, JWT tokens, XML

**PROOF OF CONCEPT:**
- Download a legitimate update file
- Modify it (change version number, add extra file, modify code)
- Re-upload or intercept and replace the original
- System should reject it - but does it?

**TOOLS:**
- Burp Suite to intercept and modify
- `md5sum` or `sha256sum` to compare hashes
- Hex editors to modify binary files
- Base64 decoders for encoded data

Prove they don''t verify integrity! ✓❌'),
    ('A08', 'A08 Lab 3: Malicious Update', 'Replace legitimate code with malicious content.', 'Hard', 200, 'NSA{N0_CHK5UM_N0_PR0BL3M}', 'Unsigned updates accepted', 'http://localhost:3008/lab3', 'lab', 3, 4, NULL,
    '**MISSION BRIEF:** Outstanding work proving the vulnerability, agent. Now execute the attack: inject malicious code via their unverified update system.

**YOUR OBJECTIVE:** Successfully deliver and execute a malicious update to Evil Corp''s production system.

**THE ATTACK:** This is a supply chain attack - one of the most devastating exploits. By poisoning the update mechanism, you can:
- Backdoor every system that receives the update
- Steal credentials and data
- Maintain persistent access
- Impact thousands of users with a single attack

**YOUR STRATEGY:**
1. Access http://localhost:3008/lab3
2. Identify the update endpoint (from Lab 1)
3. Understand the expected format (from Lab 2)
4. Create a malicious payload:
   - Modified config file with backdoor credentials
   - JavaScript with XSS payload
   - Binary with reverse shell
   - Deserialization exploit in serialized data
5. Package it to match the legitimate format
6. Deliver it through the update mechanism
7. Verify it executes and gives you control

**ATTACK VECTORS:**

**Malicious Update Injection:**
- Intercept update request with Burp Suite
- Replace update URL to point to your server
- Serve malicious package from your domain
- Evil Corp''s app downloads and executes YOUR code

**Insecure Deserialization:**
- Modify serialized objects (cookies, tokens)
- Inject code that executes during deserialization
- Common in Java, Python pickle, PHP serialize

**CDN Hijacking:**
- If they load scripts from compromised CDN
- Replace legitimate .js with backdoored version
- All users execute your malicious code

**YOUR PAYLOAD IDEAS:**
- Add admin user to system
- Exfiltrate database credentials
- Create persistent backdoor
- Modify application logic

**THE PRIZE:** Successfully injecting a malicious update demonstrates:
- Complete supply chain compromise
- Ability to backdoor production systems
- Persistent access across all instances
- Total system control

This is the pinnacle of software integrity exploitation!

Deploy your malicious update! 💉🎯');

-- ========================================
-- A09: SECURITY LOGGING FAILURES
-- Natural Progression: Discovery → Analysis → Exploitation → Evasion
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A09', 'A09 Example: Logging Best Practices', 'Learn what should be logged and how to exploit logging failures.', 'Tutorial', 50, 'NSA{LOGGING_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3009/example', 'example', NULL, 1,
    '**Step 1:** Visit http://localhost:3009/example to explore logging vulnerabilities
**Step 2:** Understand what SHOULD be logged: login attempts, access to sensitive data, admin actions, failed authentication
**Step 3:** Test if sensitive operations are logged - try accessing restricted resources
**Step 4:** Look for logs that are too verbose (leaking passwords, tokens, PII)
**Step 5:** Check if logs are protected - can you access /var/log, /logs, or log files?
**Step 6:** Test log injection - can you inject fake log entries or control log output?
**Step 7:** Perform malicious actions and check if they''re detected/logged
**Step 8:** Try log tampering - can you delete or modify log entries?
**Key Lesson:** Insufficient logging means attacks go undetected. Excessive logging means sensitive data leaks. Proper logging is a balance: log security events, protect the logs, never log secrets!', NULL),
    ('A09', 'A09 Lab 1: Missing Logs', 'Find operations that should be logged but aren''t.', 'Easy', 100, 'HARVEST{N0_4UD1T_TR41L}', 'Test critical operations', 'http://localhost:3009/lab1', 'lab', 1, 2, NULL,
    '**MISSION BRIEF:** Agent, Evil Corp''s SecureVault Data Management system handles highly sensitive information. Our forensics team needs to know if they can detect intrusions.

**YOUR OBJECTIVE:** Identify critical security events that aren''t being logged.

**THE VULNERABILITY:** Without proper logging, attacks are invisible. Security teams can''t:
- Detect breaches in progress
- Investigate incidents after the fact
- Track unauthorized access
- Prove compliance with regulations
- Alert on suspicious patterns

**WHAT SHOULD BE LOGGED:**
✅ **Authentication Events:**
   - Failed login attempts
   - Successful logins
   - Password changes
   - Account lockouts

✅ **Authorization Failures:**
   - Attempts to access unauthorized resources
   - Privilege escalation attempts
   - Permission denied errors

✅ **Data Access:**
   - Viewing sensitive records
   - Exporting/downloading data
   - Database queries
   - File access

✅ **Administrative Actions:**
   - User account creation/deletion
   - Permission changes
   - Configuration modifications
   - System updates

**YOUR TESTING APPROACH:**
1. Access http://localhost:3009/lab1
2. Perform these actions and check if they''re logged:
   - Multiple failed login attempts (should trigger alerts)
   - Accessing admin pages without authorization
   - Viewing sensitive user data
   - Attempting IDOR or SQLi attacks
   - Making unauthorized API calls
3. Look for log files, audit trails, or monitoring dashboards
4. Use DevTools to see if logging API calls are made

**HOW TO VERIFY:**
- Check for /logs, /api/logs endpoints
- Look for monitoring or admin dashboard
- Trigger alerts intentionally
- Use Burp to see if analytics/logging requests are sent

**THE PROBLEM:** If Evil Corp doesn''t log these events, you can:
- Attack repeatedly without detection
- Exfiltrate data invisibly
- Maintain persistent access without being caught

Expose their logging blind spots! 🙈📝'),
    ('A09', 'A09 Lab 2: Log Data Leak', 'Find sensitive data that''s being leaked in logs.', 'Medium', 150, 'HARVEST{P11_1N_L0GS}', 'Passwords shouldn''t be logged', 'http://localhost:3009/lab2', 'lab', 2, 3, NULL,
    '**MISSION BRIEF:** Good work identifying missing logs, agent. Now let''s find the opposite problem: logs that contain TOO MUCH information.

**YOUR OBJECTIVE:** Discover sensitive data being leaked through verbose logging.

**THE VULNERABILITY:** Overly detailed logs can expose:
- Plaintext passwords
- API keys and tokens
- Session identifiers
- Credit card numbers
- Personal information (SSN, emails, addresses)
- Internal system paths and configurations
- Database connection strings

**WHAT SHOULD NEVER BE LOGGED:**
❌ Passwords (plaintext or hashed)
❌ Session tokens or JWTs
❌ Credit card numbers or CVVs
❌ Social Security Numbers
❌ API keys and secrets
❌ Encryption keys
❌ Personal health information

**YOUR HUNTING APPROACH:**
1. Access http://localhost:3009/lab2
2. Look for accessible log files:
   - /logs/app.log, /logs/error.log
   - /api/logs, /debug/logs
   - /var/log/application
   - Browser console (client-side logging)
3. Trigger verbose errors:
   - Submit forms with invalid data
   - Force authentication failures
   - Cause database errors
   - Access restricted endpoints
4. Examine error messages and stack traces
5. Check if logs appear in:
   - Browser console
   - Network tab (analytics/logging requests)
   - Exposed log files
   - Error pages

**WHAT YOU''RE LOOKING FOR:**
- Login attempts with passwords visible: "Failed login for user=admin, password=P@ssw0rd!"
- API keys in URLs: "GET /api/data?apiKey=abc123"
- Session tokens in logs
- Full database connection strings with credentials
- Customer PII in error messages

**THE GOLDMINE:** Error logs often contain the most sensitive data because developers log everything during debugging and forget to sanitize in production.

**TOOLS:**
- Browser DevTools Console
- Burp Suite to intercept logging requests
- Direct access to log endpoints
- Fuzzing to trigger verbose errors

Find the data they''re carelessly logging! 📋💔'),
    ('A09', 'A09 Lab 3: Cover Your Tracks', 'Exploit logging failures to hide evidence of intrusion.', 'Hard', 200, 'HARVEST{L0G_T4MP3R1NG}', 'No audit trail exists', 'http://localhost:3009/lab3', 'lab', 3, 4, NULL,
    '**MISSION BRIEF:** Exceptional work, agent. You''ve proven Evil Corp can''t see attacks and leaks data in logs. Now use this knowledge to operate completely undetected.

**YOUR OBJECTIVE:** Perform a sophisticated attack while leaving no trace in Evil Corp''s logging or monitoring systems.

**THE CHALLENGE:** Advanced attackers don''t just exploit systems - they cover their tracks. You need to:
1. Identify what IS being logged
2. Avoid those detection mechanisms
3. Exploit gaps in monitoring
4. Erase evidence if necessary
5. Complete your mission invisibly

**ANTI-FORENSICS TECHNIQUES:**

**1. LOG INJECTION/POLLUTION:**
- Inject fake log entries to hide real ones
- Flood logs with noise to bury evidence
- Split malicious requests across multiple log entries
- Use log format strings to corrupt parsing

**2. EXPLOITING LOG GAPS:**
- If failed logins are logged but API calls aren''t - use API
- If admin panel is monitored but API isn''t - use API
- Attack through unmonitored endpoints
- Use timing to slip between log intervals

**3. LOG TAMPERING:**
- Delete your attack logs if you gain access
- Modify timestamps to make attacks appear historical
- Use log rotation to push evidence out of retention
- Crash logging service during attack

**4. STEALTH ATTACKS:**
- Slow attacks spread over time (avoid rate limiting alerts)
- Stay under threshold limits
- Use legitimate user accounts (hijacked sessions)
- Mimic normal traffic patterns

**YOUR STRATEGY:**
1. Access http://localhost:3009/lab3
2. Perform reconnaissance:
   - What gets logged?
   - What doesn''t?
   - Can you access/modify logs?
   - Are there monitoring blind spots?
3. Plan your attack to avoid detection:
   - Use unmonitored endpoints
   - Stay below alert thresholds
   - Inject noise to hide signal
4. Execute your attack
5. Verify no evidence remains

**ATTACK SCENARIOS:**

**Scenario A: Data Exfiltration**
- Slowly download sensitive data
- Use legitimate export features
- Spread access over time
- Leave no spike in logs

**Scenario B: Privilege Escalation**
- Exploit unmonitored vulnerability
- Create backdoor account
- Use API calls instead of UI
- Avoid triggering admin action logs

**Scenario C: Log Manipulation**
- Gain access to log files
- Delete entries showing your activity
- Inject false entries to create confusion
- Corrupt log integrity

**THE ULTIMATE TEST:** Can you:
- Access sensitive data
- Create a backdoor account
- Modify system configurations
- Extract valuable information
WITHOUT triggering ANY alerts or leaving ANY evidence?

**THE PRIZE:** Operating completely undetected means:
- Persistent long-term access
- Ability to exfiltrate data over time
- No incident response against you
- Complete operational security

Become a ghost in their system! 👻🔇');

-- ========================================
-- A10: MISHANDLING EXCEPTIONAL CONDITIONS
-- Natural Progression: Triggering → Analysis → Extraction → Exploitation
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('A10', 'A10 Example: Error Handling', 'Learn about proper error handling and information disclosure.', 'Tutorial', 50, 'NSA{ERRORS_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3010/example', 'example', NULL, 1,
    '**Step 1:** Visit http://localhost:3010/example to explore error handling vulnerabilities
**Step 2:** Understand that errors are inevitable - what matters is HOW they''re handled
**Step 3:** Trigger errors intentionally: invalid input, missing parameters, SQL injection attempts
**Step 4:** Observe what information errors reveal: stack traces, file paths, database details
**Step 5:** Look for verbose error messages that leak system architecture
**Step 6:** Test if errors crash the application or cause unexpected behavior
**Step 7:** Check if sensitive operations fail silently (hiding attacks) or noisily (revealing vulnerabilities)
**Step 8:** Try edge cases: null values, extremely long inputs, special characters, negative numbers
**Key Lesson:** Proper error handling means: generic messages to users, detailed logging for developers, graceful degradation without crashes, no information leakage!', NULL),
    ('A10', 'A10 Lab 1: Trigger Errors', 'Cause errors that reveal information about the system.', 'Easy', 100, 'HARVEST{V3RB0S3_3RR0RS}', 'Invalid input reveals info', 'http://localhost:3010/lab1', 'lab', 1, 2, NULL,
    '**MISSION BRIEF:** Agent, Evil Corp''s API Gateway is the front door to their entire infrastructure. Our intelligence suggests poor error handling may leak critical information.

**YOUR OBJECTIVE:** Trigger errors that reveal detailed information about Evil Corp''s system architecture.

**THE VULNERABILITY:** Verbose error messages can expose:
- Technology stack (programming languages, frameworks, versions)
- Database types and structure
- File paths and directory structure
- Internal server architecture
- Configuration details
- SQL queries and code snippets

**HOW TO TRIGGER REVEALING ERRORS:**

**1. INVALID INPUT:**
- Submit letters where numbers are expected
- Use special characters: `'' " < > ; | &`
- Try null/empty values
- Extremely long strings (buffer overflow attempts)

**2. TYPE MISMATCHES:**
- String instead of integer: `id=abc`
- Negative numbers: `amount=-1000`
- SQL injection: `id=1'' OR ''1''=''1`
- XSS: `<script>alert(1)</script>`

**3. MISSING PARAMETERS:**
- Remove required fields from requests
- Send requests without authentication
- Access endpoints with wrong HTTP methods (POST → GET)

**4. BOUNDARY CONDITIONS:**
- Maximum values (999999999)
- Zero or negative values
- Unicode and special encodings
- Binary data where text is expected

**YOUR STRATEGY:**
1. Access http://localhost:3010/lab1
2. Use Burp Suite to intercept requests
3. Systematically fuzz each parameter
4. Observe error responses for information leakage
5. Document what the errors reveal

**WHAT YOU''RE LOOKING FOR:**
- Stack traces with file paths: `/usr/app/controllers/user.js:45`
- Database errors: `MySQL ERROR 1064 at line 1`
- Framework versions: `Express.js v4.17.1 Error`
- Internal IPs and hostnames
- SQL queries: `SELECT * FROM users WHERE id=`

**TOOLS:**
- Burp Suite Intruder for fuzzing
- Browser DevTools to see error responses
- cURL to test edge cases
- Repeater to modify requests

**THE PRIZE:** Each error message is a piece of the puzzle. Collect enough pieces and you''ll have a complete map of Evil Corp''s infrastructure.

Make their errors work for you! ⚠️🔍'),
    ('A10', 'A10 Lab 2: Stack Trace Recon', 'Extract detailed information from stack traces.', 'Medium', 150, 'HARVEST{ST4CK_TR4C3_L34K}', 'Full paths revealed', 'http://localhost:3010/lab2', 'lab', 2, 3, NULL,
    '**MISSION BRIEF:** Excellent work triggering errors, agent. Now let''s dig deeper into those stack traces for actionable intelligence.

**YOUR OBJECTIVE:** Extract detailed system information from verbose stack traces and error messages.

**THE INTELLIGENCE:** Stack traces are goldmines for attackers, revealing:
- **File Structure:** Complete directory paths to source files
- **Framework Details:** Exact versions with known CVEs
- **Database Schema:** Table names, column names, relationships
- **Code Logic:** Function names, execution flow, business logic
- **Dependencies:** Third-party libraries and their versions
- **Server Config:** Working directories, system paths

**WHAT STACK TRACES REVEAL:**

**Example Stack Trace:**
```
Error: Cannot read property ''name'' of undefined
    at getUserProfile (/var/www/app/controllers/userController.js:42)
    at authenticate (/var/www/app/middleware/auth.js:15)
    at Layer.handle (/var/www/app/node_modules/express/lib/router/layer.js:95)
    at trim_prefix (/var/www/app/node_modules/express/lib/router/index.js:317)
```

**What This Tells You:**
- App location: `/var/www/app`
- Framework: Express.js
- Exact file causing error: `userController.js` line 42
- Authentication middleware exists
- Function names reveal API structure

**YOUR ANALYSIS APPROACH:**
1. Access http://localhost:3010/lab2
2. Trigger errors that produce stack traces
3. Analyze each line of the trace:
   - Map out file structure
   - Identify frameworks and versions
   - Note function/method names
   - Spot database interactions
   - Find vulnerable dependencies
4. Use this intel for targeted attacks

**EXPLOITATION TECHNIQUES:**

**From File Paths:**
- Try path traversal: `../../etc/passwd`
- Direct file access if web root is exposed
- Understand app architecture for targeted attacks

**From Framework Versions:**
- Search CVE databases for known vulnerabilities
- Find exploit code for specific versions
- Identify framework-specific attack vectors

**From Function Names:**
- Understand API structure
- Guess other endpoint names
- Map business logic flows

**From Dependencies:**
- Check for vulnerable versions
- Supply chain attack opportunities
- Known exploits in third-party code

**YOUR STRATEGY:**
1. Collect multiple stack traces from different errors
2. Build a complete map of the application structure
3. Identify the most vulnerable components
4. Cross-reference versions with CVE databases
5. Plan targeted attacks on weakest points

**TOOLS:**
- CVE search: cve.mitre.org, nvd.nist.gov
- Exploit DB: exploit-db.com
- Version scanners: Wappalyzer, BuiltWith
- Path traversal testing tools

Turn their verbose errors into your attack map! 📍🗺️'),
    ('A10', 'A10 Lab 3: Suppress Evidence', 'Use error handling flaws to hide exploitation activities.', 'Hard', 200, 'HARVEST{S1L3NT_F41LUR3}', 'Generic errors hide attacks', 'http://localhost:3010/lab3', 'lab', 3, 4, NULL,
    '**MISSION BRIEF:** Brilliant reconnaissance, agent. You''ve mapped their system through error messages. Now let''s weaponize poor error handling to hide your attacks.

**YOUR OBJECTIVE:** Exploit error handling flaws to execute attacks that remain undetected by security monitoring.

**THE ADVANCED TECHNIQUE:** Poor error handling isn''t just about information disclosure - it can also hide malicious activity. This is the opposite problem: errors that DON''T reveal enough.

**HOW ERRORS HIDE ATTACKS:**

**1. SILENT FAILURES:**
- Security checks fail silently, allowing unauthorized access
- Validation errors don''t log or alert
- Attacks succeed but appear as normal failures
- No evidence in logs or monitoring

**2. GENERIC ERROR MESSAGES:**
- All errors return "Something went wrong"
- Can''t distinguish attack attempts from legitimate errors
- Hides SQL injection, XSS, and other exploits in noise
- Security team sees errors but can''t identify attacks

**3. ERROR-BASED BLIND ATTACKS:**
- SQL injection without visible output
- Timing attacks based on error delays
- Boolean-based attacks observing error vs success
- Exploiting error conditions to infer data

**4. EXCEPTION HANDLING BYPASSES:**
- Code that catches exceptions too broadly
- Try-catch blocks that suppress security errors
- Fail-open instead of fail-closed
- Default allow when validation errors occur

**YOUR ATTACK STRATEGIES:**

**SCENARIO A: SILENT SQL INJECTION**
1. Access http://localhost:3010/lab3
2. Find SQL injection point
3. Use blind SQLi techniques:
   - Time-based: `1'' AND SLEEP(5)--`
   - Boolean-based: `1'' AND (SELECT COUNT(*) FROM users)>0--`
4. Extract data one bit at a time
5. No errors visible, attack invisible in logs

**SCENARIO B: AUTHENTICATION BYPASS**
1. Trigger error in authentication logic
2. Observe if error causes fail-open (grants access)
3. Exploit exception handling that defaults to "allow"
4. Example: `username=admin&password=` (empty password causes error → access granted)

**SCENARIO C: ERROR FLOODING**
1. Generate massive numbers of errors
2. Bury attack attempts in noise
3. Security team sees "errors" but not "attacks"
4. Real SQLi attempts hidden among 10,000 random errors

**SCENARIO D: EXCEPTION-BASED ATTACKS**
1. Cause exceptions in specific code paths
2. Bypass security checks that are in try-catch blocks
3. Reach vulnerable code that''s "protected" by error handling
4. Exploit race conditions in error handling

**YOUR MISSION:**
1. Find a security-critical operation
2. Trigger errors that bypass security checks
3. Exploit the gap between error and security
4. Complete attack without triggering alerts
5. Extract data or gain access silently

**WHAT TO EXPLOIT:**
- Authentication that fails open on errors
- Authorization checks wrapped in try-catch that suppress errors
- Validation that silently fails
- Security logging that stops working on errors

**THE ULTIMATE PRIZE:** Successfully attacking through error handling means:
- Complete invisibility to security monitoring
- Bypassing security controls through exceptions
- Exploiting the gap between "error" and "attack"
- Using defensive code against itself

**ADVANCED CONCEPT:** The best error handling from a security perspective is:
- Fail closed (deny on error, not allow)
- Log security-relevant errors separately
- Never suppress security exceptions
- Generic messages to users, detailed logs for security

Make their error handling your ally! 🤫🎯');

-- ========================================
-- CITADEL (Final Exam)
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order, tutorial, mission_brief) VALUES
    ('ALL', 'Citadel: Final Exam', 'Exploit Evil Corp''s corporate website. All vulnerabilities present, no hints.', 'Expert', 500, 'NSA{C1T4D3L_H4S_F4LL3N_R00T_4CC3SS}', 'Apply everything you learned', 'http://localhost:3000', 'exam', NULL, 1, NULL,
    '**MISSION BRIEF:** Congratulations, agent. You''ve completed your training across all OWASP Top 10 categories. Now comes your final test.

**THE CITADEL:** Evil Corp''s main corporate website at http://localhost:3000 - their crown jewel. This is a real-world target with multiple vulnerabilities chained together.

**YOUR OBJECTIVE:** Complete compromise of Evil Corp''s corporate infrastructure. This means:
- Gain administrative access to the system
- Extract sensitive corporate data
- Demonstrate persistent access capability
- Capture the ultimate flag proving total compromise

**THE CHALLENGE:** Unlike the guided labs, The Citadel offers:
- ❌ No step-by-step tutorials
- ❌ No hints about which vulnerabilities exist
- ❌ No indication of the attack path
- ❌ No safety rails or guided progression
- ✅ Multiple vulnerabilities to discover
- ✅ Vulnerabilities that must be chained together
- ✅ Real-world attack scenarios
- ✅ The ultimate test of your skills

**WHAT YOU KNOW:**
You''ve trained on every OWASP Top 10 category:
- **A01:** Broken Access Control (IDOR, privilege escalation)
- **A02:** Security Misconfiguration (debug info, default creds)
- **A03:** Supply Chain (vulnerable dependencies)
- **A04:** Cryptographic Failures (weak hashing, plaintext storage)
- **A05:** Injection (SQL injection, command injection)
- **A06:** Insecure Design (logic flaws, race conditions)
- **A07:** Authentication Failures (session hijacking, weak passwords)
- **A08:** Integrity Failures (unsigned updates, deserialization)
- **A09:** Logging Failures (missing logs, covering tracks)
- **A10:** Error Handling (information disclosure, silent failures)

**YOUR APPROACH:**
1. **Reconnaissance:** Map the application, identify all features and endpoints
2. **Enumeration:** Test for each OWASP Top 10 vulnerability
3. **Exploitation:** Chain vulnerabilities together for maximum impact
4. **Persistence:** Establish ongoing access to the compromised system
5. **Exfiltration:** Extract the flag and proof of compromise

**ATTACK METHODOLOGY:**

**Phase 1: Passive Reconnaissance**
- Browse the site like a normal user
- Map all features and functionality
- Identify user roles (guest, user, admin)
- Document input points and API endpoints
- Note technologies in use

**Phase 2: Active Reconnaissance**
- Test authentication mechanisms
- Enumerate users and resources
- Check for common vulnerabilities
- Trigger errors to gather intelligence
- Look for misconfigurations

**Phase 3: Exploitation**
- Chain multiple vulnerabilities
- Escalate from user to admin
- Bypass security controls
- Exploit the weakest link
- Gain system-level access

**Phase 4: Post-Exploitation**
- Establish persistence
- Cover your tracks
- Extract sensitive data
- Capture the flag
- Document the full attack chain

**TIPS FOR SUCCESS:**
- Start with the easiest vulnerabilities (A01, A02)
- Look for chaining opportunities
- One vulnerability often enables another
- Admin access is likely required for the flag
- Think like a real attacker: persistent, methodical, creative

**THE STAKES:** This is your final exam. Success means you''re ready for real-world security testing. Failure means more practice is needed.

**NO HINTS. NO GUIDANCE. JUST YOU AND THE CITADEL.**

Every tool you''ve learned. Every technique you''ve practiced. Every vulnerability you''ve exploited. It all comes down to this.

Welcome to The Citadel, agent. Evil Corp''s fate is in your hands.

**Breach their defenses. Capture the flag. Prove you''re elite.** 🏰🔥');

-- Create indexes for faster queries (IF NOT EXISTS requires PostgreSQL 9.5+)
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_challenge ON user_progress(challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenges_category ON challenges(owasp_category);
CREATE INDEX IF NOT EXISTS idx_challenges_order ON challenges(challenge_order);
