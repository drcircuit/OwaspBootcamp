const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// State for Lab 1: Rate Limiting vulnerability
let lab1AttemptCount = 0;
const VALID_ORDER_CODE = '1035';

// State for Lab 2: Logic Flaw vulnerability
const MENU_ITEMS = {
  'taco': 3.50,
  'burrito': 7.50,
  'quesadilla': 6.00,
  'nachos': 5.00
};

// State for Lab 3: Race Condition vulnerability
let lab3Balance = 50.00;
let lab3Processing = false;

// TacoTruck Express theme styles
const styles = `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #C1121F 100%);
      color: #2B2D42;
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: #FFF8F0;
      border-radius: 15px;
      padding: 40px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }
    h1 {
      color: #C1121F;
      margin-bottom: 10px;
      font-size: 2.8em;
      text-align: center;
      font-weight: 800;
    }
    h2 {
      color: #FF6B35;
      margin-top: 30px;
      margin-bottom: 15px;
      border-bottom: 3px solid #F7931E;
      padding-bottom: 10px;
      font-weight: 700;
    }
    h3 {
      color: #2B2D42;
      margin-top: 20px;
      margin-bottom: 10px;
      font-weight: 600;
    }
    p, li {
      line-height: 1.8;
      margin-bottom: 10px;
      color: #2B2D42;
    }
    .nav-links {
      display: flex;
      gap: 20px;
      margin: 20px 0;
      flex-wrap: wrap;
    }
    .nav-links a {
      color: #FFF;
      text-decoration: none;
      padding: 12px 24px;
      border: 2px solid #FF6B35;
      border-radius: 8px;
      transition: all 0.3s;
      background: #FF6B35;
      font-weight: 600;
    }
    .nav-links a:hover {
      background: #C1121F;
      border-color: #C1121F;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(193, 18, 31, 0.3);
    }
    .challenge {
      background: linear-gradient(135deg, #FFF8F0 0%, #FFE5D0 100%);
      border: 2px solid #FF6B35;
      padding: 20px;
      margin: 20px 0;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.2);
    }
    .challenge h3 {
      margin-top: 0;
      color: #C1121F;
      font-size: 1.5em;
    }
    .difficulty {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 20px;
      font-weight: bold;
      margin-left: 10px;
      font-size: 0.9em;
    }
    .easy { background: #10B981; color: #FFF; }
    .medium { background: #F7931E; color: #FFF; }
    .hard { background: #C1121F; color: #FFF; }
    .example { background: #3B82F6; color: #FFF; }
    .section {
      background: #FFF;
      border: 2px solid #F7931E;
      padding: 20px;
      margin: 20px 0;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .good {
      background: #D1FAE5;
      border-left: 4px solid #10B981;
      padding: 15px;
      margin: 15px 0;
      border-radius: 5px;
    }
    .bad {
      background: #FEE2E2;
      border-left: 4px solid #EF4444;
      padding: 15px;
      margin: 15px 0;
      border-radius: 5px;
    }
    .lab-info {
      background: #FEF3C7;
      border-left: 4px solid #F59E0B;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .hint-box {
      background: #DBEAFE;
      border-left: 4px solid #3B82F6;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .endpoint {
      background: #F3F4F6;
      border: 2px solid #6B7280;
      padding: 15px;
      border-radius: 8px;
      margin: 10px 0;
      color: #1F2937;
      font-family: 'Courier New', monospace;
    }
    pre {
      background: #1F2937;
      color: #10B981;
      padding: 15px;
      border-radius: 8px;
      border: 1px solid #374151;
      overflow-x: auto;
      margin: 10px 0;
    }
    code {
      background: #FEE2E2;
      color: #B91C1C;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    ul {
      margin-left: 20px;
      margin-top: 10px;
    }
    a {
      color: #FF6B35;
      text-decoration: none;
      font-weight: 600;
      border-bottom: 2px solid transparent;
      transition: border-bottom 0.2s;
    }
    a:hover {
      border-bottom: 2px solid #FF6B35;
    }
  </style>
`;

// Home page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TacoTruck Express 🌮 - Order System</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>🌮 TACOTRUCK EXPRESS</h1>
        <p style="text-align: center; font-size: 1.2em; color: #F7931E; margin-bottom: 30px;">
          <strong>Pre-Order Your Favorite Tacos!</strong><br>
          Fast, fresh, and always delicious Mexican street food
        </p>
        
        <div class="challenge">
          <h3>📚 Tutorial - How Our System Works <span class="difficulty example">START HERE</span></h3>
          <p>Learn how TacoTruck Express handles orders, discounts, and loyalty rewards. See examples of our security measures in action.</p>
          <p><a href="/example">→ View Tutorial</a></p>
        </div>

        <div class="challenge">
          <h3>🌮 Lab 1 - Order System <span class="difficulty easy">EASY</span></h3>
          <p><strong>Mission:</strong> Test our high-speed ordering system</p>
          <p><strong>Description:</strong> During lunch rush, customers can rapid-fire orders. See if our system handles the volume!</p>
          <p><strong>Your Task:</strong> Place multiple orders quickly</p>
          <p><a href="/lab1">→ Start Lab 1</a></p>
        </div>

        <div class="challenge">
          <h3>🎟️ Lab 2 - Discount Codes <span class="difficulty medium">MEDIUM</span></h3>
          <p><strong>Mission:</strong> Maximize your savings with promo codes</p>
          <p><strong>Description:</strong> We offer various discount codes. Stack them wisely to get the best deal!</p>
          <p><strong>Your Task:</strong> Find the best combination of discount codes</p>
          <p><a href="/lab2">→ Start Lab 2</a></p>
        </div>

        <div class="challenge">
          <h3>💰 Lab 3 - Account Balance <span class="difficulty hard">HARD</span></h3>
          <p><strong>Mission:</strong> Test our loyalty rewards system</p>
          <p><strong>Description:</strong> Use your $50 account balance to place orders. Our system processes payments in real-time.</p>
          <p><strong>Your Task:</strong> Make the most of your loyalty balance</p>
          <p><a href="/lab3">→ Start Lab 3</a></p>
        </div>

        <div class="section">
          <h2>🌮 Our Menu</h2>
          <ul style="font-size: 1.1em;">
            <li><strong>Carne Asada</strong> - Grilled steak with cilantro & onions - $3.50</li>
            <li><strong>Al Pastor</strong> - Marinated pork with pineapple - $3.75</li>
            <li><strong>Pollo Asado</strong> - Grilled chicken with lime - $3.25</li>
            <li><strong>Vegetarian</strong> - Black beans, peppers & guacamole - $3.00</li>
          </ul>
        </div>

        <p style="text-align: center; margin-top: 40px;">
          <a href="/">← Back to Main Portal</a>
        </p>
      </div>
    </body>
    </html>
  `);
});

// Example page - Interactive Tutorial
app.get('/example', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TacoTruck Express - Tutorial</title>
      ${styles}
      <style>
        .interactive-demo {
          background: #FFF3E0;
          padding: 20px;
          border-radius: 10px;
          margin: 15px 0;
          border-left: 3px solid #FF9800;
        }
        .demo-controls { margin: 15px 0; }
        .demo-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #FF6B35;
          border-radius: 8px;
          font-size: 1em;
          margin: 10px 0;
        }
        .demo-button {
          background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 1em;
          margin: 5px;
          width: 100%;
        }
        .demo-button:hover {
          background: linear-gradient(135deg, #C1121F 0%, #FF6B35 100%);
        }
        .demo-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
          max-height: 300px;
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
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📚 TACOTRUCK EXPRESS TUTORIAL</h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
        </div>

        <!-- Part 1: Rate Limiting Demo -->
        <div class="section">
          <h2>Part 1: Testing Order Verification 🔍</h2>
          <p>Our order verification system allows customers to check order status by entering their order code. Try verifying different order codes!</p>
          
          <div class="good">
            <h3>🎯 Your Mission</h3>
            <p>Test the order verification system by trying different order codes. See how many attempts you can make!</p>
          </div>

          <div class="interactive-demo">
            <h3>Interactive Demo</h3>
            <p>Enter an order code to verify your order. Open DevTools (F12) to watch the network requests!</p>
            <div class="demo-controls">
              <input type="text" id="demo-order-code" class="demo-input" placeholder="Enter order code (try 1000-1050)" value="1000">
              <button onclick="demoVerifyOrder()" class="demo-button">🔍 Verify Order</button>
              <button onclick="demoRapidTest()" class="demo-button">⚡ Rapid Test (10 attempts)</button>
            </div>
            <div id="demo-output" class="output-box"></div>
            <div id="demo-flag" class="flag-reveal"></div>
          </div>

          <div class="hint-box">
            <strong>💡 Tip:</strong> Press F12 to open DevTools, go to the Network tab, and watch what happens when you verify orders!
          </div>
        </div>

        <!-- Part 2: Discount Demo -->
        <div class="section">
          <h2>Part 2: Testing Promo Codes 💰</h2>
          <p>Learn how our discount system works. Try applying different combinations of promo codes to see your savings!</p>
          
          <div class="good">
            <h3>🎯 Your Mission</h3>
            <p>Experiment with applying promo codes. See what happens when you apply the same code multiple times!</p>
          </div>

          <div class="interactive-demo">
            <h3>Try it yourself</h3>
            <p>Available codes: TACO10 (10% off), LUNCH15 (15% off), FIRST5 ($5 off)</p>
            <div class="demo-controls">
              <input type="text" id="demo-promo-codes" class="demo-input" placeholder="Enter codes separated by commas" value="TACO10,TACO10">
              <button onclick="demoTestDiscount()" class="demo-button">🎟️ Test Discount</button>
            </div>
            <div id="demo-discount-output" class="output-box" style="display:none;"></div>
            <div id="demo-discount-flag" class="flag-reveal"></div>
          </div>

          <div class="hint-box">
            <strong>💡 Tip:</strong> Try entering the same promo code multiple times in the list. Does it apply more than once?
          </div>
        </div>

        <!-- Part 3: Balance Demo -->
        <div class="section">
          <h2>Part 3: Testing Account Balance 💳</h2>
          <p>Our loyalty rewards system lets you use account balance for orders. Test how the system handles simultaneous transactions!</p>
          
          <div class="good">
            <h3>🎯 Your Mission</h3>
            <p>Try placing multiple withdrawal requests at the same time. Does the system handle concurrent requests correctly?</p>
          </div>

          <div class="interactive-demo">
            <h3>Interactive Demo</h3>
            <p>Current demo balance: $50.00</p>
            <div class="demo-controls">
              <input type="number" id="demo-withdraw" class="demo-input" placeholder="Amount to withdraw" value="30" min="1" max="50">
              <button onclick="demoTestWithdraw()" class="demo-button">💵 Single Withdrawal</button>
              <button onclick="demoTestConcurrent()" class="demo-button">⚡ Test 3 Concurrent Withdrawals</button>
            </div>
            <div id="demo-balance-output" class="output-box"></div>
            <div id="demo-balance-flag" class="flag-reveal"></div>
          </div>

          <div class="hint-box">
            <strong>💡 Tip:</strong> In the Network tab, you'll see multiple requests firing simultaneously. Watch how the balance changes!
          </div>
        </div>

        <div class="nav-links">
          <a href="/lab1">Try Lab 1: Rate Limiting →</a>
        </div>
      </div>

      <script>
        // Part 1: Rate Limiting Demo
        async function demoVerifyOrder() {
          const orderCode = document.getElementById('demo-order-code').value;
          const output = document.getElementById('demo-output');
          const flagDiv = document.getElementById('demo-flag');
          
          output.textContent = 'Verifying order...';
          flagDiv.style.display = 'none';
          
          try {
            const response = await fetch('/api/example/verify-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderCode })
            });
            const data = await response.json();
            output.textContent = JSON.stringify(data, null, 2);
            
            if (data.flag) {
              flagDiv.textContent = '🎉 ' + data.flag;
              flagDiv.style.display = 'block';
            }
          } catch (error) {
            output.textContent = 'Error: ' + error.message;
          }
        }

        async function demoRapidTest() {
          const output = document.getElementById('demo-output');
          const flagDiv = document.getElementById('demo-flag');
          output.textContent = 'Running rapid test...\\n\\n';
          flagDiv.style.display = 'none';
          
          for (let i = 1000; i < 1010; i++) {
            try {
              const response = await fetch('/api/example/verify-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderCode: i.toString() })
              });
              const data = await response.json();
              output.textContent += \`Attempt \${i-999}: \${data.message || JSON.stringify(data)}\\n\`;
              
              if (data.flag) {
                flagDiv.textContent = '🎉 ' + data.flag;
                flagDiv.style.display = 'block';
              }
            } catch (error) {
              output.textContent += \`Attempt \${i-999}: Error - \${error.message}\\n\`;
            }
          }
        }

        // Part 2: Discount Demo
        async function demoTestDiscount() {
          const promoCodes = document.getElementById('demo-promo-codes').value.split(',').map(c => c.trim());
          const output = document.getElementById('demo-discount-output');
          const flagDiv = document.getElementById('demo-discount-flag');
          
          output.style.display = 'block';
          output.textContent = 'Calculating discount...';
          flagDiv.style.display = 'none';
          
          try {
            const response = await fetch('/api/example/test-discount', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                items: ['taco', 'burrito', 'taco'],
                promoCodes
              })
            });
            const data = await response.json();
            output.textContent = JSON.stringify(data, null, 2);
            
            if (data.flag) {
              flagDiv.textContent = '🎉 ' + data.flag;
              flagDiv.style.display = 'block';
            }
          } catch (error) {
            output.textContent = 'Error: ' + error.message;
          }
        }

        // Part 3: Balance Demo
        async function demoTestWithdraw() {
          const amount = parseFloat(document.getElementById('demo-withdraw').value);
          const output = document.getElementById('demo-balance-output');
          const flagDiv = document.getElementById('demo-balance-flag');
          
          output.textContent = 'Processing withdrawal...';
          flagDiv.style.display = 'none';
          
          try {
            const response = await fetch('/api/example/test-withdraw', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount })
            });
            const data = await response.json();
            output.textContent = JSON.stringify(data, null, 2);
            
            if (data.flag) {
              flagDiv.textContent = '🎉 ' + data.flag;
              flagDiv.style.display = 'block';
            }
          } catch (error) {
            output.textContent = 'Error: ' + error.message;
          }
        }

        async function demoTestConcurrent() {
          const amount = parseFloat(document.getElementById('demo-withdraw').value);
          const output = document.getElementById('demo-balance-output');
          const flagDiv = document.getElementById('demo-balance-flag');
          
          output.textContent = 'Sending 3 concurrent withdrawals...\\n\\n';
          flagDiv.style.display = 'none';
          
          const requests = [
            fetch('/api/example/test-withdraw', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount })
            }),
            fetch('/api/example/test-withdraw', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount })
            }),
            fetch('/api/example/test-withdraw', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount })
            })
          ];
          
          try {
            const results = await Promise.all(requests);
            const data = await Promise.all(results.map(r => r.json()));
            
            output.textContent = 'Results from 3 concurrent requests:\\n\\n';
            data.forEach((d, i) => {
              output.textContent += \`Request \${i+1}:\\n\${JSON.stringify(d, null, 2)}\\n\\n\`;
              if (d.flag && !flagDiv.textContent) {
                flagDiv.textContent = '🎉 ' + d.flag;
                flagDiv.style.display = 'block';
              }
            });
          } catch (error) {
            output.textContent = 'Error: ' + error.message;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Example API endpoints - Interactive demos
app.post('/api/example/verify-order', (req, res) => {
  const { orderCode } = req.body;
  lab1AttemptCount++;
  
  if (orderCode === VALID_ORDER_CODE) {
    return res.json({
      success: true,
      message: `Order #${orderCode} verified! 2 tacos ready for pickup.`,
      attempts: lab1AttemptCount
    });
  }
  
  if (lab1AttemptCount >= 10) {
    return res.json({
      success: false,
      flag: 'TACO{D3M0_R4T3_L1M1T_M1SS1NG}',
      message: `Demo: ${lab1AttemptCount} attempts made with no rate limiting!`,
      hint: 'Try the real challenge in Lab 1'
    });
  }
  
  res.json({
    success: false,
    message: `Order code ${orderCode} not found.`,
    attempts: lab1AttemptCount
  });
});

app.post('/api/example/test-discount', (req, res) => {
  const { items, promoCodes } = req.body;
  
  let total = 0;
  items.forEach(item => {
    total += MENU_ITEMS[item] || 0;
  });
  
  const originalTotal = total;
  let discountsApplied = [];
  
  // DEMO: Show the flaw - doesn't check for duplicates
  promoCodes.forEach(code => {
    if (code === 'TACO10') {
      total *= 0.9;
      discountsApplied.push('TACO10: 10% off');
    } else if (code === 'LUNCH15') {
      total *= 0.85;
      discountsApplied.push('LUNCH15: 15% off');
    } else if (code === 'FIRST5') {
      total -= 5;
      discountsApplied.push('FIRST5: $5 off');
    }
  });
  
  if (promoCodes.length > 2 && total < originalTotal * 0.5) {
    return res.json({
      flag: 'TACO{D3M0_L0G1C_FL4W_ST4CK1NG}',
      originalTotal: originalTotal.toFixed(2),
      finalTotal: total.toFixed(2),
      discountsApplied,
      message: 'Demo: Discount stacking works! Try Lab 2 for the real challenge.'
    });
  }
  
  res.json({
    originalTotal: originalTotal.toFixed(2),
    finalTotal: total.toFixed(2),
    discountsApplied,
    message: 'Discount applied successfully'
  });
});

let demoBalance = 50.00;
app.post('/api/example/test-withdraw', async (req, res) => {
  const { amount } = req.body;
  
  // Simulate async processing
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // DEMO: Race condition - check and act are not atomic
  if (demoBalance >= amount) {
    const balanceBefore = demoBalance;
    demoBalance -= amount;
    
    if (demoBalance < 0) {
      return res.json({
        flag: 'TACO{D3M0_R4C3_C0ND1T10N}',
        success: true,
        balanceBefore,
        balanceAfter: demoBalance,
        withdrawn: amount,
        message: 'Demo: Overdraft occurred! Try Lab 3 for the real challenge.'
      });
    }
    
    return res.json({
      success: true,
      balanceBefore,
      balanceAfter: demoBalance,
      withdrawn: amount
    });
  }
  
  res.status(400).json({
    success: false,
    message: 'Insufficient funds',
    currentBalance: demoBalance
  });
});

// Lab 1 page - Rate Limiting
app.get('/lab1', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 1 - Order System</title>
      ${styles}
      <style>
        .interactive-demo {
          background: #FFF3E0;
          padding: 20px;
          border-radius: 10px;
          margin: 15px 0;
          border-left: 3px solid #FF9800;
        }
        .demo-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #FF6B35;
          border-radius: 8px;
          font-size: 1em;
          margin: 10px 0;
        }
        .demo-button {
          background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 1em;
          margin: 5px;
          width: 100%;
        }
        .demo-button:hover {
          background: linear-gradient(135deg, #C1121F 0%, #FF6B35 100%);
        }
        .demo-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌮 LAB 1: ORDER VERIFICATION <span class="difficulty easy">EASY</span></h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/example">📚 Tutorial</a>
        </div>

        <div class="lab-info">
          <h3>🎯 Your Mission</h3>
          <p><strong>Scenario:</strong> Test our order verification system during lunch rush</p>
          <p><strong>Your Goal:</strong> Find a valid order code by brute-forcing the system</p>
          <p><strong>Flag:</strong> Discover what happens when you make 50+ verification attempts</p>
        </div>

        <div class="section">
          <h2>🌮 Challenge Description</h2>
          <p>TacoTruck Express allows customers to verify their order status using a 4-digit order code. The system checks if your code matches an active order.</p>
          <p><strong>Your task:</strong> The verification system has no rate limiting. Try making many verification attempts to find a valid order code or trigger a security flag!</p>
        </div>

        <div class="interactive-demo">
          <h3>Order Verification System</h3>
          <p>Try to verify your order by entering different codes:</p>
          <div class="demo-controls">
            <input type="text" id="order-code" class="demo-input" placeholder="Enter 4-digit order code (try 1000-1050)" value="1000">
            <button onclick="verifyOrder()" class="demo-button">🔍 Verify Order</button>
            <button onclick="bruteForce()" id="brute-btn" class="demo-button">⚡ Auto Brute Force (1000-1050)</button>
            <button onclick="resetLab()" class="demo-button">🔄 Reset Lab</button>
          </div>
          <div id="output" class="output-box"></div>
          <div id="flag" class="flag-reveal"></div>
        </div>

        <div class="hint-box">
          <strong>💡 DevTools Tip:</strong>
          <ul>
            <li>Open DevTools (F12) → Network tab to see each API call</li>
            <li>Watch how many requests you can make without being blocked</li>
            <li>Notice there's no rate limiting mechanism in place!</li>
          </ul>
        </div>

        <div class="bad">
          <h3>⚠️ Vulnerability: Missing Rate Limiting</h3>
          <p><strong>Issue:</strong> The order verification endpoint has no rate limiting, allowing unlimited attempts.</p>
          <p><strong>Impact:</strong> Attackers can brute-force order codes to access any customer's order information.</p>
          <p><strong>Fix:</strong> Implement rate limiting (e.g., max 10 attempts per 15 minutes) using middleware like express-rate-limit.</p>
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <a href="/">← Back to Home</a> | <a href="/lab2">Next Lab →</a>
        </div>
      </div>

      <script>
        async function verifyOrder() {
          const orderCode = document.getElementById('order-code').value;
          const output = document.getElementById('output');
          const flagDiv = document.getElementById('flag');
          
          output.textContent = 'Verifying order...';
          
          try {
            const response = await fetch('/api/lab1/verify-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderCode })
            });
            const data = await response.json();
            
            output.textContent = JSON.stringify(data, null, 2);
            
            if (data.flag) {
              flagDiv.innerHTML = '🎉 FLAG CAPTURED!<br><br>' + data.flag + '<br><br>' + data.message;
              flagDiv.style.display = 'block';
            }
          } catch (error) {
            output.textContent = 'Error: ' + error.message;
          }
        }

        async function bruteForce() {
          const output = document.getElementById('output');
          const flagDiv = document.getElementById('flag');
          const btn = document.getElementById('brute-btn');
          
          btn.disabled = true;
          output.textContent = 'Starting brute force attack...\\n\\n';
          flagDiv.style.display = 'none';
          
          for (let code = 1000; code <= 1050; code++) {
            try {
              const response = await fetch('/api/lab1/verify-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderCode: code.toString() })
              });
              const data = await response.json();
              
              output.textContent += \`Attempt \${code}: \${data.message || 'Checking...'}\\n\`;
              
              if (data.flag) {
                output.textContent += \`\\n🎉 FLAG FOUND!\\n\`;
                flagDiv.innerHTML = '🎉 FLAG CAPTURED!<br><br>' + data.flag + '<br><br>' + data.message;
                flagDiv.style.display = 'block';
                break;
              }
              
              if (data.validOrder) {
                output.textContent += \`\\n✅ Valid order found: \${code}\\n\`;
              }
              
              // Small delay to make it visible
              await new Promise(resolve => setTimeout(resolve, 50));
            } catch (error) {
              output.textContent += \`Attempt \${code}: Error\\n\`;
            }
          }
          
          btn.disabled = false;
        }

        async function resetLab() {
          const output = document.getElementById('output');
          output.textContent = 'Resetting lab...';
          
          try {
            const response = await fetch('/api/lab1/reset', { method: 'POST' });
            const data = await response.json();
            output.textContent = data.message;
            document.getElementById('flag').style.display = 'none';
          } catch (error) {
            output.textContent = 'Error: ' + error.message;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Lab 1 API endpoints
app.post('/api/lab1/verify-order', (req, res) => {
  const { orderCode } = req.body;
  lab1AttemptCount++;
  
  // Check if it's the valid order
  if (orderCode === VALID_ORDER_CODE) {
    return res.json({
      success: true,
      validOrder: true,
      message: `Order #${orderCode} verified! 2 Carne Asada tacos ready for pickup.`,
      attempts: lab1AttemptCount,
      orderDetails: {
        items: ['Carne Asada Taco', 'Carne Asada Taco'],
        total: '$7.00',
        status: 'Ready'
      }
    });
  }
  
  // VULNERABLE: No rate limiting - award flag after 50+ attempts
  if (lab1AttemptCount > 50) {
    return res.json({
      success: false,
      flag: 'TACO{R4T3_L1M1T_M1SS1NG_3XTR4_GU4C}',
      message: 'Rate limiting vulnerability confirmed! 50+ attempts made without blocking.',
      attempts: lab1AttemptCount,
      vulnerability: 'Missing rate limiting allows unlimited verification attempts'
    });
  }
  
  res.json({
    success: false,
    message: `Order code ${orderCode} not found. Try another code.`,
    attempts: lab1AttemptCount,
    hint: lab1AttemptCount > 20 ? 'Keep trying... no rate limit detected!' : 'Try different codes'
  });
});

app.post('/api/lab1/reset', (req, res) => {
  lab1AttemptCount = 0;
  res.json({
    message: 'Lab 1 reset successfully. Attempt counter cleared.',
    attempts: lab1AttemptCount
  });
});

// Lab 2 page - Logic Flaw
app.get('/lab2', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 2 - Discount Codes</title>
      ${styles}
      <style>
        .interactive-demo {
          background: #FFF3E0;
          padding: 20px;
          border-radius: 10px;
          margin: 15px 0;
          border-left: 3px solid #FF9800;
        }
        .demo-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #FF6B35;
          border-radius: 8px;
          font-size: 1em;
          margin: 10px 0;
        }
        .demo-button {
          background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
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
          background: linear-gradient(135deg, #C1121F 0%, #FF6B35 100%);
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
        .item-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 10px 0;
        }
        .item-btn {
          padding: 10px 15px;
          border: 2px solid #FF6B35;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }
        .item-btn.selected {
          background: #FF6B35;
          color: white;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎟️ LAB 2: PROMO CODE STACKING <span class="difficulty medium">MEDIUM</span></h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/example">📚 Tutorial</a>
        </div>

        <div class="lab-info">
          <h3>🎯 Your Mission</h3>
          <p><strong>Scenario:</strong> Maximize your savings with promo codes!</p>
          <p><strong>Your Goal:</strong> Apply the same promo code multiple times to get >50% discount</p>
          <p><strong>Flag:</strong> Exploit the business logic flaw to trigger the flag</p>
        </div>

        <div class="section">
          <h2>🎟️ Challenge Description</h2>
          <p>TacoTruck Express allows customers to apply multiple promo codes at checkout. The system applies each code in the list—but doesn't check for duplicates!</p>
          <p><strong>Your task:</strong> Exploit the logic flaw by applying the same discount code multiple times to stack discounts beyond the intended limit.</p>
        </div>

        <div class="section">
          <h2>🌮 Menu Prices</h2>
          <ul style="font-size: 1.1em;">
            <li>🌮 <strong>Taco</strong> - $3.50 each</li>
            <li>🌯 <strong>Burrito</strong> - $7.50 each</li>
            <li>🧀 <strong>Quesadilla</strong> - $6.00 each</li>
            <li>🥑 <strong>Nachos</strong> - $5.00 each</li>
          </ul>
        </div>

        <div class="section">
          <h2>🎟️ Available Promo Codes</h2>
          <ul style="font-size: 1.1em;">
            <li><code>TACO10</code> - 10% off</li>
            <li><code>LUNCH15</code> - 15% off</li>
            <li><code>FIRST5</code> - $5 off</li>
          </ul>
        </div>

        <div class="interactive-demo">
          <h3>Checkout System</h3>
          <p><strong>Step 1:</strong> Select your items</p>
          <div class="item-selector">
            <button class="item-btn" onclick="toggleItem('taco')">🌮 Taco ($3.50)</button>
            <button class="item-btn" onclick="toggleItem('burrito')">🌯 Burrito ($7.50)</button>
            <button class="item-btn" onclick="toggleItem('quesadilla')">🧀 Quesadilla ($6.00)</button>
            <button class="item-btn" onclick="toggleItem('nachos')">🥑 Nachos ($5.00)</button>
          </div>
          
          <p style="margin-top: 15px;"><strong>Step 2:</strong> Enter promo codes (comma-separated, duplicates allowed!)</p>
          <input type="text" id="promo-codes" class="demo-input" placeholder="e.g., TACO10,TACO10,TACO10,TACO10" value="TACO10,TACO10,TACO10,TACO10">
          
          <button onclick="checkout()" class="demo-button" style="width: 100%;">💳 Checkout with Codes</button>
          <div id="output" class="output-box"></div>
          <div id="flag" class="flag-reveal"></div>
        </div>

        <div class="hint-box">
          <strong>💡 DevTools Tip:</strong>
          <ul>
            <li>Open DevTools (F12) → Network tab to see the checkout request</li>
            <li>Look at the request payload—notice how promo codes are sent as an array</li>
            <li>Try applying the same code 4+ times to exceed 50% discount</li>
          </ul>
        </div>

        <div class="bad">
          <h3>⚠️ Vulnerability: Business Logic Flaw</h3>
          <p><strong>Issue:</strong> The checkout system doesn't validate that promo codes are unique, allowing discount stacking.</p>
          <p><strong>Impact:</strong> Customers can apply the same code multiple times to get extreme discounts or even negative prices.</p>
          <p><strong>Fix:</strong> Use a Set to track applied codes, validate maximum discount caps, and check for duplicate code usage per order.</p>
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <a href="/lab1">← Previous Lab</a> | <a href="/">Home</a> | <a href="/lab3">Next Lab →</a>
        </div>
      </div>

      <script>
        let selectedItems = [];

        function toggleItem(item) {
          const btn = event.target;
          const index = selectedItems.indexOf(item);
          
          if (index > -1) {
            selectedItems.splice(index, 1);
            btn.classList.remove('selected');
          } else {
            selectedItems.push(item);
            btn.classList.add('selected');
          }
        }

        async function checkout() {
          const promoInput = document.getElementById('promo-codes').value;
          const promoCodes = promoInput.split(',').map(c => c.trim()).filter(c => c);
          const output = document.getElementById('output');
          const flagDiv = document.getElementById('flag');
          
          if (selectedItems.length === 0) {
            output.textContent = 'Please select at least one item!';
            return;
          }
          
          output.textContent = 'Processing checkout...';
          flagDiv.style.display = 'none';
          
          try {
            const response = await fetch('/api/lab2/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                items: selectedItems,
                promoCodes
              })
            });
            const data = await response.json();
            
            output.textContent = JSON.stringify(data, null, 2);
            
            if (data.flag) {
              flagDiv.innerHTML = '🎉 FLAG CAPTURED!<br><br>' + data.flag + '<br><br>' + data.message;
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

// Lab 2 API endpoint
app.post('/api/lab2/checkout', (req, res) => {
  const { items, promoCodes } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items in cart' });
  }
  
  // Calculate original total
  let total = 0;
  items.forEach(item => {
    total += MENU_ITEMS[item] || 0;
  });
  
  const originalTotal = total;
  let discountsApplied = [];
  
  // VULNERABLE: No check for duplicate promo codes!
  promoCodes.forEach(code => {
    if (code === 'TACO10') {
      total *= 0.9;
      discountsApplied.push('TACO10: 10% off');
    } else if (code === 'LUNCH15') {
      total *= 0.85;
      discountsApplied.push('LUNCH15: 15% off');
    } else if (code === 'FIRST5') {
      total -= 5;
      discountsApplied.push('FIRST5: $5 off');
    }
  });
  
  // Award flag if discount exceeds 50%
  if (total < originalTotal * 0.5) {
    return res.json({
      flag: 'TACO{L0G1C_FL4W_FR33_GU4C4M0L3}',
      message: 'Business logic flaw exploited! Promo codes stacked for extreme discount.',
      vulnerability: 'No validation prevents duplicate promo codes from being applied',
      originalTotal: `$${originalTotal.toFixed(2)}`,
      finalTotal: `$${total.toFixed(2)}`,
      discountPercent: `${((1 - total/originalTotal) * 100).toFixed(1)}%`,
      discountsApplied,
      codesUsed: promoCodes.length
    });
  }
  
  res.json({
    originalTotal: `$${originalTotal.toFixed(2)}`,
    finalTotal: `$${total.toFixed(2)}`,
    discountPercent: `${((1 - total/originalTotal) * 100).toFixed(1)}%`,
    discountsApplied,
    message: 'Try stacking more codes to exceed 50% discount!',
    hint: 'Same code can be applied multiple times...'
  });
});

// Lab 3 page - Race Condition
app.get('/lab3', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 3 - Account Balance</title>
      ${styles}
      <style>
        .interactive-demo {
          background: #FFF3E0;
          padding: 20px;
          border-radius: 10px;
          margin: 15px 0;
          border-left: 3px solid #FF9800;
        }
        .demo-input {
          width: 100%;
          padding: 12px;
          border: 2px solid #FF6B35;
          border-radius: 8px;
          font-size: 1em;
          margin: 10px 0;
        }
        .demo-button {
          background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
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
          background: linear-gradient(135deg, #C1121F 0%, #FF6B35 100%);
        }
        .demo-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
        .balance-display {
          background: #E8F5E9;
          padding: 20px;
          border-radius: 10px;
          margin: 15px 0;
          text-align: center;
          font-size: 1.5em;
          font-weight: bold;
          color: #2e7d32;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>💰 LAB 3: RACE CONDITION <span class="difficulty hard">HARD</span></h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/example">📚 Tutorial</a>
        </div>

        <div class="lab-info">
          <h3>🎯 Your Mission</h3>
          <p><strong>Scenario:</strong> Exploit concurrent transaction processing</p>
          <p><strong>Your Goal:</strong> Withdraw more than your $50 balance by exploiting a race condition</p>
          <p><strong>Flag:</strong> Trigger an overdraft to capture the flag</p>
        </div>

        <div class="section">
          <h2>💰 Challenge Description</h2>
          <p>TacoTruck Express has a loyalty rewards system where customers can pay using their account balance. Your account has $50.00 available.</p>
          <p><strong>The vulnerability:</strong> The system checks balance availability and then withdraws—these are separate operations, not atomic! Multiple concurrent requests can all pass the balance check before any withdrawal is processed.</p>
          <p><strong>Your task:</strong> Send 3 concurrent $30 withdrawal requests. If successful, you'll withdraw $90 from a $50 balance!</p>
        </div>

        <div class="balance-display">
          Current Balance: <span id="balance-display">$50.00</span>
        </div>

        <div class="hint-box">
          <strong>💡 Testing Hints:</strong>
          <ul>
            <li>Your account balance: $50.00 (customer123)</li>
            <li>Each taco order costs $3.50</li>
            <li>Try sending multiple requests at the exact same time</li>
            <li>Race conditions occur when concurrent requests aren't synchronized</li>
          </ul>
        </div>

        <div class="section">
          <h2>🔧 How to Test</h2>
          <p><strong>Endpoint:</strong> <code>POST /api/purchase</code></p>
          <p><strong>Request Body:</strong></p>
          <pre>{
  "customerId": "customer123",
  "amount": 3.50,
  "item": "Carne Asada Taco"
}</pre>
          <p><strong>Goal:</strong> Purchase more than $50 worth of tacos by exploiting the race condition!</p>
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// API Endpoints

// Lab 1 API - Rate Limiting vulnerability
app.post('/api/order', (req, res) => {
  const { item, quantity } = req.body;
  const clientIp = req.ip || 'unknown';
  
  // Vulnerable: No rate limiting
  if (!orderAttempts[clientIp]) {
    orderAttempts[clientIp] = [];
  }
  
  orderAttempts[clientIp].push({ 
    item, 
    quantity, 
    timestamp: Date.now() 
  });
  
  // Check if user made many rapid orders
  const recentOrders = orderAttempts[clientIp].filter(
    order => Date.now() - order.timestamp < 10000
  );
  
  if (recentOrders.length > 20) {
    return res.json({
      success: true,
      orderId: Math.random().toString(36).substr(2, 9),
      item,
      quantity,
      totalOrders: recentOrders.length,
      flag: 'HARVEST{R4T3_L1M1T_M1SS1NG}',
      message: '🎉 Flag captured! You exploited the missing rate limit!',
      vulnerability: 'No rate limiting allows rapid-fire requests',
      secureAlternative: 'Implement sliding window rate limit (e.g., max 10 orders per minute)'
    });
  }
  
  res.json({
    success: true,
    orderId: Math.random().toString(36).substr(2, 9),
    item,
    quantity,
    totalOrders: recentOrders.length,
    hint: `${recentOrders.length}/20 rapid orders made`
  });
});

// Lab 2 API - Logic Flaw vulnerability
app.post('/api/apply-promo', (req, res) => {
  const { promoCodes, cartTotal } = req.body;
  
  // Vulnerable: Allows stacking of codes that shouldn't be combined
  let discountPercent = 0;
  const appliedCodes = [];
  
  // Available codes
  const validCodes = {
    'FIRST10': 10,    // First order discount
    'SAVE15': 15,     // General discount
    'LUNCH20': 20,    // Lunch special
    'VIP25': 25       // VIP members only
  };
  
  promoCodes.forEach(code => {
    if (validCodes[code]) {
      discountPercent += validCodes[code];
      appliedCodes.push(code);
      
      // Track usage for each session (vulnerable: no proper validation)
      if (!promoCodeUsage[code]) {
        promoCodeUsage[code] = 0;
      }
      promoCodeUsage[code]++;
    }
  });
  
  const discountAmount = (cartTotal * discountPercent) / 100;
  const finalTotal = Math.max(0, cartTotal - discountAmount);
  
  // Flag when discount exceeds 50%
  if (discountPercent >= 50) {
    return res.json({
      success: true,
      originalTotal: cartTotal,
      discountPercent,
      discountAmount,
      finalTotal,
      appliedCodes,
      flag: 'HARVEST{ST4CK_PR0M0_FL4W}',
      message: '🎉 Flag captured! You exploited the promo code stacking flaw!',
      vulnerability: 'Multiple discount codes can be stacked without validation',
      secureAlternative: 'Implement mutually exclusive discount categories'
    });
  }
  
  res.json({
    success: true,
    originalTotal: cartTotal,
    discountPercent,
    discountAmount,
    finalTotal,
    appliedCodes,
    hint: `${discountPercent}% discount applied. Try combining more codes!`
  });
});

// Lab 3 API - Race Condition vulnerability
app.post('/api/purchase', (req, res) => {
  const { customerId, amount, item } = req.body;
  
  // Vulnerable: No locking or transaction control
  const balance = accountBalances[customerId];
  
  if (balance === undefined) {
    return res.status(404).json({ 
      success: false, 
      message: 'Customer not found' 
    });
  }
  
  // Check balance before purchase (vulnerable to race condition)
  if (balance >= amount) {
    // Simulate processing delay that allows race condition
    setTimeout(() => {
      accountBalances[customerId] -= amount;
      
      orderHistory.push({
        customerId,
        item,
        amount,
        timestamp: new Date().toISOString(),
        balanceAfter: accountBalances[customerId]
      });
      
      // Check if customer went over their original balance
      const totalSpent = 50.00 - accountBalances[customerId];
      
      if (accountBalances[customerId] < 0 || totalSpent > 50.00) {
        return res.json({
          success: true,
          item,
          amount,
          newBalance: accountBalances[customerId],
          totalSpent,
          flag: 'HARVEST{R4C3_C0ND1T10N_W1N}',
          message: '🎉 Flag captured! You exploited the race condition!',
          vulnerability: 'Concurrent requests processed without locking',
          secureAlternative: 'Use database transactions with row-level locking'
        });
      }
      
      res.json({
        success: true,
        item,
        amount,
        newBalance: accountBalances[customerId],
        totalSpent,
        hint: 'Try sending multiple requests at the exact same time'
      });
    }, 10); // Small delay to make race condition easier to exploit
  } else {
    res.status(400).json({
      success: false,
      message: 'Insufficient balance',
      balance,
      required: amount
    });
  }
});

app.listen(PORT, () => {
  console.log(`\x1b[32m
╔════════════════════════════════════════════╗
║   🌮 TacoTruck Express                    ║
║   Server running on port ${PORT}           ║
║                                            ║
║   Access the portal:                      ║
║   http://localhost:${PORT}                    ║
╚════════════════════════════════════════════╝
\x1b[0m`);
});
