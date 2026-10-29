# Agent 07 — Public finance & taxation (Operation 10M)

**Branch:** `op10m/agent-07-public-finance`  
**Module root:** `operation-10m/agent-07-public-finance/`  
**Canonical merge:** Agent 25 only — do **not** edit `(V9.4) australia-game-with-ai.tsx` on this branch.

## Scope

National **budget envelopes**, **revenue** (tax instruments + ledger), **sovereign debt** trajectories, **infrastructure financing** stacks, and **cross-layer reconciliation** against audited V10.12 fiscal capacity boundaries.

| Module | Path | Role |
|--------|------|------|
| Fiscal outcomes (V10.14) | `modules/fiscal-outcomes/` | Tax catalog, budget envelope, debt outcomes, GI hooks, policy scenarios |
| Revenue ledger | `modules/revenue-ledger/` | Stream-level revenue accounting tied to V10.12 structural capacity |
| Infrastructure financing | `modules/infrastructure-financing/` | Pay-go vs debt-funded capital stacks for projects |
| Reconciliation | `modules/reconciliation/` | Envelope + ledger + boundary checks |

## Commands

```bash
npm run test:op10m-agent07          # fiscal + reconciliation suites
npm run test:op10m-agent07:fiscal   # V10.14 fiscal outcomes only
```

## Assembly

`scripts/bundle-for-agent25.py` concatenates module sources in merge order for SECTION 20AW extension (Agent 25 pipeline).

See [INTEGRATION.md](./INTEGRATION.md) for state keys, prerequisites, and regression hooks.
