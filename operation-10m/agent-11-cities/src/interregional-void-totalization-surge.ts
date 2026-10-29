import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_HollowRegionContagionRow,
  OP10M_A11_RegionId,
  OP10M_A11_TotalCollapseSingularityRow,
  OP10M_A11_VoidExpansionVelocityRow,
  OP10M_A11_VoidTotalizationSurgeBand,
  OP10M_A11_VoidTotalizationSurgeRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function surgeBand(score: number): OP10M_A11_VoidTotalizationSurgeBand {
  if (score < 24) return 'contained';
  if (score < 41) return 'spreading';
  if (score < 58) return 'totalizing';
  return 'absolute';
}

export function op10mA11ComputeInterregionalVoidTotalizationSurge(args: {
  voidExpansionVelocity: OP10M_A11_VoidExpansionVelocityRow[];
  totalCollapseSingularity: OP10M_A11_TotalCollapseSingularityRow[];
  hollowRegionContagion: OP10M_A11_HollowRegionContagionRow[];
}): { rows: OP10M_A11_VoidTotalizationSurgeRow[]; nationalIndex: number } {
  const voidByRegion = new Map(args.voidExpansionVelocity.map((v) => [v.regionId, v]));
  const singularityByRegion = new Map(args.totalCollapseSingularity.map((s) => [s.regionId, s]));
  const hollowByRegion = new Map(args.hollowRegionContagion.map((h) => [h.regionId, h]));

  const rows: OP10M_A11_VoidTotalizationSurgeRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const voidVel = voidByRegion.get(rid);
    const singularity = singularityByRegion.get(rid);
    const hollow = hollowByRegion.get(rid);

    const voidDrag = voidVel ? op10mA11Clamp(voidVel.velocityScore * 0.45) : 13;
    const singularityDrag = singularity ? op10mA11Clamp(singularity.singularityScore * 0.4) : 12;
    const hollowDrag = hollow ? op10mA11Clamp(hollow.contagionScore * 0.37) : 10;

    const surgeScore = op10mA11Clamp(voidDrag + singularityDrag + hollowDrag * 0.47);
    weighted += surgeScore;

    const fronts: string[] = [];
    if (voidVel && (voidVel.band === 'surging' || voidVel.band === 'unbounded')) {
      fronts.push('void front');
    }
    if (singularity && (singularity.band === 'singular' || singularity.band === 'total')) {
      fronts.push('singularity pull');
    }
    if (hollow && (hollow.band === 'contagion' || hollow.band === 'voided')) {
      fronts.push('hollow merge');
    }
    if (!fronts.length) fronts.push('void containment');

    rows.push({
      regionId: rid,
      surgeScore: op10mA11Round(surgeScore),
      band: surgeBand(surgeScore),
      fronts: fronts.slice(0, 3),
      narrative: `${rid} void totalization surge ${surgeBand(surgeScore)} (${op10mA11Round(surgeScore)}); ${fronts.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.surgeScore - a.surgeScore), nationalIndex };
}

export function op10mA11RegionsWithAbsoluteVoidTotalization(
  rows: OP10M_A11_VoidTotalizationSurgeRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'totalizing' || r.band === 'absolute').map((r) => r.regionId);
}

export function op10mA11VoidTotalizationSurgeEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 54;
  return currentIndex >= 48 && currentIndex > priorIndex + 6;
}
