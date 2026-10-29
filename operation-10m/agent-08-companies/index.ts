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
  ];
}
