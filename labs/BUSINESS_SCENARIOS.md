# Business Scenarios Quick Reference

This guide provides quick access to the transformed business scenario labs.

## 🌮 A06: TacoTruck Express
**Location:** `labs/a06-insecure-design/`  
**Port:** 3006  
**Theme:** Food truck pre-ordering system

### Business Data
- **Menu:** Carne Asada ($3.50), Al Pastor ($3.75), Pollo ($3.25), Vegetarian ($3.00)
- **Promos:** FIRST5, TACO10, LUNCH15, FREEGUAC
- **Loyalty:** $50.00 rewards balance

### Labs
1. **Order System** (Easy) - Rate limiting
2. **Discount Codes** (Medium) - Logic flaw
3. **Account Balance** (Hard) - Race condition

### Flags
- `TACO{R4T3_L1M1T_M1SS1NG_3XTR4_GU4C}`
- `TACO{L0G1C_FL4W_FR33_GU4C4M0L3}`
- `TACO{R4C3_C0ND1T10N_3XTR4_T4C0S}`

---

## 🐾 A07: PawSpa Grooming
**Location:** `labs/a07-auth-failures/`  
**Port:** 3007  
**Theme:** Pet grooming appointment system

### Business Data
- **Services:** Basic Bath ($35), Full Groom ($65), Deluxe Spa ($95), Nail Trim ($15)
- **Pets:** Dogs, Cats, various breeds
- **Groomers:** Sarah, Mike, Emma

### Labs
1. **Login Portal** (Easy) - Weak passwords
2. **My Appointments** (Medium) - Predictable sessions
3. **Account Recovery** (Hard) - Session hijacking

### Flags
- `PAWSPA{W3AK_PAWSW0RD_P0L1CY}`
- `PAWSPA{S3SS10N_PR3D1CT4BL3_P3TS}`
- `PAWSPA{S3SS10N_H1J4CK3D_SP4}`

---

## 🌱 A08: FreshHarvest Market
**Location:** `labs/a08-integrity/`  
**Port:** 3008  
**Theme:** Farmers market vendor portal

### Business Data
- **Vendors:** Green Valley Farms, Urban Harvest, Bee Happy Apiary
- **Products:** Organic Tomatoes, Fresh Herbs, Local Honey, Artisan Bread
- **Markets:** Saturday Downtown, Sunday Central Park

### Labs
1. **Product Updates** (Easy) - Unsigned updates
2. **Vendor Portal** (Medium) - No checksums
3. **File Manager** (Hard) - Unsigned uploads

### Flags
- `HARVEST{UPD4T3_N0T_V3R1F13D}`
- `HARVEST{N0_CHK5UM_0RG4N1C}`
- `HARVEST{N0_S1GN4TUR3_FR3SH}`

---

## Quick Start

```bash
# Start a specific lab
cd labs/a06-insecure-design
npm install
npm start

# Access in browser
http://localhost:3006/
```

## Testing Examples

### TacoTruck (Rate Limiting)
```bash
for i in {1..15}; do
  curl -X POST http://localhost:3006/api/lab1/quick-order \
    -H "Content-Type: application/json" \
    -d '{"phone":"555-0123","items":["Carne Asada"]}'
done
```

### PawSpa (Weak Password)
```bash
curl -X POST http://localhost:3007/api/lab1/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"123"}'
```

### FreshHarvest (Unsigned Update)
```bash
curl http://localhost:3008/api/lab1/update-info
```

---

## Design Principles

Each lab follows these principles:
- ✅ Professional business design
- ✅ Realistic data and scenarios
- ✅ No external dependencies (emoji only)
- ✅ Same vulnerability patterns as originals
- ✅ Educational tutorial pages
- ✅ Working API endpoints with examples

---

**Note:** These are intentionally vulnerable training labs. Do not deploy in production environments.
