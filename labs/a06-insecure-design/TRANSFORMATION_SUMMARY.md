# A06 Insecure Design - Transformation Summary

## Overview
Transformed the A06 (Insecure Design) lab from static HTML pages to interactive AJAX-based demonstrations, following the patterns established in A01 and A02 labs.

## Key Changes

### 1. Example Page (Interactive Tutorial)
**Before:** Static "About Us" page with basic information  
**After:** Interactive tutorial with 3 live demos

- **Demo 1: Order Verification** - Shows rate limiting tracking with attempt counter
- **Demo 2: Discount Testing** - Preview of promo code stacking
- **Demo 3: Balance Withdrawal** - Preview of race condition with concurrent requests

All demos use `fetch()` AJAX calls and display real-time results.

### 2. Lab 1: Rate Limiting (Easy)
**Before:** Static description page  
**After:** Interactive brute-force demonstration

**Features:**
- Manual order code verification input
- Auto brute-force button (tests codes 1000-1050)
- Attempt counter visible in API responses
- Flag awarded after 50+ attempts: `TACO{R4T3_L1M1T_M1SS1NG_3XTR4_GU4C}`
- Reset button to restart the lab
- DevTools tips for watching network requests

**Vulnerability:** Missing rate limiting allows unlimited verification attempts

### 3. Lab 2: Business Logic Flaw (Medium)
**Before:** Static description with promo code list  
**After:** Interactive checkout system

**Features:**
- Visual item selector (Taco, Burrito, Quesadilla, Nachos)
- Selected items highlight with CSS
- Promo code input (comma-separated, allows duplicates!)
- Real-time discount calculation
- Flag awarded when discount > 50%: `TACO{L0G1C_FL4W_FR33_GU4C4M0L3}`
- Shows discount percentage and savings breakdown

**Vulnerability:** No validation prevents applying same promo code multiple times

### 4. Lab 3: Race Condition (Hard)
**Before:** Static description  
**After:** Interactive account balance system

**Features:**
- Live balance display ($50.00 starting)
- Single withdrawal button
- **3 Concurrent Withdrawals** button (triggers race condition)
- Balance check button
- Reset button
- Flag awarded on overdraft: `TACO{R4C3_C0ND1T10N_3XTR4_T4C0S}`

**Vulnerability:** Check-then-act race condition (TOCTOU) allows overdrafts

## Technical Implementation

### AJAX Pattern
All labs use `fetch()` API instead of form submissions:
```javascript
async function operation() {
  const response = await fetch('/api/endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data })
  });
  const result = await response.json();
  // Display result and flag if present
}
```

### UI Components

**Green Flag-Reveal Boxes:**
```css
.flag-reveal {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  color: white;
  padding: 20px;
  /* Shows flag when captured */
}
```

**Orange Tip Boxes:**
```css
.hint-box {
  background: #FFF3E0;
  border-left: 4px solid #FF9800;
  /* DevTools guidance */
}
```

**Interactive Demo Sections:**
```css
.interactive-demo {
  background: #FFF3E0;
  /* Hands-on exercises */
}
```

### API Endpoints

**Example Tutorial:**
- `POST /api/example/verify-order` - Demo order verification
- `POST /api/example/test-discount` - Demo discount stacking
- `POST /api/example/test-withdraw` - Demo race condition

**Lab 1:**
- `POST /api/lab1/verify-order` - Verify order code (no rate limit)
- `POST /api/lab1/reset` - Reset attempt counter

**Lab 2:**
- `POST /api/lab2/checkout` - Process order with promo codes (allows duplicates)

**Lab 3:**
- `GET /api/lab3/balance` - Check current balance
- `POST /api/lab3/withdraw` - Withdraw funds (race condition vulnerable)
- `POST /api/lab3/reset` - Reset balance to $50.00

## DevTools Integration

Each lab includes guidance for using browser DevTools:
- **Network Tab:** Watch API requests in real-time
- **Request Payload:** See how data is sent (especially arrays in Lab 2)
- **Concurrent Requests:** Lab 3 shows multiple requests firing simultaneously
- **Response Data:** View flags and vulnerability information

## Flags

| Lab | Flag | Trigger Condition |
|-----|------|-------------------|
| Lab 1 | `TACO{R4T3_L1M1T_M1SS1NG_3XTR4_GU4C}` | Make 50+ verification attempts |
| Lab 2 | `TACO{L0G1C_FL4W_FR33_GU4C4M0L3}` | Apply same code 7+ times for >50% discount |
| Lab 3 | `TACO{R4C3_C0ND1T10N_3XTR4_T4C0S}` | Overdraft via 3 concurrent $30 withdrawals |

## Testing

All labs tested and verified:
```bash
✅ Lab 1: Flag awarded after 50+ attempts
✅ Lab 2: Flag awarded with 7x TACO10 code
✅ Lab 3: Race condition logic verified (timing dependent)
✅ All reset endpoints functional
✅ DevTools integration confirmed
✅ CodeQL security scan: 0 alerts
```

## Themes Maintained
- 🌮 TacoTruck Express branding throughout
- Orange/Red color scheme (#FF6B35, #F7931E, #C1121F)
- Food truck terminology (orders, loyalty balance, promo codes)
- Consistent styling with A01/A02 patterns

## Educational Value

Each lab now includes:
1. **Interactive demonstration** - Hands-on learning
2. **Vulnerability explanation** - Clear description of the flaw
3. **Impact assessment** - Real-world consequences
4. **Secure implementation** - Code examples of proper fixes
5. **DevTools guidance** - How to observe the vulnerability

## Files Modified
- `server.js` - Complete rewrite with interactive AJAX demos
- `test-labs.sh` - Test script for verification (new)

## Compatibility
- Works with existing port configuration (3006)
- Maintains all original flags
- Compatible with instructor writeup
- No dependency changes required
