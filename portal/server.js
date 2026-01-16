const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3100;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'portal',
  user: process.env.DB_USER || 'portal_user',
  password: process.env.DB_PASSWORD || 'portal_pass',
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware
const requireAuth = async (req, res, next) => {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.redirect('/login');
  }
  try {
    const result = await pool.query('SELECT * FROM portal_users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      res.clearCookie('userId');
      return res.redirect('/login');
    }
    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.redirect('/login');
  }
};

// Check if first time setup is needed
const checkFirstTimeSetup = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT COUNT(*)::int as count FROM portal_users');
    if (result.rows[0].count === 0) {
      return res.redirect('/setup');
    }
    next();
  } catch (err) {
    console.error('Setup check error:', err);
    res.status(500).send('Database error');
  }
};

// Home - redirects to login or dashboard
app.get('/', checkFirstTimeSetup, (req, res) => {
  if (req.cookies.userId) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login');
  }
});

// First time setup page
app.get('/setup', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*)::int as count FROM portal_users');
    if (result.rows[0].count !== 0) {
      return res.redirect('/login');
    }
    res.render('setup', { error: null });
  } catch (err) {
    console.error('Setup page error:', err);
    res.status(500).send('Database error');
  }
});

// Handle first time setup
app.post('/setup', async (req, res) => {
  const { username, password, hacker_alias } = req.body;
  
  try {
    const userCount = await pool.query('SELECT COUNT(*)::int as count FROM portal_users');
    if (userCount.rows[0].count !== 0) {
      return res.redirect('/login');
    }
    
    if (!username || !password || password.length < 6) {
      return res.render('setup', { error: 'Username and password (min 6 chars) required' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO portal_users (username, password_hash, hacker_alias) VALUES ($1, $2, $3) RETURNING id',
      [username, hashedPassword, hacker_alias || username]
    );
    
    res.cookie('userId', result.rows[0].id, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Setup error:', err);
    res.render('setup', { error: 'Setup failed: ' + err.message });
  }
});

// Login page
app.get('/login', checkFirstTimeSetup, (req, res) => {
  if (req.cookies.userId) {
    return res.redirect('/dashboard');
  }
  res.render('login', { error: null });
});

// Handle login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const result = await pool.query('SELECT * FROM portal_users WHERE username = $1', [username]);
    
    if (result.rows.length === 0) {
      return res.render('login', { error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!passwordMatch) {
      return res.render('login', { error: 'Invalid credentials' });
    }
    
    res.cookie('userId', user.id, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.redirect('/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    res.render('login', { error: 'Login failed' });
  }
});

// Logout
app.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect('/login');
});

// Dashboard - main hub
app.get('/dashboard', requireAuth, async (req, res) => {
  try {
    // Get all OWASP topics with challenges
    const topicsResult = await pool.query(`
      SELECT 
        c.owasp_category,
        COUNT(c.id) as total_challenges,
        SUM(CASE WHEN up.completed = true THEN 1 ELSE 0 END) as completed_challenges
      FROM challenges c
      LEFT JOIN user_progress up ON up.challenge_id = c.id AND up.user_id = $1
      GROUP BY c.owasp_category
      ORDER BY c.owasp_category
    `, [req.user.id]);
    
    // Get total progress
    const progressResult = await pool.query(`
      SELECT 
        COUNT(c.id) as total_challenges,
        SUM(CASE WHEN up.completed = true THEN 1 ELSE 0 END) as completed_challenges,
        SUM(CASE WHEN up.completed = true THEN c.points ELSE 0 END) as total_points
      FROM challenges c
      LEFT JOIN user_progress up ON up.challenge_id = c.id AND up.user_id = $1
    `, [req.user.id]);
    
    const progress = progressResult.rows[0];
    const completionPercentage = progress.total_challenges > 0 
      ? Math.round((progress.completed_challenges / progress.total_challenges) * 100) 
      : 0;
    
    res.render('dashboard', {
      user: req.user,
      topics: topicsResult.rows,
      progress: {
        completed: parseInt(progress.completed_challenges) || 0,
        total: parseInt(progress.total_challenges) || 0,
        percentage: completionPercentage,
        points: parseInt(progress.total_points) || 0
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send('Error loading dashboard');
  }
});

// OWASP Topic view - show all challenges for an OWASP category
app.get('/topic/:category', requireAuth, async (req, res) => {
  try {
    const category = req.params.category.toUpperCase();
    
    // Get challenges for this OWASP category with user progress
    const challengesResult = await pool.query(`
      SELECT c.*, 
        up.completed,
        up.completed_at,
        up.attempts
      FROM challenges c
      LEFT JOIN user_progress up ON up.challenge_id = c.id AND up.user_id = $1
      WHERE c.owasp_category = $2
      ORDER BY c.challenge_order
    `, [req.user.id, category]);
    
    if (challengesResult.rows.length === 0) {
      return res.status(404).send('OWASP category not found');
    }
    
    res.render('topic', {
      user: req.user,
      category: category,
      challenges: challengesResult.rows
    });
  } catch (err) {
    console.error('Topic error:', err);
    res.status(500).send('Error loading topic');
  }
});

// Submit flag for a challenge
app.post('/submit-flag', requireAuth, async (req, res) => {
  const { challenge_id, flag } = req.body;
  
  try {
    // Get challenge details
    const challengeResult = await pool.query('SELECT * FROM challenges WHERE id = $1', [challenge_id]);
    if (challengeResult.rows.length === 0) {
      return res.json({ success: false, message: 'Challenge not found' });
    }
    
    const challenge = challengeResult.rows[0];
    
    // Check if already completed
    const progressResult = await pool.query(
      'SELECT * FROM user_progress WHERE user_id = $1 AND challenge_id = $2',
      [req.user.id, challenge_id]
    );
    
    if (progressResult.rows.length > 0 && progressResult.rows[0].completed) {
      return res.json({ success: false, message: 'Challenge already completed!' });
    }
    
    // Check flag
    if (flag.trim() === challenge.flag) {
      // Update or insert progress
      if (progressResult.rows.length > 0) {
        await pool.query(
          'UPDATE user_progress SET completed = true, completed_at = NOW(), flag_submitted = $1 WHERE user_id = $2 AND challenge_id = $3',
          [flag, req.user.id, challenge_id]
        );
      } else {
        await pool.query(
          'INSERT INTO user_progress (user_id, challenge_id, completed, completed_at, flag_submitted, attempts) VALUES ($1, $2, true, NOW(), $3, 1)',
          [req.user.id, challenge_id, flag]
        );
      }
      
      // Check if all challenges completed for victory screen
      const totalProgress = await pool.query(`
        SELECT COUNT(c.id) as total, SUM(CASE WHEN up.completed = true THEN 1 ELSE 0 END) as completed
        FROM challenges c
        LEFT JOIN user_progress up ON up.challenge_id = c.id AND up.user_id = $1
      `, [req.user.id]);
      
      const allCompleted = totalProgress.rows[0].total === totalProgress.rows[0].completed;
      
      return res.json({ 
        success: true, 
        message: '🎉 Flag accepted! Challenge completed!', 
        points: challenge.points,
        allCompleted: allCompleted
      });
    } else {
      // Increment attempts
      if (progressResult.rows.length > 0) {
        await pool.query(
          'UPDATE user_progress SET attempts = attempts + 1 WHERE user_id = $1 AND challenge_id = $2',
          [req.user.id, challenge_id]
        );
      } else {
        await pool.query(
          'INSERT INTO user_progress (user_id, challenge_id, completed, attempts) VALUES ($1, $2, false, 1)',
          [req.user.id, challenge_id]
        );
      }
      
      return res.json({ success: false, message: '❌ Invalid flag. Try again!' });
    }
  } catch (err) {
    console.error('Submit flag error:', err);
    res.json({ success: false, message: 'Error submitting flag' });
  }
});

// Victory/Diploma page
app.get('/victory', requireAuth, async (req, res) => {
  try {
    // Check if user has completed all challenges
    const progressResult = await pool.query(`
      SELECT 
        COUNT(c.id) as total_challenges,
        SUM(CASE WHEN up.completed = true THEN 1 ELSE 0 END) as completed_challenges,
        SUM(CASE WHEN up.completed = true THEN c.points ELSE 0 END) as total_points
      FROM challenges c
      LEFT JOIN user_progress up ON up.challenge_id = c.id AND up.user_id = $1
    `, [req.user.id]);
    
    const progress = progressResult.rows[0];
    
    if (progress.total_challenges !== progress.completed_challenges) {
      return res.redirect('/dashboard');
    }
    
    res.render('victory', {
      user: req.user,
      points: parseInt(progress.total_points) || 0,
      completedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Victory page error:', err);
    res.status(500).send('Error loading victory page');
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'NotSoAnonymous Portal' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🎭 NotSoAnonymous Portal running on port ${PORT}`);
  console.log(`💀 Target: Evil Capitalistic Corp`);
  console.log(`🔓 Mission: Expose their security failures`);
});
