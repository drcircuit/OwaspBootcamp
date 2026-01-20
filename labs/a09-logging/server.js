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
                    <p><strong>Endpoint:</strong> <code>DELETE /api/artwork/:id</code></p>
                    <p><strong>Example:</strong> <code>DELETE /api/artwork/1234</code></p>
                    <p><strong>What to look for:</strong> Check if the deletion is logged in the audit trail</p>
                </div>

                <p style="text-align: center; margin-top: 30px;">
                    <a href="/">← Back to Home</a>
                </p>
            </div>
        </body>
        </html>
    `);
});

// Lab 2 - Visitor Tracking with PII Exposure
app.get('/lab2', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Visitor Tracking - ArtSpace Gallery</title>
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
                    color: #d4af37;
                    text-align: center;
                    border-bottom: 2px solid #d4af37;
                    padding-bottom: 10px;
                }
                .info-box, .hint-box {
                    background: rgba(212, 175, 55, 0.1);
                    border-left: 4px solid #d4af37;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 5px;
                }
                .hint-box {
                    background: rgba(255, 152, 0, 0.1);
                    border-left: 4px solid #FF9800;
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
                    background-color: #FF9800;
                    color: #fff;
                    font-family: Arial, sans-serif;
                }
                p, li {
                    color: #e0e0e0;
                }
                h2 {
                    color: #d4af37;
                }
                code {
                    background-color: #0a0a0a;
                    padding: 3px 8px;
                    border-radius: 3px;
                    color: #d4af37;
                    font-family: 'Courier New', monospace;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>👥 VISITOR TRACKING: ACCESS MONITORING <span class="difficulty">MEDIUM</span></h1>
                
                <div class="info-box">
                    <h2>📋 Exercise Overview</h2>
                    <p><strong>System:</strong> Visitor Check-In System</p>
                    <p><strong>Objective:</strong> Test visitor tracking logs for sensitive data exposure</p>
                    <p><strong>Flag Location:</strong> API response from visitor access endpoint</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Scenario</h2>
                    <p>The ArtSpace Gallery tracks visitor information for security and capacity management. The system logs visitor check-ins and access to restricted exhibition areas. However, logs that contain Personally Identifiable Information (PII) create privacy compliance risks.</p>
                    <p><strong>Your task:</strong> Test the visitor access endpoint and analyze the logging behavior for privacy violations.</p>
                </div>

                <div class="hint-box">
                    <strong style="color: #FF9800;">💡 Testing Hints:</strong>
                    <ul>
                        <li>Request visitor access for visitor ID 9999</li>
                        <li>Observe what information appears in the logs</li>
                        <li>Logs should NOT contain PII like SSN, credit cards, or full addresses</li>
                        <li>GDPR and CCPA require minimizing PII in logs</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
                    <p><strong>Endpoint:</strong> <code>GET /api/visitor/:id</code></p>
                    <p><strong>Example:</strong> <code>GET /api/visitor/9999</code></p>
                    <p><strong>What to look for:</strong> Check if sensitive PII is logged in visitor access</p>
                </div>

                <p style="text-align: center; margin-top: 30px;">
                    <a href="/">← Back to Home</a>
                </p>
            </div>
        </body>
        </html>
    `);
});

// Lab 3 - Log Management Security
app.get('/lab3', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Audit System - ArtSpace Gallery</title>
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
                    color: #d4af37;
                    text-align: center;
                    border-bottom: 2px solid #d4af37;
                    padding-bottom: 10px;
                }
                .info-box, .hint-box, .warning {
                    background: rgba(212, 175, 55, 0.1);
                    border-left: 4px solid #d4af37;
                    padding: 20px;
                    margin: 20px 0;
                    border-radius: 5px;
                }
                .hint-box {
                    background: rgba(255, 152, 0, 0.1);
                    border-left: 4px solid #FF9800;
                }
                .warning {
                    background: rgba(220, 20, 60, 0.1);
                    border-left: 4px solid #DC143C;
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
                    background-color: #DC143C;
                    color: #fff;
                    font-family: Arial, sans-serif;
                }
                p, li {
                    color: #e0e0e0;
                }
                h2 {
                    color: #d4af37;
                }
                code {
                    background-color: #0a0a0a;
                    padding: 3px 8px;
                    border-radius: 3px;
                    color: #d4af37;
                    font-family: 'Courier New', monospace;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📋 AUDIT SYSTEM: LOG MANAGEMENT <span class="difficulty">HARD</span></h1>
                
                <div class="info-box">
                    <h2>📋 Exercise Overview</h2>
                    <p><strong>System:</strong> Security Audit Platform</p>
                    <p><strong>Objective:</strong> Test audit log management for proper access controls</p>
                    <p><strong>Flag Location:</strong> API response from log clearing endpoint</p>
                </div>

                <div class="info-box">
                    <h2>🎯 Scenario</h2>
                    <p>The ArtSpace Gallery maintains security audit logs that record all administrative actions, security events, and access control decisions. These logs are critical for forensic investigations, compliance audits, and incident response. However, if audit logs can be tampered with or cleared without authorization, attackers can erase evidence of their activities.</p>
                    <p><strong>Your task:</strong> Test the audit log management system and evaluate whether proper access controls are in place.</p>
                </div>

                <div class="warning">
                    <strong style="color: #DC143C;">⚠️ SECURITY RISK:</strong> Audit logs must be tamper-proof. Allowing unauthorized clearing or modification of audit logs enables attackers to cover their tracks and destroys forensic evidence.
                </div>

                <div class="hint-box">
                    <strong style="color: #FF9800;">💡 Testing Hints:</strong>
                    <ul>
                        <li>Try clearing the audit logs using the management endpoint</li>
                        <li>Observe whether authentication or authorization is required</li>
                        <li>Log deletion should require elevated privileges and itself be logged</li>
                        <li>Consider SIEM integration for log immutability</li>
                    </ul>
                </div>

                <div class="info-box">
                    <h2>🛠️ Testing Instructions</h2>
                    <p><strong>Endpoint:</strong> <code>DELETE /api/audit-logs</code></p>
                    <p><strong>What to look for:</strong> Check if logs can be cleared without proper authorization</p>
                </div>

                <p style="text-align: center; margin-top: 30px;">
                    <a href="/">← Back to Home</a>
                </p>
            </div>
        </body>
        </html>
    `);
});

// API Endpoints

// Lab 1 API - Missing audit logs for deletions
app.delete('/api/artwork/:id', (req, res) => {
    const artworkId = parseInt(req.params.id);
    
    // Vulnerable: No audit logging for deletion
    const artwork = artworkDatabase.find(art => art.id === artworkId);
    
    if (!artwork) {
        return res.status(404).json({
            success: false,
            message: 'Artwork not found'
        });
    }
    
    // Remove artwork without logging
    const index = artworkDatabase.indexOf(artwork);
    artworkDatabase.splice(index, 1);
    
    // Special case: demonstrates the vulnerability
    if (artworkId === 1234) {
        return res.json({
            success: true,
            message: 'Artwork deleted successfully',
            deletedArtwork: artwork,
            auditLogged: false,
            flag: 'HARVEST{N0_4UD1T_TR41L}',
            vulnerability: 'Critical deletion operation not logged in audit trail',
            impact: 'Insurance claims impossible without deletion records',
            secureAlternative: 'Log all CRUD operations with timestamp, user, and action details'
        });
    }
    
    res.json({
        success: true,
        message: 'Artwork deleted',
        deletedArtwork: artwork,
        auditLogged: false,
        hint: 'Try artwork ID 1234 to see the full vulnerability'
    });
});

// Lab 2 API - PII exposure in logs
app.get('/api/visitor/:id', (req, res) => {
    const visitorId = parseInt(req.params.id);
    
    // Simulated visitor data with PII
    const visitorData = {
        id: visitorId,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '555-0123',
        address: '123 Main St, Anytown, USA',
        ssn: '123-45-6789',
        creditCard: '4532-1234-5678-9010',
        visitDate: '2024-01-15',
        exhibition: 'Modern Art Collection'
    };
    
    // Vulnerable: Log contains full PII including sensitive data
    const logEntry = {
        timestamp: new Date().toISOString(),
        action: 'visitor_access',
        visitorData: visitorData, // VULNERABLE: Logging full PII
        ipAddress: req.ip
    };
    
    visitorAccess.push(logEntry);
    
    // Return flag when accessing visitor 9999
    if (visitorId === 9999) {
        return res.json({
            success: true,
            visitor: visitorData,
            logEntry: logEntry,
            flag: 'HARVEST{P11_1N_L0GS}',
            vulnerability: 'Sensitive PII (SSN, credit card) logged in plaintext',
            impact: 'GDPR/CCPA violations, data breach exposure',
            secureAlternative: 'Log only visitor ID, redact or hash sensitive fields'
        });
    }
    
    res.json({
        success: true,
        visitor: visitorData,
        logEntry: logEntry,
        hint: 'Try visitor ID 9999 to see the full vulnerability'
    });
});

// Lab 3 API - Unauthorized log clearing
app.delete('/api/audit-logs', (req, res) => {
    // Vulnerable: No authentication or authorization check
    const logCount = auditLog.length;
    
    // Clear all audit logs without any access control
    auditLog.length = 0;
    
    return res.json({
        success: true,
        message: 'Audit logs cleared',
        logsDeleted: logCount,
        flag: 'HARVEST{L0G_T4MP3R1NG}',
        vulnerability: 'Audit logs can be cleared without authentication or authorization',
        impact: 'Attackers can erase forensic evidence and cover their tracks',
        secureAlternative: 'Require admin authentication, log the clearing action itself, use immutable log storage'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\x1b[32m
╔════════════════════════════════════════════╗
║   🎨 ArtSpace Gallery                     ║
║   Server running on port ${PORT}           ║
║                                            ║
║   Access the portal:                      ║
║   http://localhost:${PORT}                    ║
╚════════════════════════════════════════════╝
\x1b[0m`);
});
