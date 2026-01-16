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
                    <h3>📚 EXAMPLE <span class="difficulty example">START HERE</span></h3>
                    <p><strong>Mission:</strong> Understanding how errors leak intelligence to attackers.</p>
                    <p><strong>Intel:</strong> Verbose error messages expose internal architecture, file paths, frameworks, and database structures. Attackers use this reconnaissance data to craft precise exploits.</p>
                    <p><strong>Endpoint:</strong> <code>GET /example</code></p>
                    <p>Try: <code>curl http://localhost:3010/example</code></p>
                </div>

                <div class="challenge">
                    <h3>🎯 LAB 1: Information Leak <span class="difficulty easy">EASY</span></h3>
                    <p><strong>Objective:</strong> Extract system information from verbose error messages.</p>
                    <p><strong>Scenario:</strong> The API doesn't properly sanitize error responses, exposing internal details.</p>
                    <p><strong>Mission:</strong> Trigger an error condition to leak sensitive information and capture the flag.</p>
                    <div class="hint">💡 Try accessing invalid user IDs or malformed parameters to trigger errors.</div>
                </div>

                <div class="challenge">
                    <h3>🎯 LAB 2: Stack Trace Mining <span class="difficulty medium">MEDIUM</span></h3>
                    <p><strong>Objective:</strong> Extract valuable reconnaissance data from exposed stack traces.</p>
                    <p><strong>Scenario:</strong> Unhandled exceptions return full stack traces revealing file paths and code structure.</p>
                    <p><strong>Mission:</strong> Trigger a type error or null reference to expose the stack trace.</p>
                    <div class="hint">💡 Stack traces reveal frameworks, file structures, and dependency versions. Look for processing endpoints.</div>
                </div>

                <div class="challenge">
                    <h3>🎯 LAB 3: Silent Failures <span class="difficulty hard">HARD</span></h3>
                    <p><strong>Objective:</strong> Exploit error suppression to hide exploitation attempts.</p>
                    <p><strong>Scenario:</strong> Generic errors prevent security monitoring from detecting attacks.</p>
                    <p><strong>Mission:</strong> Find an endpoint with suppressed errors that allows unauthorized access.</p>
                    <div class="hint">💡 When errors are too generic, failed exploits leave no trace. Look for admin or debug endpoints.</div>
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
        message: 'Example: Proper error handling',
        info: 'Errors should be logged server-side but show generic messages to users',
        best_practice: 'Never expose stack traces, paths, or internal details in production'
    });
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
