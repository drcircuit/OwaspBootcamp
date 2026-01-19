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


// Example page - Help & Info
app.get('/example', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Help Center - PageTurner Books</title>
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
                .section p, .section li { color: #5D4037; line-height: 1.7; margin: 8px 0; }
                .info-box {
                    background: #FFF3E0;
                    border-left: 4px solid #FF9800;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                }
                a { color: #5D4037; font-weight: 600; text-decoration: none; }
                a:hover { text-decoration: underline; }
                .back-link { text-align: center; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📚 PageTurner Help Center</h1>
                    <p style="color: #5D4037;">Your guide to the management portal</p>
                </div>

                <div class="section">
                    <h2>About the Portal</h2>
                    <p>The PageTurner Books Management Portal provides comprehensive tools for managing bookstore operations. Access staff information, review system settings, and monitor store performance from one central location.</p>
                    
                    <div class="info-box">
                        <strong>Getting Started:</strong> Use the navigation cards on the home page to access different areas of the portal. Each section provides specific management capabilities for different aspects of the business.
                    </div>
                </div>

                <div class="section">
                    <h2>Portal Features</h2>
                    <ul>
                        <li><strong>Staff Dashboard:</strong> View team schedules, shift assignments, and contact information</li>
                        <li><strong>Store Settings:</strong> Configure operational parameters and integration settings</li>
                        <li><strong>Manager Portal:</strong> Access administrative controls and financial reports</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>Need Help?</h2>
                    <p>For technical support or questions about the management portal, contact the IT help desk or your store manager.</p>
                    <p><strong>Email:</strong> support@pageturner.com</p>
                    <p><strong>Phone:</strong> (555) 234-5678</p>
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
                    <h2>📊 Team Resources</h2>
                    <p>Access training materials, shift swap requests, and team announcements through the portal.</p>
                </div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 1 API - VULNERABLE: Package version disclosure
app.get('/api/staff/dependencies', (req, res) => {
    // VULNERABLE: Exposes dependency versions - aids reconnaissance
    res.json({
        flag: 'FLAG{V3RS10N_D1SCL0SUR3_D3P3ND3NC13S}',
        message: 'Dependency information retrieved successfully!',
        vulnerability: 'Exposes package versions - attackers can identify vulnerable dependencies',
        dependencies: {
            "express": "4.16.4",  // Known vulnerabilities
            "lodash": "4.17.11",  // CVE-2019-10744
            "request": "2.88.0",  // Deprecated package
            "moment": "2.24.0",   // Known issues
            "jsonwebtoken": "8.3.0",  // CVE-2022-23529
            "mongoose": "5.7.5"   // Several CVEs
        },
        npm_version: "6.4.1",
        node_version: process.version,
        warning: 'Multiple outdated packages with known vulnerabilities detected!',
        hint: 'Check CVE databases for these specific versions'
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
                    <h2>🔧 Settings Overview</h2>
                    <p>Store configuration settings are managed through the administrative interface. Contact your manager for assistance with any configuration changes.</p>
                </div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 2 API - VULNERABLE: package.json exposed
app.get('/package.json', (req, res) => {
    // VULNERABLE: package.json accessible reveals exact dependency versions
    const packageJson = {
        "name": "pageturner-bookstore",
        "version": "1.0.0",
        "description": "PageTurner Bookstore Management System",
        "main": "server.js",
        "scripts": {
            "start": "node server.js",
            "dev": "nodemon server.js"
        },
        "dependencies": {
            "express": "4.16.4",
            "body-parser": "1.18.3",
            "lodash": "4.17.11",
            "moment": "2.24.0",
            "jsonwebtoken": "8.3.0",
            "bcrypt": "3.0.6",
            "mongoose": "5.7.5",
            "request": "2.88.0",
            "xml2js": "0.4.19",
            "handlebars": "4.1.2"
        },
        "devDependencies": {
            "nodemon": "1.19.1"
        },
        "flag": "FLAG{P4CK4G3_J50N_3XP0S3D}",
        "note": "This file should not be web-accessible in production!"
    };
    res.json(packageJson);
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
                    <h2>🔑 Administrative Access</h2>
                    <p>Manager portal access is restricted to authorized personnel. Contact the store owner for access credentials if you are a manager.</p>
                    <p style="margin-top: 15px;">Authorized managers have access to financial reports, staff management, inventory ordering, and system configuration tools.</p>
                </div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 3 API - VULNERABLE: Path traversal via vulnerable dependency
// Simulating a vulnerability in a file upload/download library
app.get('/api/files/download', (req, res) => {
    const filename = req.query.file;
    
    if (!filename) {
        return res.status(400).json({ error: 'File parameter required' });
    }
    
    // VULNERABLE: No path sanitization - allows directory traversal
    // This simulates CVE-2017-16119 (fresh package) or similar
    if (filename.includes('../')) {
        // Path traversal detected
        return res.json({
            success: true,
            flag: 'FLAG{P4TH_TR4V3RS4L_VULN_D3P}',
            vulnerability: 'Path traversal via vulnerable dependency',
            message: 'File download processed with directory traversal',
            warning: 'Vulnerable package allows accessing files outside intended directory!',
            example_payloads: [
                '../../../etc/passwd',
                '..\\..\\..\\windows\\system32\\config\\sam',
                '../.env',
                '../package.json'
            ],
            cve_reference: 'Similar to CVE-2017-16119 (fresh), CVE-2020-28460 (path-parse)',
            vulnerable_package: 'file-handler@1.2.3',
            fix: 'Update to file-handler@2.0.0 or use path.resolve() to prevent traversal'
        });
    }
    
    // Simulate normal file download
    res.json({
        success: true,
        file: filename,
        content: 'Sample file content...',
        hint: 'Try using ../ in the filename parameter'
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
