import { INSTITUTION_UPGRADE_TIER_RANK } from './institution-upgrades.ts';
import { V94_REGION_CODES } from './v94-ids.ts';
import type { V94AustralianRegionCode } from './v94-ids.ts';
import type { InstitutionUpgradeState, LateGameDiffusionPulse, LateGameDiffusionReport, RegionalDiffusionCell, UnlockedResearchNode } from './types.ts';
import { RESEARCH_NODE_BY_ID } from './branches.ts';
import { INSTITUTION_DIFFUSION_NEIGHBORS } from './institutions.ts';

/** Late-game cascade: max graph hops from integrated anchor regions. */
export const LATE_GAME_CASCADE_MAX_HOPS = 3;
export const LATE_GAME_CASCADE_DECAY = 0.52;
export const LATE_GAME_INTEGRATED_THRESHOLD = 0.68;

export type { LateGameDiffusionPulse, LateGameDiffusionReport } from './types.ts';

function undirectedNeighbors(regionId: string): string[] {
  const out = new Set<string>(INSTITUTION_DIFFUSION_NEIGHBORS[regionId] || []);
  for (const [home, list] of Object.entries(INSTITUTION_DIFFUSION_NEIGHBORS)) {
    if (list.includes(regionId)) out.add(home);
  }
  return [...out];
}

function countTier4Unlocks(unlocked: UnlockedResearchNode[]): number {
  return unlocked.filter(u => RESEARCH_NODE_BY_ID[u.nodeId]?.tier === 4).length;
}

function countNationalInstitutions(upgrades: InstitutionUpgradeState[]): number {
  return upgrades.filter(u => u.tier === 'national_integration').length;
}

/**
 * After base diffusion, propagate surplus from integrated regions along neighbor graph.
 * Activates when at least one tier-4 branch node is unlocked OR an institution hits national integration.
 */
export function applyLateGameDiffusionCascade(
  base: RegionalDiffusionCell[],
  unlocked: UnlockedResearchNode[],
  institutionUpgrades: InstitutionUpgradeState[]
): { cells: RegionalDiffusionCell[]; report: LateGameDiffusionReport } {
  const tier4 = countTier4Unlocks(unlocked);
  const tier5 = unlocked.filter(u => RESEARCH_NODE_BY_ID[u.nodeId]?.tier === 5).length;
  const nationalInst = countNationalInstitutions(institutionUpgrades);
  const trigger =
    tier4 > 0 && nationalInst > 0
      ? 'both'
      : tier4 > 0 || tier5 > 0
        ? 'tier4_unlock'
        : nationalInst > 0
          ? 'national_institution'
          : 'none';
  const active = trigger !== 'none';

  const scores: Record<string, number> = Object.fromEntries(base.map(c => [c.regionId, c.score]));
  const cascadeBoost: Record<string, number> = Object.fromEntries(V94_REGION_CODES.map(c => [c, 0]));
  const pulses: LateGameDiffusionPulse[] = [];

  if (active) {
    const sources = base.filter(c => c.score >= LATE_GAME_INTEGRATED_THRESHOLD || c.level === 'integrated');
    const visitedDepth = new Map<string, number>();

    for (const src of sources) {
      const queue: Array<{ id: string; hops: number; strength: number }> = [
        { id: src.regionId, hops: 0, strength: src.score },
      ];
      visitedDepth.set(`${src.regionId}:0`, 0);

      while (queue.length) {
        const cur = queue.shift()!;
        if (cur.hops >= LATE_GAME_CASCADE_MAX_HOPS) continue;

        for (const nxt of undirectedNeighbors(cur.id)) {
          const nextHop = cur.hops + 1;
          const key = `${nxt}:${nextHop}`;
          if (visitedDepth.has(key)) continue;
          visitedDepth.set(key, nextHop);

          const strength = cur.strength * LATE_GAME_CASCADE_DECAY * (1 + nationalInst * 0.04);
          if (strength < 0.015) continue;

          cascadeBoost[nxt] = (cascadeBoost[nxt] ?? 0) + strength;
          pulses.push({
            fromRegionId: src.regionId as V94AustralianRegionCode,
            toRegionId: nxt as V94AustralianRegionCode,
            hops: nextHop,
            strength: Math.round(strength * 1000) / 1000,
          });

          queue.push({ id: nxt, hops: nextHop, strength });
        }
      }
    }
  }

  const cap = 0.85;
  const cells = base.map(cell => {
    const add = cascadeBoost[cell.regionId] ?? 0;
    const score = Math.min(cap, Math.round((cell.score + add) * 1000) / 1000);
    return {
      ...cell,
      score,
      cascadeBoost: Math.round(add * 1000) / 1000,
      level:
        score >= 0.68 ? 'integrated' : score >= 0.42 ? 'adopting' : score >= 0.18 ? 'aware' : 'latent',
      sourceNodeIds: add > 0 ? [...cell.sourceNodeIds, 'late_game_cascade'] : cell.sourceNodeIds,
    };
  });

  const nationalPenetration =
    cells.reduce((s, c) => s + c.score, 0) / Math.max(1, cells.length);

  return {
    cells,
    report: {
      active,
      trigger,
      tier4UnlockCount: tier4,
      nationalInstitutionCount: nationalInst,
      pulses: pulses.slice(0, 48),
      nationalPenetration: Math.round(nationalPenetration * 1000) / 1000,
    },
  };
}

export function topInstitutionUpgradeTier(upgrades: InstitutionUpgradeState[]): InstitutionUpgradeState | null {
  const sorted = upgrades
    .slice()
    .sort(
      (a, b) =>
        INSTITUTION_UPGRADE_TIER_RANK[b.tier] - INSTITUTION_UPGRADE_TIER_RANK[a.tier] ||
        b.readinessMultiplier - a.readinessMultiplier
    );
  return sorted[0]?.tier === 'dormant' ? null : sorted[0];
}
