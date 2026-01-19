const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory storage for gallery operations
const auditLog = [];
const visitorAccess = [];
const artworkDatabase = [
    { id: 1, title: 'Starry Night', artist: 'Vincent van Gogh', price: 100000000, exhibition: 'Post-Impressionism' },
    { id: 2, title: 'The Scream', artist: 'Edvard Munch', price: 120000000, exhibition: 'Expressionism' },
    { id: 3, title: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer', price: 75000000, exhibition: 'Dutch Masters' },
    { id: 4, title: 'The Persistence of Memory', artist: 'Salvador Dalí', price: 95000000, exhibition: 'Surrealism' }
];
const exhibitions = [
    { id: 1, name: 'Post-Impressionism', curator: 'Dr. Sarah Mitchell', startDate: '2024-01-15', status: 'active' },
    { id: 2, name: 'Expressionism', curator: 'Prof. James Chen', startDate: '2024-02-01', status: 'active' },
    { id: 3, name: 'Dutch Masters', curator: 'Dr. Elena Rodriguez', startDate: '2024-03-10', status: 'upcoming' }
];

// Home page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>ArtSpace Gallery - Exhibition Management</title>
            <style>
                body {
                    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                    color: #f5f5f5;
                    font-family: 'Georgia', serif;
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
                    color: #d4af37;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                    border-bottom: 3px solid #d4af37;
                    padding-bottom: 15px;
                    letter-spacing: 2px;
                }
                .subtitle {
                    text-align: center;
                    color: #c0c0c0;
                    font-size: 1.1em;
                    margin-top: -10px;
                    margin-bottom: 30px;
                    font-style: italic;
                }
                .challenge {
                    background: linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%);
                    border: 2px solid #d4af37;
                    padding: 25px;
                    margin: 25px 0;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
                    transition: transform 0.2s;
                }
                .challenge:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
                }
                .challenge h3 {
                    margin-top: 0;
                    color: #d4af37;
                    font-size: 1.6em;
                }
                .difficulty {
                    display: inline-block;
                    padding: 5px 15px;
                    border-radius: 3px;
                    font-weight: bold;
                    margin-left: 10px;
                    font-family: Arial, sans-serif;
                }
                .easy { background-color: #4CAF50; color: #fff; }
                .medium { background-color: #FF9800; color: #fff; }
                .hard { background-color: #DC143C; color: #fff; }
                .example { background-color: #2196F3; color: #fff; }
                a {
                    color: #d4af37;
                    text-decoration: none;
                    border-bottom: 1px dotted #d4af37;
                    transition: color 0.2s;
                }
                a:hover {
                    color: #ffd700;
                    border-bottom: 1px solid #ffd700;
                }
                code {
                    background-color: #0a0a0a;
                    padding: 3px 8px;
                    border-radius: 3px;
                    color: #d4af37;
                    font-family: 'Courier New', monospace;
                }
                p {
                    color: #e0e0e0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎨 ARTSPACE GALLERY</h1>
                <div class="subtitle">Exhibition Management & Security Monitoring System</div>
                
                <div class="challenge">
                    <h3>📚 Tutorial - Gallery Security & Audit Logs <span class="difficulty example">TUTORIAL</span></h3>
                    <p>Learn about security logging best practices for art galleries, what operations should be audited, and how logging failures can expose valuable collections.</p>
                    <p><a href="/example">→ Start Tutorial</a></p>
                </div>

                <div class="challenge">
                    <h3>🖼️ Gallery Admin - Artwork Management <span class="difficulty easy">EASY</span></h3>
                    <p><strong>System:</strong> Artwork Database</p>
                    <p><strong>Description:</strong> Review the artwork management system and identify operations that lack proper audit logging.</p>
                    <p><strong>Business Impact:</strong> Unaudited deletions can lead to missing inventory records</p>
                    <p><strong>Task:</strong> Test the artwork deletion endpoint</p>
                    <p><a href="/lab1">→ Start Exercise</a></p>
                </div>

                <div class="challenge">
                    <h3>👥 Visitor Tracking - Access Monitoring <span class="difficulty medium">MEDIUM</span></h3>
                    <p><strong>System:</strong> Visitor Check-In System</p>
                    <p><strong>Description:</strong> Examine the visitor tracking logs to identify sensitive data exposure risks.</p>
                    <p><strong>Business Impact:</strong> PII leakage in logs violates privacy regulations</p>
                    <p><strong>Task:</strong> Review visitor access logs for exposed data</p>
                    <p><a href="/lab2">→ Start Exercise</a></p>
                </div>

                <div class="challenge">
                    <h3>📋 Audit System - Log Management <span class="difficulty hard">HARD</span></h3>
                    <p><strong>System:</strong> Security Audit Platform</p>
                    <p><strong>Description:</strong> Test the audit log management system for proper access controls and audit trails.</p>
                    <p><strong>Business Impact:</strong> Unauthorized log clearing destroys forensic evidence</p>
                    <p><strong>Task:</strong> Evaluate log management security controls</p>
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
            <title>About ArtSpace Gallery</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px;">
            <h1>🎨 About ArtSpace Gallery</h1>
            <p><a href="/">← Back to Home</a></p>
            
            <h2>Welcome!</h2>
            <p>ArtSpace Gallery showcases contemporary art with a secure exhibition management system.</p>
            
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
            <title>Gallery Admin - Artwork Management</title>
            <style>
                body {
                    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                    color: #f5f5f5;
                    font-family: 'Georgia', serif;
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
                    color: #d4af37;
                    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                    border-bottom: 3px solid #d4af37;
                    padding-bottom: 10px;
                }
                .info-box {
                    background: linear-gradient(145deg, #0a0a0a 0%, #1a1a1a 100%);
                    border: 2px solid #d4af37;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 8px;
                }
                .hint-box {
                    background-color: rgba(255, 152, 0, 0.1);
                    border-left: 4px solid #FF9800;
                    padding: 15px;
                    margin: 20px 0;
                }
                .endpoint {
                    background-color: #000;
                    padding: 15px;
                    border-radius: 5px;
                    border-left: 4px solid #d4af37;
                    margin: 15px 0;
                    font-family: 'Courier New', monospace;
                }
                code {
                    color: #d4af37;
                    font-family: 'Courier New', monospace;
                }
                a {
                    color: #d4af37;
                    text-decoration: none;
                    border-bottom: 1px dotted #d4af37;
                }
                a:hover {
                    color: #ffd700;
                    border-bottom: 1px solid #ffd700;
                }
                .difficulty {
                    display: inline-block;
                    padding: 5px 15px;
                    border-radius: 3px;
                    font-weight: bold;
                    background-color: #4CAF50;
                    color: #fff;
                    font-family: Arial, sans-serif;
                }
                p, li {
                    color: #e0e0e0;
                }
                h2 {
                    color: #d4af37;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🖼️ GALLERY ADMIN: ARTWORK MANAGEMENT <span class="difficulty">EASY</span></h1>
                
                <div class="info-box">
                    <h2>📋 Exercise Overview</h2>
                    <p><strong>System:</strong> Artwork Database Management</p>
                    <p><strong>Objective:</strong> Test artwork removal operations for proper audit logging</p>
                    <p><strong>Flag Location:</strong> API response from deletion endpoint</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Scenario</h2>
                    <p>The ArtSpace Gallery manages a valuable collection worth millions. Gallery administrators can add, modify, and remove artwork records from the system. Insurance policies and legal requirements mandate that all inventory changes must be logged for audit purposes.</p>
                    <p><strong>Your task:</strong> Test the artwork deletion endpoint and verify whether it properly creates audit trail entries.</p>
                </div>

                <div class="hint-box">
                    <strong style="color: #FF9800;">💡 Testing Hints:</strong>
                    <ul>
                        <li>Try removing artwork with ID 1234 from the collection</li>
                        <li>Observe the API response for audit trail information</li>
                        <li>Critical operations should always be logged with who, what, when</li>
                        <li>Unlogged deletions create insurance and compliance risks</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
                    
                    <p><strong>Step 2 - View the access logs:</strong></p>