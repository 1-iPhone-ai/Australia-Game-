# Agent 06 integration contract (Operation 10M)

**Branch:** `op10m/agent-06-macroeconomy`  
**Module id:** `agent-06-macroeconomy`  
**Hub:** [`operation-10m/INTEGRATION.md`](../INTEGRATION.md)

## Assembly artifact

| Path | Role |
|------|------|
| `operation-10m/modules/agent-06-macroeconomy/chunk.tsx` | Inline-ready TSX (`OP10M_MODULE_BEGIN` / `END`) |
| `operation-10m/modules/agent-06-macroeconomy/module.manifest.json` | Registry slot + anchor hint |
| `operation-10m/agent-06-macroeconomy/v10-14-macro-economy/` | Editable modular source (tests run here) |

Regenerate chunk after source edits:

```bash
node operation-10m/agent-06-macroeconomy/scripts/build-chunk.mjs
```

## Canonical anchor

Insert at or replace duplicate of Section **20AG** (V10.14 macroeconomy):

```tsx
// Agent 25 tranche 4 inline — #302 macro
// SECTION 20AG: V10.14 MACROECONOMIC CYCLES, PRODUCTIVITY, INVESTMENT & NATIONAL ACCOUNTING
```

## Primary exports (wire in national systems tick)

| Symbol | Use |
|--------|-----|
| `V1014_MACRO_SCHEMA_VERSION` | Save / telemetry |
| `buildMacroEconomyInputs` | Snapshot bridge from game state |
| `computeNationalMacroEconomy` | Derive national macro state each turn |
| `createInitialMacroEconomyPersisted` / `sanitizeMacroEconomyPersisted` | Persisted slice |
| `macroEconomyInputHash` | Memoization / skip recompute |
| `validateNationalMacroEconomyState` | Accounting + regional share validation |
| `CYCLICAL_MACRO_SHOCK_CATALOG` / `resolveActiveCyclicalShockIds` | Cyclical shock library |
| `reconcileRegionalContributionShares` | Regional reconciliation (shares sum to 1) |
| `runV1014_MACRO_MacroEconomySelfTests` | SECTION 21B regression |
| `runAgent06AllSelfTests` | Full module test bundle |
| `detectMacroEconomyQuestion` / `composeMacroEconomyGiAnswer` | GI macro Q&A |
| `readMacroFiscalSpilloverFromV1012` | V10.12 read-only spillover |
| `readMacroTradeSpilloverFromV1015` | V10.15 trade read-only spillover |
| `readMacroGeographySpillover` | V10.11 economic geography spillover |
| `buildMacroTransmissionReport` | Cross-layer transmission snapshot |
| `runMacroEconomyRegressionHarness` | Multi-turn deterministic regression |
| `evaluateMacroEconomyGuardianContext` | Guardian warn-only hooks |
| `MacroEconomyInspectorLab` | LAB inspector |

## Upstream authority (invariants)

1. **Actor money / loans / team treasury** — never mutated here.
2. **V10.9** — strategic capital allocation authoritative; macro reads investment climate only.
3. **V10.12** — fiscal capacity authoritative; cross-check warn-only.
4. **V10.13** — household living standards authoritative; demand signals read-only.
5. Regional contribution **shares sum to 1.0 ± 1e-5** after normalization.

## Downstream

- Ranking: `computeMacroEconomyRankingFit`
- Guardian: `evaluateMacroEconomyGuardianWarnings` / `evaluateMacroEconomyGuardianContext`
- Persisted field (canonical): `macroEconomyPersisted` / derived `macroEconomyState` (Agent 25 wires names)

## Agent 25 merge steps

1. Run `build-chunk.mjs`; verify `chunk.tsx` markers and hash in manifest tranche.
2. Splice chunk at `#302 macro` anchor (or replace existing 20AG block after diff).
3. Register `runV1014_MACRO_MacroEconomySelfTests` in SECTION 21B if not already linked.
4. Remove duplicate symbols on collision scan (`validate-manifest.mjs`).

## Verification (worker branch)

```bash
npm run test:agent06
node operation-10m/agent-06-macroeconomy/scripts/build-chunk.mjs
```
