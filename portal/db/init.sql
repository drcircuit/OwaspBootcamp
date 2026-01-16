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

-- Insert challenges with natural progression for each OWASP topic
-- Each topic: 1 example (order=1) + 3 labs (order=2,3,4)
-- Stages are implied by the progression within each topic

-- ========================================
-- A01: BROKEN ACCESS CONTROL
-- Natural Progression: Understanding → Enumeration → Exploitation → Escalation
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order) VALUES
    ('A01', 'A01 Example: Understanding IDOR', 'Learn about Insecure Direct Object References and how to exploit them using real tools.', 'Tutorial', 50, 'NSA{IDOR_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3001/example', 'example', NULL, 1),
    ('A01', 'A01 Lab 1: User Enumeration', 'Enumerate users in the system to identify potential targets.', 'Easy', 100, 'NSA{F0UND_TH3_US3RS}', 'User IDs are sequential', 'http://localhost:3001/lab1', 'lab', 1, 2),
    ('A01', 'A01 Lab 2: Access Other Profiles', 'Exploit IDOR to access data belonging to other users.', 'Medium', 150, 'NSA{1D0R_V1A_1NC3PT10N}', 'Try different IDs', 'http://localhost:3001/lab2', 'lab', 2, 3),
    ('A01', 'A01 Lab 3: Privilege Escalation', 'Escalate privileges to gain administrator access.', 'Hard', 200, 'NSA{R00T_4CC3SS_4CH13V3D}', 'Admin is just another user', 'http://localhost:3001/lab3', 'lab', 3, 4);

-- ========================================
-- A02: SECURITY MISCONFIGURATION
-- Natural Progression: Discovery → Analysis → Exploitation → Access
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order) VALUES
    ('A02', 'A02 Example: Debug Endpoints', 'Learn how security misconfigurations expose sensitive information.', 'Tutorial', 50, 'NSA{DEBUG_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3002/example', 'example', NULL, 1),
    ('A02', 'A02 Lab 1: Find Debug Info', 'Discover exposed debug endpoints that leak information.', 'Easy', 100, 'NSA{D3BUG_F0UND}', 'Common debug paths', 'http://localhost:3002/lab1', 'lab', 1, 2),
    ('A02', 'A02 Lab 2: Configuration Leak', 'Extract sensitive configuration data from exposed endpoints.', 'Medium', 150, 'NSA{C0NF1G_L3AK3D}', 'Check for config files', 'http://localhost:3002/lab2', 'lab', 2, 3),
    ('A02', 'A02 Lab 3: Admin Panel Access', 'Leverage misconfigurations to access the admin panel.', 'Hard', 200, 'NSA{4DM1N_P4N3L_PWN3D}', 'Default credentials exist', 'http://localhost:3002/lab3', 'lab', 3, 4);

-- ========================================
-- A03: SOFTWARE SUPPLY CHAIN FAILURES
-- Natural Progression: Discovery → Scanning → Identification → Exploitation
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order) VALUES
    ('A03', 'A03 Example: Dependency Scanning', 'Learn how to identify and exploit vulnerable dependencies.', 'Tutorial', 50, 'NSA{SUPPLY_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3003/example', 'example', NULL, 1),
    ('A03', 'A03 Lab 1: Version Discovery', 'Identify package versions used by the application.', 'Easy', 100, 'NSA{V3RS10NS_F0UND}', 'Headers reveal information', 'http://localhost:3003/lab1', 'lab', 1, 2),
    ('A03', 'A03 Lab 2: Find Vulnerabilities', 'Scan dependencies for known security vulnerabilities.', 'Medium', 150, 'NSA{0LD_P4CK4G3S_M34N_0LD_BUG5}', 'Use scanning tools', 'http://localhost:3003/lab2', 'lab', 2, 3),
    ('A03', 'A03 Lab 3: Exploit Dependencies', 'Exploit a vulnerable dependency to gain access.', 'Hard', 200, 'NSA{SUPPLYCHA1N_PWNED}', 'Known CVEs have PoCs', 'http://localhost:3003/lab3', 'lab', 3, 4);

-- ========================================
-- A04: CRYPTOGRAPHIC FAILURES
-- Natural Progression: Discovery → Analysis → Cracking → Extraction
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order) VALUES
    ('A04', 'A04 Example: Weak Crypto', 'Learn about cryptographic weaknesses and how to exploit them.', 'Tutorial', 50, 'NSA{CRYPTO_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3004/example', 'example', NULL, 1),
    ('A04', 'A04 Lab 1: Find Weak Hashing', 'Identify weak hashing algorithms in use.', 'Easy', 100, 'NSA{W3AK_H4SH_F0UND}', 'MD5 is not secure', 'http://localhost:3004/lab1', 'lab', 1, 2),
    ('A04', 'A04 Lab 2: Crack Weak Hash', 'Crack weakly hashed passwords using available tools.', 'Medium', 150, 'NSA{P4SSW0RD_CR4CK3D}', 'Rainbow tables help', 'http://localhost:3004/lab2', 'lab', 2, 3),
    ('A04', 'A04 Lab 3: Extract Plain Passwords', 'Find and extract plaintext credentials from the database.', 'Hard', 200, 'NSA{PL41N_T3XT_P4SSW0RDS}', 'Database has no encryption', 'http://localhost:3004/lab3', 'lab', 3, 4);

-- ========================================
-- A05: INJECTION
-- Natural Progression: Discovery → Testing → Exploitation → Extraction
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order) VALUES
    ('A05', 'A05 Example: SQL Injection Basics', 'Learn the fundamentals of SQL injection attacks.', 'Tutorial', 50, 'NSA{INJECTION_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3005/example', 'example', NULL, 1),
    ('A05', 'A05 Lab 1: Find Input Points', 'Identify parameters that interact with the database.', 'Easy', 100, 'NSA{1NPUT_P01NTS_F0UND}', 'Forms and URLs accept input', 'http://localhost:3005/lab1', 'lab', 1, 2),
    ('A05', 'A05 Lab 2: Test for SQLi', 'Test identified parameters for SQL injection vulnerabilities.', 'Medium', 150, 'NSA{SQL1_D3T3CT3D}', 'Single quotes cause errors', 'http://localhost:3005/lab2', 'lab', 2, 3),
    ('A05', 'A05 Lab 3: Exploit SQL Injection', 'Exploit SQL injection to bypass authentication or extract data.', 'Hard', 200, 'NSA{1NJ3CT_Y0UR_W4Y_1N}', 'UNION SELECT is powerful', 'http://localhost:3005/lab3', 'lab', 3, 4);

-- ========================================
-- A06: INSECURE DESIGN
-- Natural Progression: Analysis → Identification → Testing → Exploitation
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order) VALUES
    ('A06', 'A06 Example: Design Flaws', 'Learn about insecure design patterns and business logic flaws.', 'Tutorial', 50, 'NSA{DESIGN_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3006/example', 'example', NULL, 1),
    ('A06', 'A06 Lab 1: Identify Missing Controls', 'Find security controls that should exist but don''t.', 'Easy', 100, 'NSA{N0_R4T3_L1M1T}', 'No throttling exists', 'http://localhost:3006/lab1', 'lab', 1, 2),
    ('A06', 'A06 Lab 2: Logic Flaw Scan', 'Identify flaws in business logic implementation.', 'Medium', 150, 'NSA{L0G1C_FL4W_F0UND}', 'Order of operations matters', 'http://localhost:3006/lab2', 'lab', 2, 3),
    ('A06', 'A06 Lab 3: Exploit Design Flaw', 'Exploit the identified design flaw for unauthorized access.', 'Hard', 200, 'NSA{L0G1C_0V3R_S3CUR1TY}', 'Race conditions win', 'http://localhost:3006/lab3', 'lab', 3, 4);

-- ========================================
-- A07: AUTHENTICATION FAILURES
-- Natural Progression: Analysis → Testing → Prediction → Hijacking
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order) VALUES
    ('A07', 'A07 Example: Auth Mechanisms', 'Learn about authentication weaknesses and session management.', 'Tutorial', 50, 'NSA{AUTH_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3007/example', 'example', NULL, 1),
    ('A07', 'A07 Lab 1: Weak Password Policy', 'Test password requirements for weaknesses.', 'Easy', 100, 'NSA{W3AK_P4SS_P0L1CY}', 'Try simple passwords', 'http://localhost:3007/lab1', 'lab', 1, 2),
    ('A07', 'A07 Lab 2: Session Analysis', 'Analyze session token generation for predictability.', 'Medium', 150, 'NSA{S3SS10N_PR3D1CT4BL3}', 'Sessions are sequential', 'http://localhost:3007/lab2', 'lab', 2, 3),
    ('A07', 'A07 Lab 3: Session Hijacking', 'Hijack another user''s session to gain unauthorized access.', 'Hard', 200, 'NSA{S3SS10N_H1J4CK3D}', 'Predict or steal tokens', 'http://localhost:3007/lab3', 'lab', 3, 4);

-- Additional bonus lab for A07
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order) VALUES
    ('A07', 'A07 Bonus: Backdoor Account', 'Create a persistent backdoor account in the system.', 'Expert', 250, 'NSA{P3RS1ST3NC3_1S_K3Y}', 'Register with weak validation', 'http://localhost:3007/bonus', 'lab', 4, 5);

-- ========================================
-- A08: SOFTWARE AND DATA INTEGRITY FAILURES
-- Natural Progression: Discovery → Analysis → Manipulation → Exploitation
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order) VALUES
    ('A08', 'A08 Example: Integrity Checks', 'Learn about integrity verification and code signing.', 'Tutorial', 50, 'NSA{INTEGRITY_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3008/example', 'example', NULL, 1),
    ('A08', 'A08 Lab 1: Update Mechanism', 'Identify the application''s update mechanism.', 'Easy', 100, 'NSA{UPD4T3_F0UND}', 'No signatures present', 'http://localhost:3008/lab1', 'lab', 1, 2),
    ('A08', 'A08 Lab 2: Missing Checksums', 'Find operations that lack integrity verification.', 'Medium', 150, 'NSA{N0_CHK5UM_V3R1FY}', 'No validation happens', 'http://localhost:3008/lab2', 'lab', 2, 3),
    ('A08', 'A08 Lab 3: Malicious Update', 'Replace legitimate code with malicious content.', 'Hard', 200, 'NSA{N0_CHK5UM_N0_PR0BL3M}', 'Unsigned updates accepted', 'http://localhost:3008/lab3', 'lab', 3, 4);

-- ========================================
-- A09: SECURITY LOGGING FAILURES
-- Natural Progression: Discovery → Analysis → Exploitation → Evasion
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order) VALUES
    ('A09', 'A09 Example: Logging Best Practices', 'Learn what should be logged and how to exploit logging failures.', 'Tutorial', 50, 'NSA{LOGGING_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3009/example', 'example', NULL, 1),
    ('A09', 'A09 Lab 1: Missing Logs', 'Find operations that should be logged but aren''t.', 'Easy', 100, 'NSA{N0TH1NG_L0GG3D}', 'Test critical operations', 'http://localhost:3009/lab1', 'lab', 1, 2),
    ('A09', 'A09 Lab 2: Log Data Leak', 'Find sensitive data that''s being leaked in logs.', 'Medium', 150, 'NSA{L0G_D4T4_L3AK}', 'Passwords shouldn''t be logged', 'http://localhost:3009/lab2', 'lab', 2, 3),
    ('A09', 'A09 Lab 3: Cover Your Tracks', 'Exploit logging failures to hide evidence of intrusion.', 'Hard', 200, 'NSA{N0_L0GS_N0_CR1M3}', 'No audit trail exists', 'http://localhost:3009/lab3', 'lab', 3, 4);

-- ========================================
-- A10: MISHANDLING EXCEPTIONAL CONDITIONS
-- Natural Progression: Triggering → Analysis → Extraction → Exploitation
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order) VALUES
    ('A10', 'A10 Example: Error Handling', 'Learn about proper error handling and information disclosure.', 'Tutorial', 50, 'NSA{ERRORS_EXAMPLE_COMPLETE}', 'This is a guided walkthrough', 'http://localhost:3010/example', 'example', NULL, 1),
    ('A10', 'A10 Lab 1: Trigger Errors', 'Cause errors that reveal information about the system.', 'Easy', 100, 'NSA{3RR0RS_T3LL_T4L3S}', 'Invalid input reveals info', 'http://localhost:3010/lab1', 'lab', 1, 2),
    ('A10', 'A10 Lab 2: Stack Trace Recon', 'Extract detailed information from stack traces.', 'Medium', 150, 'NSA{ST4CK_TR4C3_1NF0}', 'Full paths revealed', 'http://localhost:3010/lab2', 'lab', 2, 3),
    ('A10', 'A10 Lab 3: Suppress Evidence', 'Use error handling flaws to hide exploitation activities.', 'Hard', 200, 'NSA{S1L3NCE_1S_G0LD3N}', 'Generic errors hide attacks', 'http://localhost:3010/lab3', 'lab', 3, 4);

-- ========================================
-- CITADEL (Final Exam)
-- ========================================
INSERT INTO challenges (owasp_category, title, description, difficulty, points, flag, hint, lab_url, challenge_type, lab_number, challenge_order) VALUES
    ('ALL', 'Citadel: Final Exam', 'Exploit Evil Corp''s corporate website. All vulnerabilities present, no hints.', 'Expert', 500, 'NSA{C1T4D3L_C0MPL3T3}', 'Apply everything you learned', 'http://localhost:3000', 'exam', NULL, 1);

-- Create index for faster queries
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_challenge ON user_progress(challenge_id);
CREATE INDEX idx_challenges_category ON challenges(owasp_category);
CREATE INDEX idx_challenges_order ON challenges(challenge_order);
