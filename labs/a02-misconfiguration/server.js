const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// BeanScene Coffee data
const coffeeMenu = [
    { id: 1, name: 'Espresso', price: 2.99, category: 'hot', description: 'Bold coffee shot' },
    { id: 2, name: 'Cappuccino', price: 4.49, category: 'hot', description: 'Espresso with steamed milk' },
    { id: 3, name: 'Cold Brew', price: 4.99, category: 'cold', description: 'Smooth cold coffee' },
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
        username: 'coffee_admin',
        password: 'Bean\$cene2024!',
        database: 'beanscene_prod'
    },
    payment_gateway: {
        square_token: 'sq0atp-BeanScene_Live_Token_xyz789',
        merchant_id: 'MLHV6GRVNB4XQ'
    },
    secrets: {
        jwt_secret: 'beanscene_jwt_secret_key',
        session_key: 'coffee-shop-session-2024'
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
            <title>BeanScene Coffee - Management Portal</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #6B4423 0%, #3E2723 100%);
                    min-height: 100vh;
                    padding: 20px;
                }
                .container { max-width: 1200px; margin: 0 auto; }
                .header {
                    background: linear-gradient(135deg, #D7CCC8 0%, #BCAAA4 100%);
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
                    color: #3E2723;
                    text-shadow: 2px 2px 4px rgba(255,255,255,0.3);
                }
                .tagline { color: #5D4037; font-size: 1.1em; font-style: italic; margin-top: 10px; }
                .welcome-section {
                    background: #EFEBE9;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    margin-bottom: 25px;
                    border: 2px solid #A1887F;
                }
                .welcome-section h2 { color: #3E2723; margin-bottom: 15px; }
                .welcome-section p { color: #5D4037; line-height: 1.7; }
                .nav-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                }
                .card {
                    background: linear-gradient(135deg, #EFEBE9 0%, #D7CCC8 100%);
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
                .card h3 { color: #3E2723; margin-bottom: 12px; font-size: 1.4em; }
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
                .footer { text-align: center; color: #D7CCC8; margin-top: 40px; padding: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">☕ BeanScene Coffee</div>
                    <div class="tagline">Management Portal • Brew Excellence Daily</div>
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
                    <p>☕ BeanScene Coffee • 456 Brew Street • (555) 234-5678</p>
                </div>
            </div>
        </body>
        </html>
    `);
});


// Example page - Interactive Tutorial
app.get('/example', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Getting Started - BeanScene Coffee</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #6B4423 0%, #3E2723 100%);
                    padding: 20px;
                    min-height: 100vh;
                    line-height: 1.6;
                }
                .container { max-width: 1000px; margin: 0 auto; }
                .header {
                    background: #EFEBE9;
                    padding: 30px;
                    border-radius: 15px;
                    margin-bottom: 30px;
                    text-align: center;
                    border: 2px solid #A1887F;
                }
                h1 { color: #3E2723; font-size: 2.5em; margin-bottom: 10px; }
                .subtitle { color: #5D4037; font-size: 1.1em; }
                .tutorial-section {
                    background: #EFEBE9;
                    padding: 30px;
                    border-radius: 15px;
                    margin-bottom: 25px;
                    border: 2px solid #A1887F;
                }
                .tutorial-section h2 {
                    color: #3E2723;
                    margin-bottom: 15px;
                    font-size: 1.8em;
                }
                .tutorial-section p { color: #5D4037; margin-bottom: 15px; line-height: 1.7; }
                .tutorial-box {
                    background: #E8F5E9;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 15px 0;
                    border-left: 3px solid #4CAF50;
                }
                .interactive-demo {
                    background: #FFF3E0;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 15px 0;
                    border-left: 3px solid #FF9800;
                }
                .demo-controls { margin: 15px 0; }
                .demo-input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #8D6E63;
                    border-radius: 8px;
                    font-size: 1em;
                    margin: 10px 0;
                }
                .demo-button {
                    background: linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%);
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 1em;
                    margin: 5px;
                }
                .demo-button:hover {
                    background: linear-gradient(135deg, #6D4C41 0%, #5D4037 100%);
                }
                .demo-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .output-box {
                    background: #f5f5f5;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                    font-family: 'Courier New', monospace;
                    font-size: 0.9em;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    max-height: 300px;
                    overflow-y: auto;
                    border: 1px solid #ddd;
                }
                .flag-reveal {
                    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 15px 0;
                    text-align: center;
                    font-weight: bold;
                    font-size: 1.2em;
                    display: none;
                }
                .hint-box {
                    background: #E3F2FD;
                    border-left: 4px solid #2196F3;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                }
                code {
                    background: #D7CCC8;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                    color: #c62828;
                }
                .back-link { text-align: center; margin-top: 30px; }
                .back-link a { color: #5D4037; text-decoration: none; font-weight: 600; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📚 Getting Started Guide</h1>
                    <p class="subtitle">Learn to explore the BeanScene management system with interactive examples</p>
                </div>

                <!-- Part 1: System Enumeration -->
                <div class="tutorial-section">
                    <h2>Part 1: System Discovery 🔍</h2>
                    <p>BeanScene uses multiple systems for operations. Learn how to enumerate systems by ID to discover all available resources.</p>
                    
                    <div class="tutorial-box">
                        <h3>🎯 Your Mission</h3>
                        <p>The system directory allows you to search by ID. Try different IDs to discover all systems, including a hidden maintenance system at ID 103!</p>
                    </div>

                    <div class="interactive-demo">
                        <h3>Interactive Demo</h3>
                        <p>Enter a system ID to view its information. Open DevTools (F12) to watch the network requests!</p>
                        <div class="demo-controls">
                            <input type="number" id="part1-id" class="demo-input" placeholder="Enter system ID (try 100-105)" value="100">
                            <button onclick="part1Search()" class="demo-button">🔍 Search System</button>
                        </div>
                        <div id="part1-output" class="output-box"></div>
                        <div id="part1-flag" class="flag-reveal"></div>
                    </div>

                    <div class="hint-box">
                        <strong>💡 Tip:</strong> Press F12 to open DevTools, go to the Network tab, and watch what happens when you search!
                    </div>
                </div>

                <!-- Part 2: Diagnostic Endpoint -->
                <div class="tutorial-section">
                    <h2>Part 2: Diagnostic Access 💻</h2>
                    <p>Many applications expose diagnostic endpoints for troubleshooting. These can reveal sensitive system information.</p>
                    
                    <div class="tutorial-box">
                        <h3>🎯 Your Mission</h3>
                        <p>Access the diagnostic endpoint to retrieve system health information and discover what data is exposed.</p>
                    </div>

                    <div class="interactive-demo">
                        <h3>Try it yourself</h3>
                        <p>Click to access the diagnostic endpoint:</p>
                        <button onclick="part2Test()" class="demo-button">🌐 Access Diagnostics</button>
                        <div id="part2-output" class="output-box" style="display:none;"></div>
                        <div id="part2-flag" class="flag-reveal"></div>
                    </div>

                    <div class="hint-box">
                        <strong>💡 Tip:</strong> Diagnostic endpoints should never be exposed in production systems!
                    </div>
                </div>

                <!-- Part 3: Auth Check -->
                <div class="tutorial-section">
                    <h2>Part 3: Authentication Check 🔐</h2>
                    <p>Learn how authentication systems can be probed to understand their configuration and security posture.</p>
                    
                    <div class="tutorial-box">
                        <h3>🎯 Your Mission</h3>
                        <p>Check the authentication system endpoint to see what information it reveals about the auth configuration.</p>
                    </div>

                    <div class="interactive-demo">
                        <h3>Interactive Demo</h3>
                        <p>Click to check the authentication system:</p>
                        <button onclick="part3Test()" class="demo-button">🔓 Check Auth System</button>
                        <div id="part3-output" class="output-box"></div>
                        <div id="part3-flag" class="flag-reveal"></div>
                    </div>

                    <div class="hint-box">
                        <strong>💡 Tip:</strong> Open DevTools Network tab to see the endpoint URL and response data!
                    </div>
                </div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>

            <script>
                // Part 1: System Enumeration
                async function part1Search() {
                    const id = document.getElementById('part1-id').value;
                    const output = document.getElementById('part1-output');
                    const flagDiv = document.getElementById('part1-flag');
                    
                    output.textContent = 'Loading...';
                    flagDiv.style.display = 'none';
                    
                    try {
                        const response = await fetch('/api/example/systems/' + id);
                        const data = await response.json();
                        output.textContent = JSON.stringify(data, null, 2);
                        
                        if (data.flag) {
                            flagDiv.textContent = '🎉 ' + data.flag + ' - ' + data.message;
                            flagDiv.style.display = 'block';
                        }
                    } catch (error) {
                        output.textContent = 'Error: ' + error.message;
                    }
                }

                // Part 2: Diagnostic Endpoint
                async function part2Test() {
                    const output = document.getElementById('part2-output');
                    const flagDiv = document.getElementById('part2-flag');
                    
                    output.style.display = 'block';
                    output.textContent = 'Loading...';
                    flagDiv.style.display = 'none';
                    
                    try {
                        const response = await fetch('/api/example/diagnostic');
                        const data = await response.json();
                        output.textContent = JSON.stringify(data, null, 2);
                        
                        if (data.flag) {
                            flagDiv.textContent = '🎉 ' + data.flag + ' - ' + data.message;
                            flagDiv.style.display = 'block';
                        }
                    } catch (error) {
                        output.textContent = 'Error: ' + error.message;
                    }
                }

                // Part 3: Auth Check
                async function part3Test() {
                    const output = document.getElementById('part3-output');
                    const flagDiv = document.getElementById('part3-flag');
                    
                    output.textContent = 'Loading...';
                    flagDiv.style.display = 'none';
                    
                    try {
                        const response = await fetch('/api/example/auth-check');
                        const data = await response.json();
                        output.textContent = JSON.stringify(data, null, 2);
                        
                        if (data.flag) {
                            flagDiv.textContent = '🎉 ' + data.flag + ' - ' + data.message;
                            flagDiv.style.display = 'block';
                        }
                    } catch (error) {
                        output.textContent = 'Error: ' + error.message;
                    }
                }
            </script>
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
                    background: linear-gradient(135deg, #6B4423 0%, #3E2723 100%);
                    padding: 20px;
                    min-height: 100vh;
                    line-height: 1.6;
                }
                .container { max-width: 900px; margin: 0 auto; }
                .header {
                    background: #EFEBE9;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 25px;
                    text-align: center;
                    border: 2px solid #A1887F;
                }
                h1 { color: #3E2723; font-size: 2em; margin-bottom: 8px; }
                .subtitle { color: #5D4037; font-size: 1.1em; }
                .section {
                    background: #EFEBE9;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                    border: 2px solid #A1887F;
                }
                .section h2 { color: #3E2723; margin-bottom: 15px; }
                .section p { color: #5D4037; line-height: 1.7; margin: 8px 0; }
                .staff-card {
                    background: #FFF8E7;
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 8px;
                    border-left: 4px solid #8D6E63;
                }
                .search-box {
                    background: #E8F5E9;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    border-left: 3px solid #4CAF50;
                }
                .demo-button {
                    background: linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%);
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 1em;
                    margin-top: 10px;
                    width: 100%;
                }
                .demo-button:hover {
                    background: linear-gradient(135deg, #6D4C41 0%, #5D4037 100%);
                }
                .output-box {
                    background: #f5f5f5;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                    font-family: 'Courier New', monospace;
                    font-size: 0.9em;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    max-height: 400px;
                    overflow-y: auto;
                    border: 1px solid #ddd;
                }
                .flag-reveal {
                    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 15px 0;
                    text-align: center;
                    font-weight: bold;
                    font-size: 1.2em;
                }
                .tip-box {
                    background: #FFF3E0;
                    border-left: 4px solid #FF9800;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 5px;
                }
                code {
                    background: #D7CCC8;
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-family: monospace;
                    color: #c62828;
                }
                .back-link { text-align: center; margin-top: 30px; }
                .back-link a { color: #5D4037; text-decoration: none; font-weight: 600; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>👥 Staff Dashboard</h1>
                    <p class="subtitle">View team schedules and system information</p>
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
                    <h2>🔍 System Information</h2>
                    <p>Access system diagnostics and configuration details for troubleshooting.</p>
                    
                    <div class="search-box">
                        <strong>🛠️ Check System Info</strong>
                        <p style="margin-top: 10px; font-size: 0.95em; color: #555;">
                            View system diagnostics and health status. Use DevTools (F12 → Network tab) to see the API calls!
                        </p>
                        <button onclick="loadSystemInfo()" class="demo-button">Load System Information</button>
                    </div>

                    <div class="tip-box">
                        <strong>💡 Challenge Tip:</strong> Debug endpoints can expose sensitive system information. What data can you discover? Look at the network request in DevTools to see the endpoint URL.
                    </div>
                </div>

                <div id="resultsContainer"></div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>
            
            <script>
                async function loadSystemInfo() {
                    const resultsContainer = document.getElementById('resultsContainer');
                    
                    resultsContainer.innerHTML = '<div class="section"><p>🔍 Loading system information...</p></div>';
                    
                    try {
                        const response = await fetch('/api/staff/system-info');
                        const data = await response.json();
                        
                        let html = '<div class="section"><h2>System Diagnostics</h2>';
                        
                        if (data.flag) {
                            html += '<div class="flag-reveal">🎉 ' + data.flag + '<br><br>' + data.message + '</div>';
                        }
                        
                        html += '<div class="output-box">' + JSON.stringify(data, null, 2) + '</div>';
                        
                        if (data.vulnerability) {
                            html += '<div class="tip-box">';
                            html += '<strong>⚠️ Security Issue:</strong> ' + data.vulnerability + '<br>';
                            html += data.warning || '';
                            html += '</div>';
                        }
                        
                        html += '</div>';
                        resultsContainer.innerHTML = html;
                        
                    } catch (error) {
                        resultsContainer.innerHTML = '<div class="section"><p style="color: #d32f2f;">❌ Error: ' + error.message + '</p></div>';
                    }
                }
            </script>
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
                    background: linear-gradient(135deg, #6B4423 0%, #3E2723 100%);
                    padding: 20px;
                    min-height: 100vh;
                    line-height: 1.6;
                }
                .container { max-width: 900px; margin: 0 auto; }
                .header {
                    background: #EFEBE9;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 25px;
                    text-align: center;
                    border: 2px solid #A1887F;
                }
                h1 { color: #3E2723; font-size: 2em; }
                .subtitle { color: #5D4037; font-size: 1.1em; }
                .section {
                    background: #EFEBE9;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                    border: 2px solid #A1887F;
                }
                .section h2 { color: #3E2723; margin-bottom: 15px; }
                .section p { color: #5D4037; line-height: 1.7; margin: 8px 0; }
                .search-box {
                    background: #E8F5E9;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    border-left: 3px solid #4CAF50;
                }
                .demo-input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #8D6E63;
                    border-radius: 8px;
                    font-size: 1em;
                    margin: 10px 0;
                }
                .demo-button {
                    background: linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%);
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 1em;
                    margin: 5px;
                    width: 100%;
                }
                .demo-button:hover {
                    background: linear-gradient(135deg, #6D4C41 0%, #5D4037 100%);
                }
                .output-box {
                    background: #f5f5f5;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                    font-family: 'Courier New', monospace;
                    font-size: 0.9em;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    max-height: 400px;
                    overflow-y: auto;
                    border: 1px solid #ddd;
                }
                .flag-reveal {
                    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 15px 0;
                    text-align: center;
                    font-weight: bold;
                    font-size: 1.2em;
                }
                .tip-box {
                    background: #FFF3E0;
                    border-left: 4px solid #FF9800;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 5px;
                }
                .warning-box {
                    background: #FFEBEE;
                    border-left: 4px solid #D32F2F;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                }
                code {
                    background: #D7CCC8;
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-family: monospace;
                    color: #c62828;
                }
                .back-link { text-align: center; margin-top: 30px; }
                .back-link a { color: #5D4037; text-decoration: none; font-weight: 600; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>⚙️ Store Settings</h1>
                    <p class="subtitle">Configure store operations and integrations</p>
                </div>

                <div class="section">
                    <h2>Configuration Management</h2>
                    <p>Manage store settings, payment integrations, and operational parameters.</p>
                    
                    <div class="warning-box">
                        <strong>⚠️ Manager Access:</strong> Configuration changes require manager approval.
                    </div>
                    
                    <h3 style="margin-top: 20px; color: #3E2723;">Quick Settings:</h3>
                    <ul style="color: #5D4037; line-height: 1.7; margin-left: 20px; margin-top: 10px;">
                        <li>Store hours configuration</li>
                        <li>Payment gateway settings</li>
                        <li>Inventory thresholds</li>
                        <li>Email notification preferences</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>🔍 Configuration Files</h2>
                    <p>Access configuration and environment files for troubleshooting and setup.</p>
                    
                    <div class="search-box">
                        <strong>📄 Check Configuration Files</strong>
                        <p style="margin-top: 10px; font-size: 0.95em; color: #555;">
                            Enter a file path to view its contents. Try common configuration files like <code>.env</code> or <code>.env.backup</code>
                        </p>
                        <input type="text" id="filePath" class="demo-input" placeholder="e.g., .env or .env.backup" value=".env">
                        <button onclick="loadConfigFile()" class="demo-button">Load Configuration File</button>
                    </div>

                    <div class="tip-box">
                        <strong>💡 Challenge Tip:</strong> Configuration files often contain sensitive data. What happens if they're exposed via web access? Environment files like <code>.env</code> should never be web-accessible!
                    </div>
                </div>

                <div id="resultsContainer"></div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>
            
            <script>
                async function loadConfigFile() {
                    const filePath = document.getElementById('filePath').value.trim();
                    const resultsContainer = document.getElementById('resultsContainer');
                    
                    if (!filePath) {
                        resultsContainer.innerHTML = '<div class="section"><p style="color: #d32f2f;">Please enter a file path</p></div>';
                        return;
                    }
                    
                    resultsContainer.innerHTML = '<div class="section"><p>🔍 Loading configuration file...</p></div>';
                    
                    try {
                        const response = await fetch('/' + filePath);
                        const text = await response.text();
                        
                        let html = '<div class="section"><h2>Configuration File: ' + filePath + '</h2>';
                        
                        // Check if flag is in content
                        if (text.includes('FLAG{')) {
                            const flagMatch = text.match(/FLAG\\{[^}]+\\}/);
                            if (flagMatch) {
                                html += '<div class="flag-reveal">🎉 ' + flagMatch[0] + '<br><br>Configuration file exposed!</div>';
                            }
                        }
                        
                        html += '<div class="output-box">' + text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
                        
                        html += '<div class="warning-box">';
                        html += '<strong>⚠️ Security Issue:</strong> This file is web-accessible! Configuration files containing secrets, passwords, and API keys should never be accessible via HTTP.<br><br>';
                        html += '<strong>Impact:</strong> Attackers can steal database credentials, API keys, and other sensitive information.';
                        html += '</div>';
                        
                        html += '</div>';
                        resultsContainer.innerHTML = html;
                        
                    } catch (error) {
                        resultsContainer.innerHTML = '<div class="section"><p style="color: #d32f2f;">❌ Error loading file: ' + error.message + '</p></div>';
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// Lab 2 API - VULNERABLE: .env file exposed through misconfiguration
app.get('/.env', (req, res) => {
    // VULNERABLE: .env file accessible due to misconfigured static file serving
    const envContent = `# BeanScene Coffee - Environment Configuration
# WARNING: This file should NEVER be accessible via web!

NODE_ENV=production
PORT=3002

# Database Configuration
DB_HOST=db.beanscene.local
DB_USER=coffee_admin
DB_PASSWORD=Bean$cene2024!
DB_NAME=beanscene_prod

# API Keys & Secrets
JWT_SECRET=beanscene_jwt_secret_key_12345
SESSION_SECRET=coffee-shop-session-2024
SQUARE_API_KEY=sq0atp-BeanScene_Live_Token_xyz789
SQUARE_MERCHANT_ID=MLHV6GRVNB4XQ

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_USER=notifications@beanscene.com
SMTP_PASS=BeanMail!2024

# Feature Flags
DEBUG_MODE=true
ENABLE_LOGGING=true
SHOW_ERRORS=true

FLAG{3NV_F1L3_3XP0S3D}
`;
    res.type('text/plain').send(envContent);
});

// Also expose .env.backup
app.get('/.env.backup', (req, res) => {
    const envBackup = `# Backup from 2024-01-15
DB_PASSWORD=OldBean$2023!
JWT_SECRET=old_jwt_secret_2023
FLAG{B4CKUP_F1L3_L34K3D}
`;
    res.type('text/plain').send(envBackup);
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
                    background: linear-gradient(135deg, #6B4423 0%, #3E2723 100%);
                    padding: 20px;
                    min-height: 100vh;
                    line-height: 1.6;
                }
                .container { max-width: 900px; margin: 0 auto; }
                .header {
                    background: #EFEBE9;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 25px;
                    text-align: center;
                    border: 2px solid #A1887F;
                }
                h1 { color: #3E2723; font-size: 2em; }
                .subtitle { color: #5D4037; font-size: 1.1em; }
                .section {
                    background: #EFEBE9;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                    border: 2px solid #A1887F;
                }
                .section h2 { color: #3E2723; margin-bottom: 15px; }
                .section p { color: #5D4037; line-height: 1.7; margin: 8px 0; }
                .search-box {
                    background: #E8F5E9;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    border-left: 3px solid #4CAF50;
                }
                .demo-input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #8D6E63;
                    border-radius: 8px;
                    font-size: 1em;
                    margin: 10px 0;
                }
                .demo-button {
                    background: linear-gradient(135deg, #8D6E63 0%, #6D4C41 100%);
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 1em;
                    margin: 5px;
                }
                .demo-button:hover {
                    background: linear-gradient(135deg, #6D4C41 0%, #5D4037 100%);
                }
                .output-box {
                    background: #f5f5f5;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                    font-family: 'Courier New', monospace;
                    font-size: 0.9em;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    max-height: 400px;
                    overflow-y: auto;
                    border: 1px solid #ddd;
                }
                .flag-reveal {
                    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 15px 0;
                    text-align: center;
                    font-weight: bold;
                    font-size: 1.2em;
                }
                .tip-box {
                    background: #FFF3E0;
                    border-left: 4px solid #FF9800;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 5px;
                }
                .restricted {
                    background: #FFEBEE;
                    border-left: 4px solid #D32F2F;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                }
                .dir-listing {
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    margin: 15px 0;
                    overflow: hidden;
                }
                .dir-item {
                    padding: 12px;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .dir-item:hover {
                    background: #f5f5f5;
                }
                .dir-item:last-child {
                    border-bottom: none;
                }
                code {
                    background: #D7CCC8;
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-family: monospace;
                    color: #c62828;
                }
                .back-link { text-align: center; margin-top: 30px; }
                .back-link a { color: #5D4037; text-decoration: none; font-weight: 600; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔐 Manager Portal</h1>
                    <p class="subtitle">Administrative controls and reporting</p>
                </div>

                <div class="restricted">
                    <strong>🔒 Authentication Required</strong><br>
                    This area requires manager credentials. Administrative files may be accessible via direct URL access.
                </div>

                <div class="section">
                    <h2>Manager Features</h2>
                    <p>The manager portal provides access to:</p>
                    <ul style="color: #5D4037; line-height: 1.7; margin-left: 20px; margin-top: 10px;">
                        <li>Financial reports and sales analytics</li>
                        <li>Staff management and scheduling</li>
                        <li>Inventory ordering and management</li>
                        <li>System configuration and settings</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>🗂️ Administrative Files</h2>
                    <p>Administrative configuration files and directories are stored on the server.</p>
                    
                    <div class="search-box">
                        <strong>📂 Browse Admin Directory</strong>
                        <p style="margin-top: 10px; font-size: 0.95em; color: #555;">
                            Check for administrative files and directories. Try paths like <code>/admin</code> or <code>/admin/credentials.txt</code>
                        </p>
                        <input type="text" id="adminPath" class="demo-input" placeholder="e.g., /admin or /admin/credentials.txt" value="/admin">
                        <button onclick="loadAdminPath()" class="demo-button">Browse Path</button>
                    </div>

                    <div class="tip-box">
                        <strong>💡 Challenge Tip:</strong> Directory listing exposes file structures. Configuration files and credentials should never be web-accessible! Look for sensitive files like <code>config.json</code> or <code>credentials.txt</code>.
                    </div>
                </div>

                <div id="resultsContainer"></div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>
            
            <script>
                async function loadAdminPath() {
                    const adminPath = document.getElementById('adminPath').value.trim();
                    const resultsContainer = document.getElementById('resultsContainer');
                    
                    if (!adminPath) {
                        resultsContainer.innerHTML = '<div class="section"><p style="color: #d32f2f;">Please enter a path</p></div>';
                        return;
                    }
                    
                    resultsContainer.innerHTML = '<div class="section"><p>🔍 Loading path...</p></div>';
                    
                    try {
                        const response = await fetch(adminPath);
                        const contentType = response.headers.get('content-type');
                        
                        let html = '<div class="section"><h2>Path: ' + adminPath + '</h2>';
                        
                        if (contentType && contentType.includes('application/json')) {
                            const data = await response.json();
                            html += '<div class="output-box">' + JSON.stringify(data, null, 2) + '</div>';
                        } else {
                            const text = await response.text();
                            
                            // Check if flag is in content
                            if (text.includes('FLAG{')) {
                                const flagMatch = text.match(/FLAG\\{[^}]+\\}/);
                                if (flagMatch) {
                                    html += '<div class="flag-reveal">🎉 ' + flagMatch[0] + '<br><br>Directory listing vulnerability exploited!</div>';
                                }
                            }
                            
                            // If it looks like HTML directory listing, render it
                            if (text.includes('<table>') && text.includes('<tr>')) {
                                const tableMatch = text.match(/<table>.*<\\/table>/s);
                                if (tableMatch && tableMatch[0]) {
                                    html += '<div class="dir-listing">' + tableMatch[0] + '</div>';
                                }
                            } else {
                                html += '<div class="output-box">' + text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
                            }
                        }
                        
                        html += '<div class="tip-box">';
                        html += '<strong>⚠️ Security Issue:</strong> Directory listing is enabled! This allows attackers to browse server directories and discover sensitive files.<br><br>';
                        html += '<strong>Impact:</strong> Credentials, configuration files, backups, and other sensitive data can be accessed.';
                        html += '</div>';
                        
                        html += '</div>';
                        resultsContainer.innerHTML = html;
                        
                    } catch (error) {
                        resultsContainer.innerHTML = '<div class="section"><p style="color: #d32f2f;">❌ Error loading path: ' + error.message + '</p></div>';
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// Lab 3 API - VULNERABLE: Directory listing enabled
app.get('/admin', (req, res) => {
    // VULNERABLE: Directory listing shows all admin files
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Index of /admin</title>
            <style>
                body { font-family: monospace; background: #f5f5f5; padding: 20px; }
                h1 { color: #333; }
                table { border-collapse: collapse; width: 100%; background: white; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background: #333; color: white; }
                a { color: #0066cc; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <h1>Index of /admin</h1>
            <table>
                <tr><th>Name</th><th>Last Modified</th><th>Size</th></tr>
                <tr><td><a href="/admin/">..</a></td><td>-</td><td>-</td></tr>
                <tr><td><a href="/admin/config.json">config.json</a></td><td>2024-12-15 14:30</td><td>2.1 KB</td></tr>
                <tr><td><a href="/admin/backup/">backup/</a></td><td>2024-12-10 09:15</td><td>-</td></tr>
                <tr><td><a href="/admin/logs/">logs/</a></td><td>2025-01-19 10:00</td><td>-</td></tr>
                <tr><td><a href="/admin/credentials.txt">credentials.txt</a></td><td>2024-11-20 16:45</td><td>156 bytes</td></tr>
            </table>
        </body>
        </html>
    `);
});

app.get('/admin/config.json', (req, res) => {
    res.json({
        application: "BeanScene Manager Portal",
        version: "1.2.3",
        database: {
            host: "db.beanscene.local",
            port: 5432,
            name: "beanscene_prod"
        },
        features: {
            debug: true,
            errorReporting: "full"
        }
    });
});

app.get('/admin/credentials.txt', (req, res) => {
    // VULNERABLE: Credentials file accessible
    const credentials = `BeanScene Admin Credentials
=================================
Username: manager
Password: Coffee2024!
API Key: BSC-2024-ADMIN-xyz789

FLAG{D1R3CT0RY_L1ST1NG_3N4BL3D}

WARNING: This file should not be web-accessible!
`;
    res.type('text/plain').send(credentials);
});

app.listen(PORT, () => {
    console.log(`\x1b[33m
╔════════════════════════════════════════════╗
║   ☕ BeanScene Coffee Management Portal   ║
║   Server running on port ${PORT}           ║
║                                            ║
║   Access: http://localhost:${PORT}            ║
╚════════════════════════════════════════════╝
\x1b[0m`);
});
