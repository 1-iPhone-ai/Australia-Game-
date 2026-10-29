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
  UnlockedResearchNode,
} from './types.ts';
import { RESEARCH_PROGRESS_SCHEMA_VERSION } from './types.ts';
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
}

const LEGACY_V1 = 'op10m-agent03-v1' as const;

export function emptyResearchProgressCore(turn = 0): ResearchProgressPersistedCore {
  return emptyCore(turn);
}

function emptyCore(turn = 0): ResearchProgressPersistedCore {
  return {
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: 0,
    turn,
    unlockedNodes: [],
    institutionUpgrades: [],
    leadingResearchRegion: null,
    unlockSeq: 0,
    branchEmphasis: defaultBranchEmphasis(),
  };
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

export function migrateResearchProgressSave(raw: unknown): ResearchProgressPersistedCore | null {
  if (raw == null) return null;
  if (typeof raw !== 'object') return null;

  const o = raw as Record<string, unknown>;
  const ver = o.schemaVersion as ResearchProgressSchemaVersion | undefined;

  if (ver === RESEARCH_PROGRESS_SCHEMA_VERSION) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    return {
      schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
      revision: Number(o.revision) || 0,
      turn: Number(o.turn) || 0,
      unlockedNodes: nodes,
      institutionUpgrades: sanitizeInstitutionUpgrades(o.institutionUpgrades),
      leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
      unlockSeq: Number(o.unlockSeq) || computeUnlockSeq(nodes),
      branchEmphasis: sanitizeBranchEmphasis(o.branchEmphasis),
    };
  }

  if (ver === LEGACY_V1) {
    const nodes = sanitizeUnlockedNodes(o.unlockedNodes);
    return {
      schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
      revision: 1,
      turn: Number(o.turn) || 0,
      unlockedNodes: nodes,
      institutionUpgrades: sanitizeInstitutionUpgrades(o.institutionUpgrades),
      leadingResearchRegion: (o.leadingResearchRegion as ResearchProgressPersistedCore['leadingResearchRegion']) ?? null,
      unlockSeq: computeUnlockSeq(nodes),
      branchEmphasis: defaultBranchEmphasis(),
    };
  }

  if (Array.isArray(raw)) {
    const nodes = sanitizeUnlockedNodes(raw);
    return { ...emptyCore(0), revision: 1, unlockedNodes: nodes, unlockSeq: computeUnlockSeq(nodes) };
  }

  return null;
}

export function extractPersistedCore(state: ResearchProgressState): ResearchProgressPersistedCore {
  return {
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: state.revision ?? 0,
    turn: state.turn,
    unlockedNodes: state.unlockedNodes,
    institutionUpgrades: state.institutionUpgrades,
    leadingResearchRegion: state.leadingResearchRegion,
    unlockSeq: state.unlockSeq ?? computeUnlockSeq(state.unlockedNodes),
    branchEmphasis: state.branchEmphasis ?? defaultBranchEmphasis(),
  };
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
  return {
    ...computed,
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: core.revision + (newUnlocks > 0 ? 1 : 0),
    turn: computed.turn,
    unlockedNodes,
    institutionUpgrades: mergedUpgrades,
    unlockSeq: Math.max(core.unlockSeq, unlockedNodes.length),
    branchEmphasis: core.branchEmphasis,
  };
}

export function sanitizeResearchProgressPersisted(raw: unknown): ResearchProgressState | null {
  const core = migrateResearchProgressSave(raw);
  return hydrateResearchProgressCore(core);
}

export function assertResearchProgressSaveIntegrity(state: ResearchProgressState): string[] {
  const issues: string[] = [];
  if (state.schemaVersion !== RESEARCH_PROGRESS_SCHEMA_VERSION && state.schemaVersion !== LEGACY_V1) {
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
