# A06 Insecure Design Refactoring

## Port: 3000 → 3006
## Theme: SecureBank Online Banking

## Example - Account Security Demo
- Clean banking dashboard with account overview
- Auto-loads 4 API calls for DevTools discovery
- APIs: /api/example/account, /api/example/transactions, /api/example/rewards, /api/example/debug
- Flag: NSA{D3S1GN_FL4WS_F0UND}

## Lab 1 - Rate Limiting Bypass (PIN Verification)
- Clean PIN verification interface for account access
- Hint: "Use automation tools to test multiple PIN attempts"
- POST /api/verify-pin with {account_id, pin}
- VULNERABLE: No rate limiting on PIN attempts
- Brute force 4-digit PIN (valid: 1035)
- Flag: NSA{N0_R4T3_L1M1T}

## Lab 2 - Business Logic Flaw (Discount Stacking)
- Clean checkout interface with promo code entry
- Hint: "Test how the system handles multiple discount codes"
- POST /api/checkout with {cart_total, promo_codes: []}
- VULNERABLE: Same promo code can be applied multiple times
- Stack "SAVE20" code 5+ times for >100% discount
- Flag: NSA{L0G1C_FL4W_F0UND}

## Lab 3 - Race Condition (Concurrent Withdrawals)
- Clean account balance/withdrawal interface
- Hint: "Try making simultaneous withdrawal requests"
- POST /api/withdraw with {amount}
- VULNERABLE: No transaction locking, balance check happens before deduction
- Multiple simultaneous requests can overdraw account
- Flag: NSA{R4C3_C0ND1T10N_3XPL01T3D}

