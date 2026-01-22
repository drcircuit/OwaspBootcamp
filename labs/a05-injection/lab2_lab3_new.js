// Lab 2 - NoSQL Injection via Product Filters
app.get('/lab2', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Advanced Filters - ShopTech</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 Advanced Product Filters</h1>
          <p class="subtitle">Lab 2: Refine Your Search</p>
        </div>

        <div class="welcome-section">
          <h2>Filter Products</h2>
          <p>Use our advanced filtering system to find exactly what you need.</p>
          
          <div style="margin-top: 30px; background: #f8f9fa; padding: 25px; border-radius: 10px;">
            <div style="margin-bottom: 20px;">
              <label style="display:block; margin-bottom:8px; font-weight:600;">Price Range:</label>
              <input type="number" id="price-min" placeholder="Min" style="width:45%; padding:10px; border:2px solid #ddd; border-radius:5px;">
              <input type="number" id="price-max" placeholder="Max" style="width:45%; padding:10px; border:2px solid #ddd; border-radius:5px; margin-left:10px;">
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display:block; margin-bottom:8px; font-weight:600;">Category:</label>
              <select id="category" style="width:100%; padding:10px; border:2px solid #ddd; border-radius:5px;">
                <option value="">All Categories</option>
                <option value="audio">Audio</option>
                <option value="wearables">Wearables</option>
                <option value="accessories">Accessories</option>
                <option value="office">Office</option>
                <option value="video">Video</option>
                <option value="peripherals">Peripherals</option>
                <option value="storage">Storage</option>
              </select>
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display:block; margin-bottom:8px; font-weight:600;">Minimum Rating:</label>
              <input type="number" id="rating" min="1" max="5" step="0.1" placeholder="e.g., 4.5" style="width:100%; padding:10px; border:2px solid #ddd; border-radius:5px;">
            </div>
            
            <button onclick="applyFilters()" class="demo-button" style="width:100%; padding:15px; font-size:1.1em;">Apply Filters</button>
          </div>
          
          <div id="filter-results" style="margin-top: 30px;"></div>
          
          <div class="hint-box" style="margin-top: 30px;">
            <strong>💡 Discovery Tip:</strong> Try using gobuster to find filter API endpoints.<br>
            Advanced users: Check the request payload format in DevTools Network tab.
          </div>
        </div>

        <div class="back-link">
          <a href="/">← Back to Home</a>
        </div>
      </div>

      <script>
        async function applyFilters() {
          const resultsDiv = document.getElementById('filter-results');
          
          const filters = {
            price_min: document.getElementById('price-min').value,
            price_max: document.getElementById('price-max').value,
            category: document.getElementById('category').value,
            rating: document.getElementById('rating').value
          };
          
          resultsDiv.innerHTML = '<p style="color:#667eea;">Applying filters...</p>';
          
          try {
            const response = await fetch('/api/filter', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(filters)
            });
            
            const data = await response.json();
            
            if (data.flag) {
              resultsDiv.innerHTML = \`
                <div style="background:#e8f5e9; border-left:4px solid #2e7d32; padding:20px; border-radius:8px; margin-bottom:20px;">
                  <h3 style="color:#2e7d32;">🎯 Flag Found!</h3>
                  <p style="font-weight:bold; margin-top:10px;">\${data.flag}</p>
                  <p style="margin-top:10px;">\${data.message}</p>
                </div>
              \`;
            }
            
            if (data.results && data.results.length > 0) {
              resultsDiv.innerHTML += \`
                <h3 style="color:#667eea; margin-bottom:15px;">Found \${data.results.length} product(s):</h3>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(250px, 1fr)); gap:15px;">
                  \${data.results.map(p => \`
                    <div class="card">
                      <h4>\${p.name}</h4>
                      <p style="font-size:1.3em; color:#667eea; font-weight:bold;">$\${p.price}</p>
                      <p style="color:#666;">\${p.category}</p>
                      <p style="color:#f39c12;">⭐ \${p.rating}/5</p>
                    </div>
                  \`).join('')}
                </div>
              \`;
            } else if (!data.flag) {
              resultsDiv.innerHTML = '<p style="color:#999;">No products match your filters.</p>';
            }
          } catch (error) {
            resultsDiv.innerHTML = '<p style="color:#c62828;">Connection error: ' + error.message + '</p>';
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Lab 2 API - VULNERABLE: NoSQL Injection in filters
app.post('/api/filter', (req, res) => {
  const filters = req.body;
  
  // VULNERABLE: Accepts arbitrary JSON object that could contain NoSQL operators
  // In a real MongoDB scenario: db.products.find(filters) would execute injected operators
  
  // Detect NoSQL injection attempts
  const filterStr = JSON.stringify(filters);
  const hasNoSQLOperators = filterStr.includes('$gt') || filterStr.includes('$lt') || 
                            filterStr.includes('$ne') || filterStr.includes('$where') ||
                            filterStr.includes('$regex') || filterStr.includes('$in');
  
  if (hasNoSQLOperators) {
    // NoSQL injection detected - return all products with flag
    return res.json({
      success: true,
      flag: 'NSA{N0SQL_BYP4SS3D}',
      message: 'NoSQL injection detected! Query operators bypassed normal filtering logic.',
      injected_filter: filters,
      results: products,
      explanation: 'In a real MongoDB database, operators like $gt, $where, etc. can bypass intended query logic.'
    });
  }
  
  // Normal filtering logic
  let results = products;
  
  if (filters.price_min) {
    results = results.filter(p => p.price >= parseFloat(filters.price_min));
  }
  if (filters.price_max) {
    results = results.filter(p => p.price <= parseFloat(filters.price_max));
  }
  if (filters.category) {
    results = results.filter(p => p.category === filters.category);
  }
  if (filters.rating) {
    results = results.filter(p => p.rating >= parseFloat(filters.rating));
  }
  
  res.json({
    success: true,
    results: results,
    count: results.length,
    filters_applied: filters
  });
});

// Lab 3 - Command Injection via Image Processing
app.get('/lab3', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Image Processor - ShopTech</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🖼️ Product Image Processor</h1>
          <p class="subtitle">Lab 3: Optimize Your Images</p>
        </div>

        <div class="welcome-section">
          <h2>Image Processing Tool</h2>
          <p>Process and optimize product images for your catalog.</p>
          
          <div style="margin-top: 30px; background: #f8f9fa; padding: 25px; border-radius: 10px;">
            <div style="margin-bottom: 20px;">
              <label style="display:block; margin-bottom:8px; font-weight:600;">Image Filename:</label>
              <input type="text" id="filename" placeholder="e.g., product-001.jpg" style="width:100%; padding:12px; border:2px solid #ddd; border-radius:5px;">
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display:block; margin-bottom:8px; font-weight:600;">Operation:</label>
              <select id="operation" style="width:100%; padding:12px; border:2px solid #ddd; border-radius:5px;">
                <option value="resize">Resize</option>
                <option value="compress">Compress</option>
                <option value="convert">Convert Format</option>
                <option value="optimize">Optimize</option>
              </select>
            </div>
            
            <button onclick="processImage()" class="demo-button" style="width:100%; padding:15px; font-size:1.1em;">Process Image</button>
          </div>
          
          <div id="process-results" style="margin-top: 30px;"></div>
          
          <div class="hint-box" style="margin-top: 30px;">
            <strong>💡 Discovery Tip:</strong> Use gobuster to find image processing endpoints.<br>
            System commands often process file operations on the backend.
          </div>
        </div>

        <div class="back-link">
          <a href="/">← Back to Home</a>
        </div>
      </div>

      <script>
        async function processImage() {
          const filename = document.getElementById('filename').value;
          const operation = document.getElementById('operation').value;
          const resultsDiv = document.getElementById('process-results');
          
          if (!filename) {
            resultsDiv.innerHTML = '<p style="color:#c62828;">Please enter a filename</p>';
            return;
          }
          
          resultsDiv.innerHTML = '<p style="color:#667eea;">Processing image...</p>';
          
          try {
            const response = await fetch('/api/process-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filename, operation })
            });
            
            const data = await response.json();
            
            if (data.flag) {
              resultsDiv.innerHTML = \`
                <div style="background:#e8f5e9; border-left:4px solid #2e7d32; padding:20px; border-radius:8px;">
                  <h3 style="color:#2e7d32;">🎯 Command Injection Detected!</h3>
                  <p style="font-weight:bold; margin-top:10px;">\${data.flag}</p>
                  <pre style="background:#fff; padding:15px; border-radius:5px; margin-top:15px; overflow-x:auto; font-size:0.9em;">\${data.output || data.message}</pre>
                </div>
              \`;
            } else if (data.success) {
              resultsDiv.innerHTML = \`
                <div style="background:#e3f2fd; border-left:4px solid #1976d2; padding:20px; border-radius:8px;">
                  <h3 style="color:#1976d2;">✓ Processing Complete</h3>
                  <p style="margin-top:10px;">\${data.message}</p>
                  <p style="color:#666; font-size:0.9em; margin-top:10px;">Output: \${data.output_file}</p>
                </div>
              \`;
            } else {
              resultsDiv.innerHTML = \`<p style="color:#c62828;">\${data.error || 'Processing failed'}</p>\`;
            }
          } catch (error) {
            resultsDiv.innerHTML = '<p style="color:#c62828;">Connection error: ' + error.message + '</p>';
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Lab 3 API - VULNERABLE: Command Injection in image processing
app.post('/api/process-image', (req, res) => {
  const { filename, operation } = req.body;
  
  if (!filename || !operation) {
    return res.status(400).json({
      error: 'Missing required parameters: filename and operation'
    });
  }
  
  // VULNERABLE: Command injection through unsanitized input
  // In reality, this would use child_process.exec() with unsanitized input
  const commandInjectionChars = [';', '|', '&', '$', '`', '\n', '(', ')', '<', '>'];
  const hasInjection = commandInjectionChars.some(char => filename.includes(char) || operation.includes(char));
  
  if (hasInjection) {
    // Simulate command injection execution
    const simulatedCommand = `convert ${filename} -${operation} output.jpg`;
    
    return res.json({
      success: true,
      flag: 'NSA{C0MM4ND_1NJ3CT3D}',
      message: 'Command injection detected! System commands were executed.',
      vulnerable_command: simulatedCommand,
      output: `Simulated command execution:
$ ${simulatedCommand}

uid=33(www-data) gid=33(www-data) groups=33(www-data)
/var/www/shoptech
total 24K
drwxr-xr-x 5 www-data www-data 4.0K Jan 22 10:30 .
drwxr-xr-x 3 root     root     4.0K Jan 15 14:20 ..
-rw-r--r-- 1 www-data www-data  156 Jan 22 09:45 .env
drwxr-xr-x 2 www-data www-data 4.0K Jan 22 10:15 uploads
-rw------- 1 www-data www-data 2.1K Jan 20 16:30 database.key

WARNING: Command injection allows arbitrary system command execution!`,
      explanation: 'Characters like ; | & $ allow chaining or substituting system commands, leading to complete server compromise.'
    });
  }
  
  // Normal image processing (simulated)
  const operations = {
    'resize': 'Resized to 800x600',
    'compress': 'Compressed to 85% quality',
    'convert': 'Converted to WebP format',
    'optimize': 'Optimized file size'
  };
  
  res.json({
    success: true,
    message: `Image processing complete: ${operations[operation] || 'Processed'}`,
    input_file: filename,
    output_file: `processed_${filename}`,
    operation: operation
  });
});

