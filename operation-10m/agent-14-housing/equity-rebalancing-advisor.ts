import { AGENT14_ALL_PROGRAM_STUBS, AGENT14_CORE_REGIONS, AGENT14_PILLARS } from './constants.ts';
import type {
  EquityRebalancingAdvice,
  NationalHousingWellbeingSnapshot,
  NationalServiceAccessLens,
  RegionalWellbeingMemorySnapshot,
} from './types.ts';

function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function programsForRegion(regionId: string, pillar?: 'housing' | 'healthcare' | 'education'): string[] {
  return AGENT14_ALL_PROGRAM_STUBS.filter(
    (s) => s.regionId === regionId && (pillar ? s.pillar === pillar : true)
  ).map((s) => s.id);
}

export function adviseEquityRebalancing(args: {
  turn: number;
  housing: NationalHousingWellbeingSnapshot;
  access: NationalServiceAccessLens;
  memory?: RegionalWellbeingMemorySnapshot;
  maxRegions?: number;
}): EquityRebalancingAdvice {
  const maxRegions = args.maxRegions ?? 4;
  const lagging: EquityRebalancingAdvice['laggingRegions'] = [];

  for (const regionId of AGENT14_CORE_REGIONS) {
    const h = args.housing.regions[regionId];
    const a = args.access.regions[regionId];
    const mem = args.memory?.regions[regionId];
    const affordability = h?.affordabilityIndex ?? args.housing.nationalAffordabilityIndex;
    const accessIdx = a?.compositeIndex ?? args.access.nationalComposite;
    const nationalAff = args.housing.nationalAffordabilityIndex;
    const deficitIndex = clamp(
      (nationalAff - affordability) * 0.55 + (args.access.nationalComposite - accessIdx) * 0.45
    );
    let urgency = deficitIndex;
    if (mem?.affordabilityTrend === 'deteriorating') urgency += 8;
    if (h?.affordabilityStress === 'severe') urgency += 10;
    if (accessIdx < 42) urgency += 6;

    if (urgency < 12) continue;

    const weakestPillar = [...AGENT14_PILLARS].sort(
      (p1, p2) => (a?.pillars[p1].accessIndex ?? 50) - (a?.pillars[p2].accessIndex ?? 50)
    )[0];

    lagging.push({
      regionId,
      deficitIndex: Math.round(deficitIndex * 10) / 10,
      urgencyScore: Math.round(urgency * 10) / 10,
      weakestPillar,
      suggestedProgramIds: programsForRegion(regionId, weakestPillar).slice(0, 3),
      rationale: `Affordability ${affordability} vs national ${nationalAff}; access ${accessIdx}`,
    });
  }

  lagging.sort((a, b) => b.urgencyScore - a.urgencyScore);
  const top = lagging.slice(0, maxRegions);
  const equityGap = args.housing.regionalEquityGap;
  const shouldEscalate =
    equityGap >= 18 || top.some((r) => r.urgencyScore >= 28) || top.length >= 3;

  return {
    turn: args.turn,
    equityGap,
    shouldEscalate,
    laggingRegions: top,
    summary:
      top.length === 0
        ? 'Regional equity within tolerance — no rebalance push'
        : `Prioritize ${top.map((r) => r.regionId).join(', ')} (gap ${equityGap})`,
  };
}
