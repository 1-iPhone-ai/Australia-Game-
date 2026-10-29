import { RESEARCH_BRANCHES, RESEARCH_NODE_BY_ID } from './branches.ts';
import { V94_REGION_CODES } from './v94-ids.ts';
import type {
  InstitutionUpgradeState,
  InstitutionUpgradeTier,
  ResearchBranchEmphasisState,
  ResearchBranchId,
  ResearchProgramEmphasis,
  ResearchProgressSchemaVersion,
  ResearchProgressState,
  ResearchSaveMigrationEntry,
  UnlockedResearchNode,
  ResearchSaveKind,
  ResearchUnlockEvent,
  ResearchEmphasisChangeEvent,
  ResearchInstitutionTierSnapshot,
  ResearchReadinessMilestoneEvent,
  ResearchReadinessBranchSnapshot,
  ResearchIntegrationRiskEvent,
  ResearchIntegrationRiskSnapshot,
  ResearchScaleWaveSnapshot,
  ResearchSynergySnapshot,
  ResearchSynergyThresholdEvent,
  ResearchCommercializationMilestoneEvent,
  ResearchCommercializationSnapshot,
  ResearchDiffusionIntegrationMilestoneEvent,
  ResearchDiffusionIntegrationSnapshot,
  ResearchPortfolioBalanceBandEvent,
  ResearchPortfolioBalanceSnapshot,
  ResearchDiffusionForecastBandEvent,
  ResearchDiffusionForecastSnapshot,
  ResearchHorizonConvergenceBandEvent,
  ResearchHorizonConvergenceSnapshot,
  ResearchExecutionBandEvent,
  ResearchExecutionSnapshot,
  ResearchStrategicDeliveryBandEvent,
  ResearchStrategicDeliverySnapshot,
  ResearchScaleWaveMaturityBandEvent,
  ResearchScaleWaveMaturitySnapshot,
  ResearchNationalIntegrationBandEvent,
  ResearchNationalIntegrationSnapshot,
  ResearchScaleWaveProjectionBandEvent,
  ResearchScaleWaveProjectionSnapshot,
  ResearchTrancheProjectionBandEvent,
  ResearchTrancheProjectionSnapshot,
  ResearchScaleWaveIntegrationGateBandEvent,
  ResearchScaleWaveIntegrationGateSnapshot,
  ResearchTrancheDryRunHandoffBandEvent,
  ResearchTrancheDryRunHandoffSnapshot,
  ResearchMergedIntegrationBaselineBandEvent,
  ResearchMergedIntegrationBaselineSnapshot,
  ResearchScaleWavePostIntegrationDryRunBandEvent,
  ResearchScaleWavePostIntegrationDryRunSnapshot,
  ResearchScaleWaveIntegrationSealBandEvent,
  ResearchScaleWaveIntegrationSealSnapshot,
  ResearchScaleWavePostSealHandoffBandEvent,
  ResearchScaleWavePostSealHandoffSnapshot,
  ResearchScaleWaveIntegrationContinuityBandEvent,
  ResearchScaleWaveIntegrationContinuitySnapshot,
  ResearchScaleWaveContinuityHandoffBandEvent,
  ResearchScaleWaveContinuityHandoffSnapshot,
  ResearchScaleWaveHandoffIntegrationBandEvent,
  ResearchScaleWaveHandoffIntegrationSnapshot,
  ResearchScaleWaveHandoffIntegrationSealBandEvent,
  ResearchScaleWaveHandoffIntegrationSealSnapshot,
  ResearchScaleWaveIntegrationSealHandoffBandEvent,
  ResearchScaleWaveIntegrationSealHandoffSnapshot,
  ResearchScaleWaveSealHandoffContinuityBandEvent,
  ResearchScaleWaveSealHandoffContinuitySnapshot,
  ResearchScaleWaveSealHandoffIntegrationBandEvent,
  ResearchScaleWaveSealHandoffIntegrationSnapshot,
  ResearchScaleWaveSealHandoffIntegrationSealBandEvent,
  ResearchScaleWaveSealHandoffIntegrationSealSnapshot,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityBandEvent,
  ResearchScaleWaveSealHandoffIntegrationSealContinuitySnapshot,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBandEvent,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffSnapshot,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationBandEvent,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent,
  ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot,
} from './types.ts';
import { RESEARCH_PROGRESS_SCHEMA_VERSION } from './types.ts';
import { appendUnlockEvents, rebuildUnlockEventLogFromNodes, emptyUnlockEventLog } from './unlock-event-log.ts';
import {
  appendEmphasisChangeEvent,
  emptyEmphasisChangeLog,
  rebuildEmphasisChangeLogFromBranchEmphasis,
} from './emphasis-change-log.ts';
import { computeInstitutionTierSnapshot } from './institution-tier-snapshot.ts';
import {
  appendReadinessMilestoneEvents,
  emptyReadinessMilestoneLog,
  rebuildReadinessMilestoneLogFromSnapshot,
} from './readiness-milestone-log.ts';
import { computeReadinessBranchSnapshot } from './readiness-branch-snapshot.ts';
import {
  appendIntegrationRiskEvents,
  emptyIntegrationRiskLog,
  RESEARCH_INTEGRATION_RISK_LOG_CAP,
} from './integration-risk-log.ts';
import {
  computeIntegrationRiskSnapshot,
  mergeIntegrationRiskSnapshots,
} from './integration-risk-snapshot.ts';
import { computeScaleWaveSnapshot, mergeScaleWaveSnapshots } from './scale-wave-snapshot.ts';
import {
  appendSynergyThresholdEvents,
  emptySynergyThresholdLog,
  RESEARCH_SYNERGY_THRESHOLD_LOG_CAP,
} from './synergy-threshold-log.ts';
import { computeSynergySnapshot, mergeSynergySnapshots } from './synergy-snapshot.ts';
import {
  appendCommercializationMilestoneEvents,
  emptyCommercializationMilestoneLog,
  RESEARCH_COMMERCIALIZATION_MILESTONE_LOG_CAP,
} from './commercialization-milestone-log.ts';
import { computeCommercializationSnapshot, mergeCommercializationSnapshots } from './commercialization-snapshot.ts';
import {
  appendDiffusionIntegrationEvents,
  emptyDiffusionIntegrationLog,
  RESEARCH_DIFFUSION_INTEGRATION_LOG_CAP,
} from './diffusion-integration-log.ts';
import {
  computeDiffusionIntegrationSnapshot,
  mergeDiffusionIntegrationSnapshots,
} from './diffusion-integration-snapshot.ts';
import {
  appendPortfolioBalanceBandEvents,
  emptyPortfolioBalanceLog,
  RESEARCH_PORTFOLIO_BALANCE_LOG_CAP,
} from './portfolio-balance-log.ts';
import { computePortfolioBalanceSnapshot, mergePortfolioBalanceSnapshots } from './portfolio-balance-snapshot.ts';
import {
  appendDiffusionForecastBandEvents,
  emptyDiffusionForecastBandLog,
  RESEARCH_DIFFUSION_FORECAST_BAND_LOG_CAP,
} from './diffusion-forecast-band-log.ts';
import { computeDiffusionForecastSnapshot, mergeDiffusionForecastSnapshots } from './diffusion-forecast-snapshot.ts';
import {
  appendHorizonConvergenceBandEvents,
  emptyHorizonConvergenceBandLog,
  RESEARCH_HORIZON_CONVERGENCE_BAND_LOG_CAP,
} from './horizon-convergence-band-log.ts';
import { computeHorizonConvergenceSnapshot, mergeHorizonConvergenceSnapshots } from './horizon-convergence-snapshot.ts';
import {
  appendResearchExecutionBandEvents,
  emptyResearchExecutionBandLog,
  RESEARCH_EXECUTION_BAND_LOG_CAP,
} from './research-execution-band-log.ts';
import { computeResearchExecutionSnapshot, mergeResearchExecutionSnapshots } from './research-execution-snapshot.ts';
import {
  appendStrategicDeliveryBandEvents,
  emptyStrategicDeliveryBandLog,
  RESEARCH_STRATEGIC_DELIVERY_BAND_LOG_CAP,
} from './strategic-delivery-band-log.ts';
import { computeStrategicDeliverySnapshot, mergeStrategicDeliverySnapshots } from './strategic-delivery-snapshot.ts';
import {
  appendScaleWaveMaturityBandEvents,
  emptyScaleWaveMaturityBandLog,
  RESEARCH_SCALE_WAVE_MATURITY_BAND_LOG_CAP,
} from './scale-wave-maturity-band-log.ts';
import { computeScaleWaveMaturitySnapshot, mergeScaleWaveMaturitySnapshots } from './scale-wave-maturity-snapshot.ts';
import {
  appendNationalIntegrationBandEvents,
  emptyNationalIntegrationBandLog,
  RESEARCH_NATIONAL_INTEGRATION_BAND_LOG_CAP,
} from './national-integration-band-log.ts';
import {
  computeNationalIntegrationSnapshot,
  mergeNationalIntegrationSnapshots,
} from './national-integration-snapshot.ts';
import {
  appendScaleWaveProjectionBandEvents,
  emptyScaleWaveProjectionBandLog,
  RESEARCH_SCALE_WAVE_PROJECTION_BAND_LOG_CAP,
} from './scale-wave-projection-band-log.ts';
import {
  computeScaleWaveProjectionSnapshot,
  mergeScaleWaveProjectionSnapshots,
} from './scale-wave-projection-snapshot.ts';
import {
  appendTrancheProjectionBandEvents,
  emptyTrancheProjectionBandLog,
  RESEARCH_TRANCHE_PROJECTION_BAND_LOG_CAP,
} from './tranche-projection-band-log.ts';
import {
  computeTrancheProjectionSnapshot,
  mergeTrancheProjectionSnapshots,
} from './tranche-projection-snapshot.ts';
import {
  appendIntegrationGateBandEvents,
  emptyIntegrationGateBandLog,
  RESEARCH_INTEGRATION_GATE_BAND_LOG_CAP,
} from './scale-wave-integration-gate-band-log.ts';
import {
  computeIntegrationGateSnapshot,
  mergeIntegrationGateSnapshots,
} from './scale-wave-integration-gate-snapshot.ts';
import {
  appendDryRunHandoffBandEvents,
  emptyDryRunHandoffBandLog,
  RESEARCH_DRY_RUN_HANDOFF_BAND_LOG_CAP,
} from './tranche-dry-run-handoff-band-log.ts';
import {
  computeDryRunHandoffSnapshot,
  mergeDryRunHandoffSnapshots,
} from './tranche-dry-run-handoff-snapshot.ts';
import {
  appendMergedIntegrationBaselineBandEvents,
  emptyMergedIntegrationBaselineBandLog,
  RESEARCH_MERGED_INTEGRATION_BASELINE_BAND_LOG_CAP,
} from './merged-integration-baseline-band-log.ts';
import {
  computeMergedIntegrationBaselineSnapshot,
  mergeMergedIntegrationBaselineSnapshots,
} from './merged-integration-baseline-snapshot.ts';
import {
  appendPostIntegrationDryRunBandEvents,
  emptyPostIntegrationDryRunBandLog,
  RESEARCH_POST_INTEGRATION_DRY_RUN_BAND_LOG_CAP,
} from './post-integration-dry-run-band-log.ts';
import {
  computePostIntegrationDryRunSnapshot,
  mergePostIntegrationDryRunSnapshots,
} from './post-integration-dry-run-snapshot.ts';
import {
  appendIntegrationSealBandEvents,
  emptyIntegrationSealBandLog,
  RESEARCH_INTEGRATION_SEAL_BAND_LOG_CAP,
} from './scale-wave-integration-seal-band-log.ts';
import {
  computeIntegrationSealSnapshot,
  mergeIntegrationSealSnapshots,
} from './scale-wave-integration-seal-snapshot.ts';
import {
  appendPostSealHandoffBandEvents,
  emptyPostSealHandoffBandLog,
  RESEARCH_POST_SEAL_HANDOFF_BAND_LOG_CAP,
} from './scale-wave-post-seal-handoff-band-log.ts';
import {
  computePostSealHandoffSnapshot,
  mergePostSealHandoffSnapshots,
} from './scale-wave-post-seal-handoff-snapshot.ts';
import {
  appendIntegrationContinuityBandEvents,
  emptyIntegrationContinuityBandLog,
  RESEARCH_INTEGRATION_CONTINUITY_BAND_LOG_CAP,
} from './scale-wave-integration-continuity-band-log.ts';
import {
  computeIntegrationContinuitySnapshot,
  mergeIntegrationContinuitySnapshots,
} from './scale-wave-integration-continuity-snapshot.ts';
import {
  appendContinuityHandoffBandEvents,
  emptyContinuityHandoffBandLog,
  RESEARCH_CONTINUITY_HANDOFF_BAND_LOG_CAP,
} from './scale-wave-continuity-handoff-band-log.ts';
import {
  computeContinuityHandoffSnapshot,
  mergeContinuityHandoffSnapshots,
} from './scale-wave-continuity-handoff-snapshot.ts';
import {
  appendHandoffIntegrationBandEvents,
  emptyHandoffIntegrationBandLog,
  RESEARCH_HANDOFF_INTEGRATION_BAND_LOG_CAP,
} from './scale-wave-handoff-integration-band-log.ts';
import {
  computeHandoffIntegrationSnapshot,
  mergeHandoffIntegrationSnapshots,
} from './scale-wave-handoff-integration-snapshot.ts';
import {
  appendHandoffIntegrationSealBandEvents,
  emptyHandoffIntegrationSealBandLog,
  RESEARCH_HANDOFF_INTEGRATION_SEAL_BAND_LOG_CAP,
} from './scale-wave-handoff-integration-seal-band-log.ts';
import {
  computeHandoffIntegrationSealSnapshot,
  mergeHandoffIntegrationSealSnapshots,
} from './scale-wave-handoff-integration-seal-snapshot.ts';
import {
  appendIntegrationSealHandoffBandEvents,
  emptyIntegrationSealHandoffBandLog,
  RESEARCH_INTEGRATION_SEAL_HANDOFF_BAND_LOG_CAP,
} from './scale-wave-integration-seal-handoff-band-log.ts';
import {
  computeIntegrationSealHandoffSnapshot,
  mergeIntegrationSealHandoffSnapshots,
} from './scale-wave-integration-seal-handoff-snapshot.ts';
import {
  appendSealHandoffContinuityBandEvents,
  emptySealHandoffContinuityBandLog,
  RESEARCH_SEAL_HANDOFF_CONTINUITY_BAND_LOG_CAP,
} from './scale-wave-seal-handoff-continuity-band-log.ts';
import {
  computeSealHandoffContinuitySnapshot,
  mergeSealHandoffContinuitySnapshots,
} from './scale-wave-seal-handoff-continuity-snapshot.ts';
import {
  appendSealHandoffIntegrationBandEvents,
  emptySealHandoffIntegrationBandLog,
  RESEARCH_SEAL_HANDOFF_INTEGRATION_BAND_LOG_CAP,
} from './scale-wave-seal-handoff-integration-band-log.ts';
import {
  computeSealHandoffIntegrationSnapshot,
  mergeSealHandoffIntegrationSnapshots,
} from './scale-wave-seal-handoff-integration-snapshot.ts';
import {
  appendSealHandoffIntegrationSealBandEvents,
  emptySealHandoffIntegrationSealBandLog,
  RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_BAND_LOG_CAP,
} from './scale-wave-seal-handoff-integration-seal-band-log.ts';
import {
  computeSealHandoffIntegrationSealSnapshot,
  mergeSealHandoffIntegrationSealSnapshots,
} from './scale-wave-seal-handoff-integration-seal-snapshot.ts';
import {
  appendSealHandoffIntegrationSealContinuityBandEvents,
  emptySealHandoffIntegrationSealContinuityBandLog,
  RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BAND_LOG_CAP,
} from './scale-wave-seal-handoff-integration-seal-continuity-band-log.ts';
import {
  computeSealHandoffIntegrationSealContinuitySnapshot,
  mergeSealHandoffIntegrationSealContinuitySnapshots,
} from './scale-wave-seal-handoff-integration-seal-continuity-snapshot.ts';
import {
  appendSealHandoffIntegrationSealContinuityHandoffBandEvents,
  emptySealHandoffIntegrationSealContinuityHandoffBandLog,
  RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BAND_LOG_CAP,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-band-log.ts';
import {
  computeSealHandoffIntegrationSealContinuityHandoffSnapshot,
  mergeSealHandoffIntegrationSealContinuityHandoffSnapshots,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-snapshot.ts';
import {
  appendSealHandoffIntegrationSealContinuityHandoffIntegrationBandEvents,
  emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog,
  RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_BAND_LOG_CAP,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-band-log.ts';
import {
  computeSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot,
  mergeSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshots,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-snapshot.ts';
import {
  appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvents,
  emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog,
  RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BAND_LOG_CAP,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-band-log.ts';
import {
  computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot,
  mergeSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshots,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-snapshot.ts';
import {
  appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvents,
  emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog,
  RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BAND_LOG_CAP,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-band-log.ts';
import {
  computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot,
  mergeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshots,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-snapshot.ts';
import {
  appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandEvents,
  emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog,
  RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BAND_LOG_CAP,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-band-log.ts';
import {
  computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot,
  mergeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshots,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-snapshot.ts';
import {
  appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvents,
  emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog,
  RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_BAND_LOG_CAP,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-band-log.ts';
import {
  computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot,
  mergeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshots,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-snapshot.ts';
import {
  appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvents,
  emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog,
  RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BAND_LOG_CAP,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-band-log.ts';
import {
  computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot,
  mergeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshots,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-snapshot.ts';
import {
  appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvents,
  emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog,
  RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BAND_LOG_CAP,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-band-log.ts';
import {
  computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot,
  mergeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshots,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-snapshot.ts';
import {
  appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandEvents,
  emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog,
  RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BAND_LOG_CAP,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-band-log.ts';
import {
  computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot,
  mergeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshots,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-snapshot.ts';
import {
  appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvents,
  emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-band-log.ts';
import {
  computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot,
  mergeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshots,
} from './scale-wave-seal-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-seal-continuity-handoff-integration-snapshot.ts';
import { INSTITUTION_UPGRADE_TIER_RANK } from './institution-upgrades.ts';

export type { ResearchProgressSchemaVersion, ResearchBranchEmphasisState, ResearchProgramEmphasis } from './types.ts';
export { RESEARCH_PROGRESS_SCHEMA_VERSION } from './types.ts';

export function defaultBranchEmphasis(): ResearchBranchEmphasisState[] {
  return RESEARCH_BRANCHES.map(b => ({
    branchId: b.id,
    emphasis: (
      {
        sovereign_research: 'sovereign',
        industrial_transformation: 'commercial',
        digital_frontier: 'applied',
      } as Partial<Record<ResearchBranchId, ResearchProgramEmphasis>>
    )[b.id] ?? 'fundamental',
    setTurn: 0,
  }));
}

/** Fields written to disk; derived analytics recomputed on load/turn. */
export interface ResearchProgressPersistedCore {
  schemaVersion: typeof RESEARCH_PROGRESS_SCHEMA_VERSION;
  revision: number;
  turn: number;
  unlockedNodes: UnlockedResearchNode[];
  institutionUpgrades: InstitutionUpgradeState[];
  leadingResearchRegion: ResearchProgressState['leadingResearchRegion'];
  unlockSeq: number;
  branchEmphasis: ResearchBranchEmphasisState[];
  /** Stable hash of persistable payload (excludes fingerprint field). */
  coreFingerprint: string;
  /** Increment when player/system changes branch emphasis on save core. */
  emphasisRevision: number;
  /** Audit trail of schema hops applied to this blob. */
  migrationLog: ResearchSaveMigrationEntry[];
  saveKind: ResearchSaveKind;
  updatedAtTurn: number;
  sessionId: string;
  /** Monotonic counter incremented on each sealed write (round 4). */
  persistRevision: number;
  /** Bounded unlock audit trail for replay / history (round 5). */
  unlockEventLog: ResearchUnlockEvent[];
  /** Last turn reconcileResearchProgressOnLoad sealed against disk (round 5). */
  lastReconciledAtTurn: number;
  /** Bounded emphasis change audit trail (round 6). */
  emphasisChangeLog: ResearchEmphasisChangeEvent[];
  /** Institution tier digest at last persist seal (round 6). */
  institutionTierSnapshot: ResearchInstitutionTierSnapshot | null;
  /** Bounded readiness milestone audit trail (round 7). */
  readinessMilestoneLog: ResearchReadinessMilestoneEvent[];
  /** Branch readiness digest at last persist seal (round 7). */
  readinessBranchSnapshot: ResearchReadinessBranchSnapshot | null;
  /** Bounded integration-risk band audit trail (round 8). */
  integrationRiskLog: ResearchIntegrationRiskEvent[];
  /** Integration risk digest at last persist seal (round 8). */
  integrationRiskSnapshot: ResearchIntegrationRiskSnapshot | null;
  /** Scale-wave digest at last persist seal (round 8). */
  scaleWaveSnapshot: ResearchScaleWaveSnapshot | null;
  /** Bounded synergy threshold audit trail (round 9). */
  synergyThresholdLog: ResearchSynergyThresholdEvent[];
  /** Synergy digest at last persist seal (round 9). */
  synergySnapshot: ResearchSynergySnapshot | null;
  /** Bounded commercialization milestone audit trail (round 10). */
  commercializationMilestoneLog: ResearchCommercializationMilestoneEvent[];
  /** Commercialization digest at last persist seal (round 10). */
  commercializationSnapshot: ResearchCommercializationSnapshot | null;
  /** Bounded diffusion integration audit trail (round 11). */
  diffusionIntegrationLog: ResearchDiffusionIntegrationMilestoneEvent[];
  /** Diffusion integration digest at last persist seal (round 11). */
  diffusionIntegrationSnapshot: ResearchDiffusionIntegrationSnapshot | null;
  /** Bounded portfolio balance band audit trail (round 12). */
  portfolioBalanceLog: ResearchPortfolioBalanceBandEvent[];
  /** Portfolio balance digest at last persist seal (round 12). */
  portfolioBalanceSnapshot: ResearchPortfolioBalanceSnapshot | null;
  /** Bounded diffusion forecast band audit trail (round 13). */
  diffusionForecastBandLog: ResearchDiffusionForecastBandEvent[];
  /** Diffusion forecast digest at last persist seal (round 13). */
  diffusionForecastSnapshot: ResearchDiffusionForecastSnapshot | null;
  /** Bounded horizon convergence band audit trail (round 14). */
  horizonConvergenceBandLog: ResearchHorizonConvergenceBandEvent[];
  /** Horizon convergence digest at last persist seal (round 14). */
  horizonConvergenceSnapshot: ResearchHorizonConvergenceSnapshot | null;
  /** Bounded research execution band audit trail (round 15). */
  researchExecutionBandLog: ResearchExecutionBandEvent[];
  /** Research execution digest at last persist seal (round 15). */
  researchExecutionSnapshot: ResearchExecutionSnapshot | null;
  /** Bounded strategic delivery band audit trail (round 16). */
  strategicDeliveryBandLog: ResearchStrategicDeliveryBandEvent[];
  /** Strategic delivery digest at last persist seal (round 16). */
  strategicDeliverySnapshot: ResearchStrategicDeliverySnapshot | null;
  /** Bounded scale-wave maturity band audit trail (round 17). */
  scaleWaveMaturityBandLog: ResearchScaleWaveMaturityBandEvent[];
  /** Scale-wave maturity digest at last persist seal (round 17). */
  scaleWaveMaturitySnapshot: ResearchScaleWaveMaturitySnapshot | null;
  /** Bounded national integration band audit trail (round 18). */
  nationalIntegrationBandLog: ResearchNationalIntegrationBandEvent[];
  /** National integration digest at last persist seal (round 18). */
  nationalIntegrationSnapshot: ResearchNationalIntegrationSnapshot | null;
  scaleWaveProjectionBandLog: ResearchScaleWaveProjectionBandEvent[];
  scaleWaveProjectionSnapshot: ResearchScaleWaveProjectionSnapshot | null;
  trancheProjectionBandLog: ResearchTrancheProjectionBandEvent[];
  trancheProjectionSnapshot: ResearchTrancheProjectionSnapshot | null;
  integrationGateBandLog: ResearchScaleWaveIntegrationGateBandEvent[];
  integrationGateSnapshot: ResearchScaleWaveIntegrationGateSnapshot | null;
  dryRunHandoffBandLog: ResearchTrancheDryRunHandoffBandEvent[];
  dryRunHandoffSnapshot: ResearchTrancheDryRunHandoffSnapshot | null;
  mergedIntegrationBaselineBandLog: ResearchMergedIntegrationBaselineBandEvent[];
  mergedIntegrationBaselineSnapshot: ResearchMergedIntegrationBaselineSnapshot | null;
  postIntegrationDryRunBandLog: ResearchScaleWavePostIntegrationDryRunBandEvent[];
  postIntegrationDryRunSnapshot: ResearchScaleWavePostIntegrationDryRunSnapshot | null;
  integrationSealBandLog: ResearchScaleWaveIntegrationSealBandEvent[];
  integrationSealSnapshot: ResearchScaleWaveIntegrationSealSnapshot | null;
  postSealHandoffBandLog: ResearchScaleWavePostSealHandoffBandEvent[];
  postSealHandoffSnapshot: ResearchScaleWavePostSealHandoffSnapshot | null;
  integrationContinuityBandLog: ResearchScaleWaveIntegrationContinuityBandEvent[];
  integrationContinuitySnapshot: ResearchScaleWaveIntegrationContinuitySnapshot | null;
  continuityHandoffBandLog: ResearchScaleWaveContinuityHandoffBandEvent[];
  continuityHandoffSnapshot: ResearchScaleWaveContinuityHandoffSnapshot | null;
  handoffIntegrationBandLog: ResearchScaleWaveHandoffIntegrationBandEvent[];
  handoffIntegrationSnapshot: ResearchScaleWaveHandoffIntegrationSnapshot | null;
  handoffIntegrationSealBandLog: ResearchScaleWaveHandoffIntegrationSealBandEvent[];
  handoffIntegrationSealSnapshot: ResearchScaleWaveHandoffIntegrationSealSnapshot | null;
  integrationSealHandoffBandLog: ResearchScaleWaveIntegrationSealHandoffBandEvent[];
  integrationSealHandoffSnapshot: ResearchScaleWaveIntegrationSealHandoffSnapshot | null;
  sealHandoffContinuityBandLog: ResearchScaleWaveSealHandoffContinuityBandEvent[];
  sealHandoffContinuitySnapshot: ResearchScaleWaveSealHandoffContinuitySnapshot | null;
  sealHandoffIntegrationBandLog: ResearchScaleWaveSealHandoffIntegrationBandEvent[];
  sealHandoffIntegrationSnapshot: ResearchScaleWaveSealHandoffIntegrationSnapshot | null;
  sealHandoffIntegrationSealBandLog: ResearchScaleWaveSealHandoffIntegrationSealBandEvent[];
  sealHandoffIntegrationSealSnapshot: ResearchScaleWaveSealHandoffIntegrationSealSnapshot | null;
  sealHandoffIntegrationSealContinuityBandLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityBandEvent[];
  sealHandoffIntegrationSealContinuitySnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuitySnapshot | null;
  sealHandoffIntegrationSealContinuityHandoffBandLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBandEvent[];
  sealHandoffIntegrationSealContinuityHandoffSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffSnapshot | null;
  sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationBandEvent[];
  sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot | null;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[];
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot | null;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent[];
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot | null;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandEvent[];
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot | null;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvent[];
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot | null;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[];
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot | null;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent[];
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot | null;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandEvent[];
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot | null;
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvent[];
  sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot | null;
}

export type { ResearchSaveMigrationEntry } from './types.ts';

const LEGACY_V1 = 'op10m-agent03-v1' as const;
const LEGACY_V2 = 'op10m-agent03-v2' as const;
const LEGACY_V3 = 'op10m-agent03-v3' as const;
const LEGACY_V4 = 'op10m-agent03-v4' as const;
const LEGACY_V5 = 'op10m-agent03-v5' as const;
const LEGACY_V6 = 'op10m-agent03-v6' as const;
const LEGACY_V7 = 'op10m-agent03-v7' as const;
const LEGACY_V8 = 'op10m-agent03-v8' as const;
const LEGACY_V9 = 'op10m-agent03-v9' as const;
const LEGACY_V10 = 'op10m-agent03-v10' as const;
const LEGACY_V11 = 'op10m-agent03-v11' as const;
const LEGACY_V12 = 'op10m-agent03-v12' as const;
const LEGACY_V13 = 'op10m-agent03-v13' as const;
const LEGACY_V14 = 'op10m-agent03-v14' as const;
const LEGACY_V15 = 'op10m-agent03-v15' as const;
const LEGACY_V16 = 'op10m-agent03-v16' as const;
const LEGACY_V17 = 'op10m-agent03-v17' as const;
const LEGACY_V18 = 'op10m-agent03-v18' as const;
const LEGACY_V19 = 'op10m-agent03-v19' as const;
const LEGACY_V20 = 'op10m-agent03-v20' as const;
const LEGACY_V21 = 'op10m-agent03-v21' as const;
const LEGACY_V22 = 'op10m-agent03-v22' as const;
const LEGACY_V23 = 'op10m-agent03-v23' as const;
const LEGACY_V24 = 'op10m-agent03-v24' as const;
const LEGACY_V25 = 'op10m-agent03-v25' as const;
const LEGACY_V26 = 'op10m-agent03-v26' as const;
const LEGACY_V27 = 'op10m-agent03-v27' as const;
const LEGACY_V28 = 'op10m-agent03-v28' as const;
const LEGACY_V29 = 'op10m-agent03-v29' as const;
const LEGACY_V30 = 'op10m-agent03-v30' as const;
const LEGACY_V31 = 'op10m-agent03-v31' as const;
const LEGACY_V51 = 'op10m-agent03-v51' as const;
const LEGACY_V50 = 'op10m-agent03-v50' as const;
const LEGACY_V49 = 'op10m-agent03-v49' as const;
const LEGACY_V48 = 'op10m-agent03-v48' as const;
const LEGACY_V47 = 'op10m-agent03-v47' as const;
const LEGACY_V46 = 'op10m-agent03-v46' as const;
const LEGACY_V45 = 'op10m-agent03-v45' as const;
const LEGACY_V44 = 'op10m-agent03-v44' as const;
const LEGACY_V43 = 'op10m-agent03-v43' as const;
const LEGACY_V42 = 'op10m-agent03-v42' as const;
const LEGACY_V41 = 'op10m-agent03-v41' as const;
const LEGACY_V40 = 'op10m-agent03-v40' as const;
const LEGACY_V39 = 'op10m-agent03-v39' as const;
const LEGACY_V38 = 'op10m-agent03-v38' as const;
const LEGACY_V37 = 'op10m-agent03-v37' as const;
const LEGACY_V36 = 'op10m-agent03-v36' as const;
const LEGACY_V35 = 'op10m-agent03-v35' as const;
const LEGACY_V34 = 'op10m-agent03-v34' as const;
const LEGACY_V33 = 'op10m-agent03-v33' as const;
const LEGACY_V32 = 'op10m-agent03-v32' as const;

/** Keys that must never appear on persisted save blobs (Agent 25 guard). */
export const RESEARCH_SAVE_DERIVED_KEYS = [
  'diffusion',
  'readinessByBranch',
  'activeHookIds',
  'inputHash',
  'lateGameDiffusion',
  'scaleWave',
  'commercialization',
  'portfolioBalance',
  'diffusionForecast',
  'synergyOutlook',
  'integrationRiskOutlook',
  'adoptionHorizonOutlook',
  'portfolioStabilizationOutlook',
  'exportContinuityOutlook',
  'nationalCoherenceOutlook',
  'strategicAlignmentOutlook',
  'horizonConvergenceOutlook',
  'researchExecutionOutlook',
  'strategicDeliveryOutlook',
  'scaleWaveMaturityOutlook',
  'nationalIntegrationOutlook',
  'scaleWaveProjectionOutlook',
  'trancheProjectionReadinessOutlook',
  'scaleWaveIntegrationGateOutlook',
  'trancheDryRunHandoffOutlook',
  'mergedIntegrationBaselineOutlook',
  'scaleWavePostIntegrationDryRunOutlook',
  'scaleWaveIntegrationSealOutlook',
  'scaleWavePostSealHandoffOutlook',
  'scaleWaveIntegrationContinuityOutlook',
  'scaleWaveContinuityHandoffOutlook',
  'scaleWaveHandoffIntegrationOutlook',
  'scaleWaveHandoffIntegrationSealOutlook',
  'scaleWaveIntegrationSealHandoffOutlook',
  'scaleWaveSealHandoffContinuityOutlook',
  'scaleWaveSealHandoffIntegrationOutlook',
  'scaleWaveSealHandoffIntegrationSealOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealOutlook',
  'scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSealSealSealSealSealSealSealOutlook',
] as const;

function finalizeCoreForPersist(
  partial: Omit<ResearchProgressPersistedCore, 'coreFingerprint'> & { coreFingerprint?: string }
): ResearchProgressPersistedCore {
  const draft: Omit<ResearchProgressPersistedCore, 'coreFingerprint'> = {
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: partial.revision,
    turn: partial.turn,
    unlockedNodes: partial.unlockedNodes,
    institutionUpgrades: partial.institutionUpgrades,
    leadingResearchRegion: partial.leadingResearchRegion,
    unlockSeq: partial.unlockSeq,
    branchEmphasis: partial.branchEmphasis,
    emphasisRevision: partial.emphasisRevision ?? 0,
    migrationLog: partial.migrationLog ?? [],
    saveKind: partial.saveKind ?? 'manual',
    updatedAtTurn: partial.updatedAtTurn ?? partial.turn,
    sessionId: partial.sessionId ?? `o10m_r03_${partial.turn}_${partial.revision}`,
    persistRevision: partial.persistRevision ?? 0,
    unlockEventLog: partial.unlockEventLog ?? emptyUnlockEventLog(),
    lastReconciledAtTurn: partial.lastReconciledAtTurn ?? partial.turn,
    emphasisChangeLog: partial.emphasisChangeLog ?? emptyEmphasisChangeLog(),
    institutionTierSnapshot: partial.institutionTierSnapshot ?? null,
    readinessMilestoneLog: partial.readinessMilestoneLog ?? emptyReadinessMilestoneLog(),
    readinessBranchSnapshot: partial.readinessBranchSnapshot ?? null,
    integrationRiskLog: partial.integrationRiskLog ?? emptyIntegrationRiskLog(),
    integrationRiskSnapshot: partial.integrationRiskSnapshot ?? null,
    scaleWaveSnapshot: partial.scaleWaveSnapshot ?? null,
    synergyThresholdLog: partial.synergyThresholdLog ?? emptySynergyThresholdLog(),
    synergySnapshot: partial.synergySnapshot ?? null,
    commercializationMilestoneLog: partial.commercializationMilestoneLog ?? emptyCommercializationMilestoneLog(),
    commercializationSnapshot: partial.commercializationSnapshot ?? null,
    diffusionIntegrationLog: partial.diffusionIntegrationLog ?? emptyDiffusionIntegrationLog(),
    diffusionIntegrationSnapshot: partial.diffusionIntegrationSnapshot ?? null,
    portfolioBalanceLog: partial.portfolioBalanceLog ?? emptyPortfolioBalanceLog(),
    portfolioBalanceSnapshot: partial.portfolioBalanceSnapshot ?? null,
    diffusionForecastBandLog: partial.diffusionForecastBandLog ?? emptyDiffusionForecastBandLog(),
    diffusionForecastSnapshot: partial.diffusionForecastSnapshot ?? null,
    horizonConvergenceBandLog: partial.horizonConvergenceBandLog ?? emptyHorizonConvergenceBandLog(),
    horizonConvergenceSnapshot: partial.horizonConvergenceSnapshot ?? null,
    researchExecutionBandLog: partial.researchExecutionBandLog ?? emptyResearchExecutionBandLog(),
    researchExecutionSnapshot: partial.researchExecutionSnapshot ?? null,
    strategicDeliveryBandLog: partial.strategicDeliveryBandLog ?? emptyStrategicDeliveryBandLog(),
    strategicDeliverySnapshot: partial.strategicDeliverySnapshot ?? null,
    scaleWaveMaturityBandLog: partial.scaleWaveMaturityBandLog ?? emptyScaleWaveMaturityBandLog(),
    scaleWaveMaturitySnapshot: partial.scaleWaveMaturitySnapshot ?? null,
    nationalIntegrationBandLog: partial.nationalIntegrationBandLog ?? emptyNationalIntegrationBandLog(),
    nationalIntegrationSnapshot: partial.nationalIntegrationSnapshot ?? null,
    scaleWaveProjectionBandLog: partial.scaleWaveProjectionBandLog ?? emptyScaleWaveProjectionBandLog(),
    scaleWaveProjectionSnapshot: partial.scaleWaveProjectionSnapshot ?? null,
    trancheProjectionBandLog: partial.trancheProjectionBandLog ?? emptyTrancheProjectionBandLog(),
    trancheProjectionSnapshot: partial.trancheProjectionSnapshot ?? null,
    integrationGateBandLog: partial.integrationGateBandLog ?? emptyIntegrationGateBandLog(),
    integrationGateSnapshot: partial.integrationGateSnapshot ?? null,
    dryRunHandoffBandLog: partial.dryRunHandoffBandLog ?? emptyDryRunHandoffBandLog(),
    dryRunHandoffSnapshot: partial.dryRunHandoffSnapshot ?? null,
    mergedIntegrationBaselineBandLog: partial.mergedIntegrationBaselineBandLog ?? emptyMergedIntegrationBaselineBandLog(),
    mergedIntegrationBaselineSnapshot: partial.mergedIntegrationBaselineSnapshot ?? null,
    postIntegrationDryRunBandLog: partial.postIntegrationDryRunBandLog ?? emptyPostIntegrationDryRunBandLog(),
    postIntegrationDryRunSnapshot: partial.postIntegrationDryRunSnapshot ?? null,
    integrationSealBandLog: partial.integrationSealBandLog ?? emptyIntegrationSealBandLog(),
    integrationSealSnapshot: partial.integrationSealSnapshot ?? null,
    postSealHandoffBandLog: partial.postSealHandoffBandLog ?? emptyPostSealHandoffBandLog(),
    postSealHandoffSnapshot: partial.postSealHandoffSnapshot ?? null,
    integrationContinuityBandLog: partial.integrationContinuityBandLog ?? emptyIntegrationContinuityBandLog(),
    integrationContinuitySnapshot: partial.integrationContinuitySnapshot ?? null,
    continuityHandoffBandLog: partial.continuityHandoffBandLog ?? emptyContinuityHandoffBandLog(),
    continuityHandoffSnapshot: partial.continuityHandoffSnapshot ?? null,
    handoffIntegrationBandLog: partial.handoffIntegrationBandLog ?? emptyHandoffIntegrationBandLog(),
    handoffIntegrationSnapshot: partial.handoffIntegrationSnapshot ?? null,
    handoffIntegrationSealBandLog: partial.handoffIntegrationSealBandLog ?? emptyHandoffIntegrationSealBandLog(),
    handoffIntegrationSealSnapshot: partial.handoffIntegrationSealSnapshot ?? null,
    integrationSealHandoffBandLog: partial.integrationSealHandoffBandLog ?? emptyIntegrationSealHandoffBandLog(),
    integrationSealHandoffSnapshot: partial.integrationSealHandoffSnapshot ?? null,
    sealHandoffContinuityBandLog: partial.sealHandoffContinuityBandLog ?? emptySealHandoffContinuityBandLog(),
    sealHandoffContinuitySnapshot: partial.sealHandoffContinuitySnapshot ?? null,
    sealHandoffIntegrationBandLog: partial.sealHandoffIntegrationBandLog ?? emptySealHandoffIntegrationBandLog(),
    sealHandoffIntegrationSnapshot: partial.sealHandoffIntegrationSnapshot ?? null,
    sealHandoffIntegrationSealBandLog: partial.sealHandoffIntegrationSealBandLog ?? emptySealHandoffIntegrationSealBandLog(),
    sealHandoffIntegrationSealSnapshot: partial.sealHandoffIntegrationSealSnapshot ?? null,
    sealHandoffIntegrationSealContinuityBandLog: partial.sealHandoffIntegrationSealContinuityBandLog ?? emptySealHandoffIntegrationSealContinuityBandLog(),
    sealHandoffIntegrationSealContinuitySnapshot: partial.sealHandoffIntegrationSealContinuitySnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffBandLog: partial.sealHandoffIntegrationSealContinuityHandoffBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
    sealHandoffIntegrationSealContinuityHandoffSnapshot: partial.sealHandoffIntegrationSealContinuityHandoffSnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: partial.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot ?? null,
  };
  return { ...draft, coreFingerprint: computePersistedCoreFingerprint(draft) };
}

/** Public alias for lifecycle merge/seal helpers. */
export const finalizePersistedCoreDraft = finalizeCoreForPersist;

export function computePersistedCoreFingerprint(
  core: Omit<ResearchProgressPersistedCore, 'coreFingerprint'>
): string {
  let h = 2166136261 >>> 0;
  const payload = JSON.stringify({
    schemaVersion: core.schemaVersion,
    revision: core.revision,
    turn: core.turn,
    unlockSeq: core.unlockSeq,
    emphasisRevision: core.emphasisRevision,
    leadingResearchRegion: core.leadingResearchRegion,
    unlockedNodes: core.unlockedNodes,
    institutionUpgrades: core.institutionUpgrades,
    branchEmphasis: core.branchEmphasis,
    migrationLog: core.migrationLog,
    saveKind: core.saveKind,
    updatedAtTurn: core.updatedAtTurn,
    sessionId: core.sessionId,
    persistRevision: core.persistRevision,
    unlockEventLog: core.unlockEventLog,
    lastReconciledAtTurn: core.lastReconciledAtTurn,
    emphasisChangeLog: core.emphasisChangeLog,
    institutionTierSnapshot: core.institutionTierSnapshot,
    readinessMilestoneLog: core.readinessMilestoneLog,
    readinessBranchSnapshot: core.readinessBranchSnapshot,
    integrationRiskLog: core.integrationRiskLog,
    integrationRiskSnapshot: core.integrationRiskSnapshot,
    scaleWaveSnapshot: core.scaleWaveSnapshot,
    synergyThresholdLog: core.synergyThresholdLog,
    synergySnapshot: core.synergySnapshot,
    commercializationMilestoneLog: core.commercializationMilestoneLog,
    commercializationSnapshot: core.commercializationSnapshot,
    diffusionIntegrationLog: core.diffusionIntegrationLog,
    diffusionIntegrationSnapshot: core.diffusionIntegrationSnapshot,
    portfolioBalanceLog: core.portfolioBalanceLog,
    portfolioBalanceSnapshot: core.portfolioBalanceSnapshot,
    diffusionForecastBandLog: core.diffusionForecastBandLog,
    diffusionForecastSnapshot: core.diffusionForecastSnapshot,
    horizonConvergenceBandLog: core.horizonConvergenceBandLog,
    horizonConvergenceSnapshot: core.horizonConvergenceSnapshot,
    researchExecutionBandLog: core.researchExecutionBandLog,
    researchExecutionSnapshot: core.researchExecutionSnapshot,
    strategicDeliveryBandLog: core.strategicDeliveryBandLog,
    strategicDeliverySnapshot: core.strategicDeliverySnapshot,
    scaleWaveMaturityBandLog: core.scaleWaveMaturityBandLog,
    scaleWaveMaturitySnapshot: core.scaleWaveMaturitySnapshot,
    nationalIntegrationBandLog: core.nationalIntegrationBandLog,
    nationalIntegrationSnapshot: core.nationalIntegrationSnapshot,
    scaleWaveProjectionBandLog: core.scaleWaveProjectionBandLog,
    scaleWaveProjectionSnapshot: core.scaleWaveProjectionSnapshot,
    trancheProjectionBandLog: core.trancheProjectionBandLog,
    trancheProjectionSnapshot: core.trancheProjectionSnapshot,
    integrationGateBandLog: core.integrationGateBandLog,
    integrationGateSnapshot: core.integrationGateSnapshot,
    dryRunHandoffBandLog: core.dryRunHandoffBandLog,
    dryRunHandoffSnapshot: core.dryRunHandoffSnapshot,
    mergedIntegrationBaselineBandLog: core.mergedIntegrationBaselineBandLog,
    mergedIntegrationBaselineSnapshot: core.mergedIntegrationBaselineSnapshot,
    postIntegrationDryRunBandLog: core.postIntegrationDryRunBandLog,
    postIntegrationDryRunSnapshot: core.postIntegrationDryRunSnapshot,
    integrationSealBandLog: core.integrationSealBandLog,
    integrationSealSnapshot: core.integrationSealSnapshot,
    postSealHandoffBandLog: core.postSealHandoffBandLog,
    postSealHandoffSnapshot: core.postSealHandoffSnapshot,
    integrationContinuityBandLog: core.integrationContinuityBandLog,
    integrationContinuitySnapshot: core.integrationContinuitySnapshot,
    continuityHandoffBandLog: core.continuityHandoffBandLog,
    continuityHandoffSnapshot: core.continuityHandoffSnapshot,
    handoffIntegrationBandLog: core.handoffIntegrationBandLog,
    handoffIntegrationSnapshot: core.handoffIntegrationSnapshot,
    handoffIntegrationSealBandLog: core.handoffIntegrationSealBandLog,
    handoffIntegrationSealSnapshot: core.handoffIntegrationSealSnapshot,
    integrationSealHandoffBandLog: core.integrationSealHandoffBandLog,
    integrationSealHandoffSnapshot: core.integrationSealHandoffSnapshot,
    sealHandoffContinuityBandLog: core.sealHandoffContinuityBandLog,
    sealHandoffContinuitySnapshot: core.sealHandoffContinuitySnapshot,
    sealHandoffIntegrationBandLog: core.sealHandoffIntegrationBandLog,
    sealHandoffIntegrationSnapshot: core.sealHandoffIntegrationSnapshot,
    sealHandoffIntegrationSealBandLog: core.sealHandoffIntegrationSealBandLog,
    sealHandoffIntegrationSealSnapshot: core.sealHandoffIntegrationSealSnapshot,
    sealHandoffIntegrationSealContinuityBandLog: core.sealHandoffIntegrationSealContinuityBandLog,
    sealHandoffIntegrationSealContinuitySnapshot: core.sealHandoffIntegrationSealContinuitySnapshot,
    sealHandoffIntegrationSealContinuityHandoffBandLog: core.sealHandoffIntegrationSealContinuityHandoffBandLog,
    sealHandoffIntegrationSealContinuityHandoffSnapshot: core.sealHandoffIntegrationSealContinuityHandoffSnapshot,
    sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: core.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: core.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot,
  });
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(36);
}

function upgradeToCurrentCore(
  base: Omit<ResearchProgressPersistedCore, 'coreFingerprint' | 'emphasisRevision' | 'migrationLog'> & {
    emphasisRevision?: number;
    migrationLog?: ResearchSaveMigrationEntry[];
    emphasisChangeLog?: ResearchEmphasisChangeEvent[];
    institutionTierSnapshot?: ResearchInstitutionTierSnapshot | null;
    readinessMilestoneLog?: ResearchReadinessMilestoneEvent[];
    readinessBranchSnapshot?: ResearchReadinessBranchSnapshot | null;
    integrationRiskLog?: ResearchIntegrationRiskEvent[];
    integrationRiskSnapshot?: ResearchIntegrationRiskSnapshot | null;
    scaleWaveSnapshot?: ResearchScaleWaveSnapshot | null;
    synergyThresholdLog?: ResearchSynergyThresholdEvent[];
    synergySnapshot?: ResearchSynergySnapshot | null;
    commercializationMilestoneLog?: ResearchCommercializationMilestoneEvent[];
    commercializationSnapshot?: ResearchCommercializationSnapshot | null;
    diffusionIntegrationLog?: ResearchDiffusionIntegrationMilestoneEvent[];
    diffusionIntegrationSnapshot?: ResearchDiffusionIntegrationSnapshot | null;
    portfolioBalanceLog?: ResearchPortfolioBalanceBandEvent[];
    portfolioBalanceSnapshot?: ResearchPortfolioBalanceSnapshot | null;
    diffusionForecastBandLog?: ResearchDiffusionForecastBandEvent[];
    diffusionForecastSnapshot?: ResearchDiffusionForecastSnapshot | null;
    horizonConvergenceBandLog?: ResearchHorizonConvergenceBandEvent[];
    horizonConvergenceSnapshot?: ResearchHorizonConvergenceSnapshot | null;
    researchExecutionBandLog?: ResearchExecutionBandEvent[];
    researchExecutionSnapshot?: ResearchExecutionSnapshot | null;
    strategicDeliveryBandLog?: ResearchStrategicDeliveryBandEvent[];
    strategicDeliverySnapshot?: ResearchStrategicDeliverySnapshot | null;
    scaleWaveMaturityBandLog?: ResearchScaleWaveMaturityBandEvent[];
    scaleWaveMaturitySnapshot?: ResearchScaleWaveMaturitySnapshot | null;
    nationalIntegrationBandLog?: ResearchNationalIntegrationBandEvent[];
    nationalIntegrationSnapshot?: ResearchNationalIntegrationSnapshot | null;
    scaleWaveProjectionBandLog?: ResearchScaleWaveProjectionBandEvent[];
    scaleWaveProjectionSnapshot?: ResearchScaleWaveProjectionSnapshot | null;
    trancheProjectionBandLog?: ResearchTrancheProjectionBandEvent[];
    trancheProjectionSnapshot?: ResearchTrancheProjectionSnapshot | null;
    integrationGateBandLog?: ResearchScaleWaveIntegrationGateBandEvent[];
    integrationGateSnapshot?: ResearchScaleWaveIntegrationGateSnapshot | null;
    dryRunHandoffBandLog?: ResearchTrancheDryRunHandoffBandEvent[];
    dryRunHandoffSnapshot?: ResearchTrancheDryRunHandoffSnapshot | null;
    mergedIntegrationBaselineBandLog?: ResearchMergedIntegrationBaselineBandEvent[];
    mergedIntegrationBaselineSnapshot?: ResearchMergedIntegrationBaselineSnapshot | null;
    postIntegrationDryRunBandLog?: ResearchScaleWavePostIntegrationDryRunBandEvent[];
    postIntegrationDryRunSnapshot?: ResearchScaleWavePostIntegrationDryRunSnapshot | null;
    integrationSealBandLog?: ResearchScaleWaveIntegrationSealBandEvent[];
    integrationSealSnapshot?: ResearchScaleWaveIntegrationSealSnapshot | null;
    postSealHandoffBandLog?: ResearchScaleWavePostSealHandoffBandEvent[];
    postSealHandoffSnapshot?: ResearchScaleWavePostSealHandoffSnapshot | null;
    integrationContinuityBandLog?: ResearchScaleWaveIntegrationContinuityBandEvent[];
    integrationContinuitySnapshot?: ResearchScaleWaveIntegrationContinuitySnapshot | null;
    continuityHandoffBandLog?: ResearchScaleWaveContinuityHandoffBandEvent[];
    continuityHandoffSnapshot?: ResearchScaleWaveContinuityHandoffSnapshot | null;
    handoffIntegrationBandLog?: ResearchScaleWaveHandoffIntegrationBandEvent[];
    handoffIntegrationSnapshot?: ResearchScaleWaveHandoffIntegrationSnapshot | null;
    handoffIntegrationSealBandLog?: ResearchScaleWaveHandoffIntegrationSealBandEvent[];
    handoffIntegrationSealSnapshot?: ResearchScaleWaveHandoffIntegrationSealSnapshot | null;
    integrationSealHandoffBandLog?: ResearchScaleWaveIntegrationSealHandoffBandEvent[];
    integrationSealHandoffSnapshot?: ResearchScaleWaveIntegrationSealHandoffSnapshot | null;
    sealHandoffContinuityBandLog?: ResearchScaleWaveSealHandoffContinuityBandEvent[];
    sealHandoffContinuitySnapshot?: ResearchScaleWaveSealHandoffContinuitySnapshot | null;
    sealHandoffIntegrationBandLog?: ResearchScaleWaveSealHandoffIntegrationBandEvent[];
    sealHandoffIntegrationSnapshot?: ResearchScaleWaveSealHandoffIntegrationSnapshot | null;
    sealHandoffIntegrationSealBandLog?: ResearchScaleWaveSealHandoffIntegrationSealBandEvent[];
    sealHandoffIntegrationSealSnapshot?: ResearchScaleWaveSealHandoffIntegrationSealSnapshot | null;
    sealHandoffIntegrationSealContinuityBandLog?: ResearchScaleWaveSealHandoffIntegrationSealContinuityBandEvent[];
    sealHandoffIntegrationSealContinuitySnapshot?: ResearchScaleWaveSealHandoffIntegrationSealContinuitySnapshot | null;
    sealHandoffIntegrationSealContinuityHandoffBandLog?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBandEvent[];
    sealHandoffIntegrationSealContinuityHandoffSnapshot?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffSnapshot | null;
    sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationBandEvent[];
    sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot | null;
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[];
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot | null;
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent[];
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot | null;
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandEvent[];
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot | null;
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvent[];
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot | null;
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[];
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot | null;
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent[];
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot?: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot | null;
    unlockEventLog?: ResearchUnlockEvent[];
    lastReconciledAtTurn?: number;
  },
  fromVersion: ResearchSaveMigrationEntry['fromVersion']
): ResearchProgressPersistedCore {
  const migrationLog: ResearchSaveMigrationEntry[] = [
    ...(base.migrationLog ?? []),
    { fromVersion, toVersion: RESEARCH_PROGRESS_SCHEMA_VERSION, turn: base.turn },
  ];
  return finalizeCoreForPersist({
    ...base,
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    emphasisRevision: base.emphasisRevision ?? 0,
    migrationLog,
    emphasisChangeLog:
      base.emphasisChangeLog ??
      rebuildEmphasisChangeLogFromBranchEmphasis(
        base.branchEmphasis ?? defaultBranchEmphasis(),
        base.emphasisRevision ?? 0,
        base.turn
      ),
    institutionTierSnapshot:
      base.institutionTierSnapshot ?? snapshotFromUpgrades(base.institutionUpgrades ?? [], base.turn),
    readinessMilestoneLog:
      base.readinessMilestoneLog ??
      rebuildReadinessMilestoneLogFromSnapshot(base.readinessBranchSnapshot ?? null, base.turn),
    readinessBranchSnapshot: base.readinessBranchSnapshot ?? null,
    integrationRiskLog: base.integrationRiskLog ?? emptyIntegrationRiskLog(),
    integrationRiskSnapshot: base.integrationRiskSnapshot ?? null,
    scaleWaveSnapshot: base.scaleWaveSnapshot ?? null,
    synergyThresholdLog: base.synergyThresholdLog ?? emptySynergyThresholdLog(),
    synergySnapshot: base.synergySnapshot ?? null,
    commercializationMilestoneLog: base.commercializationMilestoneLog ?? emptyCommercializationMilestoneLog(),
    commercializationSnapshot: base.commercializationSnapshot ?? null,
    diffusionIntegrationLog: base.diffusionIntegrationLog ?? emptyDiffusionIntegrationLog(),
    diffusionIntegrationSnapshot: base.diffusionIntegrationSnapshot ?? null,
    portfolioBalanceLog: base.portfolioBalanceLog ?? emptyPortfolioBalanceLog(),
    portfolioBalanceSnapshot: base.portfolioBalanceSnapshot ?? null,
    diffusionForecastBandLog: base.diffusionForecastBandLog ?? emptyDiffusionForecastBandLog(),
    diffusionForecastSnapshot: base.diffusionForecastSnapshot ?? null,
    horizonConvergenceBandLog: base.horizonConvergenceBandLog ?? emptyHorizonConvergenceBandLog(),
    horizonConvergenceSnapshot: base.horizonConvergenceSnapshot ?? null,
    researchExecutionBandLog: base.researchExecutionBandLog ?? emptyResearchExecutionBandLog(),
    researchExecutionSnapshot: base.researchExecutionSnapshot ?? null,
    strategicDeliveryBandLog: base.strategicDeliveryBandLog ?? emptyStrategicDeliveryBandLog(),
    strategicDeliverySnapshot: base.strategicDeliverySnapshot ?? null,
    scaleWaveMaturityBandLog: base.scaleWaveMaturityBandLog ?? emptyScaleWaveMaturityBandLog(),
    scaleWaveMaturitySnapshot: base.scaleWaveMaturitySnapshot ?? null,
    nationalIntegrationBandLog: base.nationalIntegrationBandLog ?? emptyNationalIntegrationBandLog(),
    nationalIntegrationSnapshot: base.nationalIntegrationSnapshot ?? null,
    scaleWaveProjectionBandLog: base.scaleWaveProjectionBandLog ?? emptyScaleWaveProjectionBandLog(),
    scaleWaveProjectionSnapshot: base.scaleWaveProjectionSnapshot ?? null,
    trancheProjectionBandLog: base.trancheProjectionBandLog ?? emptyTrancheProjectionBandLog(),
    trancheProjectionSnapshot: base.trancheProjectionSnapshot ?? null,
    integrationGateBandLog: base.integrationGateBandLog ?? emptyIntegrationGateBandLog(),
    integrationGateSnapshot: base.integrationGateSnapshot ?? null,
    dryRunHandoffBandLog: base.dryRunHandoffBandLog ?? emptyDryRunHandoffBandLog(),
    dryRunHandoffSnapshot: base.dryRunHandoffSnapshot ?? null,
    mergedIntegrationBaselineBandLog: base.mergedIntegrationBaselineBandLog ?? emptyMergedIntegrationBaselineBandLog(),
    mergedIntegrationBaselineSnapshot: base.mergedIntegrationBaselineSnapshot ?? null,
    postIntegrationDryRunBandLog: base.postIntegrationDryRunBandLog ?? emptyPostIntegrationDryRunBandLog(),
    postIntegrationDryRunSnapshot: base.postIntegrationDryRunSnapshot ?? null,
    integrationSealBandLog: base.integrationSealBandLog ?? emptyIntegrationSealBandLog(),
    integrationSealSnapshot: base.integrationSealSnapshot ?? null,
    postSealHandoffBandLog: base.postSealHandoffBandLog ?? emptyPostSealHandoffBandLog(),
    postSealHandoffSnapshot: base.postSealHandoffSnapshot ?? null,
    integrationContinuityBandLog: base.integrationContinuityBandLog ?? emptyIntegrationContinuityBandLog(),
    integrationContinuitySnapshot: base.integrationContinuitySnapshot ?? null,
    continuityHandoffBandLog: base.continuityHandoffBandLog ?? emptyContinuityHandoffBandLog(),
    continuityHandoffSnapshot: base.continuityHandoffSnapshot ?? null,
    handoffIntegrationBandLog: base.handoffIntegrationBandLog ?? emptyHandoffIntegrationBandLog(),
    handoffIntegrationSnapshot: base.handoffIntegrationSnapshot ?? null,
    handoffIntegrationSealBandLog: base.handoffIntegrationSealBandLog ?? emptyHandoffIntegrationSealBandLog(),
    handoffIntegrationSealSnapshot: base.handoffIntegrationSealSnapshot ?? null,
    integrationSealHandoffBandLog: base.integrationSealHandoffBandLog ?? emptyIntegrationSealHandoffBandLog(),
    integrationSealHandoffSnapshot: base.integrationSealHandoffSnapshot ?? null,
    sealHandoffContinuityBandLog: base.sealHandoffContinuityBandLog ?? emptySealHandoffContinuityBandLog(),
    sealHandoffContinuitySnapshot: base.sealHandoffContinuitySnapshot ?? null,
    sealHandoffIntegrationBandLog: base.sealHandoffIntegrationBandLog ?? emptySealHandoffIntegrationBandLog(),
    sealHandoffIntegrationSnapshot: base.sealHandoffIntegrationSnapshot ?? null,
    sealHandoffIntegrationSealBandLog: base.sealHandoffIntegrationSealBandLog ?? emptySealHandoffIntegrationSealBandLog(),
    sealHandoffIntegrationSealSnapshot: base.sealHandoffIntegrationSealSnapshot ?? null,
    sealHandoffIntegrationSealContinuityBandLog: base.sealHandoffIntegrationSealContinuityBandLog ?? emptySealHandoffIntegrationSealContinuityBandLog(),
    sealHandoffIntegrationSealContinuitySnapshot: base.sealHandoffIntegrationSealContinuitySnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffBandLog: base.sealHandoffIntegrationSealContinuityHandoffBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
    sealHandoffIntegrationSealContinuityHandoffSnapshot: base.sealHandoffIntegrationSealContinuityHandoffSnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: base.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: base.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot ?? null,
    unlockEventLog: base.unlockEventLog ?? rebuildUnlockEventLogFromNodes(base.unlockedNodes ?? []),
    lastReconciledAtTurn: base.lastReconciledAtTurn ?? base.turn,
  });
}

export function emptyResearchProgressCore(turn = 0): ResearchProgressPersistedCore {
  return emptyCore(turn);
}

function emptyCore(turn = 0): ResearchProgressPersistedCore {
  return finalizeCoreForPersist({
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: 0,
    turn,
    unlockedNodes: [],
    institutionUpgrades: [],
    leadingResearchRegion: null,
    unlockSeq: 0,
    branchEmphasis: defaultBranchEmphasis(),
    emphasisRevision: 0,
    migrationLog: [],
    saveKind: 'manual',
    updatedAtTurn: turn,
    sessionId: `o10m_r03_${turn}_0`,
    persistRevision: 0,
    unlockEventLog: emptyUnlockEventLog(),
    lastReconciledAtTurn: turn,
    emphasisChangeLog: emptyEmphasisChangeLog(),
    institutionTierSnapshot: null,
    readinessMilestoneLog: emptyReadinessMilestoneLog(),
    readinessBranchSnapshot: null,
    integrationRiskLog: emptyIntegrationRiskLog(),
    integrationRiskSnapshot: null,
    scaleWaveSnapshot: null,
    synergyThresholdLog: emptySynergyThresholdLog(),
    synergySnapshot: null,
    commercializationMilestoneLog: emptyCommercializationMilestoneLog(),
    commercializationSnapshot: null,
    diffusionIntegrationLog: emptyDiffusionIntegrationLog(),
    diffusionIntegrationSnapshot: null,
    portfolioBalanceLog: emptyPortfolioBalanceLog(),
    portfolioBalanceSnapshot: null,
    diffusionForecastBandLog: emptyDiffusionForecastBandLog(),
    diffusionForecastSnapshot: null,
    horizonConvergenceBandLog: emptyHorizonConvergenceBandLog(),
    horizonConvergenceSnapshot: null,
    researchExecutionBandLog: emptyResearchExecutionBandLog(),
    researchExecutionSnapshot: null,
    strategicDeliveryBandLog: emptyStrategicDeliveryBandLog(),
    strategicDeliverySnapshot: null,
    scaleWaveMaturityBandLog: emptyScaleWaveMaturityBandLog(),
    scaleWaveMaturitySnapshot: null,
    nationalIntegrationBandLog: emptyNationalIntegrationBandLog(),
    nationalIntegrationSnapshot: null,
    scaleWaveProjectionBandLog: emptyScaleWaveProjectionBandLog(),
    scaleWaveProjectionSnapshot: null,
    trancheProjectionBandLog: emptyTrancheProjectionBandLog(),
    trancheProjectionSnapshot: null,
    integrationGateBandLog: emptyIntegrationGateBandLog(),
    integrationGateSnapshot: null,
    dryRunHandoffBandLog: emptyDryRunHandoffBandLog(),
    dryRunHandoffSnapshot: null,
    mergedIntegrationBaselineBandLog: emptyMergedIntegrationBaselineBandLog(),
    mergedIntegrationBaselineSnapshot: null,
    postIntegrationDryRunBandLog: emptyPostIntegrationDryRunBandLog(),
    postIntegrationDryRunSnapshot: null,
    integrationSealBandLog: emptyIntegrationSealBandLog(),
    integrationSealSnapshot: null,
    postSealHandoffBandLog: emptyPostSealHandoffBandLog(),
    postSealHandoffSnapshot: null,
    integrationContinuityBandLog: emptyIntegrationContinuityBandLog(),
    integrationContinuitySnapshot: null,
    continuityHandoffBandLog: emptyContinuityHandoffBandLog(),
    continuityHandoffSnapshot: null,
    handoffIntegrationBandLog: emptyHandoffIntegrationBandLog(),
    handoffIntegrationSnapshot: null,
    handoffIntegrationSealBandLog: emptyHandoffIntegrationSealBandLog(),
    handoffIntegrationSealSnapshot: null,
    integrationSealHandoffBandLog: emptyIntegrationSealHandoffBandLog(),
    integrationSealHandoffSnapshot: null,
    sealHandoffContinuityBandLog: emptySealHandoffContinuityBandLog(),
    sealHandoffContinuitySnapshot: null,
    sealHandoffIntegrationBandLog: emptySealHandoffIntegrationBandLog(),
    sealHandoffIntegrationSnapshot: null,
    sealHandoffIntegrationSealBandLog: emptySealHandoffIntegrationSealBandLog(),
    sealHandoffIntegrationSealSnapshot: null,
    sealHandoffIntegrationSealContinuityBandLog: emptySealHandoffIntegrationSealContinuityBandLog(),
    sealHandoffIntegrationSealContinuitySnapshot: null,
    sealHandoffIntegrationSealContinuityHandoffBandLog: emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
    sealHandoffIntegrationSealContinuityHandoffSnapshot: null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: null,
  });
}

function sanitizeUnlockedNodes(raw: unknown): UnlockedResearchNode[] {
  if (!Array.isArray(raw)) return [];
  const out: UnlockedResearchNode[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as UnlockedResearchNode;
    if (typeof o.nodeId !== 'string' || !RESEARCH_NODE_BY_ID[o.nodeId]) continue;
    const def = RESEARCH_NODE_BY_ID[o.nodeId];
    out.push({
      nodeId: o.nodeId,
      branchId: def.branchId,
      unlockedTurn: Number(o.unlockedTurn) || 0,
      anchorRegionId: o.anchorRegionId ?? null,
    });
  }
  return out.sort((a, b) => a.unlockedTurn - b.unlockedTurn || a.nodeId.localeCompare(b.nodeId));
}

function sanitizeInstitutionUpgrades(raw: unknown): InstitutionUpgradeState[] {
  if (!Array.isArray(raw)) return [];
  const tiers = new Set<InstitutionUpgradeTier>([
    'dormant',
    'affiliate',
    'partner',
    'strategic',
    'national_integration',
  ]);
  return raw
    .filter(x => x && typeof x === 'object' && typeof (x as InstitutionUpgradeState).institutionId === 'string')
    .map(x => {
      const o = x as InstitutionUpgradeState;
      const tier = tiers.has(o.tier) ? o.tier : 'dormant';
      return {
        institutionId: String(o.institutionId),
        tier,
        readinessMultiplier: Number(o.readinessMultiplier) || 0,
        diffusionMultiplier: Number(o.diffusionMultiplier) || 0,
        assessedTurn: Number(o.assessedTurn) || 0,
        reasons: Array.isArray(o.reasons) ? o.reasons.map(String) : [],
      };
    });
}

function sanitizeBranchEmphasis(raw: unknown): ResearchBranchEmphasisState[] {
  const defaults = defaultBranchEmphasis();
  if (!Array.isArray(raw)) return defaults;
  const byId = Object.fromEntries(defaults.map(d => [d.branchId, d]));
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchBranchEmphasisState;
    if (!byId[o.branchId]) continue;
    const emph = o.emphasis;
    if (emph === 'applied' || emph === 'fundamental' || emph === 'commercial' || emph === 'sovereign') {
      byId[o.branchId] = { branchId: o.branchId, emphasis: emph, setTurn: Number(o.setTurn) || 0 };
    }
  }
  return RESEARCH_BRANCHES.map(b => byId[b.id]);
}

function mergeMonotonicUpgrades(
  incoming: InstitutionUpgradeState[],
  previous: InstitutionUpgradeState[]
): InstitutionUpgradeState[] {
  const prevById = Object.fromEntries(previous.map(u => [u.institutionId, u]));
  return incoming.map(u => {
    const old = prevById[u.institutionId];
    if (!old) return u;
    return INSTITUTION_UPGRADE_TIER_RANK[old.tier] > INSTITUTION_UPGRADE_TIER_RANK[u.tier] ? old : u;
  });
}

function computeUnlockSeq(nodes: UnlockedResearchNode[]): number {
  return nodes.length;
}

function sanitizeUnlockEventLog(raw: unknown): ResearchUnlockEvent[] {
  if (!Array.isArray(raw)) return emptyUnlockEventLog();
  const out: ResearchUnlockEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchUnlockEvent;
    if (typeof o.nodeId !== 'string' || !RESEARCH_NODE_BY_ID[o.nodeId]) continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      nodeId: o.nodeId,
      branchId: RESEARCH_NODE_BY_ID[o.nodeId].branchId,
      hookIds: Array.isArray(o.hookIds) ? o.hookIds.map(String) : RESEARCH_NODE_BY_ID[o.nodeId].hookIds,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-64);
}

function sanitizeEmphasisChangeLog(raw: unknown): ResearchEmphasisChangeEvent[] {
  if (!Array.isArray(raw)) return emptyEmphasisChangeLog();
  const emphSet = new Set<ResearchProgramEmphasis>(['applied', 'fundamental', 'commercial', 'sovereign']);
  const out: ResearchEmphasisChangeEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchEmphasisChangeEvent;
    if (typeof o.branchId !== 'string') continue;
    if (!emphSet.has(o.fromEmphasis) || !emphSet.has(o.toEmphasis)) continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      branchId: o.branchId as ResearchBranchId,
      fromEmphasis: o.fromEmphasis,
      toEmphasis: o.toEmphasis,
      emphasisRevision: Number(o.emphasisRevision) || 0,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-32);
}

function sanitizeInstitutionTierSnapshot(raw: unknown, turn: number): ResearchInstitutionTierSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchInstitutionTierSnapshot;
  if (typeof o.digest !== 'string') return null;
  const tiers =
    o.tiers && typeof o.tiers === 'object'
      ? (o.tiers as ResearchInstitutionTierSnapshot['tiers'])
      : ({} as ResearchInstitutionTierSnapshot['tiers']);
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    tiers,
    digest: o.digest,
    nationalIntegrationCount: Number(o.nationalIntegrationCount) || 0,
    strategicOrAboveCount: Number(o.strategicOrAboveCount) || 0,
  };
}

function sanitizeReadinessMilestoneLog(raw: unknown): ResearchReadinessMilestoneEvent[] {
  if (!Array.isArray(raw)) return emptyReadinessMilestoneLog();
  const milestones = new Set([25, 50, 75, 90]);
  const out: ResearchReadinessMilestoneEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchReadinessMilestoneEvent;
    if (typeof o.branchId !== 'string') continue;
    if (!milestones.has(Number(o.milestone))) continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      branchId: o.branchId as ResearchBranchId,
      milestone: o.milestone,
      readiness: Number(o.readiness) || 0,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-48);
}

function sanitizeReadinessBranchSnapshot(raw: unknown, turn: number): ResearchReadinessBranchSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchReadinessBranchSnapshot;
  if (typeof o.digest !== 'string') return null;
  const readinessByBranch =
    o.readinessByBranch && typeof o.readinessByBranch === 'object'
      ? (o.readinessByBranch as ResearchReadinessBranchSnapshot['readinessByBranch'])
      : ({} as ResearchReadinessBranchSnapshot['readinessByBranch']);
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    readinessByBranch,
    digest: o.digest,
    branchAbove75Count: Number(o.branchAbove75Count) || 0,
    nationalMeanReadiness: Number(o.nationalMeanReadiness) || 0,
  };
}

function sanitizeIntegrationRiskLog(raw: unknown): ResearchIntegrationRiskEvent[] {
  if (!Array.isArray(raw)) return emptyIntegrationRiskLog();
  const bands = new Set([40, 60, 80]);
  const out: ResearchIntegrationRiskEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchIntegrationRiskEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      nationalRiskScore: Number(o.nationalRiskScore) || 0,
      criticalBranchCount: Number(o.criticalBranchCount) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_INTEGRATION_RISK_LOG_CAP);
}

function sanitizeIntegrationRiskSnapshot(raw: unknown, turn: number): ResearchIntegrationRiskSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchIntegrationRiskSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    nationalRiskScore: Number(o.nationalRiskScore) || 0,
    criticalBranchCount: Number(o.criticalBranchCount) || 0,
    peakRiskBand: (Number(o.peakRiskBand) || 0) as ResearchIntegrationRiskSnapshot['peakRiskBand'],
    digest: o.digest,
  };
}

function sanitizeScaleWaveSnapshot(raw: unknown, turn: number): ResearchScaleWaveSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    tier5UnlockCount: Number(o.tier5UnlockCount) || 0,
    crossBranchSynergyScore: Number(o.crossBranchSynergyScore) || 0,
    transferLinkCount: Number(o.transferLinkCount) || 0,
    dominantCapabilityCluster: o.dominantCapabilityCluster ?? null,
    digest: o.digest,
  };
}

function sanitizeSynergyThresholdLog(raw: unknown): ResearchSynergyThresholdEvent[] {
  if (!Array.isArray(raw)) return emptySynergyThresholdLog();
  const thresholds = new Set([25, 50, 75, 90]);
  const out: ResearchSynergyThresholdEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchSynergyThresholdEvent;
    if (!thresholds.has(Number(o.threshold))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      threshold: o.threshold,
      synergyScore: Number(o.synergyScore) || 0,
      activeMultiBranchCount: Number(o.activeMultiBranchCount) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SYNERGY_THRESHOLD_LOG_CAP);
}

function sanitizeSynergySnapshot(raw: unknown, turn: number): ResearchSynergySnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchSynergySnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    currentSynergyScore: Number(o.currentSynergyScore) || 0,
    projectedSynergyScore: Number(o.projectedSynergyScore) || 0,
    activeMultiBranchCount: Number(o.activeMultiBranchCount) || 0,
    peakThreshold: (Number(o.peakThreshold) || 0) as ResearchSynergySnapshot['peakThreshold'],
    dominantCapabilityCluster: o.dominantCapabilityCluster ?? null,
    digest: o.digest,
  };
}

function sanitizeCommercializationMilestoneLog(raw: unknown): ResearchCommercializationMilestoneEvent[] {
  if (!Array.isArray(raw)) return emptyCommercializationMilestoneLog();
  const milestones = new Set([30, 50, 70, 90]);
  const out: ResearchCommercializationMilestoneEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchCommercializationMilestoneEvent;
    if (!milestones.has(Number(o.milestone))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      milestone: o.milestone,
      nationalExportScore: Number(o.nationalExportScore) || 0,
      highPriorityBranchCount: Number(o.highPriorityBranchCount) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_COMMERCIALIZATION_MILESTONE_LOG_CAP);
}

function sanitizeCommercializationSnapshot(raw: unknown, turn: number): ResearchCommercializationSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchCommercializationSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    nationalExportScore: Number(o.nationalExportScore) || 0,
    highPriorityBranchCount: Number(o.highPriorityBranchCount) || 0,
    mediumPriorityBranchCount: Number(o.mediumPriorityBranchCount) || 0,
    peakMilestone: (Number(o.peakMilestone) || 0) as ResearchCommercializationSnapshot['peakMilestone'],
    digest: o.digest,
  };
}

function sanitizeDiffusionIntegrationLog(raw: unknown): ResearchDiffusionIntegrationMilestoneEvent[] {
  if (!Array.isArray(raw)) return emptyDiffusionIntegrationLog();
  const milestones = new Set([1, 2, 4, 6]);
  const out: ResearchDiffusionIntegrationMilestoneEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchDiffusionIntegrationMilestoneEvent;
    if (!milestones.has(Number(o.milestone))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      milestone: o.milestone,
      integratedRegionCount: Number(o.integratedRegionCount) || 0,
      meanDiffusionScore: Number(o.meanDiffusionScore) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_DIFFUSION_INTEGRATION_LOG_CAP);
}

function sanitizeDiffusionIntegrationSnapshot(raw: unknown, turn: number): ResearchDiffusionIntegrationSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchDiffusionIntegrationSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    integratedRegionCount: Number(o.integratedRegionCount) || 0,
    adoptingRegionCount: Number(o.adoptingRegionCount) || 0,
    meanDiffusionScore: Number(o.meanDiffusionScore) || 0,
    leadingResearchRegion: o.leadingResearchRegion ?? null,
    peakMilestone: (Number(o.peakMilestone) || 0) as ResearchDiffusionIntegrationSnapshot['peakMilestone'],
    digest: o.digest,
  };
}

function sanitizePortfolioBalanceLog(raw: unknown): ResearchPortfolioBalanceBandEvent[] {
  if (!Array.isArray(raw)) return emptyPortfolioBalanceLog();
  const bands = new Set([40, 55, 70, 85]);
  const out: ResearchPortfolioBalanceBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchPortfolioBalanceBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      nationalBalanceScore: Number(o.nationalBalanceScore) || 0,
      criticalBranchCount: Number(o.criticalBranchCount) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_PORTFOLIO_BALANCE_LOG_CAP);
}

function sanitizePortfolioBalanceSnapshot(raw: unknown, turn: number): ResearchPortfolioBalanceSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchPortfolioBalanceSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    nationalBalanceScore: Number(o.nationalBalanceScore) || 0,
    criticalBranchCount: Number(o.criticalBranchCount) || 0,
    watchBranchCount: Number(o.watchBranchCount) || 0,
    peakBand: (Number(o.peakBand) || 0) as ResearchPortfolioBalanceSnapshot['peakBand'],
    digest: o.digest,
  };
}

function sanitizeDiffusionForecastBandLog(raw: unknown): ResearchDiffusionForecastBandEvent[] {
  if (!Array.isArray(raw)) return emptyDiffusionForecastBandLog();
  const bands = new Set([20, 35, 50, 65]);
  const out: ResearchDiffusionForecastBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchDiffusionForecastBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      peakProjectedPercent: Number(o.peakProjectedPercent) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_DIFFUSION_FORECAST_BAND_LOG_CAP);
}

function sanitizeDiffusionForecastSnapshot(raw: unknown, turn: number): ResearchDiffusionForecastSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchDiffusionForecastSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    peakProjectedPercent: Number(o.peakProjectedPercent) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    projectionCount: Number(o.projectionCount) || 0,
    peakRegionId: o.peakRegionId ?? null,
    peakBand: (Number(o.peakBand) || 0) as ResearchDiffusionForecastSnapshot['peakBand'],
    digest: o.digest,
  };
}

function sanitizeHorizonConvergenceBandLog(raw: unknown): ResearchHorizonConvergenceBandEvent[] {
  if (!Array.isArray(raw)) return emptyHorizonConvergenceBandLog();
  const bands = new Set([25, 40, 55, 70]);
  const out: ResearchHorizonConvergenceBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchHorizonConvergenceBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      nationalConvergenceScore: Number(o.nationalConvergenceScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_HORIZON_CONVERGENCE_BAND_LOG_CAP);
}

function sanitizeHorizonConvergenceSnapshot(raw: unknown, turn: number): ResearchHorizonConvergenceSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchHorizonConvergenceSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    nationalConvergenceScore: Number(o.nationalConvergenceScore) || 0,
    projectedConvergenceScore: Number(o.projectedConvergenceScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    peakRegionId: o.peakRegionId ?? null,
    peakBand: (Number(o.peakBand) || 0) as ResearchHorizonConvergenceSnapshot['peakBand'],
    digest: o.digest,
  };
}

function sanitizeResearchExecutionBandLog(raw: unknown): ResearchExecutionBandEvent[] {
  if (!Array.isArray(raw)) return emptyResearchExecutionBandLog();
  const bands = new Set([30, 45, 60, 75]);
  const out: ResearchExecutionBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchExecutionBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      nationalExecutionScore: Number(o.nationalExecutionScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_EXECUTION_BAND_LOG_CAP);
}

function sanitizeResearchExecutionSnapshot(raw: unknown, turn: number): ResearchExecutionSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchExecutionSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    nationalExecutionScore: Number(o.nationalExecutionScore) || 0,
    projectedExecutionScore: Number(o.projectedExecutionScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    criticalRiskBranchCount: Number(o.criticalRiskBranchCount) || 0,
    peakBand: (Number(o.peakBand) || 0) as ResearchExecutionSnapshot['peakBand'],
    digest: o.digest,
  };
}

function sanitizeStrategicDeliveryBandLog(raw: unknown): ResearchStrategicDeliveryBandEvent[] {
  if (!Array.isArray(raw)) return emptyStrategicDeliveryBandLog();
  const bands = new Set([35, 50, 65, 80]);
  const out: ResearchStrategicDeliveryBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchStrategicDeliveryBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      nationalDeliveryScore: Number(o.nationalDeliveryScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_STRATEGIC_DELIVERY_BAND_LOG_CAP);
}

function sanitizeStrategicDeliverySnapshot(raw: unknown, turn: number): ResearchStrategicDeliverySnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchStrategicDeliverySnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    nationalDeliveryScore: Number(o.nationalDeliveryScore) || 0,
    projectedDeliveryScore: Number(o.projectedDeliveryScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    executionMomentum: Number(o.executionMomentum) || 0,
    peakBand: (Number(o.peakBand) || 0) as ResearchStrategicDeliverySnapshot['peakBand'],
    digest: o.digest,
  };
}

function sanitizeScaleWaveMaturityBandLog(raw: unknown): ResearchScaleWaveMaturityBandEvent[] {
  if (!Array.isArray(raw)) return emptyScaleWaveMaturityBandLog();
  const bands = new Set([40, 55, 70, 85]);
  const out: ResearchScaleWaveMaturityBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveMaturityBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      nationalMaturityScore: Number(o.nationalMaturityScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SCALE_WAVE_MATURITY_BAND_LOG_CAP);
}

function sanitizeScaleWaveMaturitySnapshot(raw: unknown, turn: number): ResearchScaleWaveMaturitySnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveMaturitySnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    nationalMaturityScore: Number(o.nationalMaturityScore) || 0,
    projectedMaturityScore: Number(o.projectedMaturityScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    deliveryMomentum: Number(o.deliveryMomentum) || 0,
    tierFiveUnlockedCount: Number(o.tierFiveUnlockedCount) || 0,
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveMaturitySnapshot['peakBand'],
    digest: o.digest,
  };
}


function sanitizeNationalIntegrationBandLog(raw: unknown): ResearchNationalIntegrationBandEvent[] {
  if (!Array.isArray(raw)) return emptyNationalIntegrationBandLog();
  const bands = new Set([45, 60, 75, 90]);
  const out: ResearchNationalIntegrationBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchNationalIntegrationBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      nationalIntegrationScore: Number(o.nationalIntegrationScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_NATIONAL_INTEGRATION_BAND_LOG_CAP);
}

function sanitizeNationalIntegrationSnapshot(raw: unknown, turn: number): ResearchNationalIntegrationSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchNationalIntegrationSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    nationalIntegrationScore: Number(o.nationalIntegrationScore) || 0,
    projectedIntegrationScore: Number(o.projectedIntegrationScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    maturityMomentum: Number(o.maturityMomentum) || 0,
    nationalIntegrationCount: Number(o.nationalIntegrationCount) || 0,
    peakBand: (Number(o.peakBand) || 0) as ResearchNationalIntegrationSnapshot['peakBand'],
    digest: o.digest,
  };
}

function sanitizeScaleWaveProjectionBandLog(raw: unknown): ResearchScaleWaveProjectionBandEvent[] {
  if (!Array.isArray(raw)) return emptyScaleWaveProjectionBandLog();
  const bands = new Set([50, 65, 80, 92]);
  const out: ResearchScaleWaveProjectionBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveProjectionBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      projectionReadinessScore: Number(o.projectionReadinessScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SCALE_WAVE_PROJECTION_BAND_LOG_CAP);
}

function sanitizeScaleWaveProjectionSnapshot(raw: unknown, turn: number): ResearchScaleWaveProjectionSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveProjectionSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    projectionReadinessScore: Number(o.projectionReadinessScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    integrationBandHeadroom: Number(o.integrationBandHeadroom) || 0,
    maturityBandHeadroom: Number(o.maturityBandHeadroom) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveProjectionSnapshot['peakBand'],
    digest: o.digest,
  };
}

function sanitizeTrancheProjectionBandLog(raw: unknown): ResearchTrancheProjectionBandEvent[] {
  if (!Array.isArray(raw)) return emptyTrancheProjectionBandLog();
  const bands = new Set([55, 70, 85, 95]);
  const out: ResearchTrancheProjectionBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchTrancheProjectionBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      trancheReadinessScore: Number(o.trancheReadinessScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_TRANCHE_PROJECTION_BAND_LOG_CAP);
}

function sanitizeTrancheProjectionSnapshot(raw: unknown, turn: number): ResearchTrancheProjectionSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchTrancheProjectionSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    trancheReadinessScore: Number(o.trancheReadinessScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    projectionMomentum: Number(o.projectionMomentum) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchTrancheProjectionSnapshot['peakBand'],
    digest: o.digest,
  };
}


function sanitizeIntegrationGateBandLog(raw: unknown): ResearchScaleWaveIntegrationGateBandEvent[] {
  if (!Array.isArray(raw)) return emptyIntegrationGateBandLog();
  const bands = new Set([58, 72, 86, 96]);
  const out: ResearchScaleWaveIntegrationGateBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveIntegrationGateBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      integrationGateScore: Number(o.integrationGateScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_INTEGRATION_GATE_BAND_LOG_CAP);
}

function sanitizeIntegrationGateSnapshot(raw: unknown, turn: number): ResearchScaleWaveIntegrationGateSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveIntegrationGateSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    integrationGateScore: Number(o.integrationGateScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    gateMomentum: Number(o.gateMomentum) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveIntegrationGateSnapshot['peakBand'],
    digest: o.digest,
  };
}


function sanitizeDryRunHandoffBandLog(raw: unknown): ResearchTrancheDryRunHandoffBandEvent[] {
  if (!Array.isArray(raw)) return emptyDryRunHandoffBandLog();
  const bands = new Set([60, 74, 88, 97]);
  const out: ResearchTrancheDryRunHandoffBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchTrancheDryRunHandoffBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      handoffReadinessScore: Number(o.handoffReadinessScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_DRY_RUN_HANDOFF_BAND_LOG_CAP);
}

function sanitizeDryRunHandoffSnapshot(raw: unknown, turn: number): ResearchTrancheDryRunHandoffSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchTrancheDryRunHandoffSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    handoffReadinessScore: Number(o.handoffReadinessScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    handoffMomentum: Number(o.handoffMomentum) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchTrancheDryRunHandoffSnapshot['peakBand'],
    digest: o.digest,
  };
}



function sanitizeMergedIntegrationBaselineBandLog(raw: unknown): ResearchMergedIntegrationBaselineBandEvent[] {
  if (!Array.isArray(raw)) return emptyMergedIntegrationBaselineBandLog();
  const bands = new Set([62, 76, 90, 98]);
  const out: ResearchMergedIntegrationBaselineBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchMergedIntegrationBaselineBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      mergedBaselineScore: Number(o.mergedBaselineScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_MERGED_INTEGRATION_BASELINE_BAND_LOG_CAP);
}

function sanitizeMergedIntegrationBaselineSnapshot(raw: unknown, turn: number): ResearchMergedIntegrationBaselineSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchMergedIntegrationBaselineSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    mergedBaselineScore: Number(o.mergedBaselineScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    mergeMomentum: Number(o.mergeMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchMergedIntegrationBaselineSnapshot['peakBand'],
    digest: o.digest,
  };
}



function sanitizePostIntegrationDryRunBandLog(raw: unknown): ResearchScaleWavePostIntegrationDryRunBandEvent[] {
  if (!Array.isArray(raw)) return emptyPostIntegrationDryRunBandLog();
  const bands = new Set([64, 78, 92, 99]);
  const out: ResearchScaleWavePostIntegrationDryRunBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWavePostIntegrationDryRunBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      postIntegrationDryRunScore: Number(o.postIntegrationDryRunScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_POST_INTEGRATION_DRY_RUN_BAND_LOG_CAP);
}

function sanitizePostIntegrationDryRunSnapshot(raw: unknown, turn: number): ResearchScaleWavePostIntegrationDryRunSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWavePostIntegrationDryRunSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    postIntegrationDryRunScore: Number(o.postIntegrationDryRunScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    dryRunMomentum: Number(o.dryRunMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWavePostIntegrationDryRunSnapshot['peakBand'],
    digest: o.digest,
  };
}



function sanitizeIntegrationSealBandLog(raw: unknown): ResearchScaleWaveIntegrationSealBandEvent[] {
  if (!Array.isArray(raw)) return emptyIntegrationSealBandLog();
  const bands = new Set([66, 80, 94, 100]);
  const out: ResearchScaleWaveIntegrationSealBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveIntegrationSealBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      integrationSealScore: Number(o.integrationSealScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_INTEGRATION_SEAL_BAND_LOG_CAP);
}

function sanitizeIntegrationSealSnapshot(raw: unknown, turn: number): ResearchScaleWaveIntegrationSealSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveIntegrationSealSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    integrationSealScore: Number(o.integrationSealScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    sealMomentum: Number(o.sealMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveIntegrationSealSnapshot['peakBand'],
    digest: o.digest,
  };
}



function sanitizePostSealHandoffBandLog(raw: unknown): ResearchScaleWavePostSealHandoffBandEvent[] {
  if (!Array.isArray(raw)) return emptyPostSealHandoffBandLog();
  const bands = new Set([68, 82, 96, 100]);
  const out: ResearchScaleWavePostSealHandoffBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWavePostSealHandoffBandEvent;
    if (!bands.has(Number(o.band))) continue;
    if (o.phase !== 'escalation' && o.phase !== 'de-escalation') continue;
    out.push({
      seq: Number(o.seq) || out.length + 1,
      turn: Number(o.turn) || 0,
      band: o.band,
      postSealHandoffScore: Number(o.postSealHandoffScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase,
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_POST_SEAL_HANDOFF_BAND_LOG_CAP);
}

function sanitizePostSealHandoffSnapshot(raw: unknown, turn: number): ResearchScaleWavePostSealHandoffSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWavePostSealHandoffSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    postSealHandoffScore: Number(o.postSealHandoffScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    handoffMomentum: Number(o.handoffMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWavePostSealHandoffSnapshot['peakBand'],
    digest: o.digest,
  };
}


function sanitizeIntegrationContinuityBandLog(raw: unknown): ResearchScaleWaveIntegrationContinuityBandEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: ResearchScaleWaveIntegrationContinuityBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveIntegrationContinuityBandEvent;
    if (typeof o.seq !== 'number' || typeof o.turn !== 'number') continue;
    out.push({
      seq: o.seq,
      turn: o.turn,
      band: (Number(o.band) || 0) as ResearchScaleWaveIntegrationContinuityBandEvent['band'],
      integrationContinuityScore: Number(o.integrationContinuityScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase === 'de-escalation' ? 'de-escalation' : 'escalation',
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_INTEGRATION_CONTINUITY_BAND_LOG_CAP);
}

function sanitizeIntegrationContinuitySnapshot(raw: unknown, turn: number): ResearchScaleWaveIntegrationContinuitySnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveIntegrationContinuitySnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    integrationContinuityScore: Number(o.integrationContinuityScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    continuityMomentum: Number(o.continuityMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveIntegrationContinuitySnapshot['peakBand'],
    digest: o.digest,
  };
}


function sanitizeContinuityHandoffBandLog(raw: unknown): ResearchScaleWaveContinuityHandoffBandEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: ResearchScaleWaveContinuityHandoffBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveContinuityHandoffBandEvent;
    if (typeof o.seq !== 'number' || typeof o.turn !== 'number') continue;
    out.push({
      seq: o.seq,
      turn: o.turn,
      band: (Number(o.band) || 0) as ResearchScaleWaveContinuityHandoffBandEvent['band'],
      continuityHandoffScore: Number(o.continuityHandoffScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase === 'de-escalation' ? 'de-escalation' : 'escalation',
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_CONTINUITY_HANDOFF_BAND_LOG_CAP);
}

function sanitizeContinuityHandoffSnapshot(raw: unknown, turn: number): ResearchScaleWaveContinuityHandoffSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveContinuityHandoffSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    continuityHandoffScore: Number(o.continuityHandoffScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    handoffMomentum: Number(o.handoffMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveContinuityHandoffSnapshot['peakBand'],
    digest: o.digest,
  };
}


function sanitizeHandoffIntegrationBandLog(raw: unknown): ResearchScaleWaveHandoffIntegrationBandEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: ResearchScaleWaveHandoffIntegrationBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveHandoffIntegrationBandEvent;
    if (typeof o.seq !== 'number' || typeof o.turn !== 'number') continue;
    out.push({
      seq: o.seq,
      turn: o.turn,
      band: (Number(o.band) || 0) as ResearchScaleWaveHandoffIntegrationBandEvent['band'],
      handoffIntegrationScore: Number(o.handoffIntegrationScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase === 'de-escalation' ? 'de-escalation' : 'escalation',
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_HANDOFF_INTEGRATION_BAND_LOG_CAP);
}

function sanitizeHandoffIntegrationSnapshot(raw: unknown, turn: number): ResearchScaleWaveHandoffIntegrationSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveHandoffIntegrationSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    handoffIntegrationScore: Number(o.handoffIntegrationScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    integrationMomentum: Number(o.integrationMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveHandoffIntegrationSnapshot['peakBand'],
    digest: o.digest,
  };
}


function sanitizeHandoffIntegrationSealBandLog(raw: unknown): ResearchScaleWaveHandoffIntegrationSealBandEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: ResearchScaleWaveHandoffIntegrationSealBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveHandoffIntegrationSealBandEvent;
    if (typeof o.seq !== 'number' || typeof o.turn !== 'number') continue;
    out.push({
      seq: o.seq,
      turn: o.turn,
      band: (Number(o.band) || 0) as ResearchScaleWaveHandoffIntegrationSealBandEvent['band'],
      handoffIntegrationSealScore: Number(o.handoffIntegrationSealScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase === 'de-escalation' ? 'de-escalation' : 'escalation',
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_HANDOFF_INTEGRATION_SEAL_BAND_LOG_CAP);
}

function sanitizeHandoffIntegrationSealSnapshot(raw: unknown, turn: number): ResearchScaleWaveHandoffIntegrationSealSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveHandoffIntegrationSealSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    handoffIntegrationSealScore: Number(o.handoffIntegrationSealScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    sealMomentum: Number(o.sealMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveHandoffIntegrationSealSnapshot['peakBand'],
    digest: o.digest,
  };
}


function sanitizeIntegrationSealHandoffBandLog(raw: unknown): ResearchScaleWaveIntegrationSealHandoffBandEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: ResearchScaleWaveIntegrationSealHandoffBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveIntegrationSealHandoffBandEvent;
    if (typeof o.seq !== 'number' || typeof o.turn !== 'number') continue;
    out.push({
      seq: o.seq,
      turn: o.turn,
      band: (Number(o.band) || 0) as ResearchScaleWaveIntegrationSealHandoffBandEvent['band'],
      integrationSealHandoffScore: Number(o.integrationSealHandoffScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase === 'de-escalation' ? 'de-escalation' : 'escalation',
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_INTEGRATION_SEAL_HANDOFF_BAND_LOG_CAP);
}

function sanitizeIntegrationSealHandoffSnapshot(raw: unknown, turn: number): ResearchScaleWaveIntegrationSealHandoffSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveIntegrationSealHandoffSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    integrationSealHandoffScore: Number(o.integrationSealHandoffScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    handoffMomentum: Number(o.handoffMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveIntegrationSealHandoffSnapshot['peakBand'],
    digest: o.digest,
  };
}


function sanitizeSealHandoffContinuityBandLog(raw: unknown): ResearchScaleWaveSealHandoffContinuityBandEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: ResearchScaleWaveSealHandoffContinuityBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveSealHandoffContinuityBandEvent;
    if (typeof o.seq !== 'number' || typeof o.turn !== 'number') continue;
    out.push({
      seq: o.seq,
      turn: o.turn,
      band: (Number(o.band) || 0) as ResearchScaleWaveSealHandoffContinuityBandEvent['band'],
      sealHandoffContinuityScore: Number(o.sealHandoffContinuityScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase === 'de-escalation' ? 'de-escalation' : 'escalation',
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SEAL_HANDOFF_CONTINUITY_BAND_LOG_CAP);
}

function sanitizeSealHandoffContinuitySnapshot(raw: unknown, turn: number): ResearchScaleWaveSealHandoffContinuitySnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveSealHandoffContinuitySnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    sealHandoffContinuityScore: Number(o.sealHandoffContinuityScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    continuityMomentum: Number(o.continuityMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveSealHandoffContinuitySnapshot['peakBand'],
    digest: o.digest,
  };
}


function sanitizeSealHandoffIntegrationBandLog(raw: unknown): ResearchScaleWaveSealHandoffIntegrationBandEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: ResearchScaleWaveSealHandoffIntegrationBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveSealHandoffIntegrationBandEvent;
    if (typeof o.seq !== 'number' || typeof o.turn !== 'number') continue;
    out.push({
      seq: o.seq,
      turn: o.turn,
      band: (Number(o.band) || 0) as ResearchScaleWaveSealHandoffIntegrationBandEvent['band'],
      sealHandoffIntegrationScore: Number(o.sealHandoffIntegrationScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase === 'de-escalation' ? 'de-escalation' : 'escalation',
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SEAL_HANDOFF_INTEGRATION_BAND_LOG_CAP);
}

function sanitizeSealHandoffIntegrationSnapshot(raw: unknown, turn: number): ResearchScaleWaveSealHandoffIntegrationSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveSealHandoffIntegrationSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    sealHandoffIntegrationScore: Number(o.sealHandoffIntegrationScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    integrationMomentum: Number(o.integrationMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveSealHandoffIntegrationSnapshot['peakBand'],
    digest: o.digest,
  };
}

function snapshotFromUpgrades(
  upgrades: InstitutionUpgradeState[],
  turn: number
): ResearchInstitutionTierSnapshot {
  return computeInstitutionTierSnapshot(upgrades, turn);
}



function sanitizeSealHandoffIntegrationSealBandLog(raw: unknown): ResearchScaleWaveSealHandoffIntegrationSealBandEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: ResearchScaleWaveSealHandoffIntegrationSealBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveSealHandoffIntegrationSealBandEvent;
    if (typeof o.seq !== 'number' || typeof o.turn !== 'number') continue;
    out.push({
      seq: o.seq,
      turn: o.turn,
      band: (Number(o.band) || 0) as ResearchScaleWaveSealHandoffIntegrationSealBandEvent['band'],
      sealHandoffIntegrationSealScore: Number(o.sealHandoffIntegrationSealScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase === 'de-escalation' ? 'de-escalation' : 'escalation',
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_BAND_LOG_CAP);
}

function sanitizeSealHandoffIntegrationSealSnapshot(raw: unknown, turn: number): ResearchScaleWaveSealHandoffIntegrationSealSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveSealHandoffIntegrationSealSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    sealHandoffIntegrationSealScore: Number(o.sealHandoffIntegrationSealScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    sealMomentum: Number(o.sealMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveSealHandoffIntegrationSealSnapshot['peakBand'],
    digest: o.digest,
  };
}

function sanitizeSealHandoffIntegrationSealContinuityBandLog(raw: unknown): ResearchScaleWaveSealHandoffIntegrationSealContinuityBandEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: ResearchScaleWaveSealHandoffIntegrationSealContinuityBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveSealHandoffIntegrationSealContinuityBandEvent;
    if (typeof o.seq !== 'number' || typeof o.turn !== 'number') continue;
    out.push({
      seq: o.seq,
      turn: o.turn,
      band: (Number(o.band) || 0) as ResearchScaleWaveSealHandoffIntegrationSealContinuityBandEvent['band'],
      sealHandoffIntegrationSealContinuityScore: Number(o.sealHandoffIntegrationSealContinuityScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase === 'de-escalation' ? 'de-escalation' : 'escalation',
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BAND_LOG_CAP);
}

function sanitizeSealHandoffIntegrationSealContinuitySnapshot(
  raw: unknown,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuitySnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveSealHandoffIntegrationSealContinuitySnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    sealHandoffIntegrationSealContinuityScore: Number(o.sealHandoffIntegrationSealContinuityScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    continuityMomentum: Number(o.continuityMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveSealHandoffIntegrationSealContinuitySnapshot['peakBand'],
    digest: o.digest,
  };
}

function sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(raw: unknown): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBandEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBandEvent;
    if (typeof o.seq !== 'number' || typeof o.turn !== 'number') continue;
    out.push({
      seq: o.seq,
      turn: o.turn,
      band: (Number(o.band) || 0) as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffBandEvent['band'],
      sealHandoffIntegrationSealContinuityHandoffScore: Number(o.sealHandoffIntegrationSealContinuityHandoffScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase === 'de-escalation' ? 'de-escalation' : 'escalation',
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BAND_LOG_CAP);
}

function sanitizeSealHandoffIntegrationSealContinuityHandoffSnapshot(
  raw: unknown,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    sealHandoffIntegrationSealContinuityHandoffScore: Number(o.sealHandoffIntegrationSealContinuityHandoffScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    handoffMomentum: Number(o.handoffMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffSnapshot['peakBand'],
    digest: o.digest,
  };
}



function sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(raw: unknown): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationBandEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationBandEvent;
    if (typeof o.seq !== 'number' || typeof o.turn !== 'number') continue;
    out.push({
      seq: o.seq,
      turn: o.turn,
      band: (Number(o.band) || 0) as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationBandEvent['band'],
      sealHandoffIntegrationSealContinuityHandoffIntegrationScore: Number(o.sealHandoffIntegrationSealContinuityHandoffIntegrationScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase === 'de-escalation' ? 'de-escalation' : 'escalation',
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_BAND_LOG_CAP);
}

function sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(
  raw: unknown,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    sealHandoffIntegrationSealContinuityHandoffIntegrationScore: Number(o.sealHandoffIntegrationSealContinuityHandoffIntegrationScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    integrationMomentum: Number(o.integrationMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot['peakBand'],
    digest: o.digest,
  };
}


function sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(raw: unknown): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent;
    if (typeof o.seq !== 'number' || typeof o.turn !== 'number') continue;
    out.push({
      seq: o.seq,
      turn: o.turn,
      band: (Number(o.band) || 0) as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent['band'],
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealScore: Number(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase === 'de-escalation' ? 'de-escalation' : 'escalation',
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_BAND_LOG_CAP);
}

function sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(
  raw: unknown,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealScore: Number(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    sealMomentum: Number(o.sealMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot['peakBand'],
    digest: o.digest,
  };
}

function sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(raw: unknown): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent;
    out.push({
      seq: Number(o.seq) || 0,
      turn: Number(o.turn) || 0,
      band: (Number(o.band) || 0) as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent['band'],
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore: Number(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase === 'de-escalation' ? 'de-escalation' : 'escalation',
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_BAND_LOG_CAP);
}

function sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot(
  raw: unknown,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore: Number(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    continuityMomentum: Number(o.continuityMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot['peakBand'],
    digest: o.digest,
  };
}

function sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(raw: unknown): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandEvent;
    out.push({
      seq: Number(o.seq) || 0,
      turn: Number(o.turn) || 0,
      band: (Number(o.band) || 0) as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandEvent['band'],
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore: Number(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase === 'de-escalation' ? 'de-escalation' : 'escalation',
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_BAND_LOG_CAP);
}

function sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot(
  raw: unknown,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore: Number(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    handoffMomentum: Number(o.handoffMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot['peakBand'],
    digest: o.digest,
  };
}

function sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(raw: unknown): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvent;
    out.push({
      seq: Number(o.seq) || 0,
      turn: Number(o.turn) || 0,
      band: (Number(o.band) || 0) as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvent['band'],
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore: Number(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase === 'de-escalation' ? 'de-escalation' : 'escalation',
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_BAND_LOG_CAP);
}
function sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(raw: unknown): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent[] {
  if (!Array.isArray(raw)) return [];
  const out: ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvent[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent;
    out.push({
      seq: Number(o.seq) || 0,
      turn: Number(o.turn) || 0,
      band: (Number(o.band) || 0) as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvent['band'],
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore: Number(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore) || 0,
      horizonTurns: Number(o.horizonTurns) || 0,
      waveOrdinal: Number(o.waveOrdinal) || 0,
      phase: o.phase === 'de-escalation' ? 'de-escalation' : 'escalation',
    });
  }
  return out.sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SEAL_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_SEAL_CONTINUITY_HANDOFF_INTEGRATION_BAND_LOG_CAP);
}

function sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(
  raw: unknown,
  turn: number
): ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot;
  if (typeof o.digest !== 'string') return null;
  return {
    capturedAtTurn: Number(o.capturedAtTurn) || turn,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore: Number(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore) || 0,
    horizonTurns: Number(o.horizonTurns) || 0,
    waveOrdinal: Number(o.waveOrdinal) || 0,
    integrationMomentum: Number(o.integrationMomentum) || 0,
    projectedFunctionalHint: Number(o.projectedFunctionalHint) || 0,
    dryRunEligible: Boolean(o.dryRunEligible),
    peakBand: (Number(o.peakBand) || 0) as ResearchScaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot['peakBand'],
    digest: o.digest,
  };
}

export function migrateResearchProgressSave(raw: unknown): ResearchProgressPersistedCore | null {
  if (raw == null) return null;
  if (typeof raw !== 'object') return null;

  const o = raw as Record<string, unknown>;
  const ver = o.schemaVersion as ResearchProgressSchemaVersion | undefined;

  if (ver === RESEARCH_PROGRESS_SCHEMA_VERSION) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const eventLog = sanitizeUnlockEventLog(o.unlockEventLog);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const draft = finalizeCoreForPersist({
      schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
      revision: Number(o.revision) || 0,
      turn,
      unlockedNodes: nodes,
      institutionUpgrades: upgrades,
      leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
      unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
      branchEmphasis,
      emphasisRevision,
      migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
      saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
      updatedAtTurn: Number(o.updatedAtTurn) || turn,
      sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
      persistRevision: Number(o.persistRevision) || 0,
      unlockEventLog: eventLog.length ? eventLog : rebuildUnlockEventLogFromNodes(nodes),
      lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
      emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
        ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
        : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
      institutionTierSnapshot:
        sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
        snapshotFromUpgrades(upgrades, turn),
      readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
        ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
        : emptyReadinessMilestoneLog(),
      readinessBranchSnapshot: sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn),
      integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
        ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
        : emptyIntegrationRiskLog(),
      integrationRiskSnapshot: sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn),
      scaleWaveSnapshot: sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn),
      synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
        ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
        : emptySynergyThresholdLog(),
      synergySnapshot: sanitizeSynergySnapshot(o.synergySnapshot, turn),
      commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
        ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
        : emptyCommercializationMilestoneLog(),
      commercializationSnapshot: sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn),
      diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
        ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
        : emptyDiffusionIntegrationLog(),
      diffusionIntegrationSnapshot: sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn),
      portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
        ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
        : emptyPortfolioBalanceLog(),
      portfolioBalanceSnapshot: sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn),
      diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
        ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
        : emptyDiffusionForecastBandLog(),
      diffusionForecastSnapshot: sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn),
      horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
        ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
        : emptyHorizonConvergenceBandLog(),
      horizonConvergenceSnapshot: sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn),
      researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
        ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
        : emptyResearchExecutionBandLog(),
      researchExecutionSnapshot: sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn),
      strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
        ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
        : emptyStrategicDeliveryBandLog(),
      strategicDeliverySnapshot: sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn),
      scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
        ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
        : emptyScaleWaveMaturityBandLog(),
      scaleWaveMaturitySnapshot: sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn),
      nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
        ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
        : emptyNationalIntegrationBandLog(),
      nationalIntegrationSnapshot: sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn),
      scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
        ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
        : emptyScaleWaveProjectionBandLog(),
      scaleWaveProjectionSnapshot: sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn),
      trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
        ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
        : emptyTrancheProjectionBandLog(),
      trancheProjectionSnapshot: sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn),
      integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
        ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
        : emptyIntegrationGateBandLog(),
      integrationGateSnapshot: sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn),
      dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
        ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
        : emptyDryRunHandoffBandLog(),
      dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
      mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
        ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
        : emptyMergedIntegrationBaselineBandLog(),
      mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
      postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
        ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
        : emptyPostIntegrationDryRunBandLog(),
      postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
      integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
        ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
        : emptyIntegrationSealBandLog(),
      integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
      postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
        ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
        : emptyPostSealHandoffBandLog(),
      postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
      integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
        ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
        : emptyIntegrationContinuityBandLog(),
      integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
      continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
        ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
        : emptyContinuityHandoffBandLog(),
      continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
      handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
        ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
        : emptyHandoffIntegrationBandLog(),
      handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
      handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
        ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
        : emptyHandoffIntegrationSealBandLog(),
      handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
      integrationSealHandoffBandLog: sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog).length
        ? sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog)
        : emptyIntegrationSealHandoffBandLog(),
      integrationSealHandoffSnapshot: sanitizeIntegrationSealHandoffSnapshot(o.integrationSealHandoffSnapshot, turn),
      sealHandoffContinuityBandLog: sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog).length
        ? sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog)
        : emptySealHandoffContinuityBandLog(),
      sealHandoffContinuitySnapshot: sanitizeSealHandoffContinuitySnapshot(o.sealHandoffContinuitySnapshot, turn),
      sealHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog).length
        ? sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog)
        : emptySealHandoffIntegrationBandLog(),
      sealHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSnapshot(o.sealHandoffIntegrationSnapshot, turn),
      sealHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog).length
        ? sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog)
        : emptySealHandoffIntegrationSealBandLog(),
      sealHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealSnapshot, turn),
      sealHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog).length
        ? sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog)
        : emptySealHandoffIntegrationSealContinuityBandLog(),
      sealHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuitySnapshot, turn),
      sealHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog).length
        ? sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog)
        : emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
      sealHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffSnapshot, turn),
      sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
        ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
        : emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
      sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog).length
        ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog)
        : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot, turn),
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog).length
        ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog)
        : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot, turn),
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog).length
        ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog)
        : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot, turn),
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
        ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
        : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
    });
    if (typeof o.coreFingerprint === 'string' && o.coreFingerprint !== draft.coreFingerprint) {
      return draft;
    }
    return draft;
  }

  if (ver === LEGACY_V17) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot: null,
        scaleWaveProjectionBandLog: emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot: null,
        trancheProjectionBandLog: emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot: null,
        integrationGateBandLog: emptyIntegrationGateBandLog(),
        integrationGateSnapshot: null,
        dryRunHandoffBandLog: emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: null,
      },
      LEGACY_V17
    );
  }

  if (ver === LEGACY_V45) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
          ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
          : emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
        integrationSealHandoffBandLog: sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog).length
          ? sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog)
          : emptyIntegrationSealHandoffBandLog(),
        integrationSealHandoffSnapshot: sanitizeIntegrationSealHandoffSnapshot(o.integrationSealHandoffSnapshot, turn),
        sealHandoffContinuityBandLog: sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog).length
          ? sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog)
          : emptySealHandoffContinuityBandLog(),
        sealHandoffContinuitySnapshot: sanitizeSealHandoffContinuitySnapshot(o.sealHandoffContinuitySnapshot, turn),
        sealHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationBandLog(),
        sealHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSnapshot(o.sealHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: null,
      },
      LEGACY_V45
    );
  }

  if (ver === LEGACY_V44) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
          ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
          : emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
        integrationSealHandoffBandLog: sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog).length
          ? sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog)
          : emptyIntegrationSealHandoffBandLog(),
        integrationSealHandoffSnapshot: sanitizeIntegrationSealHandoffSnapshot(o.integrationSealHandoffSnapshot, turn),
        sealHandoffContinuityBandLog: sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog).length
          ? sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog)
          : emptySealHandoffContinuityBandLog(),
        sealHandoffContinuitySnapshot: sanitizeSealHandoffContinuitySnapshot(o.sealHandoffContinuitySnapshot, turn),
        sealHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationBandLog(),
        sealHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSnapshot(o.sealHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: null,
      },
      LEGACY_V44
    );
  }

  if (ver === LEGACY_V43) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
          ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
          : emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
        integrationSealHandoffBandLog: sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog).length
          ? sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog)
          : emptyIntegrationSealHandoffBandLog(),
        integrationSealHandoffSnapshot: sanitizeIntegrationSealHandoffSnapshot(o.integrationSealHandoffSnapshot, turn),
        sealHandoffContinuityBandLog: sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog).length
          ? sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog)
          : emptySealHandoffContinuityBandLog(),
        sealHandoffContinuitySnapshot: sanitizeSealHandoffContinuitySnapshot(o.sealHandoffContinuitySnapshot, turn),
        sealHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationBandLog(),
        sealHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSnapshot(o.sealHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: null,
      },
      LEGACY_V43
    );
  }

  if (ver === LEGACY_V42) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
          ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
          : emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
        integrationSealHandoffBandLog: sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog).length
          ? sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog)
          : emptyIntegrationSealHandoffBandLog(),
        integrationSealHandoffSnapshot: sanitizeIntegrationSealHandoffSnapshot(o.integrationSealHandoffSnapshot, turn),
        sealHandoffContinuityBandLog: sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog).length
          ? sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog)
          : emptySealHandoffContinuityBandLog(),
        sealHandoffContinuitySnapshot: sanitizeSealHandoffContinuitySnapshot(o.sealHandoffContinuitySnapshot, turn),
        sealHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationBandLog(),
        sealHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSnapshot(o.sealHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: null,
      },
      LEGACY_V42
    );
  }

  if (ver === LEGACY_V41) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
          ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
          : emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
        integrationSealHandoffBandLog: sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog).length
          ? sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog)
          : emptyIntegrationSealHandoffBandLog(),
        integrationSealHandoffSnapshot: sanitizeIntegrationSealHandoffSnapshot(o.integrationSealHandoffSnapshot, turn),
        sealHandoffContinuityBandLog: sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog).length
          ? sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog)
          : emptySealHandoffContinuityBandLog(),
        sealHandoffContinuitySnapshot: sanitizeSealHandoffContinuitySnapshot(o.sealHandoffContinuitySnapshot, turn),
        sealHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationBandLog(),
        sealHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSnapshot(o.sealHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: null,
      },
      LEGACY_V41
    );
  }

  if (ver === LEGACY_V40) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
          ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
          : emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
        integrationSealHandoffBandLog: sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog).length
          ? sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog)
          : emptyIntegrationSealHandoffBandLog(),
        integrationSealHandoffSnapshot: sanitizeIntegrationSealHandoffSnapshot(o.integrationSealHandoffSnapshot, turn),
        sealHandoffContinuityBandLog: sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog).length
          ? sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog)
          : emptySealHandoffContinuityBandLog(),
        sealHandoffContinuitySnapshot: sanitizeSealHandoffContinuitySnapshot(o.sealHandoffContinuitySnapshot, turn),
        sealHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationBandLog(),
        sealHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSnapshot(o.sealHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: null,
      },
      LEGACY_V40
    );
  }

  if (ver === LEGACY_V39) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
          ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
          : emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
        integrationSealHandoffBandLog: sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog).length
          ? sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog)
          : emptyIntegrationSealHandoffBandLog(),
        integrationSealHandoffSnapshot: sanitizeIntegrationSealHandoffSnapshot(o.integrationSealHandoffSnapshot, turn),
        sealHandoffContinuityBandLog: sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog).length
          ? sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog)
          : emptySealHandoffContinuityBandLog(),
        sealHandoffContinuitySnapshot: sanitizeSealHandoffContinuitySnapshot(o.sealHandoffContinuitySnapshot, turn),
        sealHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationBandLog(),
        sealHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSnapshot(o.sealHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: null,
      },
      LEGACY_V39
    );
  }

  if (ver === LEGACY_V38) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
          ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
          : emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
        integrationSealHandoffBandLog: sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog).length
          ? sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog)
          : emptyIntegrationSealHandoffBandLog(),
        integrationSealHandoffSnapshot: sanitizeIntegrationSealHandoffSnapshot(o.integrationSealHandoffSnapshot, turn),
        sealHandoffContinuityBandLog: sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog).length
          ? sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog)
          : emptySealHandoffContinuityBandLog(),
        sealHandoffContinuitySnapshot: sanitizeSealHandoffContinuitySnapshot(o.sealHandoffContinuitySnapshot, turn),
        sealHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationBandLog(),
        sealHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSnapshot(o.sealHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: null,
      },
      LEGACY_V38
    );
  }

  if (ver === LEGACY_V37) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
          ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
          : emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
        integrationSealHandoffBandLog: sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog).length
          ? sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog)
          : emptyIntegrationSealHandoffBandLog(),
        integrationSealHandoffSnapshot: sanitizeIntegrationSealHandoffSnapshot(o.integrationSealHandoffSnapshot, turn),
        sealHandoffContinuityBandLog: sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog).length
          ? sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog)
          : emptySealHandoffContinuityBandLog(),
        sealHandoffContinuitySnapshot: sanitizeSealHandoffContinuitySnapshot(o.sealHandoffContinuitySnapshot, turn),
        sealHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationBandLog(),
        sealHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSnapshot(o.sealHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(o.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(o.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: null,
      },
      LEGACY_V37
    );
  }

  if (ver === LEGACY_V36) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
          ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
          : emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
        integrationSealHandoffBandLog: sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog).length
          ? sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog)
          : emptyIntegrationSealHandoffBandLog(),
        integrationSealHandoffSnapshot: sanitizeIntegrationSealHandoffSnapshot(o.integrationSealHandoffSnapshot, turn),
        sealHandoffContinuityBandLog: sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog).length
          ? sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog)
          : emptySealHandoffContinuityBandLog(),
        sealHandoffContinuitySnapshot: sanitizeSealHandoffContinuitySnapshot(o.sealHandoffContinuitySnapshot, turn),
        sealHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationBandLog(),
        sealHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSnapshot(o.sealHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffBandLog: sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityHandoffBandLog(o.sealHandoffIntegrationSealContinuityHandoffBandLog)
          : emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffSnapshot: sanitizeSealHandoffIntegrationSealContinuityHandoffSnapshot(o.sealHandoffIntegrationSealContinuityHandoffSnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
        sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: null,
      },
      LEGACY_V36
    );
  }

  if (ver === LEGACY_V35) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
          ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
          : emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
        integrationSealHandoffBandLog: sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog).length
          ? sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog)
          : emptyIntegrationSealHandoffBandLog(),
        integrationSealHandoffSnapshot: sanitizeIntegrationSealHandoffSnapshot(o.integrationSealHandoffSnapshot, turn),
        sealHandoffContinuityBandLog: sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog).length
          ? sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog)
          : emptySealHandoffContinuityBandLog(),
        sealHandoffContinuitySnapshot: sanitizeSealHandoffContinuitySnapshot(o.sealHandoffContinuitySnapshot, turn),
        sealHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationBandLog(),
        sealHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSnapshot(o.sealHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityBandLog: sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog).length
          ? sanitizeSealHandoffIntegrationSealContinuityBandLog(o.sealHandoffIntegrationSealContinuityBandLog)
          : emptySealHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuitySnapshot: sanitizeSealHandoffIntegrationSealContinuitySnapshot(o.sealHandoffIntegrationSealContinuitySnapshot, turn),
        sealHandoffIntegrationSealContinuityHandoffBandLog: emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
        sealHandoffIntegrationSealContinuityHandoffSnapshot: null,
      },
      LEGACY_V35
    );
  }

  if (ver === LEGACY_V34) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
          ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
          : emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
        integrationSealHandoffBandLog: sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog).length
          ? sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog)
          : emptyIntegrationSealHandoffBandLog(),
        integrationSealHandoffSnapshot: sanitizeIntegrationSealHandoffSnapshot(o.integrationSealHandoffSnapshot, turn),
        sealHandoffContinuityBandLog: sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog).length
          ? sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog)
          : emptySealHandoffContinuityBandLog(),
        sealHandoffContinuitySnapshot: sanitizeSealHandoffContinuitySnapshot(o.sealHandoffContinuitySnapshot, turn),
        sealHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationBandLog(),
        sealHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSnapshot(o.sealHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealBandLog: sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog).length
          ? sanitizeSealHandoffIntegrationSealBandLog(o.sealHandoffIntegrationSealBandLog)
          : emptySealHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealSnapshot: sanitizeSealHandoffIntegrationSealSnapshot(o.sealHandoffIntegrationSealSnapshot, turn),
        sealHandoffIntegrationSealContinuityBandLog: emptySealHandoffIntegrationSealContinuityBandLog(),
        sealHandoffIntegrationSealContinuitySnapshot: null,
      },
      LEGACY_V34
    );
  }

  if (ver === LEGACY_V33) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
          ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
          : emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
        integrationSealHandoffBandLog: sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog).length
          ? sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog)
          : emptyIntegrationSealHandoffBandLog(),
        integrationSealHandoffSnapshot: sanitizeIntegrationSealHandoffSnapshot(o.integrationSealHandoffSnapshot, turn),
        sealHandoffContinuityBandLog: sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog).length
          ? sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog)
          : emptySealHandoffContinuityBandLog(),
        sealHandoffContinuitySnapshot: sanitizeSealHandoffContinuitySnapshot(o.sealHandoffContinuitySnapshot, turn),
        sealHandoffIntegrationBandLog: sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog).length
          ? sanitizeSealHandoffIntegrationBandLog(o.sealHandoffIntegrationBandLog)
          : emptySealHandoffIntegrationBandLog(),
        sealHandoffIntegrationSnapshot: sanitizeSealHandoffIntegrationSnapshot(o.sealHandoffIntegrationSnapshot, turn),
        sealHandoffIntegrationSealBandLog: emptySealHandoffIntegrationSealBandLog(),
        sealHandoffIntegrationSealSnapshot: null,
      },
      LEGACY_V33
    );
  }

  if (ver === LEGACY_V32) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
          ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
          : emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
        integrationSealHandoffBandLog: sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog).length
          ? sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog)
          : emptyIntegrationSealHandoffBandLog(),
        integrationSealHandoffSnapshot: sanitizeIntegrationSealHandoffSnapshot(o.integrationSealHandoffSnapshot, turn),
        sealHandoffContinuityBandLog: sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog).length
          ? sanitizeSealHandoffContinuityBandLog(o.sealHandoffContinuityBandLog)
          : emptySealHandoffContinuityBandLog(),
        sealHandoffContinuitySnapshot: sanitizeSealHandoffContinuitySnapshot(o.sealHandoffContinuitySnapshot, turn),
        sealHandoffIntegrationBandLog: emptySealHandoffIntegrationBandLog(),
        sealHandoffIntegrationSnapshot: null,
      },
      LEGACY_V32
    );
  }

  if (ver === LEGACY_V31) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
          ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
          : emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
        integrationSealHandoffBandLog: sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog).length
          ? sanitizeIntegrationSealHandoffBandLog(o.integrationSealHandoffBandLog)
          : emptyIntegrationSealHandoffBandLog(),
        integrationSealHandoffSnapshot: sanitizeIntegrationSealHandoffSnapshot(o.integrationSealHandoffSnapshot, turn),
        sealHandoffContinuityBandLog: emptySealHandoffContinuityBandLog(),
        sealHandoffContinuitySnapshot: null,
      },
      LEGACY_V31
    );
  }

  if (ver === LEGACY_V30) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog).length
          ? sanitizeHandoffIntegrationSealBandLog(o.handoffIntegrationSealBandLog)
          : emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: sanitizeHandoffIntegrationSealSnapshot(o.handoffIntegrationSealSnapshot, turn),
        integrationSealHandoffBandLog: emptyIntegrationSealHandoffBandLog(),
        integrationSealHandoffSnapshot: null,
      },
      LEGACY_V30
    );
  }

  if (ver === LEGACY_V29) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog).length
          ? sanitizeHandoffIntegrationBandLog(o.handoffIntegrationBandLog)
          : emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: sanitizeHandoffIntegrationSnapshot(o.handoffIntegrationSnapshot, turn),
        handoffIntegrationSealBandLog: emptyHandoffIntegrationSealBandLog(),
        handoffIntegrationSealSnapshot: null,
      },
      LEGACY_V29
    );
  }

  if (ver === LEGACY_V28) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog).length
          ? sanitizeContinuityHandoffBandLog(o.continuityHandoffBandLog)
          : emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: sanitizeContinuityHandoffSnapshot(o.continuityHandoffSnapshot, turn),
        handoffIntegrationBandLog: emptyHandoffIntegrationBandLog(),
        handoffIntegrationSnapshot: null,
      },
      LEGACY_V28
    );
  }

  if (ver === LEGACY_V27) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog).length
          ? sanitizeIntegrationContinuityBandLog(o.integrationContinuityBandLog)
          : emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: sanitizeIntegrationContinuitySnapshot(o.integrationContinuitySnapshot, turn),
        continuityHandoffBandLog: emptyContinuityHandoffBandLog(),
        continuityHandoffSnapshot: null,
      },
      LEGACY_V27
    );
  }

  if (ver === LEGACY_V26) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog).length
          ? sanitizePostSealHandoffBandLog(o.postSealHandoffBandLog)
          : emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: sanitizePostSealHandoffSnapshot(o.postSealHandoffSnapshot, turn),
        integrationContinuityBandLog: emptyIntegrationContinuityBandLog(),
        integrationContinuitySnapshot: null,
      },
      LEGACY_V26
    );
  }

  if (ver === LEGACY_V25) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: sanitizeIntegrationSealBandLog(o.integrationSealBandLog).length
          ? sanitizeIntegrationSealBandLog(o.integrationSealBandLog)
          : emptyIntegrationSealBandLog(),
        integrationSealSnapshot: sanitizeIntegrationSealSnapshot(o.integrationSealSnapshot, turn),
        postSealHandoffBandLog: emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: null,
      },
      LEGACY_V25
    );
  }

  if (ver === LEGACY_V24) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog).length
          ? sanitizePostIntegrationDryRunBandLog(o.postIntegrationDryRunBandLog)
          : emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: sanitizePostIntegrationDryRunSnapshot(o.postIntegrationDryRunSnapshot, turn),
        integrationSealBandLog: emptyIntegrationSealBandLog(),
        integrationSealSnapshot: null,
        postSealHandoffBandLog: emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: null,
      },
      LEGACY_V24
    );
  }

  if (ver === LEGACY_V23) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog).length
          ? sanitizeMergedIntegrationBaselineBandLog(o.mergedIntegrationBaselineBandLog)
          : emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: sanitizeMergedIntegrationBaselineSnapshot(o.mergedIntegrationBaselineSnapshot, turn),
        postIntegrationDryRunBandLog: emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: null,
        integrationSealBandLog: emptyIntegrationSealBandLog(),
        integrationSealSnapshot: null,
        postSealHandoffBandLog: emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: null,
      },
      LEGACY_V23
    );
  }

  if (ver === LEGACY_V22) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog).length
          ? sanitizeDryRunHandoffBandLog(o.dryRunHandoffBandLog)
          : emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: sanitizeDryRunHandoffSnapshot(o.dryRunHandoffSnapshot, turn),
        mergedIntegrationBaselineBandLog: emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: null,
        postIntegrationDryRunBandLog: emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: null,
        integrationSealBandLog: emptyIntegrationSealBandLog(),
        integrationSealSnapshot: null,
        postSealHandoffBandLog: emptyPostSealHandoffBandLog(),
        postSealHandoffSnapshot: null,
      },
      LEGACY_V22
    );
  }

  if (ver === LEGACY_V21) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    const integrationGateSnapshot = sanitizeIntegrationGateSnapshot(o.integrationGateSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: sanitizeIntegrationGateBandLog(o.integrationGateBandLog).length
          ? sanitizeIntegrationGateBandLog(o.integrationGateBandLog)
          : emptyIntegrationGateBandLog(),
        integrationGateSnapshot,
        dryRunHandoffBandLog: emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: null,
        mergedIntegrationBaselineBandLog: emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: null,
        postIntegrationDryRunBandLog: emptyPostIntegrationDryRunBandLog(),
        postIntegrationDryRunSnapshot: null,
        integrationSealBandLog: emptyIntegrationSealBandLog(),
        integrationSealSnapshot: null,
      },
      LEGACY_V21
    );
  }

  if (ver === LEGACY_V20) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    const trancheProjectionSnapshot = sanitizeTrancheProjectionSnapshot(o.trancheProjectionSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog).length
          ? sanitizeTrancheProjectionBandLog(o.trancheProjectionBandLog)
          : emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot,
        integrationGateBandLog: emptyIntegrationGateBandLog(),
        integrationGateSnapshot: null,
        dryRunHandoffBandLog: emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: null,
        mergedIntegrationBaselineBandLog: emptyMergedIntegrationBaselineBandLog(),
        mergedIntegrationBaselineSnapshot: null,
      },
      LEGACY_V20
    );
  }

  if (ver === LEGACY_V19) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    const scaleWaveProjectionSnapshot = sanitizeScaleWaveProjectionSnapshot(o.scaleWaveProjectionSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog).length
          ? sanitizeScaleWaveProjectionBandLog(o.scaleWaveProjectionBandLog)
          : emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: emptyTrancheProjectionBandLog(),
        trancheProjectionSnapshot: null,
        integrationGateBandLog: emptyIntegrationGateBandLog(),
        integrationGateSnapshot: null,
        dryRunHandoffBandLog: emptyDryRunHandoffBandLog(),
        dryRunHandoffSnapshot: null,
      },
      LEGACY_V19
    );
  }

  if (ver === LEGACY_V18) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    const scaleWaveMaturitySnapshot = sanitizeScaleWaveMaturitySnapshot(o.scaleWaveMaturitySnapshot, turn);
    const nationalIntegrationSnapshot = sanitizeNationalIntegrationSnapshot(o.nationalIntegrationSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog).length
          ? sanitizeScaleWaveMaturityBandLog(o.scaleWaveMaturityBandLog)
          : emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog).length
          ? sanitizeNationalIntegrationBandLog(o.nationalIntegrationBandLog)
          : emptyNationalIntegrationBandLog(),
        nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: emptyScaleWaveProjectionBandLog(),
        scaleWaveProjectionSnapshot: null,
      },
      LEGACY_V18
    );
  }

  if (ver === LEGACY_V16) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    const strategicDeliverySnapshot = sanitizeStrategicDeliverySnapshot(o.strategicDeliverySnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog).length
          ? sanitizeStrategicDeliveryBandLog(o.strategicDeliveryBandLog)
          : emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: emptyScaleWaveMaturityBandLog(),
        scaleWaveMaturitySnapshot: null,
      },
      LEGACY_V16
    );
  }

  if (ver === LEGACY_V15) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    const researchExecutionSnapshot = sanitizeResearchExecutionSnapshot(o.researchExecutionSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: sanitizeResearchExecutionBandLog(o.researchExecutionBandLog).length
          ? sanitizeResearchExecutionBandLog(o.researchExecutionBandLog)
          : emptyResearchExecutionBandLog(),
        researchExecutionSnapshot,
        strategicDeliveryBandLog: emptyStrategicDeliveryBandLog(),
        strategicDeliverySnapshot: null,
      },
      LEGACY_V15
    );
  }

  if (ver === LEGACY_V14) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    const horizonConvergenceSnapshot = sanitizeHorizonConvergenceSnapshot(o.horizonConvergenceSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog).length
          ? sanitizeHorizonConvergenceBandLog(o.horizonConvergenceBandLog)
          : emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot,
        researchExecutionBandLog: emptyResearchExecutionBandLog(),
        researchExecutionSnapshot: null,
      },
      LEGACY_V14
    );
  }

  if (ver === LEGACY_V13) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    const diffusionForecastSnapshot = sanitizeDiffusionForecastSnapshot(o.diffusionForecastSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog).length
          ? sanitizeDiffusionForecastBandLog(o.diffusionForecastBandLog)
          : emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot,
        horizonConvergenceBandLog: emptyHorizonConvergenceBandLog(),
        horizonConvergenceSnapshot: null,
      },
      LEGACY_V13
    );
  }

  if (ver === LEGACY_V12) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    const portfolioBalanceSnapshot = sanitizePortfolioBalanceSnapshot(o.portfolioBalanceSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: sanitizePortfolioBalanceLog(o.portfolioBalanceLog).length
          ? sanitizePortfolioBalanceLog(o.portfolioBalanceLog)
          : emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot,
        diffusionForecastBandLog: emptyDiffusionForecastBandLog(),
        diffusionForecastSnapshot: null,
      },
      LEGACY_V12
    );
  }

  if (ver === LEGACY_V11) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    const diffusionIntegrationSnapshot = sanitizeDiffusionIntegrationSnapshot(o.diffusionIntegrationSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog).length
          ? sanitizeDiffusionIntegrationLog(o.diffusionIntegrationLog)
          : emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot,
        portfolioBalanceLog: emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot: null,
      },
      LEGACY_V11
    );
  }

  if (ver === LEGACY_V10) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    const commercializationSnapshot = sanitizeCommercializationSnapshot(o.commercializationSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog).length
          ? sanitizeCommercializationMilestoneLog(o.commercializationMilestoneLog)
          : emptyCommercializationMilestoneLog(),
        commercializationSnapshot,
        diffusionIntegrationLog: emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot: null,
        portfolioBalanceLog: emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot: null,
      },
      LEGACY_V10
    );
  }

  if (ver === LEGACY_V9) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    const synergySnapshot = sanitizeSynergySnapshot(o.synergySnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: sanitizeSynergyThresholdLog(o.synergyThresholdLog).length
          ? sanitizeSynergyThresholdLog(o.synergyThresholdLog)
          : emptySynergyThresholdLog(),
        synergySnapshot,
        commercializationMilestoneLog: emptyCommercializationMilestoneLog(),
        commercializationSnapshot: null,
        diffusionIntegrationLog: emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot: null,
        portfolioBalanceLog: emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot: null,
      },
      LEGACY_V9
    );
  }

  if (ver === LEGACY_V8) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    const integrationRiskSnapshot = sanitizeIntegrationRiskSnapshot(o.integrationRiskSnapshot, turn);
    const scaleWaveSnapshot = sanitizeScaleWaveSnapshot(o.scaleWaveSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: sanitizeIntegrationRiskLog(o.integrationRiskLog).length
          ? sanitizeIntegrationRiskLog(o.integrationRiskLog)
          : emptyIntegrationRiskLog(),
        integrationRiskSnapshot,
        scaleWaveSnapshot,
        synergyThresholdLog: emptySynergyThresholdLog(),
        synergySnapshot: null,
        commercializationMilestoneLog: emptyCommercializationMilestoneLog(),
        commercializationSnapshot: null,
        diffusionIntegrationLog: emptyDiffusionIntegrationLog(),
        diffusionIntegrationSnapshot: null,
        portfolioBalanceLog: emptyPortfolioBalanceLog(),
        portfolioBalanceSnapshot: null,
      },
      LEGACY_V8
    );
  }

  if (ver === LEGACY_V7) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    const readinessBranchSnapshot = sanitizeReadinessBranchSnapshot(o.readinessBranchSnapshot, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: sanitizeReadinessMilestoneLog(o.readinessMilestoneLog).length
          ? sanitizeReadinessMilestoneLog(o.readinessMilestoneLog)
          : rebuildReadinessMilestoneLogFromSnapshot(readinessBranchSnapshot, turn),
        readinessBranchSnapshot,
        integrationRiskLog: emptyIntegrationRiskLog(),
        integrationRiskSnapshot: null,
        scaleWaveSnapshot: null,
        synergyThresholdLog: emptySynergyThresholdLog(),
        synergySnapshot: null,
        commercializationMilestoneLog: emptyCommercializationMilestoneLog(),
        commercializationSnapshot: null,
      },
      LEGACY_V7
    );
  }

  if (ver === LEGACY_V6) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    const institutionTierSnapshot =
      sanitizeInstitutionTierSnapshot(o.institutionTierSnapshot, turn) ??
      snapshotFromUpgrades(upgrades, turn);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
        emphasisChangeLog: sanitizeEmphasisChangeLog(o.emphasisChangeLog).length
          ? sanitizeEmphasisChangeLog(o.emphasisChangeLog)
          : rebuildEmphasisChangeLogFromBranchEmphasis(branchEmphasis, emphasisRevision, turn),
        institutionTierSnapshot,
        readinessMilestoneLog: emptyReadinessMilestoneLog(),
        readinessBranchSnapshot: null,
        integrationRiskLog: emptyIntegrationRiskLog(),
        integrationRiskSnapshot: null,
        scaleWaveSnapshot: null,
        synergyThresholdLog: emptySynergyThresholdLog(),
        synergySnapshot: null,
      },
      LEGACY_V6
    );
  }

  if (ver === LEGACY_V5) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const upgrades = sanitizeInstitutionUpgrades(o.institutionUpgrades);
    const turn = Number(o.turn) || 0;
    const branchEmphasis = sanitizeBranchEmphasis(o.branchEmphasis);
    const emphasisRevision = Number(o.emphasisRevision) || 0;
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn,
        unlockedNodes: nodes,
        institutionUpgrades: upgrades,
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis,
        emphasisRevision,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || turn,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${turn}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: sanitizeUnlockEventLog(o.unlockEventLog).length
          ? sanitizeUnlockEventLog(o.unlockEventLog)
          : rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || turn,
      },
      LEGACY_V5
    );
  }

  if (ver === LEGACY_V4) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn: Number(o.turn) || 0,
        unlockedNodes: nodes,
        institutionUpgrades: sanitizeInstitutionUpgrades(o.institutionUpgrades),
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis: sanitizeBranchEmphasis(o.branchEmphasis),
        emphasisRevision: Number(o.emphasisRevision) || 0,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: (o.saveKind as ResearchSaveKind) || 'manual',
        updatedAtTurn: Number(o.updatedAtTurn) || Number(o.turn) || 0,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${Number(o.turn) || 0}`,
        persistRevision: Number(o.persistRevision) || 0,
        unlockEventLog: rebuildUnlockEventLogFromNodes(nodes),
        lastReconciledAtTurn: Number(o.turn) || 0,
      },
      LEGACY_V4
    );
  }

  if (ver === LEGACY_V3) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn: Number(o.turn) || 0,
        unlockedNodes: nodes,
        institutionUpgrades: sanitizeInstitutionUpgrades(o.institutionUpgrades),
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis: sanitizeBranchEmphasis(o.branchEmphasis),
        emphasisRevision: Number(o.emphasisRevision) || 0,
        migrationLog: Array.isArray(o.migrationLog) ? (o.migrationLog as ResearchSaveMigrationEntry[]) : [],
        saveKind: 'manual',
        updatedAtTurn: Number(o.turn) || 0,
        sessionId: typeof o.sessionId === 'string' ? o.sessionId : `o10m_r03_${Number(o.turn) || 0}`,
        persistRevision: 0,
      },
      LEGACY_V3
    );
  }

  if (ver === LEGACY_V2) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: Number(o.revision) || 0,
        turn: Number(o.turn) || 0,
        unlockedNodes: nodes,
        institutionUpgrades: sanitizeInstitutionUpgrades(o.institutionUpgrades),
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
        branchEmphasis: sanitizeBranchEmphasis(o.branchEmphasis),
      },
      LEGACY_V2
    );
  }

  if (ver === LEGACY_V1) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    return upgradeToCurrentCore(
      {
        schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
        revision: 1,
        turn: Number(o.turn) || 0,
        unlockedNodes: nodes,
        institutionUpgrades: sanitizeInstitutionUpgrades(o.institutionUpgrades),
        leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
        unlockSeq: computeUnlockSeq(nodes),
        branchEmphasis: defaultBranchEmphasis(),
      },
      LEGACY_V1
    );
  }

  if (Array.isArray(raw)) {
    const nodes = sanitizeUnlockedNodes(raw);
    return upgradeToCurrentCore(
      { ...emptyCore(0), revision: 1, unlockedNodes: nodes, unlockSeq: computeUnlockSeq(nodes) },
      'array-legacy'
    );
  }

  return null;
}

export function extractPersistedCore(state: ResearchProgressState): ResearchProgressPersistedCore {
  return finalizeCoreForPersist({
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: state.revision ?? 0,
    turn: state.turn,
    unlockedNodes: state.unlockedNodes,
    institutionUpgrades: state.institutionUpgrades,
    leadingResearchRegion: state.leadingResearchRegion,
    unlockSeq: state.unlockSeq ?? computeUnlockSeq(state.unlockedNodes),
    branchEmphasis: state.branchEmphasis ?? defaultBranchEmphasis(),
    emphasisRevision: state.emphasisRevision ?? 0,
    migrationLog: state.migrationLog ?? [],
    saveKind: state.saveKind ?? 'manual',
    updatedAtTurn: state.updatedAtTurn ?? state.turn,
    sessionId: state.sessionId ?? `o10m_r03_${state.turn}_${state.revision ?? 0}`,
    persistRevision: state.persistRevision ?? 0,
    unlockEventLog: state.unlockEventLog ?? emptyUnlockEventLog(),
    lastReconciledAtTurn: state.lastReconciledAtTurn ?? state.turn,
    emphasisChangeLog: state.emphasisChangeLog ?? emptyEmphasisChangeLog(),
    institutionTierSnapshot:
      state.institutionTierSnapshot ??
      computeInstitutionTierSnapshot(state.institutionUpgrades, state.turn),
    readinessMilestoneLog: state.readinessMilestoneLog ?? emptyReadinessMilestoneLog(),
    readinessBranchSnapshot: state.readinessBranchSnapshot ?? null,
    integrationRiskLog: state.integrationRiskLog ?? emptyIntegrationRiskLog(),
    integrationRiskSnapshot: state.integrationRiskSnapshot ?? null,
    scaleWaveSnapshot: state.scaleWaveSnapshot ?? null,
    synergyThresholdLog: state.synergyThresholdLog ?? emptySynergyThresholdLog(),
    synergySnapshot: state.synergySnapshot ?? null,
    commercializationMilestoneLog: state.commercializationMilestoneLog ?? emptyCommercializationMilestoneLog(),
    commercializationSnapshot: state.commercializationSnapshot ?? null,
    diffusionIntegrationLog: state.diffusionIntegrationLog ?? emptyDiffusionIntegrationLog(),
    diffusionIntegrationSnapshot: state.diffusionIntegrationSnapshot ?? null,
    portfolioBalanceLog: state.portfolioBalanceLog ?? emptyPortfolioBalanceLog(),
    portfolioBalanceSnapshot: state.portfolioBalanceSnapshot ?? null,
    diffusionForecastBandLog: state.diffusionForecastBandLog ?? emptyDiffusionForecastBandLog(),
    diffusionForecastSnapshot: state.diffusionForecastSnapshot ?? null,
    horizonConvergenceBandLog: state.horizonConvergenceBandLog ?? emptyHorizonConvergenceBandLog(),
    horizonConvergenceSnapshot: state.horizonConvergenceSnapshot ?? null,
    researchExecutionBandLog: state.researchExecutionBandLog ?? emptyResearchExecutionBandLog(),
    researchExecutionSnapshot: state.researchExecutionSnapshot ?? null,
    strategicDeliveryBandLog: state.strategicDeliveryBandLog ?? emptyStrategicDeliveryBandLog(),
    strategicDeliverySnapshot: state.strategicDeliverySnapshot ?? null,
    scaleWaveMaturityBandLog: state.scaleWaveMaturityBandLog ?? emptyScaleWaveMaturityBandLog(),
    scaleWaveMaturitySnapshot: state.scaleWaveMaturitySnapshot ?? null,
    nationalIntegrationBandLog: state.nationalIntegrationBandLog ?? emptyNationalIntegrationBandLog(),
    nationalIntegrationSnapshot: state.nationalIntegrationSnapshot ?? null,
    scaleWaveProjectionBandLog: state.scaleWaveProjectionBandLog ?? emptyScaleWaveProjectionBandLog(),
    scaleWaveProjectionSnapshot: state.scaleWaveProjectionSnapshot ?? null,
    trancheProjectionBandLog: state.trancheProjectionBandLog ?? emptyTrancheProjectionBandLog(),
    trancheProjectionSnapshot: state.trancheProjectionSnapshot ?? null,
    integrationGateBandLog: state.integrationGateBandLog ?? emptyIntegrationGateBandLog(),
    integrationGateSnapshot: state.integrationGateSnapshot ?? null,
    dryRunHandoffBandLog: state.dryRunHandoffBandLog ?? emptyDryRunHandoffBandLog(),
    dryRunHandoffSnapshot: state.dryRunHandoffSnapshot ?? null,
    mergedIntegrationBaselineBandLog: state.mergedIntegrationBaselineBandLog ?? emptyMergedIntegrationBaselineBandLog(),
    mergedIntegrationBaselineSnapshot: state.mergedIntegrationBaselineSnapshot ?? null,
    postIntegrationDryRunBandLog: state.postIntegrationDryRunBandLog ?? emptyPostIntegrationDryRunBandLog(),
    postIntegrationDryRunSnapshot: state.postIntegrationDryRunSnapshot ?? null,
    integrationSealBandLog: state.integrationSealBandLog ?? emptyIntegrationSealBandLog(),
    integrationSealSnapshot: state.integrationSealSnapshot ?? null,
    postSealHandoffBandLog: state.postSealHandoffBandLog ?? emptyPostSealHandoffBandLog(),
    postSealHandoffSnapshot: state.postSealHandoffSnapshot ?? null,
    integrationContinuityBandLog: state.integrationContinuityBandLog ?? emptyIntegrationContinuityBandLog(),
    integrationContinuitySnapshot: state.integrationContinuitySnapshot ?? null,
    continuityHandoffBandLog: state.continuityHandoffBandLog ?? emptyContinuityHandoffBandLog(),
    continuityHandoffSnapshot: state.continuityHandoffSnapshot ?? null,
    handoffIntegrationBandLog: state.handoffIntegrationBandLog ?? emptyHandoffIntegrationBandLog(),
    handoffIntegrationSnapshot: state.handoffIntegrationSnapshot ?? null,
    handoffIntegrationSealBandLog: state.handoffIntegrationSealBandLog ?? emptyHandoffIntegrationSealBandLog(),
    handoffIntegrationSealSnapshot: state.handoffIntegrationSealSnapshot ?? null,
    integrationSealHandoffBandLog: state.integrationSealHandoffBandLog ?? emptyIntegrationSealHandoffBandLog(),
    integrationSealHandoffSnapshot: state.integrationSealHandoffSnapshot ?? null,
    sealHandoffContinuityBandLog: state.sealHandoffContinuityBandLog ?? emptySealHandoffContinuityBandLog(),
    sealHandoffContinuitySnapshot: state.sealHandoffContinuitySnapshot ?? null,
    sealHandoffIntegrationBandLog: state.sealHandoffIntegrationBandLog ?? emptySealHandoffIntegrationBandLog(),
    sealHandoffIntegrationSnapshot: state.sealHandoffIntegrationSnapshot ?? null,
    sealHandoffIntegrationSealBandLog: state.sealHandoffIntegrationSealBandLog ?? emptySealHandoffIntegrationSealBandLog(),
    sealHandoffIntegrationSealSnapshot: state.sealHandoffIntegrationSealSnapshot ?? null,
    sealHandoffIntegrationSealContinuityBandLog: state.sealHandoffIntegrationSealContinuityBandLog ?? emptySealHandoffIntegrationSealContinuityBandLog(),
    sealHandoffIntegrationSealContinuitySnapshot: state.sealHandoffIntegrationSealContinuitySnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffBandLog: state.sealHandoffIntegrationSealContinuityHandoffBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
    sealHandoffIntegrationSealContinuityHandoffSnapshot: state.sealHandoffIntegrationSealContinuityHandoffSnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: state.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: state.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: state.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: state.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: state.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: state.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog: state.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: state.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog: state.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: state.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,
  });
}

export function prepareResearchProgressForSave(state: ResearchProgressState): ResearchProgressPersistedCore {
  return extractPersistedCore(state);
}

export function hydrateResearchProgressCore(core: ResearchProgressPersistedCore | null): ResearchProgressState | null {
  if (!core) return null;
  const readinessByBranch = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, 0])) as Record<
    ResearchBranchId,
    number
  >;
  return {
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: core.revision,
    turn: core.turn,
    unlockedNodes: core.unlockedNodes,
    institutionUpgrades: core.institutionUpgrades,
    leadingResearchRegion: core.leadingResearchRegion,
    unlockSeq: core.unlockSeq,
    branchEmphasis: core.branchEmphasis,
    emphasisRevision: core.emphasisRevision,
    migrationLog: core.migrationLog,
    saveKind: core.saveKind,
    updatedAtTurn: core.updatedAtTurn,
    sessionId: core.sessionId,
    persistRevision: core.persistRevision,
    unlockEventLog: core.unlockEventLog,
    lastReconciledAtTurn: core.lastReconciledAtTurn,
    emphasisChangeLog: core.emphasisChangeLog,
    institutionTierSnapshot: core.institutionTierSnapshot,
    readinessMilestoneLog: core.readinessMilestoneLog,
    readinessBranchSnapshot: core.readinessBranchSnapshot,
    integrationRiskLog: core.integrationRiskLog,
    integrationRiskSnapshot: core.integrationRiskSnapshot,
    scaleWaveSnapshot: core.scaleWaveSnapshot,
    synergyThresholdLog: core.synergyThresholdLog,
    synergySnapshot: core.synergySnapshot,
    commercializationMilestoneLog: core.commercializationMilestoneLog,
    commercializationSnapshot: core.commercializationSnapshot,
    diffusionIntegrationLog: core.diffusionIntegrationLog,
    diffusionIntegrationSnapshot: core.diffusionIntegrationSnapshot,
    portfolioBalanceLog: core.portfolioBalanceLog,
    portfolioBalanceSnapshot: core.portfolioBalanceSnapshot,
    diffusionForecastBandLog: core.diffusionForecastBandLog,
    diffusionForecastSnapshot: core.diffusionForecastSnapshot,
    horizonConvergenceBandLog: core.horizonConvergenceBandLog,
    horizonConvergenceSnapshot: core.horizonConvergenceSnapshot,
    researchExecutionBandLog: core.researchExecutionBandLog,
    researchExecutionSnapshot: core.researchExecutionSnapshot,
    strategicDeliveryBandLog: core.strategicDeliveryBandLog,
    strategicDeliverySnapshot: core.strategicDeliverySnapshot,
    scaleWaveMaturityBandLog: core.scaleWaveMaturityBandLog,
    scaleWaveMaturitySnapshot: core.scaleWaveMaturitySnapshot,
    nationalIntegrationBandLog: core.nationalIntegrationBandLog,
    nationalIntegrationSnapshot: core.nationalIntegrationSnapshot,
    scaleWaveProjectionBandLog: core.scaleWaveProjectionBandLog,
    scaleWaveProjectionSnapshot: core.scaleWaveProjectionSnapshot,
    trancheProjectionBandLog: core.trancheProjectionBandLog,
    trancheProjectionSnapshot: core.trancheProjectionSnapshot,
    integrationGateBandLog: core.integrationGateBandLog,
    integrationGateSnapshot: core.integrationGateSnapshot,
    dryRunHandoffBandLog: core.dryRunHandoffBandLog,
    dryRunHandoffSnapshot: core.dryRunHandoffSnapshot,
    mergedIntegrationBaselineBandLog: core.mergedIntegrationBaselineBandLog,
    mergedIntegrationBaselineSnapshot: core.mergedIntegrationBaselineSnapshot,
    postIntegrationDryRunBandLog: core.postIntegrationDryRunBandLog,
    postIntegrationDryRunSnapshot: core.postIntegrationDryRunSnapshot,
    integrationSealBandLog: core.integrationSealBandLog,
    integrationSealSnapshot: core.integrationSealSnapshot,
    postSealHandoffBandLog: core.postSealHandoffBandLog,
    postSealHandoffSnapshot: core.postSealHandoffSnapshot,
    integrationContinuityBandLog: core.integrationContinuityBandLog,
    integrationContinuitySnapshot: core.integrationContinuitySnapshot,
    continuityHandoffBandLog: core.continuityHandoffBandLog,
    continuityHandoffSnapshot: core.continuityHandoffSnapshot,
    handoffIntegrationBandLog: core.handoffIntegrationBandLog,
    handoffIntegrationSnapshot: core.handoffIntegrationSnapshot,
    handoffIntegrationSealBandLog: core.handoffIntegrationSealBandLog,
    handoffIntegrationSealSnapshot: core.handoffIntegrationSealSnapshot,
    integrationSealHandoffBandLog: core.integrationSealHandoffBandLog,
    integrationSealHandoffSnapshot: core.integrationSealHandoffSnapshot,
    sealHandoffContinuityBandLog: core.sealHandoffContinuityBandLog,
    sealHandoffContinuitySnapshot: core.sealHandoffContinuitySnapshot,
    sealHandoffIntegrationBandLog: core.sealHandoffIntegrationBandLog,
    sealHandoffIntegrationSnapshot: core.sealHandoffIntegrationSnapshot,
    sealHandoffIntegrationSealBandLog: core.sealHandoffIntegrationSealBandLog,
    sealHandoffIntegrationSealSnapshot: core.sealHandoffIntegrationSealSnapshot,
    sealHandoffIntegrationSealContinuityBandLog: core.sealHandoffIntegrationSealContinuityBandLog,
    sealHandoffIntegrationSealContinuitySnapshot: core.sealHandoffIntegrationSealContinuitySnapshot,
    sealHandoffIntegrationSealContinuityHandoffBandLog: core.sealHandoffIntegrationSealContinuityHandoffBandLog,
    sealHandoffIntegrationSealContinuityHandoffSnapshot: core.sealHandoffIntegrationSealContinuityHandoffSnapshot,
    sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog: core.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: core.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog: core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog: core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot,
    diffusion: V94_REGION_CODES.map(regionId => ({
      regionId,
      score: 0,
      level: 'latent' as const,
      sourceNodeIds: [],
    })),
    readinessByBranch,
    activeHookIds: [],
    inputHash: '',
    lateGameDiffusion: null,
    scaleWave: null,
  };
}

export function mergeComputedResearchState(
  core: ResearchProgressPersistedCore,
  computed: ResearchProgressState
): ResearchProgressState {
  const mergedUpgrades = mergeMonotonicUpgrades(computed.institutionUpgrades, core.institutionUpgrades);
  const unlockSet = new Map<string, UnlockedResearchNode>();
  core.unlockedNodes.forEach(u => unlockSet.set(u.nodeId, u));
  computed.unlockedNodes.forEach(u => {
    if (!unlockSet.has(u.nodeId)) unlockSet.set(u.nodeId, u);
  });
  const unlockedNodes = [...unlockSet.values()].sort(
    (a, b) => a.unlockedTurn - b.unlockedTurn || a.nodeId.localeCompare(b.nodeId)
  );
  const newUnlocks = unlockedNodes.length - core.unlockedNodes.length;
  const unlockEventLog = appendUnlockEvents(
    core.unlockEventLog ?? emptyUnlockEventLog(),
    core.unlockedNodes,
    unlockedNodes,
    computed.turn,
    Math.max(core.unlockSeq, unlockedNodes.length)
  );
  const integrationRiskOutlook =
    computed.integrationRiskOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      nationalRiskScore: 0,
      criticalBranchCount: 0,
      links: [],
    } as const);
  const integrationRiskLog = appendIntegrationRiskEvents(
    core.integrationRiskLog ?? emptyIntegrationRiskLog(),
    core.integrationRiskSnapshot ?? null,
    integrationRiskOutlook,
    computed.turn
  );
  const synergyOutlook =
    computed.synergyOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      currentSynergyScore: 0,
      projectedSynergyScore: 0,
      activeMultiBranchCount: 0,
      transferLinks: [],
      dominantCapabilityCluster: null,
    } as const);
  const synergyThresholdLog = appendSynergyThresholdEvents(
    core.synergyThresholdLog ?? emptySynergyThresholdLog(),
    core.synergySnapshot ?? null,
    synergyOutlook,
    computed.turn
  );
  const commercialization =
    computed.commercialization ??
    ({
      active: false,
      hints: [],
      nationalExportScore: 0,
    } as const);
  const commercializationMilestoneLog = appendCommercializationMilestoneEvents(
    core.commercializationMilestoneLog ?? emptyCommercializationMilestoneLog(),
    core.commercializationSnapshot ?? null,
    commercialization,
    computed.turn
  );
  const diffusionIntegrationLog = appendDiffusionIntegrationEvents(
    core.diffusionIntegrationLog ?? emptyDiffusionIntegrationLog(),
    core.diffusionIntegrationSnapshot ?? null,
    computed.diffusion,
    computed.turn
  );
  const portfolioBalance =
    computed.portfolioBalance ??
    ({
      active: false,
      hints: [],
      nationalBalanceScore: 50,
    } as const);
  const portfolioBalanceLog = appendPortfolioBalanceBandEvents(
    core.portfolioBalanceLog ?? emptyPortfolioBalanceLog(),
    core.portfolioBalanceSnapshot ?? null,
    portfolioBalance,
    computed.turn
  );
  const diffusionForecast =
    computed.diffusionForecast ??
    ({
      active: false,
      horizonTurns: 6,
      peakProjectedScore: 0,
      peakRegionId: null,
      projections: [],
    } as const);
  const diffusionForecastBandLog = appendDiffusionForecastBandEvents(
    core.diffusionForecastBandLog ?? emptyDiffusionForecastBandLog(),
    core.diffusionForecastSnapshot ?? null,
    diffusionForecast,
    computed.turn
  );
  const horizonConvergenceOutlook =
    computed.horizonConvergenceOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      nationalConvergenceScore: 0,
      projectedConvergenceScore: 0,
      peakRegionId: null,
      forecastMomentum: 0,
      links: [],
    } as const);
  const horizonConvergenceBandLog = appendHorizonConvergenceBandEvents(
    core.horizonConvergenceBandLog ?? emptyHorizonConvergenceBandLog(),
    core.horizonConvergenceSnapshot ?? null,
    horizonConvergenceOutlook,
    computed.turn
  );
  const researchExecutionOutlook =
    computed.researchExecutionOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      nationalExecutionScore: 0,
      projectedExecutionScore: 0,
      criticalRiskBranchCount: 0,
      convergenceMomentum: 0,
      links: [],
    } as const);
  const researchExecutionBandLog = appendResearchExecutionBandEvents(
    core.researchExecutionBandLog ?? emptyResearchExecutionBandLog(),
    core.researchExecutionSnapshot ?? null,
    researchExecutionOutlook,
    computed.turn
  );
  const strategicDeliveryOutlook =
    computed.strategicDeliveryOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      nationalDeliveryScore: 0,
      projectedDeliveryScore: 0,
      exportContinuityHeadroom: 0,
      executionMomentum: 0,
      links: [],
    } as const);
  const strategicDeliveryBandLog = appendStrategicDeliveryBandEvents(
    core.strategicDeliveryBandLog ?? emptyStrategicDeliveryBandLog(),
    core.strategicDeliverySnapshot ?? null,
    strategicDeliveryOutlook,
    computed.turn
  );
  const scaleWaveMaturityOutlook =
    computed.scaleWaveMaturityOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      nationalMaturityScore: 0,
      projectedMaturityScore: 0,
      synergyHeadroom: 0,
      deliveryMomentum: 0,
      tierFiveUnlockedCount: 0,
      links: [],
    } as const);
  const scaleWaveMaturityBandLog = appendScaleWaveMaturityBandEvents(
    core.scaleWaveMaturityBandLog ?? emptyScaleWaveMaturityBandLog(),
    core.scaleWaveMaturitySnapshot ?? null,
    scaleWaveMaturityOutlook,
    computed.turn
  );
  const nationalIntegrationOutlook =
    computed.nationalIntegrationOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      nationalIntegrationScore: 0,
      projectedIntegrationScore: 0,
      institutionIntegrationHeadroom: 0,
      maturityMomentum: 0,
      nationalIntegrationCount: 0,
      links: [],
    } as const);
  const nationalIntegrationBandLog = appendNationalIntegrationBandEvents(
    core.nationalIntegrationBandLog ?? emptyNationalIntegrationBandLog(),
    core.nationalIntegrationSnapshot ?? null,
    nationalIntegrationOutlook,
    computed.turn
  );
  const scaleWaveProjectionOutlook =
    computed.scaleWaveProjectionOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 18,
      projectionReadinessScore: 0,
      integrationBandHeadroom: 0,
      maturityBandHeadroom: 0,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const scaleWaveProjectionBandLog = appendScaleWaveProjectionBandEvents(
    core.scaleWaveProjectionBandLog ?? emptyScaleWaveProjectionBandLog(),
    core.scaleWaveProjectionSnapshot ?? null,
    scaleWaveProjectionOutlook,
    computed.turn
  );
  const trancheProjectionReadinessOutlook =
    computed.trancheProjectionReadinessOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 19,
      trancheReadinessScore: 0,
      projectionMomentum: 0,
      integrationBaselineShaHint: '7bd7b1f3',
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const trancheProjectionBandLog = appendTrancheProjectionBandEvents(
    core.trancheProjectionBandLog ?? emptyTrancheProjectionBandLog(),
    core.trancheProjectionSnapshot ?? null,
    trancheProjectionReadinessOutlook,
    computed.turn
  );
  const scaleWaveIntegrationGateOutlook =
    computed.scaleWaveIntegrationGateOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 20,
      integrationGateScore: 0,
      gateMomentum: 0,
      integrationBaselineShaHint: '680b9954',
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const integrationGateBandLog = appendIntegrationGateBandEvents(
    core.integrationGateBandLog ?? emptyIntegrationGateBandLog(),
    core.integrationGateSnapshot ?? null,
    scaleWaveIntegrationGateOutlook,
    computed.turn
  );
  const trancheDryRunHandoffOutlook =
    computed.trancheDryRunHandoffOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 21,
      handoffReadinessScore: 0,
      handoffMomentum: 0,
      integrationBaselineShaHint: '99f2e72b',
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const dryRunHandoffBandLog = appendDryRunHandoffBandEvents(
    core.dryRunHandoffBandLog ?? emptyDryRunHandoffBandLog(),
    core.dryRunHandoffSnapshot ?? null,
    trancheDryRunHandoffOutlook,
    computed.turn
  );
  const mergedIntegrationBaselineOutlook =
    computed.mergedIntegrationBaselineOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 22,
      mergedBaselineScore: 0,
      mergeMomentum: 0,
      integrationBaselineShaHint: '634656bb',
      priorBaselineHints: [],
      projectedFunctionalHint: 1_401_419,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const mergedIntegrationBaselineBandLog = appendMergedIntegrationBaselineBandEvents(
    core.mergedIntegrationBaselineBandLog ?? emptyMergedIntegrationBaselineBandLog(),
    core.mergedIntegrationBaselineSnapshot ?? null,
    mergedIntegrationBaselineOutlook,
    computed.turn
  );
  const scaleWavePostIntegrationDryRunOutlook =
    computed.scaleWavePostIntegrationDryRunOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 23,
      postIntegrationDryRunScore: 0,
      dryRunMomentum: 0,
      integrationBaselineShaHint: 'b23e1449',
      priorBaselineHints: [],
      projectedFunctionalHint: 1_448_902,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const postIntegrationDryRunBandLog = appendPostIntegrationDryRunBandEvents(
    core.postIntegrationDryRunBandLog ?? emptyPostIntegrationDryRunBandLog(),
    core.postIntegrationDryRunSnapshot ?? null,
    scaleWavePostIntegrationDryRunOutlook,
    computed.turn
  );
  const scaleWaveIntegrationSealOutlook =
    computed.scaleWaveIntegrationSealOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 24,
      integrationSealScore: 0,
      sealMomentum: 0,
      integrationBaselineShaHint: 'b64a7aa8',
      priorBaselineHints: [],
      projectedFunctionalHint: 1_487_095,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const integrationSealBandLog = appendIntegrationSealBandEvents(
    core.integrationSealBandLog ?? emptyIntegrationSealBandLog(),
    core.integrationSealSnapshot ?? null,
    scaleWaveIntegrationSealOutlook,
    computed.turn
  );
  const scaleWavePostSealHandoffOutlook =
    computed.scaleWavePostSealHandoffOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 25,
      postSealHandoffScore: 0,
      handoffMomentum: 0,
      integrationBaselineShaHint: '8d741ac7',
      priorBaselineHints: [],
      projectedFunctionalHint: 1_525_288,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const postSealHandoffBandLog = appendPostSealHandoffBandEvents(
    core.postSealHandoffBandLog ?? emptyPostSealHandoffBandLog(),
    core.postSealHandoffSnapshot ?? null,
    scaleWavePostSealHandoffOutlook,
    computed.turn
  );
  const scaleWaveIntegrationContinuityOutlook =
    computed.scaleWaveIntegrationContinuityOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 26,
      integrationContinuityScore: 0,
      continuityMomentum: 0,
      integrationBaselineShaHint: 'de3079f9',
      priorBaselineHints: [],
      projectedFunctionalHint: 1_563_481,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const integrationContinuityBandLog = appendIntegrationContinuityBandEvents(
    core.integrationContinuityBandLog ?? emptyIntegrationContinuityBandLog(),
    core.integrationContinuitySnapshot ?? null,
    scaleWaveIntegrationContinuityOutlook,
    computed.turn
  );
  const scaleWaveContinuityHandoffOutlook =
    computed.scaleWaveContinuityHandoffOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 27,
      continuityHandoffScore: 0,
      handoffMomentum: 0,
      integrationBaselineShaHint: '7c1cfd89',
      priorBaselineHints: [],
      projectedFunctionalHint: 1_601_674,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const continuityHandoffBandLog = appendContinuityHandoffBandEvents(
    core.continuityHandoffBandLog ?? emptyContinuityHandoffBandLog(),
    core.continuityHandoffSnapshot ?? null,
    scaleWaveContinuityHandoffOutlook,
    computed.turn
  );
  const scaleWaveHandoffIntegrationOutlook =
    computed.scaleWaveHandoffIntegrationOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 28,
      handoffIntegrationScore: 0,
      integrationMomentum: 0,
      integrationBaselineShaHint: 'b9e129bd',
      priorBaselineHints: [],
      projectedFunctionalHint: 1_645_538,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const handoffIntegrationBandLog = appendHandoffIntegrationBandEvents(
    core.handoffIntegrationBandLog ?? emptyHandoffIntegrationBandLog(),
    core.handoffIntegrationSnapshot ?? null,
    scaleWaveHandoffIntegrationOutlook,
    computed.turn
  );
  const scaleWaveHandoffIntegrationSealOutlook =
    computed.scaleWaveHandoffIntegrationSealOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 29,
      handoffIntegrationSealScore: 0,
      sealMomentum: 0,
      integrationBaselineShaHint: '70df4aee',
      priorBaselineHints: [],
      projectedFunctionalHint: 1_683_733,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const handoffIntegrationSealBandLog = appendHandoffIntegrationSealBandEvents(
    core.handoffIntegrationSealBandLog ?? emptyHandoffIntegrationSealBandLog(),
    core.handoffIntegrationSealSnapshot ?? null,
    scaleWaveHandoffIntegrationSealOutlook,
    computed.turn
  );
  const scaleWaveIntegrationSealHandoffOutlook =
    computed.scaleWaveIntegrationSealHandoffOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 30,
      integrationSealHandoffScore: 0,
      handoffMomentum: 0,
      integrationBaselineShaHint: '88fa570',
      priorBaselineHints: [],
      projectedFunctionalHint: 1_721_932,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const integrationSealHandoffBandLog = appendIntegrationSealHandoffBandEvents(
    core.integrationSealHandoffBandLog ?? emptyIntegrationSealHandoffBandLog(),
    core.integrationSealHandoffSnapshot ?? null,
    scaleWaveIntegrationSealHandoffOutlook,
    computed.turn
  );
  const scaleWaveSealHandoffContinuityOutlook =
    computed.scaleWaveSealHandoffContinuityOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 31,
      sealHandoffContinuityScore: 0,
      continuityMomentum: 0,
      integrationBaselineShaHint: '81b50b8',
      priorBaselineHints: [],
      projectedFunctionalHint: 1_760_131,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const sealHandoffContinuityBandLog = appendSealHandoffContinuityBandEvents(
    core.sealHandoffContinuityBandLog ?? emptySealHandoffContinuityBandLog(),
    core.sealHandoffContinuitySnapshot ?? null,
    scaleWaveSealHandoffContinuityOutlook,
    computed.turn
  );
  const scaleWaveSealHandoffIntegrationOutlook =
    computed.scaleWaveSealHandoffIntegrationOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 32,
      sealHandoffIntegrationScore: 0,
      integrationMomentum: 0,
      integrationBaselineShaHint: 'aa70dac',
      priorBaselineHints: [],
      projectedFunctionalHint: 1_798_330,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const sealHandoffIntegrationBandLog = appendSealHandoffIntegrationBandEvents(
    core.sealHandoffIntegrationBandLog ?? emptySealHandoffIntegrationBandLog(),
    core.sealHandoffIntegrationSnapshot ?? null,
    scaleWaveSealHandoffIntegrationOutlook,
    computed.turn
  );
  const scaleWaveSealHandoffIntegrationSealOutlook =
    computed.scaleWaveSealHandoffIntegrationSealOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 33,
      sealHandoffIntegrationSealScore: 0,
      sealMomentum: 0,
      integrationBaselineShaHint: 'c5f6d0b',
      priorBaselineHints: [],
      projectedFunctionalHint: 1_836_529,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const sealHandoffIntegrationSealBandLog = appendSealHandoffIntegrationSealBandEvents(
    core.sealHandoffIntegrationSealBandLog ?? emptySealHandoffIntegrationSealBandLog(),
    core.sealHandoffIntegrationSealSnapshot ?? null,
    scaleWaveSealHandoffIntegrationSealOutlook,
    computed.turn
  );
  const scaleWaveSealHandoffIntegrationSealContinuityOutlook =
    computed.scaleWaveSealHandoffIntegrationSealContinuityOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 34,
      sealHandoffIntegrationSealContinuityScore: 0,
      continuityMomentum: 0,
      integrationBaselineShaHint: '2187b54',
      priorBaselineHints: [],
      projectedFunctionalHint: 1_886_428,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const sealHandoffIntegrationSealContinuityBandLog = appendSealHandoffIntegrationSealContinuityBandEvents(
    core.sealHandoffIntegrationSealContinuityBandLog ?? emptySealHandoffIntegrationSealContinuityBandLog(),
    core.sealHandoffIntegrationSealContinuitySnapshot ?? null,
    scaleWaveSealHandoffIntegrationSealContinuityOutlook,
    computed.turn
  );
  const scaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook =
    computed.scaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 35,
      sealHandoffIntegrationSealContinuityHandoffScore: 0,
      handoffMomentum: 0,
      integrationBaselineShaHint: '1f7d25b',
      priorBaselineHints: [],
      projectedFunctionalHint: 1_924_628,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const sealHandoffIntegrationSealContinuityHandoffBandLog = appendSealHandoffIntegrationSealContinuityHandoffBandEvents(
    core.sealHandoffIntegrationSealContinuityHandoffBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffBandLog(),
    core.sealHandoffIntegrationSealContinuityHandoffSnapshot ?? null,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook,
    computed.turn
  );
  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook =
    computed.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 36,
      sealHandoffIntegrationSealContinuityHandoffIntegrationScore: 0,
      integrationMomentum: 0,
      integrationBaselineShaHint: 'ea2bb03',
      priorBaselineHints: [],
      projectedFunctionalHint: 1_962_828,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog = appendSealHandoffIntegrationSealContinuityHandoffIntegrationBandEvents(
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
    computed.turn
  );
  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook =
    computed.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 37,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealScore: 0,
      sealMomentum: 0,
      integrationBaselineShaHint: 'cfb4603',
      priorBaselineHints: [],
      projectedFunctionalHint: 2_001_028,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog = appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvents(
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
    computed.turn
  );
  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook =
    computed.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 38,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore: 0,
      continuityMomentum: 0,
      integrationBaselineShaHint: 'b44b36f',
      priorBaselineHints: [],
      projectedFunctionalHint: 2_039_227,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog = appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvents(
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot ?? null,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
    computed.turn
  );
  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook =
    computed.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 39,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffScore: 0,
      handoffMomentum: 0,
      integrationBaselineShaHint: '6134c6a',
      priorBaselineHints: [],
      projectedFunctionalHint: 2_077_426,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog = appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandEvents(
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog(),
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot ?? null,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook,
    computed.turn
  );
  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook =
    computed.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 40,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore: 0,
      integrationMomentum: 0,
      integrationBaselineShaHint: '6f7fa49',
      priorBaselineHints: [],
      projectedFunctionalHint: 2_115_625,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog = appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvents(
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot ?? null,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
    computed.turn
  );
  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook =
    computed.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 41,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealScore: 0,
      sealMomentum: 0,
      integrationBaselineShaHint: '875d6f3',
      priorBaselineHints: [],
      projectedFunctionalHint: 2_153_824,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog = appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandEvents(
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog(),
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
    computed.turn
  );
  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook =
    computed.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 42,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityScore: 0,
      continuityMomentum: 0,
      integrationBaselineShaHint: '431df5d',
      priorBaselineHints: [],
      projectedFunctionalHint: 2_207_543,
      dryRunEligible: false,
      ticketHint: null,
    } as const);

  const scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook =
    computed.scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook ??
    ({
      active: false,
      baseTurn: computed.turn,
      horizonTurns: 6,
      waveOrdinal: 44,
      sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationScore: 0,
      integrationMomentum: 0,
      integrationBaselineShaHint: 'bca7e0a3',
      priorBaselineHints: [],
      projectedFunctionalHint: 2_300_377,
      dryRunEligible: false,
      ticketHint: null,
    } as const);
  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog = appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandEvents(
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog(),
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot ?? null,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
    computed.turn
  );
  const sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog = appendSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandEvents(
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog ?? emptySealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog(),
    core.sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot ?? null,
    scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
    computed.turn
  );
  return {
    ...computed,
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: core.revision + (newUnlocks > 0 ? 1 : 0),
    turn: computed.turn,
    unlockedNodes,
    institutionUpgrades: mergedUpgrades,
    unlockSeq: Math.max(core.unlockSeq, unlockedNodes.length),
    branchEmphasis: core.branchEmphasis,
    emphasisRevision: core.emphasisRevision,
    migrationLog: core.migrationLog,
    saveKind: core.saveKind,
    updatedAtTurn: core.updatedAtTurn,
    sessionId: core.sessionId,
    persistRevision: core.persistRevision,
    unlockEventLog,
    lastReconciledAtTurn: core.lastReconciledAtTurn,
    emphasisChangeLog: core.emphasisChangeLog,
    institutionTierSnapshot: computeInstitutionTierSnapshot(mergedUpgrades, computed.turn),
    readinessMilestoneLog: appendReadinessMilestoneEvents(
      core.readinessMilestoneLog ?? emptyReadinessMilestoneLog(),
      core.readinessBranchSnapshot ?? null,
      computed.readinessByBranch,
      computed.turn
    ),
    readinessBranchSnapshot: computeReadinessBranchSnapshot(computed.readinessByBranch, computed.turn),
    integrationRiskLog,
    integrationRiskSnapshot: computeIntegrationRiskSnapshot(integrationRiskOutlook, computed.turn),
    scaleWaveSnapshot: computeScaleWaveSnapshot(computed.scaleWave, computed.turn),
    synergyThresholdLog,
    synergySnapshot: computeSynergySnapshot(synergyOutlook, computed.turn),
    commercializationMilestoneLog,
    commercializationSnapshot: computeCommercializationSnapshot(commercialization, computed.turn),
    diffusionIntegrationLog,
    diffusionIntegrationSnapshot: computeDiffusionIntegrationSnapshot(
      computed.diffusion,
      computed.leadingResearchRegion,
      computed.turn
    ),
    portfolioBalanceLog,
    portfolioBalanceSnapshot: computePortfolioBalanceSnapshot(portfolioBalance, computed.turn),
    diffusionForecastBandLog,
    diffusionForecastSnapshot: computeDiffusionForecastSnapshot(diffusionForecast, computed.turn),
    horizonConvergenceBandLog,
    horizonConvergenceSnapshot: computeHorizonConvergenceSnapshot(horizonConvergenceOutlook, computed.turn),
    researchExecutionBandLog,
    researchExecutionSnapshot: computeResearchExecutionSnapshot(researchExecutionOutlook, computed.turn),
    strategicDeliveryBandLog,
    strategicDeliverySnapshot: computeStrategicDeliverySnapshot(strategicDeliveryOutlook, computed.turn),
    scaleWaveMaturityBandLog,
    scaleWaveMaturitySnapshot: computeScaleWaveMaturitySnapshot(scaleWaveMaturityOutlook, computed.turn),
    nationalIntegrationBandLog,
    nationalIntegrationSnapshot: computeNationalIntegrationSnapshot(nationalIntegrationOutlook, computed.turn),
    scaleWaveProjectionBandLog,
    scaleWaveProjectionSnapshot: computeScaleWaveProjectionSnapshot(scaleWaveProjectionOutlook, computed.turn),
    trancheProjectionBandLog,
    trancheProjectionSnapshot: computeTrancheProjectionSnapshot(trancheProjectionReadinessOutlook, computed.turn),
    integrationGateBandLog,
    integrationGateSnapshot: computeIntegrationGateSnapshot(scaleWaveIntegrationGateOutlook, computed.turn),
    dryRunHandoffBandLog,
    dryRunHandoffSnapshot: computeDryRunHandoffSnapshot(trancheDryRunHandoffOutlook, computed.turn),
    mergedIntegrationBaselineBandLog,
    mergedIntegrationBaselineSnapshot: computeMergedIntegrationBaselineSnapshot(
      mergedIntegrationBaselineOutlook,
      computed.turn
    ),
    postIntegrationDryRunBandLog,
    postIntegrationDryRunSnapshot: computePostIntegrationDryRunSnapshot(
      scaleWavePostIntegrationDryRunOutlook,
      computed.turn
    ),
    integrationSealBandLog,
    integrationSealSnapshot: computeIntegrationSealSnapshot(
      scaleWaveIntegrationSealOutlook,
      computed.turn
    ),
    postSealHandoffBandLog,
    postSealHandoffSnapshot: computePostSealHandoffSnapshot(
      scaleWavePostSealHandoffOutlook,
      computed.turn
    ),
    integrationContinuityBandLog,
    integrationContinuitySnapshot: computeIntegrationContinuitySnapshot(
      scaleWaveIntegrationContinuityOutlook,
      computed.turn
    ),
    continuityHandoffBandLog,
    continuityHandoffSnapshot: computeContinuityHandoffSnapshot(
      scaleWaveContinuityHandoffOutlook,
      computed.turn
    ),
    handoffIntegrationBandLog,
    handoffIntegrationSnapshot: computeHandoffIntegrationSnapshot(
      scaleWaveHandoffIntegrationOutlook,
      computed.turn
    ),
    handoffIntegrationSealBandLog,
    handoffIntegrationSealSnapshot: computeHandoffIntegrationSealSnapshot(
      scaleWaveHandoffIntegrationSealOutlook,
      computed.turn
    ),
    integrationSealHandoffBandLog,
    integrationSealHandoffSnapshot: computeIntegrationSealHandoffSnapshot(
      scaleWaveIntegrationSealHandoffOutlook,
      computed.turn
    ),
    sealHandoffContinuityBandLog,
    sealHandoffContinuitySnapshot: computeSealHandoffContinuitySnapshot(
      scaleWaveSealHandoffContinuityOutlook,
      computed.turn
    ),
    sealHandoffIntegrationBandLog,
    sealHandoffIntegrationSnapshot: computeSealHandoffIntegrationSnapshot(
      scaleWaveSealHandoffIntegrationOutlook,
      computed.turn
    ),
    sealHandoffIntegrationSealBandLog,
    sealHandoffIntegrationSealSnapshot: computeSealHandoffIntegrationSealSnapshot(
      scaleWaveSealHandoffIntegrationSealOutlook,
      computed.turn
    ),
    sealHandoffIntegrationSealContinuityBandLog,
    sealHandoffIntegrationSealContinuitySnapshot: computeSealHandoffIntegrationSealContinuitySnapshot(
      scaleWaveSealHandoffIntegrationSealContinuityOutlook,
      computed.turn
    ),
    sealHandoffIntegrationSealContinuityHandoffBandLog,
    sealHandoffIntegrationSealContinuityHandoffSnapshot: computeSealHandoffIntegrationSealContinuityHandoffSnapshot(
      scaleWaveSealHandoffIntegrationSealContinuityHandoffOutlook,
      computed.turn
    ),
    sealHandoffIntegrationSealContinuityHandoffIntegrationBandLog,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: computeSealHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
      computed.turn
    ),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
      computed.turn
    ),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot(
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
      computed.turn
    ),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffBandLog,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot: computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffSnapshot(
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffOutlook,
      computed.turn
    ),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationBandLog,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot: computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSnapshot(
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationOutlook,
      computed.turn
    ),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealBandLog,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot: computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealSnapshot(
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealOutlook,
      computed.turn
    ),
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityBandLog,
    sealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot: computeSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuitySnapshot(
      scaleWaveSealHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityHandoffIntegrationSealContinuityOutlook,
      computed.turn
    ),
  };
}

export function detectForeignSaveFields(raw: unknown): string[] {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return [];
  const o = raw as Record<string, unknown>;
  return RESEARCH_SAVE_DERIVED_KEYS.filter(k => k in o);
}

export function validatePersistedCoreForWrite(core: ResearchProgressPersistedCore): string[] {
  const issues: string[] = [];
  if (core.schemaVersion !== RESEARCH_PROGRESS_SCHEMA_VERSION) {
    issues.push(`schema must be ${RESEARCH_PROGRESS_SCHEMA_VERSION}`);
  }
  const { coreFingerprint, ...rest } = core;
  if (coreFingerprint !== computePersistedCoreFingerprint(rest)) {
    issues.push('coreFingerprint mismatch');
  }
  if ((core.unlockSeq ?? 0) < core.unlockedNodes.length) {
    issues.push('unlockSeq behind unlockedNodes length');
  }
  return issues;
}

export function setResearchBranchEmphasisOnCore(
  core: ResearchProgressPersistedCore,
  branchId: ResearchBranchId,
  emphasis: ResearchProgramEmphasis,
  turn: number
): ResearchProgressPersistedCore {
  const branchEmphasis = core.branchEmphasis.map(e =>
    e.branchId === branchId ? { ...e, emphasis, setTurn: turn } : e
  );
  const prev = core.branchEmphasis.find(e => e.branchId === branchId);
  const nextRevision = core.emphasisRevision + 1;
  const emphasisChangeLog = appendEmphasisChangeEvent(
    core.emphasisChangeLog ?? emptyEmphasisChangeLog(),
    branchId,
    prev?.emphasis ?? 'fundamental',
    emphasis,
    turn,
    nextRevision
  );
  return finalizeCoreForPersist({
    ...core,
    branchEmphasis,
    emphasisRevision: nextRevision,
    turn: Math.max(core.turn, turn),
    emphasisChangeLog,
  });
}

export function sanitizeResearchProgressPersisted(raw: unknown): ResearchProgressState | null {
  const core = migrateResearchProgressSave(raw);
  return hydrateResearchProgressCore(core);
}

export function assertResearchProgressSaveIntegrity(state: ResearchProgressState): string[] {
  const issues: string[] = [];
  if (
    state.schemaVersion !== RESEARCH_PROGRESS_SCHEMA_VERSION &&
    state.schemaVersion !== LEGACY_V6 &&
    state.schemaVersion !== LEGACY_V7 &&
    state.schemaVersion !== LEGACY_V8 &&
    state.schemaVersion !== LEGACY_V9 &&
    state.schemaVersion !== LEGACY_V10 &&
    state.schemaVersion !== LEGACY_V11 &&
    state.schemaVersion !== LEGACY_V12 &&
    state.schemaVersion !== LEGACY_V13 &&
    state.schemaVersion !== LEGACY_V14 &&
    state.schemaVersion !== LEGACY_V15 &&
    state.schemaVersion !== LEGACY_V16 &&
    state.schemaVersion !== LEGACY_V5 &&
    state.schemaVersion !== LEGACY_V3 &&
    state.schemaVersion !== LEGACY_V4 &&
    state.schemaVersion !== LEGACY_V1 &&
    state.schemaVersion !== LEGACY_V2
  ) {
    issues.push(`unexpected schema ${state.schemaVersion}`);
  }
  if ((state.unlockSeq ?? 0) < state.unlockedNodes.length) {
    issues.push('unlockSeq behind unlockedNodes length');
  }
  for (const id of state.unlockedNodes.map(u => u.nodeId)) {
    if (!RESEARCH_NODE_BY_ID[id]) issues.push(`unknown node ${id}`);
  }
  const readinessKeys = Object.keys(state.readinessByBranch ?? {});
  if (readinessKeys.length && readinessKeys.length !== RESEARCH_BRANCHES.length) {
    issues.push('readinessByBranch incomplete');
  }
  for (const cell of state.diffusion ?? []) {
    if (!V94_REGION_CODES.includes(cell.regionId)) issues.push(`bad region ${cell.regionId}`);
  }
  return issues;
}

export function applyBranchEmphasisReadinessBonus(
  readinessByBranch: Record<ResearchBranchId, number>,
  emphasis: ResearchBranchEmphasisState[]
): Record<ResearchBranchId, number> {
  const out = { ...readinessByBranch };
  for (const e of emphasis) {
    out[e.branchId] = Math.min(100, (out[e.branchId] ?? 0) + (e.emphasis === 'sovereign' ? 2 : 1));
  }
  return out;
}
