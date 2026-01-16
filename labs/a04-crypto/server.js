const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = 3004;

app.use(express.json());

// Simulated database for Lab 2 - users with MD5 hashed passwords
const lab2Users = [
  { username: 'user1', passwordHash: '5f4dcc3b5aa765d61d8327deb882cf99' }, // password
  { username: 'user2', passwordHash: 'e10adc3949ba59abbe56e057f20f883e' }, // 123456
  { username: 'admin', passwordHash: '21232f297a57a5a743894a0e4a801fc3' }  // admin
];

// Simulated database for Lab 3 - plaintext passwords
const lab3Admin = {
  username: 'admin',
  password: 'SuperSecret123!', // Plaintext password
  role: 'administrator'
};

// Cyberpunk theme CSS
const cyberpunkStyles = `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 100%);
      color: #0ff;
      line-height: 1.6;
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid #0ff;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
    }
    h1 {
      color: #f0f;
      text-align: center;
      font-size: 2.5em;
      text-shadow: 0 0 10px #f0f, 0 0 20px #f0f;
      margin-bottom: 20px;
      border-bottom: 2px solid #f0f;
      padding-bottom: 15px;
    }
    h2 {
      color: #0ff;
      font-size: 1.8em;
      margin: 30px 0 15px 0;
      text-shadow: 0 0 5px #0ff;
    }
    h3 {
      color: #ff0;
      font-size: 1.3em;
      margin: 20px 0 10px 0;
    }
    .section {
      background: rgba(0, 20, 40, 0.6);
      border: 1px solid #0ff;
      border-radius: 5px;
      padding: 20px;
      margin: 20px 0;
    }
    .vulnerable {
      border-color: #f00;
      background: rgba(40, 0, 0, 0.6);
    }
    .vulnerable h3 { color: #f00; }
    .secure {
      border-color: #0f0;
      background: rgba(0, 40, 0, 0.6);
    }
    .secure h3 { color: #0f0; }
    .info {
      border-color: #ff0;
      background: rgba(40, 40, 0, 0.6);
    }
    pre {
      background: #000;
      border: 1px solid #0ff;
      border-radius: 3px;
      padding: 15px;
      overflow-x: auto;
      color: #0f0;
      font-size: 0.9em;
      margin: 10px 0;
    }
    code {
      background: #000;
      color: #0f0;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    ul, ol {
      margin-left: 30px;
      margin-top: 10px;
    }
    li {
      margin: 8px 0;
      color: #0ff;
    }
    a {
      color: #f0f;
      text-decoration: none;
      text-shadow: 0 0 5px #f0f;
      transition: all 0.3s;
    }
    a:hover {
      color: #0ff;
      text-shadow: 0 0 10px #0ff;
    }
    .nav-links {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin: 30px 0;
      flex-wrap: wrap;
    }
    .nav-link {
      background: rgba(255, 0, 255, 0.2);
      border: 2px solid #f0f;
      padding: 15px 30px;
      border-radius: 5px;
      font-size: 1.1em;
      transition: all 0.3s;
    }
    .nav-link:hover {
      background: rgba(0, 255, 255, 0.2);
      border-color: #0ff;
      transform: scale(1.05);
    }
    .difficulty {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 3px;
      font-size: 0.9em;
      font-weight: bold;
      margin-left: 10px;
    }
    .difficulty.easy { background: #0f0; color: #000; }
    .difficulty.medium { background: #ff0; color: #000; }
    .difficulty.hard { background: #f00; color: #fff; }
    .stage {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 3px;
      font-size: 0.9em;
      background: #f0f;
      color: #000;
      font-weight: bold;
      margin-left: 10px;
    }
    .endpoint {
      background: rgba(0, 255, 255, 0.1);
      border-left: 3px solid #0ff;
      padding: 10px;
      margin: 10px 0;
      font-family: 'Courier New', monospace;
    }
    .flag {
      background: rgba(255, 0, 255, 0.2);
      border: 2px solid #f0f;
      padding: 10px;
      margin: 10px 0;
      font-weight: bold;
      text-align: center;
    }
    .warning {
      color: #ff0;
      font-weight: bold;
    }
  </style>
`;

// Home page - Navigation
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A04: Cryptographic Failures</title>
      ${cyberpunkStyles}
    </head>
    <body>
      <div class="container">
        <h1>🔐 A04: CRYPTOGRAPHIC FAILURES</h1>
        
        <div class="section info">
          <h2>Mission Briefing</h2>
          <p>Welcome, Agent. Your mission is to identify and exploit cryptographic vulnerabilities in legacy systems. These systems use outdated hashing algorithms, store passwords insecurely, and have weak encryption implementations.</p>
        </div>

        <div class="nav-links">
          <a href="/example" class="nav-link">📚 EXAMPLE</a>
          <a href="/lab1" class="nav-link">🎯 LAB 1</a>
          <a href="/lab2" class="nav-link">🎯 LAB 2</a>
          <a href="/lab3" class="nav-link">🎯 LAB 3</a>
        </div>

        <div class="section">
          <h2>Lab Overview</h2>
          <ul>
            <li><strong>Example:</strong> Educational walkthrough of cryptographic failures</li>
            <li><strong>Lab 1:</strong> Reconnaissance - Detect weak hashing algorithms <span class="difficulty easy">EASY</span></li>
            <li><strong>Lab 2:</strong> Scanning - Crack weak password hashes <span class="difficulty medium">MEDIUM</span></li>
            <li><strong>Lab 3:</strong> Initial Access - Extract plaintext credentials <span class="difficulty hard">HARD</span></li>
          </ul>
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
      <title>Example - Cryptographic Failures</title>
      ${cyberpunkStyles}
    </head>
    <body>
      <div class="container">
        <h1>📚 EXAMPLE: CRYPTOGRAPHIC FAILURES</h1>
        <p><a href="/">← Back to Home</a></p>

        <div class="section info">
          <h2>What are Cryptographic Failures?</h2>
          <p>Cryptographic failures occur when applications fail to properly protect sensitive data through encryption, hashing, or other cryptographic means. This is one of the most critical security risks in modern applications.</p>
        </div>

        <div class="section vulnerable">
          <h2>❌ Common Cryptographic Failures</h2>
          
          <h3>1. Plaintext Password Storage</h3>
          <p>Storing passwords without any protection is the worst possible approach.</p>
          <pre>// VULNERABLE CODE
const users = [
  { username: 'alice', password: 'mypassword123' },
  { username: 'bob', password: 'qwerty' }
];

// If database is compromised, all passwords are exposed!</pre>
          <p class="warning">⚠️ Impact: Complete account compromise if database is breached</p>

          <h3>2. Weak Hashing Algorithms (MD5/SHA1)</h3>
          <p>MD5 and SHA1 are cryptographically broken and vulnerable to rainbow table attacks.</p>
          <pre>// VULNERABLE CODE
const crypto = require('crypto');
const passwordHash = crypto.createHash('md5')
  .update('password123')
  .digest('hex');
// Result: 482c811da5d5b4bc6d497ffa98491e38

// Attackers can easily reverse this with rainbow tables!</pre>
          <p class="warning">⚠️ Rainbow Tables: Precomputed tables of hash values for common passwords</p>
          <p>Example MD5 hash: <code>5f4dcc3b5aa765d61d8327deb882cf99</code> = "password"</p>

          <h3>3. Hard-coded Encryption Keys</h3>
          <p>Embedding encryption keys directly in source code exposes them to anyone with code access.</p>
          <pre>// VULNERABLE CODE
const ENCRYPTION_KEY = 'my-secret-key-123'; // ❌ Hard-coded!

function encrypt(data) {
  return crypto.encrypt(data, ENCRYPTION_KEY);
}</pre>
          <p class="warning">⚠️ Impact: All encrypted data can be decrypted if key is discovered</p>

          <h3>4. Missing TLS/HTTPS</h3>
          <p>Transmitting sensitive data over unencrypted HTTP connections.</p>
          <pre>// VULNERABLE - Sending credentials over HTTP
fetch('http://api.example.com/login', {
  method: 'POST',
  body: JSON.stringify({ username, password })
});</pre>
          <p class="warning">⚠️ Impact: Credentials can be intercepted via man-in-the-middle attacks</p>
        </div>

        <div class="section secure">
          <h2>✅ Secure Implementation: Password Storage</h2>
          
          <h3>Using bcrypt (Recommended)</h3>
          <p>bcrypt is a purpose-built password hashing function that includes:</p>
          <ul>
            <li><strong>Salt:</strong> Random data added to password before hashing</li>
            <li><strong>Cost Factor:</strong> Makes hashing intentionally slow to resist brute force</li>
            <li><strong>Adaptive:</strong> Can increase cost factor as hardware improves</li>
          </ul>
          
          <pre>// SECURE CODE
const bcrypt = require('bcrypt');

// Hash password during registration
async function registerUser(username, password) {
  const saltRounds = 10; // Cost factor
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  // Store hashedPassword in database
  // Example hash: $2b$10$N9qo8uLOickgx2ZMRZoMye...
  return { username, passwordHash: hashedPassword };
}

// Verify password during login
async function loginUser(username, password) {
  const user = await getUserFromDB(username);
  const isValid = await bcrypt.compare(password, user.passwordHash);
  return isValid;
}</pre>

          <h3>How bcrypt Protects Against Attacks</h3>
          <ul>
            <li><strong>Rainbow Tables:</strong> Each password has unique salt, making precomputed tables useless</li>
            <li><strong>Brute Force:</strong> Cost factor makes each attempt slow (10-12 rounds = ~100ms per hash)</li>
            <li><strong>GPU Attacks:</strong> Memory-hard algorithm resists GPU acceleration</li>
          </ul>
        </div>

        <div class="section secure">
          <h2>✅ Best Practices</h2>
          <ul>
            <li><strong>Password Hashing:</strong> Use bcrypt, scrypt, or Argon2 (winner of Password Hashing Competition)</li>
            <li><strong>Data Encryption:</strong> Use AES-256-GCM for encrypting data at rest</li>
            <li><strong>Key Management:</strong> Store keys in environment variables, AWS KMS, or HashiCorp Vault</li>
            <li><strong>Transport Security:</strong> Always use TLS 1.3 or TLS 1.2 minimum</li>
            <li><strong>Key Rotation:</strong> Regularly rotate encryption keys and re-encrypt data</li>
            <li><strong>Never Roll Your Own:</strong> Use established cryptographic libraries, don't implement your own algorithms</li>
          </ul>
        </div>

        <div class="section info">
          <h2>📚 Key Concepts</h2>
          
          <h3>Hashing vs Encryption</h3>
          <ul>
            <li><strong>Hashing:</strong> One-way function, cannot be reversed (use for passwords)</li>
            <li><strong>Encryption:</strong> Two-way function, can be decrypted with key (use for data)</li>
          </ul>

          <h3>Salt</h3>
          <p>Random data added to password before hashing to ensure identical passwords produce different hashes.</p>
          <pre>// Without salt
hash("password") = "5f4dcc3b5aa765d61d8327deb882cf99"
hash("password") = "5f4dcc3b5aa765d61d8327deb882cf99" // Same!

// With salt
hash("password" + "randomsalt1") = "a1b2c3d4..."
hash("password" + "randomsalt2") = "e5f6g7h8..." // Different!</pre>

          <h3>Rainbow Tables</h3>
          <p>Precomputed lookup tables of password hashes. Attackers can instantly reverse common password hashes without computing them.</p>
          <pre>// Rainbow table lookup
MD5("password") = "5f4dcc3b5aa765d61d8327deb882cf99"
MD5("123456")  = "e10adc3949ba59abbe56e057f20f883e"
MD5("admin")   = "21232f297a57a5a743894a0e4a801fc3"

// Salting defeats rainbow tables because each hash is unique!</pre>
        </div>

        <div class="section">
          <h2>🎯 Ready for the Labs?</h2>
          <p>Now that you understand cryptographic failures, proceed to the labs to practice identifying and exploiting these vulnerabilities.</p>
          <div class="nav-links">
            <a href="/lab1" class="nav-link">Start Lab 1 →</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 1 - Easy: Reconnaissance - Find weak hashing algorithm
app.get('/lab1', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 1 - Cryptographic Failures</title>
      ${cyberpunkStyles}
    </head>
    <body>
      <div class="container">
        <h1>🎯 LAB 1: WEAK HASHING DETECTION</h1>
        <p><a href="/">← Back to Home</a></p>

        <div class="section info">
          <h2>Mission Objective</h2>
          <p><span class="difficulty easy">EASY</span> <span class="stage">RECONNAISSANCE</span></p>
          <p>You've discovered a password hashing API endpoint. Your mission is to identify the weak hashing algorithm being used.</p>
        </div>

        <div class="section">
          <h2>📋 Instructions</h2>
          <ol>
            <li>Test the password hashing endpoint with a known password</li>
            <li>Analyze the hash output to identify the algorithm</li>
            <li>Determine if the algorithm is cryptographically weak</li>
            <li>Retrieve the flag by confirming the weak algorithm</li>
          </ol>
        </div>

        <div class="section">
          <h2>🔍 Target Endpoint</h2>
          <div class="endpoint">
            <strong>GET</strong> /api/lab1/hash?password=<em>test</em>
          </div>
          <p>Test with different passwords and observe the hash output format.</p>
        </div>

        <div class="section">
          <h2>💡 Hints</h2>
          <ul>
            <li>Try hashing a common password like "password" or "test"</li>
            <li>Observe the length and format of the hash</li>
            <li>MD5 hashes are 32 hexadecimal characters</li>
            <li>You can look up common password hashes online to identify the algorithm</li>
          </ul>
        </div>

        <div class="section">
          <h2>🚩 Success Criteria</h2>
          <p>You'll receive the flag <span class="flag">NSA{W3AK_H4SH_F0UND}</span> when you correctly identify the weak hashing algorithm.</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 1 API - Returns MD5 hash
app.get('/api/lab1/hash', (req, res) => {
  const { password } = req.query;
  
  if (!password) {
    return res.status(400).json({ error: 'Password parameter required' });
  }

  const hash = crypto.createHash('md5').update(password).digest('hex');
  
  res.json({
    password: password,
    hash: hash,
    algorithm: 'MD5',
    flag: 'NSA{W3AK_H4SH_F0UND}',
    message: 'You successfully identified the weak MD5 hashing algorithm!',
    vulnerability: 'MD5 is cryptographically broken and vulnerable to collision attacks and rainbow table lookups.'
  });
});

// Lab 2 - Medium: Scanning - Crack weak password hashes
app.get('/lab2', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 2 - Cryptographic Failures</title>
      ${cyberpunkStyles}
    </head>
    <body>
      <div class="container">
        <h1>🎯 LAB 2: PASSWORD CRACKING</h1>
        <p><a href="/">← Back to Home</a></p>

        <div class="section info">
          <h2>Mission Objective</h2>
          <p><span class="difficulty medium">MEDIUM</span> <span class="stage">SCANNING</span></p>
          <p>You've obtained a database dump containing weakly hashed passwords. Your mission is to crack the hashes and gain access to user accounts.</p>
        </div>

        <div class="section">
          <h2>📋 Instructions</h2>
          <ol>
            <li>Retrieve the user database with hashed passwords</li>
            <li>Identify the hashing algorithm (MD5)</li>
            <li>Use online rainbow tables or brute force to crack the hashes</li>
            <li>Verify the cracked password to obtain the flag</li>
          </ol>
        </div>

        <div class="section">
          <h2>🔍 Target Endpoints</h2>
          <div class="endpoint">
            <strong>GET</strong> /api/lab2/users
          </div>
          <p>Retrieves the user database with MD5 hashed passwords.</p>
          
          <div class="endpoint">
            <strong>POST</strong> /api/lab2/verify<br>
            <strong>Body:</strong> { "username": "user1", "password": "cracked_password" }
          </div>
          <p>Verify a cracked password to get the flag.</p>
        </div>

        <div class="section">
          <h2>💡 Hints</h2>
          <ul>
            <li>The passwords are common and likely found in rainbow tables</li>
            <li>Try online MD5 decryption services like md5decrypt.net or crackstation.net</li>
            <li>User "user1" has a very common password</li>
            <li>The hash <code>5f4dcc3b5aa765d61d8327deb882cf99</code> is a well-known MD5 hash</li>
          </ul>
        </div>

        <div class="section">
          <h2>🚩 Success Criteria</h2>
          <p>You'll receive the flag <span class="flag">NSA{P4SSW0RD_CR4CK3D}</span> when you successfully crack a password and verify it.</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 2 API - Get users with MD5 hashed passwords
app.get('/api/lab2/users', (req, res) => {
  res.json({
    users: lab2Users,
    note: 'Password hashes are MD5. Common passwords can be reversed using rainbow tables.',
    hint: 'Try looking up these hashes on crackstation.net or md5decrypt.net'
  });
});

// Lab 2 API - Verify cracked password
app.post('/api/lab2/verify', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = lab2Users.find(u => u.username === username);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const hash = crypto.createHash('md5').update(password).digest('hex');
  
  if (hash === user.passwordHash) {
    return res.json({
      success: true,
      flag: 'NSA{P4SSW0RD_CR4CK3D}',
      message: `Successfully cracked password for ${username}!`,
      vulnerability: 'MD5 hashes can be easily reversed using rainbow tables, exposing all user passwords.',
      crackedPassword: password
    });
  } else {
    return res.status(401).json({
      success: false,
      error: 'Incorrect password',
      hint: 'The hash suggests this is a very common password. Try popular password lists.'
    });
  }
});

// Lab 3 - Hard: Initial Access - Extract plaintext credentials
app.get('/lab3', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 3 - Cryptographic Failures</title>
      ${cyberpunkStyles}
    </head>
    <body>
      <div class="container">
        <h1>🎯 LAB 3: PLAINTEXT CREDENTIAL EXTRACTION</h1>
        <p><a href="/">← Back to Home</a></p>

        <div class="section info">
          <h2>Mission Objective</h2>
          <p><span class="difficulty hard">HARD</span> <span class="stage">INITIAL ACCESS</span></p>
          <p>Intelligence suggests a legacy admin system stores credentials in plaintext. Your mission is to locate and extract these credentials from the database.</p>
        </div>

        <div class="section">
          <h2>📋 Instructions</h2>
          <ol>
            <li>Enumerate the API endpoints to find the admin database</li>
            <li>Access the admin user record</li>
            <li>Extract the plaintext password</li>
            <li>Retrieve the flag from the response</li>
          </ol>
        </div>

        <div class="section">
          <h2>🔍 Target Endpoint</h2>
          <div class="endpoint">
            <strong>GET</strong> /api/lab3/admin
          </div>
          <p>Access the admin user database. This endpoint returns sensitive information.</p>
        </div>

        <div class="section">
          <h2>💡 Hints</h2>
          <ul>
            <li>Legacy systems often store passwords in plaintext for "convenience"</li>
            <li>Admin endpoints might not have proper access controls</li>
            <li>The endpoint path follows RESTful conventions</li>
            <li>Simply accessing the endpoint might be enough</li>
          </ul>
        </div>

        <div class="section">
          <h2>🚩 Success Criteria</h2>
          <p>You'll receive the flag <span class="flag">NSA{PL41N_T3XT_P4SSW0RDS}</span> when you successfully access the plaintext password.</p>
        </div>

        <div class="section vulnerable">
          <h2>⚠️ Real-World Impact</h2>
          <p>Storing passwords in plaintext is one of the worst security practices. If the database is compromised:</p>
          <ul>
            <li>All user passwords are immediately exposed</li>
            <li>Users who reuse passwords across sites are at risk</li>
            <li>No computational work required for attackers</li>
            <li>Compliance violations (GDPR, PCI-DSS, etc.)</li>
            <li>Complete loss of user trust and potential legal liability</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 3 API - Returns admin with plaintext password
app.get('/api/lab3/admin', (req, res) => {
  res.json({
    user: lab3Admin,
    flag: 'NSA{PL41N_T3XT_P4SSW0RDS}',
    message: 'Successfully extracted plaintext credentials from database!',
    vulnerability: 'CRITICAL: Admin password stored in plaintext. Zero encryption or hashing protection.',
    impact: 'Complete account compromise. If database is breached, all credentials are immediately exposed.',
    remediation: 'Immediately implement bcrypt or Argon2 password hashing with proper salt and cost factors.'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`A04 Cryptographic Failures Lab running on port ${PORT}`);
});
