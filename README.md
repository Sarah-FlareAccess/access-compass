# Access Compass 🧭

**Clear, practical accessibility priorities for Australian visitor economy businesses.**

## Project Overview

Access Compass helps visitor economy business owners identify and prioritize accessibility improvements through a structured assessment process that generates a personalized Disability Inclusion Action Plan (DIAP).

## Built With

- React 18 + TypeScript
- Vite (fast build tool)
- React Router (routing)
- LocalStorage (session persistence)
- Supabase ready (Phase 2)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Your Supabase credentials are already in .env!
   # Add your Anthropic API key when ready
   ```

3. **Set up database (optional for MVP):**
   - See `SUPABASE_SETUP.md` for detailed instructions
   - Run `database-schema.sql` in your Supabase SQL Editor
   - The app works with localStorage only until you enable auth

4. **Start dev server:**
   ```bash
   npm run dev
   ```

5. **Open:** http://localhost:5173

## User Journey (10 Steps)

1. **Landing** - Introduction & CTA
2. **Business Snapshot** - Business type & basic info
3. **Module Selection** - Choose accessibility areas to review
4. **Discovery Questions** - Answer accessibility questions
5. **Constraints** - Set budget, capacity, timeframe
6. **Dashboard** - View AI-generated action plan
7. **Action Detail** - Implementation steps for each action
8. **DIAP Workspace** - Manage all actions
9. **Clarify Later** - Review "Not sure" items
10. **Export** - Download PDF summary

## Current State

### ✅ Complete (MVP v1)

- All 10 pages built & styled
- React Router navigation
- LocalStorage session management
- Question flow with progress tracking
- Module recommendation system
- Mock action generation (placeholder for Claude API)
- Full design system implementation
- Mobile responsive

### 🚧 Next Steps (For You)

1. **Claude API Integration** - Replace mock data in `Constraints.tsx` with real Claude API call
2. **PDF Generation** - Implement jsPDF export functionality
3. **Supabase Integration** - Add auth & database (Phase 2)
4. **Evidence Upload** - File uploads in ActionDetail page
5. **Full Question Set** - Load complete CSV question inventory

## Key Features

- **Session Persistence:** Progress saved in localStorage (survives refresh/close)
- **Conditional Logic:** Modules recommended based on business type
- **Auto-save:** DIAP fields save automatically
- **Responsive:** Works on mobile, tablet, desktop

## Environment Variables

```bash
VITE_ANTHROPIC_API_KEY=sk-ant-...    # Required for action generation
VITE_SUPABASE_URL=https://...        # Optional (Phase 2)
VITE_SUPABASE_ANON_KEY=eyJ...        # Optional (Phase 2)
```

## Project Structure

```
src/
├── pages/          # 10 page components
├── types/          # TypeScript definitions
├── utils/          # Session management
├── data/           # Modules & sample questions
├── styles/         # CSS files
├── App.tsx         # Router setup
└── main.tsx        # Entry point
```

## Design System

- **Colors:** Purple-Coral gradient, warm orange accents
- **Typography:** System font stack, WCAG AAA contrast
- **Components:** Rounded corners, generous spacing, gradient backgrounds

## Scripts

```bash
npm run dev       # Dev server
npm run build     # Production build
npm run preview   # Preview production build
```

## Documentation

- Full spec: `../Access Compass w Nic/AccessCompass_SpecSheet_REVIEWED.md`
- Question inventory: `../Access Compass w Nic/Access Compass Question Inventory - V2 15_12_25 (2).csv`

---

**Built for the Australian visitor economy** 🇦🇺
