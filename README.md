# TriageSim - Hospital A&E Operations Dashboard
Frontend prototype for a fictional hospital A&E triage operations platform.

## Shared Simulation State (Across All Screens)
State is managed with react's inbuilt ContextApi.
`SimulationProvider` + `useReducer` in `src/context/simulation-context.tsx`.
The provider holds simulation status, timer, live feed items, and activity log entries.
This avoids prop drilling and ensures cross-route synchronization.

## Libraries Beyond React + TypeScript
- `shadcn`, `tailwindcss`, `@tailwindcss/vite`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `sonner`

## Trade-offs / Shortcuts (24-hour constraint)
- Use of AI for generation of given mock data types, mock live cases descriptions, and utility functions(`src\lib\utils.ts`).
- Capacity chart is a lightweight Tailwind-based stacked bar (no charting library).
- Use of dropdown instead of radio/segmented control for priority selection in manual case inject modal. 

## Incomplete / Deprioritized Items
- Dark mode toggle icon is present in sidebar but theme switching logic is not wired.
- Colour theme combination is basic

