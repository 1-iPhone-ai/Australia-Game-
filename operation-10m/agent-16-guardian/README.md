# Agent 16 — Guardian AI & Human Co-Pilot Advisory Ops

Modular **recommendations-only** layer for Operation 10M. Observes Guardian + Co-Pilot context; never executes actions or mutates game state.

## Guarantees

| Concern | Mechanism |
|--------|-----------|
| Grounded advice | Every advisory carries `grounding[]` evidence tied to snapshot fields; `verifyAdvisoryGrounding` rejects stale copy |
| Suggestions ≠ execution | `ADVISORY_OPS_POLICY`, `assertAdvisoryRecommendationOnly`, `stripExecutionFromCoPilotCandidate`, `evaluateSuggestedActionGate` |
| State-verified warnings | `verifyStateVerifiedWarning` re-runs the monitor rule against the snapshot before surfacing |

## Layout

- `types.ts` — shared interfaces
- `policy.ts` — non-negotiable advisory mandate
- `grounding.ts` — evidence attachment + verification
- `suggestion-gate.ts` — Co-Pilot suggested-action gate (approval path)
- `monitor-rules.ts` — 22 core monitor/advise/alert rules
- `monitor-rules-expansion.ts` — 11 objective-aware + extended Guardian rules
- `objective-context.ts` — mission/objective parsing and advice hints
- `advisory-cycle.ts` — cycle, dedupe, Co-Pilot candidate → advisory mapping
- `snapshot.ts` — monitor snapshot builder from game slice
- `scenarios.ts` — deterministic scenario catalog for regression
- `self-tests.ts` — LAB-ready self-test suite
- `index.ts` — public exports

## Tests

```bash
npm run test:agent16
npm run build:agent16-chunk
```

Assembly output: `operation-10m/modules/agent-16-guardian/chunk.tsx` (`OP10M_MODULE_BEGIN agent-16-guardian`).

## Agent 25 assembly

Bundle paths (in order): `types.ts`, `policy.ts`, `grounding.ts`, `suggestion-gate.ts`, `monitor-rules.ts`, `advisory-cycle.ts`, `snapshot.ts`, `scenarios.ts`, `self-tests.ts`, `index.ts`.

Wire `runAgent16GuardianCoPilotSelfTests()` into LAB **System Regression**. Do **not** pipe advisory output into `executeCoPilotAction`. Keep `evaluateGuardianRiskPipeline` as the enforcement layer.

Anchor: canonical V9.4 `SECTION 20PA` (Guardian & Human Co-Pilot Advisory Ops).

## Scale wave round 4

- **Interlock metrics:** `compositePressureIndex`, `automationReadinessScore`, `actionBurnPressure`; `buildGuardianDepthInterlockReport()`
- **`monitor-rules-scale-wave-4.ts`** — 12 rules (**82** monitor rules total)
- **139/139** self-tests; regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 5

- **Stability lattice metrics:** `advisorySaturationIndex`, `escalationLatchScore`, `governanceCoherenceScore`; `buildGuardianDepthStabilityReport()`
- **`monitor-rules-scale-wave-5.ts`** — 12 rules (**94** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 6

- **Resilience envelope metrics:** `containmentBurdenIndex`, `humanRelayPressure`, `recoveryHeadroomScore`; `buildGuardianDepthResilienceReport()`
- **`monitor-rules-scale-wave-6.ts`** — 12 rules (**106** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 7

- **Continuity envelope metrics:** `advisoryDepletionIndex`, `operatorBandwidthScore`, `continuityMarginScore`; `buildGuardianDepthContinuityReport()`
- **`monitor-rules-scale-wave-7.ts`** — 12 rules (**118** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 8

- **Stewardship envelope metrics:** `stewardshipLoadIndex`, `oversightCommitmentScore`, `sustainabilityMarginScore`; `buildGuardianDepthStewardshipReport()`
- **`monitor-rules-scale-wave-8.ts`** — 12 rules (**130** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 9

- **Accountability envelope metrics:** `accountabilityLoadIndex`, `delegationFidelityScore`, `governanceEnduranceScore`; `buildGuardianDepthAccountabilityReport()`
- **`monitor-rules-scale-wave-9.ts`** — 12 rules (**142** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 10

- **Fiduciary envelope metrics:** `fiduciaryBurdenIndex`, `trustAssuranceScore`, `governanceDurabilityScore`; `buildGuardianDepthFiduciaryReport()`
- **`monitor-rules-scale-wave-10.ts`** — 12 rules (**154** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 11

- **Covenant envelope metrics:** `covenantStrainIndex`, `mandateIntegrityScore`, `governanceTenacityScore`; `buildGuardianDepthCovenantReport()`
- **`monitor-rules-scale-wave-11.ts`** — 12 rules (**166** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 12

- **Charter envelope metrics:** `charterStrainIndex`, `authorityIntegrityScore`, `governancePersistenceScore`; `buildGuardianDepthCharterReport()`
- **`monitor-rules-scale-wave-12.ts`** — 12 rules (**178** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 13

- **Legitimacy envelope metrics:** `legitimacyStrainIndex`, `oversightIntegrityScore`, `governanceContinuityScore`; `buildGuardianDepthLegitimacyReport()`
- **`monitor-rules-scale-wave-13.ts`** — 12 rules (**190** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 14

- **Compliance envelope metrics:** `complianceStrainIndex`, `policyIntegrityScore`, `governanceResilienceScore`; `buildGuardianDepthComplianceReport()`
- **`monitor-rules-scale-wave-14.ts`** — 12 rules (**202** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 15

- **Audit envelope metrics:** `auditStrainIndex`, `controlIntegrityScore`, `governanceStabilityScore`; `buildGuardianDepthAuditReport()`
- **`monitor-rules-scale-wave-15.ts`** — 12 rules (**214** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 16

- **Assurance envelope metrics:** `assuranceStrainIndex`, `evidenceIntegrityScore`, `governanceConfidenceScore`; `buildGuardianDepthAssuranceReport()`
- **`monitor-rules-scale-wave-16.ts`** — 12 rules (**226** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 17

- **Attestation envelope metrics:** `attestationStrainIndex`, `attestationIntegrityScore`, `governanceReliabilityScore`; `buildGuardianDepthAttestationReport()`
- **`monitor-rules-scale-wave-17.ts`** — 12 rules (**238** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 18

- **Verification envelope metrics:** `verificationStrainIndex`, `verificationIntegrityScore`, `governanceValidityScore`; `buildGuardianDepthVerificationReport()`
- **`monitor-rules-scale-wave-18.ts`** — 12 rules (**250** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 19

- **Validation envelope metrics:** `validationStrainIndex`, `validationIntegrityScore`, `governanceSoundnessScore`; `buildGuardianDepthValidationReport()`
- **`monitor-rules-scale-wave-19.ts`** — 12 rules (**262** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 20

- **Certification envelope metrics:** `certificationStrainIndex`, `certificationIntegrityScore`, `governanceAuthenticityScore`; `buildGuardianDepthCertificationReport()`
- **`monitor-rules-scale-wave-20.ts`** — 12 rules (**274** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 21

- **Accreditation envelope metrics:** `accreditationStrainIndex`, `accreditationIntegrityScore`, `governanceCredibilityScore`; `buildGuardianDepthAccreditationReport()`
- **`monitor-rules-scale-wave-21.ts`** — 12 rules (**286** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 22

- **Endorsement envelope metrics:** `endorsementStrainIndex`, `endorsementIntegrityScore`, `governanceTrustworthinessScore`; `buildGuardianDepthEndorsementReport()`
- **`monitor-rules-scale-wave-22.ts`** — 12 rules (**298** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 23

- **Ratification envelope metrics:** `ratificationStrainIndex`, `ratificationIntegrityScore`, `governanceDependabilityScore`; `buildGuardianDepthRatificationReport()`
- **`monitor-rules-scale-wave-23.ts`** — 12 rules (**310** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 24

- **Authorization envelope metrics:** `authorizationStrainIndex`, `authorizationIntegrityScore`, `governanceSteadfastnessScore`; `buildGuardianDepthAuthorizationReport()`
- **`monitor-rules-scale-wave-24.ts`** — 12 rules (**322** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 25

- **Affirmation envelope metrics:** `affirmationStrainIndex`, `affirmationIntegrityScore`, `governanceResolutenessScore`; `buildGuardianDepthAffirmationReport()`
- **`monitor-rules-scale-wave-25.ts`** — 12 rules (**334** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 26

- **Sanction envelope metrics:** `sanctionStrainIndex`, `sanctionIntegrityScore`, `governanceFirmnessScore`; `buildGuardianDepthSanctionReport()`
- **`monitor-rules-scale-wave-26.ts`** — 12 rules (**346** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 27

- **Warrant envelope metrics:** `warrantStrainIndex`, `warrantIntegrityScore`, `governanceConstancyScore`; `buildGuardianDepthWarrantReport()`
- **`monitor-rules-scale-wave-27.ts`** — 12 rules (**358** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 28

- **Clearance envelope metrics:** `clearanceStrainIndex`, `clearanceIntegrityScore`, `governancePerseveranceScore`; `buildGuardianDepthClearanceReport()`
- **`monitor-rules-scale-wave-28.ts`** — 12 rules (**370** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 29

- **Dispensation envelope metrics:** `dispensationStrainIndex`, `dispensationIntegrityScore`, `governanceFortitudeScore`; `buildGuardianDepthDispensationReport()`
- **`monitor-rules-scale-wave-29.ts`** — 12 rules (**382** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 30

- **Indulgence envelope metrics:** `indulgenceStrainIndex`, `indulgenceIntegrityScore`, `governanceVigorScore`; `buildGuardianDepthIndulgenceReport()`
- **`monitor-rules-scale-wave-30.ts`** — 12 rules (**394** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`

## Scale wave round 31

- **Exemption envelope metrics:** `exemptionStrainIndex`, `exemptionIntegrityScore`, `governanceStaminaScore`; `buildGuardianDepthExemptionReport()`
- **`monitor-rules-scale-wave-31.ts`** — 12 rules (**406** monitor rules total)
- Regenerate chunk with `npm run build:agent16-chunk`
