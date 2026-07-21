# AutoPlan Pro — Complete Project Guide for Freshers

## WHY SEPARATE FILES? (The key idea)

Think of it like building a house:
- You don't pour the foundation, build walls, and paint all in one step
- Each worker does ONE job
- If the painter messes up, only that file needs fixing

Same with React components:
```
❌ WRONG — Everything in one file (your old code)
   App.jsx — 1700 lines doing layout + drawing + UI + logic

✅ RIGHT — Each file does one job
   constants/index.js   → Just data (no logic)
   utils/layoutEngine.js → Just math (no React)
   components/ui/Card.jsx → Just a white box
   components/steps/Step1Owner.jsx → Just the owner form
```

---

## FOLDER STRUCTURE (What each folder does)

```
autoplan-frontend/
├── src/
│   ├── main.jsx          ← Entry point. Never touch this.
│   ├── App.jsx           ← Root. Only assembles Header + Steps
│   │
│   ├── constants/
│   │   └── index.js      ← ALL fixed data (dropdowns, presets, colors)
│   │                        If a dropdown changes → edit ONLY this file
│   │
│   ├── utils/
│   │   ├── helpers.js    ← Small math helpers (mToFt, ftIn, rc)
│   │   ├── vastuEngine.js ← Vastu scoring logic (no React)
│   │   └── layoutEngine.js ← Room position math (no React)
│   │
│   ├── context/
│   │   └── PlanContext.jsx ← Global state shared by all 5 steps
│   │                         No prop drilling needed
│   │
│   ├── hooks/
│   │   ├── useToast.js   ← Toast add/remove logic (reusable)
│   │   └── useGenerate.js ← Plan generation animation (reusable)
│   │
│   └── components/
│       ├── ui/            ← Tiny building blocks
│       │   ├── Button.jsx    → PrimaryBtn, GhostBtn, SpinBtn, TabBtn
│       │   ├── Card.jsx      → White box with gold title bar
│       │   ├── FormFields.jsx → Input, Select, Spinner, TextArea, Field
│       │   └── InfoBox.jsx   → InfoBox, StatBox, Grid2, Grid4, Toast, EmptyTab
│       │
│       ├── layout/
│       │   └── Header.jsx    → Sticky top bar with step progress
│       │
│       ├── steps/         ← One file per wizard step
│       │   ├── Step1Owner.jsx
│       │   ├── Step2Plot.jsx
│       │   ├── Step3Rooms.jsx
│       │   ├── Step4Options.jsx
│       │   └── Step5Plan.jsx
│       │
│       ├── tabs/          ← Tab panels inside Step5
│       │   ├── VastuTab.jsx
│       │   ├── ScheduleTab.jsx
│       │   └── SpecTab.jsx
│       │
│       └── canvas/        ← Canvas drawing (not React components)
│           ├── drawHelpers.js   → Shared primitives (door, window, compass)
│           ├── drawDetailed.js  → Full blueprint drawing
│           └── drawSchematic.js → Single-line schematic drawing

autoplan-backend/
├── server.js             ← Sets up Express. No route logic here.
├── routes/
│   ├── plan.routes.js    ← Defines URL paths only
│   └── auth.routes.js
├── controllers/
│   ├── plan.controller.js ← Actual business logic
│   └── auth.controller.js
└── middleware/
    └── errorHandler.js   ← Global error catcher
```

---

## STEP-BY-STEP SETUP

### Step 1: Install Node.js
Download from: https://nodejs.org (choose LTS)
Check install worked:
```bash
node --version   # should show v20.x.x
npm --version    # should show 10.x.x
```

### Step 2: Setup Frontend
```bash
cd autoplan-frontend
npm install        # downloads all packages
npm run dev        # starts at http://localhost:5173
```

### Step 3: Setup Backend (new terminal)
```bash
cd autoplan-backend
npm install        # downloads express, cors, dotenv
npm run dev        # starts at http://localhost:5000
```

### Step 4: Test backend is running
Open browser: http://localhost:5000/api/health
Should show: `{"status":"ok"}`

---

## HOW DATA FLOWS (The Golden Rule)

```
User types in Step1Owner.jsx
  → calls set('owner', 'Rajesh')
  → PlanContext updates global state
  → Step5Plan reads cfg.owner from same context
  → Canvas title block shows "Rajesh"
```

Data goes DOWN (context → component via usePlan())
Updates go UP (component → context via set())

---

## COMPONENT RULES

1. ONE component = ONE job
2. If a file is > 100 lines, consider splitting it
3. Never put canvas drawing inside React components
4. Never put API calls inside UI components → put in api/ folder
5. Never repeat styles → put in ui/ components
6. Fixed arrays/objects → put in constants/

---

## HOW TO ADD A NEW STEP

1. Create: `src/components/steps/Step6.jsx`
2. Add to STEPS_LIST in `constants/index.js`
3. Import and render in `App.jsx` like: `{step === 6 && <Step6 />}`
Done! No other files need changing.

---

## HOW TO ADD A NEW BUTTON STYLE

1. Open `components/ui/Button.jsx`
2. Add your new export function
3. Import it anywhere you need it

---

## COMMON ERRORS AND FIXES

| Error | Cause | Fix |
|-------|-------|-----|
| `npm not found` | Node.js not installed | Install from nodejs.org |
| `CORS error` | Backend missing cors | Add `app.use(cors())` |
| `Module not found` | Wrong import path | Check the path, add .jsx extension |
| White screen | JS crash | Open F12 console, read the error |
| Port already in use | Something else on port 5173/5000 | Change port in vite.config.js or .env |
