const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Simulated user database
const users = {
  1: { id: 1, username: 'alice', email: 'alice@example.com', role: 'user', salary: 50000 },
  2: { id: 2, username: 'bob', email: 'bob@example.com', role: 'user', salary: 55000 },
  3: { id: 3, username: 'admin', email: 'admin@example.com', role: 'admin', salary: 100000 }
};

// Simulated current user session (normally would be from cookie/token)
let currentUserId = 2; // Bob is logged in

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A01: Broken Access Control Lab</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .vulnerable { background: #ffcccc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .secure { background: #ccffcc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .info { background: #cce5ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 3px; overflow-x: auto; }
        h1 { color: #333; }
        h2 { color: #666; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>🔓 A01: Broken Access Control</h1>
      <p><strong>Learning Objective:</strong> Understand how broken access control allows unauthorized access to resources.</p>
      
      <div class="info">
        <h2>Current User: Bob (ID: 2)</h2>
        <p>You are logged in as Bob, a regular user.</p>
      </div>

      <div class="vulnerable">
        <h2>❌ Vulnerable Endpoint</h2>
        <p>This endpoint doesn't check if you're authorized to view the requested user's data:</p>
        <pre>GET /api/vulnerable/user/:id</pre>
        <button onclick="testVulnerable(1)">View Alice's Profile (ID: 1)</button>
        <button onclick="testVulnerable(2)">View Your Profile (ID: 2)</button>
        <button onclick="testVulnerable(3)">View Admin Profile (ID: 3)</button>
        <div id="vulnerable-result"></div>
      </div>

      <div class="secure">
        <h2>✅ Secure Endpoint</h2>
        <p>This endpoint checks authorization before returning data:</p>
        <pre>GET /api/secure/user/:id</pre>
        <button onclick="testSecure(1)">View Alice's Profile (ID: 1)</button>
        <button onclick="testSecure(2)">View Your Profile (ID: 2)</button>
        <button onclick="testSecure(3)">View Admin Profile (ID: 3)</button>
        <div id="secure-result"></div>
      </div>

      <div class="info">
        <h2>📚 What You Learned</h2>
        <ul>
          <li>Broken access control allows users to access resources they shouldn't</li>
          <li>Always verify the user has permission to access the requested resource</li>
          <li>Don't rely solely on hiding UI elements - secure the API endpoints</li>
          <li>Implement proper authorization checks on the server side</li>
        </ul>
      </div>

      <script>
        async function testVulnerable(id) {
          const result = await fetch('/api/vulnerable/user/' + id);
          const data = await result.json();
          document.getElementById('vulnerable-result').innerHTML = 
            '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        }

        async function testSecure(id) {
          const result = await fetch('/api/secure/user/' + id);
          const data = await result.json();
          document.getElementById('secure-result').innerHTML = 
            '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        }
      </script>
    </body>
    </html>
  `);
});

// VULNERABLE: No authorization check
app.get('/api/vulnerable/user/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users[userId];
  
  if (user) {
    // Add flag when accessing user data you shouldn't see
    const response = { ...user };
    if (currentUserId !== userId) {
      response.flag = 'NSA{1D0R_V1A_1NC3PT10N}';
      response.exploited = 'You accessed another user\'s data!';
    }
    res.json(response);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// SECURE: With authorization check
app.get('/api/secure/user/:id', (req, res) => {
  const requestedUserId = parseInt(req.params.id);
  const user = users[requestedUserId];
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Authorization check: Users can only view their own data, admins can view all
  const currentUser = users[currentUserId];
  if (currentUser.role !== 'admin' && currentUserId !== requestedUserId) {
    return res.status(403).json({ 
      error: 'Forbidden: You can only view your own profile',
      hint: 'This is proper access control!'
    });
  }

  res.json(user);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`A01 Lab running on port ${PORT}`);
});
