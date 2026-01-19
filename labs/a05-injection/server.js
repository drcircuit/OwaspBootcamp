const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const smoothies = [
  { id: 1, name: 'Green Detox', price: 7.99, category: 'wellness', calories: 180, ingredients: 'spinach, kale, pineapple, banana, coconut water' },
  { id: 2, name: 'Berry Blast', price: 6.99, category: 'classic', calories: 220, ingredients: 'strawberry, blueberry, raspberry, yogurt, honey' },
  { id: 3, name: 'Tropical Paradise', price: 7.49, category: 'tropical', calories: 240, ingredients: 'mango, pineapple, passionfruit, orange juice' },
  { id: 4, name: 'Protein Power', price: 8.99, category: 'fitness', calories: 320, ingredients: 'banana, peanut butter, whey protein, almond milk, oats' },
  { id: 5, name: 'Acai Bowl', price: 9.99, category: 'bowls', calories: 350, ingredients: 'acai, banana, granola, coconut, honey' },
  { id: 6, name: 'Mango Tango', price: 6.99, category: 'tropical', calories: 210, ingredients: 'mango, banana, orange juice, turmeric' },
  { id: 7, name: 'Chocolate Bliss', price: 7.99, category: 'indulgent', calories: 380, ingredients: 'cacao, banana, dates, almond milk, vanilla' },
  { id: 8, name: 'Immunity Boost', price: 8.49, category: 'wellness', calories: 190, ingredients: 'orange, ginger, carrot, lemon, turmeric' }
];

const customers = [
  { id: 1, email: 'admin@freshblend.com', password: 'FreshAdmin2024!', name: 'Sarah Manager', role: 'admin', rewards_points: 850, favorite: 'Protein Power' },
  { id: 2, email: 'john.doe@email.com', password: 'Berry123', name: 'John Doe', role: 'customer', rewards_points: 120, favorite: 'Berry Blast' },
  { id: 3, email: 'fitness_jen@email.com', password: 'Healthy2024', name: 'Jennifer Smith', role: 'customer', rewards_points: 340, favorite: 'Green Detox' },
  { id: 4, email: 'mike_tropical@email.com', password: 'Sunshine99', name: 'Mike Johnson', role: 'customer', rewards_points: 75, favorite: 'Tropical Paradise' }
];

// FreshBlend Smoothie Bar theme styles
const styles = `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #fff5e6 0%, #ffe4f0 100%);
      color: #333;
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 15px;
      padding: 40px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #ff6b9d;
    }
    h1 {
      color: #ff6b9d;
      margin-bottom: 10px;
      font-size: 2.8em;
      font-weight: 700;
    }
    .tagline {
      color: #4caf50;
      font-size: 1.2em;
      font-style: italic;
    }
    h2 {
      color: #4caf50;
      margin-top: 30px;
      margin-bottom: 15px;
      border-bottom: 2px solid #4caf50;
      padding-bottom: 10px;
      font-size: 1.8em;
    }
    h3 {
      color: #ff6b9d;
      margin-top: 20px;
      margin-bottom: 10px;
      font-size: 1.4em;
    }
    p, li {
      line-height: 1.8;
      margin-bottom: 10px;
      color: #555;
    }
    .nav-links {
      display: flex;
      gap: 15px;
      margin: 25px 0;
      flex-wrap: wrap;
      justify-content: center;
    }
    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 25px;
      transition: all 0.3s;
      background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
      box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
      font-weight: 600;
    }
    .nav-links a:hover {
      background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
      box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
      transform: translateY(-2px);
    }
    .danger {
      background: #fff3e0;
      border-left: 5px solid #ff9800;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .danger h3 {
      color: #ff9800;
    }
    .safe {
      background: #e8f5e9;
      border-left: 5px solid #4caf50;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .safe h3 {
      color: #4caf50;
    }
    pre {
      background: #f5f5f5;
      color: #333;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #ddd;
      overflow-x: auto;
      margin: 10px 0;
      font-family: 'Consolas', 'Monaco', monospace;
    }
    code {
      background: #f5f5f5;
      color: #d32f2f;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Consolas', 'Monaco', monospace;
    }
    .lab-info {
      background: #e3f2fd;
      border-left: 5px solid #2196f3;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .flag {
      color: #ff6b9d;
      font-weight: bold;
      font-size: 1.2em;
    }
    input, textarea {
      background: white;
      color: #333;
      border: 2px solid #ddd;
      padding: 12px;
      border-radius: 8px;
      font-family: 'Segoe UI', sans-serif;
      width: 100%;
      max-width: 500px;
      margin: 10px 0;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: #4caf50;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
    }
    .endpoint {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 15px;
      border-radius: 8px;
      margin: 10px 0;
      color: #555;
      font-family: 'Consolas', monospace;
    }
    ul {
      margin-left: 25px;
      margin-top: 10px;
    }
    .section {
      margin: 30px 0;
    }
    .smoothie-card {
      background: linear-gradient(135deg, #fff 0%, #f8f8f8 100%);
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 15px;
      margin: 10px 0;
    }
    .price {
      color: #4caf50;
      font-weight: bold;
      font-size: 1.3em;
    }
  </style>
`;

// Home page - Navigation
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>FreshBlend Smoothie Bar - Online Ordering</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🥤 FreshBlend Smoothie Bar</h1>
          <p class="tagline">Fresh. Healthy. Delicious.</p>
        </div>
        
        <p style="text-align: center; font-size: 1.1em; margin-bottom: 30px;">
          Welcome to FreshBlend! Order your favorite smoothies online for pickup or delivery. 
          Browse our menu, search for your favorites, and manage your account.
        </p>
        
        <div class="nav-links">
          <a href="/menu">🍹 Full Menu</a>
          <a href="/search">🔍 Search Menu</a>
          <a href="/advanced-search">🔬 Advanced Search</a>
          <a href="/login">👤 Customer Login</a>
          <a href="/example">📚 About SQL & Security</a>
        </div>

        <div class="section">
          <h2>Featured Smoothies</h2>
          <div class="smoothie-card">
            <h3>🥬 Green Detox</h3>
            <p>Spinach, kale, pineapple, banana, coconut water</p>
            <p class="price">$7.99</p>
          </div>
          <div class="smoothie-card">
            <h3>🍓 Berry Blast</h3>
            <p>Strawberry, blueberry, raspberry, yogurt, honey</p>
            <p class="price">$6.99</p>
          </div>
          <div class="smoothie-card">
            <h3>💪 Protein Power</h3>
            <p>Banana, peanut butter, whey protein, almond milk, oats</p>
            <p class="price">$8.99</p>
          </div>
        </div>

        <div class="lab-info">
          <h3>🎓 Educational Resource</h3>
          <p>This site is also used for security training demonstrations. Check out our "About SQL & Security" page to learn about database security best practices.</p>
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
      <title>FreshBlend - SQL & Security Education</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📚 SQL Security Education</h1>
          <p class="tagline">Understanding Database Security for Web Applications</p>
        </div>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
        </div>

        <div class="section">
          <h2>What is SQL Injection?</h2>
          <p>SQL Injection is a code injection technique that exploits security vulnerabilities in an application's database layer. As a smoothie shop with an online ordering system, we take database security seriously. Here's what attackers could potentially do:</p>
          <ul>
            <li>Bypass customer authentication systems</li>
            <li>Access customer data including emails and order history</li>
            <li>Modify or delete menu items and pricing</li>
            <li>Retrieve business-sensitive information</li>
          </ul>
        </div>

        <div class="section danger">
          <h3>❌ VULNERABLE: String Concatenation</h3>
          <p>A common vulnerability in web applications occurs when customer input is directly concatenated into SQL queries:</p>
          <pre>
// Vulnerable Node.js code (smoothie search example)
app.get('/search', (req, res) => {
  const searchTerm = req.query.q;
  const sql = "SELECT * FROM smoothies WHERE name LIKE '%" + searchTerm + "%'";
  db.query(sql, (err, results) => {
    res.json(results);
  });
});</pre>
          <p><strong>Problem:</strong> Customer input is directly inserted into the SQL query without sanitization.</p>
          
          <h3>Common Attack Patterns:</h3>
          <pre>
1. OR 1=1 Attack (Always True):
   Input: ' OR '1'='1
   Result: SELECT * FROM smoothies WHERE name LIKE '%' OR '1'='1%'
   Effect: Returns all menu items instead of search results

2. UNION SELECT Attack (Data Extraction):
   Input: ' UNION SELECT email, password, rewards_points FROM customers--
   Result: Combines smoothie data with customer information
   Effect: Exposes customer accounts and personal data

3. Comment-based Bypass (Authentication):
   Input: admin@freshblend.com'--
   Result: SELECT * FROM customers WHERE email='admin@freshblend.com'--' AND password='...'
   Effect: Logs in without knowing the password

4. Stacked Queries (Dangerous):
   Input: '; DROP TABLE orders--
   Result: Executes multiple SQL commands
   Effect: Could delete entire order history</pre>
        </div>

        <div class="section safe">
          <h3>✅ SECURE: Parameterized Queries</h3>
          <p>The proper defense is using parameterized queries (prepared statements):</p>
          <pre>
// Secure Node.js code
app.get('/search', (req, res) => {
  const searchTerm = req.query.q;
  const sql = "SELECT * FROM smoothies WHERE name LIKE ?";
  db.query(sql, ['%' + searchTerm + '%'], (err, results) => {
    res.json(results);
  });
});</pre>
          <p><strong>Why this is safe:</strong> The database engine treats customer input as data, not as SQL code. Special characters are automatically escaped.</p>
          
          <h3>Other Defense Mechanisms:</h3>
          <ul>
            <li><strong>Input Validation:</strong> Whitelist allowed characters for search terms</li>
            <li><strong>Least Privilege:</strong> Database accounts should have minimal permissions</li>
            <li><strong>Error Handling:</strong> Don't expose database errors to customers</li>
            <li><strong>Web Application Firewall (WAF):</strong> Filter malicious requests</li>
            <li><strong>Regular Security Audits:</strong> Test systems for vulnerabilities</li>
          </ul>
        </div>

        <div class="section">
          <h2>🛠️ Testing Tools for Security Professionals</h2>
          
          <h3>1. sqlmap (Automated SQL Injection Tool)</h3>
          <pre>
# Test a smoothie search endpoint
sqlmap -u "http://freshblend.com/search?q=berry"

# Test login form with POST data
sqlmap -u "http://freshblend.com/login" --data="email=test&password=test"

# Extract database information
sqlmap -u "http://freshblend.com/search?q=berry" --dump</pre>
          
          <h3>2. Burp Suite (Manual Testing)</h3>
          <ul>
            <li>Intercept customer requests using Burp Proxy</li>
            <li>Send to Repeater for manual manipulation of search terms</li>
            <li>Test different payloads on menu search and login forms</li>
            <li>Use Intruder for automated payload testing</li>
            <li>Analyze response times and error messages</li>
          </ul>
          
          <h3>3. Manual Testing Techniques</h3>
          <pre>
# Step 1: Identify injection points
Test search with: berry'
Look for: SQL errors, unexpected behavior

# Step 2: Confirm vulnerability
Test with: ' OR '1'='1
Result: Should return unexpected data

# Step 3: Extract information
' UNION SELECT email, password, NULL FROM customers--

# Step 4: Boolean-based testing
' AND 1=1--  (should work normally)
' AND 1=2--  (should behave differently)</pre>
        </div>

        <div class="section">
          <h2>🎯 Real-World Example: E-commerce Authentication</h2>
          
          <h3>Customer Login Bypass</h3>
          <pre>
Vulnerable login query:
SELECT * FROM customers WHERE email='USER_INPUT' AND password='USER_INPUT'

Attack payload for email field:
admin@freshblend.com'--

Result:
SELECT * FROM customers WHERE email='admin@freshblend.com'--' AND password='...'
(Password check is commented out, granting access)</pre>

          <h3>Menu Search Exploitation</h3>
          <pre>
Vulnerable search query:
SELECT * FROM smoothies WHERE name LIKE '%USER_INPUT%'

Attack payload:
' UNION SELECT email, password, rewards_points FROM customers--

Result:
Combines smoothie menu with customer credentials in search results</pre>
        </div>

        <div class="lab-info">
          <h3>📝 Key Takeaways for Developers</h3>
          <ul>
            <li>Never trust user input - always validate and sanitize</li>
            <li>Use parameterized queries for all database interactions</li>
            <li>Apply principle of least privilege to database accounts</li>
            <li>Implement proper error handling that doesn't leak information</li>
            <li>Regular penetration testing identifies vulnerabilities before attackers do</li>
            <li>Protect customer data - it's both a legal and ethical responsibility</li>
          </ul>
        </div>

        <div class="section">
          <p><strong>Note:</strong> This educational resource is provided alongside FreshBlend's ordering portal to help demonstrate secure coding practices. The examples shown here are for training purposes only.</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Full menu page
app.get('/menu', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>FreshBlend - Our Menu</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍹 Our Smoothie Menu</h1>
          <p class="tagline">Handcrafted with fresh, organic ingredients</p>
        </div>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/search">🔍 Search Menu</a>
        </div>

        <div class="section">
          <h2>Wellness Collection</h2>
          ${smoothies.filter(s => s.category === 'wellness').map(s => `
            <div class="smoothie-card">
              <h3>${s.name}</h3>
              <p>${s.ingredients}</p>
              <p style="color: #888;">${s.calories} cal</p>
              <p class="price">$${s.price}</p>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>Classic Favorites</h2>
          ${smoothies.filter(s => s.category === 'classic').map(s => `
            <div class="smoothie-card">
              <h3>${s.name}</h3>
              <p>${s.ingredients}</p>
              <p style="color: #888;">${s.calories} cal</p>
              <p class="price">$${s.price}</p>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>Tropical Blends</h2>
          ${smoothies.filter(s => s.category === 'tropical').map(s => `
            <div class="smoothie-card">
              <h3>${s.name}</h3>
              <p>${s.ingredients}</p>
              <p style="color: #888;">${s.calories} cal</p>
              <p class="price">$${s.price}</p>
            </div>
          `).join('')}
        </div>

        <div class="section">
          <h2>Fitness & Protein</h2>
          ${smoothies.filter(s => s.category === 'fitness').map(s => `
            <div class="smoothie-card">
              <h3>${s.name}</h3>
              <p>${s.ingredients}</p>
              <p style="color: #888;">${s.calories} cal</p>
              <p class="price">$${s.price}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 1 - Search Menu (appears as normal feature)
app.get('/search', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>FreshBlend - Search Menu</title>
      ${styles}
      <script>
        async function searchMenu() {
          const query = document.getElementById('searchInput').value;
          const resultsDiv = document.getElementById('results');
          
          if (!query) {
            resultsDiv.innerHTML = '<p style="color: #888;">Please enter a search term</p>';
            return;
          }
          
          resultsDiv.innerHTML = '<p style="color: #888;">Searching...</p>';
          
          try {
            const response = await fetch('/api/search?q=' + encodeURIComponent(query));
            const data = await response.json();
            
            if (data.success && data.results.length > 0) {
              resultsDiv.innerHTML = '<h3>Search Results:</h3>' + 
                data.results.map(item => \`
                  <div class="smoothie-card">
                    <h3>\${item.name}</h3>
                    <p>\${item.ingredients}</p>
                    <p style="color: #888;">\${item.calories} cal</p>
                    <p class="price">$\${item.price}</p>
                  </div>
                \`).join('');
            } else if (data.success && data.results.length === 0) {
              resultsDiv.innerHTML = '<p style="color: #888;">No smoothies found matching your search.</p>';
            } else {
              resultsDiv.innerHTML = '<p style="color: #888;">Please try your search again.</p>';
            }
          } catch (error) {
            resultsDiv.innerHTML = '<p style="color: #d32f2f;">Error searching menu. Please try again.</p>';
          }
        }
        
        function handleKeyPress(event) {
          if (event.key === 'Enter') {
            searchMenu();
          }
        }
      </script>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔍 Search Our Menu</h1>
          <p class="tagline">Find your perfect smoothie</p>
        </div>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/menu">🍹 Full Menu</a>
        </div>

        <div class="section">
          <h2>Search for Smoothies</h2>
          <p>Search by name, ingredient, or category to find your favorite blend!</p>
          
          <div style="margin: 20px 0;">
            <input 
              type="text" 
              id="searchInput" 
              placeholder="Try 'berry', 'protein', 'tropical'..." 
              onkeypress="handleKeyPress(event)"
              style="max-width: 100%; width: 600px;"
            >
            <br>
            <button 
              onclick="searchMenu()" 
              style="
                margin-top: 15px;
                padding: 12px 30px;
                background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 1.1em;
                cursor: pointer;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
              "
            >
              Search Menu
            </button>
          </div>
          
          <div id="results" style="margin-top: 30px;"></div>
        </div>

        <div class="section">
          <h3>Popular Searches</h3>
          <p>Try searching for: berry, green, protein, tropical, chocolate, mango</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 1 API - Search menu (flag only in API response)
app.get('/api/search', (req, res) => {
  const query = req.query.q || '';
  
  if (query) {
    const results = smoothies.filter(s => 
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase()) ||
      s.ingredients.toLowerCase().includes(query.toLowerCase())
    );
    res.json({
      success: true,
      message: 'Search completed',
      query: query,
      results: results,
      flag: 'FRESHBLEND{M3NU_S34RCH_W0RK1NG}',
      debug: 'Database query executed successfully'
    });
  } else {
    res.json({
      success: false,
      message: 'Please provide a search term',
      example: '/api/search?q=berry'
    });
  }
});

// Lab 2 - Advanced Search (less obvious vulnerability)
app.get('/advanced-search', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>FreshBlend - Advanced Search</title>
      ${styles}
      <script>
        async function advancedSearch() {
          const query = document.getElementById('advSearchInput').value;
          const category = document.getElementById('categorySelect').value;
          const resultsDiv = document.getElementById('advResults');
          
          if (!query && !category) {
            resultsDiv.innerHTML = '<p style="color: #888;">Please enter a search term or select a category</p>';
            return;
          }
          
          resultsDiv.innerHTML = '<p style="color: #888;">Searching...</p>';
          
          try {
            let url = '/api/advanced-search?';
            if (query) url += 'q=' + encodeURIComponent(query);
            if (category) url += (query ? '&' : '') + 'category=' + encodeURIComponent(category);
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.error) {
              resultsDiv.innerHTML = \`
                <div style="background: #ffebee; border-left: 5px solid #d32f2f; padding: 15px; border-radius: 8px;">
                  <h3 style="color: #d32f2f;">Search Error</h3>
                  <p style="color: #555;">\${data.message}</p>
                  <p style="color: #888; font-size: 0.9em; font-family: monospace;">\${data.details || ''}</p>
                </div>
              \`;
            } else if (data.success && data.results.length > 0) {
              resultsDiv.innerHTML = '<h3>Search Results:</h3>' + 
                data.results.map(item => \`
                  <div class="smoothie-card">
                    <h3>\${item.name}</h3>
                    <p>\${item.ingredients}</p>
                    <p style="color: #888;">\${item.calories} cal | \${item.category}</p>
                    <p class="price">$\${item.price}</p>
                  </div>
                \`).join('');
            } else if (data.success && data.results.length === 0) {
              resultsDiv.innerHTML = '<p style="color: #888;">No smoothies found matching your criteria.</p>';
            }
          } catch (error) {
            resultsDiv.innerHTML = '<p style="color: #d32f2f;">Network error. Please try again.</p>';
          }
        }
        
        function handleAdvKeyPress(event) {
          if (event.key === 'Enter') {
            advancedSearch();
          }
        }
      </script>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔬 Advanced Menu Search</h1>
          <p class="tagline">Refined search with filters and options</p>
        </div>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/search">🔍 Basic Search</a>
        </div>

        <div class="section">
          <h2>Advanced Search Options</h2>
          <p>Search with additional filters to find exactly what you're looking for!</p>
          
          <div style="margin: 20px 0;">
            <label style="display: block; margin-bottom: 10px; font-weight: 600;">Search Term:</label>
            <input 
              type="text" 
              id="advSearchInput" 
              placeholder="Enter smoothie name or ingredient..." 
              onkeypress="handleAdvKeyPress(event)"
              style="max-width: 100%; width: 600px;"
            >
            
            <label style="display: block; margin-top: 20px; margin-bottom: 10px; font-weight: 600;">Category Filter:</label>
            <select 
              id="categorySelect" 
              style="
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 8px;
                font-size: 1em;
                width: 300px;
                background: white;
              "
            >
              <option value="">All Categories</option>
              <option value="wellness">Wellness</option>
              <option value="classic">Classic</option>
              <option value="tropical">Tropical</option>
              <option value="fitness">Fitness</option>
              <option value="bowls">Bowls</option>
              <option value="indulgent">Indulgent</option>
            </select>
            
            <br>
            <button 
              onclick="advancedSearch()" 
              style="
                margin-top: 20px;
                padding: 12px 30px;
                background: linear-gradient(135deg, #ff6b9d 0%, #ff5588 100%);
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 1.1em;
                cursor: pointer;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(255, 107, 157, 0.3);
              "
            >
              Search with Filters
            </button>
          </div>
          
          <div id="advResults" style="margin-top: 30px;"></div>
        </div>

        <div class="section">
          <h3>Search Tips</h3>
          <ul>
            <li>Use the category filter to narrow down results</li>
            <li>Search terms can match smoothie names or ingredients</li>
            <li>Leave fields blank to show all items in a category</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 2 API - Advanced search (flag only when SQL injection detected)
app.get('/api/advanced-search', (req, res) => {
  const query = req.query.q || '';
  const category = req.query.category || '';
  
  const simulatedSQL = `SELECT * FROM smoothies WHERE name LIKE '%${query}%' AND category LIKE '%${category}%'`;
  
  // Check for SQL injection attempt (less obvious detection)
  if (query.includes("'") || query.includes('"') || query.includes('--')) {
    res.json({
      error: 'Database query error',
      message: 'An error occurred while processing your search',
      details: `Syntax error in SQL statement: near '${query}' in WHERE clause`,
      query_debug: simulatedSQL,
      flag: 'FRESHBLEND{SQL_3RR0R_D3T3CT3D}',
      technical_info: 'SQL injection pattern detected in search parameters'
    });
  } else {
    let results = smoothies;
    
    if (query) {
      results = results.filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.ingredients.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (category) {
      results = results.filter(s => 
        s.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    res.json({
      success: true,
      query: simulatedSQL,
      results: results,
      total: results.length
    });
  }
});

// Lab 3 - Customer Login (requires actual exploitation)
app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>FreshBlend - Customer Login</title>
      ${styles}
      <script>
        async function customerLogin() {
          const email = document.getElementById('emailInput').value;
          const password = document.getElementById('passwordInput').value;
          const messageDiv = document.getElementById('loginMessage');
          
          if (!email || !password) {
            messageDiv.innerHTML = '<p style="color: #d32f2f;">Please enter both email and password</p>';
            return;
          }
          
          messageDiv.innerHTML = '<p style="color: #888;">Authenticating...</p>';
          
          try {
            const response = await fetch('/api/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
              messageDiv.innerHTML = \`
                <div style="background: #e8f5e9; border-left: 5px solid #4caf50; padding: 20px; border-radius: 8px;">
                  <h3 style="color: #4caf50;">✓ Login Successful!</h3>
                  <p style="color: #555;"><strong>Welcome, \${data.customer.name}!</strong></p>
                  <p style="color: #555;">Email: \${data.customer.email}</p>
                  <p style="color: #555;">Rewards Points: \${data.customer.rewards_points}</p>
                  <p style="color: #555;">Favorite: \${data.customer.favorite}</p>
                  \${data.flag ? '<p class="flag">🎉 FLAG: ' + data.flag + '</p>' : ''}
                </div>
              \`;
            } else {
              messageDiv.innerHTML = \`
                <div style="background: #ffebee; border-left: 5px solid #d32f2f; padding: 15px; border-radius: 8px;">
                  <h3 style="color: #d32f2f;">Login Failed</h3>
                  <p style="color: #555;">\${data.message}</p>
                </div>
              \`;
            }
          } catch (error) {
            messageDiv.innerHTML = '<p style="color: #d32f2f;">Network error. Please try again.</p>';
          }
        }
        
        function handleLoginKeyPress(event) {
          if (event.key === 'Enter') {
            customerLogin();
          }
        }
      </script>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>👤 Customer Login</h1>
          <p class="tagline">Access your account and rewards</p>
        </div>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
        </div>

        <div class="section">
          <h2>Sign In to Your Account</h2>
          <p>Login to view your order history, manage rewards points, and save your favorite smoothies!</p>
          
          <div style="margin: 30px 0;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Email Address:</label>
            <input 
              type="email" 
              id="emailInput" 
              placeholder="your.email@example.com" 
              onkeypress="handleLoginKeyPress(event)"
              style="max-width: 100%; width: 500px;"
            >
            
            <label style="display: block; margin-top: 20px; margin-bottom: 8px; font-weight: 600;">Password:</label>
            <input 
              type="password" 
              id="passwordInput" 
              placeholder="Enter your password" 
              onkeypress="handleLoginKeyPress(event)"
              style="max-width: 100%; width: 500px;"
            >
            
            <br>
            <button 
              onclick="customerLogin()" 
              style="
                margin-top: 25px;
                padding: 14px 40px;
                background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 1.1em;
                cursor: pointer;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
              "
            >
              Sign In
            </button>
          </div>
          
          <div id="loginMessage" style="margin-top: 30px;"></div>
        </div>

        <div class="section">
          <h3>Test Account (for demo purposes)</h3>
          <p><strong>Email:</strong> john.doe@email.com</p>
          <p><strong>Password:</strong> Berry123</p>
        </div>

        <div class="section">
          <h3>Benefits of Having an Account</h3>
          <ul>
            <li>🎁 Earn rewards points with every purchase</li>
            <li>⭐ Save your favorite smoothie orders</li>
            <li>📦 Quick reordering from your history</li>
            <li>🎉 Exclusive member discounts and promotions</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 3 API - Customer login (vulnerable to SQL injection)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.json({
      success: false,
      message: 'Email and password are required'
    });
  }

  const simulatedSQL = `SELECT * FROM customers WHERE email='${email}' AND password='${password}'`;
  
  // Vulnerable to SQL injection
  if (email.includes("' OR '1'='1") || 
      email.includes("' OR 1=1") ||
      password.includes("' OR '1'='1") ||
      password.includes("' OR 1=1") ||
      (email.includes("'") && email.includes("--"))) {
    
    return res.json({
      success: true,
      message: 'Authentication successful',
      flag: 'FRESHBLEND{4UTH_BYP4SS_SUCC3SS}',
      customer: {
        email: 'admin@freshblend.com',
        name: 'Sarah Manager',
        role: 'admin',
        rewards_points: 850,
        favorite: 'Protein Power',
        id: 1
      },
      sql_injection: true,
      query_executed: simulatedSQL,
      exploitation_note: 'SQL injection used to bypass authentication'
    });
  }
  
  // Normal authentication
  const customer = customers.find(c => c.email === email && c.password === password);
  
  if (customer) {
    const { password, ...customerData } = customer;
    res.json({
      success: true,
      message: 'Login successful',
      customer: customerData
    });
  } else {
    res.json({
      success: false,
      message: 'Invalid email or password. Please try again.',
      query_executed: simulatedSQL
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FreshBlend Smoothie Bar - Online Ordering Portal`);
  console.log(`Server running on port ${PORT}`);
  console.log('');
  console.log('Available pages:');
  console.log('  http://localhost:3005/ - Home');
  console.log('  http://localhost:3005/menu - Full Menu');
  console.log('  http://localhost:3005/search - Search Menu');
  console.log('  http://localhost:3005/advanced-search - Advanced Search');
  console.log('  http://localhost:3005/login - Customer Login');
  console.log('  http://localhost:3005/example - SQL Security Education');
});
