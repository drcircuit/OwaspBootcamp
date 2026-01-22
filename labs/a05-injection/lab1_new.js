// Lab 1 - SQL Injection via Product Search (Error-Based)
app.get('/lab1', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Product Search - ShopTech</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔍 Product Search</h1>
          <p class="subtitle">Lab 1: Find Your Perfect Tech</p>
        </div>

        <div class="welcome-section">
          <h2>Search Our Catalog</h2>
          <p>Search through our extensive product inventory by name, category, or specifications.</p>
          
          <div class="interactive-demo" style="margin-top: 30px;">
            <input type="text" id="search-input" class="demo-input" placeholder="Search products..." style="width: 70%; padding: 15px; font-size: 1.1em; border: 2px solid #ddd; border-radius: 8px;">
            <button onclick="searchProducts()" class="demo-button" style="padding: 15px 30px; font-size: 1.1em;">Search</button>
          </div>
          
          <div id="search-results" style="margin-top: 30px; min-height: 100px;"></div>
          
          <div class="hint-box" style="margin-top: 30px;">
            <strong>💡 Discovery Tip:</strong> Try using gobuster to discover search API endpoints:<br>
            <code>gobuster dir -u http://localhost:3005 -w /path/to/wordlist.txt</code>
          </div>
        </div>

        <div class="back-link">
          <a href="/">← Back to Home</a>
        </div>
      </div>

      <script>
        async function searchProducts() {
          const query = document.getElementById('search-input').value;
          const resultsDiv = document.getElementById('search-results');
          
          if (!query) {
            resultsDiv.innerHTML = '<p style="color:#999;">Please enter a search term</p>';
            return;
          }
          
          resultsDiv.innerHTML = '<p style="color:#667eea;">Searching...</p>';
          
          try {
            const response = await fetch('/api/search?q=' + encodeURIComponent(query));
            const data = await response.json();
            
            if (data.error) {
              resultsDiv.innerHTML = \`
                <div style="background:#ffebee; border-left:4px solid #c62828; padding:20px; border-radius:8px;">
                  <h3 style="color:#c62828; margin-bottom:10px;">❌ Search Error</h3>
                  <pre style="background:#fff; padding:15px; border-radius:5px; overflow-x:auto; font-size:0.9em;">\${data.error}</pre>
                  \${data.flag ? '<p style="color:#2e7d32; font-weight:bold; margin-top:15px;">🎯 Flag: ' + data.flag + '</p>' : ''}
                </div>
              \`;
            } else if (data.results && data.results.length > 0) {
              resultsDiv.innerHTML = \`
                <h3 style="color:#667eea; margin-bottom:15px;">Found \${data.results.length} product(s):</h3>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(250px, 1fr)); gap:15px;">
                  \${data.results.map(p => \`
                    <div class="card">
                      <h4>\${p.name}</h4>
                      <p style="font-size:1.3em; color:#667eea; font-weight:bold;">$\${p.price}</p>
                      <p style="color:#666;">\${p.category}</p>
                      <p style="color:#999; font-size:0.85em;">SKU: \${p.sku}</p>
                    </div>
                  \`).join('')}
                </div>
              \`;
            } else {
              resultsDiv.innerHTML = '<p style="color:#999;">No products found matching your search.</p>';
            }
          } catch (error) {
            resultsDiv.innerHTML = '<p style="color:#c62828;">Connection error: ' + error.message + '</p>';
          }
        }
        
        // Allow Enter key to search
        document.getElementById('search-input').addEventListener('keypress', (e) => {
          if (e.key === 'Enter') searchProducts();
        });
      </script>
    </body>
    </html>
  `);
});

// Lab 1 API - VULNERABLE: SQL Injection in search
app.get('/api/search', (req, res) => {
  const query = req.query.q || '';
  
  if (!query) {
    return res.json({
      success: false,
      message: 'Please provide a search term'
    });
  }
  
  // VULNERABLE: Direct string concatenation in SQL query
  const vulnerableQuery = `SELECT * FROM products WHERE name LIKE '%${query}%' OR category LIKE '%${query}%' OR sku LIKE '%${query}%'`;
  
  // Detect SQL injection attempts
  const hasSQLChars = query.includes("'") || query.includes('"') || query.includes('--') || 
                      query.toLowerCase().includes(' or ') || query.toLowerCase().includes(' and ') ||
                      query.toLowerCase().includes('union') || query.includes(';');
  
  if (hasSQLChars) {
    // Simulate SQL error message that would be thrown by real database
    return res.status(500).json({
      error: `SQL Error: You have an error in your SQL syntax near '${query}' at line 1

Query: ${vulnerableQuery}

Database: shoptech_prod
Table: products
Columns: id, name, price, category, stock, sku, rating

Connection String: postgres://shoptech_user:Sh0pT3ch2024!@db.shoptech.io:5432/shoptech_prod

Stack Trace:
  at executeQuery (/app/database/query.js:156:12)
  at searchProducts (/app/api/search.js:42:18)
  at processRequest (/app/server.js:672:24)`,
      flag: 'NSA{SQL_3RR0R_1NJ3CT}',
      vulnerable_query: vulnerableQuery,
      hint: 'SQL injection detected! The error message exposed sensitive database information.'
    });
  }
  
  // Normal search - filter products
  const results = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    p.sku.toLowerCase().includes(query.toLowerCase())
  );
  
  res.json({
    success: true,
    query: query,
    results: results,
    count: results.length
  });
});

