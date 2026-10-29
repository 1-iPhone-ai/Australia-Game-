import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_AbsoluteCollapseHorizonLockRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidAnnihilationConvergenceBand,
  OP10M_A11_VoidAnnihilationConvergenceRow,
  OP10M_A11_VoidFinalizationCascadeRow,
  OP10M_A11_VoidTotalizationSurgeRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function convergenceBand(score: number): OP10M_A11_VoidAnnihilationConvergenceBand {
  if (score < 21) return 'diffuse';
  if (score < 37) return 'focusing';
  if (score < 54) return 'annihilating';
  return 'total';
}

export function op10mA11ComputeInterregionalVoidAnnihilationConvergence(args: {
  voidFinalizationCascade: OP10M_A11_VoidFinalizationCascadeRow[];
  absoluteCollapseHorizonLock: OP10M_A11_AbsoluteCollapseHorizonLockRow[];
  voidTotalizationSurge: OP10M_A11_VoidTotalizationSurgeRow[];
}): { rows: OP10M_A11_VoidAnnihilationConvergenceRow[]; nationalIndex: number } {
  const cascadeByRegion = new Map(args.voidFinalizationCascade.map((v) => [v.regionId, v]));
  const lockByRegion = new Map(args.absoluteCollapseHorizonLock.map((a) => [a.regionId, a]));
  const surgeByRegion = new Map(args.voidTotalizationSurge.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_VoidAnnihilationConvergenceRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const cascade = cascadeByRegion.get(rid);
    const lock = lockByRegion.get(rid);
    const surge = surgeByRegion.get(rid);

    const cascadeDrag = cascade ? op10mA11Clamp(cascade.cascadeScore * 0.48) : 13;
    const lockDrag = lock ? op10mA11Clamp(lock.lockScore * 0.43) : 12;
    const surgeDrag = surge ? op10mA11Clamp(surge.surgeScore * 0.39) : 10;

    const convergenceScore = op10mA11Clamp(cascadeDrag + lockDrag + surgeDrag * 0.49);
    weighted += convergenceScore;

    const vectors: string[] = [];
    if (cascade && (cascade.band === 'finalizing' || cascade.band === 'complete')) {
      vectors.push('finalization vector');
    }
    if (lock && (lock.band === 'sealed' || lock.band === 'absolute')) {
      vectors.push('horizon clamp');
    }
    if (surge && (surge.band === 'totalizing' || surge.band === 'absolute')) {
      vectors.push('totalization front');
    }
    if (!vectors.length) vectors.push('annihilation dormant');

    rows.push({
      regionId: rid,
      convergenceScore: op10mA11Round(convergenceScore),
      band: convergenceBand(convergenceScore),
      vectors: vectors.slice(0, 3),
      narrative: `${rid} void annihilation convergence ${convergenceBand(convergenceScore)} (${op10mA11Round(convergenceScore)}); ${vectors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.convergenceScore - a.convergenceScore), nationalIndex };
}

export function op10mA11RegionsWithTotalVoidAnnihilation(
  rows: OP10M_A11_VoidAnnihilationConvergenceRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'annihilating' || r.band === 'total').map((r) => r.regionId);
}

export function op10mA11VoidAnnihilationConvergenceEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 52;
  return currentIndex >= 46 && currentIndex > priorIndex + 6;
}
