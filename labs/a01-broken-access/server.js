const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Users database
const users = [
    { id: 1, username: 'alice', email: 'alice@company.com', role: 'user', ssn: '123-45-6789' },
    { id: 2, username: 'bob', email: 'bob@company.com', role: 'user', ssn: '987-65-4321' },
    { id: 3, username: 'charlie', email: 'charlie@company.com', role: 'user', ssn: '555-12-3456' },
    { id: 4, username: 'admin', email: 'admin@company.com', role: 'admin', ssn: '000-00-0000' }
];

const CURRENT_USER_ID = 2; // Bob is the current logged-in user

// Home page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>A01: Broken Access Control</title>
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
                .info {
                    background-color: #0a0a0a;
                    border-left: 4px solid #00ff00;
                    padding: 15px;
                    margin: 20px 0;
                }
                code {
                    background-color: #000;
                    padding: 2px 6px;
                    border-radius: 3px;
                    color: #00ffff;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>⚠️ A01: BROKEN ACCESS CONTROL ⚠️</h1>
                
                <div class="info">
                    <strong>⚡ SYSTEM STATUS:</strong> You are logged in as <strong>Bob</strong> (User ID: ${CURRENT_USER_ID})<br>
                    <strong>🎯 OBJECTIVE:</strong> Explore access control vulnerabilities and capture the flags<br>
                    <strong>🛠️ TOOLS:</strong> Use curl, Postman, Burp Suite, or Browser DevTools
                </div>

                <div class="challenge">
                    <h3>📚 Example - Tools Walkthrough <span class="difficulty example">TUTORIAL</span></h3>
                    <p>Comprehensive hands-on tutorial teaching Browser DevTools, cURL, Burp Suite, and ID Enumeration. Complete 4 interactive challenges to master all the tools you'll need for the labs.</p>
                    <p><strong>⚠️ START HERE</strong> if you're new to web security testing!</p>
                    <p><a href="/example">→ Start Tutorial</a></p>
                </div>

                <div class="challenge">
                    <h3>🔍 Lab 1 - User Enumeration <span class="difficulty easy">EASY</span></h3>
                    <p><strong>Stage:</strong> Recon</p>
                    <p><strong>Description:</strong> The system has multiple users. Can you discover them all? Your current user ID is ${CURRENT_USER_ID}.</p>
                    <p><strong>Hint:</strong> Try different user IDs in the API endpoint</p>
                    <p><strong>Flag:</strong> Capture the flag when you discover all users</p>
                    <p><a href="/lab1">→ Start Lab 1</a></p>
                </div>

                <div class="challenge">
                    <h3>🎭 Lab 2 - Profile Access <span class="difficulty medium">MEDIUM</span></h3>
                    <p><strong>Stage:</strong> Initial Access</p>
                    <p><strong>Description:</strong> Users have profile pages with sensitive information. Can you access someone else's profile data?</p>
                    <p><strong>Hint:</strong> The API validates you're logged in, but does it check whose profile you're accessing?</p>
                    <p><strong>Flag:</strong> Capture the flag when you view another user's private data</p>
                    <p><a href="/lab2">→ Start Lab 2</a></p>
                </div>

                <div class="challenge">
                    <h3>👑 Lab 3 - Privilege Escalation <span class="difficulty hard">HARD</span></h3>
                    <p><strong>Stage:</strong> Maintained Access</p>
                    <p><strong>Description:</strong> Only administrators should access the admin panel. Can you escalate your privileges?</p>
                    <p><strong>Hint:</strong> Being logged in as Bob doesn't mean you can't try to access admin resources...</p>
                    <p><strong>Flag:</strong> Capture the flag when you gain admin access</p>
                    <p><a href="/lab3">→ Start Lab 3</a></p>
                </div>

                <div class="info">
                    <strong>⚡ PRO TIP:</strong> Use your browser's DevTools (F12) to inspect network requests, or use command-line tools like curl for more control.
                </div>
            </div>
        </body>
        </html>
    `);
});

// Example page - Comprehensive walkthrough with 4 sub-challenges
app.get('/example', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Example - Tools Walkthrough</title>
            <style>
                body {
                    background-color: #1a1a1a;
                    color: #00ff00;
                    font-family: 'Courier New', monospace;
                    padding: 20px;
                    line-height: 1.6;
                }
                .container {
                    max-width: 1200px;
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
                    border-bottom: 2px solid #00ff00;
                    padding-bottom: 5px;
                }
                h3 {
                    color: #00ffff;
                    margin-top: 20px;
                }
                .part {
                    background-color: #0a0a0a;
                    border: 3px solid #00ff00;
                    padding: 25px;
                    margin: 30px 0;
                    border-radius: 5px;
                    box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
                }
                .part h2 {
                    margin-top: 0;
                    color: #00ff00;
                    font-size: 1.8em;
                }
                pre {
                    background-color: #000;
                    padding: 15px;
                    border-radius: 5px;
                    overflow-x: auto;
                    border-left: 4px solid #00ff00;
                }
                code {
                    color: #00ffff;
                }
                .endpoint {
                    background-color: #000;
                    padding: 15px;
                    border-radius: 5px;
                    border-left: 4px solid #ffaa00;
                    margin: 15px 0;
                    font-family: monospace;
                }
                .hint {
                    background-color: #1a1a00;
                    border-left: 4px solid #ffaa00;
                    padding: 15px;
                    margin: 15px 0;
                }
                .flag {
                    background-color: #001a00;
                    border-left: 4px solid #00ff00;
                    padding: 15px;
                    margin: 15px 0;
                    font-weight: bold;
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
                .intro {
                    background-color: #0a0a0a;
                    border: 2px solid #00ffff;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 5px;
                }
                ul {
                    line-height: 1.8;
                }
                .step {
                    margin: 10px 0;
                    padding-left: 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎓 COMPREHENSIVE TOOLS WALKTHROUGH</h1>
                
                <div class="intro">
                    <h2>Welcome to the Example Tutorial</h2>
                    <p>This walkthrough teaches you ALL the tools and techniques needed for the 3 labs ahead. Complete all 4 parts to master:</p>
                    <ul>
                        <li><strong>Browser DevTools</strong> - Inspecting network requests</li>
                        <li><strong>cURL</strong> - Command-line HTTP requests</li>
                        <li><strong>Burp Suite</strong> - Intercepting and modifying requests</li>
                        <li><strong>ID Enumeration</strong> - Systematic discovery of resources</li>
                    </ul>
                    <p>⚠️ <strong>Important:</strong> You must use the actual tools - no buttons will do the work for you!</p>
                </div>

                <!-- PART 1: Browser DevTools -->
                <div class="part">
                    <h2>🔍 Part 1: Browser DevTools</h2>
                    
                    <h3>What You'll Learn</h3>
                    <p>Browser DevTools (F12) is your first line of investigation. The Network tab shows all HTTP requests your browser makes, revealing API endpoints, parameters, and responses.</p>
                    
                    <h3>How to Use DevTools</h3>
                    <div class="step">
                        <strong>Step 1:</strong> Press <code>F12</code> (or right-click → Inspect) to open DevTools<br>
                        <strong>Step 2:</strong> Click the <strong>Network</strong> tab<br>
                        <strong>Step 3:</strong> Refresh the page or trigger an action to see requests<br>
                        <strong>Step 4:</strong> Click on a request to view details (Headers, Response, etc.)
                    </div>
                    
                    <h3>Your Challenge</h3>
                    <p>Use DevTools to inspect the API endpoint below and retrieve user data.</p>
                    
                    <div class="endpoint">
                        <strong>API Endpoint:</strong><br>
                        <code>GET http://localhost:3001/api/example/part1/user/:id</code>
                    </div>
                    
                    <h3>Instructions</h3>
                    <div class="step">
                        1. Open DevTools (F12) and go to the <strong>Network</strong> tab<br>
                        2. In the <strong>Console</strong> tab, paste this command:<br>
                        <pre><code>fetch('http://localhost:3001/api/example/part1/user/1')
    .then(r => r.json())
    .then(data => console.log(data));</code></pre>
                        3. Press Enter and check the response<br>
                        4. Look in the <strong>Network</strong> tab - you'll see the request appear<br>
                        5. Click on it to inspect headers, response, timing, etc.<br>
                        6. Try changing the user ID to <code>42</code> to get the flag
                    </div>
                    
                    <div class="hint">
                        💡 <strong>Hint:</strong> The flag is hidden at user ID 42. Modify the fetch URL to access it.
                    </div>
                    
                    <div class="flag">
                        🎯 <strong>Flag:</strong> <code>NSA{D3VT00LS_M4ST3R}</code>
                    </div>
                </div>

                <!-- PART 2: Using cURL -->
                <div class="part">
                    <h2>💻 Part 2: Using cURL</h2>
                    
                    <h3>What You'll Learn</h3>
                    <p>cURL is a command-line tool for making HTTP requests. It's more powerful than browser tools and essential for automation and testing.</p>
                    
                    <h3>Basic cURL Syntax</h3>
                    <pre><code># Basic GET request
curl http://localhost:3001/api/endpoint

# GET with custom header
curl -H "X-Custom-Header: value" http://localhost:3001/api/endpoint

# View response headers
curl -i http://localhost:3001/api/endpoint

# Follow redirects
curl -L http://localhost:3001/api/endpoint

# Save response to file
curl http://localhost:3001/api/endpoint -o output.json</code></pre>
                    
                    <h3>Your Challenge</h3>
                    <p>The API endpoint below returns data, but only responds with the flag when accessed via cURL (checks User-Agent header).</p>
                    
                    <div class="endpoint">
                        <strong>API Endpoint:</strong><br>
                        <code>GET http://localhost:3001/api/example/part2/test</code>
                    </div>
                    
                    <h3>Instructions</h3>
                    <div class="step">
                        1. Open a terminal/command prompt<br>
                        2. Run this cURL command:<br>
                        <pre><code>curl http://localhost:3001/api/example/part2/test</code></pre>
                        3. The endpoint detects you're using cURL and returns the flag<br>
                        4. Try it in a browser - you'll get a different response!
                    </div>
                    
                    <div class="hint">
                        💡 <strong>Hint:</strong> The server checks the User-Agent header. cURL identifies itself differently than browsers.
                    </div>
                    
                    <div class="flag">
                        🎯 <strong>Flag:</strong> <code>NSA{CURL_C0MM4ND3R}</code>
                    </div>
                </div>

                <!-- PART 3: Burp Suite -->
                <div class="part">
                    <h2>🔥 Part 3: Burp Suite</h2>
                    
                    <h3>What You'll Learn</h3>
                    <p>Burp Suite is an intercepting proxy that sits between your browser and the server. You can capture, inspect, and modify requests before they're sent.</p>
                    
                    <h3>Setting Up Burp Suite</h3>
                    <div class="step">
                        <strong>Step 1:</strong> Download and install Burp Suite Community Edition<br>
                        <strong>Step 2:</strong> Start Burp and go to the <strong>Proxy</strong> tab<br>
                        <strong>Step 3:</strong> Configure your browser to use proxy 127.0.0.1:8080<br>
                        <strong>Step 4:</strong> In Burp, turn <strong>Intercept On</strong><br>
                        <strong>Step 5:</strong> Browse to a page - Burp will capture the request<br>
                        <strong>Step 6:</strong> Modify the request and click <strong>Forward</strong>
                    </div>
                    
                    <h3>Using Burp Repeater</h3>
                    <p>Right-click any request → <strong>Send to Repeater</strong> → Modify and resend multiple times</p>
                    
                    <h3>Your Challenge</h3>
                    <p>The API endpoint below only returns the flag when you modify a specific parameter in the request.</p>
                    
                    <div class="endpoint">
                        <strong>API Endpoint:</strong><br>
                        <code>GET http://localhost:3001/api/example/part3/intercept?access=user</code>
                    </div>
                    
                    <h3>Instructions</h3>
                    <div class="step">
                        <strong>Option A - Using Burp Suite:</strong><br>
                        1. Set up Burp proxy as described above<br>
                        2. Visit the URL in your browser<br>
                        3. Intercept the request in Burp<br>
                        4. Change the parameter from <code>access=user</code> to <code>access=admin</code><br>
                        5. Forward the modified request<br><br>
                        
                        <strong>Option B - Using cURL (simpler):</strong><br>
                        <pre><code>curl "http://localhost:3001/api/example/part3/intercept?access=admin"</code></pre>
                    </div>
                    
                    <div class="hint">
                        💡 <strong>Hint:</strong> Change the access parameter from "user" to "admin" to get elevated privileges and retrieve the flag.
                    </div>
                    
                    <div class="flag">
                        🎯 <strong>Flag:</strong> <code>NSA{BURP_1NT3RC3PT0R}</code>
                    </div>
                </div>

                <!-- PART 4: ID Enumeration -->
                <div class="part">
                    <h2>🔢 Part 4: ID Enumeration</h2>
                    
                    <h3>What You'll Learn</h3>
                    <p>ID Enumeration is the systematic process of testing sequential IDs to discover hidden resources. Many APIs use predictable numeric IDs, allowing you to map out all resources.</p>
                    
                    <h3>Enumeration Techniques</h3>
                    <pre><code># Test sequential IDs
curl http://localhost:3001/api/resource/1
curl http://localhost:3001/api/resource/2
curl http://localhost:3001/api/resource/3

# Or use a loop (bash)
for i in {1..10}; do
    curl http://localhost:3001/api/resource/$i
done

# With error handling
for i in {1..10}; do
    echo "Testing ID: $i"
    curl -s http://localhost:3001/api/resource/$i | grep -q "error" || echo "Found: $i"
done</code></pre>
                    
                    <h3>Your Challenge</h3>
                    <p>The API has data for user IDs 1-5. Discover all 5 users to receive the flag.</p>
                    
                    <div class="endpoint">
                        <strong>API Endpoint:</strong><br>
                        <code>GET http://localhost:3001/api/example/part4/enumerate/:id</code>
                    </div>
                    
                    <h3>Instructions</h3>
                    <div class="step">
                        <strong>Method 1 - Manual Testing:</strong><br>
                        <pre><code>curl http://localhost:3001/api/example/part4/enumerate/1
curl http://localhost:3001/api/example/part4/enumerate/2
curl http://localhost:3001/api/example/part4/enumerate/3
curl http://localhost:3001/api/example/part4/enumerate/4
curl http://localhost:3001/api/example/part4/enumerate/5</code></pre>
                        
                        <strong>Method 2 - Using a Loop (Linux/Mac):</strong><br>
                        <pre><code>for i in {1..10}; do curl http://localhost:3001/api/example/part4/enumerate/$i; done</code></pre>
                        
                        <strong>Method 3 - Browser DevTools:</strong><br>
                        Open Console (F12) and run:<br>
                        <pre><code>for(let i=1; i<=10; i++) {
    fetch(\`http://localhost:3001/api/example/part4/enumerate/\${i}\`)
        .then(r => r.json())
        .then(data => console.log(\`ID \${i}:\`, data));
}</code></pre>
                    </div>
                    
                    <div class="hint">
                        💡 <strong>Hint:</strong> Keep track of which IDs return valid data. When you've found all 5 valid users, request ID 5 again to get the flag.
                    </div>
                    
                    <div class="flag">
                        🎯 <strong>Flag:</strong> <code>NSA{3NUM3R4T10N_PR0}</code>
                    </div>
                </div>

                <!-- Conclusion -->
                <div class="intro" style="text-align: center; margin-top: 40px;">
                    <h2>🎉 Tutorial Complete!</h2>
                    <p>You've learned all the essential tools for the labs:</p>
                    <ul style="text-align: left;">
                        <li>✅ Browser DevTools for inspecting network traffic</li>
                        <li>✅ cURL for command-line HTTP requests</li>
                        <li>✅ Burp Suite for intercepting and modifying requests</li>
                        <li>✅ ID Enumeration for systematic resource discovery</li>
                    </ul>
                    <p><strong>Ready to apply these skills?</strong></p>
                    <p><a href="/">← Start the Labs</a></p>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Example API Endpoints

// Part 1: Browser DevTools - User lookup by ID
app.get('/api/example/part1/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    
    if (userId === 42) {
        return res.json({
            id: 42,
            username: 'devtools_master',
            message: 'Congratulations! You used Browser DevTools to inspect network requests.',
            flag: 'NSA{D3VT00LS_M4ST3R}'
        });
    }
    
    // Generic response for other IDs
    return res.json({
        id: userId,
        username: `user${userId}`,
        message: 'This is a regular user. Try ID 42 to get the flag!'
    });
});

// Part 2: cURL - Detects User-Agent
app.get('/api/example/part2/test', (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    
    // Check if request came from cURL
    if (userAgent.toLowerCase().includes('curl')) {
        return res.json({
            message: 'Congratulations! You used cURL to make this request.',
            userAgent: userAgent,
            flag: 'NSA{CURL_C0MM4ND3R}',
            tip: 'cURL is essential for testing APIs from the command line!'
        });
    }
    
    // Browser or other client
    return res.json({
        message: 'This endpoint requires cURL to access.',
        userAgent: userAgent,
        hint: 'Try accessing this endpoint using: curl http://localhost:3001/api/example/part2/test'
    });
});

// Part 3: Burp Suite - Requires modified parameter
app.get('/api/example/part3/intercept', (req, res) => {
    const access = req.query.access;
    
    if (access === 'admin') {
        return res.json({
            message: 'Congratulations! You modified the request parameter.',
            access: 'admin',
            flag: 'NSA{BURP_1NT3RC3PT0R}',
            tip: 'You successfully intercepted and modified the request. This is how attackers bypass client-side restrictions!'
        });
    }
    
    return res.json({
        message: 'Access denied. Regular users cannot access this resource.',
        access: access || 'none',
        hint: 'Try changing the access parameter to "admin" in the URL or using Burp Suite to intercept and modify the request.'
    });
});

// Part 4: ID Enumeration - Track discovered users
const enumerationData = [
    { id: 1, username: 'alice', department: 'Engineering' },
    { id: 2, username: 'bob', department: 'Sales' },
    { id: 3, username: 'charlie', department: 'Marketing' },
    { id: 4, username: 'diana', department: 'HR' },
    { id: 5, username: 'eve', department: 'Security' }
];

app.get('/api/example/part4/enumerate/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = enumerationData.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ 
            error: 'User not found',
            message: `No user exists with ID ${userId}`
        });
    }
    
    // Special response when accessing the last valid user (ID 5)
    if (userId === 5) {
        return res.json({
            id: user.id,
            username: user.username,
            department: user.department,
            message: 'Congratulations! You discovered all 5 users through enumeration.',
            flag: 'NSA{3NUM3R4T10N_PR0}',
            allUsers: enumerationData.map(u => u.username),
            tip: 'Systematic enumeration helps you map out all resources in a system!'
        });
    }
    
    return res.json({
        id: user.id,
        username: user.username,
        department: user.department,
        message: `Found user ${userId}. Keep enumerating to find all users!`
    });
});

// Lab 1 - User Enumeration (Easy)
app.get('/lab1', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lab 1 - User Enumeration</title>
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
                <h1>🔍 LAB 1: USER ENUMERATION <span class="difficulty">EASY</span></h1>
                
                <div class="info-box">
                    <h2>📋 Mission Brief</h2>
                    <p><strong>Stage:</strong> Recon</p>
                    <p><strong>Objective:</strong> Discover all users in the system</p>
                    <p><strong>Current User:</strong> Bob (ID: ${CURRENT_USER_ID})</p>
                    <p><strong>Flag:</strong> Will be revealed when you find all users</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Challenge Description</h2>
                    <p>The application has a user lookup endpoint that returns basic information about users. You know your own user ID is ${CURRENT_USER_ID}.</p>
                    <p>Your task is to enumerate and discover all users in the system. How many users are there? What are their usernames?</p>
                </div>

                <div class="endpoint">
                    <strong>API Endpoint:</strong><br>
                    <code>GET http://localhost:3001/api/lab1/user/:id</code><br><br>
                    <strong>Example:</strong><br>
                    <code>GET http://localhost:3001/api/lab1/user/2</code>
                </div>

                <div class="hint-box">
                    <strong>💡 Hints:</strong>
                    <ul>
                        <li>Try sequential user IDs starting from 1</li>
                        <li>The endpoint returns different responses for existing vs non-existing users</li>
                        <li>Keep track of all users you discover</li>
                        <li>There are exactly 4 users in the system</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
                    <p><strong>Using curl:</strong></p>
                    <pre><code>curl http://localhost:3001/api/lab1/user/1
curl http://localhost:3001/api/lab1/user/2
curl http://localhost:3001/api/lab1/user/3
# ... continue testing</code></pre>
                    
                    <p><strong>Using Browser Console (F12):</strong></p>
                    <pre><code>fetch('http://localhost:3001/api/lab1/user/1')
    .then(r => r.json())
    .then(data => console.log(data));</code></pre>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 1 API - User enumeration endpoint (vulnerable)
app.get('/api/lab1/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    // Vulnerable: Returns user info without authorization
    const foundUsers = users.filter(u => u.id <= userId).length;
    
    if (foundUsers === 4) {
        return res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            flag: 'NSA{F0UND_TH3_US3RS}',
            message: 'Congratulations! You have discovered all users in the system.'
        });
    }
    
    return res.json({
        id: user.id,
        username: user.username,
        email: user.email
    });
});

// Lab 2 - Profile Access (Medium)
app.get('/lab2', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lab 2 - Profile Access</title>
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
                <h1>🎭 LAB 2: PROFILE ACCESS <span class="difficulty">MEDIUM</span></h1>
                
                <div class="info-box">
                    <h2>📋 Mission Brief</h2>
                    <p><strong>Stage:</strong> Initial Access</p>
                    <p><strong>Objective:</strong> Access another user's private profile data</p>
                    <p><strong>Current User:</strong> Bob (ID: ${CURRENT_USER_ID})</p>
                    <p><strong>Flag:</strong> Will be revealed when you access someone else's profile</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Challenge Description</h2>
                    <p>Users have profile pages containing sensitive information like Social Security Numbers. The application should only allow users to view their own profile.</p>
                    <p>You are logged in as Bob (User ID: ${CURRENT_USER_ID}). Can you access another user's private profile information?</p>
                </div>

                <div class="endpoint">
                    <strong>API Endpoint:</strong><br>
                    <code>GET http://localhost:3001/api/lab2/user/:id/profile</code><br><br>
                    <strong>Your Profile:</strong><br>
                    <code>GET http://localhost:3001/api/lab2/user/${CURRENT_USER_ID}/profile</code><br><br>
                    <strong>Try accessing:</strong><br>
                    <code>GET http://localhost:3001/api/lab2/user/1/profile</code>
                </div>

                <div class="hint-box">
                    <strong>💡 Hints:</strong>
                    <ul>
                        <li>The endpoint checks if you're logged in (you are - as Bob)</li>
                        <li>But does it check WHOSE profile you're accessing?</li>
                        <li>Try accessing profiles with different user IDs</li>
                        <li>Your goal is to view someone else's SSN</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
                    <p><strong>Using curl:</strong></p>
                    <pre><code>curl http://localhost:3001/api/lab2/user/2/profile  # Your profile
curl http://localhost:3001/api/lab2/user/1/profile  # Alice's profile?
curl http://localhost:3001/api/lab2/user/3/profile  # Charlie's profile?</code></pre>
                    
                    <p><strong>Using Browser Console (F12):</strong></p>
                    <pre><code>fetch('http://localhost:3001/api/lab2/user/1/profile')
    .then(r => r.json())
    .then(data => console.log(data));</code></pre>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 2 API - Profile access endpoint (vulnerable to IDOR)
app.get('/api/lab2/user/:id/profile', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    // Vulnerable: Checks that someone is logged in, but not WHO is accessing
    // In a real app, this would check req.session.userId
    // For this lab, we simulate that Bob (ID 2) is always logged in
    
    // If accessing someone else's profile
    if (userId !== CURRENT_USER_ID) {
        return res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            ssn: user.ssn,
            flag: 'NSA{1D0R_V1A_1NC3PT10N}',
            message: `Congratulations! You accessed ${user.username}'s private profile data using IDOR.`
        });
    }
    
    // Accessing own profile
    return res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        ssn: user.ssn,
        message: 'This is your own profile. Try accessing another user\'s profile!'
    });
});

// Lab 3 - Privilege Escalation (Hard)
app.get('/lab3', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Lab 3 - Privilege Escalation</title>
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
                <h1>👑 LAB 3: PRIVILEGE ESCALATION <span class="difficulty">HARD</span></h1>
                
                <div class="info-box">
                    <h2>📋 Mission Brief</h2>
                    <p><strong>Stage:</strong> Maintained Access</p>
                    <p><strong>Objective:</strong> Gain administrative access</p>
                    <p><strong>Current User:</strong> Bob (ID: ${CURRENT_USER_ID}, Role: user)</p>
                    <p><strong>Flag:</strong> Will be revealed when you access the admin panel</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Challenge Description</h2>
                    <p>The application has an admin panel that should only be accessible to administrators. Regular users like Bob should receive a "Forbidden" error.</p>
                    <p>You are logged in as Bob, a regular user. Can you find a way to access the admin panel and escalate your privileges?</p>
                </div>

                <div class="warning">
                    <strong>⚠️ WARNING:</strong> This is a privilege escalation challenge. You need to think about how the application determines who is an administrator.
                </div>

                <div class="endpoint">
                    <strong>API Endpoint:</strong><br>
                    <code>GET http://localhost:3001/api/lab3/user/:id/admin</code><br><br>
                    <strong>Example (will fail for you):</strong><br>
                    <code>GET http://localhost:3001/api/lab3/user/${CURRENT_USER_ID}/admin</code>
                </div>

                <div class="hint-box">
                    <strong>💡 Hints:</strong>
                    <ul>
                        <li>The endpoint checks your role, but WHERE does it get that role from?</li>
                        <li>You know from Lab 1 that there are 4 users in the system</li>
                        <li>One of these users might have admin privileges...</li>
                        <li>Can you access the admin panel by pretending to be someone else?</li>
                        <li>Think IDOR, but for privilege escalation</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
                    <p><strong>Using curl:</strong></p>
                    <pre><code>curl http://localhost:3001/api/lab3/user/2/admin  # Your attempt (will fail)
curl http://localhost:3001/api/lab3/user/1/admin  # Try other users?
# Keep testing different user IDs...</code></pre>
                    
                    <p><strong>Using Browser Console (F12):</strong></p>
                    <pre><code>fetch('http://localhost:3001/api/lab3/user/4/admin')
    .then(r => r.json())
    .then(data => console.log(data));</code></pre>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 3 API - Admin panel endpoint (vulnerable to privilege escalation via IDOR)
app.get('/api/lab3/user/:id/admin', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    // Vulnerable: Checks the role of the requested user ID, not the current user
    // Should check: if (CURRENT_USER.role !== 'admin')
    // Instead checks: if (user.role !== 'admin') where user is from URL parameter
    
    if (user.role !== 'admin') {
        return res.status(403).json({ 
            error: 'Forbidden',
            message: 'Access denied. Admin privileges required.'
        });
    }
    
    // If we get here, the user found via ID is an admin
    const isActuallyAdmin = (userId === 4); // User ID 4 is the real admin
    
    if (isActuallyAdmin && userId !== CURRENT_USER_ID) {
        return res.json({
            message: 'Welcome to the Admin Panel',
            user: user.username,
            role: user.role,
            flag: 'NSA{R00T_4CC3SS_4CH13V3D}',
            adminData: {
                totalUsers: users.length,
                systemVersion: '1.0.0',
                secretKey: 'admin_secret_key_12345'
            },
            congratulations: 'You successfully escalated privileges to admin through IDOR!'
        });
    }
    
    return res.json({
        message: 'Welcome to the Admin Panel',
        user: user.username,
        role: user.role,
        adminData: {
            totalUsers: users.length,
            systemVersion: '1.0.0'
        }
    });
});

app.listen(PORT, () => {
    console.log(`\x1b[32m
╔════════════════════════════════════════════╗
║   A01: BROKEN ACCESS CONTROL LAB          ║
║   Server running on port ${PORT}           ║
║                                            ║
║   Access the lab:                         ║
║   http://localhost:${PORT}                    ║
╚════════════════════════════════════════════╝
\x1b[0m`);
});
