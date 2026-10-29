import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseExistenceSingularityPointBand,
  OP10M_A11_CollapseExistenceSingularityPointRow,
  OP10M_A11_ExistentialNullStateLockRow,
  OP10M_A11_RegionId,
  OP10M_A11_UltimateCollapseSingularitySealRow,
  OP10M_A11_VoidAnnihilationConvergenceRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function pointBand(score: number): OP10M_A11_CollapseExistenceSingularityPointBand {
  if (score < 20) return 'remote';
  if (score < 36) return 'converging';
  if (score < 53) return 'singular';
  return 'existential';
}

export function op10mA11ComputeRegionalCollapseExistenceSingularityPoint(args: {
  ultimateCollapseSingularitySeal: OP10M_A11_UltimateCollapseSingularitySealRow[];
  voidAnnihilationConvergence: OP10M_A11_VoidAnnihilationConvergenceRow[];
  existentialNullStateLock: OP10M_A11_ExistentialNullStateLockRow[];
}): { rows: OP10M_A11_CollapseExistenceSingularityPointRow[]; nationalIndex: number } {
  const sealByRegion = new Map(args.ultimateCollapseSingularitySeal.map((s) => [s.regionId, s]));
  const annihilationByRegion = new Map(args.voidAnnihilationConvergence.map((v) => [v.regionId, v]));
  const nullByRegion = new Map(args.existentialNullStateLock.map((n) => [n.regionId, n]));

  const rows: OP10M_A11_CollapseExistenceSingularityPointRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const seal = sealByRegion.get(rid);
    const annihilation = annihilationByRegion.get(rid);
    const nullLock = nullByRegion.get(rid);

    const sealDrag = seal ? op10mA11Clamp(seal.sealScore * 0.49) : 14;
    const annihilationDrag = annihilation ? op10mA11Clamp(annihilation.convergenceScore * 0.46) : 12;
    const nullDrag = nullLock ? op10mA11Clamp(nullLock.nullScore * 0.43) : 11;

    const pointScore = op10mA11Clamp(sealDrag + annihilationDrag + nullDrag * 0.52);
    weighted += pointScore;

    const axes: string[] = [];
    if (seal && (seal.band === 'sealed' || seal.band === 'ultimate')) {
      axes.push('seal singularity');
    }
    if (annihilation && (annihilation.band === 'annihilating' || annihilation.band === 'total')) {
      axes.push('void annihilation');
    }
    if (nullLock && (nullLock.band === 'null' || nullLock.band === 'absolute_null')) {
      axes.push('null-state axis');
    }
    if (!axes.length) axes.push('existence stable');

    rows.push({
      regionId: rid,
      pointScore: op10mA11Round(pointScore),
      band: pointBand(pointScore),
      axes: axes.slice(0, 3),
      narrative: `${rid} collapse existence singularity point ${pointBand(pointScore)} (${op10mA11Round(pointScore)}); ${axes.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.pointScore - a.pointScore), nationalIndex };
}

export function op10mA11RegionsWithExistentialSingularityPoint(
  rows: OP10M_A11_CollapseExistenceSingularityPointRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'singular' || r.band === 'existential').map((r) => r.regionId);
}

export function op10mA11CollapseExistenceSingularityPointEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 6;
}
