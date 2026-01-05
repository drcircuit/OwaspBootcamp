const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const sessions = {};
let sessionIdCounter = 1;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A07: Authentication Failures Lab</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .vulnerable { background: #ffcccc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .secure { background: #ccffcc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        input { padding: 8px; width: 200px; margin: 5px; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>🔑 A07: Authentication Failures</h1>
      <p><strong>Learning Objective:</strong> Understand weak authentication and session management.</p>
      
      <div class="vulnerable">
        <h2>❌ Weak Authentication</h2>
        <h3>Issues:</h3>
        <ul>
          <li>Weak password policy</li>
          <li>Predictable session IDs</li>
          <li>No account lockout</li>
          <li>No multi-factor authentication</li>
        </ul>
        <input type="text" id="username" placeholder="Username">
        <input type="password" id="password" placeholder="Password (any)">
        <button onclick="login()">Login</button>
        <div id="result"></div>
      </div>

      <div class="secure">
        <h2>✅ Secure Authentication</h2>
        <ul>
          <li>Strong password policies (length, complexity)</li>
          <li>Multi-factor authentication (MFA)</li>
          <li>Account lockout after failed attempts</li>
          <li>Secure session management</li>
          <li>Password breach detection</li>
        </ul>
      </div>

      <script>
        async function login() {
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;
          const result = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await result.json();
          document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        }
      </script>
    </body>
    </html>
  `);
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // VULNERABLE: Accepts any password, weak session ID
  const sessionId = sessionIdCounter++;
  sessions[sessionId] = { username, timestamp: Date.now() };
  
  res.json({
    success: true,
    sessionId,
    message: 'Login successful',
    vulnerabilities: [
      'No password validation',
      'Predictable session ID',
      'Session never expires',
      'No MFA'
    ]
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`A07 Lab running on port ${PORT}`);
});
