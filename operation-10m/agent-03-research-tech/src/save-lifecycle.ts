import type { ResearchProgressPersistedCore } from './save-migration.ts';
import {
  computePersistedCoreFingerprint,
  extractPersistedCore,
  finalizePersistedCoreDraft,
  migrateResearchProgressSave,
  prepareResearchProgressForSave,
} from './save-migration.ts';
import type {
  ResearchProgressState,
  ResearchUnlockEvent,
  ResearchEmphasisChangeEvent,
  ResearchReadinessMilestoneEvent,
  ResearchIntegrationRiskEvent,
  ResearchSynergyThresholdEvent,
  ResearchCommercializationMilestoneEvent,
  ResearchDiffusionIntegrationMilestoneEvent,
  ResearchPortfolioBalanceBandEvent,
  ResearchDiffusionForecastBandEvent,
  ResearchHorizonConvergenceBandEvent,
  ResearchExecutionBandEvent,
  ResearchStrategicDeliveryBandEvent,
  ResearchScaleWaveMaturityBandEvent,
  ResearchNationalIntegrationBandEvent,
  ResearchScaleWaveProjectionBandEvent,
  ResearchTrancheProjectionBandEvent,
  ResearchScaleWaveIntegrationGateBandEvent,
  ResearchTrancheDryRunHandoffBandEvent,
  ResearchMergedIntegrationBaselineBandEvent,
  ResearchScaleWavePostIntegrationDryRunBandEvent,
  ResearchScaleWaveIntegrationSealBandEvent,
  ResearchScaleWavePostSealHandoffBandEvent,
  ResearchScaleWaveIntegrationContinuityBandEvent,
  ResearchScaleWaveContinuityHandoffBandEvent,
  ResearchScaleWaveHandoffIntegrationBandEvent,
} from './types.ts';
import { RESEARCH_PROGRESS_SCHEMA_VERSION } from './types.ts';
import { RESEARCH_UNLOCK_EVENT_LOG_CAP } from './unlock-event-log.ts';
import { RESEARCH_EMPHASIS_CHANGE_LOG_CAP } from './emphasis-change-log.ts';
import { computeInstitutionTierSnapshot, mergeInstitutionTierSnapshots } from './institution-tier-snapshot.ts';
import { RESEARCH_READINESS_MILESTONE_LOG_CAP } from './readiness-milestone-log.ts';
import { mergeReadinessBranchSnapshots } from './readiness-branch-snapshot.ts';
import { RESEARCH_INTEGRATION_RISK_LOG_CAP } from './integration-risk-log.ts';
import { RESEARCH_SYNERGY_THRESHOLD_LOG_CAP } from './synergy-threshold-log.ts';
import { RESEARCH_COMMERCIALIZATION_MILESTONE_LOG_CAP } from './commercialization-milestone-log.ts';
import { RESEARCH_DIFFUSION_INTEGRATION_LOG_CAP } from './diffusion-integration-log.ts';
import { RESEARCH_PORTFOLIO_BALANCE_LOG_CAP } from './portfolio-balance-log.ts';
import { RESEARCH_DIFFUSION_FORECAST_BAND_LOG_CAP } from './diffusion-forecast-band-log.ts';
import { RESEARCH_HORIZON_CONVERGENCE_BAND_LOG_CAP } from './horizon-convergence-band-log.ts';
import { RESEARCH_EXECUTION_BAND_LOG_CAP } from './research-execution-band-log.ts';
import { RESEARCH_STRATEGIC_DELIVERY_BAND_LOG_CAP } from './strategic-delivery-band-log.ts';
import { RESEARCH_SCALE_WAVE_MATURITY_BAND_LOG_CAP } from './scale-wave-maturity-band-log.ts';
import { RESEARCH_NATIONAL_INTEGRATION_BAND_LOG_CAP } from './national-integration-band-log.ts';
import { RESEARCH_SCALE_WAVE_PROJECTION_BAND_LOG_CAP } from './scale-wave-projection-band-log.ts';
import { RESEARCH_TRANCHE_PROJECTION_BAND_LOG_CAP } from './tranche-projection-band-log.ts';
import { RESEARCH_INTEGRATION_GATE_BAND_LOG_CAP } from './scale-wave-integration-gate-band-log.ts';
import { RESEARCH_DRY_RUN_HANDOFF_BAND_LOG_CAP } from './tranche-dry-run-handoff-band-log.ts';
import { mergeIntegrationRiskSnapshots } from './integration-risk-snapshot.ts';
import { mergeScaleWaveSnapshots } from './scale-wave-snapshot.ts';
import { mergeSynergySnapshots } from './synergy-snapshot.ts';
import { mergeCommercializationSnapshots } from './commercialization-snapshot.ts';
import { mergeDiffusionIntegrationSnapshots } from './diffusion-integration-snapshot.ts';
import { mergePortfolioBalanceSnapshots } from './portfolio-balance-snapshot.ts';
import { mergeDiffusionForecastSnapshots } from './diffusion-forecast-snapshot.ts';
import { mergeHorizonConvergenceSnapshots } from './horizon-convergence-snapshot.ts';
import { mergeResearchExecutionSnapshots } from './research-execution-snapshot.ts';
import { mergeStrategicDeliverySnapshots } from './strategic-delivery-snapshot.ts';
import { mergeScaleWaveMaturitySnapshots } from './scale-wave-maturity-snapshot.ts';
import { mergeNationalIntegrationSnapshots } from './national-integration-snapshot.ts';
import { mergeScaleWaveProjectionSnapshots } from './scale-wave-projection-snapshot.ts';
import { mergeTrancheProjectionSnapshots } from './tranche-projection-snapshot.ts';
import { mergeIntegrationGateSnapshots } from './scale-wave-integration-gate-snapshot.ts';
import { mergeDryRunHandoffSnapshots } from './tranche-dry-run-handoff-snapshot.ts';
import {
  mergeMergedIntegrationBaselineSnapshots,
} from './merged-integration-baseline-snapshot.ts';
import { RESEARCH_MERGED_INTEGRATION_BASELINE_BAND_LOG_CAP } from './merged-integration-baseline-band-log.ts';
import { mergePostIntegrationDryRunSnapshots } from './post-integration-dry-run-snapshot.ts';
import { RESEARCH_POST_INTEGRATION_DRY_RUN_BAND_LOG_CAP } from './post-integration-dry-run-band-log.ts';
import { mergeIntegrationSealSnapshots } from './scale-wave-integration-seal-snapshot.ts';
import { RESEARCH_INTEGRATION_SEAL_BAND_LOG_CAP } from './scale-wave-integration-seal-band-log.ts';
import { mergePostSealHandoffSnapshots } from './scale-wave-post-seal-handoff-snapshot.ts';
import { RESEARCH_POST_SEAL_HANDOFF_BAND_LOG_CAP } from './scale-wave-post-seal-handoff-band-log.ts';
import { mergeIntegrationContinuitySnapshots } from './scale-wave-integration-continuity-snapshot.ts';
import { RESEARCH_INTEGRATION_CONTINUITY_BAND_LOG_CAP } from './scale-wave-integration-continuity-band-log.ts';
import { mergeContinuityHandoffSnapshots } from './scale-wave-continuity-handoff-snapshot.ts';
import { RESEARCH_CONTINUITY_HANDOFF_BAND_LOG_CAP } from './scale-wave-continuity-handoff-band-log.ts';
import { mergeHandoffIntegrationSnapshots } from './scale-wave-handoff-integration-snapshot.ts';
import { RESEARCH_HANDOFF_INTEGRATION_BAND_LOG_CAP } from './scale-wave-handoff-integration-band-log.ts';

export type ResearchSaveKind = 'manual' | 'autosave' | 'checkpoint';

export interface ResearchPersistedCoreDiff {
  path: string;
  before: unknown;
  after: unknown;
}

export interface ResearchReconcileContext {
  turn: number;
  /** When loading autosave behind manual checkpoint, prefer higher persistRevision. */
  preferHigherPersistRevision?: boolean;
}

function mergeUnlockEventLogs(
  local: ResearchUnlockEvent[] | undefined,
  remote: ResearchUnlockEvent[] | undefined
): ResearchUnlockEvent[] {
  const byKey = new Map<string, ResearchUnlockEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.nodeId}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq || a.nodeId.localeCompare(b.nodeId)).slice(-RESEARCH_UNLOCK_EVENT_LOG_CAP);
}

function mergeEmphasisChangeLogs(
  local: ResearchEmphasisChangeEvent[] | undefined,
  remote: ResearchEmphasisChangeEvent[] | undefined
): ResearchEmphasisChangeEvent[] {
  const byKey = new Map<string, ResearchEmphasisChangeEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.branchId}:${ev.emphasisRevision}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_EMPHASIS_CHANGE_LOG_CAP);
}

function mergeReadinessMilestoneLogs(
  local: ResearchReadinessMilestoneEvent[] | undefined,
  remote: ResearchReadinessMilestoneEvent[] | undefined
): ResearchReadinessMilestoneEvent[] {
  const byKey = new Map<string, ResearchReadinessMilestoneEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.branchId}:${ev.milestone}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_READINESS_MILESTONE_LOG_CAP);
}

function mergeIntegrationRiskLogs(
  local: ResearchIntegrationRiskEvent[] | undefined,
  remote: ResearchIntegrationRiskEvent[] | undefined
): ResearchIntegrationRiskEvent[] {
  const byKey = new Map<string, ResearchIntegrationRiskEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_INTEGRATION_RISK_LOG_CAP);
}

function mergeSynergyThresholdLogs(
  local: ResearchSynergyThresholdEvent[] | undefined,
  remote: ResearchSynergyThresholdEvent[] | undefined
): ResearchSynergyThresholdEvent[] {
  const byKey = new Map<string, ResearchSynergyThresholdEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.threshold}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SYNERGY_THRESHOLD_LOG_CAP);
}

function mergeCommercializationMilestoneLogs(
  local: ResearchCommercializationMilestoneEvent[] | undefined,
  remote: ResearchCommercializationMilestoneEvent[] | undefined
): ResearchCommercializationMilestoneEvent[] {
  const byKey = new Map<string, ResearchCommercializationMilestoneEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.milestone}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_COMMERCIALIZATION_MILESTONE_LOG_CAP);
}

function mergeDiffusionIntegrationLogs(
  local: ResearchDiffusionIntegrationMilestoneEvent[] | undefined,
  remote: ResearchDiffusionIntegrationMilestoneEvent[] | undefined
): ResearchDiffusionIntegrationMilestoneEvent[] {
  const byKey = new Map<string, ResearchDiffusionIntegrationMilestoneEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.milestone}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_DIFFUSION_INTEGRATION_LOG_CAP);
}

function mergePortfolioBalanceLogs(
  local: ResearchPortfolioBalanceBandEvent[] | undefined,
  remote: ResearchPortfolioBalanceBandEvent[] | undefined
): ResearchPortfolioBalanceBandEvent[] {
  const byKey = new Map<string, ResearchPortfolioBalanceBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_PORTFOLIO_BALANCE_LOG_CAP);
}

function mergeDiffusionForecastBandLogs(
  local: ResearchDiffusionForecastBandEvent[] | undefined,
  remote: ResearchDiffusionForecastBandEvent[] | undefined
): ResearchDiffusionForecastBandEvent[] {
  const byKey = new Map<string, ResearchDiffusionForecastBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_DIFFUSION_FORECAST_BAND_LOG_CAP);
}

function mergeHorizonConvergenceBandLogs(
  local: ResearchHorizonConvergenceBandEvent[] | undefined,
  remote: ResearchHorizonConvergenceBandEvent[] | undefined
): ResearchHorizonConvergenceBandEvent[] {
  const byKey = new Map<string, ResearchHorizonConvergenceBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_HORIZON_CONVERGENCE_BAND_LOG_CAP);
}

function mergeResearchExecutionBandLogs(
  local: ResearchExecutionBandEvent[] | undefined,
  remote: ResearchExecutionBandEvent[] | undefined
): ResearchExecutionBandEvent[] {
  const byKey = new Map<string, ResearchExecutionBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_EXECUTION_BAND_LOG_CAP);
}

function mergeStrategicDeliveryBandLogs(
  local: ResearchStrategicDeliveryBandEvent[] | undefined,
  remote: ResearchStrategicDeliveryBandEvent[] | undefined
): ResearchStrategicDeliveryBandEvent[] {
  const byKey = new Map<string, ResearchStrategicDeliveryBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_STRATEGIC_DELIVERY_BAND_LOG_CAP);
}

function mergeScaleWaveMaturityBandLogs(
  local: ResearchScaleWaveMaturityBandEvent[] | undefined,
  remote: ResearchScaleWaveMaturityBandEvent[] | undefined
): ResearchScaleWaveMaturityBandEvent[] {
  const byKey = new Map<string, ResearchScaleWaveMaturityBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SCALE_WAVE_MATURITY_BAND_LOG_CAP);
}

function mergeNationalIntegrationBandLogs(
  local: ResearchNationalIntegrationBandEvent[] | undefined,
  remote: ResearchNationalIntegrationBandEvent[] | undefined
): ResearchNationalIntegrationBandEvent[] {
  const byKey = new Map<string, ResearchNationalIntegrationBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_NATIONAL_INTEGRATION_BAND_LOG_CAP);
}

function mergeScaleWaveProjectionBandLogs(
  local: ResearchScaleWaveProjectionBandEvent[] | undefined,
  remote: ResearchScaleWaveProjectionBandEvent[] | undefined
): ResearchScaleWaveProjectionBandEvent[] {
  const byKey = new Map<string, ResearchScaleWaveProjectionBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_SCALE_WAVE_PROJECTION_BAND_LOG_CAP);
}

function mergeTrancheProjectionBandLogs(
  local: ResearchTrancheProjectionBandEvent[] | undefined,
  remote: ResearchTrancheProjectionBandEvent[] | undefined
): ResearchTrancheProjectionBandEvent[] {
  const byKey = new Map<string, ResearchTrancheProjectionBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_TRANCHE_PROJECTION_BAND_LOG_CAP);
}

function mergeIntegrationGateBandLogs(
  local: ResearchScaleWaveIntegrationGateBandEvent[] | undefined,
  remote: ResearchScaleWaveIntegrationGateBandEvent[] | undefined
): ResearchScaleWaveIntegrationGateBandEvent[] {
  const byKey = new Map<string, ResearchScaleWaveIntegrationGateBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_INTEGRATION_GATE_BAND_LOG_CAP);
}

function mergeDryRunHandoffBandLogs(
  local: ResearchTrancheDryRunHandoffBandEvent[] | undefined,
  remote: ResearchTrancheDryRunHandoffBandEvent[] | undefined
): ResearchTrancheDryRunHandoffBandEvent[] {
  const byKey = new Map<string, ResearchTrancheDryRunHandoffBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_DRY_RUN_HANDOFF_BAND_LOG_CAP);
}

function mergeMergedIntegrationBaselineBandLogs(
  local: ResearchMergedIntegrationBaselineBandEvent[] | undefined,
  remote: ResearchMergedIntegrationBaselineBandEvent[] | undefined
): ResearchMergedIntegrationBaselineBandEvent[] {
  const byKey = new Map<string, ResearchMergedIntegrationBaselineBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_MERGED_INTEGRATION_BASELINE_BAND_LOG_CAP);
}

function mergePostIntegrationDryRunBandLogs(
  local: ResearchScaleWavePostIntegrationDryRunBandEvent[] | undefined,
  remote: ResearchScaleWavePostIntegrationDryRunBandEvent[] | undefined
): ResearchScaleWavePostIntegrationDryRunBandEvent[] {
  const byKey = new Map<string, ResearchScaleWavePostIntegrationDryRunBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_POST_INTEGRATION_DRY_RUN_BAND_LOG_CAP);
}

function mergeIntegrationSealBandLogs(
  local: ResearchScaleWaveIntegrationSealBandEvent[] | undefined,
  remote: ResearchScaleWaveIntegrationSealBandEvent[] | undefined
): ResearchScaleWaveIntegrationSealBandEvent[] {
  const byKey = new Map<string, ResearchScaleWaveIntegrationSealBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_INTEGRATION_SEAL_BAND_LOG_CAP);
}

function mergePostSealHandoffBandLogs(
  local: ResearchScaleWavePostSealHandoffBandEvent[] | undefined,
  remote: ResearchScaleWavePostSealHandoffBandEvent[] | undefined
): ResearchScaleWavePostSealHandoffBandEvent[] {
  const byKey = new Map<string, ResearchScaleWavePostSealHandoffBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_POST_SEAL_HANDOFF_BAND_LOG_CAP);
}

function mergeIntegrationContinuityBandLogs(
  local: ResearchScaleWaveIntegrationContinuityBandEvent[] | undefined,
  remote: ResearchScaleWaveIntegrationContinuityBandEvent[] | undefined
): ResearchScaleWaveIntegrationContinuityBandEvent[] {
  const byKey = new Map<string, ResearchScaleWaveIntegrationContinuityBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_INTEGRATION_CONTINUITY_BAND_LOG_CAP);
}

function mergeContinuityHandoffBandLogs(
  local: ResearchScaleWaveContinuityHandoffBandEvent[] | undefined,
  remote: ResearchScaleWaveContinuityHandoffBandEvent[] | undefined
): ResearchScaleWaveContinuityHandoffBandEvent[] {
  const byKey = new Map<string, ResearchScaleWaveContinuityHandoffBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_CONTINUITY_HANDOFF_BAND_LOG_CAP);
}

function mergeHandoffIntegrationBandLogs(
  local: ResearchScaleWaveHandoffIntegrationBandEvent[] | undefined,
  remote: ResearchScaleWaveHandoffIntegrationBandEvent[] | undefined
): ResearchScaleWaveHandoffIntegrationBandEvent[] {
  const byKey = new Map<string, ResearchScaleWaveHandoffIntegrationBandEvent>();
  for (const ev of [...(local ?? []), ...(remote ?? [])]) {
    const key = `${ev.seq}:${ev.band}:${ev.phase}`;
    byKey.set(key, ev);
  }
  return [...byKey.values()].sort((a, b) => a.seq - b.seq).slice(-RESEARCH_HANDOFF_INTEGRATION_BAND_LOG_CAP);
}

function stableCoreSnapshot(core: ResearchProgressPersistedCore): Record<string, unknown> {
  const { coreFingerprint, ...rest } = core;
  void coreFingerprint;
  return rest as Record<string, unknown>;
}

export function diffResearchPersistedCore(
  before: ResearchProgressPersistedCore,
  after: ResearchProgressPersistedCore
): ResearchPersistedCoreDiff[] {
  const diffs: ResearchPersistedCoreDiff[] = [];
  const keys = new Set([...Object.keys(stableCoreSnapshot(before)), ...Object.keys(stableCoreSnapshot(after))]);
  for (const key of [...keys].sort()) {
    const a = (stableCoreSnapshot(before) as Record<string, unknown>)[key];
    const b = (stableCoreSnapshot(after) as Record<string, unknown>)[key];
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      diffs.push({ path: key, before: a, after: b });
    }
  }
  return diffs;
}

export function sealResearchProgressForSave(
  core: ResearchProgressPersistedCore,
  opts: { saveKind?: ResearchSaveKind; turn?: number; sessionId?: string } = {}
): ResearchProgressPersistedCore {
  const turn = opts.turn ?? core.turn;
  const saveKind = opts.saveKind ?? core.saveKind ?? 'manual';
  const sessionId =
    opts.sessionId ??
    core.sessionId ??
    `o10m_r03_${turn}_${core.revision}_${core.emphasisRevision}`;
  return finalizePersistedCoreDraft({
    ...core,
    saveKind,
    updatedAtTurn: turn,
    sessionId,
    persistRevision: (core.persistRevision ?? 0) + 1,
    turn: Math.max(core.turn, turn),
    institutionTierSnapshot: computeInstitutionTierSnapshot(core.institutionUpgrades, Math.max(core.turn, turn)),
    readinessBranchSnapshot: core.readinessBranchSnapshot,
  });
}

export function mergeResearchPersistedCores(
  local: ResearchProgressPersistedCore,
  remote: ResearchProgressPersistedCore
): ResearchProgressPersistedCore {
  const pick =
    (remote.persistRevision ?? 0) > (local.persistRevision ?? 0)
      ? remote
      : (local.persistRevision ?? 0) > (remote.persistRevision ?? 0)
        ? local
        : remote.updatedAtTurn >= local.updatedAtTurn
          ? remote
          : local;

  const unlockById = new Map<string, (typeof local.unlockedNodes)[number]>();
  for (const u of [...local.unlockedNodes, ...remote.unlockedNodes]) {
    const prev = unlockById.get(u.nodeId);
    if (!prev || u.unlockedTurn >= prev.unlockedTurn) unlockById.set(u.nodeId, u);
  }
  const unlockedNodes = [...unlockById.values()].sort(
    (a, b) => a.unlockedTurn - b.unlockedTurn || a.nodeId.localeCompare(b.nodeId)
  );

  const instById = new Map<string, (typeof local.institutionUpgrades)[number]>();
  for (const u of [...local.institutionUpgrades, ...remote.institutionUpgrades]) {
    instById.set(u.institutionId, u);
  }

  return finalizePersistedCoreDraft({
    ...pick,
    unlockedNodes,
    institutionUpgrades: [...instById.values()],
    unlockSeq: Math.max(local.unlockSeq, remote.unlockSeq, unlockedNodes.length),
    revision: Math.max(local.revision, remote.revision),
    emphasisRevision: Math.max(local.emphasisRevision, remote.emphasisRevision),
    migrationLog: [...(local.migrationLog ?? []), ...(remote.migrationLog ?? [])].slice(-32),
    unlockEventLog: mergeUnlockEventLogs(local.unlockEventLog, remote.unlockEventLog),
    emphasisChangeLog: mergeEmphasisChangeLogs(local.emphasisChangeLog, remote.emphasisChangeLog),
    institutionTierSnapshot: mergeInstitutionTierSnapshots(
      local.institutionTierSnapshot ?? undefined,
      remote.institutionTierSnapshot ?? undefined
    ) ?? computeInstitutionTierSnapshot([...instById.values()], pick.turn),
    readinessMilestoneLog: mergeReadinessMilestoneLogs(local.readinessMilestoneLog, remote.readinessMilestoneLog),
    readinessBranchSnapshot:
      mergeReadinessBranchSnapshots(
        local.readinessBranchSnapshot ?? undefined,
        remote.readinessBranchSnapshot ?? undefined
      ) ?? null,
    integrationRiskLog: mergeIntegrationRiskLogs(local.integrationRiskLog, remote.integrationRiskLog),
    integrationRiskSnapshot:
      mergeIntegrationRiskSnapshots(
        local.integrationRiskSnapshot ?? undefined,
        remote.integrationRiskSnapshot ?? undefined
      ) ?? null,
    scaleWaveSnapshot:
      mergeScaleWaveSnapshots(local.scaleWaveSnapshot ?? undefined, remote.scaleWaveSnapshot ?? undefined) ?? null,
    synergyThresholdLog: mergeSynergyThresholdLogs(local.synergyThresholdLog, remote.synergyThresholdLog),
    synergySnapshot:
      mergeSynergySnapshots(local.synergySnapshot ?? undefined, remote.synergySnapshot ?? undefined) ?? null,
    commercializationMilestoneLog: mergeCommercializationMilestoneLogs(
      local.commercializationMilestoneLog,
      remote.commercializationMilestoneLog
    ),
    commercializationSnapshot:
      mergeCommercializationSnapshots(
        local.commercializationSnapshot ?? undefined,
        remote.commercializationSnapshot ?? undefined
      ) ?? null,
    diffusionIntegrationLog: mergeDiffusionIntegrationLogs(
      local.diffusionIntegrationLog,
      remote.diffusionIntegrationLog
    ),
    diffusionIntegrationSnapshot:
      mergeDiffusionIntegrationSnapshots(
        local.diffusionIntegrationSnapshot ?? undefined,
        remote.diffusionIntegrationSnapshot ?? undefined
      ) ?? null,
    portfolioBalanceLog: mergePortfolioBalanceLogs(local.portfolioBalanceLog, remote.portfolioBalanceLog),
    portfolioBalanceSnapshot:
      mergePortfolioBalanceSnapshots(
        local.portfolioBalanceSnapshot ?? undefined,
        remote.portfolioBalanceSnapshot ?? undefined
      ) ?? null,
    diffusionForecastBandLog: mergeDiffusionForecastBandLogs(
      local.diffusionForecastBandLog,
      remote.diffusionForecastBandLog
    ),
    diffusionForecastSnapshot:
      mergeDiffusionForecastSnapshots(
        local.diffusionForecastSnapshot ?? undefined,
        remote.diffusionForecastSnapshot ?? undefined
      ) ?? null,
    horizonConvergenceBandLog: mergeHorizonConvergenceBandLogs(
      local.horizonConvergenceBandLog,
      remote.horizonConvergenceBandLog
    ),
    horizonConvergenceSnapshot:
      mergeHorizonConvergenceSnapshots(
        local.horizonConvergenceSnapshot ?? undefined,
        remote.horizonConvergenceSnapshot ?? undefined
      ) ?? null,
    researchExecutionBandLog: mergeResearchExecutionBandLogs(
      local.researchExecutionBandLog,
      remote.researchExecutionBandLog
    ),
    researchExecutionSnapshot:
      mergeResearchExecutionSnapshots(
        local.researchExecutionSnapshot ?? undefined,
        remote.researchExecutionSnapshot ?? undefined
      ) ?? null,
    strategicDeliveryBandLog: mergeStrategicDeliveryBandLogs(
      local.strategicDeliveryBandLog,
      remote.strategicDeliveryBandLog
    ),
    strategicDeliverySnapshot:
      mergeStrategicDeliverySnapshots(
        local.strategicDeliverySnapshot ?? undefined,
        remote.strategicDeliverySnapshot ?? undefined
      ) ?? null,
    scaleWaveMaturityBandLog: mergeScaleWaveMaturityBandLogs(
      local.scaleWaveMaturityBandLog,
      remote.scaleWaveMaturityBandLog
    ),
    scaleWaveMaturitySnapshot:
      mergeScaleWaveMaturitySnapshots(
        local.scaleWaveMaturitySnapshot ?? undefined,
        remote.scaleWaveMaturitySnapshot ?? undefined
      ) ?? null,
    nationalIntegrationBandLog: mergeNationalIntegrationBandLogs(
      local.nationalIntegrationBandLog,
      remote.nationalIntegrationBandLog
    ),
    nationalIntegrationSnapshot:
      mergeNationalIntegrationSnapshots(
        local.nationalIntegrationSnapshot ?? undefined,
        remote.nationalIntegrationSnapshot ?? undefined
      ) ?? null,
    scaleWaveProjectionBandLog: mergeScaleWaveProjectionBandLogs(
      local.scaleWaveProjectionBandLog,
      remote.scaleWaveProjectionBandLog
    ),
    scaleWaveProjectionSnapshot:
      mergeScaleWaveProjectionSnapshots(
        local.scaleWaveProjectionSnapshot ?? undefined,
        remote.scaleWaveProjectionSnapshot ?? undefined
      ) ?? null,
    trancheProjectionBandLog: mergeTrancheProjectionBandLogs(
      local.trancheProjectionBandLog,
      remote.trancheProjectionBandLog
    ),
    trancheProjectionSnapshot:
      mergeTrancheProjectionSnapshots(
        local.trancheProjectionSnapshot ?? undefined,
        remote.trancheProjectionSnapshot ?? undefined
      ) ?? null,
    integrationGateBandLog: mergeIntegrationGateBandLogs(
      local.integrationGateBandLog,
      remote.integrationGateBandLog
    ),
    integrationGateSnapshot:
      mergeIntegrationGateSnapshots(
        local.integrationGateSnapshot ?? undefined,
        remote.integrationGateSnapshot ?? undefined
      ) ?? null,
    dryRunHandoffBandLog: mergeDryRunHandoffBandLogs(
      local.dryRunHandoffBandLog,
      remote.dryRunHandoffBandLog
    ),
    dryRunHandoffSnapshot:
      mergeDryRunHandoffSnapshots(
        local.dryRunHandoffSnapshot ?? undefined,
        remote.dryRunHandoffSnapshot ?? undefined
      ) ?? null,
    mergedIntegrationBaselineBandLog: mergeMergedIntegrationBaselineBandLogs(
      local.mergedIntegrationBaselineBandLog,
      remote.mergedIntegrationBaselineBandLog
    ),
    mergedIntegrationBaselineSnapshot:
      mergeMergedIntegrationBaselineSnapshots(
        local.mergedIntegrationBaselineSnapshot ?? undefined,
        remote.mergedIntegrationBaselineSnapshot ?? undefined
      ) ?? null,
    postIntegrationDryRunBandLog: mergePostIntegrationDryRunBandLogs(
      local.postIntegrationDryRunBandLog,
      remote.postIntegrationDryRunBandLog
    ),
    postIntegrationDryRunSnapshot:
      mergePostIntegrationDryRunSnapshots(
        local.postIntegrationDryRunSnapshot ?? undefined,
        remote.postIntegrationDryRunSnapshot ?? undefined
      ) ?? null,
    integrationSealBandLog: mergeIntegrationSealBandLogs(
      local.integrationSealBandLog,
      remote.integrationSealBandLog
    ),
    integrationSealSnapshot:
      mergeIntegrationSealSnapshots(
        local.integrationSealSnapshot ?? undefined,
        remote.integrationSealSnapshot ?? undefined
      ) ?? null,
    postSealHandoffBandLog: mergePostSealHandoffBandLogs(
      local.postSealHandoffBandLog,
      remote.postSealHandoffBandLog
    ),
    postSealHandoffSnapshot:
      mergePostSealHandoffSnapshots(
        local.postSealHandoffSnapshot ?? undefined,
        remote.postSealHandoffSnapshot ?? undefined
      ) ?? null,
    integrationContinuityBandLog: mergeIntegrationContinuityBandLogs(
      local.integrationContinuityBandLog,
      remote.integrationContinuityBandLog
    ),
    integrationContinuitySnapshot:
      mergeIntegrationContinuitySnapshots(
        local.integrationContinuitySnapshot ?? undefined,
        remote.integrationContinuitySnapshot ?? undefined
      ) ?? null,
    continuityHandoffBandLog: mergeContinuityHandoffBandLogs(
      local.continuityHandoffBandLog,
      remote.continuityHandoffBandLog
    ),
    continuityHandoffSnapshot:
      mergeContinuityHandoffSnapshots(
        local.continuityHandoffSnapshot ?? undefined,
        remote.continuityHandoffSnapshot ?? undefined
      ) ?? null,
    handoffIntegrationBandLog: mergeHandoffIntegrationBandLogs(
      local.handoffIntegrationBandLog,
      remote.handoffIntegrationBandLog
    ),
    handoffIntegrationSnapshot:
      mergeHandoffIntegrationSnapshots(
        local.handoffIntegrationSnapshot ?? undefined,
        remote.handoffIntegrationSnapshot ?? undefined
      ) ?? null,
    lastReconciledAtTurn: Math.max(local.lastReconciledAtTurn ?? 0, remote.lastReconciledAtTurn ?? 0),
  });
}

export function reconcileResearchProgressOnLoad(
  ctx: ResearchReconcileContext,
  diskRaw: unknown,
  computed: ResearchProgressState
): { state: ResearchProgressState; persist: ResearchProgressPersistedCore } {
  const diskCore = migrateResearchProgressSave(diskRaw);
  const computedCore = extractPersistedCore(computed);
  if (!diskCore) {
    const persist = sealResearchProgressForSave(
      { ...prepareResearchProgressForSave(computed), lastReconciledAtTurn: ctx.turn },
      {
        turn: ctx.turn,
        saveKind: 'manual',
      }
    );
    return {
      state: {
        ...computed,
        migrationLog: persist.migrationLog,
        lastReconciledAtTurn: persist.lastReconciledAtTurn,
        unlockEventLog: persist.unlockEventLog,
        emphasisChangeLog: persist.emphasisChangeLog,
        institutionTierSnapshot: persist.institutionTierSnapshot,
        readinessMilestoneLog: persist.readinessMilestoneLog,
        readinessBranchSnapshot: persist.readinessBranchSnapshot,
        integrationRiskLog: persist.integrationRiskLog,
        integrationRiskSnapshot: persist.integrationRiskSnapshot,
        scaleWaveSnapshot: persist.scaleWaveSnapshot,
        synergyThresholdLog: persist.synergyThresholdLog,
        synergySnapshot: persist.synergySnapshot,
        commercializationMilestoneLog: persist.commercializationMilestoneLog,
        commercializationSnapshot: persist.commercializationSnapshot,
        diffusionIntegrationLog: persist.diffusionIntegrationLog,
        diffusionIntegrationSnapshot: persist.diffusionIntegrationSnapshot,
        portfolioBalanceLog: persist.portfolioBalanceLog,
        portfolioBalanceSnapshot: persist.portfolioBalanceSnapshot,
        diffusionForecastBandLog: persist.diffusionForecastBandLog,
        diffusionForecastSnapshot: persist.diffusionForecastSnapshot,
        horizonConvergenceBandLog: persist.horizonConvergenceBandLog,
        horizonConvergenceSnapshot: persist.horizonConvergenceSnapshot,
        researchExecutionBandLog: persist.researchExecutionBandLog,
        researchExecutionSnapshot: persist.researchExecutionSnapshot,
        strategicDeliveryBandLog: persist.strategicDeliveryBandLog,
        strategicDeliverySnapshot: persist.strategicDeliverySnapshot,
        scaleWaveMaturityBandLog: persist.scaleWaveMaturityBandLog,
        scaleWaveMaturitySnapshot: persist.scaleWaveMaturitySnapshot,
        nationalIntegrationBandLog: persist.nationalIntegrationBandLog,
        nationalIntegrationSnapshot: persist.nationalIntegrationSnapshot,
        scaleWaveProjectionBandLog: persist.scaleWaveProjectionBandLog,
        scaleWaveProjectionSnapshot: persist.scaleWaveProjectionSnapshot,
        trancheProjectionBandLog: persist.trancheProjectionBandLog,
        trancheProjectionSnapshot: persist.trancheProjectionSnapshot,
        integrationGateBandLog: persist.integrationGateBandLog,
        integrationGateSnapshot: persist.integrationGateSnapshot,
        dryRunHandoffBandLog: persist.dryRunHandoffBandLog,
        dryRunHandoffSnapshot: persist.dryRunHandoffSnapshot,
        mergedIntegrationBaselineBandLog: persist.mergedIntegrationBaselineBandLog,
        mergedIntegrationBaselineSnapshot: persist.mergedIntegrationBaselineSnapshot,
        postIntegrationDryRunBandLog: persist.postIntegrationDryRunBandLog,
        postIntegrationDryRunSnapshot: persist.postIntegrationDryRunSnapshot,
        integrationSealBandLog: persist.integrationSealBandLog,
        integrationSealSnapshot: persist.integrationSealSnapshot,
        postSealHandoffBandLog: persist.postSealHandoffBandLog,
        postSealHandoffSnapshot: persist.postSealHandoffSnapshot,
        integrationContinuityBandLog: persist.integrationContinuityBandLog,
        integrationContinuitySnapshot: persist.integrationContinuitySnapshot,
        continuityHandoffBandLog: persist.continuityHandoffBandLog,
        continuityHandoffSnapshot: persist.continuityHandoffSnapshot,
        handoffIntegrationBandLog: persist.handoffIntegrationBandLog,
        handoffIntegrationSnapshot: persist.handoffIntegrationSnapshot,
      },
      persist,
    };
  }

  const mergedCore = mergeResearchPersistedCores(diskCore, computedCore);
  const mergedState: ResearchProgressState = {
    ...computed,
    revision: mergedCore.revision,
    turn: Math.max(computed.turn, mergedCore.turn, ctx.turn),
    unlockedNodes: mergedCore.unlockedNodes,
    institutionUpgrades: mergedCore.institutionUpgrades,
    unlockSeq: mergedCore.unlockSeq,
    branchEmphasis: mergedCore.branchEmphasis,
    emphasisRevision: mergedCore.emphasisRevision,
    migrationLog: mergedCore.migrationLog,
    unlockEventLog: mergedCore.unlockEventLog,
    emphasisChangeLog: mergedCore.emphasisChangeLog,
    institutionTierSnapshot: mergedCore.institutionTierSnapshot,
    readinessMilestoneLog: mergedCore.readinessMilestoneLog,
    readinessBranchSnapshot: mergedCore.readinessBranchSnapshot,
    integrationRiskLog: mergedCore.integrationRiskLog,
    integrationRiskSnapshot: mergedCore.integrationRiskSnapshot,
    scaleWaveSnapshot: mergedCore.scaleWaveSnapshot,
    synergyThresholdLog: mergedCore.synergyThresholdLog,
    synergySnapshot: mergedCore.synergySnapshot,
    commercializationMilestoneLog: mergedCore.commercializationMilestoneLog,
    commercializationSnapshot: mergedCore.commercializationSnapshot,
    diffusionIntegrationLog: mergedCore.diffusionIntegrationLog,
    diffusionIntegrationSnapshot: mergedCore.diffusionIntegrationSnapshot,
    portfolioBalanceLog: mergedCore.portfolioBalanceLog,
    portfolioBalanceSnapshot: mergedCore.portfolioBalanceSnapshot,
    diffusionForecastBandLog: mergedCore.diffusionForecastBandLog,
    diffusionForecastSnapshot: mergedCore.diffusionForecastSnapshot,
    horizonConvergenceBandLog: mergedCore.horizonConvergenceBandLog,
    horizonConvergenceSnapshot: mergedCore.horizonConvergenceSnapshot,
    researchExecutionBandLog: mergedCore.researchExecutionBandLog,
    researchExecutionSnapshot: mergedCore.researchExecutionSnapshot,
    strategicDeliveryBandLog: mergedCore.strategicDeliveryBandLog,
    strategicDeliverySnapshot: mergedCore.strategicDeliverySnapshot,
    scaleWaveMaturityBandLog: mergedCore.scaleWaveMaturityBandLog,
    scaleWaveMaturitySnapshot: mergedCore.scaleWaveMaturitySnapshot,
    nationalIntegrationBandLog: mergedCore.nationalIntegrationBandLog,
    nationalIntegrationSnapshot: mergedCore.nationalIntegrationSnapshot,
    scaleWaveProjectionBandLog: mergedCore.scaleWaveProjectionBandLog,
    scaleWaveProjectionSnapshot: mergedCore.scaleWaveProjectionSnapshot,
    trancheProjectionBandLog: mergedCore.trancheProjectionBandLog,
    trancheProjectionSnapshot: mergedCore.trancheProjectionSnapshot,
    integrationGateBandLog: mergedCore.integrationGateBandLog,
    integrationGateSnapshot: mergedCore.integrationGateSnapshot,
    dryRunHandoffBandLog: mergedCore.dryRunHandoffBandLog,
    dryRunHandoffSnapshot: mergedCore.dryRunHandoffSnapshot,
    mergedIntegrationBaselineBandLog: mergedCore.mergedIntegrationBaselineBandLog,
    mergedIntegrationBaselineSnapshot: mergedCore.mergedIntegrationBaselineSnapshot,
    postIntegrationDryRunBandLog: mergedCore.postIntegrationDryRunBandLog,
    postIntegrationDryRunSnapshot: mergedCore.postIntegrationDryRunSnapshot,
    integrationSealBandLog: mergedCore.integrationSealBandLog,
    integrationSealSnapshot: mergedCore.integrationSealSnapshot,
    postSealHandoffBandLog: mergedCore.postSealHandoffBandLog,
    postSealHandoffSnapshot: mergedCore.postSealHandoffSnapshot,
    integrationContinuityBandLog: mergedCore.integrationContinuityBandLog,
    integrationContinuitySnapshot: mergedCore.integrationContinuitySnapshot,
    continuityHandoffBandLog: mergedCore.continuityHandoffBandLog,
    continuityHandoffSnapshot: mergedCore.continuityHandoffSnapshot,
    handoffIntegrationBandLog: mergedCore.handoffIntegrationBandLog,
    handoffIntegrationSnapshot: mergedCore.handoffIntegrationSnapshot,
    lastReconciledAtTurn: ctx.turn,
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
  };

  const persist = sealResearchProgressForSave(
    { ...extractPersistedCore(mergedState), lastReconciledAtTurn: ctx.turn },
    {
      turn: ctx.turn,
      saveKind: mergedCore.saveKind,
      sessionId: mergedCore.sessionId,
    }
  );
  return {
    state: {
      ...mergedState,
      persistRevision: persist.persistRevision,
      lastReconciledAtTurn: persist.lastReconciledAtTurn,
      unlockEventLog: persist.unlockEventLog,
      emphasisChangeLog: persist.emphasisChangeLog,
      institutionTierSnapshot: persist.institutionTierSnapshot,
      readinessMilestoneLog: persist.readinessMilestoneLog,
      readinessBranchSnapshot: persist.readinessBranchSnapshot,
      integrationRiskLog: persist.integrationRiskLog,
      integrationRiskSnapshot: persist.integrationRiskSnapshot,
      scaleWaveSnapshot: persist.scaleWaveSnapshot,
      synergyThresholdLog: persist.synergyThresholdLog,
      synergySnapshot: persist.synergySnapshot,
      commercializationMilestoneLog: persist.commercializationMilestoneLog,
      commercializationSnapshot: persist.commercializationSnapshot,
      diffusionIntegrationLog: persist.diffusionIntegrationLog,
      diffusionIntegrationSnapshot: persist.diffusionIntegrationSnapshot,
      portfolioBalanceLog: persist.portfolioBalanceLog,
      portfolioBalanceSnapshot: persist.portfolioBalanceSnapshot,
      diffusionForecastBandLog: persist.diffusionForecastBandLog,
      diffusionForecastSnapshot: persist.diffusionForecastSnapshot,
      horizonConvergenceBandLog: persist.horizonConvergenceBandLog,
      horizonConvergenceSnapshot: persist.horizonConvergenceSnapshot,
      researchExecutionBandLog: persist.researchExecutionBandLog,
      researchExecutionSnapshot: persist.researchExecutionSnapshot,
      strategicDeliveryBandLog: persist.strategicDeliveryBandLog,
      strategicDeliverySnapshot: persist.strategicDeliverySnapshot,
      scaleWaveMaturityBandLog: persist.scaleWaveMaturityBandLog,
      scaleWaveMaturitySnapshot: persist.scaleWaveMaturitySnapshot,
      nationalIntegrationBandLog: persist.nationalIntegrationBandLog,
      nationalIntegrationSnapshot: persist.nationalIntegrationSnapshot,
      scaleWaveProjectionBandLog: persist.scaleWaveProjectionBandLog,
      scaleWaveProjectionSnapshot: persist.scaleWaveProjectionSnapshot,
      trancheProjectionBandLog: persist.trancheProjectionBandLog,
      trancheProjectionSnapshot: persist.trancheProjectionSnapshot,
      integrationGateBandLog: persist.integrationGateBandLog,
      integrationGateSnapshot: persist.integrationGateSnapshot,
      dryRunHandoffBandLog: persist.dryRunHandoffBandLog,
      dryRunHandoffSnapshot: persist.dryRunHandoffSnapshot,
      mergedIntegrationBaselineBandLog: persist.mergedIntegrationBaselineBandLog,
      mergedIntegrationBaselineSnapshot: persist.mergedIntegrationBaselineSnapshot,
      postIntegrationDryRunBandLog: persist.postIntegrationDryRunBandLog,
      postIntegrationDryRunSnapshot: persist.postIntegrationDryRunSnapshot,
      integrationSealBandLog: persist.integrationSealBandLog,
      integrationSealSnapshot: persist.integrationSealSnapshot,
      postSealHandoffBandLog: persist.postSealHandoffBandLog,
      postSealHandoffSnapshot: persist.postSealHandoffSnapshot,
      integrationContinuityBandLog: persist.integrationContinuityBandLog,
      integrationContinuitySnapshot: persist.integrationContinuitySnapshot,
      continuityHandoffBandLog: persist.continuityHandoffBandLog,
      continuityHandoffSnapshot: persist.continuityHandoffSnapshot,
      handoffIntegrationBandLog: persist.handoffIntegrationBandLog,
      handoffIntegrationSnapshot: persist.handoffIntegrationSnapshot,
    },
    persist,
  };
}

export function exportResearchProgressCheckpointJson(core: ResearchProgressPersistedCore): string {
  const sealed = sealResearchProgressForSave(core, { saveKind: 'checkpoint' });
  const { coreFingerprint, ...rest } = sealed;
  return JSON.stringify(
    {
      module: 'agent-03-research-tech',
      schemaVersion: sealed.schemaVersion,
      exportedTurn: sealed.updatedAtTurn,
      core: sealed,
      fingerprint: computePersistedCoreFingerprint(rest),
    },
    null,
    2
  );
}

export function importResearchProgressCheckpointJson(raw: string): ResearchProgressPersistedCore | null {
  try {
    const parsed = JSON.parse(raw) as { core?: unknown };
    return migrateResearchProgressSave(parsed.core ?? parsed);
  } catch {
    return null;
  }
}
