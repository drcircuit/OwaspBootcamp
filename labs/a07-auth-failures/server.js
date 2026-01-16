const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = 3007;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lab state
let lab1Users = [];
let lab2SessionCounter = 1000;
let lab2Sessions = {};
let lab3SessionCounter = 5000;
let lab3Sessions = {};
let lab3Users = {
  'alice': { password: 'alicepass123', profile: 'Alice is an admin user with elevated privileges.' },
  'bob': { password: 'bobpass456', profile: 'Bob is a regular user with standard access.' },
  'charlie': { password: 'charliepass789', profile: 'Charlie is a guest user with limited access.' }
};

const cyberpunkStyles = `
  body {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a0033 100%);
    color: #00ff9f;
    font-family: 'Courier New', monospace;
    margin: 0;
    padding: 20px;
    min-height: 100vh;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid #00ff9f;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 0 30px rgba(0, 255, 159, 0.3);
  }
  h1 {
    color: #ff0080;
    text-shadow: 0 0 10px #ff0080;
    border-bottom: 2px solid #00ff9f;
    padding-bottom: 10px;
  }
  h2 {
    color: #00d4ff;
    text-shadow: 0 0 5px #00d4ff;
  }
  h3 {
    color: #ffd700;
  }
  .section {
    background: rgba(0, 20, 40, 0.6);
    border-left: 4px solid #00ff9f;
    padding: 20px;
    margin: 20px 0;
    border-radius: 5px;
  }
  .vulnerable {
    border-left-color: #ff0080;
    background: rgba(40, 0, 20, 0.6);
  }
  .secure {
    border-left-color: #00ff9f;
    background: rgba(0, 40, 20, 0.6);
  }
  .code {
    background: #000;
    border: 1px solid #00ff9f;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
    color: #00ff9f;
    margin: 10px 0;
    font-size: 14px;
  }
  .endpoint {
    color: #ffd700;
    font-weight: bold;
  }
  .flag {
    color: #ff0080;
    font-weight: bold;
    text-shadow: 0 0 5px #ff0080;
  }
  a {
    color: #00d4ff;
    text-decoration: none;
    text-shadow: 0 0 5px #00d4ff;
  }
  a:hover {
    color: #00ff9f;
    text-shadow: 0 0 10px #00ff9f;
  }
  .nav-links {
    display: flex;
    gap: 20px;
    margin: 20px 0;
    flex-wrap: wrap;
  }
  .nav-link {
    background: rgba(0, 212, 255, 0.1);
    border: 2px solid #00d4ff;
    padding: 15px 25px;
    border-radius: 5px;
    transition: all 0.3s;
  }
  .nav-link:hover {
    background: rgba(0, 255, 159, 0.2);
    border-color: #00ff9f;
    transform: translateY(-2px);
  }
  .warning {
    color: #ff0080;
    background: rgba(255, 0, 128, 0.1);
    padding: 10px;
    border-radius: 5px;
    margin: 10px 0;
  }
  .info {
    color: #ffd700;
  }
  ul {
    line-height: 1.8;
  }
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  input, textarea {
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid #00ff9f;
    color: #00ff9f;
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
    font-family: 'Courier New', monospace;
    width: 100%;
    max-width: 400px;
  }
  input:focus, textarea:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  }
  .result {
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid #00ff9f;
    padding: 15px;
    margin: 15px 0;
    border-radius: 5px;
    min-height: 50px;
  }
  .difficulty {
    display: inline-block;
    padding: 5px 15px;
    border-radius: 5px;
    font-weight: bold;
    margin-left: 10px;
  }
  .easy {
    background: rgba(0, 255, 0, 0.2);
    border: 1px solid #00ff00;
    color: #00ff00;
  }
  .medium {
    background: rgba(255, 165, 0, 0.2);
    border: 1px solid #ffa500;
    color: #ffa500;
  }
  .hard {
    background: rgba(255, 0, 0, 0.2);
    border: 1px solid #ff0000;
    color: #ff0000;
  }
`;

// Home page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A07: Authentication Failures - Navigation</title>
      <style>${cyberpunkStyles}</style>
    </head>
    <body>
      <div class="container">
        <h1>🔑 A07: AUTHENTICATION FAILURES</h1>
        <p>Authentication failures occur when applications don't properly verify users' identities, allowing attackers to compromise passwords, keys, or session tokens.</p>
        
        <div class="nav-links">
          <a href="/example" class="nav-link">📚 Example - Educational Walkthrough</a>
          <a href="/lab1" class="nav-link">🎯 Lab 1 - Recon (Easy)</a>
          <a href="/lab2" class="nav-link">🔍 Lab 2 - Scanning (Medium)</a>
          <a href="/lab3" class="nav-link">💀 Lab 3 - Initial Access (Hard)</a>
        </div>

        <div class="section">
          <h2>What are Authentication Failures?</h2>
          <p>Authentication is the process of verifying a user's identity. Failures in this critical security function include:</p>
          <ul>
            <li><strong>Weak Password Policies:</strong> Allowing simple passwords like "123" or "password"</li>
            <li><strong>Credential Stuffing:</strong> Using stolen username/password pairs from breaches</li>
            <li><strong>Predictable Session IDs:</strong> Sequential or guessable session tokens</li>
            <li><strong>Session Fixation:</strong> Attacker forces a known session ID on a victim</li>
            <li><strong>No Multi-Factor Authentication (MFA):</strong> Single factor authentication is easier to compromise</li>
            <li><strong>Poor Session Management:</strong> Sessions that don't expire or can be hijacked</li>
          </ul>
        </div>

        <div class="section">
          <h2>Attack Stages</h2>
          <ul>
            <li><span class="info">Lab 1 (Recon):</span> Discover weak password policies by testing registration</li>
            <li><span class="info">Lab 2 (Scanning):</span> Analyze session token patterns to find predictability</li>
            <li><span class="info">Lab 3 (Initial Access):</span> Exploit session management to hijack another user's account</li>
          </ul>
        </div>

        <div class="section vulnerable">
          <h2>⚠️ Real-World Impact</h2>
          <p>Authentication failures have led to massive breaches:</p>
          <ul>
            <li><strong>LinkedIn (2012):</strong> 165M passwords stolen due to weak hashing</li>
            <li><strong>Yahoo (2013):</strong> 3B accounts compromised through auth bypass</li>
            <li><strong>Equifax (2017):</strong> 147M records exposed, partially due to default credentials</li>
            <li><strong>SolarWinds (2020):</strong> Supply chain attack using weak password "solarwinds123"</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Example page
app.get('/example', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A07: Authentication Failures - Example</title>
      <style>${cyberpunkStyles}</style>
    </head>
    <body>
      <div class="container">
        <h1>📚 AUTHENTICATION FAILURES - EDUCATIONAL EXAMPLE</h1>
        <p><a href="/">← Back to Navigation</a></p>

        <div class="section">
          <h2>Understanding Authentication Failures</h2>
          <p>Authentication and session management are critical for application security. When implemented incorrectly, they become prime targets for attackers.</p>
        </div>

        <div class="section vulnerable">
          <h2>❌ Vulnerability 1: Weak Password Policies</h2>
          <p>Many applications accept passwords that are trivial to guess or brute force.</p>
          
          <h3>Vulnerable Code:</h3>
          <div class="code"><pre>// BAD: No password strength requirements
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  
  // Accepts ANY password - even "123" or "a"
  if (password.length > 0) {
    users.push({ username, password });
    return res.json({ success: true });
  }
});</pre></div>

          <h3>Why It's Dangerous:</h3>
          <ul>
            <li>Passwords like "123", "password", or "abc" can be cracked instantly</li>
            <li>Attackers use dictionaries of common passwords</li>
            <li>Credential stuffing attacks use leaked passwords from other breaches</li>
          </ul>
        </div>

        <div class="section secure">
          <h2>✅ Secure Implementation: Strong Password Policy</h2>
          <div class="code"><pre>// GOOD: Enforce strong password requirements
const validatePassword = (password) => {
  if (password.length < 12) return { valid: false, reason: 'Too short' };
  if (!/[A-Z]/.test(password)) return { valid: false, reason: 'No uppercase' };
  if (!/[a-z]/.test(password)) return { valid: false, reason: 'No lowercase' };
  if (!/[0-9]/.test(password)) return { valid: false, reason: 'No numbers' };
  if (!/[!@#$%^&*]/.test(password)) return { valid: false, reason: 'No special chars' };
  
  // Check against common password list
  if (commonPasswords.includes(password)) {
    return { valid: false, reason: 'Too common' };
  }
  
  return { valid: true };
};

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  const validation = validatePassword(password);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.reason });
  }
  
  // Hash password with strong algorithm (bcrypt, argon2)
  const hashedPassword = await bcrypt.hash(password, 12);
  users.push({ username, password: hashedPassword });
  
  res.json({ success: true });
});</pre></div>
        </div>

        <div class="section vulnerable">
          <h2>❌ Vulnerability 2: Predictable Session IDs</h2>
          <p>Sequential or easily guessable session identifiers allow attackers to hijack other users' sessions.</p>
          
          <h3>Vulnerable Code:</h3>
          <div class="code"><pre>// BAD: Predictable sequential session IDs
let sessionCounter = 1000;

app.post('/login', (req, res) => {
  const sessionId = sessionCounter++;  // 1000, 1001, 1002...
  sessions[sessionId] = { username: req.body.username };
  
  res.json({ 
    success: true, 
    sessionId: sessionId  // Exposed to client!
  });
});</pre></div>

          <h3>Why It's Dangerous:</h3>
          <ul>
            <li>Attacker can guess other users' session IDs (1001, 1002, 1003...)</li>
            <li>Session IDs exposed in responses can be incremented/decremented</li>
            <li>No entropy - deterministic pattern is trivial to predict</li>
          </ul>
        </div>

        <div class="section secure">
          <h2>✅ Secure Implementation: Cryptographically Random Sessions</h2>
          <div class="code"><pre>// GOOD: Use cryptographically secure random tokens
const crypto = require('crypto');

app.post('/login', (req, res) => {
  // Generate 32 bytes of random data = 256 bits of entropy
  const sessionToken = crypto.randomBytes(32).toString('hex');
  
  sessions[sessionToken] = {
    username: req.body.username,
    createdAt: Date.now(),
    expiresAt: Date.now() + (30 * 60 * 1000)  // 30 minutes
  };
  
  // Set as HttpOnly, Secure, SameSite cookie
  res.cookie('session', sessionToken, {
    httpOnly: true,   // Prevent JavaScript access
    secure: true,     // HTTPS only
    sameSite: 'strict',  // CSRF protection
    maxAge: 30 * 60 * 1000
  });
  
  res.json({ success: true });
  // Note: sessionToken NOT exposed in response
});</pre></div>
        </div>

        <div class="section vulnerable">
          <h2>❌ Vulnerability 3: Session Fixation</h2>
          <p>Attacker tricks user into authenticating with a session ID controlled by the attacker.</p>
          
          <h3>Vulnerable Code:</h3>
          <div class="code"><pre>// BAD: Reuses session ID after authentication
app.post('/login', (req, res) => {
  const sessionId = req.cookies.session || generateSession();
  
  // Authenticates but keeps same session ID!
  sessions[sessionId] = { 
    username: req.body.username,
    authenticated: true 
  };
  
  res.cookie('session', sessionId);
  res.json({ success: true });
});</pre></div>

          <h3>Attack Scenario:</h3>
          <div class="code"><pre>1. Attacker creates session: abc123
2. Attacker sends victim link: example.com?session=abc123
3. Victim logs in with that session
4. Attacker now has authenticated session abc123</pre></div>
        </div>

        <div class="section secure">
          <h2>✅ Secure Implementation: Regenerate Session on Login</h2>
          <div class="code"><pre>// GOOD: Always generate NEW session after authentication
app.post('/login', (req, res) => {
  const oldSessionId = req.cookies.session;
  
  // Verify credentials first
  const user = authenticateUser(req.body.username, req.body.password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Delete old session (if exists)
  if (oldSessionId) {
    delete sessions[oldSessionId];
  }
  
  // Create NEW session after successful authentication
  const newSessionId = crypto.randomBytes(32).toString('hex');
  sessions[newSessionId] = {
    username: user.username,
    authenticatedAt: Date.now()
  };
  
  res.cookie('session', newSessionId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  
  res.json({ success: true });
});</pre></div>
        </div>

        <div class="section vulnerable">
          <h2>❌ Vulnerability 4: No Multi-Factor Authentication (MFA)</h2>
          <p>Single-factor authentication (password only) is vulnerable to:</p>
          <ul>
            <li>Phishing attacks</li>
            <li>Password database breaches</li>
            <li>Keyloggers and malware</li>
            <li>Social engineering</li>
          </ul>
        </div>

        <div class="section secure">
          <h2>✅ Secure Implementation: Multi-Factor Authentication</h2>
          <div class="code"><pre>// GOOD: Require second factor (TOTP, SMS, hardware key)
app.post('/login', async (req, res) => {
  const { username, password, totpCode } = req.body;
  
  // First factor: password
  const user = await verifyPassword(username, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Second factor: Time-based One-Time Password
  const validTOTP = speakeasy.totp.verify({
    secret: user.totpSecret,
    encoding: 'base32',
    token: totpCode,
    window: 2  // Allow 60 second time drift
  });
  
  if (!validTOTP) {
    return res.status(401).json({ error: 'Invalid 2FA code' });
  }
  
  // Both factors verified - create session
  const sessionId = crypto.randomBytes(32).toString('hex');
  sessions[sessionId] = { username: user.username };
  
  res.cookie('session', sessionId, { httpOnly: true, secure: true });
  res.json({ success: true });
});</pre></div>
        </div>

        <div class="section">
          <h2>🎯 Prevention Best Practices</h2>
          <ul>
            <li><strong>Password Policies:</strong> Minimum 12 characters, complexity requirements, check against breach databases</li>
            <li><strong>Strong Session Management:</strong> Cryptographically random tokens, regenerate on login, implement expiration</li>
            <li><strong>Multi-Factor Authentication:</strong> Require 2FA for sensitive operations</li>
            <li><strong>Account Lockout:</strong> Temporarily lock accounts after failed login attempts</li>
            <li><strong>Rate Limiting:</strong> Prevent brute force attacks on login endpoints</li>
            <li><strong>Secure Storage:</strong> Hash passwords with bcrypt/argon2, never store plaintext</li>
            <li><strong>Session Security:</strong> HttpOnly, Secure, SameSite cookies</li>
            <li><strong>Monitoring:</strong> Log and alert on suspicious authentication patterns</li>
          </ul>
        </div>

        <div class="section">
          <h2>📖 Ready to Practice?</h2>
          <p>Now that you understand authentication failures, try the labs:</p>
          <div class="nav-links">
            <a href="/lab1" class="nav-link">Lab 1 - Weak Password Policy</a>
            <a href="/lab2" class="nav-link">Lab 2 - Predictable Sessions</a>
            <a href="/lab3" class="nav-link">Lab 3 - Session Hijacking</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 1: Weak Password Policy
app.get('/lab1', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A07: Lab 1 - Weak Password Policy</title>
      <style>${cyberpunkStyles}</style>
    </head>
    <body>
      <div class="container">
        <h1>🎯 LAB 1: WEAK PASSWORD POLICY<span class="difficulty easy">EASY</span></h1>
        <p><a href="/">← Back to Navigation</a></p>

        <div class="section">
          <h2>Stage: Reconnaissance</h2>
          <p>Your mission: Test the password requirements during registration to identify weak password policies.</p>
        </div>

        <div class="section vulnerable">
          <h2>Scenario</h2>
          <p>You've discovered a user registration endpoint. The application claims to have "secure authentication," but you suspect the password policy might be weak.</p>
          <p>Test if the system accepts weak passwords that don't meet basic security standards.</p>
        </div>

        <div class="section">
          <h2>Target Endpoint</h2>
          <p class="endpoint">POST /api/lab1/register</p>
          <p><strong>Request Body:</strong></p>
          <div class="code"><pre>{
  "username": "testuser",
  "password": "your_password_here"
}</pre></div>

          <h3>Your Task:</h3>
          <ul>
            <li>Try registering with various weak passwords</li>
            <li>Test passwords like: "123", "abc", "password", etc.</li>
            <li>Find a password that's accepted despite being extremely weak</li>
            <li>The flag will be revealed when you successfully register with a weak password</li>
          </ul>
        </div>

        <div class="section">
          <h2>Test Registration</h2>
          <form id="registerForm">
            <label>Username:</label><br>
            <input type="text" id="username" value="testuser" required><br><br>
            
            <label>Password:</label><br>
            <input type="text" id="password" placeholder="Try weak passwords..." required><br><br>
            
            <div id="result" class="result"></div>
          </form>
        </div>

        <div class="section">
          <h2>💡 Hints</h2>
          <ul>
            <li>What's one of the weakest possible passwords you can think of?</li>
            <li>Try numeric-only passwords with minimal length</li>
            <li>Does the system enforce minimum length, complexity, or common password checks?</li>
          </ul>
        </div>
      </div>

      <script>
        const form = document.getElementById('registerForm');
        const resultDiv = document.getElementById('result');

        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;

          try {
            const response = await fetch('/api/lab1/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            
            if (response.ok) {
              resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
              if (data.flag) {
                resultDiv.innerHTML += '<p class="flag">🚩 FLAG CAPTURED: ' + data.flag + '</p>';
              }
            } else {
              resultDiv.innerHTML = '<p style="color: #ff0080;">Error: ' + (data.error || 'Registration failed') + '</p>';
            }
          } catch (error) {
            resultDiv.innerHTML = '<p style="color: #ff0080;">Request failed: ' + error.message + '</p>';
          }
        });

        // Auto-submit on input for testing
        document.getElementById('password').addEventListener('input', () => {
          if (document.getElementById('password').value.length > 0) {
            form.dispatchEvent(new Event('submit'));
          }
        });
      </script>
    </body>
    </html>
  `);
});

app.post('/api/lab1/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  // VULNERABLE: Accepts extremely weak passwords
  if (password.length > 0) {
    const user = { username, password, registered: new Date().toISOString() };
    lab1Users.push(user);

    // Flag revealed when weak password is accepted
    if (password.length < 6 || /^[0-9]+$/.test(password) || password === 'password' || password === 'abc') {
      return res.json({
        success: true,
        message: 'Registration successful',
        username: username,
        flag: 'NSA{W3AK_P4SS_P0L1CY}',
        vulnerability: 'No password strength requirements',
        explanation: 'This system accepts passwords like "123" which can be cracked instantly. Strong password policies should require minimum length (12+ chars), complexity (uppercase, lowercase, numbers, symbols), and check against common password lists.'
      });
    }

    return res.json({
      success: true,
      message: 'Registration successful',
      username: username,
      hint: 'Try an even weaker password to find the vulnerability'
    });
  }

  return res.status(400).json({ error: 'Password cannot be empty' });
});

// Lab 2: Predictable Session Tokens
app.get('/lab2', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A07: Lab 2 - Predictable Session Tokens</title>
      <style>${cyberpunkStyles}</style>
    </head>
    <body>
      <div class="container">
        <h1>🔍 LAB 2: PREDICTABLE SESSION TOKENS<span class="difficulty medium">MEDIUM</span></h1>
        <p><a href="/">← Back to Navigation</a></p>

        <div class="section">
          <h2>Stage: Scanning</h2>
          <p>Your mission: Analyze session tokens returned by the login endpoint to identify predictable patterns.</p>
        </div>

        <div class="section vulnerable">
          <h2>Scenario</h2>
          <p>You've found a login endpoint that returns session IDs. Your task is to analyze multiple session tokens to determine if they follow a predictable pattern.</p>
          <p>If session IDs are sequential or predictable, an attacker could guess valid session tokens and hijack other users' sessions.</p>
        </div>

        <div class="section">
          <h2>Target Endpoint</h2>
          <p class="endpoint">POST /api/lab2/login</p>
          <p><strong>Request Body:</strong></p>
          <div class="code"><pre>{
  "username": "any_username"
}</pre></div>

          <h3>Your Task:</h3>
          <ul>
            <li>Log in multiple times with different usernames</li>
            <li>Observe the session IDs returned in each response</li>
            <li>Analyze the pattern - are they sequential? Random? Predictable?</li>
            <li>Document your findings to reveal the flag</li>
          </ul>
        </div>

        <div class="section">
          <h2>Test Login</h2>
          <form id="loginForm">
            <label>Username:</label><br>
            <input type="text" id="username" placeholder="Enter any username" required><br><br>
            
            <div id="result" class="result"></div>
          </form>
          
          <div class="section">
            <h3>Session Analysis</h3>
            <p>Collected session IDs:</p>
            <div id="sessions" class="code"><pre id="sessionList">None yet - try logging in multiple times...</pre></div>
            <p id="pattern" style="margin-top: 10px;"></p>
          </div>
        </div>

        <div class="section">
          <h2>💡 Hints</h2>
          <ul>
            <li>Try logging in at least 3-5 times with different usernames</li>
            <li>Compare the session IDs - do you see a mathematical relationship?</li>
            <li>Are they incrementing? By how much?</li>
            <li>Could you predict the next session ID?</li>
          </ul>
        </div>
      </div>

      <script>
        const form = document.getElementById('loginForm');
        const resultDiv = document.getElementById('result');
        const sessionListPre = document.getElementById('sessionList');
        const patternP = document.getElementById('pattern');
        let collectedSessions = [];

        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const username = document.getElementById('username').value;

          try {
            const response = await fetch('/api/lab2/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username })
            });

            const data = await response.json();
            
            if (response.ok) {
              resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
              
              if (data.sessionId) {
                collectedSessions.push({ username, sessionId: data.sessionId });
                updateSessionAnalysis();
              }

              if (data.flag) {
                resultDiv.innerHTML += '<p class="flag">🚩 FLAG CAPTURED: ' + data.flag + '</p>';
              }
            } else {
              resultDiv.innerHTML = '<p style="color: #ff0080;">Error: ' + (data.error || 'Login failed') + '</p>';
            }
          } catch (error) {
            resultDiv.innerHTML = '<p style="color: #ff0080;">Request failed: ' + error.message + '</p>';
          }

          // Clear username for next test
          document.getElementById('username').value = '';
        });

        function updateSessionAnalysis() {
          let output = '';
          collectedSessions.forEach((s, i) => {
            output += (i + 1) + '. User: ' + s.username + ' → Session ID: ' + s.sessionId + '\\n';
          });
          sessionListPre.textContent = output;

          if (collectedSessions.length >= 3) {
            const ids = collectedSessions.map(s => s.sessionId);
            const differences = [];
            for (let i = 1; i < ids.length; i++) {
              differences.push(ids[i] - ids[i-1]);
            }
            
            const allSame = differences.every(d => d === differences[0]);
            if (allSame && differences[0] === 1) {
              patternP.innerHTML = '<span class="flag">⚠️ PATTERN DETECTED: Sequential session IDs incrementing by 1!</span><br>This is highly predictable and vulnerable to session hijacking.';
            } else if (allSame) {
              patternP.innerHTML = '<span class="flag">⚠️ PATTERN DETECTED: Session IDs increment by ' + differences[0] + '</span><br>Predictable pattern detected!';
            }
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.post('/api/lab2/login', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }

  // VULNERABLE: Sequential, predictable session IDs
  const sessionId = lab2SessionCounter++;
  lab2Sessions[sessionId] = {
    username: username,
    createdAt: Date.now()
  };

  // Flag revealed after analyzing the pattern
  if (lab2SessionCounter > 1003) {
    return res.json({
      success: true,
      sessionId: sessionId,
      username: username,
      flag: 'NSA{S3SS10N_PR3D1CT4BL3}',
      vulnerability: 'Sequential session IDs',
      explanation: 'Session IDs increment predictably (1000, 1001, 1002...). An attacker can enumerate valid sessions by trying sequential IDs. Secure implementations use cryptographically random tokens with high entropy (e.g., 256-bit random values).',
      previousSessions: [lab2SessionCounter - 4, lab2SessionCounter - 3, lab2SessionCounter - 2, lab2SessionCounter - 1],
      nextSession: lab2SessionCounter
    });
  }

  return res.json({
    success: true,
    sessionId: sessionId,
    username: username,
    message: 'Login successful',
    hint: 'Try logging in a few more times and analyze the session IDs...'
  });
});

// Lab 3: Session Hijacking
app.get('/lab3', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A07: Lab 3 - Session Hijacking</title>
      <style>${cyberpunkStyles}</style>
    </head>
    <body>
      <div class="container">
        <h1>💀 LAB 3: SESSION HIJACKING<span class="difficulty hard">HARD</span></h1>
        <p><a href="/">← Back to Navigation</a></p>

        <div class="section">
          <h2>Stage: Initial Access</h2>
          <p>Your mission: Exploit predictable session management to access another user's profile without knowing their credentials.</p>
        </div>

        <div class="section vulnerable">
          <h2>Scenario</h2>
          <p>The system has three users with active sessions:</p>
          <ul>
            <li><strong>alice</strong> - Admin user (high-value target)</li>
            <li><strong>bob</strong> - Regular user</li>
            <li><strong>charlie</strong> - Guest user</li>
          </ul>
          <p>Session IDs are assigned sequentially starting from 5000. Your task is to hijack another user's session and access their profile.</p>
        </div>

        <div class="section">
          <h2>Available Endpoints</h2>
          
          <h3>1. Login (Get Your Own Session)</h3>
          <p class="endpoint">POST /api/lab3/login</p>
          <div class="code"><pre>{
  "username": "your_username",
  "password": "your_password"
}</pre></div>

          <h3>2. View Profile (Requires Session Cookie)</h3>
          <p class="endpoint">GET /api/lab3/profile</p>
          <p>Requires: <code>session</code> cookie</p>
          <p>Returns the profile of the user associated with the session cookie.</p>
        </div>

        <div class="section">
          <h2>Your Task:</h2>
          <ul>
            <li>First, log in with your own credentials to get a session ID</li>
            <li>Analyze the session ID pattern</li>
            <li>Predict or enumerate other users' session IDs</li>
            <li>Access another user's profile by manipulating the session cookie</li>
            <li>Flag is revealed when you successfully hijack a session</li>
          </ul>
        </div>

        <div class="section">
          <h2>Interactive Testing</h2>
          
          <h3>Step 1: Login</h3>
          <form id="loginForm">
            <label>Username:</label><br>
            <input type="text" id="loginUsername" placeholder="Enter username" required><br><br>
            <label>Password:</label><br>
            <input type="password" id="loginPassword" placeholder="Enter password" required><br><br>
            <div id="loginResult" class="result"></div>
          </form>

          <h3>Step 2: Manual Session Testing</h3>
          <p>Try accessing profiles with different session IDs:</p>
          <form id="profileForm">
            <label>Session ID to test:</label><br>
            <input type="number" id="sessionId" placeholder="e.g., 5000" required><br><br>
            <div id="profileResult" class="result"></div>
          </form>
        </div>

        <div class="section">
          <h2>💡 Hints</h2>
          <ul>
            <li>You don't need valid credentials - any username/password will give you a session</li>
            <li>Sessions start at 5000 and increment sequentially</li>
            <li>There are already some active sessions in the system</li>
            <li>Try session IDs around 5000-5010</li>
            <li>Use browser DevTools to see/modify cookies, or test session IDs directly</li>
          </ul>
        </div>

        <div class="section warning">
          <h2>⚠️ Advanced Challenge</h2>
          <p>For a real exploit, use <code>curl</code> or browser DevTools to manually set the session cookie:</p>
          <div class="code"><pre>curl http://localhost:3007/api/lab3/profile \\
  -H "Cookie: session=5001"</pre></div>
        </div>
      </div>

      <script>
        const loginForm = document.getElementById('loginForm');
        const loginResult = document.getElementById('loginResult');
        const profileForm = document.getElementById('profileForm');
        const profileResult = document.getElementById('profileResult');

        loginForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const username = document.getElementById('loginUsername').value;
          const password = document.getElementById('loginPassword').value;

          try {
            const response = await fetch('/api/lab3/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            loginResult.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            
            if (data.sessionId) {
              loginResult.innerHTML += '<p style="color: #ffd700;">Your session ID: ' + data.sessionId + '</p>';
              loginResult.innerHTML += '<p>Now try accessing profiles with different session IDs below...</p>';
            }
          } catch (error) {
            loginResult.innerHTML = '<p style="color: #ff0080;">Request failed: ' + error.message + '</p>';
          }
        });

        profileForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          
          const sessionId = document.getElementById('sessionId').value;

          try {
            const response = await fetch('/api/lab3/profile', {
              method: 'GET',
              headers: {
                'Cookie': 'session=' + sessionId
              }
            });

            const data = await response.json();
            profileResult.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            
            if (data.flag) {
              profileResult.innerHTML += '<p class="flag">🚩 FLAG CAPTURED: ' + data.flag + '</p>';
            }
          } catch (error) {
            profileResult.innerHTML = '<p style="color: #ff0080;">Request failed: ' + error.message + '</p>';
          }
        });
      </script>
    </body>
    </html>
  `);
});

app.post('/api/lab3/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  // VULNERABLE: Sequential session IDs
  const sessionId = lab3SessionCounter++;
  lab3Sessions[sessionId] = {
    username: username,
    createdAt: Date.now()
  };

  res.cookie('session', sessionId, { httpOnly: false });
  
  res.json({
    success: true,
    sessionId: sessionId,
    username: username,
    message: 'Login successful',
    hint: 'Your session ID is sequential. What about other users?'
  });
});

app.get('/api/lab3/profile', (req, res) => {
  const sessionId = req.headers.cookie?.split('session=')[1]?.split(';')[0];

  if (!sessionId) {
    return res.status(401).json({ error: 'No session cookie provided' });
  }

  const session = lab3Sessions[sessionId];
  
  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }

  const username = session.username;
  
  // Check if hijacking a pre-seeded user
  if (username === 'alice' || username === 'bob' || username === 'charlie') {
    const userProfile = lab3Users[username];
    
    return res.json({
      success: true,
      username: username,
      profile: userProfile.profile,
      sessionId: sessionId,
      flag: 'NSA{S3SS10N_H1J4CK3D}',
      vulnerability: 'Session hijacking via predictable session IDs',
      explanation: 'You successfully accessed another user\'s profile by guessing their sequential session ID. In a secure system, session tokens should be cryptographically random (256-bit entropy), stored as HttpOnly cookies, and regenerated on login to prevent fixation and hijacking attacks.'
    });
  }

  // Regular user (not pre-seeded)
  return res.json({
    success: true,
    username: username,
    profile: 'This is your profile.',
    sessionId: sessionId,
    hint: 'Try session IDs around 5001-5003 to find pre-existing user sessions (alice, bob, charlie)'
  });
});

// Pre-seed some sessions for lab3
lab3Sessions[5001] = { username: 'alice', createdAt: Date.now() };
lab3Sessions[5002] = { username: 'bob', createdAt: Date.now() };
lab3Sessions[5003] = { username: 'charlie', createdAt: Date.now() };

app.listen(PORT, '0.0.0.0', () => {
  console.log(`A07: Authentication Failures Lab running on port ${PORT}`);
  console.log(`Navigate to http://localhost:${PORT} to begin`);
});
