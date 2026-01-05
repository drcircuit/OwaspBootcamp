-- Initialize database for OWASP Citadel

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
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

-- Insert sample data
INSERT INTO users (username, password, email, role) VALUES
    ('admin', 'admin123', 'admin@citadel.local', 'admin'),
    ('user1', 'password123', 'user1@citadel.local', 'user'),
    ('user2', 'pass456', 'user2@citadel.local', 'user');

INSERT INTO products (name, description, price, stock) VALUES
    ('Laptop', 'High-performance laptop', 999.99, 10),
    ('Mouse', 'Wireless mouse', 29.99, 50),
    ('Keyboard', 'Mechanical keyboard', 79.99, 30);

INSERT INTO sensitive_data (user_id, data) VALUES
    (1, 'Admin secret key: ABC123XYZ'),
    (2, 'User1 SSN: 123-45-6789'),
    (3, 'User2 Credit Card: 4111-1111-1111-1111');
