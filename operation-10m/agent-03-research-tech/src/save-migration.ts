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

function snapshotFromUpgrades(
  upgrades: InstitutionUpgradeState[],
  turn: number
): ResearchInstitutionTierSnapshot {
  return computeInstitutionTierSnapshot(upgrades, turn);
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
    });
    if (typeof o.coreFingerprint === 'string' && o.coreFingerprint !== draft.coreFingerprint) {
      return draft;
    }
    return draft;
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
