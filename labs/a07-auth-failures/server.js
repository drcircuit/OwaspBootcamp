const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

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

const pawspaStyles = `
  body {
    background: linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 50%, #C7D2FE 100%);
    color: #1E40AF;
    font-family: 'Courier New', monospace;
    margin: 0;
    padding: 20px;
    min-height: 100vh;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    background: #FFFFFF;
    border: 2px solid #60A5FA;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 0 30px rgba(0, 255, 159, 0.3);
  }
  h1 {
    color: #2563EB;
    text-shadow: 0 0 10px #3B82F6;
    border-bottom: 2px solid #10B981;
    padding-bottom: 10px;
  }
  h2 {
    color: #4F46E5;
    text-shadow: 0 0 5px #6366F1;
  }
  h3 {
    color: #7C3AED;
  }
  .section {
    background: rgba(0, 20, 40, 0.6);
    border-left: 4px solid #10B981;
    padding: 20px;
    margin: 20px 0;
    border-radius: 5px;
  }
  .vulnerable {
    border-left-color: #2563EB;
    background: rgba(40, 0, 20, 0.6);
  }
  .secure {
    border-left-color: #1E40AF;
    background: rgba(0, 40, 20, 0.6);
  }
  .code {
    background: #000;
    border: 1px solid #10B981;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
    color: #1E40AF;
    margin: 10px 0;
    font-size: 14px;
  }
  .endpoint {
    color: #7C3AED;
    font-weight: bold;
  }
  .flag {
    color: #2563EB;
    font-weight: bold;
    text-shadow: 0 0 5px #3B82F6;
  }
  a {
    color: #4F46E5;
    text-decoration: none;
    text-shadow: 0 0 5px #6366F1;
  }
  a:hover {
    color: #1E40AF;
    text-shadow: 0 0 10px #10B981;
  }
  .nav-links {
    display: flex;
    gap: 20px;
    margin: 20px 0;
    flex-wrap: wrap;
  }
  .nav-link {
    background: rgba(0, 212, 255, 0.1);
    border: 2px solid #6366F1;
    padding: 15px 25px;
    border-radius: 5px;
    transition: all 0.3s;
  }
  .nav-link:hover {
    background: rgba(0, 255, 159, 0.2);
    border-color: #1E40AF;
    transform: translateY(-2px);
  }
  .warning {
    color: #2563EB;
    background: rgba(255, 0, 128, 0.1);
    padding: 10px;
    border-radius: 5px;
    margin: 10px 0;
  }
  .info {
    color: #7C3AED;
  }
  ul {
    line-height: 1.8;
  }
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  input, textarea {
    background: #FFFFFF;
    border: 2px solid #60A5FA;
    color: #1E40AF;
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
    font-family: 'Courier New', monospace;
    width: 100%;
    max-width: 400px;
  }
  input:focus, textarea:focus {
    outline: none;
    border-color: #4F46E5;
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  }
  .result {
    background: rgba(0, 0, 0, 0.9);
    border: 2px solid #60A5FA;
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
      <title>PawSpa Grooming �� - Appointment System - Navigation</title>
      <style>${pawspaStyles}</style>
    </head>
    <body>
      <div class="container">
        <h1>🐾 PAWSPA GROOMING</h1>
        <p style="text-align: center; font-size: 1.2em; margin-bottom: 30px;">
          <strong>Premium Pet Grooming & Spa Services</strong><br>
          Book appointments for your furry friends - Dogs, Cats, and exotic pets welcome!
        </p>
        
        <div class="nav-links">
          <a href="/example" class="nav-link">📚 Tutorial - How Our System Works</a>
          <a href="/lab1" class="nav-link">🎯 Lab 1 - Login Portal (Easy)</a>
          <a href="/lab2" class="nav-link">🔍 Lab 2 - My Appointments (Medium)</a>
          <a href="/lab3" class="nav-link">💀 Lab 3 - Account Recovery (Hard)</a>
        </div>

        <div class="section">
          <h2>🐾 Our Services</h2>
          <ul style="font-size: 1.1em;">
            <li><strong>Basic Bath</strong> - Wash, dry, and brush - $35</li>
            <li><strong>Full Groom</strong> - Bath, haircut, nail trim, ear cleaning - $65</li>
            <li><strong>Deluxe Spa</strong> - Full groom plus massage and aromatherapy - $95</li>
            <li><strong>Nail Trim Only</strong> - Quick paw maintenance - $15</li>
          </ul>
        </div>

        <div class="section">
          <h2>📅 About Our System</h2>
          <p>PawSpa Grooming uses an online appointment system for pet owners to book grooming services. Our system manages:</p>
          <ul>
            <li><strong>User Accounts:</strong> Pet owners create accounts to manage their appointments</li>
            <li><strong>Appointment Booking:</strong> Schedule services for your pets</li>
            <li><strong>Session Management:</strong> Stay logged in across visits</li>
            <li><strong>Pet Profiles:</strong> Save information about your furry friends</li>
          </ul>
        </div>

        <div class="section">
          <h2>🎯 Lab Challenges</h2>
          <ul>
            <li><span class="info">Lab 1:</span> Test the account creation system for password security</li>
            <li><span class="info">Lab 2:</span> Analyze how the system manages user sessions</li>
            <li><span class="info">Lab 3:</span> Explore session recovery and account access</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Example page - Help & Info
app.get('/example', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PawSpa Grooming 🐾 - About Our System</title>
      <style>${pawspaStyles}</style>
    </head>
    <body>
      <div class="container">
        <h1>🐾 ABOUT PAWSPA GROOMING</h1>
        <p><a href="/">← Back to Navigation</a></p>

        <div class="section">
          <h2>Welcome to PawSpa Grooming!</h2>
          <p>PawSpa Grooming provides premium pet grooming services with a convenient online appointment system. Book appointments, manage your pet profiles, and track service history all in one place.</p>
        </div>

        <div class="section">
          <h2>Our Services</h2>
          <ul>
            <li><strong>Full Grooming:</strong> Complete bath, haircut, and styling</li>
            <li><strong>Bath & Brush:</strong> Refreshing bath with thorough brushing</li>
            <li><strong>Nail Trim:</strong> Professional nail trimming and filing</li>
            <li><strong>Specialty Services:</strong> De-shedding, flea treatments, and more</li>
          </ul>
        </div>

        <div class="section">
          <h2>Security & Privacy</h2>
          <p>We take the security of your account and your pet's information seriously. Our system uses industry-standard authentication and data protection measures to keep your information safe.</p>
        </div>

        <div class="section">
          <h2>Account Features</h2>
          <ul>
            <li>Secure login with password protection</li>
            <li>Appointment history tracking</li>
            <li>Multiple pet profiles</li>
            <li>Email notifications and reminders</li>
          </ul>
        </div>

        <p style="margin-top: 30px;"><a href="/">← Back to Navigation</a></p>
      </div>
    </body>
    </html>
  `);
});

// Lab 1: Login Portal
app.get('/lab1', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A07: Lab 1 - Login Portal</title>
      <style>${pawspaStyles}</style>
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
          <p>You've discovered a appointment booking endpoint. The application claims to have "secure authentication," but you suspect the password policy might be weak.</p>
          <p>Test if the system accepts weak passwords that don't meet basic security standards.</p>
        </div>

        <div class="section">
          <h2>Target Endpoint</h2>
          <p class="endpoint">POST /api/lab1/register</p>
          <p><strong>Request Body:</strong></p>
          <div class="code"><pre>{
  "username": "fluffy_owner",
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
            <input type="text" id="username" value="fluffy_owner" required><br><br>
            
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
              resultDiv.innerHTML = '<p style="color: #2563EB;">Error: ' + (data.error || 'Registration failed') + '</p>';
            }
          } catch (error) {
            resultDiv.innerHTML = '<p style="color: #2563EB;">Request failed: ' + error.message + '</p>';
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
        flag: 'PAWSPA{W3AK_PAWSW0RD_P0L1CY}',
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

// Lab 2: My Appointments
app.get('/lab2', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A07: Lab 2 - My Appointments</title>
      <style>${pawspaStyles}</style>
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
              resultDiv.innerHTML = '<p style="color: #2563EB;">Error: ' + (data.error || 'Login failed') + '</p>';
            }
          } catch (error) {
            resultDiv.innerHTML = '<p style="color: #2563EB;">Request failed: ' + error.message + '</p>';
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
      flag: 'PAWSPA{S3SS10N_PR3D1CT4BL3_P3TS}',
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

// Lab 3: Account Recovery
app.get('/lab3', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A07: Lab 3 - Account Recovery</title>
      <style>${pawspaStyles}</style>
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
              loginResult.innerHTML += '<p style="color: #7C3AED;">Your session ID: ' + data.sessionId + '</p>';
              loginResult.innerHTML += '<p>Now try accessing profiles with different session IDs below...</p>';
            }
          } catch (error) {
            loginResult.innerHTML = '<p style="color: #2563EB;">Request failed: ' + error.message + '</p>';
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
            profileResult.innerHTML = '<p style="color: #2563EB;">Request failed: ' + error.message + '</p>';
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
      flag: 'PAWSPA{S3SS10N_H1J4CK3D_SP4}',
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
  console.log(`PawSpa Grooming �� - Appointment System Lab running on port ${PORT}`);
  console.log(`Navigate to http://localhost:${PORT} to begin`);
});
