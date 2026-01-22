// Example page - Product Catalog with DevTools Discovery
app.get('/example', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ShopTech Product Catalog</title>
      ${styles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🛍️ ShopTech Product Catalog</h1>
          <p class="subtitle">Example: Discover Our Products</p>
        </div>

        <div class="welcome-section">
          <h2>Featured Electronics</h2>
          <p>Browse our selection of premium tech products. All items ship free within 2-3 business days.</p>
          
          <div class="hint-box" style="margin-top: 20px;">
            <strong>�� Discovery Tip:</strong> Use browser DevTools (F12 → Network tab) to explore how this page loads product data.
          </div>
        </div>

        <div id="products-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:20px; margin:30px 0;">
          <div style="text-align:center; padding:40px; color:#999;">Loading products...</div>
        </div>

        <div class="back-link">
          <a href="/">← Back to Home</a>
        </div>
      </div>

      <script>
        // Auto-load product data on page load (visible in DevTools Network tab)
        window.addEventListener('DOMContentLoaded', async () => {
          try {
            // Make API calls in sequence (discoverable in DevTools)
            await fetch('/api/example/products');
            await fetch('/api/example/products/list');
            await fetch('/api/example/products/featured');
            const debugResp = await fetch('/api/example/products/debug');
            const debugData = await debugResp.json();
            
            // Display products from debug endpoint
            const grid = document.getElementById('products-grid');
            if (debugData.products && debugData.products.length > 0) {
              grid.innerHTML = debugData.products.map(p => \`
                <div class="card">
                  <h3>\${p.name}</h3>
                  <p style="font-size:1.5em; color:#667eea; font-weight:bold;">$\${p.price}</p>
                  <p style="color:#666; font-size:0.9em;">\${p.category}</p>
                  <p style="color:#999; font-size:0.85em;">SKU: \${p.sku}</p>
                  <p style="color:#f39c12;">⭐ \${p.rating}/5</p>
                </div>
              \`).join('');
            }
          } catch (error) {
            document.getElementById('products-grid').innerHTML = 
              '<div style="color:red; padding:20px;">Error loading products</div>';
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Example API - Part 1: Initial products endpoint
app.get('/api/example/products', (req, res) => {
  res.json({
    success: true,
    message: 'Part 1/4: Basic product endpoint',
    hint: 'Try /api/example/products/list for more details',
    count: products.length
  });
});

// Example API - Part 2: Product list
app.get('/api/example/products/list', (req, res) => {
  res.json({
    success: true,
    message: 'Part 2/4: Product list endpoint',
    hint: 'Check /api/example/products/featured for special items',
    products: products.slice(0, 4).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price
    }))
  });
});

// Example API - Part 3: Featured products
app.get('/api/example/products/featured', (req, res) => {
  res.json({
    success: true,
    message: 'Part 3/4: Featured products',
    hint: 'There might be a debug endpoint with more information',
    featured: products.filter(p => p.rating >= 4.7)
  });
});

// Example API - Part 4: Debug endpoint with flag
app.get('/api/example/products/debug', (req, res) => {
  res.json({
    success: true,
    message: 'Part 4/4: Debug endpoint found!',
    flag: 'NSA{D3BUG_PR0DUCTS_F0UND}',
    products: products,
    debug_info: {
      database: 'shoptech_prod',
      version: '1.2.3',
      api_endpoints: [
        '/api/search',
        '/api/filter',
        '/api/process-image'
      ]
    }
  });
});

