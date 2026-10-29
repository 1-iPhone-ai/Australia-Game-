import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseHorizonConvergenceRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExpansionVelocityRow,
  OP10M_A11_VoidFinalizationCascadeBand,
  OP10M_A11_VoidFinalizationCascadeRow,
  OP10M_A11_VoidTotalizationSurgeRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function cascadeBand(score: number): OP10M_A11_VoidFinalizationCascadeBand {
  if (score < 23) return 'latent';
  if (score < 39) return 'cascading';
  if (score < 56) return 'finalizing';
  return 'complete';
}

export function op10mA11ComputeInterregionalVoidFinalizationCascade(args: {
  voidTotalizationSurge: OP10M_A11_VoidTotalizationSurgeRow[];
  collapseHorizonConvergence: OP10M_A11_CollapseHorizonConvergenceRow[];
  voidExpansionVelocity: OP10M_A11_VoidExpansionVelocityRow[];
}): { rows: OP10M_A11_VoidFinalizationCascadeRow[]; nationalIndex: number } {
  const surgeByRegion = new Map(args.voidTotalizationSurge.map((v) => [v.regionId, v]));
  const horizonByRegion = new Map(args.collapseHorizonConvergence.map((c) => [c.regionId, c]));
  const velocityByRegion = new Map(args.voidExpansionVelocity.map((v) => [v.regionId, v]));

  const rows: OP10M_A11_VoidFinalizationCascadeRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const surge = surgeByRegion.get(rid);
    const horizon = horizonByRegion.get(rid);
    const velocity = velocityByRegion.get(rid);

    const surgeDrag = surge ? op10mA11Clamp(surge.surgeScore * 0.46) : 13;
    const horizonDrag = horizon ? op10mA11Clamp(horizon.convergenceScore * 0.41) : 12;
    const velocityDrag = velocity ? op10mA11Clamp(velocity.velocityScore * 0.38) : 10;

    const cascadeScore = op10mA11Clamp(surgeDrag + horizonDrag + velocityDrag * 0.48);
    weighted += cascadeScore;

    const stages: string[] = [];
    if (surge && (surge.band === 'totalizing' || surge.band === 'absolute')) {
      stages.push('totalization stage');
    }
    if (horizon && (horizon.band === 'imminent' || horizon.band === 'locked')) {
      stages.push('horizon collapse');
    }
    if (velocity && (velocity.band === 'surging' || velocity.band === 'unbounded')) {
      stages.push('velocity final');
    }
    if (!stages.length) stages.push('cascade dormant');

    rows.push({
      regionId: rid,
      cascadeScore: op10mA11Round(cascadeScore),
      band: cascadeBand(cascadeScore),
      stages: stages.slice(0, 3),
      narrative: `${rid} void finalization cascade ${cascadeBand(cascadeScore)} (${op10mA11Round(cascadeScore)}); ${stages.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.cascadeScore - a.cascadeScore), nationalIndex };
}

export function op10mA11RegionsWithCompleteVoidFinalization(
  rows: OP10M_A11_VoidFinalizationCascadeRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'finalizing' || r.band === 'complete').map((r) => r.regionId);
}

export function op10mA11VoidFinalizationCascadeEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 53;
  return currentIndex >= 47 && currentIndex > priorIndex + 6;
}
