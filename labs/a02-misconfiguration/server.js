const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A02: Security Misconfiguration Lab</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .vulnerable { background: #ffcccc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .secure { background: #ccffcc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .info { background: #cce5ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 3px; overflow-x: auto; }
        h1 { color: #333; }
        h2 { color: #666; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>⚙️ A02: Security Misconfiguration</h1>
      <p><strong>Learning Objective:</strong> Understand how misconfigurations expose sensitive information and attack surfaces.</p>
      
      <div class="info">
        <h2>What is Security Misconfiguration?</h2>
        <p>Security misconfiguration includes:</p>
        <ul>
          <li>Debug mode enabled in production</li>
          <li>Default credentials</li>
          <li>Unnecessary features enabled</li>
          <li>Verbose error messages</li>
          <li>Missing security headers</li>
        </ul>
      </div>

      <div class="vulnerable">
        <h2>❌ Misconfiguration Examples</h2>
        
        <h3>1. Debug Endpoint Exposed</h3>
        <button onclick="testDebug()">Access Debug Info</button>
        <div id="debug-result"></div>
        
        <h3>2. Stack Traces in Production</h3>
        <button onclick="testError()">Trigger Error</button>
        <div id="error-result"></div>
        
        <h3>3. Server Info Leaked</h3>
        <p>Check the response headers - the X-Powered-By header reveals technology stack!</p>
        <button onclick="checkHeaders()">Check Headers</button>
        <div id="headers-result"></div>
      </div>

      <div class="secure">
        <h2>✅ Proper Configuration</h2>
        <ul>
          <li>Disable debug endpoints in production</li>
          <li>Remove or obscure technology headers</li>
          <li>Use generic error messages</li>
          <li>Implement security headers (CSP, HSTS, X-Frame-Options)</li>
          <li>Keep software updated</li>
          <li>Disable unnecessary features</li>
        </ul>
      </div>

      <div class="info">
        <h2>📚 What You Learned</h2>
        <ul>
          <li>Misconfigurations can reveal sensitive system information</li>
          <li>Debug features should never be enabled in production</li>
          <li>Error messages should be generic for end users</li>
          <li>Security headers help prevent various attacks</li>
          <li>Regular security audits catch configuration issues</li>
        </ul>
      </div>

      <script>
        async function testDebug() {
          const result = await fetch('/debug');
          const data = await result.json();
          document.getElementById('debug-result').innerHTML = 
            '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        }

        async function testError() {
          try {
            const result = await fetch('/api/process');
            const data = await result.json();
            document.getElementById('error-result').innerHTML = 
              '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
          } catch (e) {
            document.getElementById('error-result').innerHTML = 
              '<pre>Error: ' + e.message + '</pre>';
          }
        }

        async function checkHeaders() {
          const result = await fetch('/');
          const headers = {};
          result.headers.forEach((value, key) => {
            headers[key] = value;
          });
          document.getElementById('headers-result').innerHTML = 
            '<pre>' + JSON.stringify(headers, null, 2) + '</pre>';
        }
      </script>
    </body>
    </html>
  `);
});

// VULNERABLE: Debug endpoint exposed
app.get('/debug', (req, res) => {
  res.json({
    vulnerability: 'Debug endpoint should not be accessible in production!',
    flag: 'NSA{DEBUG_1S_N0T_4_F3ATUR3}',
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime(),
    environmentVariables: process.env // This is especially dangerous!
  });
});

// VULNERABLE: Detailed error messages
app.get('/api/process', (req, res) => {
  try {
    // Simulating an error
    const data = null;
    const result = data.someProperty.nested; // Will throw
    res.json({ result });
  } catch (error) {
    // VULNERABLE: Exposing stack trace
    res.status(500).json({
      error: error.message,
      stack: error.stack,
      vulnerability: 'Stack traces expose application internals!'
    });
  }
});

// Health check (properly configured)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`A02 Lab running on port ${PORT}`);
});
