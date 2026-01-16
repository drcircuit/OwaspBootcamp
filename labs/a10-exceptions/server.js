const express = require('express');
const app = express();
const PORT = 3010;

app.use(express.json());

// Simulated database
const database = {
    users: [
        { id: 1, username: 'admin', role: 'admin', secret: 'FLAG_HIDDEN_HERE' },
        { id: 2, username: 'user', role: 'user', secret: 'no_secrets' }
    ],
    config: {
        dbPath: '/var/lib/db/production.db',
        apiKey: 'sk_live_51HxYz...',
        internalPort: 5432
    }
};

// Home page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>A10: Exception Mishandling</title>
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
                <h1>⚡ A10: EXCEPTION MISHANDLING ⚡</h1>
                
                <div class="challenge">
                    <h3>📚 Example - Exception Handling <span class="difficulty example">TUTORIAL</span></h3>
                    <p>Learn about proper error handling, what information should and shouldn't be exposed, and how errors can leak sensitive data.</p>
                    <p><a href="/example">→ Start Tutorial</a></p>
                </div>

                <div class="challenge">
                    <h3>🎯 Lab 1 - Information Leak <span class="difficulty easy">EASY</span></h3>
                    <p><strong>Stage:</strong> Recon</p>
                    <p><strong>Description:</strong> Extract system information from verbose error messages.</p>
                    <p><strong>Hint:</strong> Try accessing invalid user IDs or malformed parameters</p>
                    <p><strong>Flag:</strong> Capture the flag from error response data</p>
                    <p><a href="/lab1">→ Start Lab 1</a></p>
                </div>

                <div class="challenge">
                    <h3>🎯 Lab 2 - Stack Trace Mining <span class="difficulty medium">MEDIUM</span></h3>
                    <p><strong>Stage:</strong> Scanning</p>
                    <p><strong>Description:</strong> Extract reconnaissance data from exposed stack traces.</p>
                    <p><strong>Hint:</strong> Stack traces reveal frameworks and file structures</p>
                    <p><strong>Flag:</strong> Capture the flag from stack trace data</p>
                    <p><a href="/lab2">→ Start Lab 2</a></p>
                </div>

                <div class="challenge">
                    <h3>🎯 Lab 3 - Silent Failures <span class="difficulty hard">HARD</span></h3>
                    <p><strong>Stage:</strong> Initial Access</p>
                    <p><strong>Description:</strong> Exploit error suppression to hide exploitation attempts.</p>
                    <p><strong>Hint:</strong> Generic errors prevent security monitoring</p>
                    <p><strong>Flag:</strong> Capture the flag by bypassing error detection</p>
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
            <title>Example - Exception Handling</title>
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
                <h1>⚡ EXCEPTION HANDLING BEST PRACTICES</h1>
                
                <div class="section">
                    <h2>What is Exception Mishandling?</h2>
                    <p>Exception mishandling occurs when error messages expose sensitive information about your application's internals. This includes:</p>
                    <ul>
                        <li><strong>Stack traces</strong> - Revealing code structure and file paths</li>
                        <li><strong>Database errors</strong> - Exposing database type and schema</li>
                        <li><strong>Framework details</strong> - Showing versions with known vulnerabilities</li>
                        <li><strong>Configuration data</strong> - Leaking internal settings</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>❌ Common Exception Handling Mistakes</h2>
                    
                    <h3>1. Verbose Error Messages</h3>
                    <div class="bad">
                        <strong>Problem:</strong> Exposing technical details to users
                        <pre><code>app.get('/user/:id', (req, res) => {
    const user = db.query(\`SELECT * FROM users WHERE id = \${req.params.id}\`);
    if (!user) {
        res.status(404).json({
            error: 'User not found',
            database: 'PostgreSQL 14.2',
            table: 'users',
            query: \`SELECT * FROM users WHERE id = \${req.params.id}\`
        });
    }
});</code></pre>
                    </div>
                    <div class="good">
                        <strong>Solution:</strong> Generic user-facing errors
                        <pre><code>app.get('/user/:id', (req, res) => {
    try {
        const user = db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        if (!user) {
            logger.warn('User not found', { id: req.params.id });
            return res.status(404).json({
                error: 'User not found'
            });
        }
        res.json(user);
    } catch (error) {
        logger.error('Database error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});</code></pre>
                    </div>

                    <h3>2. Exposed Stack Traces</h3>
                    <div class="bad">
                        <strong>Problem:</strong> Stack traces reveal code structure
                        <pre><code>app.post('/process', (req, res) => {
    try {
        processData(req.body);
    } catch (error) {
        res.status(500).json({
            error: error.message,
            stack: error.stack // NEVER EXPOSE THIS!
        });
    }
});</code></pre>
                    </div>
                    <div class="good">
                        <strong>Solution:</strong> Log errors server-side only
                        <pre><code>app.post('/process', (req, res) => {
    try {
        processData(req.body);
        res.json({ success: true });
    } catch (error) {
        logger.error('Processing failed', {
            error: error.message,
            stack: error.stack,
            requestId: req.id
        });
        res.status(500).json({
            error: 'Unable to process request',
            requestId: req.id
        });
    }
});</code></pre>
                    </div>

                    <h3>3. Silent Failures</h3>
                    <div class="bad">
                        <strong>Problem:</strong> Generic errors hide security issues
                        <pre><code>app.get('/admin', (req, res) => {
    try {
        if (!req.user.isAdmin) {
            throw new Error('Not authorized');
        }
        res.json(adminData);
    } catch (error) {
        // Generic error - can't tell if it's auth failure or server error
        res.status(500).json({ error: 'Internal error' });
    }
});</code></pre>
                    </div>
                    <div class="good">
                        <strong>Solution:</strong> Appropriate HTTP status codes
                        <pre><code>app.get('/admin', (req, res) => {
    try {
        if (!req.user.isAdmin) {
            logger.warn('Unauthorized admin access attempt', {
                userId: req.user.id,
                ip: req.ip
            });
            return res.status(403).json({
                error: 'Access denied'
            });
        }
        res.json(adminData);
    } catch (error) {
        logger.error('Admin endpoint error', error);
        res.status(500).json({ error: 'Internal error' });
    }
});</code></pre>
                    </div>
                </div>

                <div class="section">
                    <h2>✅ Best Practices</h2>
                    <ul>
                        <li><strong>Use generic error messages</strong> for users</li>
                        <li><strong>Log detailed errors</strong> server-side only</li>
                        <li><strong>Never expose stack traces</strong> in production</li>
                        <li><strong>Use proper HTTP status codes</strong> (400, 401, 403, 500, etc.)</li>
                        <li><strong>Disable debug modes</strong> in production</li>
                        <li><strong>Validate inputs</strong> to prevent unexpected errors</li>
                        <li><strong>Use error monitoring</strong> services (Sentry, Rollbar)</li>
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

// Lab 1 page - Information Leak
app.get('/lab1', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lab 1 - Information Leak</title>
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
                <h1>⚡ LAB 1: INFORMATION LEAK <span class="difficulty">EASY</span></h1>
                
                <div class="info-box">
                    <h2>📋 Mission Brief</h2>
                    <p><strong>Stage:</strong> Recon</p>
                    <p><strong>Objective:</strong> Extract system information from verbose error messages</p>
                    <p><strong>Flag:</strong> Will be revealed in the error response</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Challenge Description</h2>
                    <p>The API has a user lookup endpoint that doesn't properly sanitize error messages. When errors occur, it exposes internal details about the application.</p>
                    <p>Your task is to trigger an error condition that leaks sensitive information and reveals the flag.</p>
                </div>

                <div class="endpoint">
                    <strong>API Endpoint:</strong><br>
                    <code>GET http://localhost:3010/api/user/:id</code><br><br>
                    <strong>Examples:</strong><br>
                    <code>GET http://localhost:3010/api/user/1</code> (valid)<br>
                    <code>GET http://localhost:3010/api/user/abc</code> (invalid - triggers error)
                </div>

                <div class="hint-box">
                    <strong>💡 Hints:</strong>
                    <ul>
                        <li>Try accessing with an invalid user ID format</li>
                        <li>Look for verbose error messages in the response</li>
                        <li>Error messages might reveal expected data types</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
                    <p><strong>Using curl:</strong></p>
                    <pre><code>curl http://localhost:3010/api/user/invalid</code></pre>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 2 page - Stack Trace Mining
app.get('/lab2', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lab 2 - Stack Trace Mining</title>
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
                <h1>⚡ LAB 2: STACK TRACE MINING <span class="difficulty">MEDIUM</span></h1>
                
                <div class="info-box">
                    <h2>📋 Mission Brief</h2>
                    <p><strong>Stage:</strong> Scanning</p>
                    <p><strong>Objective:</strong> Extract reconnaissance data from exposed stack traces</p>
                    <p><strong>Flag:</strong> Will be found in the stack trace data</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Challenge Description</h2>
                    <p>The application has a data processing endpoint that doesn't properly handle exceptions. When errors occur, it exposes full stack traces revealing file paths, frameworks, and code structure.</p>
                    <p>Your task is to trigger a type error that exposes the stack trace and reveals the flag.</p>
                </div>

                <div class="endpoint">
                    <strong>API Endpoint:</strong><br>
                    <code>POST http://localhost:3010/api/process</code><br>
                    <code>Content-Type: application/json</code><br><br>
                    <strong>Example:</strong><br>
                    <code>{"data": "some value"}</code>
                </div>

                <div class="hint-box">
                    <strong>💡 Hints:</strong>
                    <ul>
                        <li>The endpoint expects nested data structure</li>
                        <li>Send invalid or incomplete data to trigger an error</li>
                        <li>Look for stack traces in the error response</li>
                        <li>Stack traces reveal frameworks and file paths</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
                    <p><strong>Using curl:</strong></p>
                    <pre><code>curl -X POST http://localhost:3010/api/process \\
  -H "Content-Type: application/json" \\
  -d '{"data": "invalid"}'</code></pre>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 3 page - Silent Failures
app.get('/lab3', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lab 3 - Silent Failures</title>
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
                <h1>⚡ LAB 3: SILENT FAILURES <span class="difficulty">HARD</span></h1>
                
                <div class="info-box">
                    <h2>📋 Mission Brief</h2>
                    <p><strong>Stage:</strong> Initial Access</p>
                    <p><strong>Objective:</strong> Exploit error suppression to bypass security</p>
                    <p><strong>Flag:</strong> Will be revealed when you access the admin endpoint</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Challenge Description</h2>
                    <p>The application has an admin configuration endpoint that should be protected. However, it uses generic error messages that hide the real security failures, making it impossible to distinguish between authorization failures and other errors.</p>
                    <p>Your task is to access the admin endpoint and capture the flag from the generic error response.</p>
                </div>

                <div class="warning">
                    <strong>⚠️ WARNING:</strong> Generic errors prevent security monitoring from detecting attacks. This is the opposite of verbose errors - both are dangerous!
                </div>

                <div class="endpoint">
                    <strong>API Endpoint:</strong><br>
                    <code>GET http://localhost:3010/api/admin/config</code><br><br>
                    <strong>Optional Header:</strong><br>
                    <code>Authorization: Bearer &lt;token&gt;</code>
                </div>

                <div class="hint-box">
                    <strong>💡 Hints:</strong>
                    <ul>
                        <li>Try accessing the admin endpoint without authorization</li>
                        <li>Notice the generic error message</li>
                        <li>Authorization failures are hidden as generic server errors</li>
                        <li>This prevents detection of brute force attempts</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
                    <p><strong>Using curl:</strong></p>
                    <pre><code>curl http://localhost:3010/api/admin/config</code></pre>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// LAB 1: Informative error messages
app.get('/api/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
        return res.status(400).json({
            error: 'Invalid user ID format',
            details: 'Expected integer, received: ' + req.params.id,
            type: 'ValidationError',
            flag: 'NSA{3RR0RS_T3LL_T4L3S}',
            vulnerability: 'Verbose error messages reveal expected data types and validation logic'
        });
    }
    
    const user = database.users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({
            error: 'User not found',
            database: 'PostgreSQL 14.2',
            table: 'users',
            query: `SELECT * FROM users WHERE id = ${userId}`,
            suggestion: 'Valid user IDs are between 1 and ' + database.users.length
        });
    }
    
    res.json({ user: { id: user.id, username: user.username } });
});

// LAB 2: Stack trace exposure
app.post('/api/process', (req, res) => {
    try {
        // Intentionally cause a TypeError
        const data = req.body.data;
        const result = data.nested.property.value.toUpperCase();
        
        res.json({ result });
    } catch (error) {
        // VULNERABLE: Exposing full stack trace
        res.status(500).json({
            error: error.message,
            type: error.name,
            stack: error.stack,
            flag: 'NSA{ST4CK_TR4C3_1NF0}',
            vulnerability: 'Stack traces reveal file paths, frameworks, and code structure',
            leaked_info: {
                framework: 'Express.js',
                node_version: process.version,
                working_directory: process.cwd(),
                entry_point: 'server.js'
            }
        });
    }
});

// LAB 3: Silent failure allowing bypass
app.get('/api/admin/config', (req, res) => {
    try {
        const authToken = req.headers['authorization'];
        
        // VULNERABLE: Silent failure on auth check
        if (!authToken || authToken !== 'Bearer super_secret_token') {
            throw new Error('Unauthorized access attempt');
        }
        
        res.json(database.config);
    } catch (error) {
        // Generic error suppresses the failed auth attempt
        // Attacker won't see security rejection - just generic message
        res.status(500).json({
            error: 'Internal server error',
            message: 'An unexpected error occurred',
            flag: 'NSA{S1L3NCE_1S_G0LD3N}',
            vulnerability: 'Generic errors hide exploitation attempts from monitoring',
            exploit: 'Failed authorization attempts generate no distinct signatures'
        });
    }
});

// Bonus: Debug endpoint (should be disabled in production)
app.get('/api/debug/error', (req, res) => {
    const errorType = req.query.type || 'generic';
    
    const errors = {
        'null': () => {
            const obj = null;
            return obj.property;
        },
        'type': () => {
            return undefined.toString();
        },
        'reference': () => {
            return nonExistentVariable;
        }
    };
    
    try {
        errors[errorType]();
    } catch (error) {
        res.status(500).json({
            debug: true,
            error: error.message,
            stack: error.stack,
            environment: process.env.NODE_ENV,
            hint: 'Debug endpoints should never be exposed in production'
        });
    }
});

// Status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        service: 'Exception Mishandling Lab',
        port: PORT,
        version: '1.0.0',
        uptime: process.uptime()
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`A10: Exception Mishandling Lab running on port ${PORT}`);
});
