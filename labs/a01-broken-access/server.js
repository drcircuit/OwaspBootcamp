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
                    max-width: 1000px;
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
                .tutorial-section {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                    margin-bottom: 25px;
                    border-left: 4px solid #66bb6a;
                }
                .tutorial-section h2 {
                    color: #2e7d32;
                    margin-bottom: 15px;
                    font-size: 1.8em;
                }
                .tutorial-section p {
                    color: #555;
                    margin-bottom: 15px;
                    line-height: 1.7;
                }
                .tutorial-box {
                    background: #f1f8e9;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 15px 0;
                    border-left: 3px solid #66bb6a;
                }
                .interactive-demo {
                    background: #fff3e0;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 15px 0;
                    border-left: 3px solid #fb8c00;
                }
                .demo-controls {
                    margin: 15px 0;
                }
                .demo-input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #66bb6a;
                    border-radius: 8px;
                    font-size: 1em;
                    margin: 10px 0;
                }
                .demo-button {
                    background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
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
                    background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
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
                    background: #e3f2fd;
                    border-left: 4px solid #2196f3;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                }
                code {
                    background: #f5f5f5;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-family: 'Courier New', monospace;
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
                ol {
                    margin-left: 20px;
                    margin-bottom: 15px;
                }
                ol li {
                    margin: 8px 0;
                    color: #555;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📚 Getting Started Guide</h1>
                    <p class="subtitle">Learn to navigate the member portal with interactive examples</p>
                </div>

                <!-- Part 1: DevTools Discovery -->
                <div class="tutorial-section">
                    <h2>Part 1: Browser DevTools Discovery 🔍</h2>
                    <p>Learn how to use your browser's developer tools to explore API endpoints and discover hidden resources.</p>
                    
                    <div class="tutorial-box">
                        <h3>🎯 Your Mission</h3>
                        <p>The member directory allows you to search for members by ID. Try different IDs to discover all members, including a hidden VIP member at ID 108!</p>
                    </div>

                    <div class="interactive-demo">
                        <h3>Interactive Demo</h3>
                        <p>Enter a member ID to view their profile. Open your browser's DevTools (F12) to watch the network requests!</p>
                        <div class="demo-controls">
                            <input type="number" id="part1-id" class="demo-input" placeholder="Enter member ID (try 100-110)" value="100">
                            <button onclick="part1Search()" class="demo-button">🔍 Search Member</button>
                        </div>
                        <div id="part1-output" class="output-box"></div>
                        <div id="part1-flag" class="flag-reveal"></div>
                    </div>

                    <div class="hint-box">
                        <strong>💡 Tip:</strong> Press F12 to open DevTools, go to the Network tab, and watch what happens when you click the search button!
                    </div>
                </div>

                <!-- Part 2: cURL Command Line -->
                <div class="tutorial-section">
                    <h2>Part 2: Command-Line Tools 💻</h2>
                    <p>APIs can be accessed not just through browsers, but also via command-line tools like cURL. This gives you more control over requests.</p>
                    
                    <div class="tutorial-box">
                        <h3>🎯 Your Mission</h3>
                        <p>Access the API using cURL from your terminal to get the flag. The server checks the User-Agent header!</p>
                    </div>

                    <div class="interactive-demo">
                        <h3>Try it yourself</h3>
                        <p>Copy and paste this command in your terminal:</p>
                        <div class="output-box">curl http://localhost:3001/api/example/part2/test</div>
                        <p style="margin-top: 15px;">Or test it directly from the browser (won't show the flag):</p>
                        <button onclick="part2Test()" class="demo-button">🌐 Test from Browser</button>
                        <div id="part2-output" class="output-box" style="display:none;"></div>
                        <div id="part2-flag" class="flag-reveal"></div>
                    </div>

                    <div class="hint-box">
                        <strong>💡 Tip:</strong> The server can detect whether you're using a browser or cURL by checking the User-Agent header!
                    </div>
                </div>

                <!-- Part 3: Request Interception -->
                <div class="tutorial-section">
                    <h2>Part 3: Parameter Manipulation 🎛️</h2>
                    <p>Learn how modifying request parameters can change application behavior and potentially escalate privileges.</p>
                    
                    <div class="tutorial-box">
                        <h3>🎯 Your Mission</h3>
                        <p>The portal checks your access level via a query parameter. Can you change it to gain instructor privileges?</p>
                    </div>

                    <div class="interactive-demo">
                        <h3>Interactive Demo</h3>
                        <p>Try different access levels and see what data you can retrieve:</p>
                        <div class="demo-controls">
                            <select id="part3-access" class="demo-input">
                                <option value="member">Member Access</option>
                                <option value="instructor">Instructor Access</option>
                            </select>
                            <button onclick="part3Test()" class="demo-button">🔓 Test Access Level</button>
                        </div>
                        <div id="part3-output" class="output-box"></div>
                        <div id="part3-flag" class="flag-reveal"></div>
                    </div>

                    <div class="hint-box">
                        <strong>💡 Tip:</strong> Open DevTools Network tab to see the actual URL being requested and the parameters being sent!
                    </div>
                </div>

                <!-- Part 4: Sequential Enumeration -->
                <div class="tutorial-section">
                    <h2>Part 4: Sequential Enumeration 🔢</h2>
                    <p>Many systems use sequential IDs. Attackers can enumerate through all IDs to discover all records in a database.</p>
                    
                    <div class="tutorial-box">
                        <h3>🎯 Your Mission</h3>
                        <p>Find all active members (IDs 100-105) by enumerating through the IDs. The flag appears when you've found them all!</p>
                    </div>

                    <div class="interactive-demo">
                        <h3>Interactive Demo</h3>
                        <p>Click to enumerate members one by one, or use the auto-enumerate feature:</p>
                        <div class="demo-controls">
                            <input type="number" id="part4-id" class="demo-input" placeholder="Enter member ID (100-105)" value="100">
                            <button onclick="part4Search()" class="demo-button">🔍 Search Single ID</button>
                            <button onclick="part4AutoEnumerate()" id="part4-auto-btn" class="demo-button">⚡ Auto-Enumerate (100-105)</button>
                        </div>
                        <div id="part4-output" class="output-box"></div>
                        <div id="part4-flag" class="flag-reveal"></div>
                    </div>

                    <div class="hint-box">
                        <strong>💡 Tip:</strong> In real attacks, scripts automate this enumeration process to quickly discover all resources!
                    </div>
                </div>

                <div class="back-link">
                    <a href="/">← Back to Member Portal</a>
                </div>
            </div>

            <script>
                // Part 1: DevTools Discovery
                async function part1Search() {
                    const id = document.getElementById('part1-id').value;
                    const output = document.getElementById('part1-output');
                    const flagDiv = document.getElementById('part1-flag');
                    
                    output.textContent = 'Loading...';
                    flagDiv.style.display = 'none';
                    
                    try {
                        const response = await fetch('/api/example/part1/member/' + id);
                        const data = await response.json();
                        output.textContent = JSON.stringify(data, null, 2);
                        
                        if (data.flag) {
                            flagDiv.textContent = '🎉 ' + data.flag;
                            flagDiv.style.display = 'block';
                        }
                    } catch (error) {
                        output.textContent = 'Error: ' + error.message;
                    }
                }

                // Part 2: cURL Test
                async function part2Test() {
                    const output = document.getElementById('part2-output');
                    const flagDiv = document.getElementById('part2-flag');
                    
                    output.style.display = 'block';
                    output.textContent = 'Loading...';
                    flagDiv.style.display = 'none';
                    
                    try {
                        const response = await fetch('/api/example/part2/test');
                        const data = await response.json();
                        output.textContent = JSON.stringify(data, null, 2);
                        
                        if (data.flag) {
                            flagDiv.textContent = '🎉 ' + data.flag;
                            flagDiv.style.display = 'block';
                        }
                    } catch (error) {
                        output.textContent = 'Error: ' + error.message;
                    }
                }

                // Part 3: Parameter Manipulation
                async function part3Test() {
                    const access = document.getElementById('part3-access').value;
                    const output = document.getElementById('part3-output');
                    const flagDiv = document.getElementById('part3-flag');
                    
                    output.textContent = 'Loading...';
                    flagDiv.style.display = 'none';
                    
                    try {
                        const response = await fetch('/api/example/part3/intercept?access=' + access);
                        const data = await response.json();
                        output.textContent = JSON.stringify(data, null, 2);
                        
                        if (data.flag) {
                            flagDiv.textContent = '🎉 ' + data.flag;
                            flagDiv.style.display = 'block';
                        }
                    } catch (error) {
                        output.textContent = 'Error: ' + error.message;
                    }
                }

                // Part 4: Sequential Enumeration
                async function part4Search() {
                    const id = document.getElementById('part4-id').value;
                    const output = document.getElementById('part4-output');
                    const flagDiv = document.getElementById('part4-flag');
                    
                    output.textContent = 'Loading...';
                    flagDiv.style.display = 'none';
                    
                    try {
                        const response = await fetch('/api/example/part4/enumerate/' + id);
                        const data = await response.json();
                        output.textContent = JSON.stringify(data, null, 2);
                        
                        if (data.flag) {
                            flagDiv.textContent = '🎉 ' + data.flag;
                            flagDiv.style.display = 'block';
                        }
                    } catch (error) {
                        output.textContent = 'Error: ' + error.message;
                    }
                }

                async function part4AutoEnumerate() {
                    const output = document.getElementById('part4-output');
                    const flagDiv = document.getElementById('part4-flag');
                    const btn = document.getElementById('part4-auto-btn');
                    
                    btn.disabled = true;
                    btn.textContent = 'Enumerating...';
                    output.textContent = 'Starting enumeration...\\n\\n';
                    flagDiv.style.display = 'none';
                    
                    for (let id = 100; id <= 105; id++) {
                        try {
                            const response = await fetch('/api/example/part4/enumerate/' + id);
                            const data = await response.json();
                            output.textContent += '\\n--- Member ID ' + id + ' ---\\n';
                            output.textContent += JSON.stringify(data, null, 2) + '\\n';
                            
                            if (data.flag) {
                                flagDiv.textContent = '🎉 ' + data.flag;
                                flagDiv.style.display = 'block';
                            }
                            
                            // Scroll to bottom
                            output.scrollTop = output.scrollHeight;
                            
                            // Small delay between requests
                            await new Promise(resolve => setTimeout(resolve, 300));
                        } catch (error) {
                            output.textContent += 'Error for ID ' + id + ': ' + error.message + '\\n';
                        }
                    }
                    
                    btn.disabled = false;
                    btn.textContent = '⚡ Auto-Enumerate (100-105)';
                }
            </script>
        </body>
        </html>
    `);
});

// Lab 1 - Community Directory
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

// Lab 2 - My Profile
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
                    <p class="subtitle">Manage your employee information</p>
                </div>

                <div class="profile-section">
                    <h2>📋 Account Information</h2>
                    <div class="profile-field">
                        <div class="field-label">Employee ID:</div>
                        <div class="field-value">#${CURRENT_USER_ID}</div>
                    </div>
                    <div class="profile-field">
                        <div class="field-label">Name:</div>
                        <div class="field-value">Sarah Mitchell</div>
                    </div>
                    <div class="profile-field">
                        <div class="field-label">Email:</div>
                        <div class="field-value">sarah.mitchell@techcorp-global.com</div>
                    </div>
                    <div class="profile-field">
                        <div class="field-label">Department:</div>
                        <div class="field-value">Engineering</div>
                    </div>
                    <div class="profile-field">
                        <div class="field-label">Hire Date:</div>
                        <div class="field-value">March 15, 2023</div>
                    </div>
                </div>

                <div class="profile-section">
                    <h2>🎫 Benefits & Compensation</h2>
                    <div class="profile-field">
                        <div class="field-label">Health Plan:</div>
                        <div class="field-value">Premium Plus</div>
                    </div>
                    <div class="profile-field">
                        <div class="field-label">401(k) Status:</div>
                        <div class="field-value">✅ Active (8% contribution)</div>
                    </div>
                    <div class="profile-field">
                        <div class="field-label">PTO Balance:</div>
                        <div class="field-value">15 days remaining</div>
                    </div>
                    <button class="btn">Request Time Off</button>
                </div>

                <div class="profile-section">
                    <h2>💳 Direct Deposit</h2>
                    <div class="profile-field">
                        <div class="field-label">Bank Account:</div>
                        <div class="field-value">****5678 (Wells Fargo)</div>
                    </div>
                    <div class="profile-field">
                        <div class="field-label">Next Paycheck:</div>
                        <div class="field-value">January 31, 2026</div>
                    </div>
                </div>

                <div class="back-link">
                    <a href="/">← Back to HR Portal</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 2 API - Profile access endpoint (vulnerable to IDOR)
app.get('/api/profile/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ 
            error: 'Member not found',
            message: 'Invalid member ID'
        });
    }
    
    // Vulnerable: Checks that someone is logged in, but not WHO is accessing
    // Should verify: req.session.userId === userId
    // Instead: returns data for ANY valid user ID
    
    // Build response with sensitive data
    const profileData = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        membership: user.membership,
        creditCard: user.creditCard,
        renewalDate: user.renewalDate
    };
    
    // Add member-specific data
    if (user.role === 'member') {
        profileData.joinDate = user.joinDate;
        profileData.favoriteClass = user.favoriteClass;
    }
    
    // Add instructor-specific data
    if (user.role === 'instructor') {
        profileData.specialization = user.specialization;
        profileData.yearsTeaching = user.yearsTeaching;
        profileData.accessLevel = user.accessLevel;
    }
    
    // If accessing someone else's profile (IDOR vulnerability exploited)
    if (userId !== CURRENT_USER_ID) {
        profileData.flag = 'NSA{1D0R_V1CT1M_4CC3SS}';
        profileData._vuln_note = 'Unauthorized access: You accessed another member\'s private profile!';
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

                ${!isInstructor ? `
                <div class="alert-box">
                    <h2>🔒 Administrative Access Required</h2>
                    <p>You are currently logged in as <strong>Employee #${userId}</strong></p>
                    <p style="margin-top: 10px;">This area is restricted to TechCorp HR administrators and authorized personnel only. If you believe you should have access, please contact our IT department at it@techcorp-global.com.</p>
                </div>

                <div class="info-section">
                    <h2>About the HR Dashboard</h2>
                    <p>The TechCorp HR Dashboard provides administrators with comprehensive tools for managing employee data, benefits administration, and organizational analytics:</p>
                    
                    <ul class="feature-list">
                        <li><strong>Employee Records:</strong> Access complete personnel files and documentation</li>
                        <li><strong>Payroll Management:</strong> Process compensation and benefits administration</li>
                        <li><strong>Performance Reviews:</strong> Track employee evaluations and development plans</li>
                        <li><strong>Compliance Reporting:</strong> Generate regulatory and audit reports</li>
                        <li><strong>Org Analytics:</strong> Workforce metrics and department insights</li>
                    </ul>
                </div>
                ` : `
                <div class="success-box">
                    <h2>✅ Welcome, HR Administrator</h2>
                    <p>Access granted. You are viewing the administrative control panel.</p>
                </div>

                <div class="flag-reveal">
                    🎉 NSA{R00T_4CC3SS_4CH13V3D} 🎉
                </div>

                <div class="info-section">
                    <h2>📊 HR Dashboard</h2>
                    
                    <div class="dashboard-card">
                        <h3>📅 Pending Actions</h3>
                        <div class="class-item">
                            <strong>New Hire Onboarding:</strong> 3 employees starting next week<br>
                            <strong>PTO Requests:</strong> 8 pending approvals<br>
                            <strong>Performance Reviews:</strong> 12 overdue evaluations
                        </div>
                    </div>

                    <div class="dashboard-card">
                        <h3>📈 Workforce Metrics</h3>
                        <p><strong>Total Employees:</strong> 1,247</p>
                        <p><strong>Average Tenure:</strong> 3.2 years</p>
                        <p><strong>Turnover Rate:</strong> 8.5% (Q4 2025)</p>
                        <p><strong>Open Positions:</strong> 23</p>
                    </div>

                    <div class="dashboard-card">
                        <h3>📚 Quick Links</h3>
                        <ul class="feature-list">
                            <li>Employee Directory</li>
                            <li>Payroll Processing</li>
                            <li>Benefits Administration</li>
                            <li>Compliance Reports</li>
                            <li>Training & Development</li>
                        </ul>
                    </div>
                </div>
                `}

                <div class="info-section">
                    <h2>🎓 Join Our Team</h2>
                    <p>Interested in joining TechCorp? We're always looking for talented professionals across engineering, sales, operations, and more.</p>
                    <p style="margin-top: 15px;">Visit <strong>careers.techcorp-global.com</strong> to view open positions and apply online.</p>
                </div>

                <div class="back-link">
                    <a href="/">← Back to HR Portal</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 3 API - Instructor dashboard endpoint (vulnerable to privilege escalation via IDOR)
app.get('/api/instructor/user/:id/dashboard', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ 
            error: 'Member not found',
            message: 'Invalid member ID'
        });
    }
    
    // Vulnerable: No session management or authentication
    // Should have: 
    //   1. Session management to track current logged-in user
    //   2. Check if req.session.userId exists and is valid
    //   3. Verify req.session.user.role === 'instructor'
    // Instead: Checks the role of the requested user ID (from URL parameter)
    // This allows privilege escalation by requesting instructor IDs
    
    if (user.role !== 'instructor') {
        return res.status(403).json({ 
            error: 'Access Denied',
            message: 'This area is restricted to TechCorp HR administrators only.',
            yourRole: 'member',
            requiredRole: 'instructor'
        });
    }
    
    // If we get here, the requested user ID belongs to an instructor
    // Build instructor dashboard data
    const dashboardData = {
        message: 'Welcome to the Instructor Dashboard',
        instructor: {
            id: user.id,
            username: user.username,
            email: user.email,
            specialization: user.specialization,
            yearsTeaching: user.yearsTeaching
        },
        upcomingClasses: [
            { date: '2025-01-20', time: '9:00 AM', type: 'Vinyasa Flow', enrolled: 12 },
            { date: '2025-01-22', time: '6:00 PM', type: 'Meditation', enrolled: 8 },
            { date: '2025-01-25', time: '10:00 AM', type: 'Power Yoga', enrolled: 15 }
        ],
        studentStats: {
            totalStudents: 45,
            averageAttendance: '87%',
            rating: 4.8
        },
        resources: {
            lessonPlans: '/instructor/resources/lessons',
            studioGuidelines: '/instructor/resources/guidelines',
            attendanceReports: '/instructor/reports/attendance'
        }
    };
    
    // If privilege escalation occurred (accessing instructor dashboard as regular member)
    if (userId !== CURRENT_USER_ID) {
        dashboardData.flag = 'NSA{R00T_4CC3SS_4CH13V3D}';
        dashboardData._vuln_note = 'Privilege escalation detected: Regular member accessed instructor dashboard!';
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
