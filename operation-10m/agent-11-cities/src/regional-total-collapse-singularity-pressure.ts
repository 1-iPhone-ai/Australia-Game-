import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_HollowRegionContagionRow,
  OP10M_A11_PermanentDepopulationLockRow,
  OP10M_A11_RegionId,
  OP10M_A11_StateCollapseCascadeAmplificationRow,
  OP10M_A11_TotalCollapseSingularityBand,
  OP10M_A11_TotalCollapseSingularityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function singularityBand(score: number): OP10M_A11_TotalCollapseSingularityBand {
  if (score < 26) return 'bounded';
  if (score < 44) return 'accelerating';
  if (score < 61) return 'singular';
  return 'total';
}

export function op10mA11ComputeRegionalTotalCollapseSingularityPressure(args: {
  stateCollapseCascadeAmplification: OP10M_A11_StateCollapseCascadeAmplificationRow[];
  hollowRegionContagion: OP10M_A11_HollowRegionContagionRow[];
  permanentDepopulationLock: OP10M_A11_PermanentDepopulationLockRow[];
}): { rows: OP10M_A11_TotalCollapseSingularityRow[]; nationalIndex: number } {
  const cascadeByRegion = new Map(args.stateCollapseCascadeAmplification.map((c) => [c.regionId, c]));
  const hollowByRegion = new Map(args.hollowRegionContagion.map((h) => [h.regionId, h]));
  const lockByRegion = new Map(args.permanentDepopulationLock.map((p) => [p.regionId, p]));

  const rows: OP10M_A11_TotalCollapseSingularityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const cascade = cascadeByRegion.get(rid);
    const hollow = hollowByRegion.get(rid);
    const lock = lockByRegion.get(rid);

    const cascadeDrag = cascade ? op10mA11Clamp(cascade.amplificationScore * 0.43) : 13;
    const hollowDrag = hollow ? op10mA11Clamp(hollow.contagionScore * 0.41) : 12;
    const lockDrag = lock ? op10mA11Clamp(lock.lockScore * 0.38) : 10;

    const singularityScore = op10mA11Clamp(cascadeDrag + hollowDrag + lockDrag * 0.49);
    weighted += singularityScore;

    const drivers: string[] = [];
    if (cascade && (cascade.band === 'runaway' || cascade.band === 'total')) {
      drivers.push('runaway cascade');
    }
    if (hollow && (hollow.band === 'contagion' || hollow.band === 'voided')) {
      drivers.push('void contagion');
    }
    if (lock && (lock.band === 'locked' || lock.band === 'permanent')) {
      drivers.push('depopulation lock');
    }
    if (!drivers.length) drivers.push('collapse containment');

    rows.push({
      regionId: rid,
      singularityScore: op10mA11Round(singularityScore),
      band: singularityBand(singularityScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} total collapse singularity pressure ${singularityBand(singularityScore)} (${op10mA11Round(singularityScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.singularityScore - a.singularityScore), nationalIndex };
}

export function op10mA11RegionsWithTotalCollapseSingularity(
  rows: OP10M_A11_TotalCollapseSingularityRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'singular' || r.band === 'total').map((r) => r.regionId);
}

export function op10mA11TotalCollapseSingularityEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 54;
  return currentIndex >= 48 && currentIndex > priorIndex + 6;
}
