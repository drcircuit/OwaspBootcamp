const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Middleware to set default cookies if not present
app.use((req, res, next) => {
    const cookies = req.headers.cookie || '';
    
    // Set default cookies if not present (using regex for precise matching)
    if (!/\buserId=/.test(cookies)) {
        res.cookie('userId', CURRENT_USER_ID, { httpOnly: false });
    }
    if (!/\buserRole=/.test(cookies)) {
        res.cookie('userRole', 'member', { httpOnly: false });
    }
    
    next();
});

// Users database - TechCorp Global HR System
const users = [
    { id: 1, username: 'jchen', email: 'jennifer.chen@techcorp.com', role: 'employee', department: 'Engineering', title: 'Senior Software Engineer', salary: 145000, ssn: '***-**-4521', performanceRating: 4.2, hireDate: '2019-03-15', securityClearance: 'Standard', directReports: 0, stockOptions: 5000 },
    { id: 2, username: 'mrodriguez', email: 'maria.rodriguez@techcorp.com', role: 'employee', department: 'Marketing', title: 'Marketing Coordinator', salary: 68000, ssn: '***-**-7834', performanceRating: 3.8, hireDate: '2023-06-01', securityClearance: 'Standard', directReports: 0, stockOptions: 500 },
    { id: 3, username: 'dthompson', email: 'david.thompson@techcorp.com', role: 'employee', department: 'Sales', title: 'Account Executive', salary: 95000, ssn: '***-**-2193', performanceRating: 4.5, hireDate: '2021-01-20', securityClearance: 'Standard', directReports: 0, stockOptions: 2000, lastReview: 'Exceeds expectations in Q4 2025' },
    { id: 4, username: 'skumar', email: 'sarah.kumar@techcorp.com', role: 'manager', department: 'Human Resources', title: 'HR Director', salary: 165000, ssn: '***-**-8901', performanceRating: 4.8, hireDate: '2017-09-10', securityClearance: 'Elevated', directReports: 12, stockOptions: 15000, accessLevel: 'full', canAccessAllRecords: true, canModifySalaries: true },
    { id: 5, username: 'rceo', email: 'robert.williams@techcorp.com', role: 'executive', department: 'Executive', title: 'Chief Executive Officer', salary: 850000, ssn: '***-**-0001', bonus: 500000, performanceRating: 5.0, hireDate: '2015-01-01', securityClearance: 'Executive', directReports: 8, stockOptions: 250000, boardMember: true, accessLevel: 'unrestricted' }
];

const CURRENT_USER_ID = 2; // Maria Rodriguez is the current logged-in employee

// Home page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>TechCorp Global - Employee Portal</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
                    min-height: 100vh;
                    padding: 20px;
                }
                .header {
                    background: white;
                    padding: 20px 40px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                    margin-bottom: 30px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .logo {
                    font-size: 2em;
                    font-weight: 600;
                    color: #1976d2;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .logo::before {
                    content: '🏢';
                    font-size: 1.2em;
                }
                .user-info {
                    font-size: 0.9em;
                    color: #666;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .welcome-section {
                    background: white;
                    padding: 40px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                    margin-bottom: 30px;
                }
                .welcome-section h1 {
                    color: #1565c0;
                    margin-bottom: 15px;
                    font-size: 2.2em;
                }
                .welcome-section p {
                    color: #555;
                    line-height: 1.8;
                    font-size: 1.1em;
                }
                .nav-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }
                .card {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                    transition: transform 0.2s, box-shadow 0.2s;
                    text-decoration: none;
                    color: inherit;
                    display: block;
                    border-left: 4px solid #1976d2;
                }
                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
                }
                .card h3 {
                    color: #1565c0;
                    margin-bottom: 15px;
                    font-size: 1.4em;
                }
                .card p {
                    color: #666;
                    line-height: 1.6;
                    margin-bottom: 15px;
                }
                .card-badge {
                    display: inline-block;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 0.75em;
                    font-weight: 600;
                    margin-top: 10px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .badge-tutorial { background: #e3f2fd; color: #1976d2; }
                .badge-easy { background: #e8f5e9; color: #388e3c; }
                .badge-medium { background: #fff3e0; color: #f57c00; }
                .badge-hard { background: #ffebee; color: #d32f2f; }
                .footer {
                    text-align: center;
                    color: rgba(0,0,0,0.6);
                    margin-top: 40px;
                    padding: 20px;
                }
                .footer a {
                    color: rgba(0,0,0,0.6);
                    text-decoration: none;
                    transition: color 0.2s;
                }
                .footer a:hover {
                    color: #1565c0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">TechCorp Global</div>
                    <div class="user-info">
                        Logged in as: <strong>mrodriguez</strong> (Employee #${CURRENT_USER_ID})
                    </div>
                </div>

                <div class="welcome-section">
                    <h1>Welcome to Your Employee Portal, Maria! 💼</h1>
                    <p>Access your HR records, review benefits, connect with colleagues, and manage your employment information securely.</p>
                </div>

                <div class="nav-cards">
                    <a href="/employees" class="card">
                        <h3>👥 Employee Directory</h3>
                        <p>Search and connect with colleagues across all departments and locations.</p>
                        <span class="card-badge badge-easy">Directory</span>
                    </a>

                    <a href="/profile" class="card">
                        <h3>👤 My Profile</h3>
                        <p>View your employment details, compensation information, and performance reviews.</p>
                        <span class="card-badge badge-medium">Personal</span>
                    </a>

                    <a href="/admin" class="card">
                        <h3>🔐 HR Admin Dashboard</h3>
                        <p>HR staff-only area for managing employee records, processing changes, and accessing sensitive data.</p>
                        <span class="card-badge badge-hard">Restricted</span>
                    </a>
                </div>

                <div class="footer">
                    <p>🏢 TechCorp Global • 500 Innovation Drive, Silicon Valley • (555) 867-5309</p>
                    <p style="margin-top: 10px; font-size: 0.9em;">
                        <a href="/about">About TechCorp</a> | 
                        <a href="/contact">IT Support</a> | 
                        <a href="/benefits">Benefits</a> | 
                        <a href="/careers">Careers</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Example - Practice Challenge
app.get('/example', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Member Portal - TechCorp Global</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
                    min-height: 100vh;
                    padding: 20px;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .header {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                    margin-bottom: 30px;
                    text-align: center;
                }
                h1 {
                    color: #1565c0;
                    margin-bottom: 10px;
                }
                .info {
                    color: #666;
                    margin: 10px 0;
                }
                .section {
                    background: white;
                    padding: 25px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                    margin-bottom: 20px;
                }
                .section h2 {
                    color: #1565c0;
                    margin-bottom: 15px;
                    font-size: 1.4em;
                }
                .section p {
                    color: #555;
                    line-height: 1.6;
                    margin-bottom: 15px;
                }
                .member-card {
                    background: #f5f5f5;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 15px 0;
                    border-left: 4px solid #1976d2;
                }
                .member-card h3 {
                    color: #1565c0;
                    margin-bottom: 8px;
                }
                .member-card p {
                    color: #666;
                    margin: 5px 0;
                    font-size: 0.95em;
                }
                .search-box {
                    margin: 20px 0;
                }
                .search-input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #1976d2;
                    border-radius: 8px;
                    font-size: 1em;
                    margin-bottom: 10px;
                }
                .search-button {
                    background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
                    color: white;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 1em;
                    width: 100%;
                }
                .search-button:hover {
                    background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
                }
                .error {
                    color: #d32f2f;
                    padding: 10px;
                    background: #ffebee;
                    border-radius: 5px;
                    margin: 10px 0;
                }
                .loading {
                    color: #1976d2;
                    text-align: center;
                    padding: 20px;
                }
                .back-link {
                    text-align: center;
                    margin-top: 30px;
                }
                .back-link a {
                    color: white;
                    text-decoration: none;
                    font-weight: 600;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏢 TechCorp Global Member Portal</h1>
                    <p class="info">Practice Environment</p>
                </div>

                <div class="section">
                    <h2>My Profile</h2>
                    <div id="result"></div>
                </div>

                <div class="section">
                    <h2>Access Control</h2>
                    <p>Your current access level in the system.</p>
                    <div id="accessResult"></div>
                </div>

                <div class="back-link">
                    <a href="/">← Back to Main Portal</a>
                </div>
            </div>

            <script>
                // Load member profile and access info on page load
                window.addEventListener('DOMContentLoaded', () => {
                    loadProfile();
                    checkAccess();
                });

                async function loadProfile() {
                    const resultDiv = document.getElementById('result');
                    resultDiv.innerHTML = '<div class="loading">Loading profile...</div>';
                    
                    try {
                        const response = await fetch('/api/example/part1/member/1');
                        const data = await response.json();
                        
                        if (response.ok) {
                            resultDiv.innerHTML = \`
                                <div class="member-card">
                                    <h3>\${data.name}</h3>
                                    <p><strong>Role:</strong> \${data.role}</p>
                                    <p><strong>Email:</strong> \${data.email}</p>
                                    \${data.flag ? '<p style="color: #4caf50; font-weight: bold;">🎉 Flag: ' + data.flag + '</p>' : ''}
                                </div>
                            \`;
                        } else {
                            resultDiv.innerHTML = '<div class="error">' + data.error + '</div>';
                        }
                    } catch (error) {
                        resultDiv.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
                    }
                }

                async function checkAccess() {
                    const resultDiv = document.getElementById('accessResult');
                    resultDiv.innerHTML = '<div class="loading">Checking access...</div>';
                    
                    try {
                        const response = await fetch('/api/example/part3/intercept');
                        const data = await response.json();
                        
                        resultDiv.innerHTML = \`
                            <div class="member-card">
                                <h3>Access Level: \${data.access}</h3>
                                <p>\${data.message}</p>
                                <p><strong>Available Resources:</strong> \${data.data.resources.join(', ')}</p>
                                \${data.flag ? '<p style="color: #4caf50; font-weight: bold;">🎉 Flag: ' + data.flag + '</p>' : ''}
                            </div>
                        \`;
                    } catch (error) {
                        resultDiv.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
                    }
                }
            </script>
        </body>
        </html>
    `);
});

// Example API Endpoints for Tutorial
// Part 1: DevTools Discovery - Simple member lookup
app.get('/api/example/part1/member/:id', (req, res) => {
    const memberId = parseInt(req.params.id);
    const members = [
        { id: 1, name: 'Alice Johnson', role: 'Engineer', email: 'alice@techcorp.com' },
        { id: 2, name: 'Bob Smith', role: 'Designer', email: 'bob@techcorp.com' },
        { id: 3, name: 'Carol White', role: 'Manager', email: 'carol@techcorp.com' },
        { id: 4, name: 'David Brown', role: 'Analyst', email: 'david@techcorp.com' },
        { id: 108, name: 'Hidden Employee', role: 'Secret Agent', email: 'secret@techcorp.com', flag: 'NSA{D3VT00LS_M4ST3R}' }
    ];
    
    const member = members.find(m => m.id === memberId);
    if (member) {
        res.json(member);
    } else {
        res.status(404).json({ error: 'Member not found' });
    }
});

// Part 2: cURL Command Line - Detects User-Agent
app.get('/api/example/part2/test', (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    const isCurl = userAgent.toLowerCase().includes('curl');
    
    if (isCurl) {
        res.json({
            message: 'Success! You are using cURL.',
            flag: 'NSA{CURL_C0MM4ND3R}',
            userAgent: userAgent
        });
    } else {
        res.json({
            message: 'Access via browser detected. Try using cURL from the terminal!',
            userAgent: userAgent,
            hint: 'The server detected a browser User-Agent. Use: curl http://localhost:3001/api/example/part2/test'
        });
    }
});

// Part 3: Parameter Manipulation - Access level escalation
app.get('/api/example/part3/intercept', (req, res) => {
    const accessLevel = req.query.access || 'member';
    
    if (accessLevel === 'instructor' || accessLevel === 'manager') {
        res.json({
            message: 'Privilege escalation successful!',
            access: accessLevel,
            flag: 'NSA{BURP_1NT3RC3PT0R}',
            data: {
                privilegedInfo: 'You now have elevated access',
                resources: ['admin-panel', 'reports', 'user-management']
            }
        });
    } else {
        res.json({
            message: 'Regular member access',
            access: accessLevel,
            data: {
                basicInfo: 'Standard member view',
                resources: ['profile', 'directory']
            },
            hint: 'Try modifying the access parameter in the URL'
        });
    }
});

// Part 4: Sequential Enumeration - Employee discovery
app.get('/api/example/part4/enumerate/:id', (req, res) => {
    const empId = parseInt(req.params.id);
    const employees = {
        100: { id: 100, name: 'John Doe', dept: 'Engineering' },
        101: { id: 101, name: 'Jane Smith', dept: 'Marketing' },
        102: { id: 102, name: 'Bob Wilson', dept: 'Sales' },
        103: { id: 103, name: 'Alice Brown', dept: 'HR' },
        104: { id: 104, name: 'Charlie Davis', dept: 'Finance' },
        105: { id: 105, name: 'Diana Miller', dept: 'Operations', flag: 'NSA{3NUM3R4T10N_PR0}' }
    };
    
    if (employees[empId]) {
        res.json(employees[empId]);
    } else {
        res.status(404).json({ error: 'Employee not found' });
    }
});

// Lab 1 - Employee Directory (IDOR vulnerability)
app.get('/lab1', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Employee Directory - TechCorp Global</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background: linear-gradient(135deg, #e8f5e9 0%, #c5e1a5 100%);
                    min-height: 100vh;
                    padding: 20px;
                    line-height: 1.6;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .header {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                    margin-bottom: 30px;
                    text-align: center;
                }
                h1 {
                    color: #2e7d32;
                    font-size: 2.5em;
                    margin-bottom: 10px;
                }
                .subtitle {
                    color: #666;
                    font-size: 1.1em;
                }
                .info-section {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                    margin-bottom: 25px;
                    border-left: 4px solid #66bb6a;
                }
                .info-section h2 {
                    color: #2e7d32;
                    margin-bottom: 15px;
                }
                .info-section p {
                    color: #555;
                    margin-bottom: 15px;
                }
                .search-box {
                    background: #f1f8e9;
                    padding: 25px;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                .search-input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #66bb6a;
                    border-radius: 8px;
                    font-size: 1em;
                    margin-top: 10px;
                }
                .search-button {
                    background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
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
                .search-button:hover {
                    background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
                }
                .member-card {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 15px 0;
                    box-shadow: 0 1px 5px rgba(0,0,0,0.1);
                    border-left: 3px solid #66bb6a;
                }
                .member-name {
                    color: #2e7d32;
                    font-size: 1.3em;
                    font-weight: 600;
                    margin-bottom: 5px;
                }
                .member-info {
                    color: #666;
                    font-size: 0.95em;
                    line-height: 1.6;
                }
                .tip-box {
                    background: #fff3e0;
                    border-left: 4px solid #fb8c00;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 5px;
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
                .results-container {
                    margin-top: 20px;
                }
                .error-box {
                    background: #ffebee;
                    border-left: 4px solid #d32f2f;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 5px;
                    color: #c62828;
                }
                .back-link {
                    text-align: center;
                    margin-top: 30px;
                }
                .back-link a {
                    color: #2e7d32;
                    text-decoration: none;
                    font-weight: 600;
                }
                code {
                    background: #f5f5f5;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                    color: #c62828;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>👥 Employee Directory</h1>
                    <p class="subtitle">TechCorp Global HR Portal - Connect with colleagues worldwide</p>
                </div>

                <div class="info-section">
                    <h2>Directory Listings</h2>
                    <p>Browse employee profiles and contact information. Use the navigation above to access different HR systems.</p>
                    
                    <div class="member-card">
                        <div class="member-name">Sarah Mitchell</div>
                        <div class="member-info">
                            📧 Email: sarah.mitchell@techcorp-global.com<br>
                            🏢 Department: Engineering<br>
                            📍 Location: Seattle, WA
                        </div>
                    </div>

                    <div class="member-card">
                        <div class="member-name">James Rodriguez</div>
                        <div class="member-info">
                            📧 Email: james.rodriguez@techcorp-global.com<br>
                            🏢 Department: Marketing<br>
                            📍 Location: New York, NY
                        </div>
                    </div>

                    <div class="member-card">
                        <div class="member-name">Emily Chen</div>
                        <div class="member-info">
                            📧 Email: emily.chen@techcorp-global.com<br>
                            🏢 Department: Product<br>
                            📍 Location: San Francisco, CA
                        </div>
                    </div>

                    <p style="margin-top: 20px; color: #666; text-align: center;">
                        <em>For full employee details, please contact HR at hr@techcorp-global.com</em>
                    </p>
                </div>

                <div class="back-link">
                    <a href="/">← Back to HR Portal</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 1 API - Static endpoints for directory enumeration
app.get('/api', (req, res) => {
    // Root API endpoint - discoverable by gobuster
    res.json({
        name: 'TechCorp Global HR API',
        version: '2.1.0',
        endpoints: {
            members: '/api/members',
            users: '/api/users',
            profiles: '/api/profile'
        },
        documentation: 'https://docs.techcorp-global.com/api'
    });
});

app.get('/api/members', (req, res) => {
    // Returns basic directory info without details
    res.json({
        message: 'Employee Directory API',
        version: '1.0',
        totalEmployees: users.length,
        endpoints: {
            list: '/api/members/list',
            search: '/api/members/search',
            user: '/api/members/user/:id'
        },
        hint: 'Use the list endpoint to see available employee IDs'
    });
});

app.get('/api/members/list', (req, res) => {
    // Returns list of employee IDs - makes enumeration obvious
    const employeeIds = users.map(u => ({
        id: u.id,
        username: u.username,
        role: u.role
    }));
    
    res.json({
        message: 'Available employee records',
        count: employeeIds.length,
        employees: employeeIds,
        note: 'Use /api/members/user/:id to get full details'
    });
});

app.get('/api/members/search', (req, res) => {
    // Search endpoint that hints at individual record access
    const query = req.query.q || '';
    
    if (!query) {
        return res.json({
            message: 'Search employee directory',
            usage: '/api/members/search?q=username',
            example: '/api/members/search?q=jchen',
            tip: 'Or access individual records directly at /api/members/user/:id'
        });
    }
    
    const results = users.filter(u => 
        u.username.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
    );
    
    res.json({
        query: query,
        count: results.length,
        results: results.map(u => ({
            id: u.id,
            username: u.username,
            email: u.email,
            role: u.role
        }))
    });
});

app.get('/api/users', (req, res) => {
    // Alternative endpoint - returns count only
    res.json({
        totalUsers: users.length,
        message: 'Employee directory contains ' + users.length + ' records',
        access: 'Use /api/members/user/:id to access individual records',
        idRange: '1-5'
    });
});

// Lab 1 API - Community directory endpoint (vulnerable to enumeration)
app.get('/api/members/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ 
            error: 'Member not found',
            message: 'No member exists with this ID in our directory.'
        });
    }
    
    // Vulnerable: Returns user info without proper access control
    // Flag only shown when accessing the last user (ID 4) after enumeration
    
    if (userId === 4) {
        return res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            membership: user.membership,
            flag: 'NSA{F0UND_TH3_US3RS}',
            message: 'You have successfully enumerated all community members!',
            stats: {
                totalMembers: users.length,
                members: users.filter(u => u.role === 'member').length,
                instructors: users.filter(u => u.role === 'instructor').length
            }
        });
    }
    
    // Normal response - looks like legitimate directory data
    const response = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        membership: user.membership
    };
    
    // Add extra info for members
    if (user.role === 'member') {
        response.joinDate = user.joinDate;
        response.favoriteClass = user.favoriteClass;
    }
    
    // Add extra info for instructors
    if (user.role === 'instructor') {
        response.specialization = user.specialization;
        response.yearsTeaching = user.yearsTeaching;
    }
    
    return res.json(response);
});

// Lab 2 - Cookie-Based Access Control
app.get('/lab2', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Employee Profile - TechCorp Global</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background: linear-gradient(135deg, #e8f5e9 0%, #c5e1a5 100%);
                    min-height: 100vh;
                    padding: 20px;
                    line-height: 1.6;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .header {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                    margin-bottom: 30px;
                    text-align: center;
                }
                h1 {
                    color: #2e7d32;
                    font-size: 2.5em;
                    margin-bottom: 10px;
                }
                .subtitle {
                    color: #666;
                    font-size: 1.1em;
                }
                .profile-section {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                    margin-bottom: 25px;
                    border-left: 4px solid #66bb6a;
                }
                .profile-section h2 {
                    color: #2e7d32;
                    margin-bottom: 20px;
                }
                .profile-field {
                    display: flex;
                    padding: 15px 0;
                    border-bottom: 1px solid #f0f0f0;
                }
                .profile-field:last-child {
                    border-bottom: none;
                }
                .field-label {
                    font-weight: 600;
                    color: #666;
                    width: 180px;
                }
                .field-value {
                    color: #333;
                    flex: 1;
                }
                .info-box {
                    background: #f1f8e9;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                .info-box p {
                    color: #555;
                    font-size: 0.95em;
                }
                .tip-box {
                    background: #fff3e0;
                    border-left: 4px solid #fb8c00;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 5px;
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
                code {
                    background: #f5f5f5;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                    color: #c62828;
                    font-size: 0.9em;
                }
                .back-link {
                    text-align: center;
                    margin-top: 30px;
                }
                .back-link a {
                    color: #2e7d32;
                    text-decoration: none;
                    font-weight: 600;
                }
                .btn {
                    background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 15px;
                }
                .btn:hover {
                    background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
                }
                .load-profile-section {
                    background: #e3f2fd;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    border-left: 3px solid #2196f3;
                }
                .profile-input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #66bb6a;
                    border-radius: 8px;
                    font-size: 1em;
                    margin: 10px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>👤 My Profile</h1>
                    <p class="subtitle">View your employee information</p>
                </div>

                <div id="profileContent"></div>

                <div class="back-link">
                    <a href="/">← Back to HR Portal</a>
                </div>
            </div>

            <script>
                // Load profile on page load
                window.addEventListener('DOMContentLoaded', async () => {
                    const contentDiv = document.getElementById('profileContent');
                    contentDiv.innerHTML = '<div class="loading">Loading your profile...</div>';
                    
                    try {
                        const response = await fetch('/api/profile');
                        const data = await response.json();
                        
                        if (response.ok) {
                            contentDiv.innerHTML = \`
                                <div class="profile-section">
                                    <h2>📋 Account Information</h2>
                                    <div class="profile-field">
                                        <div class="field-label">Employee ID:</div>
                                        <div class="field-value">#\${data.id}</div>
                                    </div>
                                    <div class="profile-field">
                                        <div class="field-label">Username:</div>
                                        <div class="field-value">\${data.username}</div>
                                    </div>
                                    <div class="profile-field">
                                        <div class="field-label">Email:</div>
                                        <div class="field-value">\${data.email}</div>
                                    </div>
                                    <div class="profile-field">
                                        <div class="field-label">Role:</div>
                                        <div class="field-value">\${data.role}</div>
                                    </div>
                                    <div class="profile-field">
                                        <div class="field-label">Department:</div>
                                        <div class="field-value">\${data.department}</div>
                                    </div>
                                    \${data.salary ? \`
                                        <div class="profile-field">
                                            <div class="field-label">Salary:</div>
                                            <div class="field-value">$\${data.salary.toLocaleString()}</div>
                                        </div>
                                    \` : ''}
                                    \${data.flag ? \`
                                        <div class="flag-reveal">🎉 \${data.flag} 🎉</div>
                                    \` : ''}
                                </div>
                            \`;
                        } else {
                            contentDiv.innerHTML = \`<div class="error">\${data.error}</div>\`;
                        }
                    } catch (error) {
                        contentDiv.innerHTML = \`<div class="error">Error loading profile: \${error.message}</div>\`;
                    }
                });
            </script>
        </body>
        </html>
    `);
});

// Lab 2 API - Profile access endpoint (vulnerable to cookie manipulation)
app.get('/api/profile', (req, res) => {
    // Vulnerability: Trusts client-provided cookie without server-side session validation
    // Should validate userId against server-side session, not trust the cookie
    const cookies = req.headers.cookie || '';
    const userIdFromCookie = parseInt(cookies.match(/userId=(\d+)/)?.[1] || CURRENT_USER_ID);
    
    const user = users.find(u => u.id === userIdFromCookie);
    
    if (!user) {
        return res.status(404).json({ 
            error: 'User not found',
            message: 'Invalid user ID in cookie'
        });
    }
    
    // Build response with sensitive data based on cookie value
    const profileData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        title: user.title
    };
    
    // If someone manipulated their cookie to access another user's profile
    if (userIdFromCookie !== CURRENT_USER_ID) {
        profileData.salary = user.salary;
        profileData.ssn = user.ssn;
        profileData.performanceRating = user.performanceRating;
        profileData.flag = 'NSA{C00K13_M4N1PUL4T10N}';
        profileData._vuln_note = 'Cookie manipulation detected: You modified the userId cookie to access another employee\'s data!';
    }
    
    return res.json(profileData);
});

// Lab 3 - Instructor Dashboard
app.get('/lab3', (req, res) => {
    // Check if user has instructor cookie
    const userRole = req.headers.cookie?.match(/userRole=([^;]+)/)?.[1] || 'member';
    const userId = req.headers.cookie?.match(/userId=([^;]+)/)?.[1] || String(CURRENT_USER_ID);
    
    const isInstructor = userRole === 'instructor';
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>HR Admin Dashboard - TechCorp Global</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background: linear-gradient(135deg, #e8f5e9 0%, #c5e1a5 100%);
                    min-height: 100vh;
                    padding: 20px;
                    line-height: 1.6;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                .header {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                    margin-bottom: 30px;
                    text-align: center;
                }
                h1 {
                    color: #2e7d32;
                    font-size: 2.5em;
                    margin-bottom: 10px;
                }
                .subtitle {
                    color: #666;
                    font-size: 1.1em;
                }
                .alert-box {
                    background: #ffebee;
                    border-left: 4px solid #d32f2f;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                .alert-box h2 {
                    color: #c62828;
                    margin-bottom: 10px;
                }
                .alert-box p {
                    color: #666;
                }
                .success-box {
                    background: #e8f5e9;
                    border-left: 4px solid #4caf50;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                }
                .success-box h2 {
                    color: #2e7d32;
                    margin-bottom: 10px;
                }
                .info-section {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                    margin-bottom: 25px;
                    border-left: 4px solid #66bb6a;
                }
                .info-section h2 {
                    color: #2e7d32;
                    margin-bottom: 15px;
                }
                .info-section p {
                    color: #555;
                    margin-bottom: 15px;
                    line-height: 1.7;
                }
                .feature-list {
                    background: #f1f8e9;
                    padding: 20px 20px 20px 40px;
                    border-radius: 10px;
                    margin: 15px 0;
                }
                .feature-list li {
                    color: #555;
                    margin: 8px 0;
                }
                .dashboard-card {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 15px 0;
                    box-shadow: 0 1px 5px rgba(0,0,0,0.1);
                    border-left: 3px solid #66bb6a;
                }
                .dashboard-card h3 {
                    color: #2e7d32;
                    margin-bottom: 10px;
                }
                .class-item {
                    background: #f9f9f9;
                    padding: 12px;
                    margin: 8px 0;
                    border-radius: 5px;
                    border-left: 2px solid #66bb6a;
                }
                .flag-reveal {
                    background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
                    color: white;
                    padding: 30px;
                    border-radius: 15px;
                    margin: 20px 0;
                    text-align: center;
                    font-weight: bold;
                    font-size: 1.3em;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }
                .tip-box {
                    background: #fff3e0;
                    border-left: 4px solid #fb8c00;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 5px;
                }
                code {
                    background: #f5f5f5;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
                    color: #c62828;
                    font-size: 0.9em;
                }
                .back-link {
                    text-align: center;
                    margin-top: 30px;
                }
                .back-link a {
                    color: #2e7d32;
                    text-decoration: none;
                    font-weight: 600;
                }
                .cookie-info {
                    background: #e3f2fd;
                    border-left: 4px solid #2196f3;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 5px;
                    font-family: 'Courier New', monospace;
                    font-size: 0.85em;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📅 HR Admin Dashboard</h1>
                    <p class="subtitle">Human Resources Management System</p>
                </div>

                <div id="dashboardContent"></div>

                <div class="back-link">
                    <a href="/">← Back to HR Portal</a>
                </div>
            </div>

            <script>
                // Load dashboard on page load
                window.addEventListener('DOMContentLoaded', async () => {
                    const contentDiv = document.getElementById('dashboardContent');
                    contentDiv.innerHTML = '<div class="loading">Loading dashboard...</div>';
                    
                    try {
                        const response = await fetch('/api/admin/dashboard');
                        const data = await response.json();
                        
                        if (response.ok) {
                            contentDiv.innerHTML = \`
                                <div class="success-box">
                                    <h2>✅ Welcome, HR Administrator</h2>
                                    <p>Access granted. You are viewing the administrative control panel.</p>
                                </div>

                                \${data.flag ? \`
                                    <div class="flag-reveal">🎉 \${data.flag} 🎉</div>
                                \` : ''}

                                <div class="info-section">
                                    <h2>📊 Employee Statistics</h2>
                                    <div class="dashboard-card">
                                        <h3>📈 Workforce Metrics</h3>
                                        <p><strong>Total Employees:</strong> \${data.employeeStats.totalEmployees}</p>
                                        <p><strong>Average Salary:</strong> $\${data.employeeStats.avgSalary.toLocaleString()}</p>
                                        <p><strong>Highest Paid:</strong> \${data.employeeStats.highestPaid.username} - $\${data.employeeStats.highestPaid.salary.toLocaleString()}</p>
                                    </div>

                                    <div class="dashboard-card">
                                        <h3>🏢 Department Breakdown</h3>
                                        <p><strong>Engineering:</strong> \${data.employeeStats.departmentCount.Engineering} employees</p>
                                        <p><strong>Marketing:</strong> \${data.employeeStats.departmentCount.Marketing} employees</p>
                                        <p><strong>Sales:</strong> \${data.employeeStats.departmentCount.Sales} employees</p>
                                        <p><strong>HR:</strong> \${data.employeeStats.departmentCount.HR} employees</p>
                                    </div>

                                    <div class="dashboard-card">
                                        <h3>🔒 Sensitive Information</h3>
                                        <p><strong>Annual Payroll:</strong> \${data.sensitiveData.payrollBudget}</p>
                                        <p><strong>Upcoming Layoffs:</strong> \${data.sensitiveData.upcomingLayoffs}</p>
                                        <p><strong>Executive Bonuses:</strong> \${data.sensitiveData.executiveBonuses}</p>
                                    </div>
                                </div>
                            \`;
                        } else {
                            contentDiv.innerHTML = \`
                                <div class="alert-box">
                                    <h2>🔒 Access Denied</h2>
                                    <p>\${data.message}</p>
                                    <p style="margin-top: 10px;"><strong>Your Role:</strong> \${data.yourRole}</p>
                                    <p><strong>Required Role:</strong> \${data.requiredRole}</p>
                                </div>

                                <div class="info-section">
                                    <h2>About the HR Dashboard</h2>
                                    <p>The TechCorp HR Dashboard provides administrators with comprehensive tools for managing employee data, benefits administration, and organizational analytics.</p>
                                </div>
                            \`;
                        }
                    } catch (error) {
                        contentDiv.innerHTML = \`<div class="error">Error loading dashboard: \${error.message}</div>\`;
                    }
                });
            </script>
        </body>
        </html>
    `);
});

// Lab 3 API - Admin dashboard endpoint (vulnerable to missing function-level access control)
app.get('/api/admin/dashboard', (req, res) => {
    // Vulnerability: Trusts userRole cookie without server-side verification
    // Should validate role against server-side session, not trust client cookie
    const cookies = req.headers.cookie || '';
    const userRole = cookies.match(/userRole=([^;]+)/)?.[1] || 'employee';
    const userId = parseInt(cookies.match(/userId=(\d+)/)?.[1] || CURRENT_USER_ID);
    
    // Only checks cookie value - can be easily manipulated!
    if (userRole !== 'admin') {
        return res.status(403).json({ 
            error: 'Access Denied',
            message: 'This area is restricted to HR administrators only.',
            yourRole: userRole,
            requiredRole: 'admin'
        });
    }
    
    // If we get here, the userRole cookie claimed admin access
    // Build admin dashboard data
    const dashboardData = {
        message: 'Welcome to the HR Admin Dashboard',
        user: {
            id: userId,
            role: userRole
        },
        employeeStats: {
            totalEmployees: users.length,
            avgSalary: Math.round(users.reduce((sum, u) => sum + u.salary, 0) / users.length),
            highestPaid: users.reduce((max, u) => u.salary > max.salary ? u : max),
            departmentCount: {
                Engineering: users.filter(u => u.department === 'Engineering').length,
                Marketing: users.filter(u => u.department === 'Marketing').length,
                Sales: users.filter(u => u.department === 'Sales').length,
                HR: users.filter(u => u.department === 'Human Resources').length
            }
        },
        sensitiveData: {
            payrollBudget: '$12.5M annually',
            upcomingLayoffs: '15 positions',
            executiveBonuses: '$2.1M pool'
        }
    };
    
    // If privilege escalation occurred (regular employee manipulated cookie to gain admin access)
    if (userId === CURRENT_USER_ID && userRole !== 'employee') {
        dashboardData.flag = 'NSA{PR1V1L3G3_3SC4L4T10N}';
        dashboardData._vuln_note = 'Privilege escalation detected: Regular employee manipulated userRole cookie to gain admin access!';
    }
    
    return res.json(dashboardData);
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`\x1b[32m
╔════════════════════════════════════════════╗
║   🏢 TechCorp Global - Employee Portal    ║
║   Server running on port ${PORT}           ║
║                                            ║
║   Access the portal:                      ║
║   http://localhost:${PORT}                    ║
╚════════════════════════════════════════════╝
\x1b[0m`);
});
