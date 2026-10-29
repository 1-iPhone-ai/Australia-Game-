# Agent 06 — National Macroeconomy (Operation 10M)

**Branch:** `op10m/agent-06-macroeconomy`  
**Owner:** Agent 06 (National macroeconomy)  
**Canonical merge:** Agent 25 only — do not edit `(V9.4) australia-game-with-ai.tsx` on this branch.

## Purpose

Modular **V10.14 macroeconomy** layer: national **production** (output & utilization), **investment** climate, **productivity**, **shocks**, **regional aggregation**, and **accounting reconciliation** (shares sum to 1; identity residual within tolerance).

Boundaries match audited inline Section 20AG: actor money / team treasury / resource prices remain authoritative elsewhere; V10.9 (capital), V10.12 (fiscal), V10.13 (households) are cross-read only.

## Layout

| Path | Role |
|------|------|
| `v10-14-macro-economy/types.ts` | Serializable types & labels |
| `v10-14-macro-economy/constants.ts` | Regions, priors, limits |
| `v10-14-macro-economy/math.ts` | Clamp, bands, cycle hysteresis |
| `v10-14-macro-economy/productivity.ts` | Sector & regional productivity composition |
| `v10-14-macro-economy/investment.ts` | Investment climate scoring |
| `v10-14-macro-economy/production.ts` | Utilization & gross output index |
| `v10-14-macro-economy/shocks.ts` | Inflation & credit shock adjustments |
| `v10-14-macro-economy/regional-aggregation.ts` | Weights, shares, contribution rows |
| `v10-14-macro-economy/accounting/` | Ledger build & reconciliation helpers |
| `v10-14-macro-economy/persisted.ts` | Persisted state, hash, sanitize |
| `v10-14-macro-economy/inputs.ts` | Bridge from game snapshots |
| `v10-14-macro-economy/compute.ts` | `computeNationalMacroEconomy` |
| `v10-14-macro-economy/integration.ts` | Ranking fit & Guardian warnings |
| `v10-14-macro-economy/self-tests.ts` | Regression self-tests (50+) |
| `v10-14-macro-economy/accounting/reconciliation-tests.ts` | Accounting identity suite |
| `run-self-tests.ts` | CLI runner (`npm run test:agent06`) |

## Run tests

```bash
npm run test:agent06
```
