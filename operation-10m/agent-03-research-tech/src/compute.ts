import { RESEARCH_BRANCHES, RESEARCH_BRANCH_NODES, RESEARCH_NODE_BY_ID } from './branches.ts';
import { computeRegionalDiffusion, pickLeadingResearchRegion } from './diffusion.ts';
import { computeInstitutionUpgrades, institutionUpgradesById, INSTITUTION_UPGRADE_TIER_RANK } from './institution-upgrades.ts';
import { applyLateGameDiffusionCascade } from './late-game-diffusion.ts';
import {
  applyScaleWaveReadinessBonus,
  computeResearchScaleWaveReport,
  scaleWaveDiffusionBonus,
} from './scale-wave.ts';
import { branchNodeTopologicalOrder, evaluateNodePrerequisites } from './prerequisites.ts';
import { resolveActiveStrategyHooks, STRATEGY_HOOK_BY_ID } from './strategy-hooks.ts';
import {
  applyBranchEmphasisReadinessBonus,
  defaultBranchEmphasis,
  emptyResearchProgressCore,
  extractPersistedCore,
  mergeComputedResearchState,
  prepareResearchProgressForSave,
  sanitizeResearchProgressPersisted,
} from './save-migration.ts';
import { RESEARCH_INSTITUTIONS } from './institutions.ts';
import { RESEARCH_PROGRESS_SCHEMA_VERSION } from './types.ts';
import type {
  InstitutionUpgradeState,
  ResearchBranchId,
  ResearchProgressInputs,
  ResearchProgressState,
  UnlockedResearchNode,
} from './types.ts';
import { V94_REGION_CODES } from './v94-ids.ts';

export function researchInputHash(inputs: ResearchProgressInputs): string {
  let h = 2166136261 >>> 0;
  const mix = (s: string) => {
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
  };
  mix(`t${inputs.turn}`);
  inputs.regions.forEach(r => {
    mix(r.code);
    Object.keys(r.sectors)
      .sort()
      .forEach(k => mix(`${k}:${Math.round(Number(r.sectors[k as keyof typeof r.sectors] ?? 0) / 5)}`));
  });
  Object.keys(inputs.capabilities)
    .sort()
    .forEach(k => {
      const c = inputs.capabilities[k as keyof typeof inputs.capabilities];
      if (c) mix(`cap:${k}:${c.maturity}:${c.activeRegionIds.join(',')}`);
    });
  inputs.projects.forEach(p => mix(`${p.id}:${p.status}:${p.projectType}`));
  inputs.completedContracts.forEach(c => mix(`cc:${c.contractType}`));
  Object.keys(inputs.megaprojects)
    .sort()
    .forEach(k => {
      const m = inputs.megaprojects[k as keyof typeof inputs.megaprojects];
      if (m) mix(`mp:${k}:${m.completedStages}:${m.status}`);
    });
  Object.keys(inputs.factionStanding)
    .sort()
    .forEach(k => mix(`fs:${k}:${inputs.factionStanding[k as keyof typeof inputs.factionStanding]}`));
  return h.toString(36);
}

function computeBranchReadiness(
  inputs: ResearchProgressInputs,
  branchId: ResearchBranchId,
  institutionUpgrades: InstitutionUpgradeState[]
): number {
  const upgrades = institutionUpgradesById(institutionUpgrades);
  const branch = RESEARCH_BRANCHES.find(b => b.id === branchId);
  if (!branch) return 0;

  let score = 0;
  for (const anchor of branch.anchorRegions) {
    const region = inputs.regions.find(r => r.code === anchor);
    if (!region) continue;
    for (const sec of branch.sectors) {
      score += Number(region.sectors[sec] ?? 0) * 0.15;
    }
  }

  const cap = inputs.capabilities[branch.primaryCapability];
  if (cap) {
    score += { unavailable: 0, emerging: 12, demonstrated: 22, operational: 32, scaled: 42, nationally_integrated: 52 }[
      cap.maturity
    ];
  }

  for (const inst of RESEARCH_INSTITUTIONS) {
    if (!inst.supportedBranches.includes(branchId)) continue;
    const standing = inputs.factionStanding[inst.id as keyof typeof inputs.factionStanding] ?? 0;
    const upgrade = upgrades[inst.id];
    if (standing >= inst.minStanding) {
      score += inst.readinessBonus * (upgrade?.readinessMultiplier ?? 1);
    }
  }

  return Math.round(Math.min(100, score));
}

function inferAnchorRegion(inputs: ResearchProgressInputs, branchId: ResearchBranchId): string | null {
  const branch = RESEARCH_BRANCHES.find(b => b.id === branchId);
  if (!branch) return null;
  let best: { code: string; score: number } | null = null;
  for (const code of branch.anchorRegions) {
    const region = inputs.regions.find(r => r.code === code);
    if (!region) continue;
    let s = 0;
    branch.sectors.forEach(sec => {
      s += Number(region.sectors[sec] ?? 0);
    });
    if (!best || s > best.score) best = { code, score: s };
  }
  return best?.code ?? branch.anchorRegions[0] ?? null;
}

export function createEmptyResearchProgressState(turn = 0): ResearchProgressState {
  const readinessByBranch = Object.fromEntries(RESEARCH_BRANCHES.map(b => [b.id, 0])) as Record<
    ResearchBranchId,
    number
  >;
  return {
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: 0,
    turn,
    unlockedNodes: [],
    diffusion: V94_REGION_CODES.map(regionId => ({
      regionId,
      score: 0,
      level: 'latent',
      sourceNodeIds: [],
    })),
    readinessByBranch,
    activeHookIds: [],
    leadingResearchRegion: null,
    inputHash: '',
    institutionUpgrades: [],
    lateGameDiffusion: null,
    scaleWave: null,
    unlockSeq: 0,
    branchEmphasis: defaultBranchEmphasis(),
    emphasisRevision: 0,
    migrationLog: [],
  };
}

export function computeResearchProgress(
  inputs: ResearchProgressInputs,
  previous: ResearchProgressState | null
): ResearchProgressState {
  const coreBase = previous ? extractPersistedCore(previous) : emptyResearchProgressCore(inputs.turn);
  const unlockedMap = new Map<string, UnlockedResearchNode>();
  (previous?.unlockedNodes ?? []).forEach(u => unlockedMap.set(u.nodeId, u));

  const unlockedIds = () => new Set(unlockedMap.keys());

  for (const branch of RESEARCH_BRANCHES) {
    const order = branchNodeTopologicalOrder(branch.id);
    for (const nodeId of order) {
      if (unlockedMap.has(nodeId)) continue;
      const evalResult = evaluateNodePrerequisites(inputs, nodeId, unlockedIds());
      if (!evalResult.satisfied) continue;
      const def = RESEARCH_NODE_BY_ID[nodeId];
      unlockedMap.set(nodeId, {
        nodeId,
        branchId: def.branchId,
        unlockedTurn: inputs.turn,
        anchorRegionId: inferAnchorRegion(inputs, def.branchId) as UnlockedResearchNode['anchorRegionId'],
      });
    }
  }

  const unlockedNodes = [...unlockedMap.values()].sort((a, b) =>
    a.unlockedTurn !== b.unlockedTurn ? a.unlockedTurn - b.unlockedTurn : a.nodeId.localeCompare(b.nodeId)
  );

  const institutionUpgrades = mergeMonotonicInstitutionUpgrades(
    computeInstitutionUpgrades(inputs, unlockedNodes),
    previous?.institutionUpgrades ?? []
  );

  const baseDiffusion = computeRegionalDiffusion(inputs, unlockedNodes, institutionUpgrades);
  const { cells: diffusionRaw, report: lateGameDiffusion } = applyLateGameDiffusionCascade(
    baseDiffusion,
    unlockedNodes,
    institutionUpgrades
  );

  const scaleWave = computeResearchScaleWaveReport(inputs, unlockedNodes);
  const swBonus = scaleWaveDiffusionBonus(scaleWave);
  const diffusion = diffusionRaw.map(cell => ({
    ...cell,
    score: Math.min(0.85, Math.round((cell.score + swBonus) * 1000) / 1000),
  }));

  const hooks = resolveActiveStrategyHooks(new Set(unlockedNodes.map(u => u.nodeId)));

  let readinessByBranch = Object.fromEntries(
    RESEARCH_BRANCHES.map(b => [b.id, computeBranchReadiness(inputs, b.id, institutionUpgrades)])
  ) as Record<ResearchBranchId, number>;
  readinessByBranch = applyScaleWaveReadinessBonus(readinessByBranch, scaleWave);
  readinessByBranch = applyBranchEmphasisReadinessBonus(readinessByBranch, coreBase.branchEmphasis);

  const computed: ResearchProgressState = {
    schemaVersion: RESEARCH_PROGRESS_SCHEMA_VERSION,
    revision: coreBase.revision,
    turn: inputs.turn,
    unlockedNodes,
    diffusion,
    readinessByBranch,
    activeHookIds: hooks.map(h => h.id),
    leadingResearchRegion: pickLeadingResearchRegion(diffusion),
    inputHash: researchInputHash(inputs),
    institutionUpgrades,
    lateGameDiffusion,
    scaleWave,
    unlockSeq: coreBase.unlockSeq,
    branchEmphasis: coreBase.branchEmphasis,
  };

  return mergeComputedResearchState(coreBase, computed);
}

export function computeResearchProgressFromSave(
  inputs: ResearchProgressInputs,
  persistedRaw: unknown
): ResearchProgressState {
  const hydrated = sanitizeResearchProgressPersisted(persistedRaw);
  return computeResearchProgress(inputs, hydrated);
}

export function applyResearchProgressSavePipeline(
  inputs: ResearchProgressInputs,
  persistedRaw: unknown
): { state: ResearchProgressState; persist: ReturnType<typeof prepareResearchProgressForSave> } {
  const state = computeResearchProgressFromSave(inputs, persistedRaw);
  const persist = prepareResearchProgressForSave(state);
  return { state, persist };
}

function mergeMonotonicInstitutionUpgrades(
  next: InstitutionUpgradeState[],
  prev: InstitutionUpgradeState[]
): InstitutionUpgradeState[] {
  const prevById = institutionUpgradesById(prev);
  return next.map(u => {
    const old = prevById[u.institutionId];
    if (!old) return u;
    return INSTITUTION_UPGRADE_TIER_RANK[old.tier] > INSTITUTION_UPGRADE_TIER_RANK[u.tier] ? old : u;
  });
}

/** Integration adapter: map V10.5 innovation snapshot fields into Agent 03 inputs (pure). */
export function buildResearchProgressInputs(src: {
  turn: number;
  regions: ResearchProgressInputs['regions'];
  innovationCapabilities?: ResearchProgressInputs['capabilities'];
  projects: ResearchProgressInputs['projects'];
  completedContracts: ResearchProgressInputs['completedContracts'];
  megaprojects: ResearchProgressInputs['megaprojects'];
  factionStanding: ResearchProgressInputs['factionStanding'];
}): ResearchProgressInputs {
  return {
    turn: src.turn,
    regions: src.regions,
    capabilities: src.innovationCapabilities ?? {},
    projects: src.projects,
    completedContracts: src.completedContracts,
    megaprojects: src.megaprojects,
    factionStanding: src.factionStanding,
  };
}

export function getStrategyHooksForState(state: ResearchProgressState) {
  return state.activeHookIds.map(id => STRATEGY_HOOK_BY_ID[id]).filter(Boolean);
}

export const AGENT03_CATALOG = {
  branches: RESEARCH_BRANCHES,
  nodes: RESEARCH_BRANCH_NODES,
  institutions: RESEARCH_INSTITUTIONS,
};
