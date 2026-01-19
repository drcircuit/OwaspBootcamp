const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// PageTurner Books data
const booksMenu = [
    { id: 1, name: 'Espresso', price: 2.99, category: 'hot', description: 'Bold books shot' },
    { id: 2, name: 'Cappuccino', price: 4.49, category: 'hot', description: 'Espresso with steamed milk' },
    { id: 3, name: 'Cold Brew', price: 4.99, category: 'cold', description: 'Smooth cold books' },
    { id: 4, name: 'Caramel Macchiato', price: 5.99, category: 'hot', description: 'Layered espresso drink' }
];

const staff = [
    { id: 1, name: 'Emma Rodriguez', role: 'manager', email: 'emma@beanscene.local', shift: 'morning' },
    { id: 2, name: 'Marcus Chen', role: 'barista', email: 'marcus@beanscene.local', shift: 'morning' },
    { id: 3, name: 'Sofia Martinez', role: 'barista', email: 'sofia@beanscene.local', shift: 'afternoon' }
];

// VULNERABLE configuration data
const configData = {
    database: {
        host: 'db.beanscene.local',
        username: 'books_admin',
        password: 'Bean\$cene2024!',
        database: 'beanscene_prod'
    },
    payment_gateway: {
        square_token: 'sq0atp-BeanScene_Live_Token_xyz789',
        merchant_id: 'MLHV6GRVNB4XQ'
    },
    secrets: {
        jwt_secret: 'beanscene_jwt_secret_key',
        session_key: 'books-shop-session-2024'
    }
};

// VULNERABLE default credentials
const adminCredentials = {
    username: 'admin',
    password: 'beanscene'
};

// Example store systems
const storeSystemsExamples = [
    { id: 100, system: 'POS Terminal 1', status: 'online', version: '2.4.1', ip: '192.168.1.10' },
    { id: 101, system: 'POS Terminal 2', status: 'online', version: '2.4.1', ip: '192.168.1.11' },
    { id: 102, system: 'Inventory Scanner', status: 'online', version: '1.8.3', ip: '192.168.1.20' },
    { id: 103, system: 'Back Office', status: 'maintenance', version: '3.1.0', ip: '192.168.1.30' }
];


// Home page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>PageTurner Books - Management Portal</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #2C1810 0%, #5D4E37 100%);
                    min-height: 100vh;
                    padding: 20px;
                }
                .container { max-width: 1200px; margin: 0 auto; }
                .header {
                    background: linear-gradient(135deg, #F5E6D3 0%, #BCAAA4 100%);
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    margin-bottom: 30px;
                    text-align: center;
                    border: 3px solid #8D6E63;
                }
                .logo {
                    font-size: 2.5em;
                    font-weight: 700;
                    color: #5D4E37;
                    text-shadow: 2px 2px 4px rgba(255,255,255,0.3);
                }
                .tagline { color: #5D4037; font-size: 1.1em; font-style: italic; margin-top: 10px; }
                .welcome-section {
                    background: #FFF8E7;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    margin-bottom: 25px;
                    border: 2px solid #A1887F;
                }
                .welcome-section h2 { color: #5D4E37; margin-bottom: 15px; }
                .welcome-section p { color: #5D4037; line-height: 1.7; }
                .nav-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                }
                .card {
                    background: linear-gradient(135deg, #FFF8E7 0%, #F5E6D3 100%);
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    transition: transform 0.3s;
                    text-decoration: none;
                    color: inherit;
                    display: block;
                    border: 2px solid #A1887F;
                }
                .card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.3); }
                .card h3 { color: #5D4E37; margin-bottom: 12px; font-size: 1.4em; }
                .card p { color: #5D4037; line-height: 1.6; margin-bottom: 12px; }
                .card-badge {
                    display: inline-block;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 0.75em;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .badge-tutorial { background: #BBDEFB; color: #0D47A1; }
                .badge-easy { background: #C8E6C9; color: #1B5E20; }
                .badge-medium { background: #FFE0B2; color: #E65100; }
                .badge-hard { background: #FFCDD2; color: #B71C1C; }
                .footer { text-align: center; color: #F5E6D3; margin-top: 40px; padding: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">📚 PageTurner Books</div>
                    <div class="tagline">Management Portal • Literary Excellence Since 2015</div>
                </div>

                <div class="welcome-section">
                    <h2>Welcome to BeanScene Management Portal</h2>
                    <p>Manage shop operations, track inventory, review sales data, and configure store settings.</p>
                </div>

                <div class="nav-cards">
                    <a href="/example" class="card">
                        <h3>📚 Getting Started</h3>
                        <p>Learn how to navigate the management system and access reports.</p>
                        <span class="card-badge badge-tutorial">Tutorial</span>
                    </a>

                    <a href="/lab1" class="card">
                        <h3>👥 Staff Dashboard</h3>
                        <p>View staff schedules, performance metrics, and team information.</p>
                        <span class="card-badge badge-easy">Staff</span>
                    </a>

                    <a href="/lab2" class="card">
                        <h3>⚙️ Store Settings</h3>
                        <p>Configure operations, payment systems, and integration settings.</p>
                        <span class="card-badge badge-medium">Settings</span>
                    </a>

                    <a href="/lab3" class="card">
                        <h3>🔐 Manager Portal</h3>
                        <p>Access financial reports, system configuration, and admin controls.</p>
                        <span class="card-badge badge-hard">Admin</span>
                    </a>
                </div>

                <div class="footer">
                    <p>📚 PageTurner Books • 456 Brew Street • (555) 234-5678</p>
                </div>
            </div>
        </body>
        </html>
    `);
});


// Example page - Tutorial
app.get('/example', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Tutorial - PageTurner Books</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #2C1810 0%, #5D4E37 100%);
                    padding: 20px;
                    min-height: 100vh;
                }
                .container { max-width: 900px; margin: 0 auto; }
                .header {
                    background: #FFF8E7;
                    padding: 30px;
                    border-radius: 15px;
                    margin-bottom: 30px;
                    text-align: center;
                    border: 2px solid #A1887F;
                }
                h1 { color: #5D4E37; font-size: 2.2em; margin-bottom: 10px; }
                .section {
                    background: #FFF8E7;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                    border: 2px solid #A1887F;
                }
                .section h2 { color: #5D4E37; margin-bottom: 15px; }
                .section h3 { color: #5D4037; margin: 15px 0 10px; }
                .section p, .section li { color: #5D4037; line-height: 1.7; margin: 8px 0; }
                .tip-box {
                    background: #FFF3E0;
                    border-left: 4px solid #FF9800;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                }
                code {
                    background: #F5E6D3;
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-family: monospace;
                    color: #5D4E37;
                }
                pre {
                    background: #F5E6D3;
                    padding: 15px;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin: 10px 0;
                }
                a { color: #5D4037; font-weight: 600; text-decoration: none; }
                a:hover { text-decoration: underline; }
                .back-link { text-align: center; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎓 BeanScene Management Tutorial</h1>
                    <p style="color: #5D4037;">Learn about the portal and working with the API</p>
                </div>

                <div class="section">
                    <h2>Part 1: Store System Information</h2>
                    <p>Learn how to retrieve information about store systems and equipment.</p>
                    <h3>Try It:</h3>
                    <p>Access the systems endpoint to see store equipment:</p>
                    <pre>curl http://localhost:3002/api/example/systems/100</pre>
                    <p>Try different system IDs (100-103) to explore all equipment.</p>
                    <div class="tip-box">
                        💡 <strong>Learning Goal:</strong> Understand how APIs expose equipment data through simple ID-based endpoints.
                    </div>
                </div>

                <div class="section">
                    <h2>Part 2: Configuration Access</h2>
                    <p>Some systems expose configuration information for management purposes.</p>
                    <h3>Try It:</h3>
                    <p>Check if there's a diagnostic endpoint:</p>
                    <pre>curl http://localhost:3002/api/example/diagnostic</pre>
                    <div class="tip-box">
                        💡 <strong>Learning Goal:</strong> Discover how diagnostic endpoints can reveal system information.
                    </div>
                </div>

                <div class="section">
                    <h2>Part 3: Authentication Systems</h2>
                    <p>Learn about authentication endpoints and how credentials are verified.</p>
                    <h3>Try It:</h3>
                    <p>Test the auth check endpoint:</p>
                    <pre>curl http://localhost:3002/api/example/auth-check</pre>
                    <div class="tip-box">
                        💡 <strong>Learning Goal:</strong> Understand how authentication systems verify access.
                    </div>
                </div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Example API endpoints
app.get('/api/example/systems/:id', (req, res) => {
    const systemId = parseInt(req.params.id);
    const system = storeSystemsExamples.find(s => s.id === systemId);
    
    if (!system) {
        return res.status(404).json({ error: 'System not found', hint: 'Try IDs 100-103' });
    }
    
    if (systemId === 103) {
        return res.json({
            ...system,
            flag: 'FLAG{ST0R3_SYST3M_3NUM3R4T3D}',
            message: 'You found the maintenance system!',
            admin_note: 'System in maintenance mode - full access available'
        });
    }
    
    res.json(system);
});

app.get('/api/example/diagnostic', (req, res) => {
    res.json({
        status: 'operational',
        flag: 'FLAG{D14GN0ST1C_4CC3SS3D}',
        message: 'Diagnostic endpoint accessed successfully!',
        store_health: {
            pos_systems: 'online',
            inventory: 'synced',
            payment_gateway: 'connected'
        }
    });
});

app.get('/api/example/auth-check', (req, res) => {
    res.json({
        authenticated: false,
        flag: 'FLAG{4UTH_SYST3M_CH3CK3D}',
        message: 'Auth check completed!',
        hint: 'Authentication would normally validate credentials here'
    });
});


// Lab 1 - Staff Dashboard
app.get('/lab1', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Staff Dashboard - BeanScene</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #2C1810 0%, #5D4E37 100%);
                    padding: 20px;
                    min-height: 100vh;
                }
                .container { max-width: 900px; margin: 0 auto; }
                .header {
                    background: #FFF8E7;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 25px;
                    text-align: center;
                    border: 2px solid #A1887F;
                }
                h1 { color: #5D4E37; font-size: 2em; margin-bottom: 8px; }
                .section {
                    background: #FFF8E7;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                    border: 2px solid #A1887F;
                }
                .section h2 { color: #5D4E37; margin-bottom: 15px; }
                .section p, .section li { color: #5D4037; line-height: 1.7; margin: 8px 0; }
                .staff-card {
                    background: #FFF8E7;
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 8px;
                    border-left: 4px solid #8D6E63;
                }
                code {
                    background: #F5E6D3;
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-family: monospace;
                }
                .info-box {
                    background: #E3F2FD;
                    border-left: 4px solid #2196F3;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                }
                a { color: #5D4037; font-weight: 600; text-decoration: none; }
                .back-link { text-align: center; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>👥 Staff Dashboard</h1>
                    <p style="color: #5D4037;">View team schedules and information</p>
                </div>

                <div class="section">
                    <h2>Team Overview</h2>
                    <p>Access staff information and shift schedules. Our team keeps BeanScene running smoothly.</p>
                    
                    ${staff.map(s => `
                        <div class="staff-card">
                            <strong>${s.name}</strong> - ${s.role}<br>
                            Email: ${s.email}<br>
                            Shift: ${s.shift}
                        </div>
                    `).join('')}
                </div>

                <div class="section">
                    <h2>📊 System Information</h2>
                    <p>Technical teams can access system diagnostics via our API:</p>
                    <p><code>GET /api/staff/system-info</code></p>
                    <div class="info-box">
                        <strong>For IT Use:</strong> System diagnostics provide operational metrics for troubleshooting.
                    </div>
                </div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 1 API - VULNERABLE debug endpoint
app.get('/api/staff/system-info', (req, res) => {
    // VULNERABLE: Debug info exposed in production
    res.json({
        flag: 'FLAG{D3BUG_1NF0_3XP0S3D}',
        message: 'System information retrieved successfully!',
        vulnerability: 'Debug endpoint exposed - reveals system details',
        system_info: {
            node_version: process.version,
            platform: process.platform,
            uptime_seconds: Math.floor(process.uptime()),
            memory_mb: Math.floor(process.memoryUsage().heapUsed / 1024 / 1024),
            environment: process.env.NODE_ENV || 'production'
        },
        database_host: configData.database.host,
        warning: 'This endpoint should not be accessible in production!'
    });
});


// Lab 2 - Store Settings
app.get('/lab2', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Store Settings - BeanScene</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #2C1810 0%, #5D4E37 100%);
                    padding: 20px;
                    min-height: 100vh;
                }
                .container { max-width: 900px; margin: 0 auto; }
                .header {
                    background: #FFF8E7;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 25px;
                    text-align: center;
                    border: 2px solid #A1887F;
                }
                h1 { color: #5D4E37; font-size: 2em; }
                .section {
                    background: #FFF8E7;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                    border: 2px solid #A1887F;
                }
                .section h2 { color: #5D4E37; margin-bottom: 15px; }
                .section p, .section li { color: #5D4037; line-height: 1.7; margin: 8px 0; }
                code {
                    background: #F5E6D3;
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-family: monospace;
                }
                .warning-box {
                    background: #FFF3E0;
                    border-left: 4px solid #FF9800;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                }
                a { color: #5D4037; font-weight: 600; text-decoration: none; }
                .back-link { text-align: center; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>⚙️ Store Settings</h1>
                    <p style="color: #5D4037;">Configure store operations and integrations</p>
                </div>

                <div class="section">
                    <h2>Configuration Management</h2>
                    <p>Manage store settings, payment integrations, and operational parameters.</p>
                    
                    <div class="warning-box">
                        <strong>⚠️ Manager Access:</strong> Configuration changes require manager approval.
                    </div>
                    
                    <h3>Quick Settings:</h3>
                    <ul>
                        <li>Store hours configuration</li>
                        <li>Payment gateway settings</li>
                        <li>Inventory thresholds</li>
                        <li>Email notification preferences</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>🔧 Technical Configuration</h2>
                    <p>IT staff can access configuration via API:</p>
                    <p><code>GET /api/settings/config</code></p>
                    <p style="margin-top: 10px; font-size: 0.9em;">For technical support and integration setup.</p>
                </div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 2 API - VULNERABLE config exposure
app.get('/api/settings/config', (req, res) => {
    // VULNERABLE: Configuration exposed without authentication
    res.json({
        flag: 'FLAG{C0NF1G_L34K3D}',
        message: 'Configuration data retrieved!',
        vulnerability: 'Configuration endpoint accessible without authentication',
        configuration: configData,
        warning: 'Sensitive credentials exposed - database password, API keys, secrets!'
    });
});

// Lab 3 - Manager Portal
app.get('/lab3', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Manager Portal - BeanScene</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #2C1810 0%, #5D4E37 100%);
                    padding: 20px;
                    min-height: 100vh;
                }
                .container { max-width: 900px; margin: 0 auto; }
                .header {
                    background: #FFF8E7;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 25px;
                    text-align: center;
                    border: 2px solid #A1887F;
                }
                h1 { color: #5D4E37; font-size: 2em; }
                .section {
                    background: #FFF8E7;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                    border: 2px solid #A1887F;
                }
                .section h2 { color: #5D4E37; margin-bottom: 15px; }
                .section p, .section li { color: #5D4037; line-height: 1.7; margin: 8px 0; }
                code {
                    background: #F5E6D3;
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-family: monospace;
                }
                pre {
                    background: #F5E6D3;
                    padding: 15px;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin: 10px 0;
                }
                .restricted {
                    background: #FFEBEE;
                    border-left: 4px solid #D32F2F;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                }
                a { color: #5D4037; font-weight: 600; text-decoration: none; }
                .back-link { text-align: center; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Manager Portal</h1>
                    <p style="color: #5D4037;">Administrative controls and reporting</p>
                </div>

                <div class="restricted">
                    <strong>🔒 Authentication Required</strong><br>
                    This area requires manager credentials. Please contact your store manager for access.
                </div>

                <div class="section">
                    <h2>Manager Features</h2>
                    <p>The manager portal provides access to:</p>
                    <ul>
                        <li>Financial reports and sales analytics</li>
                        <li>Staff management and scheduling</li>
                        <li>Inventory ordering and management</li>
                        <li>System configuration and settings</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>🔑 Access Instructions</h2>
                    <p>Authenticate via the admin API:</p>
                    <pre>curl -X POST http://localhost:3002/api/manager/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin","password":"your_password"}'</pre>
                    <p style="margin-top: 10px; font-size: 0.9em; color: #666;">Manager credentials are provided during onboarding.</p>
                </div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 3 API - VULNERABLE default credentials
app.post('/api/manager/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }
    
    // VULNERABLE: Using default credentials
    if (username === adminCredentials.username && password === adminCredentials.password) {
        return res.json({
            success: true,
            flag: 'FLAG{D3F4ULT_CR3DS_US3D}',
            message: 'Authentication successful with default credentials!',
            vulnerability: 'Default admin credentials never changed',
            credentials_used: { username, password },
            token: 'manager_access_token_' + Date.now(),
            warning: 'Default credentials should always be changed after setup!'
        });
    }
    
    res.status(401).json({
        error: 'Invalid credentials',
        hint: 'Try common default credentials'
    });
});

app.listen(PORT, () => {
    console.log(`\x1b[33m
╔════════════════════════════════════════════╗
║   📚 PageTurner Books Management Portal   ║
║   Server running on port ${PORT}           ║
║                                            ║
║   Access: http://localhost:${PORT}            ║
╚════════════════════════════════════════════╝
\x1b[0m`);
});
