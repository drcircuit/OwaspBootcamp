const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const products = [
  { id: 1, name: 'Laptop', price: 999 },
  { id: 2, name: 'Mouse', price: 29 }
];

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A05: Injection Lab</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .vulnerable { background: #ffcccc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .secure { background: #ccffcc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 3px; }
        input { padding: 8px; width: 300px; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>💉 A05: Injection</h1>
      <p><strong>Learning Objective:</strong> Understand SQL, NoSQL, OS, and other injection vulnerabilities.</p>
      
      <div class="vulnerable">
        <h2>❌ Vulnerable Search (String Concatenation)</h2>
        <input type="text" id="vuln-query" placeholder="Search products">
        <button onclick="searchVulnerable()">Search</button>
        <div id="vuln-result"></div>
        <p>Try: <code>' OR '1'='1</code> or <code>'; DROP TABLE products--</code></p>
      </div>

      <div class="secure">
        <h2>✅ Secure Search (Parameterized)</h2>
        <input type="text" id="secure-query" placeholder="Search products">
        <button onclick="searchSecure()">Search</button>
        <div id="secure-result"></div>
      </div>

      <script>
        async function searchVulnerable() {
          const query = document.getElementById('vuln-query').value;
          const result = await fetch('/api/search/vulnerable?q=' + encodeURIComponent(query));
          const data = await result.json();
          document.getElementById('vuln-result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        }

        async function searchSecure() {
          const query = document.getElementById('secure-query').value;
          const result = await fetch('/api/search/secure?q=' + encodeURIComponent(query));
          const data = await result.json();
          document.getElementById('secure-result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        }
      </script>
    </body>
    </html>
  `);
});

// VULNERABLE: String concatenation simulation
app.get('/api/search/vulnerable', (req, res) => {
  const query = req.query.q || '';
  const simulatedSQL = \`SELECT * FROM products WHERE name LIKE '%\${query}%'\`;
  
  if (query.includes("'") || query.toLowerCase().includes('drop') || query.toLowerCase().includes('delete')) {
    res.json({ 
      vulnerability: 'SQL Injection detected!',
      query: simulatedSQL,
      message: 'Malicious input could modify or delete data',
      results: []
    });
  } else {
    const results = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    res.json({ query: simulatedSQL, results });
  }
});

// SECURE: Parameterized (simulated)
app.get('/api/search/secure', (req, res) => {
  const query = req.query.q || '';
  const results = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  res.json({ 
    message: 'Using parameterized query (safe)',
    query: 'SELECT * FROM products WHERE name LIKE ?',
    parameters: [\`%\${query}%\`],
    results 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`A05 Lab running on port ${PORT}`);
});
