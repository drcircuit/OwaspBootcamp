const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Simulated community center database
const database = {
    classes: [
        { id: 1, name: 'Yoga for Beginners', instructor: 'Sarah Johnson', schedule: 'Mon/Wed 6PM', capacity: 20, enrolled: 15 },
        { id: 2, name: 'Pottery Workshop', instructor: 'Michael Chen', schedule: 'Tue/Thu 7PM', capacity: 12, enrolled: 10 },
        { id: 3, name: 'Kids Art Class', instructor: 'Emma Davis', schedule: 'Sat 10AM', capacity: 15, enrolled: 12 },
        { id: 4, name: 'Senior Fitness', instructor: 'Robert Taylor', schedule: 'Daily 9AM', capacity: 25, enrolled: 20 }
    ],
    members: [
        { id: 1, name: 'John Smith', email: 'john@example.com', membershipLevel: 'Gold', joinDate: '2023-01-15' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', membershipLevel: 'Silver', joinDate: '2023-06-20' }
    ],
    registrations: [],
    facilities: ['Main Hall', 'Art Studio', 'Fitness Center', 'Community Kitchen'],
    config: {
        dbConnection: 'mongodb://internal-db:27017/communityhub',
        apiKey: 'sk_community_51xyz123...',
        adminEmail: 'FLAG_HIDDEN_HERE'
    }
};

// Home page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>CommunityHub Center - Class Registration</title>
            <style>
                body {
                    background: linear-gradient(135deg, #FFF5E1 0%, #FFE4B5 100%);
                    color: #2c3e50;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    padding: 20px;
                    line-height: 1.6;
                    margin: 0;
                }
                .container {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                h1 {
                    text-align: center;
                    font-size: 2.8em;
                    color: #E67E22;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
                    border-bottom: 4px solid #E67E22;
                    padding-bottom: 15px;
                }
                .subtitle {
                    text-align: center;
                    color: #555;
                    font-size: 1.2em;
                    margin-top: -10px;
                    margin-bottom: 30px;
                    font-style: italic;
                }
                .challenge {
                    background: linear-gradient(145deg, #FFFFFF 0%, #FFF9F0 100%);
                    border: 3px solid #E67E22;
                    padding: 25px;
                    margin: 25px 0;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(230, 126, 34, 0.2);
                    transition: transform 0.2s;
                }
                .challenge:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(230, 126, 34, 0.3);
                }
                .challenge h3 {
                    margin-top: 0;
                    color: #D35400;
                    font-size: 1.6em;
                }
                .difficulty {
                    display: inline-block;
                    padding: 6px 16px;
                    border-radius: 4px;
                    font-weight: bold;
                    margin-left: 10px;
                    font-size: 0.9em;
                }
                .easy { background-color: #27AE60; color: #fff; }
                .medium { background-color: #F39C12; color: #fff; }
                .hard { background-color: #C0392B; color: #fff; }
                .example { background-color: #3498DB; color: #fff; }
                a {
                    color: #E67E22;
                    text-decoration: none;
                    border-bottom: 2px dotted #E67E22;
                    transition: color 0.2s;
                    font-weight: 500;
                }
                a:hover {
                    color: #D35400;
                    border-bottom: 2px solid #D35400;
                }
                code {
                    background-color: #FFF9F0;
                    padding: 3px 8px;
                    border-radius: 3px;
                    color: #D35400;
                    font-family: 'Courier New', monospace;
                    border: 1px solid #E67E22;
                }
                p {
                    color: #34495e;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🏠 COMMUNITYHUB CENTER</h1>
                <div class="subtitle">Class Registration & Member Portal System</div>
                
                <div class="challenge">
                    <h3>📚 Tutorial - Secure Error Handling <span class="difficulty example">TUTORIAL</span></h3>
                    <p>Learn about proper exception handling in community systems, what error information should be exposed, and how error messages can leak sensitive data.</p>
                    <p><a href="/example">→ Start Tutorial</a></p>
                </div>

                <div class="challenge">
                    <h3>🔍 Class Search - Information Discovery <span class="difficulty easy">EASY</span></h3>
                    <p><strong>System:</strong> Class Directory</p>
                    <p><strong>Description:</strong> Test the class search functionality and examine error messages for information disclosure.</p>
                    <p><strong>Business Impact:</strong> Verbose errors reveal system architecture</p>
                    <p><strong>Task:</strong> Search for classes and trigger error conditions</p>
                    <p><a href="/lab1">→ Start Exercise</a></p>
                </div>

                <div class="challenge">
                    <h3>📝 Registration System - Stack Trace Analysis <span class="difficulty medium">MEDIUM</span></h3>
                    <p><strong>System:</strong> Class Registration Platform</p>
                    <p><strong>Description:</strong> Examine the registration process for exposed technical details in error responses.</p>
                    <p><strong>Business Impact:</strong> Stack traces reveal frameworks and code structure</p>
                    <p><strong>Task:</strong> Submit registrations and analyze error messages</p>
                    <p><a href="/lab2">→ Start Exercise</a></p>
                </div>

                <div class="challenge">
                    <h3>👤 Member Portal - Silent Failure Testing <span class="difficulty hard">HARD</span></h3>
                    <p><strong>System:</strong> Member Management Portal</p>
                    <p><strong>Description:</strong> Test member portal access and analyze how error suppression affects security monitoring.</p>
                    <p><strong>Business Impact:</strong> Generic errors hide security violations</p>
                    <p><strong>Task:</strong> Attempt unauthorized access and observe error handling</p>
                    <p><a href="/lab3">→ Start Exercise</a></p>
                </div>

                <p style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Portal</a>
                </p>
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
            <title>About CommunityHub Center</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px;">
            <h1>🏘️ About CommunityHub Center</h1>
            <p><a href="/">← Back to Home</a></p>
            
            <h2>Welcome!</h2>
            <p>CommunityHub Center offers classes and activities with an easy-to-use registration system.</p>
            
            <h2>Our Services</h2>
            <p>We provide comprehensive services to meet your needs. Our platform is designed with security and reliability in mind.</p>
            
            <h2>Security & Privacy</h2>
            <p>We take data integrity and security seriously. Our systems implement industry-standard protections to keep your information safe.</p>
            
            <p style="margin-top: 30px;"><a href="/">← Back to Home</a></p>
        </body>
        </html>
    `);
});

app.get('/lab1', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Class Search - Information Discovery</title>
            <style>
                body {
                    background: linear-gradient(135deg, #FFF5E1 0%, #FFE4B5 100%);
                    color: #2c3e50;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    padding: 20px;
                    line-height: 1.6;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                h1 {
                    text-align: center;
                    font-size: 2.3em;
                    color: #E67E22;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
                    border-bottom: 4px solid #E67E22;
                    padding-bottom: 10px;
                }
                .info-box {
                    background: linear-gradient(145deg, #FFFFFF 0%, #FFF9F0 100%);
                    border: 3px solid #E67E22;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 12px;
                }
                .hint-box {
                    background-color: rgba(243, 156, 18, 0.1);
                    border-left: 4px solid #F39C12;
                    padding: 15px;
                    margin: 20px 0;
                }
                .endpoint {
                    background-color: #2c3e50;
                    color: #ECF0F1;
                    padding: 15px;
                    border-radius: 5px;
                    border-left: 4px solid #E67E22;
                    margin: 15px 0;
                    font-family: 'Courier New', monospace;
                }
                code {
                    color: #E67E22;
                    font-family: 'Courier New', monospace;
                }
                a {
                    color: #E67E22;
                    text-decoration: none;
                    border-bottom: 2px dotted #E67E22;
                }
                a:hover {
                    color: #D35400;
                    border-bottom: 2px solid #D35400;
                }
                .difficulty {
                    display: inline-block;
                    padding: 6px 16px;
                    border-radius: 4px;
                    font-weight: bold;
                    background-color: #27AE60;
                    color: #fff;
                }
                p, li {
                    color: #34495e;
                }
                h2 {
                    color: #D35400;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🔍 CLASS SEARCH: INFORMATION DISCOVERY <span class="difficulty">EASY</span></h1>
                
                <div class="info-box">
                    <h2>📋 Exercise Overview</h2>
                    <p><strong>System:</strong> Class Directory & Search</p>
                    <p><strong>Objective:</strong> Test class lookup functionality for information disclosure in errors</p>
                    <p><strong>Flag Location:</strong> API error response</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Scenario</h2>
                    <p>The CommunityHub Center provides a class directory where members can search for available classes. The system should handle invalid searches gracefully without exposing internal system details.</p>
                    <p><strong>Your task:</strong> Search for classes using invalid IDs and examine error messages for exposed technical information.</p>
                </div>

                <div class="hint-box">
                    <strong style="color: #F39C12;">💡 Testing Hints:</strong>
                    <ul>
                        <li>Try accessing class IDs with invalid formats</li>
                        <li>Look for verbose error messages revealing system details</li>
                        <li>Error messages might expose database types or validation logic</li>
                        <li>Production systems should hide technical implementation details</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
                </div>

                <div style="text-align: center; margin-top: 40px;">
                    <a href="/">← Back to Home</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Lab 3 page - Member Portal
app.get('/lab3', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Member Portal - Silent Failure Testing</title>
            <style>
                body {
                    background: linear-gradient(135deg, #FFF5E1 0%, #FFE4B5 100%);
                    color: #2c3e50;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    padding: 20px;
                    line-height: 1.6;
                }
                .container {
                    max-width: 900px;
                    margin: 0 auto;
                }
                h1 {
                    text-align: center;
                    font-size: 2.3em;
                    color: #E67E22;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
                    border-bottom: 4px solid #E67E22;
                    padding-bottom: 10px;
                }
                .info-box {
                    background: linear-gradient(145deg, #FFFFFF 0%, #FFF9F0 100%);
                    border: 3px solid #E67E22;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 12px;
                }
                .hint-box {
                    background-color: rgba(243, 156, 18, 0.1);
                    border-left: 4px solid #F39C12;
                    padding: 15px;
                    margin: 20px 0;
                }
                .endpoint {
                    background-color: #2c3e50;
                    color: #ECF0F1;
                    padding: 15px;
                    border-radius: 5px;
                    border-left: 4px solid #E67E22;
                    margin: 15px 0;
                    font-family: 'Courier New', monospace;
                }
                code {
                    color: #E67E22;
                    font-family: 'Courier New', monospace;
                }
                a {
                    color: #E67E22;
                    text-decoration: none;
                    border-bottom: 2px dotted #E67E22;
                }
                a:hover {
                    color: #D35400;
                    border-bottom: 2px solid #D35400;
                }
                .difficulty {
                    display: inline-block;
                    padding: 6px 16px;
                    border-radius: 4px;
                    font-weight: bold;
                    background-color: #C0392B;
                    color: #fff;
                }
                .warning {
                    background-color: rgba(192, 57, 43, 0.1);
                    border-left: 4px solid #C0392B;
                    padding: 15px;
                    margin: 15px 0;
                }
                p, li {
                    color: #34495e;
                }
                h2 {
                    color: #D35400;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>👤 MEMBER PORTAL: SILENT FAILURE TESTING <span class="difficulty">HARD</span></h1>
                
                <div class="info-box">
                    <h2>📋 Exercise Overview</h2>
                    <p><strong>System:</strong> Member Management Portal</p>
                    <p><strong>Objective:</strong> Test member portal access and analyze error suppression</p>
                    <p><strong>Flag Location:</strong> Generic error response</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Scenario</h2>
                    <p>The member portal provides access to sensitive member information and should be protected. However, overly generic error messages that hide authorization failures can prevent security monitoring from detecting attacks, while also providing attackers with the data they seek.</p>
                    <p><strong>Your task:</strong> Attempt to access the member portal configuration and analyze how error suppression affects security visibility.</p>
                </div>

                <div class="warning">
                    <strong style="color: #C0392B;">⚠️ SECURITY NOTE:</strong> While verbose errors are bad, overly generic errors that hide security violations are equally dangerous. Authorization failures should use distinct HTTP codes (403) for monitoring.
                </div>

                <div class="hint-box">
                    <strong style="color: #F39C12;">💡 Testing Hints:</strong>
                    <ul>
                        <li>Try accessing the member configuration endpoint</li>
                        <li>Notice the generic error message hides the security failure</li>
                        <li>Authorization failures should be distinguishable from server errors</li>
                        <li>Generic errors prevent security monitoring from detecting attacks</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
