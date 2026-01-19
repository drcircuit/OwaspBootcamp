const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

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

// Example page - Member Portal Help (simplified, no tutorials)
app.get('/example', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Member Portal Help - ZenFlow Yoga</title>
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
                .section {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                    margin-bottom: 25px;
                    border-left: 4px solid #66bb6a;
                }
                .section h2 {
                    color: #2e7d32;
                    margin-bottom: 15px;
                    font-size: 1.8em;
                }
                .section p {
                    color: #555;
                    margin-bottom: 15px;
                    line-height: 1.7;
                }
                .feature-box {
                    background: #f1f8e9;
                    padding: 20px;
                    border-radius: 10px;
                    margin: 15px 0;
                    border-left: 3px solid #66bb6a;
                }
                ul {
                    margin-left: 20px;
                    margin-bottom: 15px;
                }
                ul li {
                    margin: 8px 0;
                    color: #555;
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
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🧘 Member Portal Help</h1>
                    <p class="subtitle">Your guide to ZenFlow membership features</p>
                </div>

                <div class="section">
                    <h2>🌟 Welcome to ZenFlow!</h2>
                    <p>We're thrilled to have you as part of our yoga community. Your member portal provides easy access to all the features you need to manage your membership.</p>
                    
                    <div class="feature-box">
                        <h3>Your Member Benefits</h3>
                        <ul>
                            <li><strong>Unlimited Class Access:</strong> Book any class through our scheduling system</li>
                            <li><strong>Community Directory:</strong> Connect with fellow yoga enthusiasts</li>
                            <li><strong>Personal Profile:</strong> Track your progress and manage your account</li>
                            <li><strong>Online Resources:</strong> Access meditation guides and yoga tutorials</li>
                        </ul>
                    </div>
                </div>

                <div class="section">
                    <h2>📞 Need Help?</h2>
                    <p>Our team is here to support you on your yoga journey:</p>
                    <ul>
                        <li><strong>Email:</strong> support@zenflow.yoga</li>
                        <li><strong>Phone:</strong> (555) 123-4567</li>
                        <li><strong>Visit Us:</strong> 123 Peaceful Lane, Downtown</li>
                        <li><strong>Hours:</strong> Monday-Friday 6am-8pm, Saturday-Sunday 7am-6pm</li>
                    </ul>
                </div>

                <div class="back-link">
                    <a href="/">← Back to Member Portal</a>
                </div>
            </div>
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
                }
                .tip-box {
                    background: #fff3e0;
                    border-left: 4px solid #fb8c00;
                    padding: 15px;
                    margin: 20px 0;
                    border-radius: 5px;
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
                        <input type="text" class="search-input" placeholder="Enter member ID (e.g., 1, 2, 3...)" id="searchInput">
                        <p style="margin-top: 10px; font-size: 0.9em; color: #666;">
                            Try searching by member ID to view their public profile. You can find member IDs through class rosters or community events.
                        </p>
                    </div>
                </div>

                <div class="info-section">
                    <h2>Featured Members</h2>
                    
                    <div class="member-card">
                        <div class="member-name">Sarah Martinez (You)</div>
                        <div class="member-info">
                            📧 sarah.martinez@email.com<br>
                            🎫 Basic Membership<br>
                            💫 Favorite Class: Hatha Yoga
                        </div>
                    </div>
                    
                </div>

                <div class="back-link">
                    <a href="/">← Back to Member Portal</a>
                </div>
            </div>
            
            <script>
                document.getElementById('searchInput').addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        const id = this.value.trim();
                        if (id) {
                            window.location.href = '/api/members/user/' + id;
                        }
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
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>👤 My Profile</h1>
                    <p class="subtitle">Manage your membership and personal information</p>
                </div>

                <div class="profile-section">
                    <h2>📋 Account Information</h2>
                    
                    <div class="profile-field">
                        <div class="field-label">Member ID:</div>
                        <div class="field-value">#${CURRENT_USER_ID}</div>
                    </div>
                    <div class="profile-field">
                        <div class="field-label">Username:</div>
                        <div class="field-value">sarah_m</div>
                    </div>
                    <div class="profile-field">
                        <div class="field-label">Email:</div>
                        <div class="field-value">sarah.martinez@email.com</div>
                    </div>
                    <div class="profile-field">
                        <div class="field-label">Member Since:</div>
                        <div class="field-value">June 2024</div>
                    </div>
                </div>

                <div class="profile-section">
                    <h2>🎫 Membership Details</h2>
                    
                    <div class="profile-field">
                        <div class="field-label">Plan:</div>
                        <div class="field-value">Basic Membership</div>
                    </div>
                    <div class="profile-field">
                        <div class="field-label">Renewal Date:</div>
                        <div class="field-value">February 28, 2025</div>
                    </div>
                    <div class="profile-field">
                        <div class="field-label">Favorite Class:</div>
                        <div class="field-value">Hatha Yoga</div>
                    </div>
                    
                    <button class="btn">Upgrade to Premium</button>
                </div>

                <div class="profile-section">
                    <h2>💳 Payment Information</h2>
                    
                    <div class="profile-field">
                        <div class="field-label">Payment Method:</div>
                        <div class="field-value">Credit Card ending in 7821</div>
                    </div>
                    <div class="profile-field">
                        <div class="field-label">Billing Status:</div>
                        <div class="field-value">✅ Active</div>
                    </div>
                </div>

                <div class="back-link">
                    <a href="/">← Back to Member Portal</a>
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
        profileData.flag = 'FLAG{1D0R_PR0F1L3_4CC3SS_V1OL4T10N}';
        profileData._vuln_note = 'Unauthorized access: You accessed another member\'s private profile!';
    }
    
    return res.json(profileData);
});

// Lab 3 - Instructor Dashboard
app.get('/lab3', (req, res) => {
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
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📅 Instructor Dashboard</h1>
                    <p class="subtitle">Manage classes, bookings, and teaching resources</p>
                </div>

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

app.listen(PORT, () => {
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
