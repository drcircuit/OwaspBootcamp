const express = require('express');
const app = express();
const PORT = 3009;

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
                    <h3>📚 EXAMPLE <span class="difficulty example">START HERE</span></h3>
                    <p><strong>Mission:</strong> Understanding logging blind spots in surveillance systems.</p>
                    <p><strong>Intel:</strong> When security operations aren't logged, attackers can operate in the shadows. No logs = no evidence = no detection.</p>
                    <p><strong>Endpoint:</strong> <code>GET /example</code></p>
                    <p>Try: <code>curl http://localhost:3009/example</code></p>
                </div>

                <div class="challenge">
                    <h3>🎯 LAB 1: Ghost Operations <span class="difficulty easy">EASY</span></h3>
                    <p><strong>Objective:</strong> Find the critical operation that leaves no trace in the audit logs.</p>
                    <p><strong>Scenario:</strong> The system allows user account deletions, but are they being monitored?</p>
                    <p><strong>Mission:</strong> Delete user account 1337 and capture the flag from the unlogged operation.</p>
                    <div class="hint">💡 Critical operations like DELETE should always be logged. Try the user deletion endpoint.</div>
                </div>

                <div class="challenge">
                    <h3>🎯 LAB 2: Data Leakage in Logs <span class="difficulty medium">MEDIUM</span></h3>
                    <p><strong>Objective:</strong> Extract sensitive data that should NEVER be logged.</p>
                    <p><strong>Scenario:</strong> Login attempts are being logged (good), but with dangerous information (bad).</p>
                    <p><strong>Mission:</strong> Attempt a login and examine what gets logged. Find the exposed credentials.</p>
                    <div class="hint">💡 Passwords, tokens, and PII should never appear in logs. Check login endpoints and log viewing.</div>
                </div>

                <div class="challenge">
                    <h3>🎯 LAB 3: Evidence Destruction <span class="difficulty hard">HARD</span></h3>
                    <p><strong>Objective:</strong> Exploit missing audit controls to cover your tracks.</p>
                    <p><strong>Scenario:</strong> If logs can be cleared without proper authorization or audit trails...</p>
                    <p><strong>Mission:</strong> Find and exploit the log manipulation endpoint to erase evidence.</p>
                    <div class="hint">💡 Log management operations should be restricted and audited. Look for administrative endpoints.</div>
                </div>

                <p style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Portal</a>
                </p>
            </div>
        </body>
        </html>
    `);
});

// Example endpoint
app.get('/example', (req, res) => {
    res.json({
        message: 'Example: Logging visibility check',
        info: 'This request was logged with timestamp and IP',
        logged: true,
        timestamp: new Date().toISOString(),
        ip: req.ip
    });
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
