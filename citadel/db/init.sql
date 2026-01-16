-- Initialize database for OWASP Citadel

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    stock INTEGER DEFAULT 0
);

-- Sensitive data table
CREATE TABLE IF NOT EXISTS sensitive_data (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data with flags embedded realistically
-- A01 flag hidden in admin notes, A04 flag in plaintext passwords
INSERT INTO users (username, password, email, role, notes) VALUES
    ('admin', 'admin123', 'admin@evilcorp.com', 'admin', 'Escalation successful: NSA{R00T_4CC3SS_4CH13V3D}'),
    ('user1', 'password123', 'user1@evilcorp.com', 'user', 'Regular user account'),
    ('user2', 'pass456', 'user2@evilcorp.com', 'user', 'Regular user account'),
    ('backdoor', 'NSA{P3RS1ST3NC3_1S_K3Y}', 'backdoor@evilcorp.com', 'user', 'Persistence established');

INSERT INTO products (name, description, price, stock) VALUES
    ('Laptop', 'High-performance laptop', 999.99, 10),
    ('Mouse', 'Wireless mouse', 29.99, 50),
    ('Keyboard', 'Mechanical keyboard', 79.99, 30);

-- A05 flag in sensitive data that can be extracted via SQL injection
INSERT INTO sensitive_data (user_id, data) VALUES
    (1, 'Admin access token: NSA{1NJ3CT_Y0UR_W4Y_1N}'),
    (2, 'User1 API key: abc123def456'),
    (3, 'User2 session token: xyz789uvw012');
