const express = require('express');
const multer = require('multer');
const app = express();
const PORT = 3008;

app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const cyberpunkStyles = `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a001a 100%);
      color: #00ff41;
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid #ff00ff;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
    }
    h1 {
      color: #ff00ff;
      text-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff;
      margin-bottom: 10px;
      font-size: 2.5em;
      text-align: center;
    }
    h2 {
      color: #00ffff;
      text-shadow: 0 0 10px #00ffff;
      margin: 30px 0 15px 0;
      font-size: 1.8em;
      border-bottom: 2px solid #00ffff;
      padding-bottom: 10px;
    }
    h3 {
      color: #ffff00;
      text-shadow: 0 0 5px #ffff00;
      margin: 20px 0 10px 0;
      font-size: 1.3em;
    }
    .subtitle {
      text-align: center;
      color: #00ff41;
      margin-bottom: 30px;
      font-size: 1.1em;
    }
    .nav-links {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 30px 0;
      flex-wrap: wrap;
    }
    .nav-links a {
      color: #00ffff;
      text-decoration: none;
      padding: 12px 25px;
      border: 2px solid #00ffff;
      border-radius: 5px;
      transition: all 0.3s;
      text-shadow: 0 0 5px #00ffff;
    }
    .nav-links a:hover {
      background: #00ffff;
      color: #000;
      box-shadow: 0 0 20px #00ffff;
    }
    .vulnerable {
      background: rgba(139, 0, 0, 0.3);
      border: 2px solid #ff0000;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .vulnerable h3 {
      color: #ff0000;
      text-shadow: 0 0 5px #ff0000;
    }
    .secure {
      background: rgba(0, 100, 0, 0.3);
      border: 2px solid #00ff00;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .secure h3 {
      color: #00ff00;
      text-shadow: 0 0 5px #00ff00;
    }
    pre {
      background: #000;
      border: 1px solid #00ff41;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      color: #00ff41;
      margin: 10px 0;
      line-height: 1.5;
    }
    code {
      color: #00ff41;
      font-family: 'Courier New', monospace;
    }
    .info-box {
      background: rgba(0, 100, 255, 0.2);
      border: 2px solid #00aaff;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
      color: #00aaff;
    }
    .lab-card {
      background: rgba(255, 0, 255, 0.1);
      border: 2px solid #ff00ff;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .lab-card h3 {
      color: #ff00ff;
      text-shadow: 0 0 5px #ff00ff;
    }
    .difficulty {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 3px;
      font-weight: bold;
      margin: 10px 0;
    }
    .easy { background: #00ff00; color: #000; }
    .medium { background: #ffff00; color: #000; }
    .hard { background: #ff0000; color: #fff; }
    ul {
      margin-left: 20px;
      line-height: 1.8;
    }
    li {
      margin: 10px 0;
    }
    .endpoint {
      background: rgba(255, 255, 0, 0.2);
      border-left: 4px solid #ffff00;
      padding: 10px;
      margin: 10px 0;
      font-family: 'Courier New', monospace;
    }
    .flag {
      color: #ff00ff;
      font-weight: bold;
      text-shadow: 0 0 5px #ff00ff;
    }
    form {
      margin: 15px 0;
    }
    input[type="file"] {
      display: block;
      margin: 10px 0;
      padding: 10px;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid #00ff41;
      color: #00ff41;
      border-radius: 5px;
    }
    #result {
      margin-top: 20px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.7);
      border: 1px solid #00ff41;
      border-radius: 5px;
      min-height: 50px;
    }
  </style>
`;

// Home Page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A08: Software and Data Integrity Failures</title>
      <meta charset="UTF-8">
      ${cyberpunkStyles}
    </head>
    <body>
      <div class="container">
        <h1>🔐 A08: SOFTWARE AND DATA INTEGRITY FAILURES</h1>
        <p class="subtitle">OWASP Top 10 - Integrity Verification Lab</p>
        
        <div class="info-box">
          <p><strong>Mission Objective:</strong> Learn about software and data integrity failures through practical exercises.</p>
          <p style="margin-top: 10px;">Navigate through examples and labs to understand integrity validation vulnerabilities.</p>
        </div>

        <div class="nav-links">
          <a href="/example">📚 Example</a>
          <a href="/lab1">🎯 Lab 1 - Recon</a>
          <a href="/lab2">🎯 Lab 2 - Scanning</a>
          <a href="/lab3">🎯 Lab 3 - Initial Access</a>
        </div>

        <div class="lab-card">
          <h3>Lab Overview</h3>
          <ul>
            <li><strong>Lab 1 (Easy):</strong> Reconnaissance - Identify unsigned update mechanisms</li>
            <li><strong>Lab 2 (Medium):</strong> Scanning - Discover missing checksum validation</li>
            <li><strong>Lab 3 (Hard):</strong> Initial Access - Exploit unsigned file uploads</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Example Page
app.get('/example', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A08: Integrity Failures - Examples</title>
      <meta charset="UTF-8">
      ${cyberpunkStyles}
    </head>
    <body>
      <div class="container">
        <h1>📚 SOFTWARE AND DATA INTEGRITY FAILURES</h1>
        <p class="subtitle">Educational Walkthrough</p>
        
        <div class="nav-links">
          <a href="/">🏠 Home</a>
        </div>

        <h2>What are Integrity Failures?</h2>
        <div class="info-box">
          <p>Software and data integrity failures occur when code and infrastructure do not protect against integrity violations. This includes:</p>
          <ul>
            <li><strong>Unsigned Updates:</strong> Software updates without digital signatures</li>
            <li><strong>No Checksums:</strong> Downloads without hash verification</li>
            <li><strong>Insecure CI/CD:</strong> Compromised build pipelines</li>
            <li><strong>Unsafe Deserialization:</strong> Untrusted data execution</li>
          </ul>
        </div>

        <h2>Vulnerability Examples</h2>

        <div class="vulnerable">
          <h3>❌ Vulnerable: Update Without Signature</h3>
          <pre>
// Checking for updates without verification
async function checkForUpdate() {
  const response = await fetch('https://cdn.example.com/update-info.json');
  const updateInfo = await response.json();
  
  // Download and install directly - NO SIGNATURE CHECK!
  const update = await fetch(updateInfo.downloadUrl);
  const blob = await update.blob();
  installUpdate(blob);  // ❌ Attacker can inject malicious code
}
          </pre>
          <p style="margin-top: 10px; color: #ff6666;">
            <strong>Risk:</strong> An attacker performing a man-in-the-middle attack or compromising the CDN 
            can serve malicious updates that will be installed without verification.
          </p>
        </div>

        <div class="secure">
          <h3>✅ Secure: Verified Update with Digital Signature</h3>
          <pre>
// Secure update verification with signature
async function checkForUpdateSecure() {
  const response = await fetch('https://cdn.example.com/update-info.json');
  const updateInfo = await response.json();
  
  // Download update
  const update = await fetch(updateInfo.downloadUrl);
  const updateBlob = await update.blob();
  
  // Verify digital signature using vendor's public key
  const isValid = await crypto.subtle.verify(
    { name: "RSA-PSS", saltLength: 32 },
    vendorPublicKey,
    base64Decode(updateInfo.signature),
    await updateBlob.arrayBuffer()
  );
  
  if (!isValid) {
    throw new Error("Invalid signature - update rejected!");
  }
  
  // Verify SHA-256 checksum
  const hash = await crypto.subtle.digest('SHA-256', await updateBlob.arrayBuffer());
  const hashHex = Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  
  if (hashHex !== updateInfo.sha256) {
    throw new Error("Checksum mismatch - update rejected!");
  }
  
  installUpdate(updateBlob);  // ✅ Safe to install
}
          </pre>
        </div>

        <div class="vulnerable">
          <h3>❌ Vulnerable: No Checksum Verification</h3>
          <pre>
// Downloading dependency without checksum
async function installDependency(packageName) {
  const url = \`https://registry.example.com/\${packageName}/latest.tar.gz\`;
  const response = await fetch(url);
  const data = await response.blob();
  
  extractAndInstall(data);  // ❌ No integrity check
}
          </pre>
        </div>

        <div class="secure">
          <h3>✅ Secure: Checksum Verification</h3>
          <pre>
// Secure dependency installation with checksum
async function installDependencySecure(packageName, expectedSHA256) {
  const url = \`https://registry.example.com/\${packageName}/latest.tar.gz\`;
  const response = await fetch(url);
  const data = await response.blob();
  
  // Calculate SHA-256 checksum
  const buffer = await data.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Verify checksum matches
  if (calculatedHash !== expectedSHA256) {
    throw new Error(\`Checksum mismatch! Expected: \${expectedSHA256}, Got: \${calculatedHash}\`);
  }
  
  extractAndInstall(data);  // ✅ Integrity verified
}
          </pre>
        </div>

        <h2>Defense Mechanisms</h2>
        <div class="info-box">
          <h3 style="color: #00ffff; margin-top: 0;">Digital Signatures</h3>
          <p>Use asymmetric cryptography (RSA, ECDSA) to sign code and verify authenticity with public keys.</p>
          
          <h3 style="color: #00ffff; margin-top: 20px;">Checksums & Hashes</h3>
          <p>Generate and verify SHA-256/SHA-512 hashes to ensure data integrity during transmission.</p>
          
          <h3 style="color: #00ffff; margin-top: 20px;">Subresource Integrity (SRI)</h3>
          <pre style="margin-top: 10px;">
&lt;script src="https://cdn.example.com/library.js"
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/ux..."
        crossorigin="anonymous"&gt;&lt;/script&gt;
          </pre>
          
          <h3 style="color: #00ffff; margin-top: 20px;">Secure CI/CD Pipelines</h3>
          <ul>
            <li>Separate build environments from production</li>
            <li>Sign all artifacts in the build pipeline</li>
            <li>Use code signing certificates</li>
            <li>Implement artifact repositories with access controls</li>
            <li>Verify dependencies with lock files</li>
          </ul>
        </div>

        <h2>Real-World Examples</h2>
        <div class="vulnerable">
          <ul>
            <li><strong>SolarWinds (2020):</strong> Compromised build system led to malicious updates being signed and distributed</li>
            <li><strong>NotPetya (2017):</strong> Malicious software update distributed through compromised update server</li>
            <li><strong>CCleaner (2017):</strong> Legitimate software bundled with malware through compromised build process</li>
          </ul>
        </div>

        <div class="nav-links" style="margin-top: 40px;">
          <a href="/lab1">Start Lab 1 →</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Lab 1 - Easy: Reconnaissance
app.get('/lab1', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 1 - Reconnaissance</title>
      <meta charset="UTF-8">
      ${cyberpunkStyles}
    </head>
    <body>
      <div class="container">
        <h1>🎯 LAB 1: RECONNAISSANCE</h1>
        <div class="difficulty easy">EASY</div>
        
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/example">📚 Example</a>
        </div>

        <div class="lab-card">
          <h3>Mission Brief</h3>
          <p>Your target is using an automatic update system. Your objective is to identify the update mechanism and determine if it uses proper signature verification.</p>
          
          <h3 style="margin-top: 20px;">Objective</h3>
          <p>Discover how the application checks for updates. Look for endpoints that provide update information.</p>
          
          <div class="endpoint">
            <strong>Hint:</strong> Try accessing /api/lab1/update-info
          </div>
        </div>

        <div class="info-box">
          <h3 style="color: #00ffff; margin-top: 0;">What to Look For</h3>
          <ul>
            <li>Update information endpoints</li>
            <li>Missing digital signatures</li>
            <li>Lack of cryptographic verification</li>
            <li>Update URLs without HTTPS or certificates</li>
          </ul>
        </div>

        <h3>Test the Update Mechanism</h3>
        <pre>curl http://localhost:3008/api/lab1/update-info</pre>

        <div id="result"></div>

        <script>
          // Auto-fetch on page load to show update info
          fetch('/api/lab1/update-info')
            .then(res => res.json())
            .then(data => {
              const resultDiv = document.getElementById('result');
              resultDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            })
            .catch(err => {
              document.getElementById('result').innerHTML = '<p style="color: #ff0000;">Error: ' + err.message + '</p>';
            });
        </script>
      </div>
    </body>
    </html>
  `);
});

app.get('/api/lab1/update-info', (req, res) => {
  res.json({
    status: 'update_available',
    currentVersion: '1.0.0',
    latestVersion: '2.5.0',
    downloadUrl: 'http://updates.example.com/app-v2.5.0.zip',
    releaseNotes: 'Security improvements and bug fixes',
    size: '45.2 MB',
    vulnerability: 'No digital signature provided!',
    flag: 'NSA{UPD4T3_F0UND}',
    message: 'Flag captured! You identified an unsigned update mechanism.'
  });
});

// Lab 2 - Medium: Scanning
app.get('/lab2', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 2 - Scanning</title>
      <meta charset="UTF-8">
      ${cyberpunkStyles}
    </head>
    <body>
      <div class="container">
        <h1>🎯 LAB 2: SCANNING</h1>
        <div class="difficulty medium">MEDIUM</div>
        
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/example">📚 Example</a>
        </div>

        <div class="lab-card">
          <h3>Mission Brief</h3>
          <p>The target application allows file downloads but may not be verifying file integrity. Your objective is to identify missing checksum validation.</p>
          
          <h3 style="margin-top: 20px;">Objective</h3>
          <p>Download files from the application and analyze whether checksums are provided or verified.</p>
          
          <div class="endpoint">
            <strong>Endpoint:</strong> GET /api/lab2/download?file=update.zip
          </div>
        </div>

        <div class="info-box">
          <h3 style="color: #00ffff; margin-top: 0;">Investigation Steps</h3>
          <ul>
            <li>Attempt to download files</li>
            <li>Check if checksums (MD5, SHA256) are provided</li>
            <li>Determine if the application verifies file integrity</li>
            <li>Look for missing validation in responses</li>
          </ul>
        </div>

        <h3>Test File Download</h3>
        <pre>curl http://localhost:3008/api/lab2/download?file=update.zip</pre>
        <p style="margin-top: 10px;">Or click: <a href="/api/lab2/download?file=update.zip" style="color: #00ffff;">Download File</a></p>

        <div id="result"></div>
      </div>
    </body>
    </html>
  `);
});

app.get('/api/lab2/download', (req, res) => {
  const filename = req.query.file || 'unknown';
  
  res.json({
    status: 'download_ready',
    filename: filename,
    downloadUrl: `http://cdn.example.com/files/${filename}`,
    size: '12.8 MB',
    contentType: 'application/zip',
    vulnerability: 'No checksum verification provided!',
    flag: 'NSA{N0_CHK5UM_V3R1FY}',
    message: 'Flag captured! You discovered missing checksum validation.',
    secureAlternative: {
      filename: filename,
      downloadUrl: `http://cdn.example.com/files/${filename}`,
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      md5: '098f6bcd4621d373cade4e832627b4f6',
      signature: 'RSA-SHA256 digital signature would go here'
    }
  });
});

// Lab 3 - Hard: Initial Access
app.get('/lab3', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 3 - Initial Access</title>
      <meta charset="UTF-8">
      ${cyberpunkStyles}
    </head>
    <body>
      <div class="container">
        <h1>🎯 LAB 3: INITIAL ACCESS</h1>
        <div class="difficulty hard">HARD</div>
        
        <div class="nav-links">
          <a href="/">🏠 Home</a>
          <a href="/example">📚 Example</a>
        </div>

        <div class="lab-card">
          <h3>Mission Brief</h3>
          <p>The target has a file upload system that accepts code updates. Your objective is to exploit the lack of signature verification to upload a malicious file.</p>
          
          <h3 style="margin-top: 20px;">Objective</h3>
          <p>Upload a file that would replace legitimate code. The system should reject unsigned files, but it doesn't.</p>
          
          <div class="endpoint">
            <strong>Endpoint:</strong> POST /api/lab3/upload
          </div>
        </div>

        <div class="info-box">
          <h3 style="color: #00ffff; margin-top: 0;">Attack Vector</h3>
          <ul>
            <li>Create a malicious payload file</li>
            <li>Upload without a valid signature</li>
            <li>System accepts unsigned files</li>
            <li>Malicious code could be executed</li>
          </ul>
        </div>

        <h3>Upload Test File</h3>
        <form id="uploadForm" enctype="multipart/form-data">
          <input type="file" id="fileInput" name="file" required />
          <p style="margin-top: 10px; color: #ffff00;">Create any file to test the upload vulnerability</p>
        </form>

        <h3 style="margin-top: 20px;">Command Line Upload</h3>
        <pre>echo "malicious code" > malicious.zip
curl -X POST -F "file=@malicious.zip" http://localhost:3008/api/lab3/upload</pre>

        <div id="result"></div>

        <script>
          document.getElementById('fileInput').addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            try {
              const response = await fetch('/api/lab3/upload', {
                method: 'POST',
                body: formData
              });
              const data = await response.json();
              document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (err) {
              document.getElementById('result').innerHTML = '<p style="color: #ff0000;">Error: ' + err.message + '</p>';
            }
          });
        </script>
      </div>
    </body>
    </html>
  `);
});

app.post('/api/lab3/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    status: 'upload_accepted',
    filename: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    uploadedAt: new Date().toISOString(),
    vulnerability: 'File accepted without signature verification!',
    flag: 'NSA{N0_CHK5UM_N0_PR0BL3M}',
    message: 'Flag captured! You successfully uploaded an unsigned file.',
    risk: 'In a real system, this could allow code execution',
    secureAlternative: {
      requiredFields: ['file', 'signature', 'publicKey'],
      verification: 'RSA-SHA256 signature verification',
      rejection: 'Unsigned files should be rejected'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`A08 Integrity Failures Lab running on port ${PORT}`);
});
