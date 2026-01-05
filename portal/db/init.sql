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

-- RECON STAGE (mostly passive information gathering)
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url) VALUES
    (1, 'A02', 'Debug Endpoint Discovery', 'Evil Capitalistic Corp left their debug endpoints exposed. Find them to gather intel about their infrastructure.', 'Easy', 100, 'NSA{DEBUG_1S_N0T_4_F3ATUR3}', 'Try /debug or /config endpoints', 'http://localhost:3002'),
    (1, 'A09', 'Log File Analysis', 'ECC''s logging is terrible. Can you find what information is being leaked in their logs?', 'Easy', 100, 'NSA{L0GG1NG_F41LURE_1S_RE4L}', 'Check what gets logged (or doesn''t)', 'http://localhost:3009'),
    (1, 'A10', 'Error Message Recon', 'Trigger errors to learn about ECC''s internal systems. Stack traces are your friend.', 'Easy', 100, 'NSA{3RR0RS_T3LL_T4L3S}', 'Try accessing invalid resources', 'http://localhost:3010');

-- SCANNING STAGE (active probing and vulnerability identification)
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url) VALUES
    (2, 'A03', 'Dependency Scanner', 'Use tools to scan ECC''s software supply chain. They''re using vulnerable packages!', 'Medium', 150, 'NSA{0LD_P4CK4G3S_M34N_0LD_BUG5}', 'npm audit or similar tools reveal all', 'http://localhost:3003'),
    (2, 'A01', 'Access Control Enumeration', 'Enumerate user IDs and find what you shouldn''t access. ECC has poor access controls.', 'Medium', 150, 'NSA{1D0R_V1A_1NC3PT10N}', 'Try changing user IDs in URLs', 'http://localhost:3001'),
    (2, 'A06', 'Business Logic Flaws', 'Scan ECC''s business logic for design flaws. Can you bypass their rate limiting?', 'Medium', 150, 'NSA{L0G1C_0V3R_S3CUR1TY}', 'Look for race conditions or missing checks', 'http://localhost:3006');

-- INITIAL ACCESS STAGE (exploitation and gaining foothold)
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url) VALUES
    (3, 'A05', 'SQL Injection Entry Point', 'Exploit SQL injection to gain initial access to ECC''s database. Classic but effective!', 'Hard', 200, 'NSA{1NJ3CT_Y0UR_W4Y_1N}', 'Search forms are often vulnerable', 'http://localhost:3005'),
    (3, 'A07', 'Weak Authentication Bypass', 'Bypass ECC''s authentication. Their session management is laughable.', 'Hard', 200, 'NSA{S3SS10N_H1J4CK3D}', 'Predict or steal session tokens', 'http://localhost:3007'),
    (3, 'A04', 'Crypto Failure Exploitation', 'ECC stores passwords in plain text! Extract credentials from the database.', 'Hard', 200, 'NSA{PL41N_T3XT_P4SSW0RDS}', 'Once you have DB access, check password storage', 'http://localhost:3004'),
    (3, 'A08', 'Integrity Bypass', 'Exploit integrity failures to execute malicious code. ECC doesn''t verify their updates!', 'Hard', 200, 'NSA{N0_CHK5UM_N0_PR0BL3M}', 'Unsigned code can be replaced', 'http://localhost:3008');

-- MAINTAINED ACCESS STAGE (optional - persistence)
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url) VALUES
    (4, 'A01', 'Privilege Escalation', 'Escalate from user to admin by exploiting broken access controls.', 'Expert', 300, 'NSA{R00T_4CC3SS_4CH13V3D}', 'Admin functionality without admin checks', 'http://localhost:3000'),
    (4, 'A07', 'Create Backdoor Account', 'Create a persistent backdoor account in ECC''s system.', 'Expert', 300, 'NSA{P3RS1ST3NC3_1S_K3Y}', 'Weak password requirements help', 'http://localhost:3000');

-- COVER TRACKS STAGE (optional - cleanup)
INSERT INTO challenges (stage_id, owasp_category, title, description, difficulty, points, flag, hint, lab_url) VALUES
    (5, 'A09', 'Log Manipulation', 'Exploit logging failures to hide your tracks. If it''s not logged, did it happen?', 'Expert', 300, 'NSA{N0_L0GS_N0_CR1M3}', 'Missing audit logs mean no evidence', 'http://localhost:3009'),
    (5, 'A10', 'Error Suppression', 'Suppress error messages that might expose your activities.', 'Expert', 300, 'NSA{S1L3NCE_1S_G0LD3N}', 'Generic errors hide exploitation', 'http://localhost:3010');

-- Create index for faster queries
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_challenge ON user_progress(challenge_id);
CREATE INDEX idx_challenges_stage ON challenges(stage_id);
