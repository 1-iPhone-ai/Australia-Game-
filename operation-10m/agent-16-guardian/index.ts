export * from './types.js';
export { ADVISORY_OPS_POLICY, COPILOT_MAX_BLOCKED_CONTINUES } from './policy.js';
export {
  assertAdvisoryRecommendationOnly,
  verifyAdvisoryGrounding,
  verifyStateVerifiedWarning,
  buildGroundingForRule,
} from './grounding.js';
export { ADVISORY_MONITOR_RULES, getAdvisoryMonitorRuleById } from './monitor-rules.js';
export {
  evaluateSuggestedActionGate,
  markSuggestedAction,
  describeSuggestedActionOutcome,
  stripExecutionFromCoPilotCandidate,
  partitionSuggestionFromExecution,
} from './suggestion-gate.js';
export {
  createAdvisoryOpsFixtureSnapshot,
  materializeAdvisoryAlerts,
  runGuardianCoPilotAdvisoryCycle,
  advisoryRecommendationsFromCoPilotEvaluation,
  evaluateAdvisoryScenario,
} from './advisory-cycle.js';
export { buildGuardianCoPilotMonitorSnapshot } from './snapshot.js';
export {
  buildObjectiveAwareAdviceHints,
  mergeObjectiveContextIntoSnapshot,
  parseObjectiveContextFromGame,
} from './objective-context.js';
export {
  guardianBlocksAutomation,
  deriveGuardianAdvisoryPosture,
  buildGuardianDepthCouplingReport,
  buildGuardianDepthAdviceLines,
  classifyGuardianRiskBand,
  computeCopilotTrustGapScore,
  computeGuardianRiskScore,
  computeLiquidityStressIndex,
  computeObjectiveBehindSchedule,
  computeObjectivePacePct,
  computeCopilotSpendingHeadroom,
  computeCompositePressureIndex,
  computeAutomationReadinessScore,
  computeActionBurnPressure,
  enrichSnapshotGuardianDepth,
  buildGuardianDepthInterlockReport,
  buildGuardianDepthStabilityReport,
  computeAdvisorySaturationIndex,
  computeEscalationLatchScore,
  computeGovernanceCoherenceScore,
  buildGuardianDepthResilienceReport,
  buildGuardianDepthContinuityReport,
  buildGuardianDepthStewardshipReport,
  buildGuardianDepthAccountabilityReport,
  buildGuardianDepthFiduciaryReport,
  buildGuardianDepthCovenantReport,
  computeContainmentBurdenIndex,
  computeHumanRelayPressure,
  computeRecoveryHeadroomScore,
  computeAdvisoryDepletionIndex,
  computeOperatorBandwidthScore,
  computeContinuityMarginScore,
  computeStewardshipLoadIndex,
  computeOversightCommitmentScore,
  computeSustainabilityMarginScore,
  computeAccountabilityLoadIndex,
  computeDelegationFidelityScore,
  computeGovernanceEnduranceScore,
  computeFiduciaryBurdenIndex,
  computeTrustAssuranceScore,
  computeGovernanceDurabilityScore,
  computeCovenantStrainIndex,
  computeMandateIntegrityScore,
  computeGovernanceTenacityScore,
  runGuardianDepthUnitSelfTests,
} from './guardian-depth.js';
export { ADVISORY_MONITOR_RULES_EXPANSION, countExpansionRulesByKind } from './monitor-rules-expansion.js';
export { ADVISORY_MONITOR_RULES_SCALE_WAVE, ADVISORY_MONITOR_RULES_SCALE_WAVE_COUNT } from './monitor-rules-scale-wave.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_2,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_2_COUNT,
} from './monitor-rules-scale-wave-2.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_3,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_3_COUNT,
} from './monitor-rules-scale-wave-3.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_4,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_4_COUNT,
} from './monitor-rules-scale-wave-4.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_5,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_5_COUNT,
} from './monitor-rules-scale-wave-5.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_6,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_6_COUNT,
} from './monitor-rules-scale-wave-6.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_7,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_7_COUNT,
} from './monitor-rules-scale-wave-7.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_8,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_8_COUNT,
} from './monitor-rules-scale-wave-8.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_9,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_9_COUNT,
} from './monitor-rules-scale-wave-9.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_10,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_10_COUNT,
} from './monitor-rules-scale-wave-10.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_11,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_11_COUNT,
} from './monitor-rules-scale-wave-11.js';
export { ADVISORY_SCENARIO_CATALOG } from './scenarios.js';
export { runAgent16GuardianCoPilotSelfTests, summarizeAgent16SelfTests } from './self-tests.js';
