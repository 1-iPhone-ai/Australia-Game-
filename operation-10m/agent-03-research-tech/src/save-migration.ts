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
} from './types.ts';
import { RESEARCH_PROGRESS_SCHEMA_VERSION } from './types.ts';
import { appendUnlockEvents, rebuildUnlockEventLogFromNodes, emptyUnlockEventLog } from './unlock-event-log.ts';
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
}

export type { ResearchSaveMigrationEntry } from './types.ts';

const LEGACY_V1 = 'op10m-agent03-v1' as const;
const LEGACY_V2 = 'op10m-agent03-v2' as const;
const LEGACY_V3 = 'op10m-agent03-v3' as const;
const LEGACY_V4 = 'op10m-agent03-v4' as const;

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

export function migrateResearchProgressSave(raw: unknown): ResearchProgressPersistedCore | null {
  if (raw == null) return null;
  if (typeof raw !== 'object') return null;

  const o = raw as Record<string, unknown>;
  const ver = o.schemaVersion as ResearchProgressSchemaVersion | undefined;

  if (ver === RESEARCH_PROGRESS_SCHEMA_VERSION) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    const eventLog = sanitizeUnlockEventLog(o.unlockEventLog);
    const draft = finalizeCoreForPersist({
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
      unlockEventLog: eventLog.length ? eventLog : rebuildUnlockEventLogFromNodes(nodes),
      lastReconciledAtTurn: Number(o.lastReconciledAtTurn) || Number(o.turn) || 0,
    });
    if (typeof o.coreFingerprint === 'string' && o.coreFingerprint !== draft.coreFingerprint) {
      return draft;
    }
    return draft;
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
  return finalizeCoreForPersist({
    ...core,
    branchEmphasis,
    emphasisRevision: core.emphasisRevision + 1,
    turn: Math.max(core.turn, turn),
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
