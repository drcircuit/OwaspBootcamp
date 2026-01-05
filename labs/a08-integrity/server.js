const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A08: Software and Data Integrity Failures Lab</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .vulnerable { background: #ffcccc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .secure { background: #ccffcc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 3px; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>📝 A08: Software and Data Integrity Failures</h1>
      <p><strong>Learning Objective:</strong> Understand integrity validation and secure update mechanisms.</p>
      
      <div class="vulnerable">
        <h2>❌ Integrity Failures</h2>
        <h3>1. Unsigned Updates</h3>
        <button onclick="checkUpdate()">Check for Updates</button>
        <div id="update-result"></div>
        
        <h3>2. No Checksum Verification</h3>
        <pre>
// Downloading update without verification
fetch('https://cdn.example.com/update.zip')
  .then(res => res.blob())
  .then(installUpdate); // ❌ No integrity check!
        </pre>
      </div>

      <div class="secure">
        <h2>✅ Secure Integrity Practices</h2>
        <ul>
          <li>Code signing for all deployments</li>
          <li>Checksum/hash verification</li>
          <li>Subresource Integrity (SRI) for CDN resources</li>
          <li>Secure CI/CD pipelines</li>
          <li>Immutable artifacts</li>
        </ul>
      </div>

      <script>
        async function checkUpdate() {
          const result = await fetch('/api/update/check');
          const data = await result.json();
          document.getElementById('update-result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
        }
      </script>
    </body>
    </html>
  `);
});

app.get('/api/update/check', (req, res) => {
  res.json({
    updateAvailable: true,
    version: '2.0.0',
    downloadUrl: 'https://cdn.example.com/app-2.0.0.zip',
    vulnerability: 'No signature or checksum provided!',
    secureAlternative: {
      downloadUrl: 'https://cdn.example.com/app-2.0.0.zip',
      sha256: 'abc123...',
      signature: 'RSA-signature...',
      publicKey: 'vendor-public-key'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`A08 Lab running on port ${PORT}`);
});
