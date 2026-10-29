# Agent 09 integration contract (Operation 10M)

## Assembly owner

Agent 25 merges this tree into `(V9.4) australia-game-with-ai.tsx` at **SECTION 20AJ** (or successor anchor). Workers must not patch V9.4 directly.

## Settings gate

`gameSettings.laborDemographicsEnabled !== false` AND `nationalSystemsEnabled` AND `industriesEnabled`.

Persisted field on game state (canonical): `laborDemographics` / `laborDemographicsState` — follow Agent 25 save map when wiring.

## Upstream reads (read-only)

| System | Fields used |
|--------|-------------|
| V10.1 Industries | `national.output`, regional `effectiveOutput`, `condition` |
| V10.10 Workforce | regional `effectivePressureRatio`, `automationShiftSummary`, domain `automationShiftModifier` |
| V10.13 Households | regional employment opportunity bands |
| Living Regions | regional `momentum.band` |
| Capabilities (optional) | `automationShift` on active capabilities |

## Downstream consumers (post-merge)

- GI / LR queries (national labor demographics topics)
- Guardian warn-only hooks (employment / wage stress — future slice)
- Idle / Auto Mode steward hints via `computeLaborAutomationFeedback` (`stewardHints`)

## Assembly chunk

- Path: `operation-10m/modules/agent-09-population/chunk.tsx`
- Markers: `OP10M_MODULE_BEGIN agent-09-population` … `OP10M_MODULE_END agent-09-population`
- Regenerate: `npm run build:agent09-chunk` (after editing `v10-14-labor-demographics/`)

## Export surface (bundle for inline)

From `v10-14-labor-demographics/index.ts`:

- Constants: `V1014_LABOR_*`, labels, weights
- Types: `NationalLaborDemographicsState`, `LaborDemographicsPersisted`, `LaborDemographicsInputs`, …
- Core: `computeNationalLaborDemographics`, `buildLaborDemographicsInputs`, `sanitizeLaborDemographicsPersisted`, `validateLaborDemographicsState`, `laborDemographicsInputHash`
- Automation: `computeLaborAutomationFeedback`, `mergeAutomationFeedbackIntoRegionalScores`
- Household budget: `computeNationalHouseholdBudgetDetail`, `householdBudgetLaborAdjustments`
- Migration shocks: `detectMigrationShocks`, `applyMigrationShocksToRegions`, persisted `activeMigrationShocks`
- UI (optional inline): `LaborDemographicsCenterPanel`
- Tests: `runV1014LaborDemographicsSelfTests` (**66** cases)

## Namespace on merge

Agent 25 tranche 4 uses token `LABOR` when duplicating blocks; this module keeps canonical `V1014_LABOR_*` names to match HEAD SECTION 20AJ.
