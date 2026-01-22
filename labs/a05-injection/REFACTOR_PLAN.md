# A05 Injection Refactoring Plan

## Changes Overview
- **Port**: 3000 → 3005
- **Theme**: ShopTech E-Commerce (unchanged)
- **Approach**: Remove tutorials, implement clean discovery-based pattern

## Route Structure

### Example - Product Catalog Discovery
**Route**: `/example`
- Clean product catalog page showing 8 products
- Auto-loads 4 API endpoints in background (DevTools discovery)
- Minimal hint: "Use browser DevTools to explore how this page loads data"
- **APIs**:
  - GET `/api/example/products` - Returns partial product list
  - GET `/api/example/products/list` - Returns full list with hint about featured
  - GET `/api/example/products/featured` - Featured products
  - GET `/api/example/products/debug` - Debug endpoint with flag
- **Flag**: `NSA{D3BUG_PR0DUCTS_F0UND}`

### Lab 1 - SQL Injection (Error-Based)
**Route**: `/lab1`
- Clean product search interface
- Single search input, no tutorials
- Hint: "Use gobuster to discover API endpoints"
- **API**: GET `/api/search?q=<query>`
  - VULNERABLE: Direct string concatenation in SQL
  - Normal queries work fine
  - SQL injection chars (`'`, `"`, `--`, `OR`) trigger database errors
  - Errors expose table structure and credentials
- **Flag**: `NSA{SQL_3RR0R_1NJ3CT}`
- **Exploit**: `?q=' OR '1'='1` or `?q=test'--`

### Lab 2 - NoSQL Injection
**Route**: `/lab2`
- Clean product filtering interface
- Filter by price range, category, rating
- Hint: "Try gobuster to find filter endpoints"
- **API**: POST `/api/filter`
  - Accepts JSON: `{"price": 100, "category": "audio"}`
  - VULNERABLE: NoSQL query injection
  - Normal queries work
  - Injection: `{"price": {"$gt": 0}}` or `{"$where": "1==1"}`
  - Returns all products + flag when injected
- **Flag**: `NSA{N0SQL_BYP4SS3D}`

### Lab 3 - Command Injection
**Route**: `/lab3`
- Clean image processing interface
- Upload/process product images
- Hint: "Check for image processing endpoints"
- **API**: POST `/api/process-image`
  - Accepts JSON: `{"filename": "product.jpg", "operation": "resize"}`
  - VULNERABLE: Executes shell commands without sanitization
  - Uses `child_process.exec()` with unsanitized input
  - Injection vectors:
    - `filename: "'; ls; #"`
    - `operation: "resize; cat /etc/passwd"`
- **Flag**: `NSA{C0MM4ND_1NJ3CT3D}`

## Implementation Steps
1. ✅ Change PORT to 3005
2. 🔄 Replace `/example` route (lines 268-592)
3. ⏳ Replace Example API endpoints (lines 518-592)
4. ⏳ Replace `/lab1` route and `/api/search` (lines 594-700)
5. ⏳ Replace `/lab2` route and `/api/filter` (lines 702-850)
6. ⏳ Replace `/lab3` route and `/api/process-image` (lines 850-1045)
7. ⏳ Update console.log message with port 3005
8. ⏳ Test all routes and validate syntax

## Removed Content
- All tutorial boxes with step-by-step instructions
- Interactive demos with explanations
- IDOR vulnerabilities
- Part 1/2/3/4 subdivisions in Example
- Secure implementation examples in labs

## Key Principles
- **Discovery over tutorials**: No hand-holding
- **Realistic recon**: gobuster + DevTools
- **Progressive difficulty**: Example (easy) → Lab 1 (medium) → Lab 2 (hard) → Lab 3 (expert)
- **Clean UI**: Professional e-commerce look
- **Focused vulnerabilities**: Pure injection, no other vuln types
