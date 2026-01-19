const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// PageTurner Books data
const books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 12.99, genre: 'Classic', stock: 24 },
    { id: 2, title: '1984', author: 'George Orwell', price: 14.99, genre: 'Dystopian', stock: 18 },
    { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 13.99, genre: 'Classic', stock: 15 },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', price: 11.99, genre: 'Romance', stock: 22 }
];

const staff = [
    { id: 1, name: 'Sarah Mitchell', role: 'manager', email: 'sarah@pageturner.local', shift: 'morning' },
    { id: 2, name: 'David Chen', role: 'cashier', email: 'david@pageturner.local', shift: 'afternoon' },
    { id: 3, name: 'Maria Garcia', role: 'stock clerk', email: 'maria@pageturner.local', shift: 'evening' }
];

// VULNERABLE configuration data
const configData = {
    database: {
        host: 'db.pageturner.local',
        username: 'books_admin',
        password: 'PageTurn3r2024!',
        database: 'pageturner_prod'
    },
    payment_gateway: {
        stripe_token: 'sk_live_PageTurner_xyz789',
        merchant_id: 'acct_PTB12345'
    },
    secrets: {
        jwt_secret: 'pageturner_jwt_secret_key_2024',
        session_key: 'bookstore-session-2024'
    }
};

// Example store systems
const storeSystemsExamples = [
    { id: 100, system: 'POS System', status: 'online', version: '2.4.1', ip: '192.168.1.10' },
    { id: 101, system: 'Inventory Management', status: 'online', version: '2.4.1', ip: '192.168.1.11' },
    { id: 102, system: 'E-commerce Platform', status: 'online', version: '1.8.3', ip: '192.168.1.20' },
    { id: 103, system: 'Maintenance Dashboard', status: 'maintenance', version: '3.1.0', ip: '192.168.1.30', flag: 'FLAG{ST0R3_SYST3M_3NUM3R4T3D}' }
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
                    <h2>Welcome to PageTurner Books Management Portal</h2>
                    <p>Manage bookstore operations, track inventory, review sales data, and configure store settings.</p>
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
                    <p>📚 PageTurner Books • 789 Literary Lane • (555) READ-BOOK</p>
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
            <title>Getting Started - PageTurner Books</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #2C1810 0%, #5D4E37 100%);
                    padding: 20px;
                    min-height: 100vh;
                    line-height: 1.6;
                }
                .container { max-width: 1000px; margin: 0 auto; }
                .header {
                    background: #FFF8E7;
                    padding: 30px;
                    border-radius: 15px;
                    margin-bottom: 30px;
                    text-align: center;
                    border: 2px solid #A1887F;
                }
                h1 { color: #5D4E37; font-size: 2.5em; margin-bottom: 10px; }
                .subtitle { color: #5D4037; font-size: 1.1em; }
                .tutorial-section {
                    background: #FFF8E7;
                    padding: 30px;
                    border-radius: 15px;
                    margin-bottom: 25px;
                    border: 2px solid #A1887F;
                }
                .tutorial-section h2 {
                    color: #5D4E37;
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
                    background: #F5E6D3;
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
                    <p class="subtitle">Learn supply chain security concepts with interactive examples</p>
                </div>

                <!-- Part 1: System Enumeration -->
                <div class="tutorial-section">
                    <h2>Part 1: System Discovery 🔍</h2>
                    <p>PageTurner Books uses multiple backend systems inherited from a template. Learn how to enumerate systems by ID to discover all available resources.</p>
                    
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
                        <strong>💡 Tip:</strong> Press F12 to open DevTools, go to the Network tab, and watch what happens when you search! Supply chain templates often include more systems than needed.
                    </div>
                </div>

                <!-- Part 2: Diagnostic Endpoint -->
                <div class="tutorial-section">
                    <h2>Part 2: Diagnostic Access 💻</h2>
                    <p>Many applications expose diagnostic endpoints left from development templates. These can reveal sensitive system information.</p>
                    
                    <div class="tutorial-box">
                        <h3>🎯 Your Mission</h3>
                        <p>Access the diagnostic endpoint to retrieve system health information and discover what data is exposed from development mode.</p>
                    </div>

                    <div class="interactive-demo">
                        <h3>Try it yourself</h3>
                        <p>Click to access the diagnostic endpoint:</p>
                        <button onclick="part2Test()" class="demo-button">🌐 Access Diagnostics</button>
                        <div id="part2-output" class="output-box" style="display:none;"></div>
                        <div id="part2-flag" class="flag-reveal"></div>
                    </div>

                    <div class="hint-box">
                        <strong>💡 Tip:</strong> Diagnostic endpoints from development templates should never be exposed in production systems!
                    </div>
                </div>

                <!-- Part 3: Auth Check -->
                <div class="tutorial-section">
                    <h2>Part 3: Authentication Check 🔐</h2>
                    <p>Learn how authentication systems copied from templates can be probed to understand their configuration and security posture.</p>
                    
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
                        <strong>💡 Tip:</strong> Open DevTools Network tab to see the endpoint URL and response data! Authentication systems from templates may have weak default configurations.
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
            id: system.id,
            system: system.system,
            status: system.status,
            version: system.version,
            ip: system.ip,
            flag: 'FLAG{ST0R3_SYST3M_3NUM3R4T3D}',
            message: 'You found the maintenance system!',
            admin_note: 'System in maintenance mode - full access available',
            vulnerability: 'Supply chain templates often include unnecessary systems that increase attack surface'
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
            <title>Staff Dashboard - PageTurner Books</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #2C1810 0%, #5D4E37 100%);
                    padding: 20px;
                    min-height: 100vh;
                    line-height: 1.6;
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
                .subtitle { color: #5D4037; font-size: 1.1em; }
                .section {
                    background: #FFF8E7;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                    border: 2px solid #A1887F;
                }
                .section h2 { color: #5D4E37; margin-bottom: 15px; }
                .section p { color: #5D4037; line-height: 1.7; margin: 8px 0; }
                .staff-card {
                    background: #FFF3E0;
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
                    background: #F5E6D3;
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
                    <p class="subtitle">View team schedules and dependency information</p>
                </div>

                <div class="section">
                    <h2>Team Overview</h2>
                    <p>Access staff information and shift schedules. Our team keeps PageTurner Books running smoothly.</p>
                    
                    ${staff.map(s => `
                        <div class="staff-card">
                            <strong>${s.name}</strong> - ${s.role}<br>
                            Email: ${s.email}<br>
                            Shift: ${s.shift}
                        </div>
                    `).join('')}
                </div>

                <div class="section">
                    <h2>🔍 System Dependencies</h2>
                    <p>Access system diagnostics and dependency information for troubleshooting and updates.</p>
                    
                    <div class="search-box">
                        <strong>🛠️ Check Dependency Versions</strong>
                        <p style="margin-top: 10px; font-size: 0.95em; color: #555;">
                            View installed package versions and system information. Use DevTools (F12 → Network tab) to see the API calls!
                        </p>
                        <button onclick="loadDependencies()" class="demo-button">Load Dependency Information</button>
                    </div>

                    <div class="tip-box">
                        <strong>💡 Challenge Tip:</strong> Version disclosure endpoints can expose vulnerable dependencies. What data can you discover? Look at the network request in DevTools to see the endpoint URL and examine the response for specific package versions that might have known CVEs.
                    </div>
                </div>

                <div id="resultsContainer"></div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>
            
            <script>
                async function loadDependencies() {
                    const resultsContainer = document.getElementById('resultsContainer');
                    
                    resultsContainer.innerHTML = '<div class="section"><p>🔍 Loading dependency information...</p></div>';
                    
                    try {
                        const response = await fetch('/api/staff/dependencies');
                        const data = await response.json();
                        
                        let html = '<div class="section"><h2>Dependency Information</h2>';
                        
                        if (data.flag) {
                            html += '<div class="flag-reveal">🎉 ' + data.flag + '<br><br>' + data.message + '</div>';
                        }
                        
                        html += '<div class="output-box">' + JSON.stringify(data, null, 2) + '</div>';
                        
                        if (data.vulnerability) {
                            html += '<div class="tip-box">';
                            html += '<strong>⚠️ Security Issue:</strong> ' + data.vulnerability + '<br><br>';
                            html += '<strong>Warning:</strong> ' + (data.warning || 'Exposing exact package versions helps attackers identify known CVEs to exploit!');
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
            <title>Store Settings - PageTurner Books</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #2C1810 0%, #5D4E37 100%);
                    padding: 20px;
                    min-height: 100vh;
                    line-height: 1.6;
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
                .subtitle { color: #5D4037; font-size: 1.1em; }
                .section {
                    background: #FFF8E7;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                    border: 2px solid #A1887F;
                }
                .section h2 { color: #5D4E37; margin-bottom: 15px; }
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
                    background: #F5E6D3;
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
                    
                    <h3 style="margin-top: 20px; color: #5D4E37;">Quick Settings:</h3>
                    <ul style="color: #5D4037; line-height: 1.7; margin-left: 20px; margin-top: 10px;">
                        <li>Store hours configuration</li>
                        <li>Payment gateway settings</li>
                        <li>Inventory thresholds</li>
                        <li>Email notification preferences</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>🔍 Package Information</h2>
                    <p>Access project package files and dependency information. Common Node.js files like package.json contain metadata about the application.</p>
                    
                    <div class="search-box">
                        <strong>📄 Check Package Files</strong>
                        <p style="margin-top: 10px; font-size: 0.95em; color: #555;">
                            Try accessing the package.json file to see project dependencies. This file is commonly exposed due to misconfigured static file serving.
                        </p>
                        <input type="text" id="packagePath" class="demo-input" placeholder="Enter path (e.g., /package.json)" value="/package.json">
                        <button onclick="loadPackageFile()" class="demo-button">Load Package File</button>
                    </div>

                    <div class="tip-box">
                        <strong>💡 Challenge Tip:</strong> The package.json file reveals the complete dependency tree with exact versions. This allows attackers to map out the entire supply chain and identify multiple CVE exploitation paths. Open DevTools (F12) Network tab to see the request!
                    </div>
                </div>

                <div id="resultsContainer"></div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>
            
            <script>
                async function loadPackageFile() {
                    const packagePath = document.getElementById('packagePath').value.trim();
                    const resultsContainer = document.getElementById('resultsContainer');
                    
                    if (!packagePath) {
                        resultsContainer.innerHTML = '<div class="section"><p style="color: #d32f2f;">Please enter a file path</p></div>';
                        return;
                    }
                    
                    resultsContainer.innerHTML = '<div class="section"><p>🔍 Loading package file...</p></div>';
                    
                    try {
                        const response = await fetch(packagePath);
                        const data = await response.json();
                        
                        let html = '<div class="section"><h2>Package File: ' + packagePath + '</h2>';
                        
                        if (data.flag) {
                            html += '<div class="flag-reveal">🎉 ' + data.flag + '<br><br>Package file exposed!</div>';
                        }
                        
                        html += '<div class="output-box">' + JSON.stringify(data, null, 2) + '</div>';
                        
                        html += '<div class="warning-box">';
                        html += '<strong>⚠️ Security Issue:</strong> The package.json file is web-accessible!<br><br>';
                        html += '<strong>Impact:</strong> Attackers can identify all dependencies and their exact versions, cross-reference them with CVE databases, find deprecated or unmaintained packages, and plan sophisticated supply chain attacks.<br><br>';
                        html += '<strong>Real CVEs found in this stack:</strong><br>';
                        html += '• lodash 4.17.11 - CVE-2019-10744 (Prototype Pollution)<br>';
                        html += '• jsonwebtoken 8.3.0 - CVE-2022-23529 (Key confusion)<br>';
                        html += '• xml2js 0.4.19 - CVE-2023-0842 (Prototype Pollution)<br>';
                        html += '• handlebars 4.1.2 - CVE-2019-19919, CVE-2021-23369<br>';
                        html += '• request 2.88.0 - Deprecated (no security updates)';
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
            <title>Manager Portal - PageTurner Books</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #2C1810 0%, #5D4E37 100%);
                    padding: 20px;
                    min-height: 100vh;
                    line-height: 1.6;
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
                .subtitle { color: #5D4037; font-size: 1.1em; }
                .section {
                    background: #FFF8E7;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                    border: 2px solid #A1887F;
                }
                .section h2 { color: #5D4E37; margin-bottom: 15px; }
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
                code {
                    background: #F5E6D3;
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
                    <p class="subtitle">Administrative controls and file management</p>
                </div>

                <div class="restricted">
                    <strong>🔒 Authentication Required</strong><br>
                    This area requires manager credentials. Administrative files may be accessible via file download endpoints.
                </div>

                <div class="section">
                    <h2>Manager Features</h2>
                    <p>The manager portal provides access to:</p>
                    <ul style="color: #5D4037; line-height: 1.7; margin-left: 20px; margin-top: 10px;">
                        <li>Financial reports and sales analytics</li>
                        <li>Staff management and scheduling</li>
                        <li>Inventory ordering and management</li>
                        <li>System configuration and file downloads</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>📁 File Download System</h2>
                    <p>The file download system uses a library to serve files. Test the file download functionality with different paths.</p>
                    
                    <div class="search-box">
                        <strong>📥 Download Files</strong>
                        <p style="margin-top: 10px; font-size: 0.95em; color: #555;">
                            Enter a filename to download. Try paths like <code>sample.pdf</code> or experiment with directory traversal sequences like <code>../package.json</code> or <code>../.env</code>
                        </p>
                        <input type="text" id="filePath" class="demo-input" placeholder="e.g., sample.pdf or ../package.json" value="sample.pdf">
                        <button onclick="downloadFile()" class="demo-button">Download File</button>
                    </div>

                    <div class="tip-box">
                        <strong>💡 Challenge Tip:</strong> This lab demonstrates a path traversal vulnerability inherited from a vulnerable dependency (like CVE-2017-16119 in the fresh package). Try using <code>../</code> sequences to access files outside the intended directory. Look for sensitive files like .env, package.json, or system files!
                    </div>
                </div>

                <div id="resultsContainer"></div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>
            
            <script>
                async function downloadFile() {
                    const filePath = document.getElementById('filePath').value.trim();
                    const resultsContainer = document.getElementById('resultsContainer');
                    
                    if (!filePath) {
                        resultsContainer.innerHTML = '<div class="section"><p style="color: #d32f2f;">Please enter a filename</p></div>';
                        return;
                    }
                    
                    resultsContainer.innerHTML = '<div class="section"><p>🔍 Downloading file...</p></div>';
                    
                    try {
                        const response = await fetch('/api/files/download?file=' + encodeURIComponent(filePath));
                        const data = await response.json();
                        
                        let html = '<div class="section"><h2>File Download Result</h2>';
                        
                        if (data.flag) {
                            html += '<div class="flag-reveal">🎉 ' + data.flag + '<br><br>' + data.message + '</div>';
                        }
                        
                        html += '<div class="output-box">' + JSON.stringify(data, null, 2) + '</div>';
                        
                        if (data.vulnerability) {
                            html += '<div class="tip-box">';
                            html += '<strong>⚠️ Security Issue:</strong> ' + data.vulnerability + '<br><br>';
                            html += '<strong>Warning:</strong> ' + (data.warning || '') + '<br><br>';
                            html += '<strong>CVE Reference:</strong> ' + (data.cve_reference || 'Similar to CVE-2017-16119, CVE-2020-28460') + '<br><br>';
                            html += '<strong>Vulnerable Package:</strong> ' + (data.vulnerable_package || 'file-handler@1.2.3') + '<br><br>';
                            html += '<strong>Impact:</strong> Access to .env files, configuration files, source code, private keys, database files, and system files.';
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
