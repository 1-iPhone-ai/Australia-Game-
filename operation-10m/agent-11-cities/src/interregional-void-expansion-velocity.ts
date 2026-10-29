import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_HollowRegionContagionRow,
  OP10M_A11_RegionId,
  OP10M_A11_SettlementAbandonmentSpiralRow,
  OP10M_A11_StateCollapseCascadeAmplificationRow,
  OP10M_A11_VoidExpansionVelocityBand,
  OP10M_A11_VoidExpansionVelocityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function velocityBand(score: number): OP10M_A11_VoidExpansionVelocityBand {
  if (score < 25) return 'stable';
  if (score < 43) return 'widening';
  if (score < 60) return 'surging';
  return 'unbounded';
}

export function op10mA11ComputeInterregionalVoidExpansionVelocity(args: {
  hollowRegionContagion: OP10M_A11_HollowRegionContagionRow[];
  settlementAbandonmentSpiral: OP10M_A11_SettlementAbandonmentSpiralRow[];
  stateCollapseCascadeAmplification: OP10M_A11_StateCollapseCascadeAmplificationRow[];
}): { rows: OP10M_A11_VoidExpansionVelocityRow[]; nationalIndex: number } {
  const hollowByRegion = new Map(args.hollowRegionContagion.map((h) => [h.regionId, h]));
  const spiralByRegion = new Map(args.settlementAbandonmentSpiral.map((s) => [s.regionId, s]));
  const cascadeByRegion = new Map(args.stateCollapseCascadeAmplification.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_VoidExpansionVelocityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const hollow = hollowByRegion.get(rid);
    const spiral = spiralByRegion.get(rid);
    const cascade = cascadeByRegion.get(rid);

    const hollowDrag = hollow ? op10mA11Clamp(hollow.contagionScore * 0.44) : 13;
    const spiralDrag = spiral ? op10mA11Clamp(spiral.spiralScore * 0.4) : 11;
    const cascadeDrag = cascade ? op10mA11Clamp(cascade.amplificationScore * 0.36) : 10;

    const velocityScore = op10mA11Clamp(hollowDrag + spiralDrag + cascadeDrag * 0.46);
    weighted += velocityScore;

    const vectors: string[] = [];
    if (hollow && (hollow.band === 'contagion' || hollow.band === 'voided')) {
      vectors.push('hollow expansion');
    }
    if (spiral && (spiral.band === 'exodus' || spiral.band === 'abandoned')) {
      vectors.push('abandonment vector');
    }
    if (cascade && (cascade.band === 'runaway' || cascade.band === 'total')) {
      vectors.push('cascade acceleration');
    }
    if (!vectors.length) vectors.push('void containment');

    rows.push({
      regionId: rid,
      velocityScore: op10mA11Round(velocityScore),
      band: velocityBand(velocityScore),
      vectors: vectors.slice(0, 3),
      narrative: `${rid} void expansion velocity ${velocityBand(velocityScore)} (${op10mA11Round(velocityScore)}); ${vectors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.velocityScore - a.velocityScore), nationalIndex };
}

export function op10mA11RegionsWithUnboundedVoidExpansion(
  rows: OP10M_A11_VoidExpansionVelocityRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'surging' || r.band === 'unbounded').map((r) => r.regionId);
}

export function op10mA11VoidExpansionVelocityEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 55;
  return currentIndex >= 49 && currentIndex > priorIndex + 6;
}
