const express = require('express');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const upload = multer({ 
  dest: 'uploads/',
  limits: { 
    fileSize: 5 * 1024 * 1024,
    files: 1
  }
});

const harvestStyles = `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      background: linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%);
      color: #047857;
      min-height: 100vh;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid #10B981;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 0 30px rgba(255, 0, 255, 0.5);
    }
    h1 {
      color: #10B981;
      text-shadow: 0 0 10px #10B981, 0 0 20px #10B981;
      margin-bottom: 10px;
      font-size: 2.5em;
      text-align: center;
    }
    h2 {
      color: #059669;
      text-shadow: 0 0 10px #059669;
      margin: 30px 0 15px 0;
      font-size: 1.8em;
      border-bottom: 2px solid #059669;
      padding-bottom: 10px;
    }
    h3 {
      color: #F59E0B;
      text-shadow: 0 0 5px #F59E0B;
      margin: 20px 0 10px 0;
      font-size: 1.3em;
    }
    .subtitle {
      text-align: center;
      color: #047857;
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
      color: #059669;
      text-decoration: none;
      padding: 12px 25px;
      border: 2px solid #059669;
      border-radius: 5px;
      transition: all 0.3s;
      text-shadow: 0 0 5px #059669;
    }
    .nav-links a:hover {
      background: #059669;
      color: #000;
      box-shadow: 0 0 20px #059669;
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
      border: 1px solid #047857;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      color: #047857;
      margin: 10px 0;
      line-height: 1.5;
    }
    code {
      color: #047857;
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
      border: 2px solid #10B981;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .lab-card h3 {
      color: #10B981;
      text-shadow: 0 0 5px #10B981;
    }
    .difficulty {
      display: inline-block;
      padding: 5px 15px;
      border-radius: 3px;
      font-weight: bold;
      margin: 10px 0;
    }
    .easy { background: #00ff00; color: #000; }
    .medium { background: #F59E0B; color: #000; }
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
      border-left: 4px solid #F59E0B;
      padding: 10px;
      margin: 10px 0;
      font-family: 'Courier New', monospace;
    }
    .flag {
      color: #10B981;
      font-weight: bold;
      text-shadow: 0 0 5px #10B981;
    }
    form {
      margin: 15px 0;
    }
    input[type="file"] {
      display: block;
      margin: 10px 0;
      padding: 10px;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid #047857;
      color: #047857;
      border-radius: 5px;
    }
    #result {
      margin-top: 20px;
      padding: 15px;
      background: rgba(0, 0, 0, 0.7);
      border: 1px solid #047857;
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
      <title>FreshHarvest Market 🌱 - Vendor Portal</title>
      <meta charset="UTF-8">
      ${harvestStyles}
    </head>
    <body>
      <div class="container">
        <h1>🌱 FRESHHARVEST MARKET</h1>
        <p class="subtitle">Organic Farmers Market - Vendor Management Portal</p>
        
        <div class="info-box">
          <p><strong>Welcome Vendors!</strong> Manage your products, updates, and inventory through our vendor portal.</p>
          <p style="margin-top: 10px;">Our system helps local farmers and artisans sell fresh, organic products to the community.</p>
        </div>

        <div class="nav-links">
          <a href="/example">📚 Tutorial</a>
          <a href="/lab1">🎯 Lab 1 - Product Updates</a>
          <a href="/lab2">🎯 Lab 2 - Vendor Portal</a>
          <a href="/lab3">🎯 Lab 3 - File Manager</a>
        </div>

        <div class="lab-card">
          <h3>🌾 Our Vendors</h3>
          <ul style="font-size: 1.1em;">
            <li><strong>Green Valley Farms</strong> - Organic tomatoes, peppers, seasonal vegetables</li>
            <li><strong>Urban Harvest Co-op</strong> - Fresh herbs, microgreens, salad mixes</li>
            <li><strong>Bee Happy Apiary</strong> - Local honey, beeswax candles, pollen</li>
            <li><strong>Artisan Bread Collective</strong> - Sourdough, whole grain, specialty loaves</li>
          </ul>
        </div>

        <div class="lab-card">
          <h3>🎯 Portal Features</h3>
          <ul>
            <li><strong>Lab 1 (Easy):</strong> Product catalog updates and inventory management</li>
            <li><strong>Lab 2 (Medium):</strong> Download vendor resources and price lists</li>
            <li><strong>Lab 3 (Hard):</strong> Upload product images and documents</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Example Page
// Example page - Help & Info
app.get('/example', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>About FreshHarvest Market</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px;">
            <h1>🌱 About FreshHarvest Market</h1>
            <p><a href="/">← Back to Home</a></p>
            
            <h2>Welcome!</h2>
            <p>FreshHarvest Market connects local farmers with vendors through our secure online platform.</p>
            
            <h2>Our Services</h2>
            <p>We provide comprehensive services to meet your needs. Our platform is designed with security and reliability in mind.</p>
            
            <h2>Security & Privacy</h2>
            <p>We take data integrity and security seriously. Our systems implement industry-standard protections to keep your information safe.</p>
            
            <p style="margin-top: 30px;"><a href="/">← Back to Home</a></p>
        </body>
        </html>
    `);
});

app.get('/lab1', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 1 - Product Updates</title>
      <meta charset="UTF-8">
      ${harvestStyles}
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
    flag: 'HARVEST{UPD4T3_N0T_V3R1F13D}',
    message: 'Flag captured! You identified an unsigned update mechanism.'
  });
});

// Lab 2 - Medium: Vendor Portal
app.get('/lab2', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 2 - Vendor Portal</title>
      <meta charset="UTF-8">
      ${harvestStyles}
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

  if (req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
  }

  res.json({
    status: 'upload_accepted',
    filename: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    uploadedAt: new Date().toISOString(),
    vulnerability: 'File accepted without signature verification!',
    flag: 'HARVEST{N0_S1GN4TUR3_FR3SH}',
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
