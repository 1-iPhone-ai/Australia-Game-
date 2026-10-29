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
  buildGuardianDepthCharterReport,
  buildGuardianDepthLegitimacyReport,
  buildGuardianDepthComplianceReport,
  buildGuardianDepthAuditReport,
  buildGuardianDepthAssuranceReport,
  buildGuardianDepthAttestationReport,
  buildGuardianDepthVerificationReport,
  buildGuardianDepthValidationReport,
  buildGuardianDepthCertificationReport,
  buildGuardianDepthAccreditationReport,
  buildGuardianDepthEndorsementReport,
  buildGuardianDepthRatificationReport,
  buildGuardianDepthAuthorizationReport,
  buildGuardianDepthAffirmationReport,
  buildGuardianDepthSanctionReport,
  buildGuardianDepthWarrantReport,
  buildGuardianDepthClearanceReport,
  buildGuardianDepthDispensationReport,
  buildGuardianDepthIndulgenceReport,
  buildGuardianDepthExemptionReport,
  buildGuardianDepthRemissionReport,
  buildGuardianDepthAbsolutionReport,
  buildGuardianDepthAmnestyReport,
  buildGuardianDepthPardonReport,
  buildGuardianDepthClemencyReport,
  buildGuardianDepthReprieveReport,
  buildGuardianDepthAcquittalReport,
  buildGuardianDepthExonerationReport,
  buildGuardianDepthVindicationReport,
  buildGuardianDepthJustificationReport,
  buildGuardianDepthLegitimationReport,
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
  computeCharterStrainIndex,
  computeAuthorityIntegrityScore,
  computeGovernancePersistenceScore,
  computeLegitimacyStrainIndex,
  computeOversightIntegrityScore,
  computeGovernanceContinuityScore,
  computeComplianceStrainIndex,
  computePolicyIntegrityScore,
  computeGovernanceResilienceScore,
  computeAuditStrainIndex,
  computeControlIntegrityScore,
  computeGovernanceStabilityScore,
  computeAssuranceStrainIndex,
  computeEvidenceIntegrityScore,
  computeGovernanceConfidenceScore,
  computeAttestationStrainIndex,
  computeAttestationIntegrityScore,
  computeGovernanceReliabilityScore,
  computeVerificationStrainIndex,
  computeVerificationIntegrityScore,
  computeGovernanceValidityScore,
  computeValidationStrainIndex,
  computeValidationIntegrityScore,
  computeGovernanceSoundnessScore,
  computeCertificationStrainIndex,
  computeCertificationIntegrityScore,
  computeGovernanceAuthenticityScore,
  computeAccreditationStrainIndex,
  computeAccreditationIntegrityScore,
  computeGovernanceCredibilityScore,
  computeEndorsementStrainIndex,
  computeEndorsementIntegrityScore,
  computeGovernanceTrustworthinessScore,
  computeRatificationStrainIndex,
  computeRatificationIntegrityScore,
  computeGovernanceDependabilityScore,
  computeAuthorizationStrainIndex,
  computeAuthorizationIntegrityScore,
  computeGovernanceSteadfastnessScore,
  computeAffirmationStrainIndex,
  computeAffirmationIntegrityScore,
  computeGovernanceResolutenessScore,
  computeSanctionStrainIndex,
  computeSanctionIntegrityScore,
  computeGovernanceFirmnessScore,
  computeWarrantStrainIndex,
  computeWarrantIntegrityScore,
  computeGovernanceConstancyScore,
  computeClearanceStrainIndex,
  computeClearanceIntegrityScore,
  computeGovernancePerseveranceScore,
  computeDispensationStrainIndex,
  computeDispensationIntegrityScore,
  computeGovernanceFortitudeScore,
  computeIndulgenceStrainIndex,
  computeIndulgenceIntegrityScore,
  computeGovernanceVigorScore,
  computeExemptionStrainIndex,
  computeExemptionIntegrityScore,
  computeGovernanceStaminaScore,
  computeRemissionStrainIndex,
  computeRemissionIntegrityScore,
  computeGovernanceMettleScore,
  computeAbsolutionStrainIndex,
  computeAbsolutionIntegrityScore,
  computeGovernanceGritScore,
  computeAmnestyStrainIndex,
  computeAmnestyIntegrityScore,
  computeGovernanceResolveScore,
  computePardonStrainIndex,
  computePardonIntegrityScore,
  computeGovernanceZealScore,
  computeClemencyStrainIndex,
  computeClemencyIntegrityScore,
  computeGovernancePluckScore,
  computeReprieveStrainIndex,
  computeReprieveIntegrityScore,
  computeGovernanceNerveScore,
  computeAcquittalStrainIndex,
  computeAcquittalIntegrityScore,
  computeGovernanceMoxieScore,
  computeExonerationStrainIndex,
  computeExonerationIntegrityScore,
  computeGovernanceSpunkScore,
  computeVindicationStrainIndex,
  computeVindicationIntegrityScore,
  computeGovernanceDashScore,
  computeJustificationStrainIndex,
  computeJustificationIntegrityScore,
  computeGovernanceBrioScore,
  computeLegitimationStrainIndex,
  computeLegitimationIntegrityScore,
  computeGovernancePepScore,
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
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_12,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_12_COUNT,
} from './monitor-rules-scale-wave-12.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_13,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_13_COUNT,
} from './monitor-rules-scale-wave-13.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_14,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_14_COUNT,
} from './monitor-rules-scale-wave-14.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_15,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_15_COUNT,
} from './monitor-rules-scale-wave-15.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_16,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_16_COUNT,
} from './monitor-rules-scale-wave-16.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_17,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_17_COUNT,
} from './monitor-rules-scale-wave-17.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_18,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_18_COUNT,
} from './monitor-rules-scale-wave-18.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_19,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_19_COUNT,
} from './monitor-rules-scale-wave-19.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_20,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_20_COUNT,
} from './monitor-rules-scale-wave-20.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_21,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_21_COUNT,
} from './monitor-rules-scale-wave-21.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_22,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_22_COUNT,
} from './monitor-rules-scale-wave-22.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_23,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_23_COUNT,
} from './monitor-rules-scale-wave-23.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_24,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_24_COUNT,
} from './monitor-rules-scale-wave-24.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_25,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_25_COUNT,
} from './monitor-rules-scale-wave-25.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_26,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_26_COUNT,
} from './monitor-rules-scale-wave-26.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_27,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_27_COUNT,
} from './monitor-rules-scale-wave-27.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_28,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_28_COUNT,
} from './monitor-rules-scale-wave-28.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_29,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_29_COUNT,
} from './monitor-rules-scale-wave-29.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_30,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_30_COUNT,
} from './monitor-rules-scale-wave-30.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_31,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_31_COUNT,
} from './monitor-rules-scale-wave-31.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_32,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_32_COUNT,
} from './monitor-rules-scale-wave-32.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_33,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_33_COUNT,
} from './monitor-rules-scale-wave-33.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_34,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_34_COUNT,
} from './monitor-rules-scale-wave-34.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_35,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_35_COUNT,
} from './monitor-rules-scale-wave-35.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_36,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_36_COUNT,
} from './monitor-rules-scale-wave-36.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_37,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_37_COUNT,
} from './monitor-rules-scale-wave-37.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_38,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_38_COUNT,
} from './monitor-rules-scale-wave-38.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_39,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_39_COUNT,
} from './monitor-rules-scale-wave-39.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_40,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_40_COUNT,
} from './monitor-rules-scale-wave-40.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_41,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_41_COUNT,
} from './monitor-rules-scale-wave-41.js';
export {
  ADVISORY_MONITOR_RULES_SCALE_WAVE_42,
  ADVISORY_MONITOR_RULES_SCALE_WAVE_42_COUNT,
} from './monitor-rules-scale-wave-42.js';
export { ADVISORY_SCENARIO_CATALOG } from './scenarios.js';
export { runAgent16GuardianCoPilotSelfTests, summarizeAgent16SelfTests } from './self-tests.js';
