# Portal UI Screenshots and Visual Guide

> **Note:** Since this is running in a headless environment, this document provides detailed descriptions of what users will see. Instructors should capture actual screenshots when running locally.

## 1. Setup Page (First Visit)
**URL:** `http://localhost:3100/setup`

### Visual Description:
- **Dark Background:** Deep space-themed (#050810) with animated grid overlay
- **Centered Form Card:** Glowing green border (#00ff41) with semi-transparent background
- **Header:** 
  - Large emoji: 🎭
  - Title: "WELCOME HACKER" in Orbitron font with green glow
  - Subtitle: "Join NotSoAnonymous in taking down Evil Capitalistic Corp" in neon blue
  
- **Form Fields:**
  - Username input (green border, dark background)
  - Password input (minimum 6 characters)
  - Hacker Alias input (optional, with placeholder suggestions)
  - Large gradient button: "> INITIALIZE MISSION_"
  
- **Footer Note:** Warning about local-only operation

### Animated Effects:
- Scanline effect moving down the screen
- Grid animation scrolling upward
- Form fields glow on focus
- Button hover: brightness increase + shadow glow

---

## 2. Login Page
**URL:** `http://localhost:3100/login`

### Visual Description:
Similar to setup page but with:
- Title: "🔓 ACCESS PORTAL"
- Subtitle: "NotSoAnonymous Mission Control"
- Two fields: username and password
- Button: "> LOGIN_"
- Footer: Target info showing "Evil Capitalistic Corp - Status: Vulnerable"

---

## 3. Dashboard (Mission Control)
**URL:** `http://localhost:3100/dashboard`

### Visual Description:

**Header Section:**
- Left: 🎭 NotSoAnonymous logo in Orbitron font
- Center: Red alert box with "TARGET: Evil Capitalistic Corp"
- Right: Navigation (Dashboard, Logout)
- Background: Semi-transparent card with green glow
- Top-right corner: "> SYSTEM ACCESS GRANTED_" with blinking cursor

**Hero Banner:**
- Large title: "🔥 MISSION CONTROL 🔥" in neon blue glow
- Welcome message with user's hacker alias in pink
- Mission statement in red warning color
- Animated rotating gradient background

**Progress Section:**
- **4 Stat Cards in Grid:**
  1. Challenges Pwned (large green number)
  2. Total Challenges (large green number)
  3. Reputation Points (large green number)
  4. Mission Complete % (large green number)
  
  Each card:
  - Dark background with green border
  - Moving light sweep animation
  - Orbitron font for numbers
  - Blue labels in caps
  
- **Progress Bar:**
  - Full width, terminal green border
  - Animated gradient fill (green to blue)
  - Shine effect moving across
  - Percentage text below

**Attack Methodology Grid:**
5 stage cards in responsive grid:

1. **🔍 Recon Card**
   - Icon floats with animation
   - Title: "Recon" in green glow
   - Description text
   - Progress: "3/3 ✓" if complete
   - Hover: lifts up with blue glow

2. **📡 Scanning Card**
   - Similar layout, orange difficulty indicators
   
3. **🔓 Initial Access Card**
   - Red warning color scheme
   
4. **🔐 Maintained Access Card**
   - Purple expert color scheme
   
5. **👻 Cover Tracks Card**
   - Ghost theme, stealth colors

Each card:
- Clickable (cursor pointer)
- Hover effect: lifts and glows
- Shows completion status

**Footer:**
- Hacker tip box with pink border
- Warning message about educational use
- NotSoAnonymous collective credit

---

## 4. Stage Challenge Page
**URL:** `http://localhost:3100/stage/1` (example: Recon stage)

### Visual Description:

**Hero Section:**
- Stage icon (🔍) + stage name
- Full stage description
- Back button

**Challenge List:**
Multiple challenge cards, each showing:

**Challenge Card Layout:**
```
┌─────────────────────────────────────────────────┐
│ ✓ Debug Endpoint Discovery        [Easy] [100pts]│
│ OWASP A02                                        │
│                                                  │
│ Description: Evil Capitalistic Corp left their   │
│ debug endpoints exposed...                       │
│                                                  │
│ Target: http://localhost:3002                    │
│                                                  │
│ ▼ Show Hint                                      │
│   Hint text appears here...                      │
│                                                  │
│ [Flag Input: NSA{...}    ] [Submit Flag]        │
│ OR                                               │
│ ✓ PWNED on 01/05/2026                           │
└─────────────────────────────────────────────────┘
```

**Completed challenges:** Blue glow border, checkmark
**Incomplete challenges:** Green border
**Failed attempts:** Red counter showing "Attempts: X"

**Difficulty Badges:**
- Easy: Green with glow
- Medium: Orange
- Hard: Red
- Expert: Purple

---

## 5. Victory/Diploma Page
**URL:** `http://localhost:3100/victory`

### Visual Description:

**Confetti Animation:**
- Continuous falling confetti in all neon colors
- Random rotation and timing
- Covers entire screen

**Main Content:**
- **Title:** "🎉 MISSION ACCOMPLISHED! 🎉" with glitch animation
- **Emoji Row:** 💀🔥💀 floating
- **Success Message:** "Evil Capitalistic Corp has been EXPOSED!" in pink

**Diploma Card:**
Large, prominent card with glowing blue border:

```
┌──────────────────────────────────────────────┐
│       🏆 CERTIFICATE OF PWNERSHIP 🏆        │
│                                              │
│           This certifies that                │
│                                              │
│            [HACKER ALIAS]                    │
│          (in pink, 2rem font)                │
│                                              │
│   Has successfully completed all challenges  │
│                   in the                     │
│                                              │
│          OWASP BOOTCAMP 2025                 │
│          (in blue, 1.8rem font)             │
│                                              │
│   By exploiting [X] points worth of          │
│   vulnerabilities in ECC's infrastructure    │
│                                              │
│   Master of: Recon, Scanning, Initial Access,│
│   Maintained Access, and Covering Tracks     │
│                                              │
│   Completed on: January 5, 2026              │
│                                              │
│   - The NotSoAnonymous Collective -          │
│   "We are all script kiddies on this day"    │
└──────────────────────────────────────────────┘
```

**What You've Learned Section:**
Green-bordered box with checklist:
- ✓ OWASP Top 10 2025 vulnerabilities
- ✓ Attack methodology
- ✓ Real-world techniques
- etc.

**Action Buttons:**
- "View Dashboard"
- "Share Achievement 🎉"

**Floating Emojis Row:**
🎭 💀 🔓 💻 🔥 🎯 ⚡ 🏴 ✨

---

## Color Palette Reference

```css
Terminal Green:    #00ff41  ████ (Primary, headings, success)
Neon Blue:         #00d4ff  ████ (Secondary, subtitles)
Neon Pink:         #ff006e  ████ (Accents, emphasis)
Neon Purple:       #8b5cf6  ████ (Expert difficulty)
Warning Red:       #ff0040  ████ (Danger, target)
Dark Background:   #0a0e27  ████ (Card backgrounds)
Darker Background: #050810  ████ (Page background)
```

---

## Animation Effects

### 1. Background Grid
- Vertical lines and horizontal lines
- Slow upward scroll
- Faint green glow (#00ff41 at 3% opacity)
- 20-second animation loop

### 2. Scanline
- Horizontal lines moving down
- 8-second animation
- Subtle flicker effect
- 2-pixel line height

### 3. Card Animations
- **Hover:** Lift up 5px, increase box-shadow
- **Shine:** Light sweep across surface
- **Glow:** Pulsing border brightness

### 4. Progress Bar
- Animated fill (0-100%)
- Gradient shift
- Light sweep effect

### 5. Victory Page
- **Confetti:** Continuous falling particles
- **Title Glitch:** Random 2px shifts
- **Floating:** Emoji row bobs up and down

### 6. Text Effects
- **Headings:** 0 0 10-20px glow
- **Buttons:** Brightness increase + shadow on hover
- **Inputs:** Border glow on focus

---

## Typography

### Fonts:
1. **Orbitron** (Google Fonts)
   - Used for: Main headings, numbers, titles
   - Weights: 400, 700, 900
   - Character: Futuristic, geometric, bold

2. **Share Tech Mono** (Google Fonts)
   - Used for: Body text, descriptions, forms
   - Weight: 400
   - Character: Monospace, terminal-like

### Font Sizes:
- Main title: 3rem (Hero)
- Section titles: 1.5-2rem
- Stats: 2.5rem
- Body: 1rem
- Small labels: 0.85-0.9rem

---

## Responsive Behavior

### Desktop (>768px):
- Stat cards: 4-column grid
- Stage cards: 3-column grid
- Full navigation visible

### Mobile (<768px):
- Stat cards: 1-column stack
- Stage cards: 1-column stack
- Logo text smaller (1.5rem)
- Reduced padding

---

## User Interaction Flows

### Success Flow:
1. User submits correct flag
2. Green success alert slides in from left
3. Challenge card glows blue
4. Checkmark appears
5. Points added to counter (animated count-up)
6. If 100%: Redirect to victory (1.5s delay)

### Error Flow:
1. User submits wrong flag
2. Red error alert slides in
3. Input shakes/vibrates
4. Attempt counter increases
5. Input cleared and refocused

---

## Key UI Principles

1. **Maximum Contrast:** Always readable text
2. **Consistent Glow:** All interactive elements glow
3. **Smooth Animations:** 0.3s transitions
4. **Clear Hierarchy:** Size, color, and position indicate importance
5. **Feedback:** Every action has visual response
6. **Theme Consistency:** Hacker aesthetic throughout

---

## Accessibility Considerations

While maintaining the hacker theme:
- ✅ High contrast ratios (green on dark)
- ✅ Keyboard navigation support
- ✅ Clear focus indicators
- ✅ Readable font sizes
- ⚠️ Animations can be intense (consider prefers-reduced-motion)

---

**To capture screenshots:** Run `docker compose up -d` and visit http://localhost:3100 in your browser!
