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
| Budget appropriation lines | `modules/budget-lines/` | Sub-line appropriation paper reconciled to envelope rows |
| Federal–state IGR | `modules/federal-state/` | GST/health/education transfer reconciliation across 8 states |
| Fiscal resilience | `modules/fiscal-resilience/` | Shock catalog and stacked stress assessment |
| Debt rollover | `modules/debt-rollover/` | Maturity ladder rollover outcomes and liquidity edge cases |
| Reconciliation | `modules/reconciliation/` | Envelope + ledger + boundary checks |
| Multi-year framework | `modules/multi-year-framework/` | MYEFO-style ceilings and forward estimate bands |
| Contingent liabilities | `modules/contingent-liabilities/` | Off-balance-sheet exposures and soft-cap assessment |
| Fiscal transparency | `modules/fiscal-transparency/` | Disclosure tier index for budget papers and open data |
| Infrastructure financing | `modules/infrastructure-financing/` | Pay-go vs debt capital stacks (with self-tests) |

### Scale wave round 6

- **statutory-balances/** — net operating balance, fiscal balance, net debt-to-capacity anchors
- **cost-recovery-pricing/** — user-charge portfolio recovery ratios (water, tolls, licensing, copayments)
- **consolidated-fiscal/** — CF15–CF20 wiring rules, issuance, program performance, infra portfolio; `layerCount` **18**

### Scale wave round 4

- **multi-year-framework/** — category expenditure ceilings, forward bands, parameter-settings growth
- **contingent-liabilities/** — guarantee/PPP/backstop register with stress-weighted expected loss
- **fiscal-transparency/** — composite transparency index (basic / enhanced / leading)
- **infrastructure-financing/self-tests.ts** — capital stack regression suite

## Commands

```bash
npm run test:op10m-agent07          # fiscal + reconciliation suites
npm run test:op10m-agent07:fiscal   # V10.14 fiscal outcomes only
```

## Assembly

- **Agent 25 chunk (preferred):** `npm run build:agent07-chunk` → `operation-10m/modules/agent-07-public-finance/chunk.tsx` (`OP10M_MODULE_BEGIN agent-07-public-finance`)
- **Legacy bundle:** `scripts/bundle-for-agent25.py` → `dist/section-20aw-agent07-bundle.ts`

See [INTEGRATION.md](./INTEGRATION.md) for state keys, prerequisites, and regression hooks.
