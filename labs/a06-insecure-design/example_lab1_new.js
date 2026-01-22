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

