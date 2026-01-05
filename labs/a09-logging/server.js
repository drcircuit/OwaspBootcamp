const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const events = [];

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A09: Security Logging and Alerting Failures Lab</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .vulnerable { background: #ffcccc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .secure { background: #ccffcc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>📊 A09: Security Logging and Alerting Failures</h1>
      <p><strong>Learning Objective:</strong> Understand the importance of security logging and monitoring.</p>
      
      <div class="vulnerable">
        <h2>❌ No Security Logging</h2>
        <button onclick="performSensitiveAction()">Delete User Account</button>
        <button onclick="performLoginAttempt()">Failed Login Attempt</button>
        <div id="result"></div>
        <p>⚠️ These critical actions aren't being logged!</p>
      </div>

      <div class="secure">
        <h2>✅ Proper Security Logging</h2>
        <h3>What to Log:</h3>
        <ul>
          <li>Authentication attempts (success/failure)</li>
          <li>Authorization failures</li>
          <li>Input validation failures</li>
          <li>Critical operations (delete, update sensitive data)</li>
          <li>Security exceptions</li>
        </ul>
        <h3>What NOT to Log:</h3>
        <ul>
          <li>Passwords or credentials</li>
          <li>Session tokens</li>
          <li>Credit card numbers</li>
          <li>Personal data (GDPR/privacy concerns)</li>
        </ul>
      </div>

      <script>
        async function performSensitiveAction() {
          const result = await fetch('/api/user/delete/123', { method: 'DELETE' });
          const data = await result.json();
          document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        }

        async function performLoginAttempt() {
          const result = await fetch('/api/login/fail', { method: 'POST' });
          const data = await result.json();
          document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        }
      </script>
    </body>
    </html>
  `);
});

// VULNERABLE: No logging
app.delete('/api/user/delete/:id', (req, res) => {
  res.json({ 
    message: 'User deleted',
    userId: req.params.id,
    vulnerability: 'This critical action was not logged!'
  });
});

app.post('/api/login/fail', (req, res) => {
  res.json({ 
    message: 'Failed login attempt',
    vulnerability: 'Failed logins should be logged to detect brute force attacks!'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`A09 Lab running on port ${PORT}`);
});
