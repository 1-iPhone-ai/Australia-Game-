import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseHorizonConvergenceBand,
  OP10M_A11_CollapseHorizonConvergenceRow,
  OP10M_A11_ExistentialContinuityFractureRow,
  OP10M_A11_RegionId,
  OP10M_A11_TotalCollapseSingularityRow,
  OP10M_A11_VoidExpansionVelocityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function horizonBand(score: number): OP10M_A11_CollapseHorizonConvergenceBand {
  if (score < 25) return 'distant';
  if (score < 42) return 'narrowing';
  if (score < 59) return 'imminent';
  return 'locked';
}

export function op10mA11ComputeRegionalCollapseHorizonConvergence(args: {
  totalCollapseSingularity: OP10M_A11_TotalCollapseSingularityRow[];
  voidExpansionVelocity: OP10M_A11_VoidExpansionVelocityRow[];
  existentialContinuityFracture: OP10M_A11_ExistentialContinuityFractureRow[];
}): { rows: OP10M_A11_CollapseHorizonConvergenceRow[]; nationalIndex: number } {
  const singularityByRegion = new Map(args.totalCollapseSingularity.map((s) => [s.regionId, s]));
  const voidByRegion = new Map(args.voidExpansionVelocity.map((v) => [v.regionId, v]));
  const fractureByRegion = new Map(args.existentialContinuityFracture.map((e) => [e.regionId, e]));

  const rows: OP10M_A11_CollapseHorizonConvergenceRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const singularity = singularityByRegion.get(rid);
    const voidVel = voidByRegion.get(rid);
    const fracture = fractureByRegion.get(rid);

    const singularityDrag = singularity ? op10mA11Clamp(singularity.singularityScore * 0.44) : 14;
    const voidDrag = voidVel ? op10mA11Clamp(voidVel.velocityScore * 0.42) : 12;
    const fractureDrag = fracture ? op10mA11Clamp(fracture.fractureScore * 0.39) : 11;

    const convergenceScore = op10mA11Clamp(singularityDrag + voidDrag + fractureDrag * 0.48);
    weighted += convergenceScore;

    const signals: string[] = [];
    if (singularity && (singularity.band === 'singular' || singularity.band === 'total')) {
      signals.push('singularity horizon');
    }
    if (voidVel && (voidVel.band === 'surging' || voidVel.band === 'unbounded')) {
      signals.push('void acceleration');
    }
    if (fracture && (fracture.band === 'shattered' || fracture.band === 'extinguished')) {
      signals.push('continuity break');
    }
    if (!signals.length) signals.push('horizon stable');

    rows.push({
      regionId: rid,
      convergenceScore: op10mA11Round(convergenceScore),
      band: horizonBand(convergenceScore),
      signals: signals.slice(0, 3),
      narrative: `${rid} collapse horizon convergence ${horizonBand(convergenceScore)} (${op10mA11Round(convergenceScore)}); ${signals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.convergenceScore - a.convergenceScore), nationalIndex };
}

export function op10mA11RegionsWithLockedCollapseHorizon(
  rows: OP10M_A11_CollapseHorizonConvergenceRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'imminent' || r.band === 'locked').map((r) => r.regionId);
}

export function op10mA11CollapseHorizonConvergenceEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 53;
  return currentIndex >= 47 && currentIndex > priorIndex + 6;
}
