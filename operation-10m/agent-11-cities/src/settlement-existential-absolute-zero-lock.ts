import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_ExistentialAbsoluteZeroLockBand,
  OP10M_A11_ExistentialAbsoluteZeroLockRow,
  OP10M_A11_ExistentialNullStateLockRow,
  OP10M_A11_ExistentialObliterationThresholdRow,
  OP10M_A11_RegionId,
  OP10M_A11_UltimateCollapseSingularitySealRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function zeroBand(score: number): OP10M_A11_ExistentialAbsoluteZeroLockBand {
  if (score < 21) return 'residual';
  if (score < 37) return 'collapsing';
  if (score < 54) return 'zero';
  return 'absolute_zero';
}

export function op10mA11ComputeSettlementExistentialAbsoluteZeroLock(args: {
  existentialNullStateLock: OP10M_A11_ExistentialNullStateLockRow[];
  ultimateCollapseSingularitySeal: OP10M_A11_UltimateCollapseSingularitySealRow[];
  existentialObliterationThreshold: OP10M_A11_ExistentialObliterationThresholdRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteZeroLockRow[]; nationalIndex: number } {
  const nullByRegion = new Map(args.existentialNullStateLock.map((n) => [n.regionId, n]));
  const sealByRegion = new Map(args.ultimateCollapseSingularitySeal.map((s) => [s.regionId, s]));
  const thresholdByRegion = new Map(args.existentialObliterationThreshold.map((e) => [e.regionId, e]));

  const rows: OP10M_A11_ExistentialAbsoluteZeroLockRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const nullLock = nullByRegion.get(rid);
    const seal = sealByRegion.get(rid);
    const threshold = thresholdByRegion.get(rid);

    const nullDrag = nullLock ? op10mA11Clamp(nullLock.nullScore * 0.5) : 14;
    const sealDrag = seal ? op10mA11Clamp(seal.sealScore * 0.45) : 12;
    const thresholdDrag = threshold ? op10mA11Clamp(threshold.thresholdScore * 0.42) : 11;

    const zeroScore = op10mA11Clamp(nullDrag + sealDrag + thresholdDrag * 0.53);
    weighted += zeroScore;

    const locks: string[] = [];
    if (nullLock && (nullLock.band === 'null' || nullLock.band === 'absolute_null')) {
      locks.push('null-state zero');
    }
    if (seal && (seal.band === 'sealed' || seal.band === 'ultimate')) {
      locks.push('seal zero');
    }
    if (threshold && (threshold.band === 'breached' || threshold.band === 'obliterated')) {
      locks.push('obliteration zero');
    }
    if (!locks.length) locks.push('residual presence');

    rows.push({
      regionId: rid,
      zeroScore: op10mA11Round(zeroScore),
      band: zeroBand(zeroScore),
      locks: locks.slice(0, 3),
      narrative: `${rid} existential absolute zero lock ${zeroBand(zeroScore)} (${op10mA11Round(zeroScore)}); ${locks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.zeroScore - a.zeroScore), nationalIndex };
}

export function op10mA11RegionsWithAbsoluteZeroLock(
  rows: OP10M_A11_ExistentialAbsoluteZeroLockRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'zero' || r.band === 'absolute_zero').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteZeroLockEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 52;
  return currentIndex >= 46 && currentIndex > priorIndex + 6;
}
