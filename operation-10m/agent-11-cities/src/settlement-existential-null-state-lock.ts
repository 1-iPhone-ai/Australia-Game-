import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_ExistentialNullStateLockBand,
  OP10M_A11_ExistentialNullStateLockRow,
  OP10M_A11_ExistentialObliterationThresholdRow,
  OP10M_A11_ExistentialTerminusLockRow,
  OP10M_A11_RegionId,
  OP10M_A11_AbsoluteCollapseHorizonLockRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function nullBand(score: number): OP10M_A11_ExistentialNullStateLockBand {
  if (score < 23) return 'present';
  if (score < 39) return 'fading';
  if (score < 56) return 'null';
  return 'absolute_null';
}

export function op10mA11ComputeSettlementExistentialNullStateLock(args: {
  existentialObliterationThreshold: OP10M_A11_ExistentialObliterationThresholdRow[];
  absoluteCollapseHorizonLock: OP10M_A11_AbsoluteCollapseHorizonLockRow[];
  existentialTerminusLock: OP10M_A11_ExistentialTerminusLockRow[];
}): { rows: OP10M_A11_ExistentialNullStateLockRow[]; nationalIndex: number } {
  const thresholdByRegion = new Map(args.existentialObliterationThreshold.map((e) => [e.regionId, e]));
  const lockByRegion = new Map(args.absoluteCollapseHorizonLock.map((a) => [a.regionId, a]));
  const terminusByRegion = new Map(args.existentialTerminusLock.map((t) => [t.regionId, t]));

  const rows: OP10M_A11_ExistentialNullStateLockRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const threshold = thresholdByRegion.get(rid);
    const lock = lockByRegion.get(rid);
    const terminus = terminusByRegion.get(rid);

    const thresholdDrag = threshold ? op10mA11Clamp(threshold.thresholdScore * 0.48) : 14;
    const lockDrag = lock ? op10mA11Clamp(lock.lockScore * 0.42) : 12;
    const terminusDrag = terminus ? op10mA11Clamp(terminus.terminusScore * 0.4) : 11;

    const nullScore = op10mA11Clamp(thresholdDrag + lockDrag + terminusDrag * 0.51);
    weighted += nullScore;

    const voids: string[] = [];
    if (threshold && (threshold.band === 'breached' || threshold.band === 'obliterated')) {
      voids.push('obliteration void');
    }
    if (lock && (lock.band === 'sealed' || lock.band === 'absolute')) {
      voids.push('horizon null');
    }
    if (terminus && (terminus.band === 'sealed' || terminus.band === 'terminal')) {
      voids.push('terminus null');
    }
    if (!voids.length) voids.push('state present');

    rows.push({
      regionId: rid,
      nullScore: op10mA11Round(nullScore),
      band: nullBand(nullScore),
      voids: voids.slice(0, 3),
      narrative: `${rid} existential null-state lock ${nullBand(nullScore)} (${op10mA11Round(nullScore)}); ${voids.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.nullScore - a.nullScore), nationalIndex };
}

export function op10mA11RegionsWithAbsoluteExistentialNull(
  rows: OP10M_A11_ExistentialNullStateLockRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'null' || r.band === 'absolute_null').map((r) => r.regionId);
}

export function op10mA11ExistentialNullStateLockEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 53;
  return currentIndex >= 47 && currentIndex > priorIndex + 6;
}
