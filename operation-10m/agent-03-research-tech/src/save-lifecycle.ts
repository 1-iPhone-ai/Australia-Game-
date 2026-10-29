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
} from './types.ts';
import { RESEARCH_PROGRESS_SCHEMA_VERSION } from './types.ts';
import { RESEARCH_UNLOCK_EVENT_LOG_CAP } from './unlock-event-log.ts';
import { RESEARCH_EMPHASIS_CHANGE_LOG_CAP } from './emphasis-change-log.ts';
import { computeInstitutionTierSnapshot, mergeInstitutionTierSnapshots } from './institution-tier-snapshot.ts';
import { RESEARCH_READINESS_MILESTONE_LOG_CAP } from './readiness-milestone-log.ts';
import { mergeReadinessBranchSnapshots } from './readiness-branch-snapshot.ts';
import { RESEARCH_INTEGRATION_RISK_LOG_CAP } from './integration-risk-log.ts';
import { RESEARCH_SYNERGY_THRESHOLD_LOG_CAP } from './synergy-threshold-log.ts';
import { mergeIntegrationRiskSnapshots } from './integration-risk-snapshot.ts';
import { mergeScaleWaveSnapshots } from './scale-wave-snapshot.ts';
import { mergeSynergySnapshots } from './synergy-snapshot.ts';

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
