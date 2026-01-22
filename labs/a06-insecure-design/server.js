const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// State for Lab 1: Rate Limiting vulnerability
let lab1AttemptCount = 0;
const VALID_ACCOUNT_PIN = '1035';

// State for Lab 2: Logic Flaw vulnerability
const TRANSFER_TYPES = {
  'checking': { fee: 0, limit: 10000 },
  'savings': { fee: 0, limit: 5000 },
  'external': { fee: 2.50, limit: 2500 },
  'wire': { fee: 25.00, limit: 50000 }
};

// State for Lab 3: Race Condition vulnerability
let lab3Balance = 1000.00;
let lab3Processing = false;

// SecureBank Online Banking theme styles
const styles = `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%);
      color: #1e293b;
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 15px;
      padding: 40px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }
    h1 {
      color: #1e40af;
      margin-bottom: 10px;
      font-size: 2.8em;
      text-align: center;
      font-weight: 800;
    }
    h2 {
      color: #2563eb;
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
      <title>SecureBank Online 🏦 - Banking Portal</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>� SECUREBANK ONLINE</h1>
        <p style="text-align: center; font-size: 1.2em; color: #F7931E; margin-bottom: 30px;">
          <strong>Pre-Order Your Favorite Tacos!</strong><br>
          Fast, fresh, and always delicious Mexican street food
        </p>
        
        <div class="challenge">
          <h3>📚 Tutorial - How Our System Works <span class="difficulty example">START HERE</span></h3>
          <p>Learn how SecureBank handles transactions, transfers, and account security. See examples of our security measures in action.</p>
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
// Example - Account Security Demo with DevTools Discovery
app.get('/example', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SecureBank Account Dashboard</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>🏦 SECUREBANK ACCOUNT OVERVIEW</h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
        </div>

        <div class="challenge" style="margin: 30px 0;">
          <h2>Welcome to Your Account Dashboard</h2>
          <p>View your account details, recent transactions, and rewards status.</p>
          
          <div id="account-info" style="background: white; padding: 25px; border-radius: 10px; margin-top: 20px;">
            <p style="color: #667eea; font-size: 1.1em;">Loading account information...</p>
          </div>
          
          <div class="hint-box" style="margin-top: 30px;">
            <strong>💡 Discovery Tip:</strong> Use browser DevTools (F12 → Network tab) to see how this dashboard loads your account data.
          </div>
        </div>
      </div>

      <script>
        window.addEventListener('DOMContentLoaded', async () => {
          try {
            await fetch('/api/example/account');
            await fetch('/api/example/transactions');
            await fetch('/api/example/rewards');
            const debugResp = await fetch('/api/example/debug');
            const debugData = await debugResp.json();
            
            const infoDiv = document.getElementById('account-info');
            if (debugData.flag) {
              infoDiv.innerHTML = \`
                <div style="background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                  <h3>🎯 Flag Found!</h3>
                  <p style="font-size: 1.2em; font-weight: bold; margin-top: 10px;">\${debugData.flag}</p>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                  <div style="background: #e3f2fd; padding: 20px; border-radius: 10px;">
                    <h4 style="color: #1976d2;">Account Balance</h4>
                    <p style="font-size: 1.5em; color: #1976d2; font-weight: bold;">$\${debugData.account.balance.toFixed(2)}</p>
                  </div>
                  <div style="background: #f3e5f5; padding: 20px; border-radius: 10px;">
                    <h4 style="color: #7b1fa2;">Rewards Points</h4>
                    <p style="font-size: 1.5em; color: #7b1fa2; font-weight: bold;">\${debugData.account.rewards_points}</p>
                  </div>
                  <div style="background: #e8f5e9; padding: 20px; border-radius: 10px;">
                    <h4 style="color: #388e3c;">Account Status</h4>
                    <p style="font-size: 1.5em; color: #388e3c; font-weight: bold;">\${debugData.account.status}</p>
                  </div>
                </div>
              \`;
            }
          } catch (error) {
            document.getElementById('account-info').innerHTML = 
              '<p style="color: red;">Error loading account data</p>';
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Example API endpoints
app.get('/api/example/account', (req, res) => {
  res.json({
    success: true,
    message: 'Part 1/4: Basic account endpoint',
    hint: 'Try /api/example/transactions'
  });
});

app.get('/api/example/transactions', (req, res) => {
  res.json({
    success: true,
    message: 'Part 2/4: Transaction history endpoint',
    hint: 'Check /api/example/rewards',
    recent_count: 5
  });
});

app.get('/api/example/rewards', (req, res) => {
  res.json({
    success: true,
    message: 'Part 3/4: Rewards endpoint',
    hint: 'There might be a debug endpoint',
    points: 1250
  });
});

app.get('/api/example/debug', (req, res) => {
  res.json({
    success: true,
    message: 'Part 4/4: Debug endpoint discovered!',
    flag: 'NSA{D3S1GN_FL4WS_F0UND}',
    account: {
      id: 'ACC-12345',
      balance: 1000.00,
      rewards_points: 1250,
      status: 'Active'
    },
    available_endpoints: [
      '/api/verify-pin',
      '/api/checkout',
      '/api/withdraw'
    ]
  });
});

// Lab 1 - Rate Limiting Bypass (PIN Verification)
app.get('/lab1', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SecureBank PIN Verification</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>🔐 ACCOUNT PIN VERIFICATION</h1>
        <div class="nav-links">
          <a href="/">�� Home</a>
        </div>

        <div class="challenge" style="margin: 30px 0;">
          <h2>Verify Your Account PIN</h2>
          <p>Enter your 4-digit PIN to access your account. For security, your account will be locked after too many failed attempts.</p>
          
          <div style="background: white; padding: 30px; border-radius: 10px; max-width: 400px; margin: 30px auto;">
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #2B2D42;">Account ID:</label>
              <input type="text" id="account-id" value="ACC-12345" style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 1em;">
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 10px; font-weight: 600; color: #2B2D42;">PIN Code:</label>
              <input type="password" id="pin-code" placeholder="Enter 4-digit PIN" maxlength="4" style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 1.5em; text-align: center; letter-spacing: 10px;">
            </div>
            
            <button onclick="verifyPin()" style="width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 1.1em; font-weight: 600; cursor: pointer;">
              Verify PIN
            </button>
            
            <div id="attempt-counter" style="margin-top: 15px; text-align: center; color: #666; font-size: 0.9em;">
              Attempts: 0
            </div>
          </div>
          
          <div id="verification-result" style="margin-top: 30px;"></div>
          
          <div class="hint-box" style="margin-top: 30px;">
            <strong>💡 Discovery Tip:</strong> Use automation tools or scripts to test multiple PIN combinations. The PIN is a 4-digit number (0000-9999).<br>
            Try using curl, Python requests, or browser automation to test rapidly.
          </div>
        </div>
      </div>

      <script>
        let attemptCount = 0;
        
        async function verifyPin() {
          const accountId = document.getElementById('account-id').value;
          const pin = document.getElementById('pin-code').value;
          const resultDiv = document.getElementById('verification-result');
          
          if (!pin || pin.length !== 4) {
            resultDiv.innerHTML = '<div style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 8px;">Please enter a 4-digit PIN</div>';
            return;
          }
          
          attemptCount++;
          document.getElementById('attempt-counter').textContent = \`Attempts: \${attemptCount}\`;
          
          try {
            const response = await fetch('/api/verify-pin', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ account_id: accountId, pin: pin })
            });
            
            const data = await response.json();
            
            if (data.flag) {
              resultDiv.innerHTML = \`
                <div style="background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; padding: 25px; border-radius: 10px;">
                  <h3>🎯 Access Granted!</h3>
                  <p style="font-size: 1.3em; font-weight: bold; margin: 15px 0;">\${data.flag}</p>
                  <p>\${data.message}</p>
                  <p style="margin-top: 15px; font-size: 0.9em;">Total attempts: \${attemptCount}</p>
                </div>
              \`;
            } else {
              resultDiv.innerHTML = \`
                <div style="background: #ffebee; color: #c62828; padding: 20px; border-radius: 8px;">
                  <h4>❌ Access Denied</h4>
                  <p>\${data.message || 'Invalid PIN'}</p>
                </div>
              \`;
            }
          } catch (error) {
            resultDiv.innerHTML = '<div style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 8px;">Connection error</div>';
          }
        }
        
        document.getElementById('pin-code').addEventListener('keypress', (e) => {
          if (e.key === 'Enter') verifyPin();
        });
      </script>
    </body>
    </html>
  `);
});

// Lab 1 API - VULNERABLE: No rate limiting on PIN verification
app.post('/api/verify-pin', (req, res) => {
  const { account_id, pin } = req.body;
  
  if (!account_id || !pin) {
    return res.status(400).json({
      success: false,
      message: 'Missing account_id or pin'
    });
  }
  
  // VULNERABLE: No rate limiting, no account lockout, no delay between attempts
  // Allows unlimited brute force attempts on 4-digit PIN
  
  const VALID_PIN = '1035';
  
  if (pin === VALID_PIN) {
    return res.json({
      success: true,
      flag: 'NSA{N0_R4T3_L1M1T}',
      message: 'PIN verified successfully! The system had no rate limiting, allowing unlimited brute force attempts.',
      account_id: account_id,
      access_granted: true,
      vulnerability: 'No rate limiting allows attackers to try all 10,000 possible 4-digit PINs'
    });
  }
  
  res.status(401).json({
    success: false,
    message: 'Invalid PIN',
    hint: 'Try more combinations. There is no rate limiting preventing brute force attacks.'
  });
});

// Lab 2 - Business Logic Flaw (Discount Stacking)
app.get('/lab2', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SecureBank Checkout</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>🛒 CHECKOUT & PAYMENT</h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
        </div>

        <div class="challenge" style="margin: 30px 0;">
          <h2>Complete Your Purchase</h2>
          <p>Review your cart and apply promo codes for additional savings.</p>
          
          <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 30px auto;">
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="margin-top: 0;">Shopping Cart</h3>
              <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #ddd;">
                <span>Premium Account Upgrade</span>
                <span style="font-weight: bold;">$99.99</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0;">
                <span style="font-size: 1.2em; font-weight: bold;">Subtotal:</span>
                <span id="cart-total" style="font-size: 1.2em; font-weight: bold; color: #667eea;">$99.99</span>
              </div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 10px; font-weight: 600;">Promo Codes:</label>
              <input type="text" id="promo-codes" placeholder="Enter codes (comma-separated)" style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; margin-bottom: 10px;">
              <p style="color: #666; font-size: 0.9em; margin-bottom: 15px;">
                Available codes: <strong>SAVE20</strong> (20% off), <strong>FIRST10</strong> (10% off), <strong>VIP15</strong> (15% off)
              </p>
            </div>
            
            <button onclick="checkout()" style="width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 1.1em; font-weight: 600; cursor: pointer;">
              Apply Codes & Checkout
            </button>
          </div>
          
          <div id="checkout-result" style="margin-top: 30px;"></div>
          
          <div class="hint-box" style="margin-top: 30px;">
            <strong>💡 Discovery Tip:</strong> Test how the system handles multiple discount codes. What happens if you apply the same code multiple times?<br>
            Try: <code>SAVE20,SAVE20,SAVE20</code> or similar combinations.
          </div>
        </div>
      </div>

      <script>
        async function checkout() {
          const promoCodes = document.getElementById('promo-codes').value
            .split(',')
            .map(c => c.trim())
            .filter(c => c.length > 0);
          
          const resultDiv = document.getElementById('checkout-result');
          const cartTotal = 99.99;
          
          if (promoCodes.length === 0) {
            resultDiv.innerHTML = '<div style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 8px;">Please enter at least one promo code</div>';
            return;
          }
          
          try {
            const response = await fetch('/api/checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cart_total: cartTotal, promo_codes: promoCodes })
            });
            
            const data = await response.json();
            
            let html = '<div style="background: white; padding: 25px; border-radius: 10px; border: 2px solid #ddd;">';
            html += '<h3 style="margin-top: 0;">Order Summary</h3>';
            html += \`<div style="margin: 15px 0;"><strong>Original Total:</strong> $\${cartTotal.toFixed(2)}</div>\`;
            
            if (data.discounts_applied && data.discounts_applied.length > 0) {
              html += '<div style="margin: 15px 0;"><strong>Discounts Applied:</strong><ul style="margin: 10px 0;">';
              data.discounts_applied.forEach(d => {
                html += \`<li>\${d.code}: -$\${d.amount.toFixed(2)}</li>\`;
              });
              html += '</ul></div>';
            }
            
            html += \`<div style="margin: 15px 0; font-size: 1.3em;"><strong>Final Total:</strong> <span style="color: \${data.final_total <= 0 ? '#4caf50' : '#667eea'}; font-weight: bold;">$\${data.final_total.toFixed(2)}</span></div>\`;
            html += '</div>';
            
            if (data.flag) {
              html += \`
                <div style="background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; padding: 25px; border-radius: 10px; margin-top: 20px;">
                  <h3>🎯 Logic Flaw Exploited!</h3>
                  <p style="font-size: 1.3em; font-weight: bold; margin: 15px 0;">\${data.flag}</p>
                  <p>\${data.message}</p>
                </div>
              \`;
            }
            
            resultDiv.innerHTML = html;
          } catch (error) {
            resultDiv.innerHTML = '<div style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 8px;">Connection error</div>';
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Lab 2 API - VULNERABLE: No validation preventing duplicate promo codes
app.post('/api/checkout', (req, res) => {
  const { cart_total, promo_codes } = req.body;
  
  if (!cart_total || !promo_codes || !Array.isArray(promo_codes)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request format'
    });
  }
  
  const VALID_CODES = {
    'SAVE20': { type: 'percent', value: 20 },
    'FIRST10': { type: 'percent', value: 10 },
    'VIP15': { type: 'percent', value: 15 }
  };
  
  let finalTotal = cart_total;
  const discountsApplied = [];
  
  // VULNERABLE: No check for duplicate codes - same code can be applied multiple times
  promo_codes.forEach(code => {
    const upperCode = code.toUpperCase();
    if (VALID_CODES[upperCode]) {
      const discount = VALID_CODES[upperCode];
      const amount = (cart_total * discount.value) / 100;
      finalTotal -= amount;
      discountsApplied.push({
        code: upperCode,
        amount: amount
      });
    }
  });
  
  // Check if logic flaw was exploited (total discount > 100%)
  const totalDiscount = discountsApplied.reduce((sum, d) => sum + d.amount, 0);
  const discountPercent = (totalDiscount / cart_total) * 100;
  
  if (discountPercent >= 100 || finalTotal <= 0) {
    return res.json({
      success: true,
      flag: 'NSA{L0G1C_FL4W_F0UND}',
      message: 'Business logic flaw exploited! The system allowed the same promo code to be applied multiple times, resulting in over 100% discount.',
      cart_total: cart_total,
      discounts_applied: discountsApplied,
      total_discount: totalDiscount.toFixed(2),
      discount_percent: discountPercent.toFixed(1) + '%',
      final_total: Math.max(0, finalTotal),
      vulnerability: 'No validation to prevent duplicate promo codes from being applied'
    });
  }
  
  res.json({
    success: true,
    cart_total: cart_total,
    discounts_applied: discountsApplied,
    final_total: Math.max(0, finalTotal)
  });
});

// Lab 3 - Race Condition (Concurrent Withdrawals)
let accountBalance = 1000.00;

app.get('/lab3', (req, res) => {
  // Reset balance on page load
  accountBalance = 1000.00;
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SecureBank Account Withdrawal</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>💰 ACCOUNT WITHDRAWAL</h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
        </div>

        <div class="challenge" style="margin: 30px 0;">
          <h2>Withdraw Funds</h2>
          <p>Make a withdrawal from your account balance.</p>
          
          <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; margin: 30px auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
              <div style="font-size: 0.9em; margin-bottom: 5px;">Current Balance</div>
              <div id="balance-display" style="font-size: 2em; font-weight: bold;">$1,000.00</div>
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 10px; font-weight: 600;">Withdrawal Amount:</label>
              <input type="number" id="withdraw-amount" value="200" min="1" step="0.01" style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 1.2em;">
            </div>
            
            <button onclick="withdraw()" style="width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 1.1em; font-weight: 600; cursor: pointer; margin-bottom: 10px;">
              Withdraw Funds
            </button>
            
            <button onclick="simultaneousWithdraw()" style="width: 100%; padding: 15px; background: linear-gradient(135deg, #ff6b6b 0%, #c92a2a 100%); color: white; border: none; border-radius: 8px; font-size: 1.1em; font-weight: 600; cursor: pointer;">
              ⚡ Test: Make 10 Simultaneous Requests
            </button>
            
            <button onclick="refreshBalance()" style="width: 100%; padding: 10px; background: #f5f5f5; color: #333; border: 2px solid #ddd; border-radius: 8px; font-size: 0.9em; font-weight: 600; cursor: pointer; margin-top: 15px;">
              🔄 Refresh Balance
            </button>
          </div>
          
          <div id="withdraw-result" style="margin-top: 30px;"></div>
          
          <div class="hint-box" style="margin-top: 30px;">
            <strong>💡 Discovery Tip:</strong> The system checks balance before processing withdrawal, but doesn't lock the account during the transaction.<br>
            What happens if you send multiple withdrawal requests at exactly the same time? Try the "10 Simultaneous Requests" button!
          </div>
        </div>
      </div>

      <script>
        async function refreshBalance() {
          try {
            const response = await fetch('/api/balance');
            const data = await response.json();
            document.getElementById('balance-display').textContent = '$' + data.balance.toFixed(2);
          } catch (error) {
            console.error('Error refreshing balance:', error);
          }
        }
        
        async function withdraw() {
          const amount = parseFloat(document.getElementById('withdraw-amount').value);
          const resultDiv = document.getElementById('withdraw-result');
          
          if (!amount || amount <= 0) {
            resultDiv.innerHTML = '<div style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 8px;">Please enter a valid amount</div>';
            return;
          }
          
          try {
            const response = await fetch('/api/withdraw', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ amount: amount })
            });
            
            const data = await response.json();
            
            if (data.flag) {
              resultDiv.innerHTML = \`
                <div style="background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; padding: 25px; border-radius: 10px;">
                  <h3>🎯 Race Condition Exploited!</h3>
                  <p style="font-size: 1.3em; font-weight: bold; margin: 15px 0;">\${data.flag}</p>
                  <p>\${data.message}</p>
                  <p style="margin-top: 15px;">Final Balance: $\${data.balance.toFixed(2)}</p>
                </div>
              \`;
            } else if (data.success) {
              resultDiv.innerHTML = \`
                <div style="background: #e3f2fd; color: #1976d2; padding: 20px; border-radius: 8px;">
                  <h4>✓ Withdrawal Successful</h4>
                  <p>Amount withdrawn: $\${amount.toFixed(2)}</p>
                  <p>New balance: $\${data.balance.toFixed(2)}</p>
                </div>
              \`;
            } else {
              resultDiv.innerHTML = \`
                <div style="background: #ffebee; color: #c62828; padding: 20px; border-radius: 8px;">
                  <h4>❌ Withdrawal Failed</h4>
                  <p>\${data.message}</p>
                </div>
              \`;
            }
            
            refreshBalance();
          } catch (error) {
            resultDiv.innerHTML = '<div style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 8px;">Connection error</div>';
          }
        }
        
        async function simultaneousWithdraw() {
          const amount = parseFloat(document.getElementById('withdraw-amount').value);
          const resultDiv = document.getElementById('withdraw-result');
          
          resultDiv.innerHTML = '<div style="background: #fff3e0; color: #f57c00; padding: 20px; border-radius: 8px;">⚡ Sending 10 simultaneous withdrawal requests...</div>';
          
          // Send 10 requests simultaneously to trigger race condition
          const promises = [];
          for (let i = 0; i < 10; i++) {
            promises.push(
              fetch('/api/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amount })
              }).then(r => r.json())
            );
          }
          
          try {
            const results = await Promise.all(promises);
            const successful = results.filter(r => r.success).length;
            const flagFound = results.find(r => r.flag);
            
            if (flagFound) {
              resultDiv.innerHTML = \`
                <div style="background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; padding: 25px; border-radius: 10px;">
                  <h3>🎯 Race Condition Exploited!</h3>
                  <p style="font-size: 1.3em; font-weight: bold; margin: 15px 0;">\${flagFound.flag}</p>
                  <p>\${flagFound.message}</p>
                  <p style="margin-top: 15px;">Successful withdrawals: \${successful}/10</p>
                  <p>Final Balance: $\${flagFound.balance.toFixed(2)}</p>
                </div>
              \`;
            } else {
              resultDiv.innerHTML = \`
                <div style="background: #fff3e0; color: #f57c00; padding: 20px; border-radius: 8px;">
                  <h4>Results</h4>
                  <p>Successful withdrawals: \${successful}/10</p>
                  <p>Try again or adjust the withdrawal amount</p>
                </div>
              \`;
            }
            
            refreshBalance();
          } catch (error) {
            resultDiv.innerHTML = '<div style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 8px;">Error during simultaneous requests</div>';
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Lab 3 APIs
app.get('/api/balance', (req, res) => {
  res.json({
    success: true,
    balance: accountBalance
  });
});

app.post('/api/withdraw', async (req, res) => {
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid withdrawal amount'
    });
  }
  
  // VULNERABLE: Race condition - balance check happens before deduction
  // Multiple simultaneous requests can all pass the balance check before any deduction occurs
  
  // Check if sufficient balance (vulnerable check)
  if (accountBalance < amount) {
    return res.status(400).json({
      success: false,
      message: 'Insufficient funds',
      balance: accountBalance
    });
  }
  
  // Simulate processing delay (makes race condition more likely)
  await new Promise(resolve => setTimeout(resolve, 10));
  
  // Deduct amount (happens after check, allowing race condition)
  accountBalance -= amount;
  
  // Check if account went negative (race condition exploited)
  if (accountBalance < 0) {
    return res.json({
      success: true,
      flag: 'NSA{R4C3_C0ND1T10N_3XPL01T3D}',
      message: 'Race condition exploited! Multiple simultaneous withdrawals caused the account balance to go negative. The system lacked proper transaction locking.',
      amount_withdrawn: amount,
      balance: accountBalance,
      vulnerability: 'No transaction locking allows concurrent requests to bypass balance validation'
    });
  }
  
  res.json({
    success: true,
    message: 'Withdrawal successful',
    amount_withdrawn: amount,
    balance: accountBalance
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\x1b[32m
╔════════════════════════════════════════════╗
║   🏦 SecureBank Online Banking            ║
║   Server running on port ${PORT}              ║
║                                            ║
║   Access: http://localhost:${PORT}            ║
╚════════════════════════════════════════════╝

Available pages:
  http://localhost:${PORT}/ - Home
  http://localhost:${PORT}/example - Account Dashboard Discovery
  http://localhost:${PORT}/lab1 - Lab 1: Rate Limiting Bypass
  http://localhost:${PORT}/lab2 - Lab 2: Logic Flaw (Discount Stacking)
  http://localhost:${PORT}/lab3 - Lab 3: Race Condition
\x1b[0m`);
});
