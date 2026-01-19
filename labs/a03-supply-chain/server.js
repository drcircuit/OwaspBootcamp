const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const cyberpunkStyles = `
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
      color: #00ff41;
      padding: 20px;
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid #00ff41;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
    }
    h1 {
      color: #00ff41;
      text-shadow: 0 0 10px #00ff41;
      margin-bottom: 20px;
      font-size: 2.5em;
      text-align: center;
    }
    h2 {
      color: #ff00ff;
      text-shadow: 0 0 10px #ff00ff;
      margin-top: 30px;
      margin-bottom: 15px;
      font-size: 1.8em;
    }
    h3 {
      color: #00ddff;
      text-shadow: 0 0 8px #00ddff;
      margin-top: 20px;
      margin-bottom: 10px;
      font-size: 1.3em;
    }
    .section {
      background: rgba(0, 20, 40, 0.6);
      border: 1px solid #00ff41;
      border-radius: 5px;
      padding: 20px;
      margin: 20px 0;
    }
    .vulnerable {
      border-color: #ff0040;
      box-shadow: 0 0 15px rgba(255, 0, 64, 0.3);
    }
    .info {
      border-color: #00ddff;
      box-shadow: 0 0 15px rgba(0, 221, 255, 0.3);
    }
    pre {
      background: #000;
      border: 1px solid #00ff41;
      border-radius: 5px;
      padding: 15px;
      overflow-x: auto;
      color: #00ff41;
      margin: 10px 0;
    }
    code {
      background: rgba(0, 255, 65, 0.1);
      padding: 2px 6px;
      border-radius: 3px;
      color: #ff00ff;
    }
    a {
      color: #00ddff;
      text-decoration: none;
      text-shadow: 0 0 5px #00ddff;
      transition: all 0.3s;
    }
    a:hover {
      color: #ff00ff;
      text-shadow: 0 0 10px #ff00ff;
    }
    ul { margin-left: 25px; line-height: 1.8; }
    p { line-height: 1.6; margin: 10px 0; }
    .nav-links {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      gap: 15px;
      margin: 30px 0;
    }
    .nav-link {
      background: rgba(0, 255, 65, 0.1);
      border: 2px solid #00ff41;
      padding: 15px 30px;
      border-radius: 5px;
      text-align: center;
      flex: 1;
      min-width: 200px;
      transition: all 0.3s;
    }
    .nav-link:hover {
      background: rgba(0, 255, 65, 0.2);
      box-shadow: 0 0 20px rgba(0, 255, 65, 0.5);
      transform: translateY(-2px);
    }
    .difficulty {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 3px;
      font-weight: bold;
      margin-left: 10px;
    }
    .easy { background: #00ff41; color: #000; }
    .medium { background: #ffaa00; color: #000; }
    .hard { background: #ff0040; color: #fff; }
    .endpoint {
      background: rgba(255, 0, 255, 0.1);
      border-left: 3px solid #ff00ff;
      padding: 10px;
      margin: 10px 0;
    }
  </style>
`;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>A03: Supply Chain Failures Lab</title>
      ${cyberpunkStyles}
    </head>
    <body>
      <div class="container">
        <h1>⛓️ A03: SUPPLY CHAIN FAILURES</h1>
        <div class="section info">
          <h2>Mission Briefing</h2>
          <p>Welcome to the Supply Chain Security lab. Your mission is to understand and identify vulnerabilities in the software supply chain.</p>
          <p><strong>Objective:</strong> Learn how vulnerable dependencies, outdated packages, and lack of integrity verification can compromise entire applications.</p>
        </div>

        <div class="nav-links">
          <div class="nav-link">
            <a href="/example">
              <h3>📚 Example</h3>
              <p>Educational walkthrough of supply chain vulnerabilities</p>
            </a>
          </div>
        </div>

        <div class="nav-links">
          <div class="nav-link">
            <a href="/lab1">
              <h3>🎯 Lab 1</h3>
              <span class="difficulty easy">EASY</span>
              <p>Reconnaissance: Identify package versions</p>
            </a>
          </div>

          <div class="nav-link">
            <a href="/lab2">
              <h3>🔍 Lab 2</h3>
              <span class="difficulty medium">MEDIUM</span>
              <p>Scanning: Discover vulnerable dependencies</p>
            </a>
          </div>

          <div class="nav-link">
            <a href="/lab3">
              <h3>💀 Lab 3</h3>
              <span class="difficulty hard">HARD</span>
              <p>Initial Access: Exploit vulnerable dependency</p>
            </a>
          </div>
        </div>

        <div class="section">
          <h3>Lab Structure</h3>
          <ul>
            <li><strong>Example:</strong> Learn about supply chain vulnerabilities</li>
            <li><strong>Lab 1:</strong> Recon - Find version information</li>
            <li><strong>Lab 2:</strong> Scanning - Identify vulnerable packages</li>
            <li><strong>Lab 3:</strong> Exploitation - Leverage vulnerable dependency</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get('/example', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Example - Supply Chain Vulnerabilities</title>
      ${cyberpunkStyles}
    </head>
    <body>
      <div class="container">
        <h1>📚 Supply Chain Vulnerabilities - Educational Example</h1>
        
        <div class="section info">
          <h2>What Are Supply Chain Failures?</h2>
          <p>Software supply chain attacks exploit trust relationships between organizations and their software suppliers. These attacks can compromise applications through:</p>
          <ul>
            <li><strong>Vulnerable Dependencies:</strong> Using packages with known security flaws</li>
            <li><strong>Dependency Confusion:</strong> Attackers uploading malicious packages with similar names</li>
            <li><strong>Compromised Packages:</strong> Legitimate packages taken over by attackers</li>
            <li><strong>No Integrity Verification:</strong> Installing packages without verifying checksums or signatures</li>
          </ul>
        </div>

        <div class="section vulnerable">
          <h2>❌ Vulnerable Dependency Examples</h2>
          
          <h3>1. Outdated Packages with Known CVEs</h3>
          <p>Many applications use outdated packages with publicly disclosed vulnerabilities:</p>
          <pre>{
  "dependencies": {
    "lodash": "4.17.11",     // CVE-2019-10744: Prototype Pollution
    "axios": "0.18.0",        // CVE-2019-10742: SSRF vulnerability
    "express": "4.16.0",      // Multiple CVEs in older versions
    "moment": "2.19.1",       // CVE-2022-31129: Path Traversal
    "jquery": "3.3.1"         // CVE-2020-11022: XSS vulnerability
  }
}</pre>

          <h3>2. Dependency Confusion Attack</h3>
          <p>Attackers exploit how package managers resolve dependencies:</p>
          <pre># Internal private package
@mycompany/auth-lib (private registry)

# Attacker uploads to public npm
mycompany-auth-lib (public npm)

# Package manager might install the wrong one!
npm install @mycompany/auth-lib</pre>

          <h3>3. Compromised Legitimate Packages</h3>
          <p>Real-world examples of supply chain attacks:</p>
          <ul>
            <li><strong>event-stream:</strong> Popular package with 2M weekly downloads compromised in 2018</li>
            <li><strong>ua-parser-js:</strong> Compromised with cryptocurrency miner in 2021</li>
            <li><strong>colors.js:</strong> Intentionally corrupted by maintainer in 2022</li>
          </ul>

          <h3>4. No Integrity Verification</h3>
          <p>Installing packages without verification:</p>
          <pre># Dangerous: No integrity check
npm install some-package

# Better: Use lock files
npm ci  # Installs from package-lock.json with integrity hashes

# Best: Verify signatures and use private registry
npm config set registry https://private-registry.company.com</pre>
        </div>

        <div class="section info">
          <h2>🛠️ Detection and Prevention Tools</h2>
          
          <h3>npm audit</h3>
          <p>Built-in npm tool to scan for known vulnerabilities:</p>
          <pre># Run security audit
npm audit

# Show detailed report
npm audit --json

# Automatically fix vulnerabilities
npm audit fix

# Fix including breaking changes
npm audit fix --force</pre>

          <h3>npm outdated</h3>
          <p>Check for outdated dependencies:</p>
          <pre># List outdated packages
npm outdated

# Shows: Current | Wanted | Latest versions
# Wanted = respects semver in package.json
# Latest = most recent published version</pre>

          <h3>Snyk</h3>
          <p>Commercial tool with extensive vulnerability database:</p>
          <pre># Install Snyk CLI
npm install -g snyk

# Authenticate
snyk auth

# Test project for vulnerabilities
snyk test

# Monitor project continuously
snyk monitor

# Fix vulnerabilities interactively
snyk wizard</pre>

          <h3>Other Tools</h3>
          <ul>
            <li><strong>OWASP Dependency-Check:</strong> Multi-language dependency scanner</li>
            <li><strong>Dependabot:</strong> GitHub's automated dependency updates</li>
            <li><strong>WhiteSource:</strong> Enterprise supply chain security</li>
            <li><strong>Socket.dev:</strong> Detects malicious packages in real-time</li>
          </ul>
        </div>

        <div class="section info">
          <h2>🔒 Best Practices</h2>
          <ul>
            <li><strong>Use Lock Files:</strong> Always commit package-lock.json or yarn.lock</li>
            <li><strong>Regular Audits:</strong> Run npm audit in CI/CD pipelines</li>
            <li><strong>Update Dependencies:</strong> Keep packages current with automated tools</li>
            <li><strong>Minimal Dependencies:</strong> Only include necessary packages</li>
            <li><strong>Review Dependencies:</strong> Understand what each package does</li>
            <li><strong>Use SRI Hashes:</strong> Subresource Integrity for CDN resources</li>
            <li><strong>Private Registry:</strong> Mirror packages in private registry</li>
            <li><strong>SBOM:</strong> Maintain Software Bill of Materials</li>
            <li><strong>Code Signing:</strong> Sign and verify package signatures</li>
          </ul>
        </div>

        <div class="section">
          <h2>📖 Real-World Impact</h2>
          <p>Supply chain attacks have caused major incidents:</p>
          <ul>
            <li><strong>SolarWinds (2020):</strong> Build system compromise affected 18,000+ organizations</li>
            <li><strong>Codecov (2021):</strong> Bash Uploader script compromised for months</li>
            <li><strong>Log4Shell (2021):</strong> Vulnerability in widely-used logging library</li>
            <li><strong>Spring4Shell (2022):</strong> RCE in Spring Framework</li>
          </ul>
        </div>

        <div class="section info">
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get('/lab1', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 1 - Reconnaissance</title>
      ${cyberpunkStyles}
    </head>
    <body>
      <div class="container">
        <h1>🎯 Lab 1: Reconnaissance</h1>
        <span class="difficulty easy">EASY</span>
        
        <div class="section info">
          <h2>Mission Objective</h2>
          <p>The first step in supply chain exploitation is reconnaissance. Your goal is to identify what software versions and packages the target is using.</p>
          <p><strong>Skill:</strong> Information Gathering</p>
          <p><strong>Task:</strong> Discover package versions and framework information</p>
        </div>

        <div class="section">
          <h2>Scenario</h2>
          <p>You've discovered a web application. Before exploiting vulnerabilities, you need to gather information about what packages and versions it's running.</p>
          <p>Many applications leak version information through HTTP headers, error messages, or API endpoints.</p>
        </div>

        <div class="section vulnerable">
          <h2>Your Task</h2>
          <p>Investigate the application to find version information. Look for:</p>
          <ul>
            <li>HTTP response headers that reveal framework versions</li>
            <li>API endpoints that expose package information</li>
            <li>Server banners and identifying information</li>
          </ul>
        </div>

        <div class="endpoint">
          <h3>Target Endpoint</h3>
          <code>GET /api/lab1/version</code>
          <p>Try accessing this endpoint and examining the response headers and body.</p>
        </div>

        <div class="section info">
          <h3>Tools You Can Use</h3>
          <pre># Using curl to inspect headers
curl -I http://localhost:3003/api/lab1/version

# Using curl with verbose output
curl -v http://localhost:3003/api/lab1/version

# Using wget
wget --server-response --spider http://localhost:3003/api/lab1/version

# Using browser DevTools
# Open DevTools (F12) → Network tab → Make request → View headers</pre>
        </div>

        <div class="section">
          <h3>What to Look For</h3>
          <ul>
            <li><strong>X-Powered-By:</strong> Often reveals framework and version</li>
            <li><strong>Server:</strong> May include server software version</li>
            <li><strong>Response Body:</strong> May contain package information</li>
          </ul>
          <p>Once you gather all the information, you'll find your flag.</p>
        </div>

        <div class="section info">
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get('/api/lab1/version', (req, res) => {
  res.setHeader('X-Powered-By', 'Express 4.17.1');
  res.setHeader('X-Framework', 'Node.js v14.17.0');
  res.json({
    application: 'Supply Chain Lab',
    version: '1.0.0',
    packages: {
      express: '4.17.1',
      lodash: '4.17.11',
      axios: '0.18.0'
    },
    flag: 'NSA{V3RS10NS_F0UND}'
  });
});

app.get('/lab2', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 2 - Vulnerability Scanning</title>
      ${cyberpunkStyles}
    </head>
    <body>
      <div class="container">
        <h1>🔍 Lab 2: Vulnerability Scanning</h1>
        <span class="difficulty medium">MEDIUM</span>
        
        <div class="section info">
          <h2>Mission Objective</h2>
          <p>Now that you've identified the packages in use, you need to scan for known vulnerabilities. This is a critical step in the attack chain.</p>
          <p><strong>Skill:</strong> Vulnerability Assessment</p>
          <p><strong>Task:</strong> Identify which packages have known security vulnerabilities</p>
        </div>

        <div class="section">
          <h2>Scenario</h2>
          <p>From Lab 1, you discovered the application uses:</p>
          <ul>
            <li>express: 4.17.1</li>
            <li>lodash: 4.17.11</li>
            <li>axios: 0.18.0</li>
          </ul>
          <p>These versions are outdated. Your job is to identify which vulnerabilities affect these specific versions.</p>
        </div>

        <div class="section vulnerable">
          <h2>Your Task</h2>
          <p>Use vulnerability scanning tools to identify security issues. You can:</p>
          <ul>
            <li>Create a test package.json with these versions and run <code>npm audit</code></li>
            <li>Search CVE databases for known vulnerabilities</li>
            <li>Use Snyk to scan for vulnerabilities</li>
            <li>Check the application's vulnerability report endpoint</li>
          </ul>
        </div>

        <div class="endpoint">
          <h3>Target Endpoint</h3>
          <code>GET /api/lab2/vulnerabilities</code>
          <p>This endpoint will reveal the vulnerability scan results.</p>
        </div>

        <div class="section info">
          <h3>Manual Scanning Method</h3>
          <p>Create a temporary directory and test package.json:</p>
          <pre># Create test directory
mkdir supply-chain-test && cd supply-chain-test

# Create package.json
cat > package.json << 'EOF'
{
  "name": "test",
  "version": "1.0.0",
  "dependencies": {
    "lodash": "4.17.11",
    "axios": "0.18.0",
    "express": "4.17.1"
  }
}
EOF

# Run npm audit
npm install
npm audit

# Check for outdated packages
npm outdated</pre>
        </div>

        <div class="section info">
          <h3>What You're Looking For</h3>
          <ul>
            <li><strong>CVE Numbers:</strong> Common Vulnerabilities and Exposures identifiers</li>
            <li><strong>Severity Levels:</strong> Critical, High, Moderate, Low</li>
            <li><strong>Vulnerability Types:</strong> Prototype Pollution, SSRF, XSS, etc.</li>
            <li><strong>Affected Versions:</strong> Which version ranges are vulnerable</li>
          </ul>
        </div>

        <div class="section info">
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get('/api/lab2/vulnerabilities', (req, res) => {
  res.json({
    scan_date: new Date().toISOString(),
    packages_scanned: 3,
    vulnerabilities_found: 5,
    details: {
      lodash: {
        version: '4.17.11',
        vulnerabilities: [
          {
            cve: 'CVE-2019-10744',
            severity: 'HIGH',
            title: 'Prototype Pollution',
            description: 'Versions of lodash before 4.17.12 are vulnerable to Prototype Pollution',
            exploitable: true
          },
          {
            cve: 'CVE-2020-8203',
            severity: 'HIGH',
            title: 'Prototype Pollution',
            description: 'Versions of lodash before 4.17.19 are vulnerable to Prototype Pollution',
            exploitable: true
          }
        ]
      },
      axios: {
        version: '0.18.0',
        vulnerabilities: [
          {
            cve: 'CVE-2019-10742',
            severity: 'CRITICAL',
            title: 'Server-Side Request Forgery (SSRF)',
            description: 'Axios before 0.18.1 is vulnerable to SSRF',
            exploitable: true
          }
        ]
      },
      express: {
        version: '4.17.1',
        vulnerabilities: [
          {
            cve: 'CVE-2022-24999',
            severity: 'MEDIUM',
            title: 'Open Redirect',
            description: 'Express before 4.17.3 is vulnerable to open redirect',
            exploitable: false
          }
        ]
      }
    },
    recommendation: 'Update all packages to latest secure versions',
    flag: 'NSA{0LD_P4CK4G3S_M34N_0LD_BUG5}'
  });
});

app.get('/lab3', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Lab 3 - Initial Access</title>
      ${cyberpunkStyles}
    </head>
    <body>
      <div class="container">
        <h1>💀 Lab 3: Initial Access via Vulnerable Dependency</h1>
        <span class="difficulty hard">HARD</span>
        
        <div class="section info">
          <h2>Mission Objective</h2>
          <p>Now that you've identified vulnerable packages, it's time to exploit them. This lab demonstrates how a vulnerable dependency can lead to system compromise.</p>
          <p><strong>Skill:</strong> Exploitation</p>
          <p><strong>Task:</strong> Exploit a path traversal vulnerability in a vulnerable dependency</p>
        </div>

        <div class="section">
          <h2>Scenario</h2>
          <p>The application uses a file serving function that relies on a vulnerable dependency. Due to improper input validation, you can traverse directories and read arbitrary files.</p>
          <p>This simulates real-world scenarios where developers trust third-party packages without understanding their security implications.</p>
        </div>

        <div class="section vulnerable">
          <h2>Your Task</h2>
          <p>The application has a file serving endpoint that doesn't properly sanitize file paths. Your goal is to exploit this to read sensitive files.</p>
          <p><strong>Target:</strong> Read system files using path traversal</p>
        </div>

        <div class="endpoint">
          <h3>Target Endpoint</h3>
          <code>GET /api/lab3/file?path=&lt;filename&gt;</code>
          <p>This endpoint serves files but has a path traversal vulnerability.</p>
        </div>

        <div class="section info">
          <h3>Path Traversal Basics</h3>
          <p>Path traversal vulnerabilities allow attackers to access files outside the intended directory:</p>
          <pre># Normal usage (intended)
/api/lab3/file?path=welcome.txt

# Path traversal attempts
/api/lab3/file?path=../../../etc/passwd
/api/lab3/file?path=..\\..\\..\\windows\\system32\\config\\sam
/api/lab3/file?path=....//....//....//etc/passwd</pre>
        </div>

        <div class="section">
          <h3>Hints</h3>
          <ul>
            <li>Try reading <code>/etc/passwd</code> on Linux systems</li>
            <li>Use <code>../</code> sequences to traverse up directories</li>
            <li>The flag is contained in a system file you can read</li>
            <li>Look for common sensitive files like passwd, shadow, hosts, etc.</li>
          </ul>
        </div>

        <div class="section info">
          <h3>Tools You Can Use</h3>
          <pre># Using curl
curl "http://localhost:3003/api/lab3/file?path=../../../etc/passwd"

# Using wget
wget -qO- "http://localhost:3003/api/lab3/file?path=../../../etc/passwd"

# URL encode if needed
curl "http://localhost:3003/api/lab3/file?path=..%2F..%2F..%2Fetc%2Fpasswd"</pre>
        </div>

        <div class="section vulnerable">
          <h3>Why This Works</h3>
          <p>This vulnerability exists because:</p>
          <ul>
            <li>The application doesn't validate or sanitize the path parameter</li>
            <li>A vulnerable file-serving dependency allows path traversal</li>
            <li>No allowlist or sandbox restricts file access</li>
            <li>The application runs with sufficient privileges to read system files</li>
          </ul>
        </div>

        <div class="section info">
          <a href="/">← Back to Home</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

app.get('/api/lab3/file', (req, res) => {
  const filePath = req.query.path;
  
  if (!filePath) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  // VULNERABLE: Using string concatenation instead of path.join
  // This simulates a vulnerable dependency that doesn't sanitize paths
  const basePath = __dirname;
  const fullPath = basePath + '/' + filePath;

  fs.readFile(fullPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ 
        error: 'File not found',
        hint: 'Try using path traversal techniques like ../../../etc/passwd'
      });
    }

    if (data.includes('root:') || filePath.includes('passwd')) {
      return res.send(`
        <pre>${data}</pre>
        <hr>
        <h2 style="color: #00ff41;">🎉 Exploitation Successful!</h2>
        <p style="color: #00ff41;">You've successfully exploited the path traversal vulnerability!</p>
        <p style="color: #ff00ff;"><strong>Flag: NSA{SUPPLYCHA1N_PWNED}</strong></p>
        <hr>
        <h3>What You Did:</h3>
        <ul style="color: #00ddff;">
          <li>Identified a file serving endpoint with insufficient input validation</li>
          <li>Used path traversal sequences (../) to escape the intended directory</li>
          <li>Read sensitive system files that should be protected</li>
        </ul>
        <h3>Why This Matters:</h3>
        <ul style="color: #00ddff;">
          <li>Vulnerable dependencies can expose critical security flaws</li>
          <li>Path traversal can lead to credential theft, source code exposure, and system compromise</li>
          <li>Always validate and sanitize user input, especially file paths</li>
          <li>Use allowlists instead of denylists for file access</li>
          <li>Run applications with minimal privileges (principle of least privilege)</li>
        </ul>
      `);
    }

    res.send(`<pre>${data}</pre>`);
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`A03 Supply Chain Failures Lab running on port ${PORT}`);
  console.log(`Access the lab at http://localhost:${PORT}`);
});
