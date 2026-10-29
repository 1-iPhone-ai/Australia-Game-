import type { ResearchProgressPersistedCore } from './save-migration.ts';
import {
  computePersistedCoreFingerprint,
  extractPersistedCore,
  finalizePersistedCoreDraft,
  migrateResearchProgressSave,
  prepareResearchProgressForSave,
} from './save-migration.ts';
import type { ResearchProgressState } from './types.ts';
import { RESEARCH_PROGRESS_SCHEMA_VERSION } from './types.ts';

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
    const persist = sealResearchProgressForSave(prepareResearchProgressForSave(computed), {
      turn: ctx.turn,
      saveKind: 'manual',
    });
    return { state: { ...computed, migrationLog: persist.migrationLog }, persist };
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
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
  };

  const persist = sealResearchProgressForSave(extractPersistedCore(mergedState), {
    turn: ctx.turn,
    saveKind: mergedCore.saveKind,
    sessionId: mergedCore.sessionId,
  });
  return { state: mergedState, persist };
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
