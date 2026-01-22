const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const products = [
  { id: 1, name: 'Wireless Headphones Pro', price: 249.99, category: 'audio', stock: 45, sku: 'AUD-HP-001', rating: 4.5 },
  { id: 2, name: 'Smart Watch Series 5', price: 399.99, category: 'wearables', stock: 23, sku: 'WER-SW-005', rating: 4.7 },
  { id: 3, name: 'USB-C Charging Cable 6ft', price: 19.99, category: 'accessories', stock: 150, sku: 'ACC-CBL-006', rating: 4.2 },
  { id: 4, name: 'Laptop Stand Aluminum', price: 79.99, category: 'office', stock: 67, sku: 'OFF-STD-012', rating: 4.8 },
  { id: 5, name: '4K Webcam Ultra HD', price: 129.99, category: 'video', stock: 34, sku: 'VID-WC-008', rating: 4.6 },
  { id: 6, name: 'Mechanical Keyboard RGB', price: 159.99, category: 'peripherals', stock: 28, sku: 'PER-KB-015', rating: 4.9 },
  { id: 7, name: 'Portable SSD 1TB', price: 149.99, category: 'storage', stock: 56, sku: 'STR-SSD-020', rating: 4.7 },
  { id: 8, name: 'Wireless Mouse Ergonomic', price: 49.99, category: 'peripherals', stock: 89, sku: 'PER-MS-018', rating: 4.4 }
];

const customers = [
  { id: 1, email: 'admin@shoptech.com', password: 'ShopAdmin2024!', name: 'Emma Martinez', role: 'admin', credit_card: '**** **** **** 4521', rewards_points: 12500, member_since: '2020-01-15' },
  { id: 2, email: 'john.buyer@email.com', password: 'Tech123!', name: 'John Richardson', role: 'customer', credit_card: '**** **** **** 7834', rewards_points: 850, member_since: '2023-04-20' },
  { id: 3, email: 'sarah.tech@email.com', password: 'Gadget2024', name: 'Sarah Chen', role: 'customer', credit_card: '**** **** **** 2193', rewards_points: 2340, member_since: '2022-08-10' },
  { id: 4, email: 'mike.shopper@email.com', password: 'BuyStuff99', name: 'Mike Thompson', role: 'customer', credit_card: '**** **** **** 8901', rewards_points: 450, member_since: '2024-01-05' }
];

// Shared styles for ShopTech E-Commerce theme
const styles = `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
      line-height: 1.6;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    .header {
      background: white;
      padding: 30px 40px;
      border-radius: 15px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      margin-bottom: 30px;
      text-align: center;
    }
    h1 {
      color: #667eea;
      font-size: 2.5em;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .subtitle { color: #764ba2; font-size: 1.2em; }
    .welcome-section {
      background: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      margin-bottom: 30px;
    }
    .welcome-section h2 {
      color: #667eea;
      margin-bottom: 15px;
      font-size: 2em;
    }
    .welcome-section p {
      color: #555;
      line-height: 1.8;
      font-size: 1.1em;
    }
    .nav-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
    }
    .card {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      transition: transform 0.2s, box-shadow 0.2s;
      text-decoration: none;
      color: inherit;
      display: block;
      border-left: 4px solid #667eea;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    }
    .card h3 { color: #667eea; margin-bottom: 15px; font-size: 1.4em; }
    .card p { color: #666; line-height: 1.6; margin-bottom: 15px; }
    .card-badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.75em;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-tutorial { background: #e3f2fd; color: #1976d2; }
    .badge-easy { background: #e8f5e9; color: #388e3c; }
    .badge-medium { background: #fff3e0; color: #f57c00; }
    .badge-hard { background: #ffebee; color: #d32f2f; }
    .tutorial-section {
      background: white;
      padding: 30px;
      border-radius: 15px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      margin-bottom: 25px;
      border-left: 4px solid #ff6b9d;
    }
    .tutorial-section h2 {
      color: #ff6b9d;
      margin-bottom: 15px;
      font-size: 1.8em;
    }
    .tutorial-section p { color: #555; margin-bottom: 15px; line-height: 1.7; }
    .tutorial-box {
      background: #f1f8e9;
      padding: 20px;
      border-radius: 10px;
      margin: 15px 0;
      border-left: 3px solid #4caf50;
    }
    .interactive-demo {
      background: #fff3e0;
      padding: 20px;
      border-radius: 10px;
      margin: 15px 0;
      border-left: 3px solid #ff9800;
    }
    .demo-controls { margin: 15px 0; }
    .demo-input {
      width: 100%;
      padding: 12px;
      border: 2px solid #ff6b9d;
      border-radius: 8px;
      font-size: 1em;
      margin: 10px 0;
    }
    .demo-button {
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 1em;
      margin: 5px;
    }
    .demo-button:hover {
      background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
    }
    .output-box {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      margin: 15px 0;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
      white-space: pre-wrap;
      word-wrap: break-word;
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #ddd;
    }
    .flag-reveal {
      background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
      color: white;
      padding: 20px;
      border-radius: 10px;
      margin: 15px 0;
      text-align: center;
      font-weight: bold;
      font-size: 1.2em;
      display: none;
    }
    .hint-box {
      background: #fff3e0;
      border-left: 4px solid #ff9800;
      padding: 15px;
      margin: 15px 0;
      border-radius: 5px;
    }
    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      color: #c62828;
    }
    pre {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      overflow-x: auto;
      border: 1px solid #ddd;
      margin: 10px 0;
    }
    .back-link { text-align: center; margin-top: 30px; }
    .back-link a { color: #ff6b9d; text-decoration: none; font-weight: 600; }
    .footer {
      text-align: center;
      color: rgba(0,0,0,0.6);
      margin-top: 40px;
      padding: 20px;
    }
  </style>
`;

// Home page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ShopTech Electronics</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💻 ShopTech Electronics</h1>
          <p class="subtitle">Fresh. Healthy. Delicious.</p>
        </div>
        
        <div class="welcome-section">
          <h2>Welcome to ShopTech!</h2>
          <p>Order your favorite smoothies online for pickup or delivery. Browse our menu, search for your favorites, and manage your account.</p>
        </div>
        
        <div class="nav-cards">
          <a href="/example" class="card">
            <h3>📚 Getting Started</h3>
            <p>Learn about SQL injection vulnerabilities with interactive tutorials and examples.</p>
            <span class="card-badge badge-tutorial">Tutorial</span>
          </a>

          <a href="/lab1" class="card">
            <h3>🔍 Search Menu</h3>
            <p>Explore our smoothie menu with a secure search feature. See how parameterized queries work!</p>
            <span class="card-badge badge-easy">Lab 1</span>
          </a>

          <a href="/lab2" class="card">
            <h3>🔬 Advanced Search</h3>
            <p>Try advanced search with multiple filters. Can you detect SQL injection vulnerabilities?</p>
            <span class="card-badge badge-medium">Lab 2</span>
          </a>

          <a href="/lab3" class="card">
            <h3>🔐 Customer Login</h3>
            <p>Access your account and rewards. Authentication system needs your testing skills!</p>
            <span class="card-badge badge-hard">Lab 3</span>
          </a>
        </div>

        <div class="footer">
          <p>💻 ShopTech Electronics • 789 Tech Avenue, Silicon Valley • (555) 987-6543</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Example page - Product Catalog with DevTools Discovery
app.get('/example', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ShopTech Product Catalog</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛍️ ShopTech Product Catalog</h1>
          <p class="subtitle">Example: Discover Our Products</p>
        </div>

        <div class="welcome-section">
          <h2>Featured Electronics</h2>
          <p>Browse our selection of premium tech products. All items ship free within 2-3 business days.</p>
          
          <div class="hint-box" style="margin-top: 20px;">
            <strong>�� Discovery Tip:</strong> Use browser DevTools (F12 → Network tab) to explore how this page loads product data.
          </div>
        </div>

        <div id="products-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:20px; margin:30px 0;">
          <div style="text-align:center; padding:40px; color:#999;">Loading products...</div>
        </div>

        <div class="back-link">
          <a href="/">← Back to Home</a>
        </div>
      </div>

      <script>
        // Auto-load product data on page load (visible in DevTools Network tab)
        window.addEventListener('DOMContentLoaded', async () => {
          try {
            // Make API calls in sequence (discoverable in DevTools)
            await fetch('/api/example/products');
            await fetch('/api/example/products/list');
            await fetch('/api/example/products/featured');
            const debugResp = await fetch('/api/example/products/debug');
            const debugData = await debugResp.json();
            
            // Display products from debug endpoint
            const grid = document.getElementById('products-grid');
            if (debugData.products && debugData.products.length > 0) {
              grid.innerHTML = debugData.products.map(p => \`
                <div class="card">
                  <h3>\${p.name}</h3>
                  <p style="font-size:1.5em; color:#667eea; font-weight:bold;">$\${p.price}</p>
                  <p style="color:#666; font-size:0.9em;">\${p.category}</p>
                  <p style="color:#999; font-size:0.85em;">SKU: \${p.sku}</p>
                  <p style="color:#f39c12;">⭐ \${p.rating}/5</p>
                </div>
              \`).join('');
            }
          } catch (error) {
            document.getElementById('products-grid').innerHTML = 
              '<div style="color:red; padding:20px;">Error loading products</div>';
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Example API - Part 1: Initial products endpoint
app.get('/api/example/products', (req, res) => {
  res.json({
    success: true,
    message: 'Part 1/4: Basic product endpoint',
    hint: 'Try /api/example/products/list for more details',
    count: products.length
  });
});

// Example API - Part 2: Product list
app.get('/api/example/products/list', (req, res) => {
  res.json({
    success: true,
    message: 'Part 2/4: Product list endpoint',
    hint: 'Check /api/example/products/featured for special items',
    products: products.slice(0, 4).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price
    }))
  });
});

// Example API - Part 3: Featured products
app.get('/api/example/products/featured', (req, res) => {
  res.json({
    success: true,
    message: 'Part 3/4: Featured products',
    hint: 'There might be a debug endpoint with more information',
    featured: products.filter(p => p.rating >= 4.7)
  });
});

// Example API - Part 4: Debug endpoint with flag
app.get('/api/example/products/debug', (req, res) => {
  res.json({
    success: true,
    message: 'Part 4/4: Debug endpoint found!',
    flag: 'NSA{D3BUG_PR0DUCTS_F0UND}',
    products: products,
    debug_info: {
      database: 'shoptech_prod',
      version: '1.2.3',
      api_endpoints: [
        '/api/search',
        '/api/filter',
        '/api/process-image'
      ]
    }
  });
});

// Lab 1 - Secure Menu Search (EASY - demonstrates proper implementation)
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
            <strong>💡 Discovery Tip:</strong> The search API is at <code>/api/search?q=</code><br>
            Try searching for normal products first, then test with special characters like <code>'</code> or <code>"</code> to see how errors are handled.
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

// Lab 2 - NoSQL Injection via Product Filters
app.get('/lab2', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Advanced Filters - ShopTech</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Advanced Product Filters</h1>
          <p class="subtitle">Lab 2: Refine Your Search</p>
        </div>

        <div class="welcome-section">
          <h2>Filter Products</h2>
          <p>Use our advanced filtering system to find exactly what you need.</p>
          
          <div style="margin-top: 30px; background: #f8f9fa; padding: 25px; border-radius: 10px;">
            <div style="margin-bottom: 20px;">
              <label style="display:block; margin-bottom:8px; font-weight:600;">Price Range:</label>
              <input type="number" id="price-min" placeholder="Min" style="width:45%; padding:10px; border:2px solid #ddd; border-radius:5px;">
              <input type="number" id="price-max" placeholder="Max" style="width:45%; padding:10px; border:2px solid #ddd; border-radius:5px; margin-left:10px;">
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display:block; margin-bottom:8px; font-weight:600;">Category:</label>
              <select id="category" style="width:100%; padding:10px; border:2px solid #ddd; border-radius:5px;">
                <option value="">All Categories</option>
                <option value="audio">Audio</option>
                <option value="wearables">Wearables</option>
                <option value="accessories">Accessories</option>
                <option value="office">Office</option>
                <option value="video">Video</option>
                <option value="peripherals">Peripherals</option>
                <option value="storage">Storage</option>
              </select>
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display:block; margin-bottom:8px; font-weight:600;">Minimum Rating:</label>
              <input type="number" id="rating" min="1" max="5" step="0.1" placeholder="e.g., 4.5" style="width:100%; padding:10px; border:2px solid #ddd; border-radius:5px;">
            </div>
            
            <button onclick="applyFilters()" class="demo-button" style="width:100%; padding:15px; font-size:1.1em;">Apply Filters</button>
          </div>
          
          <div id="filter-results" style="margin-top: 30px;"></div>
          
          <div class="hint-box" style="margin-top: 30px;">
            <strong>💡 Discovery Tip:</strong> Open DevTools (F12 → Network tab) and apply a filter to see the request format.<br>
            The endpoint is <code>POST /api/filter</code> with JSON body. Try modifying the JSON to include MongoDB operators like <code>$gt</code>, <code>$ne</code>, or <code>$where</code>.
          </div>
        </div>

        <div class="back-link">
          <a href="/">← Back to Home</a>
        </div>
      </div>

      <script>
        async function applyFilters() {
          const resultsDiv = document.getElementById('filter-results');
          
          const filters = {
            price_min: document.getElementById('price-min').value,
            price_max: document.getElementById('price-max').value,
            category: document.getElementById('category').value,
            rating: document.getElementById('rating').value
          };
          
          resultsDiv.innerHTML = '<p style="color:#667eea;">Applying filters...</p>';
          
          try {
            const response = await fetch('/api/filter', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(filters)
            });
            
            const data = await response.json();
            
            if (data.flag) {
              resultsDiv.innerHTML = \`
                <div style="background:#e8f5e9; border-left:4px solid #2e7d32; padding:20px; border-radius:8px; margin-bottom:20px;">
                  <h3 style="color:#2e7d32;">🎯 Flag Found!</h3>
                  <p style="font-weight:bold; margin-top:10px;">\${data.flag}</p>
                  <p style="margin-top:10px;">\${data.message}</p>
                </div>
              \`;
            }
            
            if (data.results && data.results.length > 0) {
              resultsDiv.innerHTML += \`
                <h3 style="color:#667eea; margin-bottom:15px;">Found \${data.results.length} product(s):</h3>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(250px, 1fr)); gap:15px;">
                  \${data.results.map(p => \`
                    <div class="card">
                      <h4>\${p.name}</h4>
                      <p style="font-size:1.3em; color:#667eea; font-weight:bold;">$\${p.price}</p>
                      <p style="color:#666;">\${p.category}</p>
                      <p style="color:#f39c12;">⭐ \${p.rating}/5</p>
                    </div>
                  \`).join('')}
                </div>
              \`;
            } else if (!data.flag) {
              resultsDiv.innerHTML = '<p style="color:#999;">No products match your filters.</p>';
            }
          } catch (error) {
            resultsDiv.innerHTML = '<p style="color:#c62828;">Connection error: ' + error.message + '</p>';
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Lab 2 API - VULNERABLE: NoSQL Injection in filters
app.post('/api/filter', (req, res) => {
  const filters = req.body;
  
  // VULNERABLE: Accepts arbitrary JSON object that could contain NoSQL operators
  // In a real MongoDB scenario: db.products.find(filters) would execute injected operators
  
  // Detect NoSQL injection attempts
  const filterStr = JSON.stringify(filters);
  const hasNoSQLOperators = filterStr.includes('$gt') || filterStr.includes('$lt') || 
                            filterStr.includes('$ne') || filterStr.includes('$where') ||
                            filterStr.includes('$regex') || filterStr.includes('$in');
  
  if (hasNoSQLOperators) {
    // NoSQL injection detected - return all products with flag
    return res.json({
      success: true,
      flag: 'NSA{N0SQL_BYP4SS3D}',
      message: 'NoSQL injection detected! Query operators bypassed normal filtering logic.',
      injected_filter: filters,
      results: products,
      explanation: 'In a real MongoDB database, operators like $gt, $where, etc. can bypass intended query logic.'
    });
  }
  
  // Normal filtering logic
  let results = products;
  
  if (filters.price_min) {
    results = results.filter(p => p.price >= parseFloat(filters.price_min));
  }
  if (filters.price_max) {
    results = results.filter(p => p.price <= parseFloat(filters.price_max));
  }
  if (filters.category) {
    results = results.filter(p => p.category === filters.category);
  }
  if (filters.rating) {
    results = results.filter(p => p.rating >= parseFloat(filters.rating));
  }
  
  res.json({
    success: true,
    results: results,
    count: results.length,
    filters_applied: filters
  });
});

// Lab 3 - Command Injection via Image Processing
app.get('/lab3', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Image Processor - ShopTech</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🖼️ Product Image Processor</h1>
          <p class="subtitle">Lab 3: Optimize Your Images</p>
        </div>

        <div class="welcome-section">
          <h2>Image Processing Tool</h2>
          <p>Process and optimize product images for your catalog.</p>
          
          <div style="margin-top: 30px; background: #f8f9fa; padding: 25px; border-radius: 10px;">
            <div style="margin-bottom: 20px;">
              <label style="display:block; margin-bottom:8px; font-weight:600;">Image Filename:</label>
              <input type="text" id="filename" placeholder="e.g., product-001.jpg" style="width:100%; padding:12px; border:2px solid #ddd; border-radius:5px;">
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display:block; margin-bottom:8px; font-weight:600;">Operation:</label>
              <select id="operation" style="width:100%; padding:12px; border:2px solid #ddd; border-radius:5px;">
                <option value="resize">Resize</option>
                <option value="compress">Compress</option>
                <option value="convert">Convert Format</option>
                <option value="optimize">Optimize</option>
              </select>
            </div>
            
            <button onclick="processImage()" class="demo-button" style="width:100%; padding:15px; font-size:1.1em;">Process Image</button>
          </div>
          
          <div id="process-results" style="margin-top: 30px;"></div>
          
          <div class="hint-box" style="margin-top: 30px;">
            <strong>💡 Discovery Tip:</strong> The endpoint is <code>POST /api/process-image</code><br>
            Try injecting shell metacharacters in the filename: <code>;</code> <code>|</code> <code>&</code> <code>$()</code><br>
            Example: <code>test.jpg; ls -la</code>
          </div>
        </div>

        <div class="back-link">
          <a href="/">← Back to Home</a>
        </div>
      </div>

      <script>
        async function processImage() {
          const filename = document.getElementById('filename').value;
          const operation = document.getElementById('operation').value;
          const resultsDiv = document.getElementById('process-results');
          
          if (!filename) {
            resultsDiv.innerHTML = '<p style="color:#c62828;">Please enter a filename</p>';
            return;
          }
          
          resultsDiv.innerHTML = '<p style="color:#667eea;">Processing image...</p>';
          
          try {
            const response = await fetch('/api/process-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filename, operation })
            });
            
            const data = await response.json();
            
            if (data.flag) {
              resultsDiv.innerHTML = \`
                <div style="background:#e8f5e9; border-left:4px solid #2e7d32; padding:20px; border-radius:8px;">
                  <h3 style="color:#2e7d32;">🎯 Command Injection Detected!</h3>
                  <p style="font-weight:bold; margin-top:10px;">\${data.flag}</p>
                  <pre style="background:#fff; padding:15px; border-radius:5px; margin-top:15px; overflow-x:auto; font-size:0.9em;">\${data.output || data.message}</pre>
                </div>
              \`;
            } else if (data.success) {
              resultsDiv.innerHTML = \`
                <div style="background:#e3f2fd; border-left:4px solid #1976d2; padding:20px; border-radius:8px;">
                  <h3 style="color:#1976d2;">✓ Processing Complete</h3>
                  <p style="margin-top:10px;">\${data.message}</p>
                  <p style="color:#666; font-size:0.9em; margin-top:10px;">Output: \${data.output_file}</p>
                </div>
              \`;
            } else {
              resultsDiv.innerHTML = \`<p style="color:#c62828;">\${data.error || 'Processing failed'}</p>\`;
            }
          } catch (error) {
            resultsDiv.innerHTML = '<p style="color:#c62828;">Connection error: ' + error.message + '</p>';
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Lab 3 API - VULNERABLE: Command Injection in image processing
app.post('/api/process-image', (req, res) => {
  const { filename, operation } = req.body;
  
  if (!filename || !operation) {
    return res.status(400).json({
      error: 'Missing required parameters: filename and operation'
    });
  }
  
  // VULNERABLE: Command injection through unsanitized input
  // In reality, this would use child_process.exec() with unsanitized input
  const commandInjectionChars = [';', '|', '&', '$', '`', '\n', '(', ')', '<', '>'];
  const hasInjection = commandInjectionChars.some(char => filename.includes(char) || operation.includes(char));
  
  if (hasInjection) {
    // Simulate command injection execution
    const simulatedCommand = `convert ${filename} -${operation} output.jpg`;
    
    return res.json({
      success: true,
      flag: 'NSA{C0MM4ND_1NJ3CT3D}',
      message: 'Command injection detected! System commands were executed.',
      vulnerable_command: simulatedCommand,
      output: `Simulated command execution:
$ ${simulatedCommand}

uid=33(www-data) gid=33(www-data) groups=33(www-data)
/var/www/shoptech
total 24K
drwxr-xr-x 5 www-data www-data 4.0K Jan 22 10:30 .
drwxr-xr-x 3 root     root     4.0K Jan 15 14:20 ..
-rw-r--r-- 1 www-data www-data  156 Jan 22 09:45 .env
drwxr-xr-x 2 www-data www-data 4.0K Jan 22 10:15 uploads
-rw------- 1 www-data www-data 2.1K Jan 20 16:30 database.key

WARNING: Command injection allows arbitrary system command execution!`,
      explanation: 'Characters like ; | & $ allow chaining or substituting system commands, leading to complete server compromise.'
    });
  }
  
  // Normal image processing (simulated)
  const operations = {
    'resize': 'Resized to 800x600',
    'compress': 'Compressed to 85% quality',
    'convert': 'Converted to WebP format',
    'optimize': 'Optimized file size'
  };
  
  res.json({
    success: true,
    message: `Image processing complete: ${operations[operation] || 'Processed'}`,
    input_file: filename,
    output_file: `processed_${filename}`,
    operation: operation
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🛍️  ShopTech E-Commerce Platform       ║
║   Server running on port ${PORT}              ║
║                                            ║
║   Access: http://localhost:${PORT}            ║
╚════════════════════════════════════════════╝

Available pages:
  http://localhost:${PORT}/ - Home
  http://localhost:${PORT}/example - Product Catalog Discovery
  http://localhost:${PORT}/lab1 - Lab 1: SQL Injection Search
  http://localhost:${PORT}/lab2 - Lab 2: NoSQL Filter Injection
  http://localhost:${PORT}/lab3 - Lab 3: Command Injection
`);
});
