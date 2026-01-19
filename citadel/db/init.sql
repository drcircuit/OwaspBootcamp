-- Initialize database for OWASP Citadel

-- Users table with comprehensive fields
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    notes TEXT,
    salary DECIMAL(10, 2),
    ssn VARCHAR(20),
    department VARCHAR(50),
    api_key VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    stock INTEGER DEFAULT 0,
    category VARCHAR(50)
);

-- Sensitive data table
CREATE TABLE IF NOT EXISTS sensitive_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    data TEXT,
    secret_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin commands table (for RCE challenge)
CREATE TABLE IF NOT EXISTS admin_commands (
    id SERIAL PRIMARY KEY,
    command TEXT NOT NULL,
    description TEXT,
    requires_root BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table (for A06 - Insecure Design)
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10, 2),
    transaction_type VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users with vulnerabilities
-- A01: IDOR vulnerability through user enumeration
-- A04: Weak password hashing (plaintext for demo)
INSERT INTO users (username, password, email, role, notes, salary, ssn, department, api_key) VALUES
    ('john.doe', 'Welcome123!', 'john.doe@evilcorp.com', 'user', 'Sales team member', 45000.00, '123-45-6789', 'Sales', 'USR_4f3d2a1b'),
    ('jane.smith', 'Password2024', 'jane.smith@evilcorp.com', 'user', 'Marketing specialist', 52000.00, '234-56-7890', 'Marketing', 'USR_8e7c6b5a'),
    ('mike.wilson', 'Summer2024!', 'mike.wilson@evilcorp.com', 'manager', 'Department manager with elevated access', 78000.00, '345-67-8901', 'Operations', 'MGR_1a2b3c4d'),
    ('admin', '5f4dcc3b5aa765d61d8327deb882cf99', 'admin@evilcorp.com', 'admin', 'System administrator - Full access granted. Flag: NSA{BR0K3N_4CC3SS_PWN3D}', 150000.00, '000-00-0000', 'IT Security', 'ADM_x9y8z7w6'),
    ('root', 'toor', 'root@evilcorp.com', 'superadmin', 'Root access account. SSH enabled. Server: citadel-app', 200000.00, '111-11-1111', 'Infrastructure', 'ROOT_v5u4t3s2');

-- Insert products with varied categories
INSERT INTO products (name, description, price, stock, category) VALUES
    ('Enterprise License Pro', 'Overpriced software license that does nothing special', 9999.99, 100, 'Software'),
    ('Consultation Package', 'Pay us to tell you what you already know', 5000.00, 50, 'Services'),
    ('Blockchain Solution', 'We put blockchain in the name to charge more', 15000.00, 20, 'Technology'),
    ('AI-Powered Widget', 'Regular widget with AI buzzword added', 7500.00, 30, 'Technology'),
    ('Cloud Migration Tool', 'Fancy name for basic file transfer', 12000.00, 15, 'Software'),
    ('Synergy Maximizer', 'Completely meaningless product for executives', 25000.00, 10, 'Executive Solutions');

-- Insert sensitive data with flags embedded
INSERT INTO sensitive_data (user_id, data, secret_level) VALUES
    (1, 'User API access token', 'low'),
    (2, 'Marketing campaign credentials', 'low'),
    (3, 'Manager dashboard access', 'medium'),
    (4, 'Admin panel password hash: 5f4dcc3b5aa765d61d8327deb882cf99. Flag: NSA{CR4CK3D_TH3_H4SH}', 'high'),
    (5, 'Root SSH private key location: /root/.ssh/id_rsa', 'critical');

-- Insert admin commands (for final RCE challenge)
INSERT INTO admin_commands (command, description, requires_root) VALUES
    ('systemctl status app', 'Check application status', false),
    ('cat /var/log/app.log', 'View application logs', false),
    ('ls -la /home', 'List home directories', false),
    ('cat /root/ckret.txt', 'View root secret file', true),
    ('whoami', 'Check current user', false);

-- Insert transaction data for A06 challenge
INSERT INTO transactions (user_id, amount, transaction_type, status) VALUES
    (1, 100.00, 'withdrawal', 'completed'),
    (2, 250.00, 'deposit', 'completed'),
    (3, 500.00, 'withdrawal', 'pending'),
    (4, 1000.00, 'deposit', 'completed');
