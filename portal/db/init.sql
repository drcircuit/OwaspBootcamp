-- NotSoAnonymous Portal Database Schema

-- Users table for portal authentication
CREATE TABLE IF NOT EXISTS portal_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    hacker_alias VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Challenge categories aligned with hacking stages
CREATE TABLE IF NOT EXISTS challenge_stages (
    id SERIAL PRIMARY KEY,
    stage_name VARCHAR(50) NOT NULL,
    stage_order INTEGER NOT NULL,
    description TEXT,
    icon VARCHAR(50)
);

-- Individual challenges mapped to OWASP Top 10 and hacking stages
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    stage_id INTEGER REFERENCES challenge_stages(id),
    owasp_category VARCHAR(10) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20),
    points INTEGER DEFAULT 100,
    flag VARCHAR(100),
    hint TEXT,
    lab_url VARCHAR(200),
    challenge_type VARCHAR(20) DEFAULT 'lab', -- 'example' or 'lab'
    lab_number INTEGER, -- 1, 2, 3 for labs; NULL for examples
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

-- Insert hacking stages
INSERT INTO challenge_stages (stage_name, stage_order, description, icon) VALUES
    ('Recon', 1, 'Reconnaissance - Gather intelligence about Evil Capitalistic Corp', '🔍'),
    ('Scanning', 2, 'Scanning & Enumeration - Identify vulnerabilities and attack vectors', '📡'),
    ('Initial Access', 3, 'Initial Access - Break into the system and establish foothold', '🔓'),
    ('Maintained Access', 4, 'Maintain Access - Establish persistence and expand access', '🔐'),
    ('Cover Tracks', 5, 'Cover Your Tracks - Remove evidence of intrusion', '👻');

-- Insert challenges mapped to OWASP Top 10 and stages
-- Format: Each OWASP category has 1 example (walkthrough) + 3 labs (increasing difficulty)
-- Challenges cover relevant hacking stages: Recon, Scanning, Initial Access, Maintained Access, Cover Tracks

-- ========================================
-- A01: BROKEN ACCESS CONTROL
-- ========================================
-- Example (Recon stage)
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (1, 'A01', 'A01 Example: Understanding IDOR', 'Learn about Insecure Direct Object References by examining user profiles.', 'Tutorial', 50, 'NSA{IDOR_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3001/example', 'example', NULL);

-- Lab 1 (Scanning stage) - Easy
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (2, 'A01', 'A01 Lab 1: User Enumeration', 'Find other users in the system.', 'Easy', 100, 'NSA{F0UND_TH3_US3RS}', 'User IDs are sequential', 'http://localhost:3001/lab1', 'lab', 1);

-- Lab 2 (Initial Access stage) - Medium
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (3, 'A01', 'A01 Lab 2: Access Other Profiles', 'Access data you shouldn''t see.', 'Medium', 150, 'NSA{1D0R_V1A_1NC3PT10N}', 'Try different IDs', 'http://localhost:3001/lab2', 'lab', 2);

-- Lab 3 (Maintained Access stage) - Hard
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (4, 'A01', 'A01 Lab 3: Privilege Escalation', 'Become an administrator.', 'Hard', 200, 'NSA{R00T_4CC3SS_4CH13V3D}', 'Admin is just another user', 'http://localhost:3001/lab3', 'lab', 3);

-- ========================================
-- A02: SECURITY MISCONFIGURATION
-- ========================================
-- Example (Recon stage)
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (1, 'A02', 'A02 Example: Debug Endpoints', 'Learn how debug endpoints expose sensitive information.', 'Tutorial', 50, 'NSA{DEBUG_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3002/example', 'example', NULL);

-- Lab 1 (Recon stage) - Easy
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (1, 'A02', 'A02 Lab 1: Find Debug Info', 'Locate exposed debug endpoints.', 'Easy', 100, 'NSA{D3BUG_F0UND}', 'Common debug paths', 'http://localhost:3002/lab1', 'lab', 1);

-- Lab 2 (Scanning stage) - Medium
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (2, 'A02', 'A02 Lab 2: Configuration Leak', 'Extract configuration data.', 'Medium', 150, 'NSA{C0NF1G_L3AK3D}', 'Check for config files', 'http://localhost:3002/lab2', 'lab', 2);

-- Lab 3 (Initial Access stage) - Hard
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (3, 'A02', 'A02 Lab 3: Admin Panel Access', 'Find and access the admin panel.', 'Hard', 200, 'NSA{4DM1N_P4N3L_PWN3D}', 'Default credentials exist', 'http://localhost:3002/lab3', 'lab', 3);

-- ========================================
-- A03: SOFTWARE SUPPLY CHAIN FAILURES
-- ========================================
-- Example (Scanning stage)
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (2, 'A03', 'A03 Example: Dependency Scanning', 'Learn how to scan for vulnerable dependencies.', 'Tutorial', 50, 'NSA{SUPPLY_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3003/example', 'example', NULL);

-- Lab 1 (Recon stage) - Easy
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (1, 'A03', 'A03 Lab 1: Version Discovery', 'Identify package versions in use.', 'Easy', 100, 'NSA{V3RS10NS_F0UND}', 'Headers reveal information', 'http://localhost:3003/lab1', 'lab', 1);

-- Lab 2 (Scanning stage) - Medium
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (2, 'A03', 'A03 Lab 2: Find Vulnerabilities', 'Scan for known vulnerabilities.', 'Medium', 150, 'NSA{0LD_P4CK4G3S_M34N_0LD_BUG5}', 'Use scanning tools', 'http://localhost:3003/lab2', 'lab', 2);

-- Lab 3 (Initial Access stage) - Hard
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (3, 'A03', 'A03 Lab 3: Exploit Dependencies', 'Exploit a vulnerable dependency.', 'Hard', 200, 'NSA{SUPPLYCHA1N_PWNED}', 'Known CVEs have PoCs', 'http://localhost:3003/lab3', 'lab', 3);

-- ========================================
-- A04: CRYPTOGRAPHIC FAILURES
-- ========================================
-- Example (Recon stage)
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (1, 'A04', 'A04 Example: Weak Crypto', 'Learn about cryptographic weaknesses.', 'Tutorial', 50, 'NSA{CRYPTO_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3004/example', 'example', NULL);

-- Lab 1 (Recon stage) - Easy
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (1, 'A04', 'A04 Lab 1: Find Weak Hashing', 'Identify weak hashing algorithms.', 'Easy', 100, 'NSA{W3AK_H4SH_F0UND}', 'MD5 is not secure', 'http://localhost:3004/lab1', 'lab', 1);

-- Lab 2 (Scanning stage) - Medium
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (2, 'A04', 'A04 Lab 2: Crack Weak Hash', 'Crack weakly hashed passwords.', 'Medium', 150, 'NSA{P4SSW0RD_CR4CK3D}', 'Rainbow tables help', 'http://localhost:3004/lab2', 'lab', 2);

-- Lab 3 (Initial Access stage) - Hard
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (3, 'A04', 'A04 Lab 3: Extract Plain Passwords', 'Find plaintext credentials.', 'Hard', 200, 'NSA{PL41N_T3XT_P4SSW0RDS}', 'Database has no encryption', 'http://localhost:3004/lab3', 'lab', 3);

-- ========================================
-- A05: INJECTION
-- ========================================
-- Example (Scanning stage)
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (2, 'A05', 'A05 Example: SQL Injection Basics', 'Learn the fundamentals of SQL injection.', 'Tutorial', 50, 'NSA{INJECTION_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3005/example', 'example', NULL);

-- Lab 1 (Recon stage) - Easy
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (1, 'A05', 'A05 Lab 1: Find Input Points', 'Identify injectable parameters.', 'Easy', 100, 'NSA{1NPUT_P01NTS_F0UND}', 'Forms and URLs accept input', 'http://localhost:3005/lab1', 'lab', 1);

-- Lab 2 (Scanning stage) - Medium
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (2, 'A05', 'A05 Lab 2: Test for SQLi', 'Test parameters for SQL injection.', 'Medium', 150, 'NSA{SQ L1_D3T3CT3D}', 'Single quotes cause errors', 'http://localhost:3005/lab2', 'lab', 2);

-- Lab 3 (Initial Access stage) - Hard
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (3, 'A05', 'A05 Lab 3: Exploit SQL Injection', 'Extract data via SQL injection.', 'Hard', 200, 'NSA{1NJ3CT_Y0UR_W4Y_1N}', 'UNION SELECT is powerful', 'http://localhost:3005/lab3', 'lab', 3);

-- ========================================
-- A06: INSECURE DESIGN
-- ========================================
-- Example (Recon stage)
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (1, 'A06', 'A06 Example: Design Flaws', 'Learn about insecure design patterns.', 'Tutorial', 50, 'NSA{DESIGN_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3006/example', 'example', NULL);

-- Lab 1 (Recon stage) - Easy
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (1, 'A06', 'A06 Lab 1: Identify Missing Controls', 'Find missing security controls.', 'Easy', 100, 'NSA{N0_R4T3_L1M1T}', 'No throttling exists', 'http://localhost:3006/lab1', 'lab', 1);

-- Lab 2 (Scanning stage) - Medium
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (2, 'A06', 'A06 Lab 2: Logic Flaw Scan', 'Identify business logic flaws.', 'Medium', 150, 'NSA{L0G1C_FL4W_F0UND}', 'Order of operations matters', 'http://localhost:3006/lab2', 'lab', 2);

-- Lab 3 (Initial Access stage) - Hard
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (3, 'A06', 'A06 Lab 3: Exploit Design Flaw', 'Abuse the flawed design.', 'Hard', 200, 'NSA{L0G1C_0V3R_S3CUR1TY}', 'Race conditions win', 'http://localhost:3006/lab3', 'lab', 3);

-- ========================================
-- A07: AUTHENTICATION FAILURES
-- ========================================
-- Example (Recon stage)
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (1, 'A07', 'A07 Example: Auth Mechanisms', 'Learn about authentication weaknesses.', 'Tutorial', 50, 'NSA{AUTH_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3007/example', 'example', NULL);

-- Lab 1 (Recon stage) - Easy
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (1, 'A07', 'A07 Lab 1: Weak Password Policy', 'Test password requirements.', 'Easy', 100, 'NSA{W3AK_P4SS_P0L1CY}', 'Try simple passwords', 'http://localhost:3007/lab1', 'lab', 1);

-- Lab 2 (Scanning stage) - Medium
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (2, 'A07', 'A07 Lab 2: Session Analysis', 'Analyze session management.', 'Medium', 150, 'NSA{S3SS10N_PR3D1CT4BL3}', 'Sessions are sequential', 'http://localhost:3007/lab2', 'lab', 2);

-- Lab 3 (Initial Access stage) - Hard
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (3, 'A07', 'A07 Lab 3: Session Hijacking', 'Hijack another user''s session.', 'Hard', 200, 'NSA{S3SS10N_H1J4CK3D}', 'Predict or steal tokens', 'http://localhost:3007/lab3', 'lab', 3);

-- Lab 4 (Maintained Access stage) - Expert (bonus)
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (4, 'A07', 'A07 Bonus: Backdoor Account', 'Create persistent access.', 'Expert', 250, 'NSA{P3RS1ST3NC3_1S_K3Y}', 'Register with weak validation', 'http://localhost:3007/bonus', 'lab', 4);

-- ========================================
-- A08: SOFTWARE AND DATA INTEGRITY FAILURES
-- ========================================
-- Example (Scanning stage)
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (2, 'A08', 'A08 Example: Integrity Checks', 'Learn about integrity verification.', 'Tutorial', 50, 'NSA{INTEGRITY_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3008/example', 'example', NULL);

-- Lab 1 (Recon stage) - Easy
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (1, 'A08', 'A08 Lab 1: Update Mechanism', 'Identify update processes.', 'Easy', 100, 'NSA{UPD4T3_F0UND}', 'No signatures present', 'http://localhost:3008/lab1', 'lab', 1);

-- Lab 2 (Scanning stage) - Medium
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (2, 'A08', 'A08 Lab 2: Missing Checksums', 'Find missing integrity checks.', 'Medium', 150, 'NSA{N0_CHK5UM_V3R1FY}', 'No validation happens', 'http://localhost:3008/lab2', 'lab', 2);

-- Lab 3 (Initial Access stage) - Hard
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (3, 'A08', 'A08 Lab 3: Malicious Update', 'Replace legitimate code.', 'Hard', 200, 'NSA{N0_CHK5UM_N0_PR0BL3M}', 'Unsigned updates accepted', 'http://localhost:3008/lab3', 'lab', 3);

-- ========================================
-- A09: SECURITY LOGGING FAILURES
-- ========================================
-- Example (Recon stage)
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (1, 'A09', 'A09 Example: Logging Best Practices', 'Learn what should be logged.', 'Tutorial', 50, 'NSA{LOGGING_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3009/example', 'example', NULL);

-- Lab 1 (Recon stage) - Easy
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (1, 'A09', 'A09 Lab 1: Missing Logs', 'Find what''s not being logged.', 'Easy', 100, 'NSA{N0TH1NG_L0GG3D}', 'Test critical operations', 'http://localhost:3009/lab1', 'lab', 1);

-- Lab 2 (Scanning stage) - Medium
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (2, 'A09', 'A09 Lab 2: Log Data Leak', 'Find sensitive data in logs.', 'Medium', 150, 'NSA{L0G_D4T4_L3AK}', 'Passwords shouldn''t be logged', 'http://localhost:3009/lab2', 'lab', 2);

-- Lab 3 (Cover Tracks stage) - Hard
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (5, 'A09', 'A09 Lab 3: Cover Your Tracks', 'Exploit to hide evidence.', 'Hard', 200, 'NSA{N0_L0GS_N0_CR1M3}', 'No audit trail exists', 'http://localhost:3009/lab3', 'lab', 3);

-- ========================================
-- A10: MISHANDLING EXCEPTIONAL CONDITIONS
-- ========================================
-- Example (Recon stage)
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (1, 'A10', 'A10 Example: Error Handling', 'Learn about proper error handling.', 'Tutorial', 50, 'NSA{ERRORS_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3010/example', 'example', NULL);

-- Lab 1 (Recon stage) - Easy
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (1, 'A10', 'A10 Lab 1: Trigger Errors', 'Cause informative errors.', 'Easy', 100, 'NSA{3RR0RS_T3LL_T4L3S}', 'Invalid input reveals info', 'http://localhost:3010/lab1', 'lab', 1);

-- Lab 2 (Scanning stage) - Medium
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (2, 'A10', 'A10 Lab 2: Stack Trace Recon', 'Extract info from stack traces.', 'Medium', 150, 'NSA{ST4CK_TR4C3_1NF0}', 'Full paths revealed', 'http://localhost:3010/lab2', 'lab', 2);

-- Lab 3 (Cover Tracks stage) - Hard
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (5, 'A10', 'A10 Lab 3: Suppress Evidence', 'Hide exploitation via errors.', 'Hard', 200, 'NSA{S1L3NCE_1S_G0LD3N}', 'Generic errors hide attacks', 'http://localhost:3010/lab3', 'lab', 3);

-- ========================================
-- CITADEL (Final Exam)
-- ========================================
-- Comprehensive challenge covering all OWASP Top 10
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number) VALUES
    (3, 'ALL', 'Citadel: Final Exam', 'Exploit Evil Corp''s corporate website. All vulnerabilities present.', 'Expert', 500, 'NSA{C1T4D3L_C0MPL3T3}', 'Apply everything you learned', 'http://localhost:3000', 'exam', NULL);

-- Create index for faster queries
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_challenge ON user_progress(challenge_id);
CREATE INDEX idx_challenges_stage ON challenges(stage_id);
