const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// State for Lab 1: Rate Limiting vulnerability
const transferAttempts = {};

// State for Lab 2: Logic Flaw vulnerability
const discountCodes = {
  'SAVE10': { discount: 10, used: false },
  'SAVE20': { discount: 20, used: false },
  'SAVE50': { discount: 50, used: false }
};

// State for Lab 3: Race Condition vulnerability
let accountBalance = 1000;
const withdrawalHistory = [];

// Cyberpunk theme styles
const styles = `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      background: linear-gradient(135deg, #0a0a0a 0%, #0a1a0a 100%);
      color: #00ff00;
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid #00ff00;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
    }
    h1 {
      color: #ff0055;
      text-shadow: 0 0 10px #ff0055;
      margin-bottom: 20px;
      font-size: 2.5em;
      text-align: center;
    }
    h2 {
      color: #00ffff;
      text-shadow: 0 0 10px #00ffff;
      margin-top: 30px;
      margin-bottom: 15px;
      border-bottom: 2px solid #00ffff;
      padding-bottom: 10px;
    }
    h3 {
      color: #ffaa00;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    p, li {
      line-height: 1.8;
      margin-bottom: 10px;
      color: #cccccc;
    }
    .nav-links {
      display: flex;
      gap: 20px;
      margin: 20px 0;
      flex-wrap: wrap;
    }
    .nav-links a {
      color: #00ff00;
      text-decoration: none;
      padding: 10px 20px;
      border: 2px solid #00ff00;
      border-radius: 5px;
      transition: all 0.3s;
      background: rgba(0, 255, 0, 0.1);
    }
    .nav-links a:hover {
      background: rgba(0, 255, 0, 0.3);
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
      transform: translateY(-2px);
    }
    .challenge {
      background-color: #0a0a0a;
      border: 2px solid #00ff00;
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
    }
    .challenge h3 {
      margin-top: 0;
      color: #00ff00;
      font-size: 1.5em;
    }
    .difficulty {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 3px;
      font-weight: bold;
      margin-left: 10px;
    }
    .easy { background-color: #00ff00; color: #000; }
    .medium { background-color: #ffaa00; color: #000; }
    .hard { background-color: #ff0000; color: #fff; }
    .example { background-color: #0088ff; color: #fff; }
    .section {
      background-color: #0a0a0a;
      border: 2px solid #00ff00;
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .good {
      background-color: #001a00;
      border-left: 4px solid #00ff00;
      padding: 15px;
      margin: 15px 0;
    }
    .bad {
      background-color: #1a0000;
      border-left: 4px solid #ff0000;
      padding: 15px;
      margin: 15px 0;
    }
    .lab-info {
      background: rgba(0, 255, 255, 0.1);
      border-left: 4px solid #00ffff;
      padding: 15px;
      margin: 20px 0;
    }
    .hint-box {
      background-color: #0a0a0a;
      border-left: 4px solid #ffaa00;
      padding: 15px;
      margin: 20px 0;
    }
    .endpoint {
      background: rgba(0, 100, 255, 0.2);
      border: 1px solid #0066ff;
      padding: 10px;
      border-radius: 5px;
      margin: 10px 0;
      color: #66ccff;
    }
    pre {
      background: #000;
      color: #00ff00;
      padding: 15px;
      border-radius: 5px;
      border: 1px solid #00ff00;
      overflow-x: auto;
      margin: 10px 0;
    }
    code {
      background: rgba(0, 255, 0, 0.1);
      color: #00ff00;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    ul {
      margin-left: 20px;
      margin-top: 10px;
    }
    a {
      color: #00ffff;
      text-decoration: none;
      border-bottom: 1px dotted #00ffff;
    }
    a:hover {
      color: #00ff00;
      border-bottom: 1px solid #00ff00;
    }
  </style>
`;

// Home page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A06: Insecure Design</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>🎨 A06: INSECURE DESIGN</h1>
        <p>Welcome to the Insecure Design training lab. Navigate through the stages to learn about design flaws and business logic vulnerabilities.</p>
        
        <div class="challenge">
          <h3>📚 Example - Insecure Design <span class="difficulty example">TUTORIAL</span></h3>
          <p>Learn about insecure design patterns, business logic flaws, and how proper threat modeling prevents vulnerabilities.</p>
          <p><a href="/example">→ Start Tutorial</a></p>
        </div>

        <div class="challenge">
          <h3>🎯 Lab 1 - Rate Limiting <span class="difficulty easy">EASY</span></h3>
          <p><strong>Stage:</strong> Recon</p>
          <p><strong>Description:</strong> Exploit missing rate limits on sensitive operations</p>
          <p><strong>Hint:</strong> No rate limiting means unlimited attempts</p>
          <p><strong>Flag:</strong> Capture the flag by bypassing rate limits</p>
          <p><a href="/lab1">→ Start Lab 1</a></p>
        </div>

        <div class="challenge">
          <h3>🎯 Lab 2 - Logic Flaw <span class="difficulty medium">MEDIUM</span></h3>
          <p><strong>Stage:</strong> Initial Access</p>
          <p><strong>Description:</strong> Exploit business logic flaws to gain unauthorized benefits</p>
          <p><strong>Hint:</strong> Business rules can be chained in unexpected ways</p>
          <p><strong>Flag:</strong> Capture the flag by exploiting the logic flaw</p>
          <p><a href="/lab2">→ Start Lab 2</a></p>
        </div>

        <div class="challenge">
          <h3>🎯 Lab 3 - Race Condition <span class="difficulty hard">HARD</span></h3>
          <p><strong>Stage:</strong> Maintained Access</p>
          <p><strong>Description:</strong> Exploit race conditions to duplicate funds</p>
          <p><strong>Hint:</strong> Concurrent requests can bypass balance checks</p>
          <p><strong>Flag:</strong> Capture the flag by winning the race</p>
          <p><a href="/lab3">→ Start Lab 3</a></p>
        </div>

        <p style="text-align: center; margin-top: 40px;">
          <a href="/">← Back to Portal</a>
        </p>
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
      <title>Example - Insecure Design</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>🎨 INSECURE DESIGN PATTERNS</h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
        </div>

        <div class="section">
          <h2>What is Insecure Design?</h2>
          <p>Insecure design represents missing or ineffective security controls in the design phase. Unlike implementation bugs, these are fundamental flaws in the architecture and business logic:</p>
          <ul>
            <li><strong>Missing Security Controls:</strong> Features without required security mechanisms</li>
            <li><strong>Business Logic Flaws:</strong> Workflows that can be abused in unexpected ways</li>
            <li><strong>Race Conditions:</strong> Time-of-check to time-of-use vulnerabilities</li>
            <li><strong>Improper Resource Limits:</strong> Missing rate limiting and throttling</li>
            <li><strong>Insufficient Validation:</strong> Business rule validation bypassed</li>
          </ul>
        </div>

        <div class="section">
          <h2>❌ Common Insecure Design Mistakes</h2>
          
          <h3>1. Missing Rate Limiting</h3>
          <div class="bad">
            <strong>Problem:</strong> No limits on sensitive operations
            <pre><code>app.post('/api/transfer', (req, res) => {
  const amount = req.body.amount;
  // VULNERABLE: No rate limiting!
  transferFunds(req.user.id, amount);
  res.json({ success: true });
});</code></pre>
            <p><strong>Impact:</strong> Attackers can spam requests, brute force passwords, or abuse functionality</p>
          </div>
          <div class="good">
            <strong>Solution:</strong> Implement rate limiting
            <pre><code>const rateLimit = require('express-rate-limit');

const transferLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each user to 5 requests per window
  message: 'Too many transfer attempts'
});

app.post('/api/transfer', transferLimiter, (req, res) => {
  const amount = req.body.amount;
  transferFunds(req.user.id, amount);
  res.json({ success: true });
});</code></pre>
          </div>

          <h3>2. Business Logic Flaws</h3>
          <div class="bad">
            <strong>Problem:</strong> Discount codes applied without validation
            <pre><code>app.post('/api/checkout', (req, res) => {
  let price = 100;
  const codes = req.body.discountCodes || [];
  
  // VULNERABLE: No check if codes already used!
  codes.forEach(code => {
    if (discounts[code]) {
      price -= discounts[code];
    }
  });
  
  res.json({ finalPrice: price });
});</code></pre>
            <p><strong>Impact:</strong> Users can apply the same discount multiple times or combine incompatible discounts</p>
          </div>
          <div class="good">
            <strong>Solution:</strong> Proper business logic validation
            <pre><code>app.post('/api/checkout', (req, res) => {
  let price = 100;
  const codes = req.body.discountCodes || [];
  const usedCodes = new Set();
  
  codes.forEach(code => {
    // Check if code exists and not already used
    if (discounts[code] && !usedCodes.has(code)) {
      price -= discounts[code];
      usedCodes.add(code);
      // Mark as used in database
      markCodeAsUsed(req.user.id, code);
    }
  });
  
  // Ensure price doesn't go negative
  price = Math.max(0, price);
  
  res.json({ finalPrice: price });
});</code></pre>
          </div>

          <h3>3. Race Conditions</h3>
          <div class="bad">
            <strong>Problem:</strong> Time-of-check to time-of-use gap
            <pre><code>app.post('/api/withdraw', async (req, res) => {
  const amount = req.body.amount;
  const balance = await getBalance(req.user.id);
  
  // VULNERABLE: Balance check is separate from withdrawal
  if (balance >= amount) {
    // Race condition window here!
    await withdraw(req.user.id, amount);
    res.json({ success: true });
  } else {
    res.json({ error: 'Insufficient funds' });
  }
});</code></pre>
            <p><strong>Impact:</strong> Multiple concurrent requests can withdraw more than available balance</p>
          </div>
          <div class="good">
            <strong>Solution:</strong> Atomic operations and locking
            <pre><code>app.post('/api/withdraw', async (req, res) => {
  const amount = req.body.amount;
  
  try {
    // Use atomic transaction with row locking
    await db.transaction(async (trx) => {
      const account = await trx('accounts')
        .where('user_id', req.user.id)
        .forUpdate() // Lock the row
        .first();
      
      if (account.balance < amount) {
        throw new Error('Insufficient funds');
      }
      
      await trx('accounts')
        .where('user_id', req.user.id)
        .decrement('balance', amount);
    });
    
    res.json({ success: true });
  } catch (error) {
    res.json({ error: error.message });
  }
});</code></pre>
          </div>
        </div>

        <div class="section">
          <h2>✅ Secure Design Principles</h2>
          <ul>
            <li><strong>Threat Modeling:</strong> Identify threats during design phase</li>
            <li><strong>Defense in Depth:</strong> Multiple layers of security controls</li>
            <li><strong>Secure by Default:</strong> Most secure configuration is the default</li>
            <li><strong>Fail Securely:</strong> Failures should deny access, not grant it</li>
            <li><strong>Complete Mediation:</strong> Check permissions on every access</li>
            <li><strong>Economy of Mechanism:</strong> Keep designs simple</li>
            <li><strong>Least Privilege:</strong> Minimal permissions required</li>
            <li><strong>Separation of Duties:</strong> No single person can compromise system</li>
          </ul>
        </div>

        <div class="section">
          <h2>🛠️ Prevention Strategies</h2>
          
          <h3>Rate Limiting & Throttling</h3>
          <ul>
            <li>Limit requests per IP address, user, or session</li>
            <li>Use exponential backoff for failed attempts</li>
            <li>Implement CAPTCHA after threshold</li>
            <li>Monitor for abuse patterns</li>
          </ul>

          <h3>Business Logic Security</h3>
          <ul>
            <li>Document all business rules and workflows</li>
            <li>Validate business constraints server-side</li>
            <li>Use state machines for complex workflows</li>
            <li>Test for logic flaws (combine steps in unexpected ways)</li>
            <li>Implement idempotency for critical operations</li>
          </ul>

          <h3>Concurrency Control</h3>
          <ul>
            <li>Use database transactions with proper isolation levels</li>
            <li>Implement row-level locking for critical data</li>
            <li>Use optimistic locking with version numbers</li>
            <li>Design for idempotent operations</li>
            <li>Test with concurrent requests</li>
          </ul>
        </div>

        <div class="lab-info">
          <h3>📝 Key Takeaways</h3>
          <ul>
            <li>Security must be considered during the design phase</li>
            <li>Business logic flaws are often harder to detect than technical bugs</li>
            <li>Rate limiting is essential for all sensitive operations</li>
            <li>Race conditions require atomic operations and proper locking</li>
            <li>Test your application with unexpected input combinations</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 1 page - Rate Limiting
app.get('/lab1', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 1 - Rate Limiting</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>🎯 LAB 1: RATE LIMITING <span class="difficulty easy">EASY</span></h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/example">📚 Tutorial</a>
        </div>

        <div class="lab-info">
          <h3>📋 Mission Brief</h3>
          <p><strong>Stage:</strong> Recon</p>
          <p><strong>Objective:</strong> Exploit missing rate limits on password verification</p>
          <p><strong>Flag:</strong> Will be revealed after multiple rapid attempts</p>
        </div>

        <div class="section">
          <h2>🎯 Challenge Description</h2>
          <p>The API has a PIN verification endpoint with no rate limiting. This allows unlimited brute force attempts without any throttling or account lockout.</p>
          <p>Your task is to make multiple rapid requests to the endpoint to capture the flag.</p>
        </div>

        <div class="endpoint">
          <strong>API Endpoint:</strong><br>
          <code>POST http://localhost:3006/api/lab1/verify-pin</code><br>
          <code>Content-Type: application/json</code><br><br>
          <strong>Body:</strong><br>
          <code>{"pin": "1234"}</code>
        </div>

        <div class="hint-box">
          <strong>💡 Hints:</strong>
          <ul>
            <li>The endpoint has no rate limiting at all</li>
            <li>Make at least 10 requests rapidly to trigger the flag</li>
            <li>You can use curl in a loop or write a simple script</li>
            <li>The actual PIN doesn't matter - just the number of attempts</li>
          </ul>
        </div>

        <div class="section">
          <h2>🛠️ Testing Instructions</h2>
          <p><strong>Using a bash loop:</strong></p>
          <pre><code>for i in {1..15}; do
  curl -X POST http://localhost:3006/api/lab1/verify-pin \\
    -H "Content-Type: application/json" \\
    -d '{"pin":"1234"}'
  echo ""
done</code></pre>
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 2 page - Logic Flaw
app.get('/lab2', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 2 - Logic Flaw</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>🎯 LAB 2: LOGIC FLAW <span class="difficulty medium">MEDIUM</span></h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/example">📚 Tutorial</a>
        </div>

        <div class="lab-info">
          <h3>📋 Mission Brief</h3>
          <p><strong>Stage:</strong> Initial Access</p>
          <p><strong>Objective:</strong> Exploit business logic flaw in discount code system</p>
          <p><strong>Flag:</strong> Will be revealed when you get an item for free or negative price</p>
        </div>

        <div class="section">
          <h2>🎯 Challenge Description</h2>
          <p>The shopping cart API allows users to apply multiple discount codes. However, there's a flaw in the business logic that doesn't properly validate discount combinations.</p>
          <p>Your task is to combine discount codes in a way that gets you an item for free or with a negative price (giving you money).</p>
        </div>

        <div class="endpoint">
          <strong>API Endpoint:</strong><br>
          <code>POST http://localhost:3006/api/lab2/checkout</code><br>
          <code>Content-Type: application/json</code><br><br>
          <strong>Body:</strong><br>
          <code>{"price": 100, "discountCodes": ["SAVE10", "SAVE20"]}</code>
        </div>

        <div class="section">
          <h2>Available Discount Codes</h2>
          <ul>
            <li><code>SAVE10</code> - 10% off ($10 discount on $100 item)</li>
            <li><code>SAVE20</code> - 20% off ($20 discount on $100 item)</li>
            <li><code>SAVE50</code> - 50% off ($50 discount on $100 item)</li>
          </ul>
        </div>

        <div class="hint-box">
          <strong>💡 Hints:</strong>
          <ul>
            <li>Can you apply the same discount code multiple times?</li>
            <li>What happens if you apply all codes together?</li>
            <li>Think about the order of operations</li>
            <li>Can you make the final price negative?</li>
          </ul>
        </div>

        <div class="section">
          <h2>🛠️ Testing Instructions</h2>
          <p><strong>Using curl:</strong></p>
          <pre><code>curl -X POST http://localhost:3006/api/lab2/checkout \\
  -H "Content-Type: application/json" \\
  -d '{"price": 100, "discountCodes": ["SAVE10"]}'</code></pre>
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 3 page - Race Condition
app.get('/lab3', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 3 - Race Condition</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>🎯 LAB 3: RACE CONDITION <span class="difficulty hard">HARD</span></h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/example">📚 Tutorial</a>
        </div>

        <div class="lab-info">
          <h3>📋 Mission Brief</h3>
          <p><strong>Stage:</strong> Maintained Access</p>
          <p><strong>Objective:</strong> Exploit race condition to withdraw more than available balance</p>
          <p><strong>Flag:</strong> Will be revealed when total withdrawals exceed initial balance</p>
        </div>

        <div class="section">
          <h2>🎯 Challenge Description</h2>
          <p>The banking API has a withdrawal endpoint that checks your balance before processing. However, there's a time gap between checking the balance and actually withdrawing the funds.</p>
          <p>Your task is to send multiple concurrent withdrawal requests to exploit this race condition and withdraw more money than you actually have.</p>
        </div>

        <div class="endpoint">
          <strong>API Endpoints:</strong><br>
          <code>GET http://localhost:3006/api/lab3/balance</code> - Check current balance<br>
          <code>POST http://localhost:3006/api/lab3/withdraw</code> - Withdraw funds<br>
          <code>Content-Type: application/json</code><br><br>
          <strong>Withdraw Body:</strong><br>
          <code>{"amount": 300}</code>
        </div>

        <div class="section">
          <h2>Account Information</h2>
          <ul>
            <li><strong>Initial Balance:</strong> $1000</li>
            <li><strong>Withdrawal Amount:</strong> Try withdrawing $300 per request</li>
            <li><strong>Goal:</strong> Withdraw more than $1000 total</li>
          </ul>
        </div>

        <div class="hint-box">
          <strong>💡 Hints:</strong>
          <ul>
            <li>You need to send multiple requests at the exact same time</li>
            <li>All requests should pass the balance check before any completes</li>
            <li>Use tools that support concurrent requests (curl with &, xargs -P, or a script)</li>
            <li>Try sending 4 withdrawal requests of $300 simultaneously</li>
          </ul>
        </div>

        <div class="section">
          <h2>🛠️ Testing Instructions</h2>
          <p><strong>Using bash with concurrent curl:</strong></p>
          <pre><code># Send 4 concurrent $300 withdrawals
for i in {1..4}; do
  curl -X POST http://localhost:3006/api/lab3/withdraw \\
    -H "Content-Type: application/json" \\
    -d '{"amount": 300}' &
done
wait

# Check the result
curl http://localhost:3006/api/lab3/balance</code></pre>

          <p><strong>Or using a simple Python script:</strong></p>
          <pre><code>import requests
import concurrent.futures

def withdraw():
    return requests.post('http://localhost:3006/api/lab3/withdraw',
                        json={'amount': 300})

with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
    futures = [executor.submit(withdraw) for _ in range(4)]
    results = [f.result().json() for f in futures]

for r in results:
    print(r)</code></pre>
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// LAB 1: Rate Limiting vulnerability
app.post('/api/lab1/verify-pin', (req, res) => {
  const { pin } = req.body;
  const clientIp = req.ip || 'unknown';
  
  // Track attempts (but don't actually limit them - that's the vulnerability!)
  if (!transferAttempts[clientIp]) {
    transferAttempts[clientIp] = [];
  }
  
  // Clean up old attempts (older than 1 hour) to prevent memory leaks
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  transferAttempts[clientIp] = transferAttempts[clientIp].filter(timestamp => timestamp > oneHourAgo);
  
  transferAttempts[clientIp].push(Date.now());
  const attemptCount = transferAttempts[clientIp].length;
  
  // VULNERABLE: No rate limiting!
  if (attemptCount >= 10) {
    return res.json({
      success: false,
      message: 'Invalid PIN',
      attempts: attemptCount,
      flag: 'NSA{R4T3_L1M1T_M1SS1NG}',
      vulnerability: 'No rate limiting allows unlimited brute force attempts!',
      explanation: 'You made ' + attemptCount + ' attempts with no throttling or account lockout'
    });
  }
  
  res.json({
    success: false,
    message: 'Invalid PIN',
    attempts: attemptCount,
    hint: 'Keep trying! No rate limiting in place. Make at least 10 attempts.'
  });
});

// LAB 2: Business Logic Flaw
app.post('/api/lab2/checkout', (req, res) => {
  let { price, discountCodes } = req.body;
  
  if (!price || !discountCodes || !Array.isArray(discountCodes)) {
    return res.json({
      error: 'Invalid request',
      example: '{"price": 100, "discountCodes": ["SAVE10", "SAVE20"]}'
    });
  }
  
  const originalPrice = price;
  const discountsApplied = [];
  
  // VULNERABLE: No validation that codes can't be reused!
  discountCodes.forEach(code => {
    if (code === 'SAVE10') {
      price -= 10;
      discountsApplied.push('SAVE10 (-$10)');
    } else if (code === 'SAVE20') {
      price -= 20;
      discountsApplied.push('SAVE20 (-$20)');
    } else if (code === 'SAVE50') {
      price -= 50;
      discountsApplied.push('SAVE50 (-$50)');
    }
  });
  
  const response = {
    originalPrice: originalPrice,
    discountsApplied: discountsApplied,
    finalPrice: price,
    totalDiscount: originalPrice - price
  };
  
  // Award flag if price is 0 or negative
  if (price <= 0) {
    response.flag = 'NSA{L0G1C_FL4W_3XPL01T3D}';
    response.vulnerability = 'Business logic flaw: Same discount code can be applied multiple times!';
    response.explanation = 'You exploited the missing validation to apply codes multiple times';
  } else if (discountsApplied.length > 1) {
    response.hint = 'You can apply multiple codes, but can you get it for free or negative price?';
  } else {
    response.hint = 'Try applying multiple discount codes. Can you use the same code twice?';
  }
  
  res.json(response);
});

// LAB 3: Race Condition - Check Balance
app.get('/api/lab3/balance', (req, res) => {
  res.json({
    balance: accountBalance,
    withdrawalHistory: withdrawalHistory,
    totalWithdrawn: withdrawalHistory.reduce((sum, w) => sum + w.amount, 0)
  });
});

// LAB 3: Race Condition - Reset Balance
app.post('/api/lab3/reset', (req, res) => {
  accountBalance = 1000;
  withdrawalHistory.length = 0;
  res.json({
    message: 'Balance reset to $1000',
    balance: accountBalance
  });
});

// LAB 3: Race Condition vulnerability
app.post('/api/lab3/withdraw', async (req, res) => {
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.json({
      success: false,
      error: 'Invalid withdrawal amount'
    });
  }
  
  // VULNERABLE: Check balance BEFORE modifying it
  // This creates a race condition window
  if (accountBalance >= amount) {
    // Simulate processing delay (makes race condition easier to exploit)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // VULNERABLE: Another request could have passed the check above
    accountBalance -= amount;
    
    const withdrawal = {
      amount: amount,
      timestamp: new Date().toISOString(),
      balanceAfter: accountBalance
    };
    
    withdrawalHistory.push(withdrawal);
    
    const totalWithdrawn = withdrawalHistory.reduce((sum, w) => sum + w.amount, 0);
    
    const response = {
      success: true,
      message: 'Withdrawal successful',
      amount: amount,
      balanceAfter: accountBalance,
      totalWithdrawn: totalWithdrawn
    };
    
    // Award flag if total withdrawn exceeds initial balance
    if (totalWithdrawn > 1000) {
      response.flag = 'NSA{R4C3_C0ND1T10N_W0N}';
      response.vulnerability = 'Race condition exploited!';
      response.explanation = 'You withdrew $' + totalWithdrawn + ' from an account with only $1000 initial balance';
    } else if (accountBalance < 0) {
      response.hint = 'Balance is negative but total not enough yet. Try more concurrent requests!';
    }
    
    res.json(response);
  } else {
    res.json({
      success: false,
      error: 'Insufficient funds',
      balance: accountBalance,
      requested: amount,
      hint: 'Send multiple withdrawal requests at the exact same time to exploit the race condition'
    });
  }
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    service: 'Insecure Design Lab',
    port: PORT,
    version: '1.0.0',
    labs: {
      lab1: 'Rate Limiting',
      lab2: 'Logic Flaw',
      lab3: 'Race Condition'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`A06: Insecure Design Lab running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('  http://localhost:3006/ - Home');
  console.log('  http://localhost:3006/example - Tutorial');
  console.log('  http://localhost:3006/lab1 - Rate Limiting Lab');
  console.log('  http://localhost:3006/lab2 - Logic Flaw Lab');
  console.log('  http://localhost:3006/lab3 - Race Condition Lab');
});
