const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory storage for sensitive operations (not logged!)
const operations = [];
const loginAttempts = [];

// Home page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>A09: Logging Failures</title>
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
                code {
                    background-color: #0a0a0a;
                    padding: 2px 6px;
                    border-radius: 3px;
                    color: #00ffff;
                }
                .hint {
                    background-color: #1a1a00;
                    border-left: 4px solid #ffaa00;
                    padding: 10px;
                    margin: 10px 0;
                    color: #ffaa00;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🕵️ A09: LOGGING FAILURES 🕵️</h1>
                
                <div class="challenge">
                    <h3>📚 Example - Logging Best Practices <span class="difficulty example">TUTORIAL</span></h3>
                    <p>Learn about proper logging practices, what should and shouldn't be logged, and how logging failures enable attacks.</p>
                    <p><a href="/example">→ Start Tutorial</a></p>
                </div>

                <div class="challenge">
                    <h3>🎯 Lab 1 - Ghost Operations <span class="difficulty easy">EASY</span></h3>
                    <p><strong>Stage:</strong> Recon</p>
                    <p><strong>Description:</strong> Find the critical operation that leaves no trace in the audit logs.</p>
                    <p><strong>Hint:</strong> Critical operations like DELETE should always be logged</p>
                    <p><strong>Flag:</strong> Capture the flag by performing an unlogged operation</p>
                    <p><a href="/lab1">→ Start Lab 1</a></p>
                </div>

                <div class="challenge">
                    <h3>🎯 Lab 2 - Data Leakage in Logs <span class="difficulty medium">MEDIUM</span></h3>
                    <p><strong>Stage:</strong> Scanning</p>
                    <p><strong>Description:</strong> Extract sensitive data that should NEVER be logged.</p>
                    <p><strong>Hint:</strong> Passwords, tokens, and PII should never appear in logs</p>
                    <p><strong>Flag:</strong> Capture the flag from exposed log data</p>
                    <p><a href="/lab2">→ Start Lab 2</a></p>
                </div>

                <div class="challenge">
                    <h3>🎯 Lab 3 - Evidence Destruction <span class="difficulty hard">HARD</span></h3>
                    <p><strong>Stage:</strong> Cover Tracks</p>
                    <p><strong>Description:</strong> Exploit missing audit controls to cover your tracks.</p>
                    <p><strong>Hint:</strong> Log management operations should be restricted and audited</p>
                    <p><strong>Flag:</strong> Capture the flag by clearing logs without detection</p>
                    <p><a href="/lab3">→ Start Lab 3</a></p>
                </div>

                <p style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Portal</a>
                </p>
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
            <title>Example - Logging Best Practices</title>
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
                .section {
                    background-color: #0a0a0a;
                    border: 2px solid #00ff00;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 5px;
                }
                .good {
                    background-color: #001a00;
                    border-left: 4px solid #00ff00;
                    padding: 15px;
                    margin: 15px 0;
                }
                .bad {
                    background-color: #1a0000;
                    border-left: 4px solid #ff0000;
                    padding: 15px;
                    margin: 15px 0;
                }
                pre {
                    background-color: #000;
                    padding: 15px;
                    border-radius: 5px;
                    overflow-x: auto;
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
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🕵️ LOGGING BEST PRACTICES</h1>
                
                <div class="section">
                    <h2>What is Security Logging?</h2>
                    <p>Security logging is the practice of recording security-relevant events in your application. Proper logging enables:</p>
                    <ul>
                        <li><strong>Detection</strong> - Identify attacks as they happen</li>
                        <li><strong>Investigation</strong> - Understand what happened after an incident</li>
                        <li><strong>Compliance</strong> - Meet regulatory requirements</li>
                        <li><strong>Forensics</strong> - Gather evidence for legal proceedings</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>❌ Common Logging Failures</h2>
                    
                    <h3>1. Missing Logs for Critical Operations</h3>
                    <div class="bad">
                        <strong>Problem:</strong> Critical operations aren't logged
                        <pre><code>app.delete('/api/user/:id', (req, res) => {
    // Delete user - NO LOGGING!
    deleteUser(req.params.id);
    res.json({ success: true });
});</code></pre>
                    </div>
                    <div class="good">
                        <strong>Solution:</strong> Log all security-relevant events
                        <pre><code>app.delete('/api/user/:id', (req, res) => {
    logger.warn('User deletion', {
        userId: req.params.id,
        deletedBy: req.user.id,
        timestamp: new Date(),
        ip: req.ip
    });
    deleteUser(req.params.id);
    res.json({ success: true });
});</code></pre>
                    </div>

                    <h3>2. Logging Sensitive Data</h3>
                    <div class="bad">
                        <strong>Problem:</strong> Passwords and secrets in logs
                        <pre><code>logger.info('Login attempt', {
    username: username,
    password: password, // NEVER LOG THIS!
    sessionToken: token  // OR THIS!
});</code></pre>
                    </div>
                    <div class="good">
                        <strong>Solution:</strong> Never log sensitive data
                        <pre><code>logger.info('Login attempt', {
    username: username,
    success: false,
    ip: req.ip,
    // Password and token intentionally omitted
});</code></pre>
                    </div>

                    <h3>3. Insufficient Log Protection</h3>
                    <div class="bad">
                        <strong>Problem:</strong> Logs can be deleted without audit trail
                        <pre><code>app.post('/api/logs/clear', (req, res) => {
    logs.clear(); // No audit, no authorization check
    res.json({ success: true });
});</code></pre>
                    </div>
                    <div class="good">
                        <strong>Solution:</strong> Protect and audit log operations
                        <pre><code>app.post('/api/logs/clear', requireAdmin, (req, res) => {
    auditLog.critical('Log clearing initiated', {
        by: req.user.id,
        reason: req.body.reason
    });
    logs.clear();
    res.json({ success: true });
});</code></pre>
                    </div>
                </div>

                <div class="section">
                    <h2>✅ What to Log</h2>
                    <ul>
                        <li>Authentication events (login, logout, failures)</li>
                        <li>Authorization failures (access denied)</li>
                        <li>Data access (who accessed what)</li>
                        <li>Data modifications (create, update, delete)</li>
                        <li>System configuration changes</li>
                        <li>Security errors and exceptions</li>
                        <li>Administrative actions</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>❌ What NOT to Log</h2>
                    <ul>
                        <li>Passwords or password hashes</li>
                        <li>Session tokens or API keys</li>
                        <li>Credit card numbers or PII</li>
                        <li>Encryption keys</li>
                        <li>Source code or SQL queries (may contain secrets)</li>
                    </ul>
                </div>

                <p style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Home</a>
                </p>
            </div>
        </body>
        </html>
    `);
});

// Lab 1 page - Ghost Operations
app.get('/lab1', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lab 1 - Ghost Operations</title>
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
                <h1>🕵️ LAB 1: GHOST OPERATIONS <span class="difficulty">EASY</span></h1>
                
                <div class="info-box">
                    <h2>📋 Mission Brief</h2>
                    <p><strong>Stage:</strong> Recon</p>
                    <p><strong>Objective:</strong> Find the critical operation that leaves no trace</p>
                    <p><strong>Flag:</strong> Will be revealed when you perform an unlogged operation</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Challenge Description</h2>
                    <p>The application has a user deletion endpoint. Critical operations like deleting users should always be logged for security auditing and forensics.</p>
                    <p>Your task is to discover and exploit the unlogged deletion endpoint to capture the flag.</p>
                </div>

                <div class="endpoint">
                    <strong>API Endpoint:</strong><br>
                    <code>DELETE http://localhost:3009/api/user/delete/:id</code><br><br>
                    <strong>Example:</strong><br>
                    <code>DELETE http://localhost:3009/api/user/delete/1337</code>
                </div>

                <div class="hint-box">
                    <strong>💡 Hints:</strong>
                    <ul>
                        <li>Try deleting user ID 1337</li>
                        <li>The response will indicate if the operation was logged</li>
                        <li>Critical operations should have audit trails</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
                    <p><strong>Using curl:</strong></p>
                    <pre><code>curl -X DELETE http://localhost:3009/api/user/delete/1337</code></pre>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 2 page - Data Leakage in Logs
app.get('/lab2', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lab 2 - Data Leakage in Logs</title>
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
                <h1>🕵️ LAB 2: DATA LEAKAGE IN LOGS <span class="difficulty">MEDIUM</span></h1>
                
                <div class="info-box">
                    <h2>📋 Mission Brief</h2>
                    <p><strong>Stage:</strong> Scanning</p>
                    <p><strong>Objective:</strong> Extract sensitive data that should never be logged</p>
                    <p><strong>Flag:</strong> Will be found in the exposed log data</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Challenge Description</h2>
                    <p>The application logs login attempts, which is good security practice. However, it's logging data that should NEVER be stored in logs - passwords and authentication tokens.</p>
                    <p>Your task is to trigger a login attempt and then view the logs to extract the flag from the exposed sensitive data.</p>
                </div>

                <div class="endpoint">
                    <strong>Login Endpoint:</strong><br>
                    <code>POST http://localhost:3009/api/login</code><br>
                    <code>{"username": "test", "password": "test123"}</code><br><br>
                    <strong>View Logs Endpoint:</strong><br>
                    <code>GET http://localhost:3009/api/logs/login</code>
                </div>

                <div class="hint-box">
                    <strong>💡 Hints:</strong>
                    <ul>
                        <li>First, attempt a login with any credentials</li>
                        <li>Then, view the login logs to see what was recorded</li>
                        <li>Look for sensitive data that shouldn't be there</li>
                        <li>Passwords should NEVER appear in logs</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
                    <p><strong>Step 1 - Attempt login:</strong></p>
                    <pre><code>curl -X POST http://localhost:3009/api/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"testuser","password":"testpass"}'</code></pre>
                    
                    <p><strong>Step 2 - View the logs:</strong></p>
                    <pre><code>curl http://localhost:3009/api/logs/login</code></pre>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 3 page - Evidence Destruction
app.get('/lab3', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lab 3 - Evidence Destruction</title>
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
                <h1>🕵️ LAB 3: EVIDENCE DESTRUCTION <span class="difficulty">HARD</span></h1>
                
                <div class="info-box">
                    <h2>📋 Mission Brief</h2>
                    <p><strong>Stage:</strong> Cover Tracks</p>
                    <p><strong>Objective:</strong> Exploit missing audit controls to erase evidence</p>
                    <p><strong>Flag:</strong> Will be revealed when you clear the logs</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Challenge Description</h2>
                    <p>After compromising a system, attackers often try to cover their tracks by clearing logs. Properly designed systems should audit log management operations themselves, creating an unbreakable chain of evidence.</p>
                    <p>Your task is to find and exploit the log clearing endpoint that has no audit trail.</p>
                </div>

                <div class="warning">
                    <strong>⚠️ WARNING:</strong> In a secure system, log deletion should be restricted to administrators and itself be logged with full audit details.
                </div>

                <div class="endpoint">
                    <strong>API Endpoint:</strong><br>
                    <code>POST http://localhost:3009/api/logs/clear</code>
                </div>

                <div class="hint-box">
                    <strong>💡 Hints:</strong>
                    <ul>
                        <li>Look for log management endpoints</li>
                        <li>Try clearing the logs</li>
                        <li>Notice there's no authorization check or audit trail</li>
                        <li>Log management operations should themselves be logged</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
                    <p><strong>Using curl:</strong></p>
                    <pre><code>curl -X POST http://localhost:3009/api/logs/clear</code></pre>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// LAB 1: Missing logs on critical operation
app.delete('/api/user/delete/:id', (req, res) => {
    const userId = req.params.id;
    // VULNERABLE: Critical operation with NO logging
    operations.push({
        action: 'delete_user',
        userId: userId,
        timestamp: new Date().toISOString()
    });
    
    res.json({ 
        success: true,
        message: `User ${userId} deleted successfully`,
        warning: 'This critical operation left no audit trail',
        flag: 'NSA{N0TH1NG_L0GG3D}',
        vulnerability: 'Critical operations must be logged for security monitoring'
    });
});

// LAB 2: Sensitive data in logs
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    // VULNERABLE: Logging sensitive data
    const logEntry = {
        timestamp: new Date().toISOString(),
        action: 'login_attempt',
        username: username,
        password: password, // NEVER log passwords!
        ip: req.ip,
        flag: 'NSA{L0G_D4T4_L3AK}'
    };
    
    loginAttempts.push(logEntry);
    
    res.json({
        success: false,
        message: 'Login failed',
        hint: 'Check the logs endpoint to see what was recorded'
    });
});

// View logs (exposes sensitive data)
app.get('/api/logs/login', (req, res) => {
    res.json({
        message: 'Login attempt logs',
        vulnerability: 'Passwords should NEVER be logged',
        logs: loginAttempts
    });
});

// LAB 3: Log manipulation without audit
app.post('/api/logs/clear', (req, res) => {
    const clearedCount = loginAttempts.length + operations.length;
    
    // VULNERABLE: No audit trail for log clearing
    loginAttempts.length = 0;
    operations.length = 0;
    
    res.json({
        success: true,
        message: `Cleared ${clearedCount} log entries`,
        flag: 'NSA{N0_L0GS_N0_CR1M3}',
        exploited: 'Evidence destroyed with no audit trail',
        vulnerability: 'Log management operations must be logged and restricted'
    });
});

// Status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        service: 'Logging Failures Lab',
        port: PORT,
        operations_logged: operations.length,
        login_attempts_logged: loginAttempts.length
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`A09: Logging Failures Lab running on port ${PORT}`);
});
