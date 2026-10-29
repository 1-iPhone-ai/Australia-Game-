# Agent 07 integration contract (Operation 10M)

## Prerequisites

- `gameSettings.nationalSystemsEnabled === true`
- `gameSettings.publicFinanceEnabled === true` (V10.12 layer)
- V10.14 fiscal outcomes gate uses `runV1014FiscalOutcomesSelfTests()` in canonical regression registry (`v1014_fiscal`)

## Canonical placement (post-merge)

| Slice | Target section | Notes |
|-------|----------------|-------|
| V10.14 fiscal core | `SECTION 20AW` | Already inlined on `australia-game-upgrade`; module tree is delta source |
| Op10M assembly chunk | `OP10M_MODULE_BEGIN agent-07-public-finance` | `operation-10m/modules/agent-07-public-finance/chunk.tsx` via `npm run build:agent07-chunk` |

## State & persistence

| Key | Owner | Description |
|-----|--------|-------------|
| `gameState.publicFinance` | V10.12 | National fiscal capacity, commitments, revenue/reserve policies |
| `gameState.publicFinanceState` | V10.12 | Derived snapshot for UI / GI |
| `gameState.fiscalOutcomes` | V10.14 | Persisted instrument rates, envelope overrides (`FiscalOutcomesPersisted`) |

**Boundaries (must not violate):** actor cash/loans, team treasury, Auto Mode modifiers, and tradable Government Grants are never national revenue or sovereign debt. See `modules/fiscal-outcomes/boundaries.ts`.

## Upstream / downstream

- **Upstream:** V10.12 public finance compute, megaproject/infrastructure commitment ids (V10.2–V10.3)
- **Downstream:** GI national queries (`publicFinance` topic), strategic ranking metadata (`publicFinanceAlignment`), Guardian warn-only fiscal capacity checks

## Regression

1. `runV1014FiscalOutcomesSelfTests()` — canonical quick tier (`v1014_fiscal`)
2. `runAgent07ReconciliationSelfTests()` — Operation 10M envelope/ledger/infra reconciliation (wire on merge)
3. `runRecurringCommitmentsSelfTests()` / `runFiscalResilienceSelfTests()` / `runDebtRolloverSelfTests()` — extended fiscal dynamics (wire on merge)
4. Wave 4: `runMultiYearFrameworkSelfTests()` / `runContingentLiabilitiesSelfTests()` / `runFiscalTransparencySelfTests()` / `runInfrastructureFinancingSelfTests()` — consolidated checks CF09–CF11

## Module self-test entrypoints

- `operation-10m/agent-07-public-finance/run-all-self-tests.ts`
- `operation-10m/agent-07-public-finance/run-fiscal-outcomes-tests.ts`
