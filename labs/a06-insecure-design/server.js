const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// State for Lab 1: Rate Limiting vulnerability
const orderAttempts = {};

// State for Lab 2: Logic Flaw vulnerability
const promoCodeUsage = {};

// State for Lab 3: Race Condition vulnerability
let accountBalances = {
  'customer123': 50.00
};
const orderHistory = [];

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

// Example page - Help & Info
app.get('/example', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TacoTruck Express - About Us</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>🌮 ABOUT TACOTRUCK EXPRESS</h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
        </div>

        <div class="section">
          <h2>Welcome to TacoTruck Express!</h2>
          <p>TacoTruck Express is a mobile food truck serving authentic Mexican street tacos. Our pre-order system lets customers place orders ahead of time, skip the line, and enjoy fresh tacos faster!</p>
        </div>

        <div class="section">
          <h2>Our Services</h2>
          <ul>
            <li><strong>Quick Orders:</strong> Place orders during lunch rush without waiting</li>
            <li><strong>Promo Codes:</strong> Various discounts for new customers, regulars, and special promotions</li>
            <li><strong>Loyalty Balance:</strong> Rewards program with account credits for frequent customers</li>
            <li><strong>Real-Time Processing:</strong> Instant order confirmation and payment processing</li>
          </ul>
        </div>

        <div class="section">
          <h2>How It Works</h2>
          <p><strong>1. Browse Menu:</strong> Check out our selection of authentic street tacos</p>
          <p><strong>2. Place Order:</strong> Use our online system to order ahead</p>
          <p><strong>3. Apply Rewards:</strong> Use promo codes or loyalty balance</p>
          <p><strong>4. Pick Up:</strong> Skip the line and grab your fresh tacos!</p>
        </div>

        <div class="lab-info">
          <h3>🎯 Ready to Order?</h3>
          <p>Try our ordering system and see how easy it is to get delicious tacos on the go!</p>
        </div>

        <div class="nav-links">
          <a href="/lab1">Start Ordering →</a>
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
      <title>Lab 1 - Order System</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>🌮 LAB 1: ORDER SYSTEM <span class="difficulty easy">EASY</span></h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/example">📚 Tutorial</a>
        </div>

        <div class="lab-info">
          <h3>🎯 Your Mission</h3>
          <p><strong>Scenario:</strong> It's lunch rush! Test our rapid order system</p>
          <p><strong>Your Goal:</strong> Place multiple taco orders quickly</p>
          <p><strong>Reward:</strong> Capture the flag for extra guacamole!</p>
        </div>

        <div class="section">
          <h2>🌮 Challenge Description</h2>
          <p>TacoTruck Express prides itself on fast service. During lunch rush, customers can place multiple orders without waiting. Our system handles high-volume ordering!</p>
          <p>Your task: Test the order verification system. See if you can place orders as quickly as our system can handle them!</p>
        </div>

        <div class="hint-box">
          <strong>💡 Tips:</strong>
          <ul>
            <li>Our system prioritizes speed - no delays!</li>
            <li>Try making rapid order verifications to test system capacity</li>
            <li>Multiple requests help test our infrastructure</li>
          </ul>
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
      <title>Lab 2 - Discount Codes</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>🎯 LAB 2: DISCOUNT CODES <span class="difficulty medium">MEDIUM</span></h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/example">📚 Tutorial</a>
        </div>

        <div class="lab-info">
          <h3>🎯 Your Mission</h3>
          <p><strong>Scenario:</strong> Maximize your taco savings with promo codes!</p>
          <p><strong>Your Goal:</strong> Get free tacos or even earn credit</p>
          <p><strong>Reward:</strong> Free guacamole flag for savvy savers!</p>
        </div>

        <div class="section">
          <h2>🎟️ Challenge Description</h2>
          <p>TacoTruck Express loves rewarding customers with discount codes! Our checkout system allows you to apply multiple promo codes to get the best deal.</p>
          <p>Your task: Combine discount codes creatively to maximize your savings. Can you get an amazing deal on your taco order?</p>
        </div>

        <div class="section">
          <h2>🎟️ Available Promo Codes</h2>
          <ul style="font-size: 1.1em;">
            <li><code>FIRST5</code> - $5 off your order (new customers)</li>
            <li><code>TACO10</code> - 10% off (any customer)</li>
            <li><code>LUNCH15</code> - 15% off (lunch special)</li>
            <li><code>FREEGUAC</code> - $2.50 off (free guac promo)</li>
          </ul>
        </div>

        <div class="hint-box">
          <strong>💡 Tips:</strong>
          <ul>
            <li>Try different code combinations</li>
            <li>Experiment with applying codes in different orders</li>
            <li>See what happens when you stack multiple discounts</li>
          </ul>
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
      <title>Lab 3 - Account Balance</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <h1>🎯 LAB 3: ACCOUNT BALANCE <span class="difficulty hard">HARD</span></h1>
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/example">📚 Tutorial</a>
        </div>

        <div class="lab-info">
          <h3>🎯 Your Mission</h3>
          <p><strong>Scenario:</strong> Use your $50 loyalty rewards wisely!</p>
          <p><strong>Your Goal:</strong> Get more tacos than your balance allows</p>
          <p><strong>Reward:</strong> Extra tacos flag for clever customers!</p>
        </div>

        <div class="section">
          <h2>💰 Challenge Description</h2>
          <p>TacoTruck Express rewards loyal customers with account credits. Your account has a $50.00 balance that you can use for orders. The system processes payments in real-time!</p>
          <p>Your task: Try to place multiple orders at the same time. Our fast system might process them all if you're quick enough!</p>
        </div>
