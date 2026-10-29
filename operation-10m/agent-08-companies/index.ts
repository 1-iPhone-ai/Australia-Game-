export {
  O6K_AGENT08_MODULE_ID,
  O6K_AGENT08_MODULE_VERSION,
  V1014_PRIVATE_SCHEMA_VERSION,
  computeNationalPrivateSector,
  buildPrivateSectorInputs,
  createInitialPrivateSectorPersisted,
  runV1014_PRIVATE_PrivateSectorSelfTests,
  privateSectorInputHash,
} from './v1014-private-sector-core';

export {
  AGENT08_TAX_LABOR_SCHEMA_VERSION,
  applyTaxLaborCapacityOverlay,
  buildLaborSlicesFromWorkforce,
  computeTaxLaborCapacityAdjustments,
  inferFiscalSlicesFromNationalSystems,
  runAgent08TaxLaborSelfTests,
} from './tax-labor-capacity-linkage';

export type { Agent08CapacityAdjustment, Agent08TaxLaborInputs } from './tax-labor-capacity-linkage';

export {
  AGENT08_SUPPLY_DEPTH_SCHEMA_VERSION,
  applySupplyChainDepthEvidence,
  computeNationalSupplyDepthSummary,
  deriveFirmSupplyChainProfile,
  deriveFirmSupplyChainProfiles,
  runAgent08SupplyChainSelfTests,
} from './supply-chain-firm-depth';

export type {
  FirmSupplyChainProfile,
  FirmSupplyDepthBand,
  NationalSupplyDepthSummary,
  RegionalSupplyDepthSummary,
} from './supply-chain-firm-depth';

export {
  AGENT08_SECTOR_DEPTH_SCHEMA_VERSION,
  archetypeToIndustry,
  computeNationalSectorProductionDepth,
  computeRegionalSectorProductionDepth,
  scoreFirmSectorIndustryAlignment,
  runAgent08SectorDepthSelfTests,
} from './sector-production-depth';

export type {
  FirmSectorProductionRow,
  NationalSectorProductionDepth,
  RegionalSectorProductionDepth,
  RegionalSectorDiversificationBand,
} from './sector-production-depth';

export {
  AGENT08_CASCADE_SCHEMA_VERSION,
  computeFirmCascadeExposure,
  computeNationalProductionCapacityCascade,
  computeProviderRegionStress,
  propagateSupplyCascadeEdge,
  runAgent08CascadeSelfTests,
} from './production-capacity-cascade';

export type {
  CascadeSeverityBand,
  FirmCascadeExposure,
  NationalProductionCapacityCascade,
  SupplyCascadeEdge,
} from './production-capacity-cascade';

export {
  AGENT08_INTEGRATED_SCHEMA_VERSION,
  computeNationalIntegratedProductionBrief,
  summarizeRegionalIntegratedProduction,
  synthesizeFirmIntegratedProductionSignal,
  runAgent08IntegratedSelfTests,
} from './integrated-production-synthesis';

export type {
  FirmIntegratedProductionSignal,
  IntegratedProductionRiskBand,
  NationalIntegratedProductionBrief,
  RegionalIntegratedProductionSummary,
} from './integrated-production-synthesis';

export {
  AGENT08_RECOVERY_SCHEMA_VERSION,
  buildFirmProductionRecoveryAction,
  computeNationalProductionRecoveryPlaybook,
  rankRecoveryLeversForFirm,
  summarizeRegionalRecoveryPlan,
  runAgent08RecoverySelfTests,
} from './production-recovery-playbook';

export type {
  FirmProductionRecoveryAction,
  NationalProductionRecoveryPlaybook,
  ProductionRecoveryLever,
  RecoveryPriorityBand,
  RegionalProductionRecoveryPlan,
} from './production-recovery-playbook';

export {
  AGENT08_STABILIZATION_SCHEMA_VERSION,
  buildFirmStabilizationOutlook,
  buildUpstreamCoordinationClusters,
  classifyStabilizationHorizon,
  computeNationalProductionStabilizationOutlook,
  estimateTurnsToStabilize,
  summarizeRegionalStabilization,
  runAgent08StabilizationSelfTests,
} from './production-stabilization-outlook';

export type {
  FirmProductionStabilizationOutlook,
  NationalProductionStabilizationOutlook,
  RegionalProductionStabilizationSummary,
  StabilizationConfidence,
  StabilizationHorizonBand,
  UpstreamCoordinationCluster,
} from './production-stabilization-outlook';

export {
  AGENT08_MANDATE_SCHEMA_VERSION,
  buildClusterCoordinationMandates,
  computeNationalProductionCoordinationMandate,
  computeResilienceMomentum,
  rankFirmDirectives,
  summarizeRegionalCoordinationMandate,
  runAgent08MandateSelfTests,
} from './production-coordination-mandate';

export type {
  ClusterCoordinationMandate,
  FirmProductionExecutionDirective,
  MandateExecutionPhase,
  NationalProductionCoordinationMandate,
  RegionalProductionCoordinationMandate,
  ResilienceMomentumBand,
} from './production-coordination-mandate';

export {
  AGENT08_COMPLIANCE_SCHEMA_VERSION,
  buildClusterMandateComplianceGaps,
  computeNationalComplianceScore,
  computeNationalProductionMandateCompliance,
  scoreFirmMandateCompliance,
  summarizeRegionalMandateCompliance,
  runAgent08ComplianceSelfTests,
} from './production-mandate-compliance';

export type {
  ClusterMandateComplianceGap,
  FirmMandateComplianceRow,
  MandateComplianceBand,
  NationalProductionMandateCompliance,
  RegionalMandateComplianceSummary,
} from './production-mandate-compliance';

export {
  AGENT08_REMEDIATION_SCHEMA_VERSION,
  buildClusterComplianceRemediationPlans,
  buildFirmComplianceRemediation,
  computeNationalProductionComplianceRemediation,
  computeRemediationPressure,
  summarizeRegionalComplianceRemediation,
  runAgent08RemediationSelfTests,
} from './production-compliance-remediation';

export type {
  ClusterComplianceRemediationPlan,
  FirmComplianceRemediationAction,
  NationalProductionComplianceRemediation,
  RegionalComplianceRemediationSummary,
  RemediationActionKind,
  RemediationUrgencyBand,
} from './production-compliance-remediation';

export {
  AGENT08_EXECUTION_SCHEMA_VERSION,
  buildClusterRemediationExecutionRollups,
  buildFirmRemediationExecutionRow,
  classifyRemediationExecutionBand,
  computeExecutionBacklogPressure,
  computeNationalClosureScore,
  computeNationalProductionRemediationExecution,
  summarizeRegionalRemediationExecution,
  runAgent08ExecutionSelfTests,
} from './production-remediation-execution';

export type {
  ClusterRemediationExecutionRollup,
  FirmRemediationExecutionRow,
  NationalProductionRemediationExecution,
  RegionalRemediationExecutionSummary,
  RemediationExecutionBand,
} from './production-remediation-execution';

export {
  AGENT08_UTILIZATION_DEPTH_SCHEMA_VERSION,
  classifyUtilizationSlackBand,
  classifyUtilizationStress,
  computeNationalProductionUtilizationDepth,
  computeRegionalProductionUtilizationDepth,
  scoreFirmProductionUtilization,
  runAgent08UtilizationDepthSelfTests,
} from './production-utilization-depth';

export type {
  FirmProductionUtilizationRow,
  NationalProductionUtilizationDepth,
  RegionalProductionUtilizationDepth,
  UtilizationSlackBand,
  UtilizationStressBand,
} from './production-utilization-depth';

export {
  AGENT08_RECONCILIATION_SCHEMA_VERSION,
  computeNationalCoherenceScore,
  computeNationalProductionCapacityReconciliation,
  computeReconciliationPressure,
  reconcileFirmProductionCapacity,
  summarizeRegionalCapacityReconciliation,
  runAgent08ReconciliationSelfTests,
} from './production-capacity-reconciliation';

export type {
  CapacityReconciliationBand,
  FirmProductionCapacityReconciliation,
  NationalProductionCapacityReconciliation,
  RegionalCapacityReconciliationSummary,
} from './production-capacity-reconciliation';

export {
  AGENT08_OPERATING_PRIORITY_SCHEMA_VERSION,
  buildFirmProductionOperatingPriority,
  classifyOperatingPriorityBand,
  computeNationalOperatingPressure,
  computeNationalProductionOperatingPriorities,
  summarizeRegionalProductionOperating,
  runAgent08OperatingPrioritySelfTests,
} from './production-operating-priorities';

export type {
  FirmProductionOperatingPriority,
  NationalProductionOperatingPriorities,
  OperatingPriorityBand,
  OperatingPriorityKind,
  RegionalProductionOperatingSummary,
} from './production-operating-priorities';

export {
  AGENT08_OPERATING_DIGEST_SCHEMA_VERSION,
  buildFirmOperatingDigestEntry,
  classifyNationalOperatingPosture,
  classifyRegionalOperatingPosture,
  computeNationalProductionOperatingDigest,
  summarizeRegionalOperatingDigest,
  runAgent08OperatingDigestSelfTests,
} from './production-operating-digest';

export type {
  FirmOperatingDigestEntry,
  NationalOperatingPostureBand,
  NationalProductionOperatingDigest,
  RegionalOperatingDigestSlice,
} from './production-operating-digest';

export {
  AGENT08_READINESS_PORTFOLIO_SCHEMA_VERSION,
  buildFirmProductionReadinessRow,
  classifyNationalReadinessTier,
  computeNationalProductionReadinessPortfolio,
  computeNationalReadinessScore,
  computePortfolioPressure,
  summarizeRegionalProductionReadiness,
  runAgent08ReadinessPortfolioSelfTests,
} from './production-readiness-portfolio';

export type {
  FirmProductionReadinessRow,
  NationalProductionReadinessPortfolio,
  ProductionReadinessTier,
  RegionalProductionReadinessPortfolio,
} from './production-readiness-portfolio';

export {
  AGENT08_TRANSITION_HORIZON_SCHEMA_VERSION,
  buildFirmProductionTransitionOutlook,
  classifyNationalTransitionRisk,
  computeNationalProductionTransitionHorizon,
  computeNationalTransitionPressure,
  summarizeRegionalTransitionHorizon,
  runAgent08TransitionHorizonSelfTests,
} from './production-transition-horizon';

export type {
  FirmProductionTransitionOutlook,
  NationalProductionTransitionHorizon,
  RegionalTransitionHorizonSummary,
  TransitionHorizonBand,
  TransitionRiskBand,
} from './production-transition-horizon';

export {
  AGENT08_TRANSITION_COMMITMENT_SCHEMA_VERSION,
  buildFirmProductionTransitionCommitment,
  classifyNationalCommitmentBand,
  computeNationalCommitmentPressure,
  computeNationalProductionTransitionCommitment,
  summarizeRegionalTransitionCommitment,
  runAgent08TransitionCommitmentSelfTests,
} from './production-transition-commitment';

export type {
  FirmProductionTransitionCommitment,
  NationalProductionTransitionCommitment,
  RegionalTransitionCommitmentSummary,
  TransitionCommitmentBand,
} from './production-transition-commitment';

export {
  AGENT08_TRANSITION_MOBILIZATION_SCHEMA_VERSION,
  buildFirmProductionTransitionMobilization,
  classifyNationalMobilizationBand,
  computeNationalMobilizationPressure,
  computeNationalProductionTransitionMobilization,
  summarizeRegionalTransitionMobilization,
  runAgent08TransitionMobilizationSelfTests,
} from './production-transition-mobilization';

export type {
  FirmProductionTransitionMobilization,
  NationalProductionTransitionMobilization,
  RegionalTransitionMobilizationSummary,
  TransitionMobilizationBand,
} from './production-transition-mobilization';

export {
  AGENT08_TRANSITION_DEPLOYMENT_SCHEMA_VERSION,
  buildFirmProductionTransitionDeployment,
  classifyNationalDeploymentBand,
  computeNationalDeploymentPressure,
  computeNationalProductionTransitionDeployment,
  summarizeRegionalTransitionDeployment,
  runAgent08TransitionDeploymentSelfTests,
} from './production-transition-deployment';

export type {
  FirmProductionTransitionDeployment,
  NationalProductionTransitionDeployment,
  RegionalTransitionDeploymentSummary,
  TransitionDeploymentBand,
} from './production-transition-deployment';

export {
  AGENT08_TRANSITION_VALIDATION_SCHEMA_VERSION,
  buildFirmProductionTransitionValidation,
  classifyNationalValidationBand,
  computeNationalValidationPressure,
  computeNationalProductionTransitionValidation,
  summarizeRegionalTransitionValidation,
  runAgent08TransitionValidationSelfTests,
} from './production-transition-validation';

export type {
  FirmProductionTransitionValidation,
  NationalProductionTransitionValidation,
  RegionalTransitionValidationSummary,
  TransitionValidationBand,
} from './production-transition-validation';

export {
  AGENT08_TRANSITION_CONSOLIDATION_SCHEMA_VERSION,
  buildFirmProductionTransitionConsolidation,
  classifyNationalConsolidationBand,
  computeNationalConsolidationPressure,
  computeNationalProductionTransitionConsolidation,
  summarizeRegionalTransitionConsolidation,
  runAgent08TransitionConsolidationSelfTests,
} from './production-transition-consolidation';

export type {
  FirmProductionTransitionConsolidation,
  NationalProductionTransitionConsolidation,
  RegionalTransitionConsolidationSummary,
  TransitionConsolidationBand,
} from './production-transition-consolidation';

export {
  AGENT08_TRANSITION_SUSTAINMENT_SCHEMA_VERSION,
  buildFirmProductionTransitionSustainment,
  classifyNationalSustainmentBand,
  computeNationalSustainmentPressure,
  computeNationalProductionTransitionSustainment,
  summarizeRegionalTransitionSustainment,
  runAgent08TransitionSustainmentSelfTests,
} from './production-transition-sustainment';

export type {
  FirmProductionTransitionSustainment,
  NationalProductionTransitionSustainment,
  RegionalTransitionSustainmentSummary,
  TransitionSustainmentBand,
} from './production-transition-sustainment';

export {
  AGENT08_TRANSITION_RESILIENCE_SCHEMA_VERSION,
  buildFirmProductionTransitionResilience,
  classifyNationalResilienceBand,
  computeNationalResiliencePressure,
  computeNationalProductionTransitionResilience,
  summarizeRegionalTransitionResilience,
  runAgent08TransitionResilienceSelfTests,
} from './production-transition-resilience';

export type {
  FirmProductionTransitionResilience,
  NationalProductionTransitionResilience,
  RegionalTransitionResilienceSummary,
  TransitionResilienceBand,
} from './production-transition-resilience';

export {
  AGENT08_TRANSITION_EQUILIBRIUM_SCHEMA_VERSION,
  buildFirmProductionTransitionEquilibrium,
  classifyNationalEquilibriumBand,
  computeNationalEquilibriumPressure,
  computeNationalProductionTransitionEquilibrium,
  summarizeRegionalTransitionEquilibrium,
  runAgent08TransitionEquilibriumSelfTests,
} from './production-transition-equilibrium';

export type {
  FirmProductionTransitionEquilibrium,
  NationalProductionTransitionEquilibrium,
  RegionalTransitionEquilibriumSummary,
  TransitionEquilibriumBand,
} from './production-transition-equilibrium';

export {
  AGENT08_TRANSITION_MATURITY_SCHEMA_VERSION,
  buildFirmProductionTransitionMaturity,
  classifyNationalMaturityBand,
  computeNationalMaturityPressure,
  computeNationalProductionTransitionMaturity,
  summarizeRegionalTransitionMaturity,
  runAgent08TransitionMaturitySelfTests,
} from './production-transition-maturity';

export type {
  FirmProductionTransitionMaturity,
  NationalProductionTransitionMaturity,
  RegionalTransitionMaturitySummary,
  TransitionMaturityBand,
} from './production-transition-maturity';

export {
  AGENT08_TRANSITION_CONTINUITY_SCHEMA_VERSION,
  buildFirmProductionTransitionContinuity,
  classifyNationalContinuityBand,
  computeNationalContinuityPressure,
  computeNationalProductionTransitionContinuity,
  summarizeRegionalTransitionContinuity,
  runAgent08TransitionContinuitySelfTests,
} from './production-transition-continuity';

export type {
  FirmProductionTransitionContinuity,
  NationalProductionTransitionContinuity,
  RegionalTransitionContinuitySummary,
  TransitionContinuityBand,
} from './production-transition-continuity';

export {
  AGENT08_TRANSITION_HERITAGE_SCHEMA_VERSION,
  buildFirmProductionTransitionHeritage,
  classifyNationalHeritageBand,
  computeNationalHeritagePressure,
  computeNationalProductionTransitionHeritage,
  summarizeRegionalTransitionHeritage,
  runAgent08TransitionHeritageSelfTests,
} from './production-transition-heritage';

export type {
  FirmProductionTransitionHeritage,
  NationalProductionTransitionHeritage,
  RegionalTransitionHeritageSummary,
  TransitionHeritageBand,
} from './production-transition-heritage';

export {
  AGENT08_TRANSITION_CODIFICATION_SCHEMA_VERSION,
  buildFirmProductionTransitionCodification,
  classifyNationalCodificationBand,
  computeNationalCodificationPressure,
  computeNationalProductionTransitionCodification,
  summarizeRegionalTransitionCodification,
  runAgent08TransitionCodificationSelfTests,
} from './production-transition-codification';

export type {
  FirmProductionTransitionCodification,
  NationalProductionTransitionCodification,
  RegionalTransitionCodificationSummary,
  TransitionCodificationBand,
} from './production-transition-codification';

export {
  AGENT08_TRANSITION_STEWARDSHIP_SCHEMA_VERSION,
  buildFirmProductionTransitionStewardship,
  classifyNationalStewardshipBand,
  computeNationalStewardshipPressure,
  computeNationalProductionTransitionStewardship,
  summarizeRegionalTransitionStewardship,
  runAgent08TransitionStewardshipSelfTests,
} from './production-transition-stewardship';

export type {
  FirmProductionTransitionStewardship,
  NationalProductionTransitionStewardship,
  RegionalTransitionStewardshipSummary,
  TransitionStewardshipBand,
} from './production-transition-stewardship';

export {
  AGENT08_TRANSITION_GOVERNANCE_SCHEMA_VERSION,
  buildFirmProductionTransitionGovernance,
  classifyNationalGovernanceBand,
  computeNationalGovernancePressure,
  computeNationalProductionTransitionGovernance,
  summarizeRegionalTransitionGovernance,
  runAgent08TransitionGovernanceSelfTests,
} from './production-transition-governance';

export type {
  FirmProductionTransitionGovernance,
  NationalProductionTransitionGovernance,
  RegionalTransitionGovernanceSummary,
  TransitionGovernanceBand,
} from './production-transition-governance';

export {
  AGENT08_TRANSITION_ACCOUNTABILITY_SCHEMA_VERSION,
  buildFirmProductionTransitionAccountability,
  classifyNationalAccountabilityBand,
  computeNationalAccountabilityPressure,
  computeNationalProductionTransitionAccountability,
  summarizeRegionalTransitionAccountability,
  runAgent08TransitionAccountabilitySelfTests,
} from './production-transition-accountability';

export type {
  FirmProductionTransitionAccountability,
  NationalProductionTransitionAccountability,
  RegionalTransitionAccountabilitySummary,
  TransitionAccountabilityBand,
} from './production-transition-accountability';

export {
  AGENT08_TRANSITION_ASSURANCE_SCHEMA_VERSION,
  buildFirmProductionTransitionAssurance,
  classifyNationalAssuranceBand,
  computeNationalAssurancePressure,
  computeNationalProductionTransitionAssurance,
  summarizeRegionalTransitionAssurance,
  runAgent08TransitionAssuranceSelfTests,
} from './production-transition-assurance';

export type {
  FirmProductionTransitionAssurance,
  NationalProductionTransitionAssurance,
  RegionalTransitionAssuranceSummary,
  TransitionAssuranceBand,
} from './production-transition-assurance';

export {
  AGENT08_TRANSITION_TRUST_SCHEMA_VERSION,
  buildFirmProductionTransitionTrust,
  classifyNationalTrustBand,
  computeNationalTrustPressure,
  computeNationalProductionTransitionTrust,
  summarizeRegionalTransitionTrust,
  runAgent08TransitionTrustSelfTests,
} from './production-transition-trust';

export type {
  FirmProductionTransitionTrust,
  NationalProductionTransitionTrust,
  RegionalTransitionTrustSummary,
  TransitionTrustBand,
} from './production-transition-trust';

export {
  AGENT08_TRANSITION_LEGITIMACY_SCHEMA_VERSION,
  buildFirmProductionTransitionLegitimacy,
  classifyNationalLegitimacyBand,
  computeNationalLegitimacyPressure,
  computeNationalProductionTransitionLegitimacy,
  summarizeRegionalTransitionLegitimacy,
  runAgent08TransitionLegitimacySelfTests,
} from './production-transition-legitimacy';

export type {
  FirmProductionTransitionLegitimacy,
  NationalProductionTransitionLegitimacy,
  RegionalTransitionLegitimacySummary,
  TransitionLegitimacyBand,
} from './production-transition-legitimacy';

export {
  AGENT08_TRANSITION_RECOGNITION_SCHEMA_VERSION,
  buildFirmProductionTransitionRecognition,
  classifyNationalRecognitionBand,
  computeNationalRecognitionPressure,
  computeNationalProductionTransitionRecognition,
  summarizeRegionalTransitionRecognition,
  runAgent08TransitionRecognitionSelfTests,
} from './production-transition-recognition';

export type {
  FirmProductionTransitionRecognition,
  NationalProductionTransitionRecognition,
  RegionalTransitionRecognitionSummary,
  TransitionRecognitionBand,
} from './production-transition-recognition';

export {
  AGENT08_TRANSITION_PRECEDENCE_SCHEMA_VERSION,
  buildFirmProductionTransitionPrecedence,
  classifyNationalPrecedenceBand,
  computeNationalPrecedencePressure,
  computeNationalProductionTransitionPrecedence,
  summarizeRegionalTransitionPrecedence,
  runAgent08TransitionPrecedenceSelfTests,
} from './production-transition-precedence';

export type {
  FirmProductionTransitionPrecedence,
  NationalProductionTransitionPrecedence,
  RegionalTransitionPrecedenceSummary,
  TransitionPrecedenceBand,
} from './production-transition-precedence';

export {
  AGENT08_TRANSITION_RATIFICATION_SCHEMA_VERSION,
  buildFirmProductionTransitionRatification,
  classifyNationalRatificationBand,
  computeNationalRatificationPressure,
  computeNationalProductionTransitionRatification,
  summarizeRegionalTransitionRatification,
  runAgent08TransitionRatificationSelfTests,
} from './production-transition-ratification';

export type {
  FirmProductionTransitionRatification,
  NationalProductionTransitionRatification,
  RegionalTransitionRatificationSummary,
  TransitionRatificationBand,
} from './production-transition-ratification';

export {
  AGENT08_TRANSITION_CONFIRMATION_SCHEMA_VERSION,
  buildFirmProductionTransitionConfirmation,
  classifyNationalConfirmationBand,
  computeNationalConfirmationPressure,
  computeNationalProductionTransitionConfirmation,
  summarizeRegionalTransitionConfirmation,
  runAgent08TransitionConfirmationSelfTests,
} from './production-transition-confirmation';

export type {
  FirmProductionTransitionConfirmation,
  NationalProductionTransitionConfirmation,
  RegionalTransitionConfirmationSummary,
  TransitionConfirmationBand,
} from './production-transition-confirmation';

export {
  AGENT08_TRANSITION_FINALIZATION_SCHEMA_VERSION,
  buildFirmProductionTransitionFinalization,
  classifyNationalFinalizationBand,
  computeNationalFinalizationPressure,
  computeNationalProductionTransitionFinalization,
  summarizeRegionalTransitionFinalization,
  runAgent08TransitionFinalizationSelfTests,
} from './production-transition-finalization';

export type {
  FirmProductionTransitionFinalization,
  NationalProductionTransitionFinalization,
  RegionalTransitionFinalizationSummary,
  TransitionFinalizationBand,
} from './production-transition-finalization';

export {
  AGENT08_TRANSITION_CLOSURE_SCHEMA_VERSION,
  buildFirmProductionTransitionClosure,
  classifyNationalClosureBand,
  computeNationalClosurePressure,
  computeNationalProductionTransitionClosure,
  summarizeRegionalTransitionClosure,
  runAgent08TransitionClosureSelfTests,
} from './production-transition-closure';

export type {
  FirmProductionTransitionClosure,
  NationalProductionTransitionClosure,
  RegionalTransitionClosureSummary,
  TransitionClosureBand,
} from './production-transition-closure';

export {
  AGENT08_TRANSITION_COMPLETION_SCHEMA_VERSION,
  buildFirmProductionTransitionCompletion,
  classifyNationalCompletionBand,
  computeNationalCompletionPressure,
  computeNationalProductionTransitionCompletion,
  summarizeRegionalTransitionCompletion,
  runAgent08TransitionCompletionSelfTests,
} from './production-transition-completion';

export type {
  FirmProductionTransitionCompletion,
  NationalProductionTransitionCompletion,
  RegionalTransitionCompletionSummary,
  TransitionCompletionBand,
} from './production-transition-completion';

export {
  AGENT08_TRANSITION_RESOLUTION_SCHEMA_VERSION,
  buildFirmProductionTransitionResolution,
  classifyNationalResolutionBand,
  computeNationalResolutionPressure,
  computeNationalProductionTransitionResolution,
  summarizeRegionalTransitionResolution,
  runAgent08TransitionResolutionSelfTests,
} from './production-transition-resolution';

export type {
  FirmProductionTransitionResolution,
  NationalProductionTransitionResolution,
  RegionalTransitionResolutionSummary,
  TransitionResolutionBand,
} from './production-transition-resolution';

export {
  AGENT08_TRANSITION_SETTLEMENT_SCHEMA_VERSION,
  buildFirmProductionTransitionSettlement,
  classifyNationalSettlementBand,
  computeNationalSettlementPressure,
  computeNationalProductionTransitionSettlement,
  summarizeRegionalTransitionSettlement,
  runAgent08TransitionSettlementSelfTests,
} from './production-transition-settlement';

export type {
  FirmProductionTransitionSettlement,
  NationalProductionTransitionSettlement,
  RegionalTransitionSettlementSummary,
  TransitionSettlementBand,
} from './production-transition-settlement';

export {
  AGENT08_TRANSITION_RETIREMENT_SCHEMA_VERSION,
  buildFirmProductionTransitionRetirement,
  classifyNationalRetirementBand,
  computeNationalRetirementPressure,
  computeNationalProductionTransitionRetirement,
  summarizeRegionalTransitionRetirement,
  runAgent08TransitionRetirementSelfTests,
} from './production-transition-retirement';

export type {
  FirmProductionTransitionRetirement,
  NationalProductionTransitionRetirement,
  RegionalTransitionRetirementSummary,
  TransitionRetirementBand,
} from './production-transition-retirement';

export {
  AGENT08_TRANSITION_LEGACY_SCHEMA_VERSION,
  buildFirmProductionTransitionLegacy,
  classifyNationalLegacyBand,
  computeNationalLegacyPressure,
  computeNationalProductionTransitionLegacy,
  summarizeRegionalTransitionLegacy,
  runAgent08TransitionLegacySelfTests,
} from './production-transition-legacy';

export type {
  FirmProductionTransitionLegacy,
  NationalProductionTransitionLegacy,
  RegionalTransitionLegacySummary,
  TransitionLegacyBand,
} from './production-transition-legacy';

export {
  AGENT08_TRANSITION_REMEMBRANCE_SCHEMA_VERSION,
  buildFirmProductionTransitionRemembrance,
  classifyNationalRemembranceBand,
  computeNationalRemembrancePressure,
  computeNationalProductionTransitionRemembrance,
  summarizeRegionalTransitionRemembrance,
  runAgent08TransitionRemembranceSelfTests,
} from './production-transition-remembrance';

export type {
  FirmProductionTransitionRemembrance,
  NationalProductionTransitionRemembrance,
  RegionalTransitionRemembranceSummary,
  TransitionRemembranceBand,
} from './production-transition-remembrance';

export {
  AGENT08_TRANSITION_COMMEMORATION_SCHEMA_VERSION,
  buildFirmProductionTransitionCommemoration,
  classifyNationalCommemorationBand,
  computeNationalCommemorationPressure,
  computeNationalProductionTransitionCommemoration,
  summarizeRegionalTransitionCommemoration,
  runAgent08TransitionCommemorationSelfTests,
} from './production-transition-commemoration';

export type {
  FirmProductionTransitionCommemoration,
  NationalProductionTransitionCommemoration,
  RegionalTransitionCommemorationSummary,
  TransitionCommemorationBand,
} from './production-transition-commemoration';

export {
  AGENT08_TRANSITION_VENERATION_SCHEMA_VERSION,
  buildFirmProductionTransitionVeneration,
  classifyNationalVenerationBand,
  computeNationalVenerationPressure,
  computeNationalProductionTransitionVeneration,
  summarizeRegionalTransitionVeneration,
  runAgent08TransitionVenerationSelfTests,
} from './production-transition-veneration';

export type {
  FirmProductionTransitionVeneration,
  NationalProductionTransitionVeneration,
  RegionalTransitionVenerationSummary,
  TransitionVenerationBand,
} from './production-transition-veneration';

export {
  AGENT08_TRANSITION_ENSHRINEMENT_SCHEMA_VERSION,
  buildFirmProductionTransitionEnshrinement,
  classifyNationalEnshrinementBand,
  computeNationalEnshrinementPressure,
  computeNationalProductionTransitionEnshrinement,
  summarizeRegionalTransitionEnshrinement,
  runAgent08TransitionEnshrinementSelfTests,
} from './production-transition-enshrinement';

export type {
  FirmProductionTransitionEnshrinement,
  NationalProductionTransitionEnshrinement,
  RegionalTransitionEnshrinementSummary,
  TransitionEnshrinementBand,
} from './production-transition-enshrinement';

export {
  AGENT08_TRANSITION_IMMORTALIZATION_SCHEMA_VERSION,
  buildFirmProductionTransitionImmortalization,
  classifyNationalImmortalizationBand,
  computeNationalImmortalizationPressure,
  computeNationalProductionTransitionImmortalization,
  summarizeRegionalTransitionImmortalization,
  runAgent08TransitionImmortalizationSelfTests,
} from './production-transition-immortalization';

export type {
  FirmProductionTransitionImmortalization,
  NationalProductionTransitionImmortalization,
  RegionalTransitionImmortalizationSummary,
  TransitionImmortalizationBand,
} from './production-transition-immortalization';

export {
  AGENT08_TRANSITION_TRANSCENDENCE_SCHEMA_VERSION,
  buildFirmProductionTransitionTranscendence,
  classifyNationalTranscendenceBand,
  computeNationalTranscendencePressure,
  computeNationalProductionTransitionTranscendence,
  summarizeRegionalTransitionTranscendence,
  runAgent08TransitionTranscendenceSelfTests,
} from './production-transition-transcendence';

export type {
  FirmProductionTransitionTranscendence,
  NationalProductionTransitionTranscendence,
  RegionalTransitionTranscendenceSummary,
  TransitionTranscendenceBand,
} from './production-transition-transcendence';

export {
  AGENT08_TRANSITION_APOTHEOSIS_SCHEMA_VERSION,
  buildFirmProductionTransitionApotheosis,
  classifyNationalApotheosisBand,
  computeNationalApotheosisPressure,
  computeNationalProductionTransitionApotheosis,
  summarizeRegionalTransitionApotheosis,
  runAgent08TransitionApotheosisSelfTests,
} from './production-transition-apotheosis';

export type {
  FirmProductionTransitionApotheosis,
  NationalProductionTransitionApotheosis,
  RegionalTransitionApotheosisSummary,
  TransitionApotheosisBand,
} from './production-transition-apotheosis';

export {
  AGENT08_TRANSITION_DEIFICATION_SCHEMA_VERSION,
  buildFirmProductionTransitionDeification,
  classifyNationalDeificationBand,
  computeNationalDeificationPressure,
  computeNationalProductionTransitionDeification,
  summarizeRegionalTransitionDeification,
  runAgent08TransitionDeificationSelfTests,
} from './production-transition-deification';

export type {
  FirmProductionTransitionDeification,
  NationalProductionTransitionDeification,
  RegionalTransitionDeificationSummary,
  TransitionDeificationBand,
} from './production-transition-deification';

import { runV1014_PRIVATE_PrivateSectorSelfTests } from './v1014-private-sector-core';
import { runAgent08TaxLaborSelfTests } from './tax-labor-capacity-linkage';
import { runAgent08SupplyChainSelfTests } from './supply-chain-firm-depth';
import { runAgent08SectorDepthSelfTests } from './sector-production-depth';
import { runAgent08CascadeSelfTests } from './production-capacity-cascade';
import { runAgent08IntegratedSelfTests } from './integrated-production-synthesis';
import { runAgent08RecoverySelfTests } from './production-recovery-playbook';
import { runAgent08StabilizationSelfTests } from './production-stabilization-outlook';
import { runAgent08MandateSelfTests } from './production-coordination-mandate';
import { runAgent08ComplianceSelfTests } from './production-mandate-compliance';
import { runAgent08RemediationSelfTests } from './production-compliance-remediation';
import { runAgent08ExecutionSelfTests } from './production-remediation-execution';
import { runAgent08UtilizationDepthSelfTests } from './production-utilization-depth';
import { runAgent08ReconciliationSelfTests } from './production-capacity-reconciliation';
import { runAgent08OperatingPrioritySelfTests } from './production-operating-priorities';
import { runAgent08OperatingDigestSelfTests } from './production-operating-digest';
import { runAgent08ReadinessPortfolioSelfTests } from './production-readiness-portfolio';
import { runAgent08TransitionHorizonSelfTests } from './production-transition-horizon';
import { runAgent08TransitionCommitmentSelfTests } from './production-transition-commitment';
import { runAgent08TransitionMobilizationSelfTests } from './production-transition-mobilization';
import { runAgent08TransitionDeploymentSelfTests } from './production-transition-deployment';
import { runAgent08TransitionValidationSelfTests } from './production-transition-validation';
import { runAgent08TransitionConsolidationSelfTests } from './production-transition-consolidation';
import { runAgent08TransitionSustainmentSelfTests } from './production-transition-sustainment';
import { runAgent08TransitionResilienceSelfTests } from './production-transition-resilience';
import { runAgent08TransitionEquilibriumSelfTests } from './production-transition-equilibrium';
import { runAgent08TransitionMaturitySelfTests } from './production-transition-maturity';
import { runAgent08TransitionContinuitySelfTests } from './production-transition-continuity';
import { runAgent08TransitionHeritageSelfTests } from './production-transition-heritage';
import { runAgent08TransitionCodificationSelfTests } from './production-transition-codification';
import { runAgent08TransitionStewardshipSelfTests } from './production-transition-stewardship';
import { runAgent08TransitionGovernanceSelfTests } from './production-transition-governance';
import { runAgent08TransitionAccountabilitySelfTests } from './production-transition-accountability';
import { runAgent08TransitionAssuranceSelfTests } from './production-transition-assurance';
import { runAgent08TransitionTrustSelfTests } from './production-transition-trust';
import { runAgent08TransitionLegitimacySelfTests } from './production-transition-legitimacy';
import { runAgent08TransitionRecognitionSelfTests } from './production-transition-recognition';
import { runAgent08TransitionPrecedenceSelfTests } from './production-transition-precedence';
import { runAgent08TransitionRatificationSelfTests } from './production-transition-ratification';
import { runAgent08TransitionConfirmationSelfTests } from './production-transition-confirmation';
import { runAgent08TransitionFinalizationSelfTests } from './production-transition-finalization';
import { runAgent08TransitionClosureSelfTests } from './production-transition-closure';
import { runAgent08TransitionCompletionSelfTests } from './production-transition-completion';
import { runAgent08TransitionResolutionSelfTests } from './production-transition-resolution';
import { runAgent08TransitionSettlementSelfTests } from './production-transition-settlement';
import { runAgent08TransitionRetirementSelfTests } from './production-transition-retirement';
import { runAgent08TransitionLegacySelfTests } from './production-transition-legacy';
import { runAgent08TransitionRemembranceSelfTests } from './production-transition-remembrance';
import { runAgent08TransitionCommemorationSelfTests } from './production-transition-commemoration';
import { runAgent08TransitionVenerationSelfTests } from './production-transition-veneration';
import { runAgent08TransitionEnshrinementSelfTests } from './production-transition-enshrinement';
import { runAgent08TransitionImmortalizationSelfTests } from './production-transition-immortalization';
import { runAgent08TransitionTranscendenceSelfTests } from './production-transition-transcendence';
import { runAgent08TransitionApotheosisSelfTests } from './production-transition-apotheosis';
import { runAgent08TransitionDeificationSelfTests } from './production-transition-deification';

/** Combined self-test entrypoint for CI and Agent 25 merge verification. */
export function runAgent08ModuleSelfTests(): Array<{ id: string; name?: string; passed: boolean; detail: string }> {
  const core = runV1014_PRIVATE_PrivateSectorSelfTests().map(t => ({
    id: t.id,
    name: t.name,
    passed: t.passed,
    detail: t.detail,
  }));
  const taxLabor = runAgent08TaxLaborSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const supply = runAgent08SupplyChainSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const sector = runAgent08SectorDepthSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const cascade = runAgent08CascadeSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const integrated = runAgent08IntegratedSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const recovery = runAgent08RecoverySelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const stabilization = runAgent08StabilizationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const mandate = runAgent08MandateSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const compliance = runAgent08ComplianceSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const remediation = runAgent08RemediationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const execution = runAgent08ExecutionSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const utilizationDepth = runAgent08UtilizationDepthSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const reconciliation = runAgent08ReconciliationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const operatingPriority = runAgent08OperatingPrioritySelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const operatingDigest = runAgent08OperatingDigestSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const readinessPortfolio = runAgent08ReadinessPortfolioSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionHorizon = runAgent08TransitionHorizonSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionCommitment = runAgent08TransitionCommitmentSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionMobilization = runAgent08TransitionMobilizationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionDeployment = runAgent08TransitionDeploymentSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionValidation = runAgent08TransitionValidationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionConsolidation = runAgent08TransitionConsolidationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionSustainment = runAgent08TransitionSustainmentSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionResilience = runAgent08TransitionResilienceSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionEquilibrium = runAgent08TransitionEquilibriumSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionMaturity = runAgent08TransitionMaturitySelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionContinuity = runAgent08TransitionContinuitySelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionHeritage = runAgent08TransitionHeritageSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionCodification = runAgent08TransitionCodificationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionStewardship = runAgent08TransitionStewardshipSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionGovernance = runAgent08TransitionGovernanceSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionAccountability = runAgent08TransitionAccountabilitySelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionAssurance = runAgent08TransitionAssuranceSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionTrust = runAgent08TransitionTrustSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionLegitimacy = runAgent08TransitionLegitimacySelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionRecognition = runAgent08TransitionRecognitionSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionPrecedence = runAgent08TransitionPrecedenceSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionRatification = runAgent08TransitionRatificationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionConfirmation = runAgent08TransitionConfirmationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionFinalization = runAgent08TransitionFinalizationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionClosure = runAgent08TransitionClosureSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionCompletion = runAgent08TransitionCompletionSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionResolution = runAgent08TransitionResolutionSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionSettlement = runAgent08TransitionSettlementSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionRetirement = runAgent08TransitionRetirementSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionLegacy = runAgent08TransitionLegacySelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionRemembrance = runAgent08TransitionRemembranceSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionCommemoration = runAgent08TransitionCommemorationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionVeneration = runAgent08TransitionVenerationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionEnshrinement = runAgent08TransitionEnshrinementSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionImmortalization = runAgent08TransitionImmortalizationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionTranscendence = runAgent08TransitionTranscendenceSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionApotheosis = runAgent08TransitionApotheosisSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  const transitionDeification = runAgent08TransitionDeificationSelfTests().map(t => ({
    id: t.id,
    passed: t.passed,
    detail: t.detail,
  }));
  return [
    ...core.slice(0, 5),
    ...taxLabor,
    ...supply,
    ...sector,
    ...cascade,
    ...integrated,
    ...recovery,
    ...stabilization,
    ...mandate,
    ...compliance,
    ...remediation,
    ...execution,
    ...utilizationDepth,
    ...reconciliation,
    ...operatingPriority,
    ...operatingDigest,
    ...readinessPortfolio,
    ...transitionHorizon,
    ...transitionCommitment,
    ...transitionMobilization,
    ...transitionDeployment,
    ...transitionValidation,
    ...transitionConsolidation,
    ...transitionSustainment,
    ...transitionResilience,
    ...transitionEquilibrium,
    ...transitionMaturity,
    ...transitionContinuity,
    ...transitionHeritage,
    ...transitionCodification,
    ...transitionStewardship,
    ...transitionGovernance,
    ...transitionAccountability,
    ...transitionAssurance,
    ...transitionTrust,
    ...transitionLegitimacy,
    ...transitionRecognition,
    ...transitionPrecedence,
    ...transitionRatification,
    ...transitionConfirmation,
    ...transitionFinalization,
    ...transitionClosure,
    ...transitionCompletion,
    ...transitionResolution,
    ...transitionSettlement,
    ...transitionRetirement,
    ...transitionLegacy,
    ...transitionRemembrance,
    ...transitionCommemoration,
    ...transitionVeneration,
    ...transitionEnshrinement,
    ...transitionImmortalization,
    ...transitionTranscendence,
    ...transitionApotheosis,
    ...transitionDeification,
  ];
}
