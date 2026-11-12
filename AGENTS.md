# Operationalyst Autonomous Multi-Agent Matrix Constitution

## System Architecture & Directory Map
Operationalyst is an Expert-League Autonomous Operating System for manufacturing inventory intelligence (Phase 1: GitHub).

```
Operationalyst-/
├── .github/
│   ├── agents/
│   │   ├── operationalyst-supervisor.agent.md
│   │   ├── operationalyst-issue-fixer.agent.md
│   │   ├── operationalyst-market-research.agent.md
│   │   └── operationalyst-implementer.agent.md
│   ├── workflows/
│   │   ├── operationalyst-supervision.yml
│   │   ├── self-healing-fixer.yml
│   │   └── market-intelligence-radar.yml
│   ├── copilot-instructions.md
│   └── dependabot.yml
├── docs/
│   └── market-intelligence/
│       └── latest-market-radar.md
├── scripts/
│   ├── supervision-gate.mjs
│   └── market-radar.mjs
├── package.json
└── SECURITY.md
```

## Build & Supervision Commands
- **Build**: `npm run build` (vite build)
- **Supervision Invariants**: `node scripts/supervision-gate.mjs`
- **Lint**: `npm run lint` (`tsc --noEmit`)

## Multi-Agent Handoff Loop
1. **Market Research Specialist**: Fetches live industrial RSS/news signals -> Generates strategic report in `docs/market-intelligence/` -> Files actionable PRD issue labeled `agent-ready-spec`.
2. **Supervisor Specialist**: Evaluates PRD against 27-Dimension Behavioral Architecture & 6-Stage Inventory Math Invariants -> Assigns implementation parameters.
3. **Implementer Specialist**: Writes clean React/TypeScript code -> Ensures 100% in-browser processing & zero server egress.
4. **Self-Healing Fixer Specialist**: Triages Dependabot PRs -> Auto-approves & merges minor/patch updates -> Executes AI Root-Cause Surgeon on opened issues.

## Strict Operational Boundaries
- **Always**: Enforce 100% local in-browser CSV parsing, zero server upload, 5-column schema contracts, and deterministic math equations.
- **Ask First**: Modifying repository security permissions or deleting production branches.
- **Never**: Commit frontend secrets, break production deployment at `https://operationalyst.vercel.app/`, or transmit factory ledgers to external APIs.
