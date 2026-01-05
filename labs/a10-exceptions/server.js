const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A10: Mishandling of Exceptional Conditions Lab</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .vulnerable { background: #ffcccc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .secure { background: #ccffcc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 3px; overflow-x: auto; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>⚠️ A10: Mishandling of Exceptional Conditions</h1>
      <p><strong>Learning Objective:</strong> Understand how poor error handling exposes vulnerabilities.</p>
      
      <div class="vulnerable">
        <h2>❌ Poor Exception Handling</h2>
        
        <h3>1. Stack Trace Exposure</h3>
        <button onclick="triggerError()">Trigger Error</button>
        <div id="error-result"></div>
        
        <h3>2. Unhandled Exceptions</h3>
        <button onclick="triggerCrash()">Trigger Crash</button>
        <div id="crash-result"></div>
      </div>

      <div class="secure">
        <h2>✅ Proper Exception Handling</h2>
        <button onclick="triggerSecureError()">Secure Error Handling</button>
        <div id="secure-result"></div>
        
        <h3>Best Practices:</h3>
        <ul>
          <li>Use generic error messages for users</li>
          <li>Log detailed errors server-side only</li>
          <li>Implement global exception handlers</li>
          <li>Fail securely (deny access on error)</li>
          <li>Test error conditions</li>
        </ul>
      </div>

      <script>
        async function triggerError() {
          try {
            const result = await fetch('/api/vulnerable/error');
            const data = await result.json();
            document.getElementById('error-result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
          } catch (e) {
            document.getElementById('error-result').innerHTML = '<pre>Error: ' + e.message + '</pre>';
          }
        }

        async function triggerCrash() {
          try {
            const result = await fetch('/api/vulnerable/crash');
            const data = await result.json();
            document.getElementById('crash-result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
          } catch (e) {
            document.getElementById('crash-result').innerHTML = '<pre>Server Error: ' + e.message + '</pre>';
          }
        }

        async function triggerSecureError() {
          const result = await fetch('/api/secure/error');
          const data = await result.json();
          document.getElementById('secure-result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        }
      </script>
    </body>
    </html>
  `);
});

// VULNERABLE: Exposes stack trace
app.get('/api/vulnerable/error', (req, res) => {
  try {
    const data = null;
    const result = data.someProperty.nested; // Will throw
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: error.stack,
      vulnerability: 'Full stack trace exposed to user!'
    });
  }
});

// VULNERABLE: Unhandled exception crashes server
app.get('/api/vulnerable/crash', (req, res) => {
  setTimeout(() => {
    throw new Error('Unhandled exception!');
  }, 100);
  res.json({ message: 'Request received' });
});

// SECURE: Generic error message
app.get('/api/secure/error', (req, res) => {
  try {
    const data = null;
    const result = data.someProperty.nested;
  } catch (error) {
    // Log detailed error server-side
    console.error('Error occurred:', error);
    // Return generic message to user
    res.status(500).json({
      error: 'An error occurred',
      message: 'Please try again later',
      note: 'Detailed error logged server-side only'
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`A10 Lab running on port \${PORT}\`);
});
