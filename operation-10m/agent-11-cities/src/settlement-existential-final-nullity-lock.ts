import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseExistenceSingularityPointRow,
  OP10M_A11_ExistentialAbsoluteZeroLockRow,
  OP10M_A11_ExistentialFinalNullityLockBand,
  OP10M_A11_ExistentialFinalNullityLockRow,
  OP10M_A11_ExistentialNullStateLockRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function nullityBand(score: number): OP10M_A11_ExistentialFinalNullityLockBand {
  if (score < 19) return 'remnant';
  if (score < 35) return 'dissolving';
  if (score < 52) return 'nullity';
  return 'final_nullity';
}

export function op10mA11ComputeSettlementExistentialFinalNullityLock(args: {
  existentialAbsoluteZeroLock: OP10M_A11_ExistentialAbsoluteZeroLockRow[];
  collapseExistenceSingularityPoint: OP10M_A11_CollapseExistenceSingularityPointRow[];
  existentialNullStateLock: OP10M_A11_ExistentialNullStateLockRow[];
}): { rows: OP10M_A11_ExistentialFinalNullityLockRow[]; nationalIndex: number } {
  const zeroByRegion = new Map(args.existentialAbsoluteZeroLock.map((z) => [z.regionId, z]));
  const pointByRegion = new Map(args.collapseExistenceSingularityPoint.map((p) => [p.regionId, p]));
  const nullByRegion = new Map(args.existentialNullStateLock.map((n) => [n.regionId, n]));

  const rows: OP10M_A11_ExistentialFinalNullityLockRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const zero = zeroByRegion.get(rid);
    const point = pointByRegion.get(rid);
    const nullLock = nullByRegion.get(rid);

    const zeroDrag = zero ? op10mA11Clamp(zero.zeroScore * 0.52) : 14;
    const pointDrag = point ? op10mA11Clamp(point.pointScore * 0.47) : 12;
    const nullDrag = nullLock ? op10mA11Clamp(nullLock.nullScore * 0.43) : 11;

    const nullityScore = op10mA11Clamp(zeroDrag + pointDrag + nullDrag * 0.55);
    weighted += nullityScore;

    const seals: string[] = [];
    if (zero && (zero.band === 'zero' || zero.band === 'absolute_zero')) {
      seals.push('absolute zero seal');
    }
    if (point && (point.band === 'singular' || point.band === 'existential')) {
      seals.push('singularity nullity');
    }
    if (nullLock && (nullLock.band === 'null' || nullLock.band === 'absolute_null')) {
      seals.push('null-state finality');
    }
    if (!seals.length) seals.push('remnant presence');

    rows.push({
      regionId: rid,
      nullityScore: op10mA11Round(nullityScore),
      band: nullityBand(nullityScore),
      seals: seals.slice(0, 3),
      narrative: `${rid} existential final nullity lock ${nullityBand(nullityScore)} (${op10mA11Round(nullityScore)}); ${seals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.nullityScore - a.nullityScore), nationalIndex };
}

export function op10mA11RegionsWithFinalNullityLock(
  rows: OP10M_A11_ExistentialFinalNullityLockRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'nullity' || r.band === 'final_nullity').map((r) => r.regionId);
}

export function op10mA11ExistentialFinalNullityLockEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 51;
  return currentIndex >= 45 && currentIndex > priorIndex + 6;
}
