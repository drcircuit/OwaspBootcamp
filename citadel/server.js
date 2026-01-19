const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
const path = require('path');
const crypto = require('crypto');

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

// Helper function to get user from session
const getUserFromSession = async (req) => {
  const sessionId = req.cookies.session;
  if (!sessionId) return null;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [sessionId]);
    return result.rows[0] || null;
  } catch (err) {
    return null;
  }
};

// ============================================================================
// HOME ROUTE
// ============================================================================
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'Evil Capitalistic Corp',
    message: 'Maximizing Shareholder Value Through Aggressive Market Domination',
    user: null
  });
});

// ============================================================================
// A01: BROKEN ACCESS CONTROL - Challenge 1: User Enumeration & IDOR
// ============================================================================

// Employee directory - lists some users (but not all)
app.get('/employees', async (req, res) => {
  try {
    // Vulnerability: Only shows non-admin users, but all users are accessible via direct ID
    const result = await pool.query(
      "SELECT id, username, email, department FROM users WHERE role != 'admin' AND role != 'superadmin' ORDER BY id"
    );
    res.render('employees', { employees: result.rows });
  } catch (err) {
    res.status(500).send('Error loading employees');
  }
});

// User profile - vulnerable to IDOR
app.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    // Vulnerability: No authorization check - anyone can view any user
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.render('user', { user });
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// ============================================================================
// A01: BROKEN ACCESS CONTROL - Challenge 2: Privilege Escalation
// ============================================================================

// Admin panel - supposed to be protected
app.get('/admin', async (req, res) => {
  const sessionUser = await getUserFromSession(req);
  
  // Vulnerability: Checks if user is logged in, but uses user ID from query param for role check
  const checkUserId = req.query.user_id || (sessionUser ? sessionUser.id : null);
  
  if (!checkUserId) {
    return res.status(401).send('Please login first');
  }
  
  try {
    // Vulnerability: Role check based on potentially attacker-controlled user_id parameter
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [checkUserId]);
    const checkUser = result.rows[0];
    
    if (!checkUser || (checkUser.role !== 'admin' && checkUser.role !== 'superadmin')) {
      return res.status(403).send('Access denied. Admin privileges required.');
    }
    
    // Get all users for admin panel
    const allUsers = await pool.query('SELECT * FROM users ORDER BY id');
    const commands = await pool.query('SELECT * FROM admin_commands ORDER BY id');
    
    res.render('admin', { 
      user: checkUser, 
      allUsers: allUsers.rows,
      commands: commands.rows
    });
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// ============================================================================
// A04: CRYPTOGRAPHIC FAILURES - Challenge 1: Password in Response
// ============================================================================

// Debug endpoint - exposes password hashes
app.get('/debug/users', async (req, res) => {
  try {
    // Vulnerability: Exposes password hashes in response
    const result = await pool.query('SELECT id, username, password, role, email FROM users');
    res.json({
      message: 'Debug endpoint - User data',
      users: result.rows,
      hint: 'Notice the password field? Admin password is MD5 hash. Try cracking it!'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// A04: CRYPTOGRAPHIC FAILURES - Challenge 2: Weak Session Management
// ============================================================================

// Login endpoint
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if password is MD5 hash (for admin) or plaintext
    let query;
    if (username === 'admin') {
      // Admin uses MD5 hash
      const md5Hash = crypto.createHash('md5').update(password).digest('hex');
      query = await pool.query(
        'SELECT * FROM users WHERE username = $1 AND password = $2',
        [username, md5Hash]
      );
    } else {
      // Other users use plaintext (vulnerability!)
      query = await pool.query(
        'SELECT * FROM users WHERE username = $1 AND password = $2',
        [username, password]
      );
    }
    
    if (query.rows.length > 0) {
      // Vulnerability: Session token is just the user ID
      const user = query.rows[0];
      res.cookie('session', user.id.toString(), { httpOnly: false });
      res.redirect('/dashboard');
    } else {
      res.render('login', { error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
});

// Dashboard
app.get('/dashboard', async (req, res) => {
  const user = await getUserFromSession(req);
  if (!user) {
    return res.redirect('/login');
  }
  res.render('dashboard', { user });
});

// ============================================================================
// A05: INJECTION - Challenge 1: SQL Injection in Search
// ============================================================================

// Product search page
app.get('/search', (req, res) => {
  res.render('search', { results: null, query: '' });
});

// Search products - vulnerable to SQL injection
app.post('/search', async (req, res) => {
  const { query } = req.body;
  try {
    // Vulnerability: SQL injection through string concatenation
    const sqlQuery = `SELECT * FROM products WHERE name LIKE '%${query}%' OR description LIKE '%${query}%'`;
    const result = await pool.query(sqlQuery);
    res.render('search', { results: result.rows, query });
  } catch (err) {
    // Vulnerability: Error messages reveal SQL structure
    res.status(500).render('search', { 
      results: null, 
      query,
      error: `Database error: ${err.message}. Hint: Your SQL is invalid. Try extracting data from other tables!`
    });
  }
});

// ============================================================================
// A05: INJECTION - Challenge 2: Advanced SQL Injection with UNION
// ============================================================================

// API endpoint for product search (easier for SQL injection testing)
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json({ error: 'Query parameter required' });
  }
  
  try {
    // Vulnerability: Direct string interpolation allows UNION attacks
    const sqlQuery = `SELECT id, name, description, price FROM products WHERE name LIKE '%${q}%'`;
    const result = await pool.query(sqlQuery);
    res.json({ 
      query: q,
      results: result.rows,
      hint: 'Try UNION SELECT to extract data from other tables like sensitive_data'
    });
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      sql_hint: 'Column count must match. Products table has 4 columns in SELECT.',
      advanced_hint: 'Try: \' UNION SELECT id, data, secret_level, user_id::text FROM sensitive_data--'
    });
  }
});

// ============================================================================
// A06: INSECURE DESIGN - Challenge 1: Price Manipulation
// ============================================================================

// Checkout endpoint with price manipulation vulnerability
app.post('/api/checkout', async (req, res) => {
  const { product_id, price, quantity } = req.body;
  
  try {
    // Vulnerability: Price comes from client instead of database
    const total = price * quantity;
    
    res.json({
      message: 'Order placed successfully',
      product_id,
      price_paid: price,
      quantity,
      total,
      hint: total < 100 ? 'Nice! You manipulated the price. Flag: NSA{PR1C3_M4N1PUL4T10N}' : 'Try sending a lower price in the request body'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// A06: INSECURE DESIGN - Challenge 2: Race Condition in Withdrawals
// ============================================================================

let userBalance = { '1': 1000, '2': 500, '3': 750 };

app.get('/api/balance/:userId', (req, res) => {
  const userId = req.params.userId;
  res.json({ 
    userId,
    balance: userBalance[userId] || 0 
  });
});

app.post('/api/withdraw', async (req, res) => {
  const { userId, amount } = req.body;
  
  // Vulnerability: Check and update are not atomic
  if (userBalance[userId] >= amount) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Vulnerability: Another request could have passed the check above
    userBalance[userId] -= amount;
    
    const totalWithdrawn = 1000 - userBalance[userId];
    
    res.json({ 
      success: true,
      newBalance: userBalance[userId],
      totalWithdrawn,
      flag: totalWithdrawn > 1000 ? 'NSA{R4C3_C0ND1T10N_3XPL01T3D}' : undefined,
      hint: totalWithdrawn > 1000 ? 'You exploited the race condition!' : 'Try concurrent requests'
    });
  } else {
    res.json({ 
      success: false, 
      error: 'Insufficient funds',
      balance: userBalance[userId]
    });
  }
});

// ============================================================================
// FINAL CHALLENGE: RCE via Command Injection
// ============================================================================

// Admin command execution endpoint
app.post('/admin/execute', async (req, res) => {
  const { command_id, custom_command } = req.body;
  const sessionUser = await getUserFromSession(req);
  
  // Check if user has admin access
  if (!sessionUser || (sessionUser.role !== 'admin' && sessionUser.role !== 'superadmin')) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  try {
    let commandToExecute;
    
    if (command_id) {
      // Get command from database
      const result = await pool.query('SELECT * FROM admin_commands WHERE id = $1', [command_id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Command not found' });
      }
      commandToExecute = result.rows[0].command;
    } else if (custom_command) {
      // Vulnerability: Allows custom commands without sanitization
      commandToExecute = custom_command;
    } else {
      return res.status(400).json({ error: 'No command specified' });
    }
    
    // Vulnerability: Direct command execution without sanitization
    // In a real scenario, this would use child_process.exec()
    // For this demo, we'll simulate it
    
    if (commandToExecute.includes('cat /root/ckret.txt') || 
        commandToExecute.includes('ckret.txt')) {
      return res.json({
        output: `
╔════════════════════════════════════════════════════════════════╗
║                    🎉 CONGRATULATIONS! 🎉                     ║
║                                                                ║
║          You've Successfully Pwned Evil Capitalistic Corp!     ║
║                                                                ║
║  You've traversed the entire vulnerability chain:              ║
║  ✓ A01: Broken Access Control (IDOR + Privilege Escalation)   ║
║  ✓ A04: Cryptographic Failures (Weak Hashing + Sessions)      ║
║  ✓ A05: Injection (SQL Injection for Data Extraction)         ║
║  ✓ A06: Insecure Design (Price Manipulation + Race Condition) ║
║  ✓ RCE: Command Injection for Root Access                     ║
║                                                                ║
║  🏴 FINAL FLAG: NSA{C1T4D3L_H4S_F4LL3N_R00T_4CC3SS}           ║
║                                                                ║
║  You are now the CEO of Evil Capitalistic Corp!                ║
║  Remember: With great power comes great shareholder value.     ║
║                                                                ║
║  P.S. We hope you enjoyed exploiting our intentionally         ║
║  terrible security. Please never do this in real life! 😄      ║
║                                                                ║
║  - The OWASP Bootcamp Team                                    ║
╚════════════════════════════════════════════════════════════════╝
`,
        command: commandToExecute,
        flag: 'NSA{C1T4D3L_H4S_F4LL3N_R00T_4CC3SS}'
      });
    }
    
    // Simulate other command outputs
    const simulatedOutputs = {
      'systemctl status app': 'app.service - Evil Corp Application\n   Active: active (running)',
      'cat /var/log/app.log': 'Application logs... Nothing interesting here.',
      'ls -la /home': 'drwxr-xr-x 5 root root 4096 /home\ndrwxr-xr-x 2 admin admin 4096 /home/admin',
      'whoami': sessionUser.username
    };
    
    res.json({
      output: simulatedOutputs[commandToExecute] || 'Command executed successfully',
      command: commandToExecute,
      hint: 'Try reading /root/ckret.txt for the final flag!'
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// REGISTRATION & LOGOUT
// ============================================================================

app.get('/register', (req, res) => {
  res.render('register', { error: null, success: null });
});

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    // Vulnerability: Password stored in plain text
    await pool.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4)',
      [username, password, email, 'user']
    );
    
    res.render('register', { 
      error: null, 
      success: 'Registration successful! You can now login.' 
    });
  } catch (err) {
    res.render('register', { 
      error: 'Username already exists or invalid data', 
      success: null 
    });
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('session');
  res.redirect('/');
});

// ============================================================================
// UTILITY ENDPOINTS
// ============================================================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Evil Capitalistic Corp Citadel' });
});

// Hints endpoint
app.get('/hints', (req, res) => {
  res.render('hints');
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║         Evil Capitalistic Corp - Citadel Challenge            ║
║                                                                ║
║  Server running on port ${PORT}                                    ║
║  Access at: http://localhost:${PORT}                               ║
║                                                                ║
║  Vulnerability Chain:                                          ║
║  1. A01: User Enumeration & IDOR → Discover admin              ║
║  2. A04: Crack weak MD5 hash → Login as admin                  ║
║  3. A05: SQL Injection → Extract sensitive data                ║
║  4. A06: Price/Race Conditions → Exploit design flaws          ║
║  5. RCE: Command Injection → Root access & final flag          ║
║                                                                ║
║  Good luck, hacker! 🏴                                         ║
╚════════════════════════════════════════════════════════════════╝
  `);
});
