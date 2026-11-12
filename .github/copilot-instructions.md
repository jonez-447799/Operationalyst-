# GitHub Copilot & Agent System Instructions for Operationalyst

You are working on Operationalyst (`https://operationalyst.vercel.app/`), a 100% in-browser manufacturing inventory analytical engine.

## Core Architectural Invariants
1. **100% In-Browser Privacy**: Raw factory CSV ledgers are parsed and calculated in-memory inside the user's browser. Never write code that sends raw inventory rows to external servers.
2. **5-Column Schema Contract**:
   - `Part_ID`
   - `Part_Description`
   - `Closing_Stock_Qty`
   - `Unit_Cost_INR`
   - `Last_Movement_Date`
3. **Deterministic Inventory Math**:
   - Dormancy: `ΔDays = AsOfDate − LastMovementDate`
   - Dormancy Brackets: `0–90d`, `91–180d`, `181–365d`, `>365d`
   - Annual Carrying Cost: `AnnualBurn = BookValue * 0.22`
   - Pareto 80/20 Cumulative Value Concentration

## Quality & Build Commands
- Build: `npm run build`
- Invariant Supervision: `node scripts/supervision-gate.mjs`
