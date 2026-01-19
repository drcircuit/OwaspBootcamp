const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

// Shared styles for FreshBlend Smoothie Bar theme
const styles = `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #fff5e6 0%, #ffe4f0 100%);
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
      color: #ff6b9d;
      font-size: 2.5em;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .subtitle { color: #4caf50; font-size: 1.2em; }
    .welcome-section {
      background: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      margin-bottom: 30px;
    }
    .welcome-section h2 {
      color: #ff6b9d;
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
      border-left: 4px solid #ff6b9d;
    }
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    }
    .card h3 { color: #ff6b9d; margin-bottom: 15px; font-size: 1.4em; }
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
      <title>FreshBlend Smoothie Bar</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🥤 FreshBlend Smoothie Bar</h1>
          <p class="subtitle">Fresh. Healthy. Delicious.</p>
        </div>
        
        <div class="welcome-section">
          <h2>Welcome to FreshBlend!</h2>
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
          <p>🥤 FreshBlend Smoothie Bar • 789 Health Street • (555) 987-6543</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Example page - Interactive SQL Injection Tutorial
app.get('/example', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SQL Injection Tutorial - FreshBlend</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📚 SQL Injection Tutorial</h1>
          <p class="subtitle">Learn about injection vulnerabilities with interactive demos</p>
        </div>

        <!-- Part 1: Understanding SQL Queries -->
        <div class="tutorial-section">
          <h2>Part 1: Understanding SQL Queries 🔍</h2>
          <p>Learn how applications construct SQL queries and why string concatenation is dangerous.</p>
          
          <div class="tutorial-box">
            <h3>🎯 What is SQL Injection?</h3>
            <p>SQL injection occurs when user input is directly concatenated into SQL queries without proper sanitization. This allows attackers to manipulate the query structure.</p>
            <pre>// VULNERABLE CODE
const query = "SELECT * FROM smoothies WHERE name LIKE '%" + userInput + "%'";</pre>
            <p>If user enters: <code>berry' OR '1'='1</code></p>
            <p>The query becomes:</p>
            <pre>SELECT * FROM smoothies WHERE name LIKE '%berry' OR '1'='1%'</pre>
            <p>This returns ALL smoothies because <code>'1'='1'</code> is always true!</p>
          </div>

          <div class="interactive-demo">
            <h3>Try It: Safe vs Unsafe Queries</h3>
            <p>Test how different inputs affect SQL query construction. Open DevTools (F12 → Network tab) to see the requests!</p>
            <div class="demo-controls">
              <input type="text" id="part1-input" class="demo-input" placeholder="Try: berry, green, or berry' OR '1'='1" value="berry">
              <button onclick="part1Test()" class="demo-button">🔍 Test Query</button>
            </div>
            <div id="part1-output" class="output-box"></div>
            <div id="part1-flag" class="flag-reveal"></div>
          </div>

          <div class="hint-box">
            <strong>💡 DevTools Tip:</strong> Press F12, go to Network tab, and watch the API calls. You'll see the constructed query in the response!
          </div>
        </div>

        <!-- Part 2: Comment-Based Injection -->
        <div class="tutorial-section">
          <h2>Part 2: Comment-Based Injection 💬</h2>
          <p>SQL comments (<code>--</code> or <code>#</code>) can be used to truncate queries and bypass security checks.</p>
          
          <div class="tutorial-box">
            <h3>🎯 How Comments Work</h3>
            <p>SQL uses <code>--</code> for single-line comments. Everything after <code>--</code> is ignored!</p>
            <pre>// Original query:
SELECT * FROM customers WHERE email='user@email.com' AND password='pass123'

// With injection (email: admin@freshblend.com'-- ):
SELECT * FROM customers WHERE email='admin@freshblend.com'--' AND password='pass123'

// Becomes (password check commented out!):
SELECT * FROM customers WHERE email='admin@freshblend.com'</pre>
          </div>

          <div class="interactive-demo">
            <h3>Try It: Comment Injection</h3>
            <p>Try different payloads to see how SQL comments work:</p>
            <div class="demo-controls">
              <input type="text" id="part2-input" class="demo-input" placeholder="Try: admin@freshblend.com'--" value="test@email.com">
              <button onclick="part2Test()" class="demo-button">🧪 Test Comment</button>
            </div>
            <div id="part2-output" class="output-box"></div>
            <div id="part2-flag" class="flag-reveal"></div>
          </div>

          <div class="hint-box">
            <strong>💡 Tip:</strong> The <code>--</code> at the end comments out everything after it in the SQL query!
          </div>
        </div>

        <!-- Part 3: UNION Injection -->
        <div class="tutorial-section">
          <h2>Part 3: UNION SELECT Injection 🔗</h2>
          <p>UNION allows combining results from multiple SELECT statements, potentially exposing data from other tables.</p>
          
          <div class="tutorial-box">
            <h3>🎯 Understanding UNION</h3>
            <p>UNION combines results from two queries. Attackers can use this to extract data from other tables!</p>
            <pre>// Normal query:
SELECT name, price FROM smoothies WHERE category='wellness'

// With UNION injection:
' UNION SELECT username, password FROM customers--

// Becomes:
SELECT name, price FROM smoothies WHERE category='' 
UNION SELECT username, password FROM customers--'</pre>
            <p>This exposes customer data in the smoothie results!</p>
          </div>

          <div class="interactive-demo">
            <h3>Try It: UNION Injection</h3>
            <p>Test UNION-based injection (educational simulation):</p>
            <div class="demo-controls">
              <input type="text" id="part3-input" class="demo-input" placeholder="Try: ' UNION SELECT email, password FROM customers--" value="wellness">
              <button onclick="part3Test()" class="demo-button">🔍 Test UNION</button>
            </div>
            <div id="part3-output" class="output-box"></div>
            <div id="part3-flag" class="flag-reveal"></div>
          </div>

          <div class="hint-box">
            <strong>💡 Note:</strong> Real UNION attacks require matching column counts. This demo simulates the concept for educational purposes.
          </div>
        </div>

        <!-- Part 4: Prevention -->
        <div class="tutorial-section">
          <h2>Part 4: Prevention - Parameterized Queries ✅</h2>
          <p>The ONLY reliable defense against SQL injection is using parameterized queries (prepared statements).</p>
          
          <div class="tutorial-box">
            <h3>🎯 Secure Code Example</h3>
            <pre>// SECURE: Parameterized query
const query = 'SELECT * FROM smoothies WHERE name LIKE $1';
db.query(query, ['%' + userInput + '%'], (err, result) => {
  // User input is treated as DATA, never as SQL code
  res.json(result.rows);
});</pre>
            <p><strong>Why this works:</strong> The database driver escapes special characters and treats the input as a literal string value, not as SQL syntax.</p>
          </div>

          <div class="interactive-demo">
            <h3>Compare: Vulnerable vs Secure</h3>
            <p>See the difference between vulnerable and secure implementations:</p>
            <button onclick="part4Test()" class="demo-button">📊 View Comparison</button>
            <div id="part4-output" class="output-box" style="display:none;"></div>
            <div id="part4-flag" class="flag-reveal"></div>
          </div>

          <div class="hint-box">
            <strong>💡 Key Takeaway:</strong> ALWAYS use parameterized queries. Input validation is NOT enough to prevent SQL injection!
          </div>
        </div>

        <div class="back-link">
          <a href="/">← Back to Home</a>
        </div>
      </div>

      <script>
        // Part 1: Query Construction Demo
        async function part1Test() {
          const input = document.getElementById('part1-input').value;
          const output = document.getElementById('part1-output');
          const flagDiv = document.getElementById('part1-flag');
          
          output.textContent = 'Testing query construction...';
          flagDiv.style.display = 'none';
          
          try {
            const response = await fetch('/api/example/part1?input=' + encodeURIComponent(input));
            const data = await response.json();
            output.textContent = JSON.stringify(data, null, 2);
            
            if (data.flag) {
              flagDiv.textContent = '🎉 ' + data.flag + ' - ' + data.message;
              flagDiv.style.display = 'block';
            }
          } catch (error) {
            output.textContent = 'Error: ' + error.message;
          }
        }

        // Part 2: Comment Injection Demo
        async function part2Test() {
          const input = document.getElementById('part2-input').value;
          const output = document.getElementById('part2-output');
          const flagDiv = document.getElementById('part2-flag');
          
          output.textContent = 'Testing comment injection...';
          flagDiv.style.display = 'none';
          
          try {
            const response = await fetch('/api/example/part2?email=' + encodeURIComponent(input));
            const data = await response.json();
            output.textContent = JSON.stringify(data, null, 2);
            
            if (data.flag) {
              flagDiv.textContent = '🎉 ' + data.flag + ' - ' + data.message;
              flagDiv.style.display = 'block';
            }
          } catch (error) {
            output.textContent = 'Error: ' + error.message;
          }
        }

        // Part 3: UNION Injection Demo
        async function part3Test() {
          const input = document.getElementById('part3-input').value;
          const output = document.getElementById('part3-output');
          const flagDiv = document.getElementById('part3-flag');
          
          output.textContent = 'Testing UNION injection...';
          flagDiv.style.display = 'none';
          
          try {
            const response = await fetch('/api/example/part3?category=' + encodeURIComponent(input));
            const data = await response.json();
            output.textContent = JSON.stringify(data, null, 2);
            
            if (data.flag) {
              flagDiv.textContent = '🎉 ' + data.flag + ' - ' + data.message;
              flagDiv.style.display = 'block';
            }
          } catch (error) {
            output.textContent = 'Error: ' + error.message;
          }
        }

        // Part 4: Prevention Demo
        async function part4Test() {
          const output = document.getElementById('part4-output');
          const flagDiv = document.getElementById('part4-flag');
          
          output.style.display = 'block';
          output.textContent = 'Loading comparison...';
          flagDiv.style.display = 'none';
          
          try {
            const response = await fetch('/api/example/part4');
            const data = await response.json();
            output.textContent = JSON.stringify(data, null, 2);
            
            if (data.flag) {
              flagDiv.textContent = '🎉 ' + data.flag + ' - ' + data.message;
              flagDiv.style.display = 'block';
            }
          } catch (error) {
            output.textContent = 'Error: ' + error.message;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Example API endpoints
app.get('/api/example/part1', (req, res) => {
  const input = req.query.input || '';
  const vulnerableQuery = `SELECT * FROM smoothies WHERE name LIKE '%${input}%'`;
  const secureQuery = `SELECT * FROM smoothies WHERE name LIKE $1`;
  
  const sqlInjectionDetected = input.includes("'") || input.includes('"') || input.includes('--') || input.toLowerCase().includes(' or ');
  
  res.json({
    input: input,
    vulnerable_query: vulnerableQuery,
    secure_query: secureQuery,
    secure_parameter: '%' + input + '%',
    sql_injection_detected: sqlInjectionDetected,
    flag: sqlInjectionDetected ? 'FLAG{SQL_1NJ3CT10N_UND3RST00D}' : null,
    message: sqlInjectionDetected ? 'SQL injection pattern detected! See how the query is malformed?' : 'Normal input - query works safely',
    explanation: sqlInjectionDetected ? 'Notice how your input modified the SQL query structure. With parameterized queries, this would be impossible!' : 'With secure parameterized queries, even special characters are handled safely.'
  });
});

app.get('/api/example/part2', (req, res) => {
  const email = req.query.email || '';
  const vulnerableQuery = `SELECT * FROM customers WHERE email='${email}' AND password='???'`;
  const commentDetected = email.includes('--') || email.includes('#');
  
  res.json({
    email: email,
    vulnerable_query: vulnerableQuery,
    comment_detected: commentDetected,
    flag: commentDetected ? 'FLAG{C0MM3NT_1NJ3CT10N_M4ST3R3D}' : null,
    message: commentDetected ? 'Comment injection detected! Password check bypassed!' : 'Normal email address',
    explanation: commentDetected ? 'The -- comment removed the password check from the query!' : 'Without injection, both email and password would be checked.',
    remaining_query: commentDetected ? vulnerableQuery.split('--')[0] : vulnerableQuery
  });
});

app.get('/api/example/part3', (req, res) => {
  const category = req.query.category || '';
  const vulnerableQuery = `SELECT name, price FROM smoothies WHERE category='${category}'`;
  const unionDetected = category.toLowerCase().includes('union');
  
  res.json({
    category: category,
    vulnerable_query: vulnerableQuery,
    union_detected: unionDetected,
    flag: unionDetected ? 'FLAG{UN10N_S3L3CT_KNGW13DG3}' : null,
    message: unionDetected ? 'UNION injection detected! This could expose data from other tables!' : 'Normal category filter',
    explanation: unionDetected ? 'UNION SELECT allows attackers to retrieve data from any table in the database!' : 'Standard query returns only smoothie data.',
    warning: unionDetected ? 'In real attacks, this could expose passwords, credit cards, and other sensitive data!' : null
  });
});

app.get('/api/example/part4', (req, res) => {
  res.json({
    flag: 'FLAG{PR3V3NT10N_L34RN3D}',
    message: 'You understand SQL injection prevention!',
    vulnerable_code: {
      description: 'NEVER DO THIS',
      example: "const query = \"SELECT * FROM users WHERE email='\" + email + \"'\"",
      problem: 'User input directly concatenated into SQL'
    },
    secure_code: {
      description: 'ALWAYS DO THIS',
      example: "const query = 'SELECT * FROM users WHERE email=$1'; db.query(query, [email])",
      benefit: 'Input treated as data, never as SQL code'
    },
    additional_defenses: [
      'Use ORM frameworks (Sequelize, TypeORM) that use parameterized queries',
      'Implement input validation as defense-in-depth',
      'Use least privilege for database accounts',
      'Never expose SQL errors to users',
      'Regular security testing and code reviews'
    ]
  });
});

// Lab 1 - Secure Menu Search (EASY - demonstrates proper implementation)
app.get('/lab1', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Search Menu - FreshBlend</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔍 Search Menu</h1>
          <p class="subtitle">Find your perfect smoothie</p>
        </div>

        <div class="tutorial-section">
          <h2>Smoothie Search</h2>
          <p>Search by name, ingredient, or category to find your favorite blend!</p>
          
          <div class="tutorial-box">
            <h3>🎯 Lab 1 Challenge</h3>
            <p>This is a <strong>secure implementation</strong>. Try SQL injection attacks and see how they're safely handled!</p>
            <p>Try these payloads:</p>
            <ul>
              <li><code>berry' OR '1'='1</code></li>
              <li><code>protein'--</code></li>
              <li><code>' UNION SELECT * FROM customers--</code></li>
            </ul>
            <p>Notice how they don't break the application? That's proper security!</p>
          </div>

          <div class="interactive-demo">
            <h3>Try Searching</h3>
            <p>Open DevTools (F12 → Network tab) to watch the requests!</p>
            <div class="demo-controls">
              <input type="text" id="search-input" class="demo-input" placeholder="Try: berry, green, protein, or injection payloads!" value="">
              <button onclick="searchMenu()" class="demo-button">🔍 Search</button>
            </div>
            <div id="search-output" class="output-box"></div>
            <div id="search-flag" class="flag-reveal"></div>
          </div>

          <div class="hint-box">
            <strong>💡 Tip:</strong> Check the Network tab to see the API response. Even with injection attempts, the search works safely!
          </div>
        </div>

        <div class="tutorial-section">
          <h2>Why This Is Secure</h2>
          <pre>// SECURE CODE:
const query = 'SELECT * FROM smoothies WHERE name LIKE $1';
db.query(query, ['%' + searchTerm + '%'], callback);</pre>
          <p>This uses <strong>parameterized queries</strong> where user input is treated as data, never as SQL code!</p>
        </div>

        <div class="back-link">
          <a href="/">← Back to Home</a>
        </div>
      </div>

      <script>
        async function searchMenu() {
          const query = document.getElementById('search-input').value;
          const output = document.getElementById('search-output');
          const flagDiv = document.getElementById('search-flag');
          
          if (!query) {
            output.textContent = 'Please enter a search term';
            return;
          }
          
          output.textContent = 'Searching...';
          flagDiv.style.display = 'none';
          
          try {
            const response = await fetch('/api/search?q=' + encodeURIComponent(query));
            const data = await response.json();
            
            let displayText = JSON.stringify(data, null, 2);
            
            if (data.results && data.results.length > 0) {
              displayText = 'Found ' + data.results.length + ' smoothie(s):\\n\\n';
              data.results.forEach(s => {
                displayText += s.name + ' - $' + s.price + '\\n' + s.ingredients + '\\n\\n';
              });
              displayText += '\\n--- Full API Response ---\\n' + JSON.stringify(data, null, 2);
            }
            
            output.textContent = displayText;
            
            if (data.flag) {
              flagDiv.textContent = '🎉 ' + data.flag;
              flagDiv.style.display = 'block';
            }
          } catch (error) {
            output.textContent = 'Error: ' + error.message;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Lab 1 API - Secure search implementation
app.get('/api/search', (req, res) => {
  const query = req.query.q || '';
  
  if (!query) {
    return res.json({
      success: false,
      message: 'Please provide a search term'
    });
  }
  
  // Simulated secure parameterized query
  const results = smoothies.filter(s => 
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.category.toLowerCase().includes(query.toLowerCase()) ||
    s.ingredients.toLowerCase().includes(query.toLowerCase())
  );
  
  res.json({
    success: true,
    message: 'Search completed successfully',
    query: query,
    results: results,
    flag: 'FRESHBLEND{M3NU_S34RCH_W0RK1NG}',
    security_note: 'This endpoint uses parameterized queries - SQL injection is not possible!',
    attempted_injection: query.includes("'") || query.includes('"') || query.includes('--'),
    explanation: 'Even if you tried SQL injection, the parameterized query treats your input as literal text, not SQL code.'
  });
});

// Lab 2 - Advanced Search with SQL Injection (MEDIUM - detection challenge)
app.get('/lab2', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Advanced Search - FreshBlend</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔬 Advanced Search</h1>
          <p class="subtitle">Refined search with multiple filters</p>
        </div>

        <div class="tutorial-section">
          <h2>Multi-Filter Search</h2>
          <p>Search with additional filters to find exactly what you're looking for!</p>
          
          <div class="tutorial-box">
            <h3>🎯 Lab 2 Challenge</h3>
            <p>This search has a <strong>SQL injection vulnerability</strong>! Can you find it?</p>
            <p>Try injecting SQL into the search field or category:</p>
            <ul>
              <li><code>berry'</code> - Single quote causes SQL error</li>
              <li><code>test' OR '1'='1</code> - OR-based injection</li>
              <li><code>test'--</code> - Comment-based injection</li>
            </ul>
            <p>Watch for SQL error messages in the response!</p>
          </div>

          <div class="interactive-demo">
            <h3>Search with Filters</h3>
            <p>Open DevTools (F12 → Network tab) to see the full response!</p>
            <div class="demo-controls">
              <label style="display: block; margin-top: 10px; font-weight: 600;">Search Term:</label>
              <input type="text" id="adv-search-input" class="demo-input" placeholder="Enter smoothie name or ingredient" value="">
              
              <label style="display: block; margin-top: 10px; font-weight: 600;">Category:</label>
              <input type="text" id="adv-category-input" class="demo-input" placeholder="wellness, classic, tropical, fitness" value="">
              
              <button onclick="advancedSearch()" class="demo-button">🔍 Search</button>
            </div>
            <div id="adv-search-output" class="output-box"></div>
            <div id="adv-search-flag" class="flag-reveal"></div>
          </div>

          <div class="hint-box">
            <strong>💡 Tip:</strong> Try entering a single quote (<code>'</code>) in the search field. Watch what happens in the response!
          </div>
        </div>

        <div class="tutorial-section">
          <h2>What's Wrong Here?</h2>
          <pre>// VULNERABLE CODE:
const query = \`SELECT * FROM smoothies 
               WHERE name LIKE '%\${q}%' 
               AND category = '\${category}'\`;
db.query(query);</pre>
          <p>This uses <strong>string concatenation</strong> instead of parameterized queries. User input goes directly into the SQL!</p>
        </div>

        <div class="back-link">
          <a href="/">← Back to Home</a>
        </div>
      </div>

      <script>
        async function advancedSearch() {
          const query = document.getElementById('adv-search-input').value;
          const category = document.getElementById('adv-category-input').value;
          const output = document.getElementById('adv-search-output');
          const flagDiv = document.getElementById('adv-search-flag');
          
          if (!query && !category) {
            output.textContent = 'Please enter a search term or category';
            return;
          }
          
          output.textContent = 'Searching...';
          flagDiv.style.display = 'none';
          
          try {
            let url = '/api/advanced-search?';
            if (query) url += 'q=' + encodeURIComponent(query);
            if (category) url += (query ? '&' : '') + 'category=' + encodeURIComponent(category);
            
            const response = await fetch(url);
            const data = await response.json();
            
            output.textContent = JSON.stringify(data, null, 2);
            
            if (data.flag) {
              flagDiv.textContent = '🎉 ' + data.flag + '\\n' + (data.message || '');
              flagDiv.style.display = 'block';
            }
          } catch (error) {
            output.textContent = 'Error: ' + error.message;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Lab 2 API - Vulnerable advanced search
app.get('/api/advanced-search', (req, res) => {
  const query = req.query.q || '';
  const category = req.query.category || '';
  
  // Simulated vulnerable query with string concatenation
  const simulatedSQL = `SELECT * FROM smoothies WHERE name LIKE '%${query}%' AND category = '${category}'`;
  
  // Check for SQL injection attempts
  const sqlInjectionPatterns = ["'", '"', '--', '#', '/*', '*/', 'UNION', 'SELECT', 'DROP', 'INSERT', 'DELETE', 'UPDATE', ' OR ', '1=1'];
  const injectionDetected = sqlInjectionPatterns.some(pattern => 
    query.toLowerCase().includes(pattern.toLowerCase()) || 
    category.toLowerCase().includes(pattern.toLowerCase())
  );
  
  if (injectionDetected) {
    // SQL error response when injection detected
    return res.json({
      success: false,
      error: 'SQL Error Detected',
      flag: 'FRESHBLEND{SQL_3RR0R_D3T3CT3D}',
      message: 'SQL injection vulnerability confirmed!',
      hint: 'The query was: ' + simulatedSQL,
      sql_error: "Syntax error near '" + (query || category) + "' in WHERE clause",
      technical_info: 'SQL injection pattern detected in search parameters',
      vulnerability: 'String concatenation allows SQL injection',
      impact: 'Attackers could retrieve all data, bypass filters, or even modify the database',
      remediation: 'Use parameterized queries: db.query(sql, [param1, param2])'
    });
  }
  
  // Normal search (no injection)
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
    total: results.length,
    note: 'Try SQL injection payloads to discover the vulnerability!'
  });
});

// Lab 3 - Customer Login (HARD - authentication bypass)
app.get('/lab3', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Customer Login - FreshBlend</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Customer Login</h1>
          <p class="subtitle">Access your account and rewards</p>
        </div>

        <div class="tutorial-section">
          <h2>Sign In to Your Account</h2>
          <p>Login to view your order history, manage rewards points, and save your favorite smoothies!</p>
          
          <div class="tutorial-box">
            <h3>🎯 Lab 3 Challenge</h3>
            <p>This login form is <strong>vulnerable to SQL injection</strong>! Can you bypass authentication?</p>
            <p>Try these techniques:</p>
            <ul>
              <li><strong>Comment-based:</strong> <code>admin@freshblend.com'--</code> in email (any password)</li>
              <li><strong>OR-based:</strong> <code>' OR '1'='1</code> in email or password</li>
              <li><strong>Known user:</strong> <code>john.doe@email.com'--</code> with wrong password</li>
            </ul>
            <p>Goal: Login as admin without knowing the password!</p>
          </div>

          <div class="interactive-demo">
            <h3>Login Form</h3>
            <p>Open DevTools (F12 → Network tab) to see the requests and responses!</p>
            <div class="demo-controls">
              <label style="display: block; margin-top: 10px; font-weight: 600;">Email:</label>
              <input type="text" id="login-email" class="demo-input" placeholder="your.email@example.com" value="">
              
              <label style="display: block; margin-top: 10px; font-weight: 600;">Password:</label>
              <input type="password" id="login-password" class="demo-input" placeholder="Enter your password" value="">
              
              <button onclick="loginCustomer()" class="demo-button">🔓 Sign In</button>
            </div>
            <div id="login-output" class="output-box"></div>
            <div id="login-flag" class="flag-reveal"></div>
          </div>

          <div class="hint-box">
            <strong>💡 Hint:</strong> Try <code>admin@freshblend.com'--</code> as the email. The <code>--</code> will comment out the password check!
          </div>
        </div>

        <div class="tutorial-section">
          <h2>Test Accounts</h2>
          <p>For legitimate testing:</p>
          <ul>
            <li><strong>Email:</strong> john.doe@email.com | <strong>Password:</strong> Berry123</li>
            <li><strong>Email:</strong> fitness_jen@email.com | <strong>Password:</strong> Healthy2024</li>
          </ul>
          <p>But the goal is to login as <strong>admin@freshblend.com</strong> WITHOUT knowing the password!</p>
        </div>

        <div class="tutorial-section">
          <h2>The Vulnerability</h2>
          <pre>// CRITICAL VULNERABILITY:
const query = \`SELECT * FROM customers 
               WHERE email = '\${email}' 
               AND password = '\${password}'\`;
db.query(query);</pre>
          <p><strong>Attack:</strong> Email: <code>admin@freshblend.com'--</code></p>
          <p><strong>Query becomes:</strong></p>
          <pre>SELECT * FROM customers 
WHERE email = 'admin@freshblend.com'--' 
AND password = 'anything'</pre>
          <p>The <code>--</code> comments out the password check!</p>
        </div>

        <div class="back-link">
          <a href="/">← Back to Home</a>
        </div>
      </div>

      <script>
        async function loginCustomer() {
          const email = document.getElementById('login-email').value;
          const password = document.getElementById('login-password').value;
          const output = document.getElementById('login-output');
          const flagDiv = document.getElementById('login-flag');
          
          if (!email || !password) {
            output.textContent = 'Please enter both email and password';
            return;
          }
          
          output.textContent = 'Authenticating...';
          flagDiv.style.display = 'none';
          
          try {
            const response = await fetch('/api/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            output.textContent = JSON.stringify(data, null, 2);
            
            if (data.success && data.flag) {
              flagDiv.textContent = '🎉 ' + data.flag + '\\n\\nWelcome, ' + data.customer.name + '!\\nRole: ' + data.customer.role;
              flagDiv.style.display = 'block';
            } else if (data.success) {
              flagDiv.textContent = '✓ Login successful as ' + data.customer.name;
              flagDiv.style.display = 'block';
              flagDiv.style.background = 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)';
            }
          } catch (error) {
            output.textContent = 'Error: ' + error.message;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Lab 3 API - Vulnerable login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Simulated vulnerable SQL query
  const simulatedSQL = `SELECT * FROM customers WHERE email='${email}' AND password='${password}'`;
  
  // Check for SQL injection patterns that bypass authentication
  const bypassPatterns = [
    { pattern: "' OR '1'='1", name: 'OR-based injection' },
    { pattern: "' OR 1=1", name: 'OR-based injection (numeric)' },
    { pattern: "'--", name: 'Comment-based injection' },
    { pattern: "' #", name: 'Comment-based injection (hash)' },
    { pattern: "admin@freshblend.com'--", name: 'Direct admin bypass' }
  ];
  
  const injectionDetected = bypassPatterns.some(p => 
    email.includes(p.pattern) || password.includes(p.pattern)
  );
  
  if (injectionDetected) {
    // Successful SQL injection bypass
    return res.json({
      success: true,
      message: 'Authentication successful (via SQL injection!)',
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
      exploitation_note: 'SQL injection used to bypass authentication',
      vulnerability: 'String concatenation in WHERE clause allows authentication bypass',
      impact: 'Attacker gained admin access without knowing the password!',
      remediation: 'Use parameterized queries AND hashed passwords with bcrypt'
    });
  }
  
  // Normal authentication (for legitimate logins)
  const customer = customers.find(c => c.email === email && c.password === password);
  
  if (customer) {
    const { password: pwd, ...customerData } = customer;
    return res.json({
      success: true,
      message: 'Login successful',
      customer: customerData,
      note: 'This was a legitimate login. Try SQL injection to get the flag!'
    });
  }
  
  // Failed login
  res.status(401).json({
    success: false,
    message: 'Invalid email or password',
    query_executed: simulatedSQL,
    hint: 'Try SQL injection techniques to bypass authentication!',
    examples: [
      "Email: admin@freshblend.com'-- (with any password)",
      "Email: ' OR '1'='1 (with any password)",
      "Password: ' OR '1'='1 (with any email)"
    ]
  });
});

// Server startup
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🥤 FreshBlend Smoothie Bar              ║
║   SQL Injection Training Lab               ║
║   Server running on port ${PORT}              ║
║                                            ║
║   Access: http://localhost:${PORT}            ║
╚════════════════════════════════════════════╝

Available pages:
  http://localhost:${PORT}/ - Home
  http://localhost:${PORT}/example - SQL Injection Tutorial
  http://localhost:${PORT}/lab1 - Lab 1: Secure Search (EASY)
  http://localhost:${PORT}/lab2 - Lab 2: Advanced Search (MEDIUM)
  http://localhost:${PORT}/lab3 - Lab 3: Login Bypass (HARD)
`);
});
