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

