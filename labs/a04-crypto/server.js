const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

app.use(express.json());

// Simulated user database
const users = [
  { id: 1, username: 'alice', password: 'password123', apiKey: 'abc123' },
  { id: 2, username: 'bob', password: 'qwerty', apiKey: 'def456' }
];

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A04: Cryptographic Failures Lab</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .vulnerable { background: #ffcccc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .secure { background: #ccffcc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .info { background: #cce5ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 3px; overflow-x: auto; }
        h1 { color: #333; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>🔐 A04: Cryptographic Failures</h1>
      <p><strong>Learning Objective:</strong> Understand how weak cryptography and improper key management expose sensitive data.</p>
      
      <div class="info">
        <h2>Common Cryptographic Failures</h2>
        <ul>
          <li>Storing passwords in plain text</li>
          <li>Using weak hashing algorithms (MD5, SHA1)</li>
          <li>No encryption for sensitive data at rest</li>
          <li>Weak encryption algorithms</li>
          <li>Hard-coded encryption keys</li>
          <li>Not using TLS/HTTPS</li>
        </ul>
      </div>

      <div class="vulnerable">
        <h2>❌ Vulnerable Implementations</h2>
        
        <h3>1. Plain Text Password Storage</h3>
        <button onclick="showUsers()">View User Database</button>
        <div id="users-result"></div>
        
        <h3>2. Weak Hashing (MD5)</h3>
        <input type="text" id="password" placeholder="Enter password">
        <button onclick="hashMD5()">Hash with MD5 (Weak)</button>
        <div id="md5-result"></div>
        
        <h3>3. Hard-coded Encryption Key</h3>
        <pre>
const encryptionKey = 'my-secret-key-123'; // ❌ Hard-coded!
        </pre>
      </div>

      <div class="secure">
        <h2>✅ Secure Implementations</h2>
        
        <h3>1. Proper Password Hashing</h3>
        <input type="text" id="secure-password" placeholder="Enter password">
        <button onclick="hashSecure()">Hash with bcrypt/Argon2</button>
        <div id="secure-result"></div>
        
        <h3>Best Practices:</h3>
        <ul>
          <li>Use bcrypt, scrypt, or Argon2 for passwords</li>
          <li>Use AES-256 for data encryption</li>
          <li>Store encryption keys in environment variables or key vaults</li>
          <li>Use TLS 1.3 for data in transit</li>
          <li>Implement proper key rotation</li>
          <li>Never roll your own crypto</li>
        </ul>
      </div>

      <div class="info">
        <h2>📚 What You Learned</h2>
        <ul>
          <li>Never store passwords in plain text</li>
          <li>MD5 and SHA1 are broken for password hashing</li>
          <li>Use purpose-built password hashing functions</li>
          <li>Encryption keys must be protected and rotated</li>
          <li>Always use strong, modern cryptographic algorithms</li>
        </ul>
      </div>

      <script>
        async function showUsers() {
          const result = await fetch('/api/users/vulnerable');
          const data = await result.json();
          document.getElementById('users-result').innerHTML = 
            '<pre>' + JSON.stringify(data, null, 2) + 
            '\\n\\n⚠️ Passwords visible in plain text!</pre>';
        }

        async function hashMD5() {
          const password = document.getElementById('password').value;
          const result = await fetch('/api/hash/md5', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
          });
          const data = await result.json();
          document.getElementById('md5-result').innerHTML = 
            '<pre>' + JSON.stringify(data, null, 2) + 
            '\\n\\n⚠️ MD5 is cryptographically broken and can be reversed!</pre>';
        }

        async function hashSecure() {
          const password = document.getElementById('secure-password').value;
          const result = await fetch('/api/hash/secure', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
          });
          const data = await result.json();
          document.getElementById('secure-result').innerHTML = 
            '<pre>' + JSON.stringify(data, null, 2) + 
            '\\n\\n✅ This is a simulation - real bcrypt includes salt and cost factor!</pre>';
        }
      </script>
    </body>
    </html>
  `);
});

// VULNERABLE: Returns users with plain text passwords
app.get('/api/users/vulnerable', (req, res) => {
  res.json(users);
});

// VULNERABLE: MD5 hashing (weak)
app.post('/api/hash/md5', (req, res) => {
  const { password } = req.body;
  const hash = crypto.createHash('md5').update(password).digest('hex');
  res.json({ 
    algorithm: 'MD5',
    hash,
    warning: 'MD5 is cryptographically broken! Can be reversed with rainbow tables.'
  });
});

// SECURE: Proper password hashing (simulated bcrypt)
app.post('/api/hash/secure', (req, res) => {
  const { password } = req.body;
  // In production, use bcrypt.hash(password, 10)
  const simulatedBcrypt = crypto.createHash('sha256').update(password + 'salt').digest('hex');
  res.json({ 
    algorithm: 'bcrypt (simulated with SHA-256 + salt)',
    hash: simulatedBcrypt,
    note: 'Real bcrypt includes cost factor and automatic salt generation'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`A04 Lab running on port ${PORT}`);
});
