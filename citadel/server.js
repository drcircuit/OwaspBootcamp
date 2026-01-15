const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'citadel',
  user: process.env.DB_USER || 'citadel_user',
  password: process.env.DB_PASSWORD || 'citadel_pass',
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'OWASP Citadel',
    message: 'Welcome to the OWASP Citadel - Break the security layers!'
  });
});

// A01: Broken Access Control - Direct object reference vulnerability
app.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    // Vulnerability: No authorization check
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      // Award flag when accessing admin account
      if (user.role === 'admin') {
        user.flag = 'NSA{R00T_4CC3SS_4CH13V3D}';
        user.exploited = 'You escalated privileges to admin!';
      }
      res.render('user', { user });
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// A02: Security Misconfiguration - Debug endpoint exposed
app.get('/debug/config', (req, res) => {
  // Vulnerability: Exposes sensitive configuration
  res.json({
    database: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    environment: process.env.NODE_ENV
  });
});

// A04: Cryptographic Failures - Storing passwords in plain text
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    // Vulnerability: Password stored in plain text
    await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)',
      [username, password, email]
    );
    // Award flag for creating a backdoor account
    const flag = 'NSA{P3RS1ST3NC3_1S_K3Y}';
    
    // Check if client prefers JSON over HTML using Express's accepts() method
    if (req.accepts(['json', 'html']) === 'json') {
      res.json({ 
        message: 'User registered successfully',
        flag,
        exploited: 'You created a persistent backdoor account!'
      });
    } else {
      // For form submissions, just redirect - flag discovery is via API call
      res.redirect('/login');
    }
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// A05: Injection - SQL Injection vulnerability
app.post('/search', async (req, res) => {
  const { query } = req.body;
  try {
    // Vulnerability: SQL injection through string concatenation
    const sqlQuery = `SELECT * FROM products WHERE name LIKE '%${query}%'`;
    const result = await pool.query(sqlQuery);
    res.render('search-results', { results: result.rows, query });
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// A07: Authentication Failures - Weak session management
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );
    if (result.rows.length > 0) {
      // Vulnerability: Session token is just the user ID
      res.cookie('session', result.rows[0].id.toString(), { httpOnly: false });
      res.redirect('/dashboard');
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// A09: Security Logging and Alerting Failures - No logging
app.post('/admin/delete-user/:id', async (req, res) => {
  const userId = req.params.id;
  // Vulnerability: No logging of critical operations
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.send('User deleted');
  } catch (err) {
    res.status(500).send('Error occurred');
  }
});

// A10: Mishandling of Exceptional Conditions - Information disclosure
app.get('/api/data/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM sensitive_data WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    // Vulnerability: Exposes full error stack trace
    res.status(500).json({ 
      error: err.message,
      stack: err.stack,
      query: err.query
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Citadel server running on port ${PORT}`);
});
