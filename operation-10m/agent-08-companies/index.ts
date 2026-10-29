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
  ];
}
