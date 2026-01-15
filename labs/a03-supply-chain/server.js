const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A03: Software Supply Chain Failures Lab</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .vulnerable { background: #ffcccc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .secure { background: #ccffcc; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .info { background: #cce5ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 3px; overflow-x: auto; font-size: 12px; }
        h1 { color: #333; }
        h2 { color: #666; }
        code { background: #f4f4f4; padding: 2px 5px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <h1>📦 A03: Software Supply Chain Failures</h1>
      <p><strong>Learning Objective:</strong> Understand risks in the software supply chain including dependencies, build processes, and distribution.</p>
      
      <div class="info">
        <h2>What are Supply Chain Failures?</h2>
        <p>Supply chain security includes:</p>
        <ul>
          <li>Vulnerable or compromised dependencies</li>
          <li>Unverified third-party components</li>
          <li>Insecure CI/CD pipelines</li>
          <li>Lack of integrity verification</li>
          <li>Outdated components with known vulnerabilities</li>
        </ul>
      </div>

      <div class="vulnerable">
        <h2>❌ Supply Chain Vulnerabilities</h2>
        
        <h3>1. Vulnerable Dependencies</h3>
        <p>This application might use dependencies with known vulnerabilities.</p>
        <pre>
Example vulnerable package.json:
{
  "dependencies": {
    "lodash": "4.17.11",  // Has prototype pollution vulnerability
    "axios": "0.18.0",     // Has SSRF vulnerability
    "express": "4.16.0"    // Has various vulnerabilities
  }
}</pre>
        
        <h3>2. No Dependency Verification</h3>
        <p>Dependencies are installed without verifying:</p>
        <ul>
          <li>Package integrity (checksums)</li>
          <li>Package signatures</li>
          <li>Source authenticity</li>
        </ul>
        
        <h3>3. Transitive Dependencies</h3>
        <p>Your direct dependencies pull in many other packages you don't control.</p>
        <button onclick="showDependencies()">Show Dependency Tree</button>
        <div id="deps-result"></div>
      </div>

      <div class="secure">
        <h2>✅ Secure Supply Chain Practices</h2>
        <ul>
          <li><strong>Dependency Scanning:</strong> Use tools like npm audit, Snyk, or Dependabot</li>
          <li><strong>Lock Files:</strong> Use package-lock.json or yarn.lock to ensure consistent installs</li>
          <li><strong>Integrity Checks:</strong> Verify package integrity with SRI hashes</li>
          <li><strong>Minimal Dependencies:</strong> Only include necessary packages</li>
          <li><strong>Regular Updates:</strong> Keep dependencies up to date</li>
          <li><strong>Private Registry:</strong> Use a private npm registry for internal packages</li>
          <li><strong>SBOM:</strong> Maintain a Software Bill of Materials</li>
          <li><strong>Code Signing:</strong> Sign your releases</li>
        </ul>
      </div>

      <div class="info">
        <h2>🛠️ Tools for Supply Chain Security</h2>
        <pre>
# Audit your dependencies
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Check for outdated packages
npm outdated

# Use lock files
npm ci  # Install from lock file exactly

# Verify package integrity
npm install --ignore-scripts  # Prevent post-install scripts
        </pre>
      </div>

      <div class="info">
        <h2>📚 What You Learned</h2>
        <ul>
          <li>Every dependency is a potential attack vector</li>
          <li>Transitive dependencies multiply your risk</li>
          <li>Regular security audits of dependencies are essential</li>
          <li>Supply chain attacks can compromise your entire application</li>
          <li>Automated tools can help identify vulnerable dependencies</li>
        </ul>
      </div>

      <script>
        function showDependencies() {
          // Simulated dependency tree
          const depsTree = {
            "your-app": {
              "express": {
                "body-parser": {},
                "cookie": {},
                "debug": {
                  "ms": {}
                },
                "qs": {},
                // ... many more
              },
              "lodash": {},
              "axios": {
                "follow-redirects": {},
                "form-data": {}
              }
            }
          };
          
          document.getElementById('deps-result').innerHTML = 
            '<pre>' + JSON.stringify(depsTree, null, 2) + 
            '\\n\\n⚠️ This is a simplified view. Real apps can have hundreds of transitive dependencies!</pre>';
        }
      </script>
    </body>
    </html>
  `);
});

app.get('/api/dependencies', (req, res) => {
  // In a real scenario, this would analyze actual dependencies
  res.json({
    totalDependencies: 247,
    directDependencies: 12,
    transitiveDependencies: 235,
    vulnerabilities: {
      critical: 2,
      high: 5,
      moderate: 12,
      low: 8
    },
    outdated: 18,
    message: 'This demonstrates why supply chain security is critical!',
    flag: 'NSA{0LD_P4CK4G3S_M34N_0LD_BUG5}'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`A03 Lab running on port ${PORT}`);
});
