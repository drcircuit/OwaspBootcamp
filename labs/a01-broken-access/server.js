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

// Users database - ZenFlow Yoga Studio Members
const users = [
    { id: 1, username: 'emma_s', email: 'emma.stevens@email.com', role: 'member', membership: 'Premium', creditCard: '**** 4532', renewalDate: '2025-03-15', joinDate: '2023-01-15', favoriteClass: 'Vinyasa Flow' },
    { id: 2, username: 'sarah_m', email: 'sarah.martinez@email.com', role: 'member', membership: 'Basic', creditCard: '**** 7821', renewalDate: '2025-02-28', joinDate: '2024-06-20', favoriteClass: 'Hatha Yoga' },
    { id: 3, username: 'mike_chen', email: 'mike.chen@email.com', role: 'member', membership: 'Premium', creditCard: '**** 3345', renewalDate: '2025-04-10', joinDate: '2023-09-08', favoriteClass: 'Power Yoga' },
    { id: 4, username: 'instructor_jane', email: 'jane.williams@zenflow.yoga', role: 'instructor', membership: 'Staff', creditCard: '**** 9012', accessLevel: 'full', specialization: 'Vinyasa & Meditation', yearsTeaching: 8 }
];

const CURRENT_USER_ID = 2; // Sarah is the current logged-in member

// Home page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>ZenFlow Yoga - Member Portal</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background: linear-gradient(135deg, #e8f5e9 0%, #c5e1a5 100%);
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
                    background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
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
                    color: #2e7d32;
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
                    border-left: 4px solid #66bb6a;
                }
                .card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
                }
                .card h3 {
                    color: #2e7d32;
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
                    color: #2e7d32;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🧘 ZenFlow Yoga</div>
                    <div class="user-info">
                        Logged in as: <strong>sarah_m</strong> (Member #${CURRENT_USER_ID})
                    </div>
                </div>

                <div class="welcome-section">
                    <h1>Welcome to Your Member Portal, Sarah! 🌸</h1>
                    <p>Namaste! Access your membership details, connect with our community, view upcoming classes, and manage your account—all in one place.</p>
                </div>

                <div class="nav-cards">
                    <a href="/example" class="card">
                        <h3>📚 Getting Started Guide</h3>
                        <p>New to our portal? Learn how to make the most of your membership, book classes, and update your preferences.</p>
                        <span class="card-badge badge-tutorial">Help Center</span>
                    </a>

                    <a href="/lab1" class="card">
                        <h3>👥 Community Directory</h3>
                        <p>Connect with fellow members and instructors in our vibrant yoga community.</p>
                        <span class="card-badge badge-easy">Community</span>
                    </a>

                    <a href="/lab2" class="card">
                        <h3>👤 My Profile</h3>
                        <p>View and manage your membership details, payment information, and personal preferences.</p>
                        <span class="card-badge badge-medium">Account</span>
                    </a>

                    <a href="/lab3" class="card">
                        <h3>📅 Instructor Dashboard</h3>
                        <p>Instructor-only area for managing class schedules, viewing bookings, and accessing teaching resources.</p>
                        <span class="card-badge badge-hard">Staff Access</span>
                    </a>
                </div>

                <div class="footer">
                    <p>🧘 ZenFlow Yoga Studio • 123 Peaceful Lane, Downtown • (555) 123-4567</p>
                    <p style="margin-top: 10px; font-size: 0.9em;">
                        <a href="/about">About Us</a> | 
                        <a href="/contact">Contact</a> | 
                        <a href="/classes">Class Schedule</a> | 
                        <a href="/membership">Membership Plans</a>
                    </p>
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
            <title>Getting Started - ZenFlow Yoga</title>
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
            <title>Community Directory - ZenFlow Yoga</title>
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
                    <h1>👥 Community Directory</h1>
                    <p class="subtitle">Connect with fellow yoga enthusiasts and instructors</p>
                </div>

                <div class="info-section">
                    <h2>Welcome to Our Community</h2>
                    <p>The ZenFlow Community Directory helps you connect with other members who share your passion for yoga. Browse member profiles, find practice partners, and get to know our instructors.</p>
                    
                    <div class="search-box">
                        <strong>🔍 Search for Members</strong>
                        <input type="number" class="search-input" placeholder="Enter member ID (e.g., 1, 2, 3, 4...)" id="searchInput" value="1">
                        <button onclick="searchMember()" class="search-button">Search Member</button>
                        <p style="margin-top: 10px; font-size: 0.9em; color: #666;">
                            Try searching by member ID to view their public profile. Use your browser's DevTools (F12 → Network tab) to see the API calls!
                        </p>
                    </div>

                    <div class="tip-box">
                        <strong>💡 Challenge Tip:</strong> Try different member IDs! What information can you discover about other members? Is there anyone with special privileges?
                    </div>
                </div>

                <div id="resultsContainer" class="results-container"></div>

                <div class="back-link">
                    <a href="/">← Back to Member Portal</a>
                </div>
            </div>
            
            <script>
                async function searchMember() {
                    const id = document.getElementById('searchInput').value.trim();
                    const resultsContainer = document.getElementById('resultsContainer');
                    
                    if (!id) {
                        resultsContainer.innerHTML = '<div class="error-box">Please enter a member ID</div>';
                        return;
                    }
                    
                    resultsContainer.innerHTML = '<div class="info-section"><p>🔍 Searching member database...</p></div>';
                    
                    try {
                        const response = await fetch('/api/members/user/' + id);
                        const data = await response.json();
                        
                        if (response.status === 404) {
                            resultsContainer.innerHTML = '<div class="error-box">' + 
                                '<strong>Member Not Found</strong><br>' + 
                                data.message + 
                                '</div>';
                            return;
                        }
                        
                        let html = '<div class="info-section"><h2>Member Profile</h2>';
                        
                        html += '<div class="member-card">';
                        html += '<div class="member-name">' + data.username + '</div>';
                        html += '<div class="member-info">';
                        html += '👤 <strong>ID:</strong> ' + data.id + '<br>';
                        html += '📧 <strong>Email:</strong> ' + data.email + '<br>';
                        html += '🎭 <strong>Role:</strong> ' + data.role + '<br>';
                        html += '🎫 <strong>Membership:</strong> ' + data.membership + '<br>';
                        
                        if (data.joinDate) {
                            html += '📅 <strong>Joined:</strong> ' + data.joinDate + '<br>';
                        }
                        if (data.favoriteClass) {
                            html += '💫 <strong>Favorite Class:</strong> ' + data.favoriteClass + '<br>';
                        }
                        if (data.specialization) {
                            html += '🧘 <strong>Specialization:</strong> ' + data.specialization + '<br>';
                        }
                        if (data.yearsTeaching) {
                            html += '📚 <strong>Years Teaching:</strong> ' + data.yearsTeaching + '<br>';
                        }
                        
                        html += '</div></div>';
                        
                        if (data.flag) {
                            html += '<div class="flag-reveal">🎉 ' + data.flag + '<br><br>' + data.message + '</div>';
                            if (data.stats) {
                                html += '<div class="tip-box">';
                                html += '<strong>📊 Community Stats:</strong><br>';
                                html += 'Total Members: ' + data.stats.totalMembers + '<br>';
                                html += 'Regular Members: ' + data.stats.members + '<br>';
                                html += 'Instructors: ' + data.stats.instructors;
                                html += '</div>';
                            }
                        }
                        
                        html += '</div>';
                        resultsContainer.innerHTML = html;
                        
                    } catch (error) {
                        resultsContainer.innerHTML = '<div class="error-box"><strong>Error:</strong> ' + error.message + '</div>';
                    }
                }

                // Allow Enter key to trigger search
                document.getElementById('searchInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        searchMember();
                    }
                });
            </script>
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
            flag: 'FLAG{C0MMUN1TY_3NUM3R4T10N_C0MPL3T3}',
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
            <title>My Profile - ZenFlow Yoga</title>
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
                    <p class="subtitle">Manage your membership and personal information</p>
                </div>

                <div class="profile-section">
                    <h2>📋 Current Session</h2>
                    <div class="info-box">
                        <p>You are currently logged in as <strong>sarah_m</strong> (Member #${CURRENT_USER_ID})</p>
                        <p style="margin-top: 10px; font-size: 0.9em;">Your profile data is loaded from the API. Use DevTools (F12 → Network tab) to see the API requests!</p>
                    </div>

                    <div class="load-profile-section">
                        <strong>🔍 Load Profile Data</strong>
                        <p style="margin-top: 10px; font-size: 0.9em;">Enter a member ID to view their profile information:</p>
                        <input type="number" id="profileId" class="profile-input" placeholder="Enter member ID (e.g., 1, 2, 3, 4...)" value="${CURRENT_USER_ID}">
                        <button onclick="loadProfile()" class="btn">Load Profile</button>
                    </div>

                    <div class="tip-box">
                        <strong>💡 Challenge Tip:</strong> The URL parameter determines which profile to load. What happens if you change it? Can you access other members' private data?
                    </div>
                </div>

                <div id="profileData"></div>

                <div class="back-link">
                    <a href="/">← Back to Member Portal</a>
                </div>
            </div>
            
            <script>
                // Load profile on page load
                window.addEventListener('DOMContentLoaded', function() {
                    loadProfile();
                });

                async function loadProfile() {
                    const profileId = document.getElementById('profileId').value || ${CURRENT_USER_ID};
                    const profileContainer = document.getElementById('profileData');
                    
                    profileContainer.innerHTML = '<div class="profile-section"><p>🔍 Loading profile data...</p></div>';
                    
                    try {
                        const response = await fetch('/api/profile/user/' + profileId);
                        const data = await response.json();
                        
                        if (response.status !== 200) {
                            profileContainer.innerHTML = '<div class="profile-section" style="border-left-color: #d32f2f;"><p style="color: #d32f2f;">❌ ' + data.message + '</p></div>';
                            return;
                        }
                        
                        let html = '';
                        
                        // Flag reveal if present
                        if (data.flag) {
                            html += '<div class="flag-reveal">🎉 ' + data.flag;
                            if (data._vuln_note) {
                                html += '<br><br><small>' + data._vuln_note + '</small>';
                            }
                            html += '</div>';
                        }
                        
                        // Account Information
                        html += '<div class="profile-section">';
                        html += '<h2>📋 Account Information</h2>';
                        html += '<div class="profile-field"><div class="field-label">Member ID:</div><div class="field-value">#' + data.id + '</div></div>';
                        html += '<div class="profile-field"><div class="field-label">Username:</div><div class="field-value">' + data.username + '</div></div>';
                        html += '<div class="profile-field"><div class="field-label">Email:</div><div class="field-value">' + data.email + '</div></div>';
                        html += '<div class="profile-field"><div class="field-label">Role:</div><div class="field-value">' + data.role + '</div></div>';
                        
                        if (data.joinDate) {
                            html += '<div class="profile-field"><div class="field-label">Member Since:</div><div class="field-value">' + data.joinDate + '</div></div>';
                        }
                        html += '</div>';
                        
                        // Membership Details
                        html += '<div class="profile-section">';
                        html += '<h2>🎫 Membership Details</h2>';
                        html += '<div class="profile-field"><div class="field-label">Plan:</div><div class="field-value">' + data.membership + '</div></div>';
                        html += '<div class="profile-field"><div class="field-label">Renewal Date:</div><div class="field-value">' + data.renewalDate + '</div></div>';
                        
                        if (data.favoriteClass) {
                            html += '<div class="profile-field"><div class="field-label">Favorite Class:</div><div class="field-value">' + data.favoriteClass + '</div></div>';
                        }
                        if (data.specialization) {
                            html += '<div class="profile-field"><div class="field-label">Specialization:</div><div class="field-value">' + data.specialization + '</div></div>';
                        }
                        if (data.yearsTeaching) {
                            html += '<div class="profile-field"><div class="field-label">Years Teaching:</div><div class="field-value">' + data.yearsTeaching + '</div></div>';
                        }
                        
                        html += '<button class="btn">Upgrade to Premium</button>';
                        html += '</div>';
                        
                        // Payment Information
                        html += '<div class="profile-section">';
                        html += '<h2>💳 Payment Information</h2>';
                        html += '<div class="profile-field"><div class="field-label">Payment Method:</div><div class="field-value">Credit Card ending in ' + data.creditCard.slice(-4) + '</div></div>';
                        html += '<div class="profile-field"><div class="field-label">Billing Status:</div><div class="field-value">✅ Active</div></div>';
                        html += '</div>';
                        
                        profileContainer.innerHTML = html;
                        
                    } catch (error) {
                        profileContainer.innerHTML = '<div class="profile-section" style="border-left-color: #d32f2f;"><p style="color: #d32f2f;">❌ Error: ' + error.message + '</p></div>';
                    }
                }
            </script>
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
        profileData.flag = 'FLAG{1D0R_PR0F1L3_4CC3SS_V1OL4T10N}';
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
            <title>Instructor Dashboard - ZenFlow Yoga</title>
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
                    <h1>📅 Instructor Dashboard</h1>
                    <p class="subtitle">Manage classes, bookings, and teaching resources</p>
                </div>

                ${!isInstructor ? `
                <div class="alert-box">
                    <h2>🔒 Staff Access Required</h2>
                    <p>You are currently logged in as <strong>sarah_m</strong> (Basic Member).</p>
                    <p style="margin-top: 10px;">This area is restricted to ZenFlow instructors and staff members only. If you believe you should have access, please contact our admin team at staff@zenflow.yoga.</p>
                </div>

                <div class="info-section">
                    <h2>About the Instructor Dashboard</h2>
                    <p>Our Instructor Dashboard provides teaching staff with tools to manage their classes and connect with students:</p>
                    
                    <ul class="feature-list">
                        <li><strong>Class Scheduling:</strong> Create and manage your class schedule</li>
                        <li><strong>Student Roster:</strong> View registered students for each class</li>
                        <li><strong>Booking Management:</strong> Handle class cancellations and waitlists</li>
                        <li><strong>Teaching Resources:</strong> Access lesson plans and studio guidelines</li>
                        <li><strong>Performance Analytics:</strong> Track class attendance and student feedback</li>
                    </ul>
                </div>

                <div class="tip-box">
                    <strong>💡 Challenge Tip:</strong> The application uses cookies to track your role. Open DevTools (F12 → Application/Storage → Cookies) to inspect the authentication cookies. Can you modify them to gain access?
                </div>

                <div class="cookie-info">
                    <strong>🍪 Current Cookies:</strong><br>
                    userRole=${userRole}<br>
                    userId=${userId}
                </div>
                ` : `
                <div class="success-box">
                    <h2>✅ Welcome to the Instructor Dashboard!</h2>
                    <p>Access granted. You are now viewing the instructor-only area.</p>
                </div>

                <div class="flag-reveal">
                    🎉 FLAG{PR1V1L3G3_3SC4L4T10N_C00K13_M4N1PUL4T10N} 🎉
                    <br><br>
                    <div style="font-size: 0.7em; font-weight: normal; margin-top: 15px;">
                        Congratulations! You successfully escalated your privileges by modifying the authentication cookie!
                    </div>
                </div>

                <div class="info-section">
                    <h2>📊 Your Teaching Dashboard</h2>
                    
                    <div class="dashboard-card">
                        <h3>📅 Upcoming Classes</h3>
                        <div class="class-item">
                            <strong>Monday, Jan 20 - 9:00 AM</strong><br>
                            Vinyasa Flow • 12 students enrolled • Studio A
                        </div>
                        <div class="class-item">
                            <strong>Wednesday, Jan 22 - 6:00 PM</strong><br>
                            Meditation Session • 8 students enrolled • Zen Room
                        </div>
                        <div class="class-item">
                            <strong>Saturday, Jan 25 - 10:00 AM</strong><br>
                            Power Yoga • 15 students enrolled • Studio B
                        </div>
                    </div>

                    <div class="dashboard-card">
                        <h3>📈 Performance Metrics</h3>
                        <p><strong>Total Students:</strong> 45 active students</p>
                        <p><strong>Average Attendance:</strong> 87%</p>
                        <p><strong>Student Rating:</strong> 4.8/5.0 ⭐</p>
                        <p><strong>Classes This Month:</strong> 24</p>
                    </div>

                    <div class="dashboard-card">
                        <h3>📚 Teaching Resources</h3>
                        <ul class="feature-list">
                            <li>Lesson Plans Library</li>
                            <li>Studio Guidelines & Policies</li>
                            <li>Attendance Reports</li>
                            <li>Student Feedback Forms</li>
                            <li>Professional Development Materials</li>
                        </ul>
                    </div>
                </div>

                <div class="tip-box">
                    <strong>🎓 What You Learned:</strong> By modifying the cookie, you bypassed the application's access control. This demonstrates why authentication must be validated server-side, not just by checking cookies. Cookies can be easily manipulated by attackers!
                </div>
                `}

                <div class="info-section">
                    <h2>🎓 Becoming an Instructor</h2>
                    <p>Interested in teaching at ZenFlow? We're always looking for passionate, certified yoga instructors to join our team.</p>
                    <p style="margin-top: 15px;"><strong>Requirements:</strong></p>
                    <ul class="feature-list">
                        <li>200-hour (minimum) yoga teacher certification</li>
                        <li>Liability insurance</li>
                        <li>CPR/First Aid certification</li>
                        <li>Experience teaching group classes</li>
                    </ul>
                    <p style="margin-top: 15px;">Contact <strong>careers@zenflow.yoga</strong> for more information about joining our teaching staff.</p>
                </div>

                <div class="back-link">
                    <a href="/">← Back to Member Portal</a>
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
            message: 'This area is restricted to ZenFlow instructors only.',
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
        dashboardData.flag = 'FLAG{PR1V1L3G3_3SC4L4T10N_1NSTRUCT0R}';
        dashboardData._vuln_note = 'Privilege escalation detected: Regular member accessed instructor dashboard!';
    }
    
    return res.json(dashboardData);
});

// ============================================================================
// EXAMPLE API ENDPOINTS - For Instructor Demonstrations
// ============================================================================

// Example member profiles database for demonstrations
const exampleMembers = [
    { id: 100, name: 'Alex Rivera', email: 'alex.r@email.com', membershipType: 'Premium', favoriteClass: 'Vinyasa Flow', joinedDate: '2023-05-12' },
    { id: 101, name: 'Jordan Lee', email: 'jordan.l@email.com', membershipType: 'Basic', favoriteClass: 'Hatha Yoga', joinedDate: '2024-01-08' },
    { id: 102, name: 'Taylor Brooks', email: 'taylor.b@email.com', membershipType: 'Premium', favoriteClass: 'Power Yoga', joinedDate: '2023-11-20' },
    { id: 103, name: 'Morgan Chen', email: 'morgan.c@email.com', membershipType: 'Basic', favoriteClass: 'Yin Yoga', joinedDate: '2024-03-15' },
    { id: 104, name: 'Casey Wong', email: 'casey.w@email.com', membershipType: 'Premium', favoriteClass: 'Ashtanga', joinedDate: '2023-08-30' },
    { id: 105, name: 'Riley Martinez', email: 'riley.m@email.com', membershipType: 'Family', favoriteClass: 'Restorative Yoga', joinedDate: '2024-02-18' },
    { id: 108, name: 'Jamie Thompson', email: 'jamie.t@zenflow.yoga', membershipType: 'Staff', role: 'hidden_member', favoriteClass: 'Kundalini', joinedDate: '2022-01-05', specialNote: 'VIP Founding Member' }
];

// Track enumeration progress for Part 4
// Note: Global state is intentional for this demo - it tracks progress across all requests
// to simulate real-world enumeration where the attacker makes multiple sequential requests
const enumerationProgress = new Set();

// Example Part 1 - DevTools Demo: Browse member profiles by ID
app.get('/api/example/part1/member/:id', (req, res) => {
    const memberId = parseInt(req.params.id);
    const member = exampleMembers.find(m => m.id === memberId);
    
    if (!member) {
        return res.status(404).json({
            error: 'Member not found',
            message: 'No member profile exists with this ID.',
            hint: 'Try IDs between 100-110'
        });
    }
    
    // Flag appears when accessing the hidden member (ID 108)
    if (memberId === 108) {
        return res.json({
            success: true,
            member: member,
            flag: 'FLAG{D3VT00LS_M3MB3R_D1SC0V3RY}',
            message: '🎉 Congratulations! You discovered the hidden VIP member profile!',
            tutorial: 'You successfully used browser DevTools to enumerate member IDs and find hidden resources.'
        });
    }
    
    // Regular member profile
    res.json({
        success: true,
        member: {
            id: member.id,
            name: member.name,
            email: member.email,
            membershipType: member.membershipType,
            favoriteClass: member.favoriteClass,
            joinedDate: member.joinedDate
        }
    });
});

// Example Part 2 - cURL Demo: API that checks User-Agent
app.get('/api/example/part2/test', (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    
    // Check if request came from cURL
    if (userAgent.toLowerCase().includes('curl')) {
        return res.json({
            success: true,
            flag: 'FLAG{CURL_C0MM4ND_L1N3_M4ST3R}',
            message: '🎉 Success! You accessed the API using cURL!',
            tutorial: 'You learned how command-line tools can interact with web APIs in ways the browser cannot.',
            requestInfo: {
                userAgent: userAgent,
                method: req.method,
                timestamp: new Date().toISOString()
            }
        });
    }
    
    // Default response for browser requests
    res.json({
        success: false,
        message: 'This endpoint requires cURL access.',
        hint: 'Try accessing this endpoint using the cURL command-line tool instead of your browser.',
        yourUserAgent: userAgent,
        expectedUserAgent: 'curl/*'
    });
});

// Example Part 3 - Intercept Demo: Access level parameter manipulation
app.get('/api/example/part3/intercept', (req, res) => {
    const accessLevel = req.query.access || 'member';
    
    // Vulnerable: trusts client-provided access level parameter
    if (accessLevel === 'instructor') {
        return res.json({
            success: true,
            accessLevel: 'instructor',
            flag: 'FLAG{1NT3RC3PT_P4R4M_M4N1PUL4T10N}',
            message: '🎉 Access granted! You manipulated the access parameter to gain instructor privileges!',
            tutorial: 'You learned how to intercept and modify HTTP requests to change application behavior.',
            instructorData: {
                upcomingClasses: [
                    { date: '2025-01-20', time: '9:00 AM', class: 'Vinyasa Flow', enrolled: 12, capacity: 15 },
                    { date: '2025-01-22', time: '6:00 PM', class: 'Meditation Session', enrolled: 8, capacity: 20 },
                    { date: '2025-01-25', time: '10:00 AM', class: 'Power Yoga', enrolled: 15, capacity: 15 }
                ],
                teachingResources: {
                    lessonPlans: 'https://zenflow.yoga/instructor/lessons',
                    studentRoster: 'https://zenflow.yoga/instructor/roster',
                    salaryInfo: '$45/hour base rate + bonuses'
                }
            }
        });
    }
    
    // Member-level access (default)
    res.json({
        success: true,
        accessLevel: 'member',
        message: 'Member portal access',
        memberData: {
            upcomingClasses: [
                { date: '2025-01-20', time: '9:00 AM', class: 'Vinyasa Flow', spotsLeft: 3 },
                { date: '2025-01-22', time: '6:00 PM', class: 'Meditation Session', spotsLeft: 12 },
                { date: '2025-01-25', time: '10:00 AM', class: 'Power Yoga', spotsLeft: 0 }
            ]
        },
        hint: 'Standard member access. Notice the URL parameters...'
    });
});

// Example Part 4 - Enumeration Demo: Find all active members
app.get('/api/example/part4/enumerate/:id', (req, res) => {
    const memberId = parseInt(req.params.id);
    const member = exampleMembers.find(m => m.id === memberId && m.id >= 100 && m.id <= 105);
    
    if (!member) {
        return res.status(404).json({
            error: 'Member not found',
            message: 'No active member found with this ID.',
            hint: 'Active members have IDs in the range 100-105'
        });
    }
    
    // Track enumeration progress
    enumerationProgress.add(memberId);
    
    // Check if all active members (100-105) have been enumerated
    const allActiveMembers = [100, 101, 102, 103, 104, 105];
    const allFound = allActiveMembers.every(id => enumerationProgress.has(id));
    
    if (allFound) {
        return res.json({
            success: true,
            member: member,
            flag: 'FLAG{3NUM3R4T10N_C0MPL3T3_4LL_M3MB3RS}',
            message: '🎉 Congratulations! You successfully enumerated all active members!',
            tutorial: 'You learned how sequential ID enumeration can expose all records in a system.',
            stats: {
                totalMembersFound: enumerationProgress.size,
                activeMembers: allActiveMembers.length,
                memberList: allActiveMembers.map(id => {
                    const m = exampleMembers.find(member => member.id === id);
                    return { id: m.id, name: m.name, email: m.email };
                })
            }
        });
    }
    
    // Normal response - show progress
    res.json({
        success: true,
        member: {
            id: member.id,
            name: member.name,
            email: member.email,
            membershipType: member.membershipType,
            favoriteClass: member.favoriteClass
        },
        progress: {
            found: enumerationProgress.size,
            total: allActiveMembers.length,
            remaining: allActiveMembers.length - enumerationProgress.size,
            hint: 'Keep enumerating to find all active members (IDs 100-105)'
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\x1b[32m
╔════════════════════════════════════════════╗
║   🧘 ZenFlow Yoga - Member Portal         ║
║   Server running on port ${PORT}           ║
║                                            ║
║   Access the portal:                      ║
║   http://localhost:${PORT}                    ║
╚════════════════════════════════════════════╝
\x1b[0m`);
});
