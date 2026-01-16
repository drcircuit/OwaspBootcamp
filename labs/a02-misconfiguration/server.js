const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());

// Simulated configuration data
const configData = {
    database: {
        host: 'db.internal.company.com',
        port: 5432,
        username: 'dbadmin',
        password: 'P@ssw0rd123!',
        database: 'production_db'
    },
    api_keys: {
        stripe: 'sk_live_51Hxyz1234567890',
        aws: 'AKIAIOSFODNN7EXAMPLE',
        sendgrid: 'SG.1234567890.abcdefghijklmnop'
    },
    secrets: {
        jwt_secret: 'super_secret_jwt_key_do_not_share',
        encryption_key: 'aes256-encryption-key-12345'
    }
};

// Default admin credentials (commonly used, rarely changed)
const adminCredentials = {
    username: 'admin',
    password: 'admin123'
};

// Home page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>A02: Security Misconfiguration</title>
            <style>
                body {
                    background-color: #1a1a1a;
                    color: #00ff00;
                    font-family: 'Courier New', monospace;
                    padding: 20px;
                    line-height: 1.6;
                }
                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                h1 {
                    text-align: center;
                    font-size: 2.5em;
                    text-shadow: 0 0 10px #00ff00;
                    border-bottom: 2px solid #00ff00;
                    padding-bottom: 10px;
                }
                h2 {
                    color: #00ff00;
                    margin-top: 30px;
                }
                .challenge {
                    background-color: #0a0a0a;
                    border: 2px solid #00ff00;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 5px;
                    box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
                }
                .challenge h3 {
                    margin-top: 0;
                    color: #00ff00;
                    font-size: 1.5em;
                }
                .difficulty {
                    display: inline-block;
                    padding: 5px 15px;
                    border-radius: 3px;
                    font-weight: bold;
                    margin-left: 10px;
                }
                .easy { background-color: #00ff00; color: #000; }
                .medium { background-color: #ffaa00; color: #000; }
                .hard { background-color: #ff0000; color: #fff; }
                .example { background-color: #0088ff; color: #fff; }
                a {
                    color: #00ffff;
                    text-decoration: none;
                    border-bottom: 1px dotted #00ffff;
                }
                a:hover {
                    color: #00ff00;
                    border-bottom: 1px solid #00ff00;
                }
                .info {
                    background-color: #0a0a0a;
                    border-left: 4px solid #00ff00;
                    padding: 15px;
                    margin: 20px 0;
                }
                code {
                    background-color: #000;
                    padding: 2px 6px;
                    border-radius: 3px;
                    color: #00ffff;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>⚙️ A02: SECURITY MISCONFIGURATION ⚙️</h1>
                
                <div class="info">
                    <strong>⚡ SYSTEM STATUS:</strong> Production environment detected<br>
                    <strong>🎯 OBJECTIVE:</strong> Discover misconfigurations and capture the flags<br>
                    <strong>🛠️ TOOLS:</strong> Use curl, Postman, Burp Suite, or Browser DevTools
                </div>

                <div class="challenge">
                    <h3>📚 Example - Security Misconfiguration Explained <span class="difficulty example">TUTORIAL</span></h3>
                    <p>Learn about security misconfigurations including debug endpoints, verbose errors, default credentials, and missing security headers. This walkthrough will teach you the concepts before attempting the labs.</p>
                    <p><a href="/example">→ Start Tutorial</a></p>
                </div>

                <div class="challenge">
                    <h3>🔍 Lab 1 - Debug Exposure <span class="difficulty easy">EASY</span></h3>
                    <p><strong>Stage:</strong> Recon</p>
                    <p><strong>Description:</strong> Debug endpoints are often left enabled in production. Can you find exposed debug information?</p>
                    <p><strong>Hint:</strong> Developers often use predictable endpoint names for debugging</p>
                    <p><strong>Flag:</strong> Capture the flag when you access the debug endpoint</p>
                    <p><a href="/lab1">→ Start Lab 1</a></p>
                </div>

                <div class="challenge">
                    <h3>🎭 Lab 2 - Configuration Leak <span class="difficulty medium">MEDIUM</span></h3>
                    <p><strong>Stage:</strong> Scanning</p>
                    <p><strong>Description:</strong> Configuration files containing sensitive data are sometimes exposed. Can you retrieve the application's configuration?</p>
                    <p><strong>Hint:</strong> Configuration endpoints might be accessible if not properly secured</p>
                    <p><strong>Flag:</strong> Capture the flag when you retrieve sensitive configuration data</p>
                    <p><a href="/lab2">→ Start Lab 2</a></p>
                </div>

                <div class="challenge">
                    <h3>👑 Lab 3 - Default Credentials <span class="difficulty hard">HARD</span></h3>
                    <p><strong>Stage:</strong> Initial Access</p>
                    <p><strong>Description:</strong> Administrators sometimes forget to change default credentials. Can you find and access the admin panel?</p>
                    <p><strong>Hint:</strong> Look for admin login endpoints and try common default credentials</p>
                    <p><strong>Flag:</strong> Capture the flag when you successfully authenticate as admin</p>
                    <p><a href="/lab3">→ Start Lab 3</a></p>
                </div>

                <div class="info">
                    <strong>⚡ PRO TIP:</strong> Use your browser's DevTools (F12) to inspect network requests, or use command-line tools like curl for more control.
                </div>
            </div>
        </body>
        </html>
    `);
});

// Example page - Educational walkthrough
app.get('/example', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Example - Security Misconfiguration Explained</title>
            <style>
                body {
                    background-color: #1a1a1a;
                    color: #00ff00;
                    font-family: 'Courier New', monospace;
                    padding: 20px;
                    line-height: 1.6;
                }
                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                h1 {
                    text-align: center;
                    font-size: 2.5em;
                    text-shadow: 0 0 10px #00ff00;
                    border-bottom: 2px solid #00ff00;
                    padding-bottom: 10px;
                }
                h2 {
                    color: #00ff00;
                    margin-top: 30px;
                    border-bottom: 1px solid #00ff00;
                    padding-bottom: 5px;
                }
                h3 {
                    color: #00ffff;
                }
                .section {
                    background-color: #0a0a0a;
                    border: 2px solid #00ff00;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 5px;
                }
                .vulnerable {
                    border-color: #ff0000;
                }
                .secure {
                    border-color: #00ff00;
                }
                pre {
                    background-color: #000;
                    padding: 15px;
                    border-radius: 5px;
                    overflow-x: auto;
                    border-left: 4px solid #00ff00;
                }
                code {
                    color: #00ffff;
                }
                .warning {
                    background-color: #330000;
                    border-left: 4px solid #ff0000;
                    padding: 15px;
                    margin: 15px 0;
                }
                .success {
                    background-color: #003300;
                    border-left: 4px solid #00ff00;
                    padding: 15px;
                    margin: 15px 0;
                }
                a {
                    color: #00ffff;
                    text-decoration: none;
                    border-bottom: 1px dotted #00ffff;
                }
                a:hover {
                    color: #00ff00;
                    border-bottom: 1px solid #00ff00;
                }
                .tools {
                    background-color: #0a0a0a;
                    border: 2px solid #ffaa00;
                    padding: 15px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📚 SECURITY MISCONFIGURATION TUTORIAL</h1>
                
                <div class="section">
                    <h2>What is Security Misconfiguration?</h2>
                    <p><strong>Security Misconfiguration</strong> occurs when security settings are defined, implemented, or maintained improperly. This is one of the most common vulnerabilities and can happen at any level of an application stack.</p>
                    <p>Common misconfigurations include:</p>
                    <ul>
                        <li><strong>Debug endpoints enabled in production</strong> - Exposing sensitive system information</li>
                        <li><strong>Verbose error messages</strong> - Revealing stack traces and internal paths</li>
                        <li><strong>Default credentials</strong> - Using unchanged default usernames and passwords</li>
                        <li><strong>Missing security headers</strong> - Lack of HTTP security headers</li>
                        <li><strong>Unnecessary features enabled</strong> - Running unused services that expand attack surface</li>
                    </ul>
                </div>

                <div class="section vulnerable">
                    <h2>❌ Vulnerability 1: Debug Endpoints</h2>
                    <p>Debug endpoints are useful during development but dangerous in production:</p>
                    <pre><code>// VULNERABLE - Debug endpoint exposed
app.get('/debug', (req, res) => {
    res.json({
        environment: process.env.NODE_ENV,
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
        environmentVariables: process.env, // ⚠️ DANGER!
        databaseConfig: config.database
    });
});</code></pre>
                    <div class="warning">
                        <strong>⚠️ VULNERABILITY:</strong> This endpoint exposes sensitive system information including environment variables, database credentials, and API keys that attackers can use to compromise the system.
                    </div>
                </div>

                <div class="section secure">
                    <h2>✅ Secure Debug Endpoints</h2>
                    <p>Proper implementation with access controls:</p>
                    <pre><code>// SECURE - Debug endpoint with authentication
app.get('/debug', requireAuth, requireAdmin, (req, res) => {
    // Only accessible to authenticated admins
    // Only expose non-sensitive information
    res.json({
        status: 'healthy',
        version: '1.0.0',
        uptime: process.uptime()
    });
});

// Better yet: Disable entirely in production
if (process.env.NODE_ENV !== 'production') {
    app.get('/debug', (req, res) => {
        // Debug info only in development
    });
}</code></pre>
                    <div class="success">
                        <strong>✅ SECURE:</strong> Debug endpoints should require authentication/authorization or be disabled entirely in production environments.
                    </div>
                </div>

                <div class="section vulnerable">
                    <h2>❌ Vulnerability 2: Verbose Error Messages</h2>
                    <p>Detailed error messages can leak sensitive information:</p>
                    <pre><code>// VULNERABLE - Stack traces exposed
app.get('/api/data', (req, res) => {
    try {
        const data = database.query('SELECT * FROM users');
        res.json(data);
    } catch (error) {
        // ⚠️ Exposing full error details
        res.status(500).json({
            error: error.message,
            stack: error.stack, // Shows file paths and code
            query: error.sql    // Shows database structure
        });
    }
});</code></pre>
                    <div class="warning">
                        <strong>⚠️ VULNERABILITY:</strong> Stack traces reveal internal file structures, code logic, database schemas, and framework versions that attackers can exploit.
                    </div>
                </div>

                <div class="section secure">
                    <h2>✅ Secure Error Handling</h2>
                    <p>Generic errors for users, detailed logs for developers:</p>
                    <pre><code>// SECURE - Generic error messages
app.get('/api/data', (req, res) => {
    try {
        const data = database.query('SELECT * FROM users');
        res.json(data);
    } catch (error) {
        // Log detailed error server-side for debugging
        logger.error('Database error:', error);
        
        // Return generic error to client
        res.status(500).json({
            error: 'Internal server error',
            message: 'An error occurred processing your request'
        });
    }
});</code></pre>
                    <div class="success">
                        <strong>✅ SECURE:</strong> Show generic error messages to users while logging detailed information server-side for debugging.
                    </div>
                </div>

                <div class="section vulnerable">
                    <h2>❌ Vulnerability 3: Default Credentials</h2>
                    <p>Many systems ship with default credentials that are rarely changed:</p>
                    <pre><code>// VULNERABLE - Default credentials unchanged
const adminUser = {
    username: 'admin',
    password: 'admin123'  // ⚠️ Default password!
};

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === adminUser.username && 
        password === adminUser.password) {
        return res.json({ 
            success: true, 
            role: 'admin' 
        });
    }
    
    res.status(401).json({ error: 'Invalid credentials' });
});</code></pre>
                    <div class="warning">
                        <strong>⚠️ VULNERABILITY:</strong> Default credentials like admin/admin, admin/password, root/root are the first thing attackers try and are widely documented online.
                    </div>
                </div>

                <div class="section secure">
                    <h2>✅ Secure Credential Management</h2>
                    <p>Force password changes and use strong hashing:</p>
                    <pre><code>// SECURE - Hashed passwords with forced change
const bcrypt = require('bcrypt');

// Store only hashed passwords
const users = [
    {
        username: 'admin',
        passwordHash: bcrypt.hashSync('strong_unique_password', 10),
        mustChangePassword: false  // Forced on first login
    }
];

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (user.mustChangePassword) {
        return res.json({ 
            success: true, 
            requiresPasswordChange: true 
        });
    }
    
    res.json({ success: true, role: user.role });
});</code></pre>
                    <div class="success">
                        <strong>✅ SECURE:</strong> Use strong password hashing, enforce password complexity, require changing default passwords on first login, and implement account lockout policies.
                    </div>
                </div>

                <div class="section vulnerable">
                    <h2>❌ Vulnerability 4: Missing Security Headers</h2>
                    <p>Without security headers, applications are vulnerable to various attacks:</p>
                    <pre><code>// VULNERABLE - No security headers
const express = require('express');
const app = express();

// ⚠️ No security headers configured!
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Response headers:
// X-Powered-By: Express  ← Reveals technology
// (missing CSP, HSTS, X-Frame-Options, etc.)</code></pre>
                    <div class="warning">
                        <strong>⚠️ VULNERABILITY:</strong> Missing security headers allow XSS, clickjacking, MIME-type sniffing attacks, and reveal technology stack information to attackers.
                    </div>
                </div>

                <div class="section secure">
                    <h2>✅ Secure Security Headers</h2>
                    <p>Implement comprehensive security headers:</p>
                    <pre><code>// SECURE - Comprehensive security headers
const helmet = require('helmet');
const express = require('express');
const app = express();

// Remove technology header
app.disable('x-powered-by');

// Add security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true
    },
    frameguard: {
        action: 'deny'
    },
    noSniff: true,
    xssFilter: true
}));

// Response now includes:
// Strict-Transport-Security: max-age=31536000
// Content-Security-Policy: default-src 'self'
// X-Frame-Options: DENY
// X-Content-Type-Options: nosniff</code></pre>
                    <div class="success">
                        <strong>✅ SECURE:</strong> Implement security headers to prevent common web vulnerabilities. Use libraries like Helmet.js to easily configure multiple headers.
                    </div>
                </div>

                <div class="section">
                    <h2>How to Exploit Misconfigurations</h2>
                    <p>Testing for security misconfigurations:</p>
                    <ol>
                        <li><strong>Enumerate endpoints:</strong> Try common paths like /debug, /admin, /config, /.env</li>
                        <li><strong>Check error messages:</strong> Trigger errors and examine responses for sensitive data</li>
                        <li><strong>Test default credentials:</strong> Try admin/admin, admin/password, root/root</li>
                        <li><strong>Inspect HTTP headers:</strong> Look for technology disclosure and missing security headers</li>
                        <li><strong>Review client-side code:</strong> Check for hardcoded API keys or credentials</li>
                    </ol>
                </div>

                <div class="tools">
                    <h2>🛠️ Tools for Testing</h2>
                    
                    <h3>1. Using curl (Command Line)</h3>
                    <pre><code># Test debug endpoint
curl http://localhost:3002/api/lab1/debug

# View all response headers
curl -I http://localhost:3002/

# Test POST request with credentials
curl -X POST http://localhost:3002/api/lab3/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin","password":"admin123"}'

# Save response to file
curl http://localhost:3002/api/lab2/config -o config.json</code></pre>

                    <h3>2. Using Browser DevTools</h3>
                    <p>1. Press <strong>F12</strong> to open DevTools</p>
                    <p>2. Go to <strong>Network</strong> tab to inspect requests/responses</p>
                    <p>3. In <strong>Console</strong> tab, test API endpoints:</p>
                    <pre><code>// GET request
fetch('http://localhost:3002/api/lab1/debug')
    .then(r => r.json())
    .then(data => console.log(data));

// POST request
fetch('http://localhost:3002/api/lab3/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
})
    .then(r => r.json())
    .then(data => console.log(data));</code></pre>

                    <h3>3. Using Postman</h3>
                    <p>1. Create a new request</p>
                    <p>2. Select request type (GET/POST)</p>
                    <p>3. Enter URL: <code>http://localhost:3002/api/lab1/debug</code></p>
                    <p>4. For POST requests, add JSON body in the <strong>Body</strong> tab</p>
                    <p>5. Click <strong>Send</strong> and inspect the response</p>

                    <h3>4. Using Burp Suite</h3>
                    <p>1. Configure browser proxy (127.0.0.1:8080)</p>
                    <p>2. Visit the lab pages</p>
                    <p>3. Intercept and modify requests in <strong>Proxy → Intercept</strong></p>
                    <p>4. Use <strong>Repeater</strong> to test different payloads</p>
                    <p>5. Use <strong>Intruder</strong> for automated testing</p>
                </div>

                <div class="section">
                    <h2>Real-World Impact</h2>
                    <p>Security misconfigurations have led to major breaches:</p>
                    <ul>
                        <li><strong>Equifax (2017):</strong> Unpatched Apache Struts - 147 million records stolen</li>
                        <li><strong>MongoDB databases:</strong> Thousands exposed with default no-authentication config</li>
                        <li><strong>Amazon S3 buckets:</strong> Misconfigured permissions exposing sensitive data</li>
                        <li><strong>Debug endpoints:</strong> Exposed database credentials and API keys</li>
                        <li><strong>Default credentials:</strong> IoT devices compromised for botnets</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>Prevention Best Practices</h2>
                    <ol>
                        <li><strong>Hardening checklist:</strong> Follow security hardening guides for all components</li>
                        <li><strong>Minimal attack surface:</strong> Disable unnecessary features, services, and accounts</li>
                        <li><strong>Security headers:</strong> Implement all relevant HTTP security headers</li>
                        <li><strong>Generic errors:</strong> Never expose stack traces or detailed errors to users</li>
                        <li><strong>Strong passwords:</strong> Enforce password complexity and change defaults</li>
                        <li><strong>Regular updates:</strong> Keep all software and dependencies updated</li>
                        <li><strong>Configuration review:</strong> Regularly audit configurations for security issues</li>
                        <li><strong>Environment separation:</strong> Use different configs for dev/staging/production</li>
                        <li><strong>Automated scanning:</strong> Use tools to detect misconfigurations</li>
                    </ol>
                </div>

                <div class="section" style="text-align: center; margin-top: 40px;">
                    <h2>Ready to Practice?</h2>
                    <p>Now that you understand security misconfigurations, try the labs:</p>
                    <p><a href="/">← Back to Labs</a></p>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 1 - Debug Exposure (Easy)
app.get('/lab1', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lab 1 - Debug Exposure</title>
            <style>
                body {
                    background-color: #1a1a1a;
                    color: #00ff00;
                    font-family: 'Courier New', monospace;
                    padding: 20px;
                    line-height: 1.6;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                h1 {
                    text-align: center;
                    font-size: 2.5em;
                    text-shadow: 0 0 10px #00ff00;
                    border-bottom: 2px solid #00ff00;
                    padding-bottom: 10px;
                }
                .info-box {
                    background-color: #0a0a0a;
                    border: 2px solid #00ff00;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 5px;
                }
                .hint-box {
                    background-color: #0a0a0a;
                    border-left: 4px solid #ffaa00;
                    padding: 15px;
                    margin: 20px 0;
                }
                .endpoint {
                    background-color: #000;
                    padding: 15px;
                    border-radius: 5px;
                    border-left: 4px solid #00ffff;
                    margin: 15px 0;
                    font-family: monospace;
                }
                code {
                    color: #00ffff;
                }
                a {
                    color: #00ffff;
                    text-decoration: none;
                    border-bottom: 1px dotted #00ffff;
                }
                a:hover {
                    color: #00ff00;
                    border-bottom: 1px solid #00ff00;
                }
                .difficulty {
                    display: inline-block;
                    padding: 5px 15px;
                    border-radius: 3px;
                    font-weight: bold;
                    background-color: #00ff00;
                    color: #000;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔍 LAB 1: DEBUG EXPOSURE <span class="difficulty">EASY</span></h1>
                
                <div class="info-box">
                    <h2>📋 Mission Brief</h2>
                    <p><strong>Stage:</strong> Recon</p>
                    <p><strong>Objective:</strong> Find and access the exposed debug endpoint</p>
                    <p><strong>Difficulty:</strong> Easy</p>
                    <p><strong>Flag:</strong> Will be revealed when you access the debug endpoint</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Challenge Description</h2>
                    <p>The development team often leaves debug endpoints enabled in production environments. These endpoints can expose sensitive system information that attackers can use to plan further attacks.</p>
                    <p>Your task is to find the debug endpoint and capture the flag.</p>
                </div>

                <div class="endpoint">
                    <strong>Target Endpoint:</strong><br>
                    <code>GET http://localhost:3002/api/lab1/????</code><br><br>
                    <strong>Hint:</strong> Common debug endpoint names
                </div>

                <div class="hint-box">
                    <strong>💡 Hints:</strong>
                    <ul>
                        <li>Debug endpoints typically have predictable names</li>
                        <li>Try common variations like: debug, status, info, diagnostics</li>
                        <li>The endpoint is directly under /api/lab1/</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
                    <p><strong>Using curl:</strong></p>
                    <pre><code>curl http://localhost:3002/api/lab1/debug
curl http://localhost:3002/api/lab1/status
curl http://localhost:3002/api/lab1/info</code></pre>
                    
                    <p><strong>Using Browser Console (F12):</strong></p>
                    <pre><code>fetch('http://localhost:3002/api/lab1/debug')
    .then(r => r.json())
    .then(data => console.log(data));</code></pre>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 1 API - Exposed debug endpoint (vulnerable)
app.get('/api/lab1/debug', (req, res) => {
    // Vulnerable: Debug endpoint exposed in production
    res.json({
        flag: 'NSA{D3BUG_F0UND}',
        message: 'Congratulations! You found the exposed debug endpoint.',
        vulnerability: 'Debug endpoints should never be accessible in production',
        systemInfo: {
            environment: process.env.NODE_ENV || 'production',
            nodeVersion: process.version,
            platform: process.platform,
            uptime: process.uptime() + ' seconds',
            memoryUsage: process.memoryUsage()
        },
        hint: 'This information could help attackers plan further attacks!'
    });
});

// Lab 2 - Configuration Leak (Medium)
app.get('/lab2', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lab 2 - Configuration Leak</title>
            <style>
                body {
                    background-color: #1a1a1a;
                    color: #00ff00;
                    font-family: 'Courier New', monospace;
                    padding: 20px;
                    line-height: 1.6;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                h1 {
                    text-align: center;
                    font-size: 2.5em;
                    text-shadow: 0 0 10px #00ff00;
                    border-bottom: 2px solid #00ff00;
                    padding-bottom: 10px;
                }
                .info-box {
                    background-color: #0a0a0a;
                    border: 2px solid #00ff00;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 5px;
                }
                .hint-box {
                    background-color: #0a0a0a;
                    border-left: 4px solid #ffaa00;
                    padding: 15px;
                    margin: 20px 0;
                }
                .endpoint {
                    background-color: #000;
                    padding: 15px;
                    border-radius: 5px;
                    border-left: 4px solid #00ffff;
                    margin: 15px 0;
                    font-family: monospace;
                }
                code {
                    color: #00ffff;
                }
                a {
                    color: #00ffff;
                    text-decoration: none;
                    border-bottom: 1px dotted #00ffff;
                }
                a:hover {
                    color: #00ff00;
                    border-bottom: 1px solid #00ff00;
                }
                .difficulty {
                    display: inline-block;
                    padding: 5px 15px;
                    border-radius: 3px;
                    font-weight: bold;
                    background-color: #ffaa00;
                    color: #000;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎭 LAB 2: CONFIGURATION LEAK <span class="difficulty">MEDIUM</span></h1>
                
                <div class="info-box">
                    <h2>📋 Mission Brief</h2>
                    <p><strong>Stage:</strong> Scanning</p>
                    <p><strong>Objective:</strong> Retrieve sensitive configuration data</p>
                    <p><strong>Difficulty:</strong> Medium</p>
                    <p><strong>Flag:</strong> Will be revealed when you access the configuration endpoint</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Challenge Description</h2>
                    <p>Applications often have configuration endpoints that should be protected but are sometimes left accessible. These endpoints can expose database credentials, API keys, and other sensitive information.</p>
                    <p>Your task is to find and access the configuration endpoint to retrieve sensitive data.</p>
                </div>

                <div class="endpoint">
                    <strong>Target Endpoint:</strong><br>
                    <code>GET http://localhost:3002/api/lab2/????</code><br><br>
                    <strong>Hint:</strong> Where might configuration data be exposed?
                </div>

                <div class="hint-box">
                    <strong>💡 Hints:</strong>
                    <ul>
                        <li>Configuration endpoints often use predictable names</li>
                        <li>Try variations like: config, configuration, settings, env</li>
                        <li>The endpoint might return database credentials and API keys</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
                    <p><strong>Using curl:</strong></p>
                    <pre><code>curl http://localhost:3002/api/lab2/config
curl http://localhost:3002/api/lab2/settings
curl http://localhost:3002/api/lab2/env</code></pre>
                    
                    <p><strong>Using Browser Console (F12):</strong></p>
                    <pre><code>fetch('http://localhost:3002/api/lab2/config')
    .then(r => r.json())
    .then(data => console.log(data));</code></pre>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 2 API - Configuration exposure endpoint (vulnerable)
app.get('/api/lab2/config', (req, res) => {
    // Vulnerable: Configuration endpoint exposed without authentication
    res.json({
        flag: 'NSA{C0NF1G_L3AK3D}',
        message: 'Congratulations! You accessed the configuration endpoint.',
        vulnerability: 'Configuration data should never be publicly accessible',
        configuration: configData,
        warning: 'This data includes database credentials and API keys!'
    });
});

// Lab 3 - Default Credentials (Hard)
app.get('/lab3', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lab 3 - Default Credentials</title>
            <style>
                body {
                    background-color: #1a1a1a;
                    color: #00ff00;
                    font-family: 'Courier New', monospace;
                    padding: 20px;
                    line-height: 1.6;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                h1 {
                    text-align: center;
                    font-size: 2.5em;
                    text-shadow: 0 0 10px #00ff00;
                    border-bottom: 2px solid #00ff00;
                    padding-bottom: 10px;
                }
                .info-box {
                    background-color: #0a0a0a;
                    border: 2px solid #00ff00;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 5px;
                }
                .hint-box {
                    background-color: #0a0a0a;
                    border-left: 4px solid #ffaa00;
                    padding: 15px;
                    margin: 20px 0;
                }
                .endpoint {
                    background-color: #000;
                    padding: 15px;
                    border-radius: 5px;
                    border-left: 4px solid #00ffff;
                    margin: 15px 0;
                    font-family: monospace;
                }
                code {
                    color: #00ffff;
                }
                a {
                    color: #00ffff;
                    text-decoration: none;
                    border-bottom: 1px dotted #00ffff;
                }
                a:hover {
                    color: #00ff00;
                    border-bottom: 1px solid #00ff00;
                }
                .difficulty {
                    display: inline-block;
                    padding: 5px 15px;
                    border-radius: 3px;
                    font-weight: bold;
                    background-color: #ff0000;
                    color: #fff;
                }
                .warning {
                    background-color: #330000;
                    border-left: 4px solid #ff0000;
                    padding: 15px;
                    margin: 15px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>👑 LAB 3: DEFAULT CREDENTIALS <span class="difficulty">HARD</span></h1>
                
                <div class="info-box">
                    <h2>📋 Mission Brief</h2>
                    <p><strong>Stage:</strong> Initial Access</p>
                    <p><strong>Objective:</strong> Access the admin panel using default credentials</p>
                    <p><strong>Difficulty:</strong> Hard</p>
                    <p><strong>Flag:</strong> Will be revealed when you successfully authenticate</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Challenge Description</h2>
                    <p>Many systems ship with default administrative credentials that are never changed in production. Attackers can use these well-known credentials to gain unauthorized access.</p>
                    <p>Your task is to find the admin login endpoint and authenticate using default credentials.</p>
                </div>

                <div class="warning">
                    <strong>⚠️ WARNING:</strong> This challenge requires you to find TWO things:
                    <ol>
                        <li>The admin login endpoint</li>
                        <li>The default credentials to use</li>
                    </ol>
                </div>

                <div class="endpoint">
                    <strong>Admin Panel Check:</strong><br>
                    <code>GET http://localhost:3002/api/lab3/admin</code><br><br>
                    <strong>Login Endpoint (you need to find this):</strong><br>
                    <code>POST http://localhost:3002/api/lab3/????</code><br>
                    <code>Content-Type: application/json</code><br>
                    <code>{"username": "????", "password": "????"}</code>
                </div>

                <div class="hint-box">
                    <strong>💡 Hints:</strong>
                    <ul>
                        <li>First, try accessing /api/lab3/admin to see if you're authenticated</li>
                        <li>You need to find the login endpoint - try common names like: login, auth, signin</li>
                        <li>Default credentials are often: admin/admin, admin/password, admin/admin123</li>
                        <li>This is a POST request with JSON body containing username and password</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
                    <p><strong>Using curl:</strong></p>
                    <pre><code># Check admin access first
curl http://localhost:3002/api/lab3/admin

# Try to login with default credentials
curl -X POST http://localhost:3002/api/lab3/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin","password":"admin123"}'

# Check admin access again after login
curl http://localhost:3002/api/lab3/admin</code></pre>
                    
                    <p><strong>Using Browser Console (F12):</strong></p>
                    <pre><code>// Check admin access
fetch('http://localhost:3002/api/lab3/admin')
    .then(r => r.json())
    .then(data => console.log(data));

// Try to login
fetch('http://localhost:3002/api/lab3/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
})
    .then(r => r.json())
    .then(data => console.log(data));</code></pre>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 3 API - Admin panel check
app.get('/api/lab3/admin', (req, res) => {
    // Check if authenticated (in real app, would check session)
    const isAuthenticated = req.headers['x-admin-auth'] === 'authenticated';
    
    if (!isAuthenticated) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'You must be authenticated as admin to access this panel',
            hint: 'Find the login endpoint and authenticate first'
        });
    }
    
    res.json({
        message: 'Welcome to the Admin Panel',
        adminAccess: true,
        hint: 'You have access, but you need to login first to get the flag!'
    });
});

// Lab 3 API - Login endpoint (vulnerable to default credentials)
app.post('/api/lab3/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Username and password are required'
        });
    }
    
    // Vulnerable: Using default credentials
    if (username === adminCredentials.username && 
        password === adminCredentials.password) {
        return res.json({
            success: true,
            flag: 'NSA{4DM1N_P4N3L_PWN3D}',
            message: 'Congratulations! You successfully logged in with default credentials.',
            vulnerability: 'Default credentials should always be changed in production',
            credentials_used: { username, password },
            token: 'admin_access_token_12345',
            warning: 'In a real attack, you would now have full administrative access!'
        });
    }
    
    res.status(401).json({
        error: 'Invalid credentials',
        message: 'Username or password is incorrect'
    });
});

app.listen(PORT, () => {
    console.log(`\x1b[32m
╔════════════════════════════════════════════╗
║   A02: SECURITY MISCONFIGURATION LAB      ║
║   Server running on port ${PORT}           ║
║                                            ║
║   Access the lab:                         ║
║   http://localhost:${PORT}                    ║
╚════════════════════════════════════════════╝
\x1b[0m`);
});
