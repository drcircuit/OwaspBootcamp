# OWASP Lab Transformation Summary

## Overview
Three OWASP security training labs (A06, A07, A08) have been transformed from hacker/cyberpunk themes to realistic business scenarios while maintaining all security vulnerabilities and learning objectives.

**Goal:** Make security training more relatable and engaging through professional business contexts.

**Date:** December 2024

## Transformations

### A06: TacoTruck Express 🌮
**Business Type:** Food Truck Pre-Ordering System
**Theme:** Vibrant Mexican food branding (reds, oranges, yellows, greens)
**Design:** Warm, friendly food truck aesthetic

#### Menu
- **Carne Asada** - Grilled steak with cilantro & onions - $3.50
- **Al Pastor** - Marinated pork with pineapple - $3.75
- **Pollo Asado** - Grilled chicken with lime - $3.25
- **Vegetarian** - Black beans, peppers & guacamole - $3.00

#### Promo Codes
- `FIRST5` - $5 off (new customers)
- `TACO10` - 10% off
- `LUNCH15` - 15% off
- `FREEGUAC` - $2.50 off

#### Labs & Flags
1. **Order System (Easy)** - Rate limiting vulnerability
   - Flag: `TACO{R4T3_L1M1T_M1SS1NG_3XTR4_GU4C}`
2. **Discount Codes (Medium)** - Logic flaw in promo stacking
   - Flag: `TACO{L0G1C_FL4W_FR33_GU4C4M0L3}`
3. **Account Balance (Hard)** - Race condition in loyalty system ($50 balance)
   - Flag: `TACO{R4C3_C0ND1T10N_3XTR4_T4C0S}`

---

### A07: PawSpa Grooming 🐾
**Business Type:** Pet Grooming Appointment System
**Theme:** Soft, friendly pet care branding (soft blues, greens, pastels)
**Design:** Calming pet spa aesthetic

#### Services
- **Basic Bath** - Wash, dry, and brush - $35
- **Full Groom** - Bath, haircut, nail trim, ear cleaning - $65
- **Deluxe Spa** - Full groom plus massage and aromatherapy - $95
- **Nail Trim Only** - Quick paw maintenance - $15

#### Labs & Flags
1. **Login Portal (Easy)** - Weak password policy
   - Flag: `PAWSPA{W3AK_PAWSW0RD_P0L1CY}`
2. **My Appointments (Medium)** - Predictable session tokens
   - Flag: `PAWSPA{S3SS10N_PR3D1CT4BL3_P3TS}`
3. **Account Recovery (Hard)** - Session hijacking
   - Flag: `PAWSPA{S3SS10N_H1J4CK3D_SP4}`

---

### A08: FreshHarvest Market 🌱
**Business Type:** Farmers Market Vendor Portal
**Theme:** Organic, earthy branding (greens, browns, earth tones)
**Design:** Natural, wholesome farmer's market aesthetic

#### Vendors & Products
- **Green Valley Farms** - Organic tomatoes, peppers, seasonal vegetables
- **Urban Harvest Co-op** - Fresh herbs, microgreens, salad mixes
- **Bee Happy Apiary** - Local honey, beeswax candles, pollen
- **Artisan Bread Collective** - Sourdough, whole grain, specialty loaves

#### Labs & Flags
1. **Product Updates (Easy)** - Unsigned update mechanism
   - Flag: `HARVEST{UPD4T3_N0T_V3R1F13D}`
2. **Vendor Portal (Medium)** - Missing checksum validation
   - Flag: `HARVEST{N0_CHK5UM_0RG4N1C}`
3. **File Manager (Hard)** - Unsigned file uploads
   - Flag: `HARVEST{N0_S1GN4TUR3_FR3SH}`

---

## Technical Details

### Structure Maintained
Each lab maintains the original structure:
- `/` - Home page with business overview
- `/example` - Tutorial/educational walkthrough
- `/lab1` - Easy challenge
- `/lab2` - Medium challenge
- `/lab3` - Hard challenge
- API endpoints for each lab

### Vulnerabilities Preserved
All original security vulnerabilities and exploit methods remain functional:
- A06: Rate limiting, logic flaws, race conditions
- A07: Weak passwords, predictable sessions, session hijacking
- A08: Unsigned updates, missing checksums, unsigned uploads

### Design Principles
- Professional modern design matching business type
- Realistic business data and scenarios
- No external dependencies (emoji/text only)
- Self-contained HTML/CSS/JavaScript
- Working API endpoints with business context

## Testing
All three transformed files have been validated:
- ✓ JavaScript syntax validated
- ✓ All flags correctly updated
- ✓ API endpoints functional
- ✓ No external dependencies required (except Node.js modules in package.json)
