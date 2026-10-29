import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_AbsoluteCollapseHorizonLockBand,
  OP10M_A11_AbsoluteCollapseHorizonLockRow,
  OP10M_A11_CollapseHorizonConvergenceRow,
  OP10M_A11_ExistentialTerminusLockRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalizationSurgeRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function lockBand(score: number): OP10M_A11_AbsoluteCollapseHorizonLockBand {
  if (score < 24) return 'buffered';
  if (score < 40) return 'compressing';
  if (score < 57) return 'sealed';
  return 'absolute';
}

export function op10mA11ComputeRegionalAbsoluteCollapseHorizonLock(args: {
  collapseHorizonConvergence: OP10M_A11_CollapseHorizonConvergenceRow[];
  voidTotalizationSurge: OP10M_A11_VoidTotalizationSurgeRow[];
  existentialTerminusLock: OP10M_A11_ExistentialTerminusLockRow[];
}): { rows: OP10M_A11_AbsoluteCollapseHorizonLockRow[]; nationalIndex: number } {
  const horizonByRegion = new Map(args.collapseHorizonConvergence.map((c) => [c.regionId, c]));
  const surgeByRegion = new Map(args.voidTotalizationSurge.map((v) => [v.regionId, v]));
  const terminusByRegion = new Map(args.existentialTerminusLock.map((t) => [t.regionId, t]));

  const rows: OP10M_A11_AbsoluteCollapseHorizonLockRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const horizon = horizonByRegion.get(rid);
    const surge = surgeByRegion.get(rid);
    const terminus = terminusByRegion.get(rid);

    const horizonDrag = horizon ? op10mA11Clamp(horizon.convergenceScore * 0.45) : 14;
    const surgeDrag = surge ? op10mA11Clamp(surge.surgeScore * 0.43) : 12;
    const terminusDrag = terminus ? op10mA11Clamp(terminus.terminusScore * 0.4) : 11;

    const lockScore = op10mA11Clamp(horizonDrag + surgeDrag + terminusDrag * 0.49);
    weighted += lockScore;

    const clamps: string[] = [];
    if (horizon && (horizon.band === 'imminent' || horizon.band === 'locked')) {
      clamps.push('horizon sealed');
    }
    if (surge && (surge.band === 'totalizing' || surge.band === 'absolute')) {
      clamps.push('void absolute');
    }
    if (terminus && (terminus.band === 'sealed' || terminus.band === 'terminal')) {
      clamps.push('terminus clamp');
    }
    if (!clamps.length) clamps.push('horizon buffer');

    rows.push({
      regionId: rid,
      lockScore: op10mA11Round(lockScore),
      band: lockBand(lockScore),
      clamps: clamps.slice(0, 3),
      narrative: `${rid} absolute collapse horizon lock ${lockBand(lockScore)} (${op10mA11Round(lockScore)}); ${clamps.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.lockScore - a.lockScore), nationalIndex };
}

export function op10mA11RegionsWithAbsoluteCollapseHorizonLock(
  rows: OP10M_A11_AbsoluteCollapseHorizonLockRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'sealed' || r.band === 'absolute').map((r) => r.regionId);
}

export function op10mA11AbsoluteCollapseHorizonLockEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 52;
  return currentIndex >= 46 && currentIndex > priorIndex + 6;
}
