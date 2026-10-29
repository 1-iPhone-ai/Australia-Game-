import { V94_REGION_CODES } from './v94-ids.ts';
import type { V94AustralianRegionCode } from './v94-ids.ts';
import type { InstitutionUpgradeState, RegionalDiffusionCell, ResearchProgressInputs, UnlockedResearchNode } from './types.ts';
import { institutionUpgradesById } from './institution-upgrades.ts';
import { RESEARCH_BRANCH_BY_ID, RESEARCH_NODE_BY_ID } from './branches.ts';
import { INSTITUTION_DIFFUSION_NEIGHBORS, RESEARCH_INSTITUTIONS } from './institutions.ts';

/** Aligned with V10.5 V105_THRESHOLDS.diffusionCap (0.85) — branch overlay uses same cap. */
export const DIFFUSION_CAP = 0.85;

const LEVEL_THRESHOLDS = {
  latent: 0,
  aware: 0.18,
  adopting: 0.42,
  integrated: 0.68,
} as const;

function diffusionLevel(score: number): RegionalDiffusionCell['level'] {
  if (score >= LEVEL_THRESHOLDS.integrated) return 'integrated';
  if (score >= LEVEL_THRESHOLDS.adopting) return 'adopting';
  if (score >= LEVEL_THRESHOLDS.aware) return 'aware';
  return 'latent';
}

function institutionDiffusionBoost(
  inputs: ResearchProgressInputs,
  regionId: V94AustralianRegionCode,
  upgrades: Record<string, InstitutionUpgradeState>
): number {
  let boost = 0;
  for (const inst of RESEARCH_INSTITUTIONS) {
    const upgrade = upgrades[inst.id];
    const standing = inputs.factionStanding[inst.id as keyof typeof inputs.factionStanding];
    if (standing == null || standing < inst.minStanding) continue;
    const mult = upgrade?.diffusionMultiplier ?? 1;
    const inHome = inst.homeRegions.includes(regionId);
    const neighborOfHome = inst.homeRegions.some(h =>
      (INSTITUTION_DIFFUSION_NEIGHBORS[h] || []).includes(regionId)
    );
    if (inHome) boost += inst.readinessBonus * 0.008 * mult;
    else if (neighborOfHome) boost += inst.readinessBonus * 0.004 * mult;
  }
  return boost;
}

function sectorAlignmentBoost(
  inputs: ResearchProgressInputs,
  regionId: V94AustralianRegionCode,
  branchId: string
): number {
  const branch = RESEARCH_BRANCH_BY_ID[branchId as keyof typeof RESEARCH_BRANCH_BY_ID];
  if (!branch) return 0;
  const region = inputs.regions.find(r => r.code === regionId);
  if (!region) return 0;
  let sum = 0;
  for (const sec of branch.sectors) {
    sum += Number(region.sectors[sec] ?? 0);
  }
  return Math.min(0.12, sum / 400);
}

/**
 * Spread research influence from unlocked nodes into regional diffusion grid.
 */
export function computeRegionalDiffusion(
  inputs: ResearchProgressInputs,
  unlocked: UnlockedResearchNode[],
  institutionUpgrades: InstitutionUpgradeState[] = []
): RegionalDiffusionCell[] {
  const upgrades = institutionUpgradesById(institutionUpgrades);
  const scores: Record<string, number> = Object.fromEntries(V94_REGION_CODES.map(c => [c, 0]));
  const institutionBoost: Record<string, number> = Object.fromEntries(V94_REGION_CODES.map(c => [c, 0]));
  const sources: Record<string, Set<string>> = Object.fromEntries(
    V94_REGION_CODES.map(c => [c, new Set<string>()])
  );

  for (const u of unlocked) {
    const node = RESEARCH_NODE_BY_ID[u.nodeId];
    if (!node) continue;
    const seed = node.diffusionSeed;
    const branch = RESEARCH_BRANCH_BY_ID[node.branchId];
    const anchors = branch?.anchorRegions ?? [];

    for (const code of V94_REGION_CODES) {
      let add = seed * 0.35;
      if (u.anchorRegionId === code) add += seed * 0.45;
      else if (anchors.includes(code)) add += seed * 0.25;
      add += sectorAlignmentBoost(inputs, code, node.branchId);
      const instAdd = institutionDiffusionBoost(inputs, code, upgrades);
      add += instAdd;
      institutionBoost[code] = (institutionBoost[code] ?? 0) + instAdd;
      if (add > 0) {
        scores[code] = Math.min(DIFFUSION_CAP, (scores[code] ?? 0) + add);
        sources[code]?.add(u.nodeId);
      }
    }
  }

  return V94_REGION_CODES.map(regionId => ({
    regionId,
    score: Math.round((scores[regionId] ?? 0) * 1000) / 1000,
    level: diffusionLevel(scores[regionId] ?? 0),
    sourceNodeIds: [...(sources[regionId] ?? [])],
    institutionBoost: Math.round((institutionBoost[regionId] ?? 0) * 1000) / 1000,
    cascadeBoost: 0,
  }));
}

export function pickLeadingResearchRegion(cells: RegionalDiffusionCell[]): V94AustralianRegionCode | null {
  const sorted = cells.slice().sort((a, b) => b.score - a.score);
  return sorted[0]?.score > 0 ? sorted[0].regionId : null;
}
