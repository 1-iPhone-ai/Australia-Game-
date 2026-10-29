import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityConvergenceRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionEradicationBand,
  OP10M_A11_VoidTotalErosionEradicationRow,
  OP10M_A11_VoidTotalErosionObliterationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function eradicationBand(score: number): OP10M_A11_VoidTotalErosionEradicationBand {
  if (score < 21) return 'dormant';
  if (score < 37) return 'eradicating';
  if (score < 54) return 'total';
  return 'complete_eradication';
}

export function op10mA11ComputeInterregionalVoidTotalErosionEradication(args: {
  voidTotalErosionObliteration: OP10M_A11_VoidTotalErosionObliterationRow[];
  collapseOmniSingularityConvergence: OP10M_A11_CollapseOmniSingularityConvergenceRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionEradicationRow[]; nationalIndex: number } {
  const obliterationByRegion = new Map(args.voidTotalErosionObliteration.map((o) => [o.regionId, o]));
  const convergenceByRegion = new Map(args.collapseOmniSingularityConvergence.map((c) => [c.regionId, c]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionEradicationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const obliteration = obliterationByRegion.get(rid);
    const convergence = convergenceByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const obliterationDrag = obliteration ? op10mA11Clamp(obliteration.obliterationScore * 0.54) : 18;
    const convergenceDrag = convergence ? op10mA11Clamp(convergence.convergenceScore * 0.5) : 16;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.47) : 15;

    const eradicationScore = op10mA11Clamp(obliterationDrag + convergenceDrag + frontDrag * 0.57);
    weighted += eradicationScore;

    const phases: string[] = [];
    if (obliteration && (obliteration.band === 'total' || obliteration.band === 'complete_obliteration')) {
      phases.push('obliteration eradicate');
    }
    if (convergence && (convergence.band === 'total' || convergence.band === 'convergence')) {
      phases.push('convergence eradicate');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front eradicate');
    }
    if (!phases.length) phases.push('eradication dormant');

    rows.push({
      regionId: rid,
      eradicationScore: op10mA11Round(eradicationScore),
      band: eradicationBand(eradicationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion eradication ${eradicationBand(eradicationScore)} (${op10mA11Round(eradicationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.eradicationScore - a.eradicationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionEradication(
  rows: OP10M_A11_VoidTotalErosionEradicationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_eradication').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionEradicationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 55;
  return currentIndex >= 49 && currentIndex > priorIndex + 6;
}
