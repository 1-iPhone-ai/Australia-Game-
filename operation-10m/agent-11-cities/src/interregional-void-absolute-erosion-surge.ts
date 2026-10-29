import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseExistenceSingularityPointRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidAbsoluteErosionSurgeBand,
  OP10M_A11_VoidAbsoluteErosionSurgeRow,
  OP10M_A11_VoidAnnihilationConvergenceRow,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function surgeBand(score: number): OP10M_A11_VoidAbsoluteErosionSurgeBand {
  if (score < 17) return 'trace';
  if (score < 33) return 'surging';
  if (score < 50) return 'absolute';
  return 'omni_erosion';
}

export function op10mA11ComputeInterregionalVoidAbsoluteErosionSurge(args: {
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
  collapseExistenceSingularityPoint: OP10M_A11_CollapseExistenceSingularityPointRow[];
  voidAnnihilationConvergence: OP10M_A11_VoidAnnihilationConvergenceRow[];
}): { rows: OP10M_A11_VoidAbsoluteErosionSurgeRow[]; nationalIndex: number } {
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));
  const pointByRegion = new Map(args.collapseExistenceSingularityPoint.map((p) => [p.regionId, p]));
  const annihilationByRegion = new Map(args.voidAnnihilationConvergence.map((v) => [v.regionId, v]));

  const rows: OP10M_A11_VoidAbsoluteErosionSurgeRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const front = frontByRegion.get(rid);
    const point = pointByRegion.get(rid);
    const annihilation = annihilationByRegion.get(rid);

    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.52) : 13;
    const pointDrag = point ? op10mA11Clamp(point.pointScore * 0.46) : 12;
    const annihilationDrag = annihilation ? op10mA11Clamp(annihilation.convergenceScore * 0.41) : 10;

    const surgeScore = op10mA11Clamp(frontDrag + pointDrag + annihilationDrag * 0.51);
    weighted += surgeScore;

    const pulses: string[] = [];
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      pulses.push('front erosion');
    }
    if (point && (point.band === 'singular' || point.band === 'existential')) {
      pulses.push('point erosion');
    }
    if (annihilation && (annihilation.band === 'annihilating' || annihilation.band === 'total')) {
      pulses.push('annihilation pulse');
    }
    if (!pulses.length) pulses.push('erosion trace');

    rows.push({
      regionId: rid,
      surgeScore: op10mA11Round(surgeScore),
      band: surgeBand(surgeScore),
      pulses: pulses.slice(0, 3),
      narrative: `${rid} void absolute erosion surge ${surgeBand(surgeScore)} (${op10mA11Round(surgeScore)}); ${pulses.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.surgeScore - a.surgeScore), nationalIndex };
}

export function op10mA11RegionsWithOmniVoidErosion(
  rows: OP10M_A11_VoidAbsoluteErosionSurgeRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'omni_erosion').map((r) => r.regionId);
}

export function op10mA11VoidAbsoluteErosionSurgeEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 6;
}
