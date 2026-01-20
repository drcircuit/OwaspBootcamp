const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// PowerFit Gym data
const trainers = [
    { id: 1, name: 'Mike Johnson', role: 'Head Trainer', email: 'mike@powerfit.gym', specialty: 'Strength Training' },
    { id: 2, name: 'Sarah Chen', role: 'Yoga Instructor', email: 'sarah@powerfit.gym', specialty: 'Yoga & Pilates' },
    { id: 3, name: 'Marcus Lee', role: 'Cardio Coach', email: 'marcus@powerfit.gym', specialty: 'HIIT & Cardio' }
];


// Home page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>PowerFit Gym - Management Portal</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #D32F2F 0%, #1976D2 100%);
                    min-height: 100vh;
                    padding: 20px;
                }
                .container { max-width: 1200px; margin: 0 auto; }
                .header {
                    background: linear-gradient(135deg, #FFCDD2 0%, #BCAAA4 100%);
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
                    color: #1976D2;
                    text-shadow: 2px 2px 4px rgba(255,255,255,0.3);
                }
                .tagline { color: #5D4037; font-size: 1.1em; font-style: italic; margin-top: 10px; }
                .welcome-section {
                    background: #FFF3E0;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    margin-bottom: 25px;
                    border: 2px solid #A1887F;
                }
                .welcome-section h2 { color: #1976D2; margin-bottom: 15px; }
                .welcome-section p { color: #5D4037; line-height: 1.7; }
                .nav-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 20px;
                }
                .card {
                    background: linear-gradient(135deg, #FFF3E0 0%, #FFCDD2 100%);
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
                .card h3 { color: #1976D2; margin-bottom: 12px; font-size: 1.4em; }
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
                .footer { text-align: center; color: #FFCDD2; margin-top: 40px; padding: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🏋️ PowerFit Gym</div>
                    <div class="tagline">Management Portal • Transform Your Fitness Journey</div>
                </div>

                <div class="welcome-section">
                    <h2>Welcome to PowerFit Gym Portal</h2>
                    <p>Manage member accounts, trainer schedules, and facility operations. Your fitness journey starts here.</p>
                </div>

                <div class="nav-cards">
                    <a href="/example" class="card">
                        <h3>📚 Interactive Tutorial</h3>
                        <p>Learn about cryptographic vulnerabilities through hands-on demos and exercises.</p>
                        <span class="card-badge badge-tutorial">Tutorial</span>
                    </a>

                    <a href="/lab1" class="card">
                        <h3>👤 Member Portal</h3>
                        <p>Access member data and session tokens. Understand encoding vs encryption.</p>
                        <span class="card-badge badge-easy">Easy</span>
                    </a>

                    <a href="/lab2" class="card">
                        <h3>👥 User Export</h3>
                        <p>Review user accounts and password security. Identify weak hashing algorithms.</p>
                        <span class="card-badge badge-medium">Medium</span>
                    </a>

                    <a href="/lab3" class="card">
                        <h3>🔐 Secure Config</h3>
                        <p>Access system configuration and encryption keys. Find hardcoded secrets.</p>
                        <span class="card-badge badge-hard">Hard</span>
                    </a>
                </div>

                <div class="footer">
                    <p>🏋️ PowerFit Gym • 789 Fitness Lane • (555) GYM-POWER</p>
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
            <title>Cryptography Tutorial - PowerFit Gym</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #D32F2F 0%, #1976D2 100%);
                    padding: 20px;
                    min-height: 100vh;
                    line-height: 1.6;
                }
                .container { max-width: 1000px; margin: 0 auto; }
                .header {
                    background: #FFF3E0;
                    padding: 30px;
                    border-radius: 15px;
                    margin-bottom: 30px;
                    text-align: center;
                    border: 2px solid #A1887F;
                }
                h1 { color: #1976D2; font-size: 2.5em; margin-bottom: 10px; }
                .subtitle { color: #5D4037; font-size: 1.1em; }
                .tutorial-section {
                    background: #FFF3E0;
                    padding: 30px;
                    border-radius: 15px;
                    margin-bottom: 25px;
                    border: 2px solid #A1887F;
                }
                .tutorial-section h2 {
                    color: #1976D2;
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
                    border: 2px solid #1976D2;
                    border-radius: 8px;
                    font-size: 1em;
                    margin: 10px 0;
                }
                .demo-button {
                    background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
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
                    background: linear-gradient(135deg, #0D47A1 0%, #01579B 100%);
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
                .tip-box {
                    background: #FFF3E0;
                    border-left: 4px solid #FF9800;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                }
                code {
                    background: #FFCDD2;
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
                    <h1>📚 Cryptography Tutorial</h1>
                    <p class="subtitle">Learn about encoding, hashing, and encryption through interactive demos</p>
                </div>

                <!-- Part 1: Base64 Encoding Demo -->
                <div class="tutorial-section">
                    <h2>Part 1: Base64 Encoding 🔍</h2>
                    <p>Base64 is an encoding scheme, NOT encryption. It converts binary data to ASCII text but provides zero security.</p>
                    
                    <div class="tutorial-box">
                        <h3>🎯 Your Mission</h3>
                        <p>Encode some text to Base64, then decode it back. See how easy it is to reverse!</p>
                    </div>

                    <div class="interactive-demo">
                        <h3>Interactive Base64 Demo</h3>
                        <p>Enter text to encode, then decode it back. Open DevTools (F12) to watch the API calls!</p>
                        <div class="demo-controls">
                            <input type="text" id="part1-text" class="demo-input" placeholder="Enter text to encode" value="Secret Password 123">
                            <button onclick="part1Encode()" class="demo-button">🔐 Encode to Base64</button>
                            <button onclick="part1Decode()" class="demo-button">🔓 Decode from Base64</button>
                        </div>
                        <div id="part1-output" class="output-box"></div>
                        <div id="part1-flag" class="flag-reveal"></div>
                    </div>

                    <div class="tip-box">
                        <strong>💡 Tip:</strong> Press F12 to open DevTools, go to the Network tab, and watch the requests. Base64 is encoding, not encryption - anyone can decode it!
                    </div>
                </div>

                <!-- Part 2: MD5 Hashing Demo -->
                <div class="tutorial-section">
                    <h2>Part 2: Weak Hashing (MD5) 💻</h2>
                    <p>MD5 is a cryptographic hash function that's now considered broken. It's too fast and vulnerable to collisions.</p>
                    
                    <div class="tutorial-box">
                        <h3>🎯 Your Mission</h3>
                        <p>Hash a password with MD5 and see how weak it is. These hashes can be cracked instantly!</p>
                    </div>

                    <div class="interactive-demo">
                        <h3>Try it yourself</h3>
                        <p>Hash a password with MD5 (deprecated algorithm):</p>
                        <input type="text" id="part2-text" class="demo-input" placeholder="Enter password to hash" value="password123">
                        <button onclick="part2Hash()" class="demo-button">🔒 Hash with MD5</button>
                        <div id="part2-output" class="output-box" style="display:none;"></div>
                        <div id="part2-flag" class="flag-reveal"></div>
                    </div>

                    <div class="tip-box">
                        <strong>💡 Tip:</strong> MD5 hashes can be cracked using rainbow tables at crackstation.net or md5decrypt.net. Never use MD5 for passwords!
                    </div>
                </div>

                <!-- Part 3: Encryption Keys -->
                <div class="tutorial-section">
                    <h2>Part 3: Encryption Keys 🔐</h2>
                    <p>Proper encryption requires secret keys. If keys are exposed, the encryption is worthless.</p>
                    
                    <div class="tutorial-box">
                        <h3>🎯 Your Mission</h3>
                        <p>See what happens when encryption keys are hardcoded or exposed in the application.</p>
                    </div>

                    <div class="interactive-demo">
                        <h3>Interactive Demo</h3>
                        <p>Check for exposed encryption configuration:</p>
                        <button onclick="part3Test()" class="demo-button">🔑 Check Encryption Config</button>
                        <div id="part3-output" class="output-box"></div>
                        <div id="part3-flag" class="flag-reveal"></div>
                    </div>

                    <div class="hint-box">
                        <strong>💡 Tip:</strong> Open DevTools Network tab to see the endpoint URL and response data. Hardcoded keys should never be in source code!
                    </div>
                </div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>

            <script>
                // Part 1: Base64 Encoding/Decoding
                async function part1Encode() {
                    const text = document.getElementById('part1-text').value;
                    const output = document.getElementById('part1-output');
                    const flagDiv = document.getElementById('part1-flag');
                    
                    output.textContent = 'Encoding...';
                    flagDiv.style.display = 'none';
                    
                    try {
                        const response = await fetch('/api/example/encode', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text })
                        });
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

                async function part1Decode() {
                    const text = document.getElementById('part1-text').value;
                    const output = document.getElementById('part1-output');
                    
                    output.textContent = 'Decoding...';
                    
                    try {
                        const response = await fetch('/api/example/decode', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ encoded: text })
                        });
                        const data = await response.json();
                        output.textContent = JSON.stringify(data, null, 2);
                    } catch (error) {
                        output.textContent = 'Error: ' + error.message;
                    }
                }

                // Part 2: MD5 Hashing
                async function part2Hash() {
                    const text = document.getElementById('part2-text').value;
                    const output = document.getElementById('part2-output');
                    const flagDiv = document.getElementById('part2-flag');
                    
                    output.style.display = 'block';
                    output.textContent = 'Hashing...';
                    flagDiv.style.display = 'none';
                    
                    try {
                        const response = await fetch('/api/example/hash', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ password: text })
                        });
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

                // Part 3: Encryption Config Check
                async function part3Test() {
                    const output = document.getElementById('part3-output');
                    const flagDiv = document.getElementById('part3-flag');
                    
                    output.textContent = 'Loading...';
                    flagDiv.style.display = 'none';
                    
                    try {
                        const response = await fetch('/api/example/crypto-info');
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
            </script>
        </body>
        </html>
    `);
});

// Example API endpoints
app.post('/api/example/encode', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text required' });
    }
    
    const encoded = Buffer.from(text).toString('base64');
    
    res.json({
        success: true,
        original: text,
        encoded: encoded,
        flag: 'FLAG{B4S364_1S_N0T_3NCRYPT10N}',
        message: 'Base64 is encoding, not encryption!',
        warning: 'Anyone can decode this - it provides NO security',
        decoding_command: `echo "${encoded}" | base64 -d`
    });
});

app.post('/api/example/decode', (req, res) => {
    const { encoded } = req.body;
    if (!encoded) {
        return res.status(400).json({ error: 'Encoded text required' });
    }
    
    try {
        const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
        res.json({
            success: true,
            encoded: encoded,
            decoded: decoded,
            message: 'Decoded successfully - see how easy?',
            security_note: 'Base64 provides zero security. Use proper encryption!'
        });
    } catch (error) {
        res.status(400).json({ error: 'Invalid base64 string' });
    }
});

app.post('/api/example/hash', (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ error: 'Password required' });
    }
    
    const md5Hash = crypto.createHash('md5').update(password).digest('hex');
    const sha256Hash = crypto.createHash('sha256').update(password).digest('hex');
    
    res.json({
        success: true,
        flag: 'FLAG{MD5_1S_BR0K3N}',
        password: password,
        md5_hash: md5Hash,
        sha256_hash: sha256Hash,
        warning: 'MD5 is cryptographically broken!',
        vulnerability: 'MD5 can be cracked in seconds using rainbow tables',
        crack_sites: ['crackstation.net', 'md5decrypt.net'],
        better_options: ['bcrypt', 'Argon2', 'PBKDF2']
    });
});

app.get('/api/example/crypto-info', (req, res) => {
    res.json({
        success: true,
        flag: 'FLAG{CRYPT0_1NF0_3XP0S3D}',
        message: 'Cryptographic configuration retrieved',
        algorithms: {
            encoding: 'Base64 (NOT encryption)',
            weak_hashing: 'MD5, SHA1 (deprecated)',
            strong_hashing: 'SHA-256, SHA-512',
            password_hashing: 'bcrypt, Argon2',
            encryption: 'AES-256-GCM'
        },
        common_mistakes: [
            'Using Base64 as encryption',
            'Using MD5 for passwords',
            'Hardcoding encryption keys',
            'Not using salt for passwords',
            'Using weak key sizes'
        ]
    });
});


// Lab 1 - Member Portal (Base64 Encoding)
app.get('/lab1', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Member Portal - PowerFit Gym</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #D32F2F 0%, #1976D2 100%);
                    padding: 20px;
                    min-height: 100vh;
                    line-height: 1.6;
                }
                .container { max-width: 900px; margin: 0 auto; }
                .header {
                    background: #FFF3E0;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 25px;
                    text-align: center;
                    border: 2px solid #A1887F;
                }
                h1 { color: #1976D2; font-size: 2em; margin-bottom: 8px; }
                .subtitle { color: #5D4037; font-size: 1.1em; }
                .section {
                    background: #FFF3E0;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                    border: 2px solid #A1887F;
                }
                .section h2 { color: #1976D2; margin-bottom: 15px; }
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
                    border: 2px solid #1976D2;
                    border-radius: 8px;
                    font-size: 1em;
                    margin: 10px 0;
                }
                .demo-button {
                    background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
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
                    background: linear-gradient(135deg, #0D47A1 0%, #01579B 100%);
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
                    background: #FFCDD2;
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
                    <h1>👤 Member Portal</h1>
                    <p class="subtitle">Access member data and session tokens</p>
                </div>

                <div class="section">
                    <h2>Member Token System</h2>
                    <p>Our member portal uses secure tokens to manage user sessions and access member information. Each member is assigned a unique token containing their profile data.</p>
                    
                    <div class="search-box">
                        <strong>🔍 Retrieve Member Token</strong>
                        <p style="margin-top: 10px; font-size: 0.95em; color: #555;">
                            Enter a member ID to retrieve their access token. The system will return an "encrypted" token containing member data.
                        </p>
                        <input type="text" id="memberId" class="demo-input" placeholder="Enter member ID (e.g., 12345)" value="12345">
                        <button onclick="getMemberToken()" class="demo-button">Get Member Token</button>
                    </div>

                    <div class="tip-box">
                        <strong>💡 Challenge Tip:</strong> Look at the token in the response. Does it look like proper encryption? Open DevTools (F12 → Network tab) to see the API response. Try decoding the token - is it actually encrypted or just encoded?
                    </div>
                </div>

                <div id="resultsContainer"></div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>
            
            <script>
                async function getMemberToken() {
                    const memberId = document.getElementById('memberId').value.trim();
                    const resultsContainer = document.getElementById('resultsContainer');
                    
                    if (!memberId) {
                        resultsContainer.innerHTML = '<div class="section"><p style="color: #d32f2f;">Please enter a member ID</p></div>';
                        return;
                    }
                    
                    resultsContainer.innerHTML = '<div class="section"><p>🔍 Retrieving member token...</p></div>';
                    
                    try {
                        const response = await fetch(\`/api/member/token?id=\${memberId}\`);
                        const data = await response.json();
                        
                        let html = '<div class="section"><h2>Member Token Retrieved</h2>';
                        
                        if (data.flag) {
                            html += '<div class="flag-reveal">🎉 ' + data.flag + '<br><br>' + data.message + '</div>';
                        }
                        
                        html += '<div class="output-box">' + JSON.stringify(data, null, 2) + '</div>';
                        
                        if (data.token) {
                            html += '<div class="tip-box">';
                            html += '<strong>🔐 Token Analysis:</strong><br>';
                            html += 'The token looks like Base64 encoding. Try decoding it:<br><br>';
                            html += '<code>echo "' + data.token + '" | base64 -d</code><br><br>';
                            html += 'Or use an online Base64 decoder!<br><br>';
                            html += '<strong>⚠️ Security Issue:</strong> ' + (data.vulnerability || 'Base64 is encoding, not encryption!');
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

// Lab 1 API - VULNERABLE: Base64 encoded data (not encrypted)
app.get('/api/member/token', (req, res) => {
    const memberId = req.query.id || '12345';
    
    // VULNERABLE: Using Base64 encoding, not encryption
    // Base64 is encoding, NOT encryption - easily reversible
    const memberData = {
        id: memberId,
        username: 'john_doe',
        email: 'john@powerfit.gym',
        membership: 'Premium',
        creditCard: '4532-1234-5678-9012',
        ssn: '123-45-6789',
        flag: 'FLAG{B4S364_N0T_3NCRYPT10N}'
    };
    
    // "Encrypting" with Base64 (WRONG!)
    const token = Buffer.from(JSON.stringify(memberData)).toString('base64');
    
    res.json({
        success: true,
        token: token,
        vulnerability: 'Base64 encoding used instead of proper encryption',
        hint: 'This token can be easily decoded with: echo "token" | base64 -d',
        warning: 'Base64 is encoding, not encryption! Anyone can decode it.',
        message: 'Member token generated (insecurely)'
    });
});


// Lab 2 - User Export (MD5 Hashing)
app.get('/lab2', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>User Export - PowerFit Gym</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #D32F2F 0%, #1976D2 100%);
                    padding: 20px;
                    min-height: 100vh;
                    line-height: 1.6;
                }
                .container { max-width: 900px; margin: 0 auto; }
                .header {
                    background: #FFF3E0;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 25px;
                    text-align: center;
                    border: 2px solid #A1887F;
                }
                h1 { color: #1976D2; font-size: 2em; }
                .subtitle { color: #5D4037; font-size: 1.1em; }
                .section {
                    background: #FFF3E0;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                    border: 2px solid #A1887F;
                }
                .section h2 { color: #1976D2; margin-bottom: 15px; }
                .section p { color: #5D4037; line-height: 1.7; margin: 8px 0; }
                .search-box {
                    background: #E8F5E9;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    border-left: 3px solid #4CAF50;
                }
                .demo-button {
                    background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
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
                    background: linear-gradient(135deg, #0D47A1 0%, #01579B 100%);
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
                    background: #FFCDD2;
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-family: monospace;
                    color: #c62828;
                }
                .user-table {
                    width: 100%;
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    margin: 15px 0;
                }
                .user-table th, .user-table td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                .user-table th {
                    background: #1976D2;
                    color: white;
                    font-weight: 600;
                }
                .user-table tr:hover {
                    background: #f5f5f5;
                }
                .back-link { text-align: center; margin-top: 30px; }
                .back-link a { color: #5D4037; text-decoration: none; font-weight: 600; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>👥 User Export</h1>
                    <p class="subtitle">Review user accounts and password security</p>
                </div>

                <div class="section">
                    <h2>User Database Export</h2>
                    <p>Export user account data for backup and analysis purposes. This includes usernames, roles, and password hashes for security review.</p>
                    
                    <div class="search-box">
                        <strong>📊 Export User Data</strong>
                        <p style="margin-top: 10px; font-size: 0.95em; color: #555;">
                            Retrieve all user accounts with their password hashes. Review the hashing algorithm used for password storage.
                        </p>
                        <button onclick="exportUsers()" class="demo-button">Export User Database</button>
                    </div>

                    <div class="tip-box">
                        <strong>💡 Challenge Tip:</strong> Look at the password hashes in the response. What algorithm is being used? Open DevTools (F12 → Network tab) to inspect the data. Can you identify the hashing algorithm? Try cracking the hashes using online tools like <code>crackstation.net</code> or <code>md5decrypt.net</code>
                    </div>
                </div>

                <div id="resultsContainer"></div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>
            
            <script>
                async function exportUsers() {
                    const resultsContainer = document.getElementById('resultsContainer');
                    
                    resultsContainer.innerHTML = '<div class="section"><p>🔍 Exporting user data...</p></div>';
                    
                    try {
                        const response = await fetch('/api/users/export');
                        const data = await response.json();
                        
                        let html = '<div class="section"><h2>User Database Export</h2>';
                        
                        if (data.flag) {
                            html += '<div class="flag-reveal">🎉 ' + data.flag + '<br><br>' + data.warning + '</div>';
                        }
                        
                        // Display users in a table
                        if (data.users && data.users.length > 0) {
                            html += '<table class="user-table">';
                            html += '<tr><th>ID</th><th>Username</th><th>Email</th><th>Password Hash</th><th>Role</th></tr>';
                            data.users.forEach(user => {
                                html += \`<tr>
                                    <td>\${user.id}</td>
                                    <td>\${user.username}</td>
                                    <td>\${user.email}</td>
                                    <td><code>\${user.password_hash}</code></td>
                                    <td>\${user.role}</td>
                                </tr>\`;
                            });
                            html += '</table>';
                        }
                        
                        html += '<div class="output-box">' + JSON.stringify(data, null, 2) + '</div>';
                        
                        html += '<div class="tip-box">';
                        html += '<strong>🔐 Hash Cracking Tips:</strong><br><br>';
                        html += '1. Copy a password hash from above<br>';
                        html += '2. Visit <a href="https://crackstation.net" target="_blank" style="color: #1976D2;">crackstation.net</a> or <a href="https://md5decrypt.net" target="_blank" style="color: #1976D2;">md5decrypt.net</a><br>';
                        html += '3. Paste the hash and crack it!<br><br>';
                        html += '<strong>⚠️ Security Issue:</strong> ' + (data.vulnerability || 'MD5 hashing is cryptographically broken!') + '<br><br>';
                        html += '<strong>Better Options:</strong> ' + (data.tools ? data.tools.slice(0, 2).join(', ') : 'bcrypt, Argon2');
                        html += '</div>';
                        
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

// Lab 2 API - VULNERABLE: MD5 password hashes (weak hashing)
app.get('/api/users/export', (req, res) => {
    // VULNERABLE: Using MD5 for password hashing (deprecated, easily crackable)
    const crypto = require('crypto');
    
    const users = [
        { 
            id: 1, 
            username: 'trainer_mike',
            email: 'mike@powerfit.gym',
            password_hash: crypto.createHash('md5').update('fitness123').digest('hex'), // MD5 hash
            role: 'trainer'
        },
        {
            id: 2,
            username: 'admin',
            email: 'admin@powerfit.gym',
            password_hash: crypto.createHash('md5').update('powerfit2024').digest('hex'), // MD5 hash
            role: 'admin'
        },
        {
            id: 3,
            username: 'reception',
            email: 'desk@powerfit.gym',
            password_hash: crypto.createHash('md5').update('welcome').digest('hex'), // MD5 hash
            role: 'staff'
        }
    ];
    
    res.json({
        success: true,
        flag: 'FLAG{W34K_H4SH1NG_MD5_CR4CK3D}',
        vulnerability: 'MD5 hashing algorithm used for passwords',
        users: users,
        warning: 'MD5 is cryptographically broken and unsuitable for password hashing!',
        hint: 'These hashes can be cracked using online rainbow tables or hashcat',
        examples: {
            'fitness123': crypto.createHash('md5').update('fitness123').digest('hex'),
            'powerfit2024': crypto.createHash('md5').update('powerfit2024').digest('hex'),
            'welcome': crypto.createHash('md5').update('welcome').digest('hex')
        },
        tools: ['hashcat', 'john', 'crackstation.net', 'md5decrypt.net']
    });
});

// Lab 3 - Secure Config (Hardcoded Keys)
app.get('/lab3', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Secure Config - PowerFit Gym</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body {
                    font-family: 'Georgia', serif;
                    background: linear-gradient(135deg, #D32F2F 0%, #1976D2 100%);
                    padding: 20px;
                    min-height: 100vh;
                    line-height: 1.6;
                }
                .container { max-width: 900px; margin: 0 auto; }
                .header {
                    background: #FFF3E0;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 25px;
                    text-align: center;
                    border: 2px solid #A1887F;
                }
                h1 { color: #1976D2; font-size: 2em; }
                .subtitle { color: #5D4037; font-size: 1.1em; }
                .section {
                    background: #FFF3E0;
                    padding: 25px;
                    border-radius: 15px;
                    margin-bottom: 20px;
                    border: 2px solid #A1887F;
                }
                .section h2 { color: #1976D2; margin-bottom: 15px; }
                .section p { color: #5D4037; line-height: 1.7; margin: 8px 0; }
                .restricted {
                    background: #FFEBEE;
                    border-left: 4px solid #D32F2F;
                    padding: 15px;
                    margin: 15px 0;
                    border-radius: 5px;
                }
                .search-box {
                    background: #E8F5E9;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px 0;
                    border-left: 3px solid #4CAF50;
                }
                .demo-button {
                    background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
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
                    background: linear-gradient(135deg, #0D47A1 0%, #01579B 100%);
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
                    background: #FFCDD2;
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
                    <h1>🔐 Secure Config</h1>
                    <p class="subtitle">System configuration and encryption keys</p>
                </div>

                <div class="restricted">
                    <strong>🔒 Administrative Area</strong><br>
                    This section contains sensitive system configuration. Access requires proper authorization.
                </div>

                <div class="section">
                    <h2>Security Configuration</h2>
                    <p>The PowerFit Gym system uses encryption to protect sensitive member data. Review the cryptographic configuration and key management practices.</p>
                    
                    <div class="search-box">
                        <strong>🔑 Access Encryption Configuration</strong>
                        <p style="margin-top: 10px; font-size: 0.95em; color: #555;">
                            Retrieve the system's encryption configuration including algorithms, keys, and security settings. This information is used for security audits.
                        </p>
                        <button onclick="getSecureConfig()" class="demo-button">Load Security Config</button>
                    </div>

                    <div class="tip-box">
                        <strong>💡 Challenge Tip:</strong> Open DevTools (F12 → Network tab) and watch the API response. Look for encryption keys in the configuration. Are the keys hardcoded in the response? What happens when encryption keys are exposed? Real-world impact: GitHub has seen billions in losses from exposed API keys!
                    </div>
                </div>

                <div id="resultsContainer"></div>

                <div class="back-link">
                    <a href="/">← Back to Portal</a>
                </div>
            </div>
            
            <script>
                async function getSecureConfig() {
                    const resultsContainer = document.getElementById('resultsContainer');
                    
                    resultsContainer.innerHTML = '<div class="section"><p>🔍 Loading security configuration...</p></div>';
                    
                    try {
                        const response = await fetch('/api/secure/config');
                        const data = await response.json();
                        
                        let html = '<div class="section"><h2>Security Configuration Retrieved</h2>';
                        
                        if (data.flag) {
                            html += '<div class="flag-reveal">🎉 ' + data.flag + '<br><br>' + data.message + '</div>';
                        }
                        
                        html += '<div class="output-box">' + JSON.stringify(data, null, 2) + '</div>';
                        
                        html += '<div class="tip-box">';
                        html += '<strong>🚨 CRITICAL SECURITY ISSUE:</strong><br><br>';
                        html += '<strong>⚠️ Vulnerability:</strong> ' + (data.vulnerability || 'Encryption keys hardcoded in source code!') + '<br><br>';
                        html += '<strong>Impact:</strong> Anyone with access to this endpoint (or source code) can decrypt ALL encrypted data. The encryption is completely worthless!<br><br>';
                        html += '<strong>Real-World Examples:</strong><br>';
                        html += '• GitHub secrets exposed in commits<br>';
                        html += '• AWS keys in public repos → $50k+ bills<br>';
                        html += '• Mobile apps decompiled to extract API keys<br><br>';
                        html += '<strong>Better Approach:</strong><br>';
                        html += '• Use environment variables (process.env)<br>';
                        html += '• Use secret managers (AWS Secrets Manager, HashiCorp Vault)<br>';
                        html += '• Never commit keys to Git<br>';
                        html += '• Implement key rotation policies';
                        html += '</div>';
                        
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

// Lab 3 API - VULNERABLE: Hardcoded encryption keys in source
app.get('/api/secure/config', (req, res) => {
    // VULNERABLE: Hardcoded encryption keys in source code
    
    // CRITICAL VULNERABILITY: Encryption keys hardcoded in source
    const HARDCODED_KEYS = {
        encryption_key: 'powerfit_secret_key_2024',  // Hardcoded!
        iv: '1234567890123456',  // Hardcoded IV!
        jwt_secret: 'gym_jwt_secret_key_hardcoded',
        api_key: 'PF-API-KEY-12345678-HARDCODED'
    };
    
    // Example of "encrypted" data (but key is in source!)
    const sensitiveData = 'admin:SuperSecret123!';
    
    // Pad/truncate key to exactly 32 bytes for AES-256
    const key = Buffer.alloc(32);
    key.write(HARDCODED_KEYS.encryption_key);
    
    const cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.from(HARDCODED_KEYS.iv));
    let encrypted = cipher.update(sensitiveData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    res.json({
        success: true,
        flag: 'FLAG{H4RDC0D3D_3NCRYPT10N_K3YS}',
        vulnerability: 'Encryption keys hardcoded in source code',
        warning: 'Anyone with access to source code can decrypt all data!',
        encryption_keys: HARDCODED_KEYS,
        encrypted_sample: encrypted,
        decryption_hint: 'Use the exposed keys to decrypt data',
        message: 'Keys in source code = no security!',
        real_world_examples: [
            'GitHub secrets exposed in commits',
            'API keys in mobile app source',
            'Hardcoded passwords in configuration files'
        ],
        better_approach: [
            'Use environment variables',
            'Use secret management (AWS Secrets Manager, HashiCorp Vault)',
            'Never commit keys to version control',
            'Rotate keys regularly',
            'Use proper key derivation functions (PBKDF2, Argon2)'
        ]
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\x1b[33m
╔════════════════════════════════════════════╗
║   🏋️ PowerFit Gym Management Portal   ║
║   Server running on port ${PORT}           ║
║                                            ║
║   Access: http://localhost:${PORT}            ║
╚════════════════════════════════════════════╝
\x1b[0m`);
});
