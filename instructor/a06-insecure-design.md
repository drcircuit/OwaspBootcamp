# A06: Insecure Design - Instructor Writeup

**Lab URL:** http://localhost:3006  
**Topic:** OWASP Top 10 2025 - A06: Insecure Design  
**Difficulty:** Easy → Medium → Hard  
**Theme:** SecureBank Online Banking 🏦

---

## Overview

This lab demonstrates insecure design patterns through a realistic online banking system. Students learn about missing rate limiting, business logic flaws in financial transactions, and race conditions—all design-level vulnerabilities that can't be fixed by input validation alone.

### Real-World Impact
- **Account Takeover:** Unlimited PIN guessing attempts
- **Financial Fraud:** Logic flaws enable unauthorized transfers
- **Race Condition Exploits:** Concurrent withdrawals cause overdrafts
- **Regulatory Violations:** Failed security controls trigger compliance issues

### Learning Objectives
- Understand design-level security flaws in financial systems
- Identify missing security controls (rate limiting, transaction verification)
- Exploit business logic vulnerabilities in money transfers
- Demonstrate race condition attacks on balance calculations

---

## Challenge Summary

| Lab | Vulnerability | Solution | Flag |
|-----|---------------|----------|------|
| Lab 1 | Missing Rate Limiting | Brute force account PINs | `NSA{N0_R4T3_L1M1T}` |
| Lab 2 | Logic Flaw | Exploit transfer validation bypass | `NSA{L0G1C_FL4W_F0UND}` |
| Lab 3 | Race Condition | Concurrent withdrawals cause overdraft | `NSA{R4C3_C0ND1T10N_3XPL01T3D}` |

---

## LAB 1: Order Verification - Missing Rate Limiting

**Difficulty:** Easy  
**Stage:** Recon

### Vulnerability
No rate limiting on order verification endpoint. Attacker can brute force valid order codes.

### Exploitation
```bash
# Manual testing
for code in {1000..1050}; do
    curl -X POST http://localhost:3006/api/lab1/verify-order \
      -H "Content-Type: application/json" \
      -d "{\"orderCode\": \"$code\"}"
done
```

### Flag Trigger
After multiple attempts (tracking is shown but not enforced), the system reveals the vulnerability flag.

### Vulnerable Code
```javascript
app.post('/api/lab1/verify-order', (req, res) => {
    const { orderCode } = req.body;
    
    // DESIGN FLAW: Tracks attempts but never blocks
    attemptCount++;
    
    if (attemptCount > 50) {
        // Flag awarded but access NOT blocked
        return res.json({
            flag: 'TACO{R4T3_L1M1T_M1SS1NG_3XTR4_GU4C}',
            message: 'Rate limiting missing - unlimited attempts allowed'
        });
    }
});
```

### Secure Design
```javascript
const rateLimit = require('express-rate-limit');

// Rate limiter middleware
const orderVerifyLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 10,  // 10 attempts per window
    message: 'Too many verification attempts, try again later'
});

app.post('/api/lab1/verify-order', orderVerifyLimiter, (req, res) => {
    const { orderCode } = req.body;
    // Verification logic
});
```

### Teaching Points
- Rate limiting must be designed into the system from the start
- Critical for authentication, password reset, and verification endpoints
- Use proven middleware (express-rate-limit, rate-limiter-flexible)
- Consider distributed rate limiting (Redis) for scaled applications

---

## LAB 2: Checkout - Business Logic Flaw

**Difficulty:** Medium  
**Stage:** Scanning

### Vulnerability
Discount codes can be applied multiple times to the same order, reducing price beyond intended limits.

### Exploitation
```bash
curl -X POST http://localhost:3006/api/lab2/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": ["taco", "burrito"],
    "promoCodes": ["TACO10", "TACO10", "TACO10", "TACO10"]
  }'
```

### Vulnerable Code
```javascript
app.post('/api/lab2/checkout', (req, res) => {
    let total = calculateTotal(req.body.items);
    
    // DESIGN FLAW: No validation of duplicate promo codes
    req.body.promoCodes.forEach(code => {
        if (code === 'TACO10') {
            total *= 0.9;  // 10% off, applied multiple times!
        }
    });
    
    if (total < originalTotal * 0.5) {
        // Flag when discount exceeds 50%
        res.json({
            flag: 'TACO{L0G1C_FL4W_FR33_GU4C4M0L3}',
            total: total
        });
    }
});
```

### Secure Design
```javascript
app.post('/api/lab2/checkout', (req, res) => {
    let total = calculateTotal(req.body.items);
    const appliedCodes = new Set();  // Track used codes
    const maxDiscount = 0.3;  // Maximum 30% total discount
    let totalDiscount = 0;
    
    for (const code of req.body.promoCodes) {
        // 1. Prevent duplicate codes
        if (appliedCodes.has(code)) {
            continue;  // Skip already used codes
        }
        
        // 2. Validate code exists and is active
        const promoDetails = await db.getPromoCode(code);
        if (!promoDetails || !promoDetails.isActive) {
            continue;
        }
        
        // 3. Check usage limits per customer
        const usageCount = await db.getPromoUsage(req.user.id, code);
        if (usageCount >= promoDetails.maxUsesPerCustomer) {
            continue;
        }
        
        // 4. Apply discount with limits
        const discount = promoDetails.discountPercent;
        if (totalDiscount + discount <= maxDiscount) {
            total *= (1 - discount);
            totalDiscount += discount;
            appliedCodes.add(code);
            
            // 5. Record usage
            await db.recordPromoUsage(req.user.id, code);
        }
    }
    
    res.json({ total, appliedCodes: Array.from(appliedCodes) });
});
```

### Teaching Points
- Business logic flaws require design-level thinking
- Validate all business rules server-side
- Consider edge cases: multiple applications, stacking, timing
- Implement maximum discount caps
- Log all transactions for fraud detection

---

## LAB 3: Wallet - Race Condition Attack

**Difficulty:** Hard  
**Stage:** Initial Access

### Vulnerability
Check-then-act race condition in balance withdrawal. Multiple concurrent requests can overdraft the account.

### Exploitation
```bash
# Terminal 1-5: Execute simultaneously (within 100ms window)
curl -X POST http://localhost:3006/api/lab3/withdraw \
  -H "Content-Type: application/json" \
  -d '{"amount": 30}' &

curl -X POST http://localhost:3006/api/lab3/withdraw \
  -H "Content-Type: application/json" \
  -d '{"amount": 30}' &

curl -X POST http://localhost:3006/api/lab3/withdraw \
  -H "Content-Type: application/json" \
  -d '{"amount": 30}' &

# Wait for all to complete
wait
```

**Expected:** 3 withdrawals of $30 = $90, but balance is only $50  
**Result:** All 3 succeed due to race condition, overdrafting to negative balance

### Vulnerable Code
```javascript
let balance = 50;

app.post('/api/lab3/withdraw', async (req, res) => {
    const { amount } = req.body;
    
    // RACE CONDITION: Check and act are separate, not atomic
    if (balance >= amount) {
        // Artificial delay simulates database/processing time
        await sleep(100);
        
        balance -= amount;  // Multiple threads can reach here!
        
        if (balance < 0) {
            res.json({
                flag: 'TACO{R4C3_C0ND1T10N_3XTR4_T4C0S}',
                balance: balance,
                message: 'Race condition exploited - overdraft occurred'
            });
        }
    }
});
```

### Secure Design - Option 1: Mutex Lock
```javascript
const { Mutex } = require('async-mutex');
const withdrawMutex = new Mutex();

app.post('/api/lab3/withdraw', async (req, res) => {
    const { amount } = req.body;
    
    // Acquire lock before checking balance
    const release = await withdrawMutex.acquire();
    
    try {
        if (balance >= amount) {
            await sleep(100);
            balance -= amount;
            res.json({ success: true, balance });
        } else {
            res.status(400).json({ error: 'Insufficient funds' });
        }
    } finally {
        release();  // Always release lock
    }
});
```

### Secure Design - Option 2: Database Transaction
```javascript
app.post('/api/lab3/withdraw', async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;
    
    try {
        await db.query('BEGIN');
        
        // SELECT FOR UPDATE locks the row
        const result = await db.query(
            'SELECT balance FROM accounts WHERE user_id = $1 FOR UPDATE',
            [userId]
        );
        
        const currentBalance = result.rows[0].balance;
        
        if (currentBalance < amount) {
            await db.query('ROLLBACK');
            return res.status(400).json({ error: 'Insufficient funds' });
        }
        
        // Update is atomic within transaction
        await db.query(
            'UPDATE accounts SET balance = balance - $1 WHERE user_id = $2',
            [amount, userId]
        );
        
        await db.query('COMMIT');
        
        res.json({ success: true, newBalance: currentBalance - amount });
        
    } catch (err) {
        await db.query('ROLLBACK');
        res.status(500).json({ error: 'Transaction failed' });
    }
});
```

### Secure Design - Option 3: Optimistic Locking
```javascript
app.post('/api/lab3/withdraw', async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;
    
    // Get current balance and version
    const account = await db.query(
        'SELECT balance, version FROM accounts WHERE user_id = $1',
        [userId]
    );
    
    const { balance, version } = account.rows[0];
    
    if (balance < amount) {
        return res.status(400).json({ error: 'Insufficient funds' });
    }
    
    // Update only if version hasn't changed (no concurrent modification)
    const result = await db.query(
        `UPDATE accounts 
         SET balance = balance - $1, version = version + 1 
         WHERE user_id = $2 AND version = $3`,
        [amount, userId, version]
    );
    
    if (result.rowCount === 0) {
        // Version mismatch - concurrent modification detected
        return res.status(409).json({ 
            error: 'Concurrent modification detected, retry' 
        });
    }
    
    res.json({ success: true });
});
```

### Teaching Points
- Race conditions are design flaws, not coding bugs
- Critical for: financial transactions, inventory, limited resources
- Use mutex locks for in-memory state
- Use database transactions for persistence
- Use optimistic locking for high concurrency
- Test with concurrent requests in development

---

## Design Security Principles

### Secure by Design Framework

1. **Threat Modeling:** Identify threats during design phase
2. **Security Requirements:** Define security controls upfront
3. **Defense in Depth:** Multiple layers of security
4. **Fail Securely:** Defaults deny access
5. **Least Privilege:** Minimal permissions required
6. **Separation of Duties:** No single point of control
7. **Complete Mediation:** Check every access attempt

### Common Design Flaws

| Flaw | Example | Mitigation |
|------|---------|------------|
| Missing rate limiting | Unlimited login attempts | express-rate-limit middleware |
| TOCTOU | Check-then-use file access | Atomic operations |
| Business logic bypass | Price manipulation | Server-side validation |
| Insufficient workflow | Skip payment step | State machine validation |
| Trust boundaries | Client-side price | Never trust client data |

---

## Common Student Questions

**Q: Can't we just validate input to prevent these?**  
A: No! These are design flaws. Input validation helps, but you need proper architecture: rate limiting, atomic operations, and business rule enforcement.

**Q: Are race conditions only in multi-threaded applications?**  
A: No! Even single-threaded Node.js is vulnerable due to async I/O. Multiple requests can be processed concurrently.

**Q: How do we test for race conditions?**  
A: Use concurrent testing tools (Apache Bench, k6, custom scripts with Promise.all), load testing, and code review for check-then-act patterns.

---

## Remediation Checklist

- [ ] Rate limiting on all sensitive endpoints
- [ ] Business rules enforced server-side
- [ ] Atomic operations for critical transactions
- [ ] Input validation as defense-in-depth
- [ ] Threat modeling completed
- [ ] State machines for complex workflows
- [ ] Audit logging for all critical operations
- [ ] Load testing with concurrent requests

---

## Additional Resources
- [OWASP Insecure Design](https://owasp.org/Top10/A04_2021-Insecure_Design/)
- [Threat Modeling Manifesto](https://www.threatmodelingmanifesto.org/)
- [STRIDE Threat Model](https://docs.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats)
