import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseAbsoluteSingularityCulminationRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidCompleteErosionExtinctionRow,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionAnnihilationBand,
  OP10M_A11_VoidTotalErosionAnnihilationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function annihilationBand(score: number): OP10M_A11_VoidTotalErosionAnnihilationBand {
  if (score < 20) return 'inactive';
  if (score < 36) return 'annihilating';
  if (score < 53) return 'total';
  return 'complete_annihilation';
}

export function op10mA11ComputeInterregionalVoidTotalErosionAnnihilation(args: {
  voidCompleteErosionExtinction: OP10M_A11_VoidCompleteErosionExtinctionRow[];
  collapseAbsoluteSingularityCulmination: OP10M_A11_CollapseAbsoluteSingularityCulminationRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionAnnihilationRow[]; nationalIndex: number } {
  const extinctionByRegion = new Map(args.voidCompleteErosionExtinction.map((e) => [e.regionId, e]));
  const culminationByRegion = new Map(args.collapseAbsoluteSingularityCulmination.map((c) => [c.regionId, c]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionAnnihilationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const extinction = extinctionByRegion.get(rid);
    const culmination = culminationByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const extinctionDrag = extinction ? op10mA11Clamp(extinction.extinctionScore * 0.56) : 18;
    const culminationDrag = culmination ? op10mA11Clamp(culmination.culminationScore * 0.52) : 16;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.49) : 15;

    const annihilationScore = op10mA11Clamp(extinctionDrag + culminationDrag + frontDrag * 0.59);
    weighted += annihilationScore;

    const phases: string[] = [];
    if (extinction && (extinction.band === 'complete' || extinction.band === 'total_extinction')) {
      phases.push('extinction annihilate');
    }
    if (culmination && (culmination.band === 'total' || culmination.band === 'culmination')) {
      phases.push('culmination annihilate');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front annihilate');
    }
    if (!phases.length) phases.push('annihilation inactive');

    rows.push({
      regionId: rid,
      annihilationScore: op10mA11Round(annihilationScore),
      band: annihilationBand(annihilationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion annihilation ${annihilationBand(annihilationScore)} (${op10mA11Round(annihilationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.annihilationScore - a.annihilationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionAnnihilation(
  rows: OP10M_A11_VoidTotalErosionAnnihilationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_annihilation').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionAnnihilationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 54;
  return currentIndex >= 48 && currentIndex > priorIndex + 6;
}
