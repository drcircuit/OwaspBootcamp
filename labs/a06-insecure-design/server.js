const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let accountBalance = 1000;
let transferCount = 0;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A06: Insecure Design Lab</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .vulnerable { background: #ffcccc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .secure { background: #ccffcc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>🎨 A06: Insecure Design</h1>
      <p><strong>Learning Objective:</strong> Understand how flawed design leads to security vulnerabilities.</p>
      
      <div class="vulnerable">
        <h2>❌ Insecure Design: No Rate Limiting</h2>
        <p>Balance: $${accountBalance}</p>
        <p>Transfers made: ${transferCount}</p>
        <button onclick="transfer()">Transfer $100</button>
        <p>⚠️ No limit on transactions - spam the button!</p>
        <div id="result"></div>
      </div>

      <div class="secure">
        <h2>✅ Secure Design Principles</h2>
        <ul>
          <li>Rate limiting on sensitive operations</li>
          <li>Transaction limits and thresholds</li>
          <li>Business logic validation</li>
          <li>Threat modeling during design phase</li>
          <li>Defense in depth</li>
        </ul>
      </div>

      <script>
        async function transfer() {
          const result = await fetch('/api/transfer', { method: 'POST' });
          const data = await result.json();
          document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
          location.reload();
        }
      </script>
    </body>
    </html>
  `);
});

app.post('/api/transfer', (req, res) => {
  // VULNERABLE: No rate limiting, no validation
  transferCount++;
  accountBalance -= 100;
  res.json({ 
    message: 'Transfer successful',
    newBalance: accountBalance,
    transferCount,
    vulnerability: 'No rate limiting or business logic validation!'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`A06 Lab running on port \${PORT}\`);
});
