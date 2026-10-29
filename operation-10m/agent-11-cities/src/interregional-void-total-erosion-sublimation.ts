import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityConsolidationRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionDissolutionRow,
  OP10M_A11_VoidTotalErosionSublimationBand,
  OP10M_A11_VoidTotalErosionSublimationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function sublimationBand(score: number): OP10M_A11_VoidTotalErosionSublimationBand {
  if (score < 23) return 'dormant';
  if (score < 39) return 'sublimating';
  if (score < 56) return 'total';
  return 'complete_sublimation';
}

export function op10mA11ComputeInterregionalVoidTotalErosionSublimation(args: {
  voidTotalErosionDissolution: OP10M_A11_VoidTotalErosionDissolutionRow[];
  collapseOmniSingularityConsolidation: OP10M_A11_CollapseOmniSingularityConsolidationRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionSublimationRow[]; nationalIndex: number } {
  const dissolutionByRegion = new Map(args.voidTotalErosionDissolution.map((d) => [d.regionId, d]));
  const consolidationByRegion = new Map(args.collapseOmniSingularityConsolidation.map((c) => [c.regionId, c]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionSublimationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const dissolution = dissolutionByRegion.get(rid);
    const consolidation = consolidationByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const dissolutionDrag = dissolution ? op10mA11Clamp(dissolution.dissolutionScore * 0.51) : 18;
    const consolidationDrag = consolidation ? op10mA11Clamp(consolidation.consolidationScore * 0.47) : 16;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.44) : 15;

    const sublimationScore = op10mA11Clamp(dissolutionDrag + consolidationDrag + frontDrag * 0.54);
    weighted += sublimationScore;

    const phases: string[] = [];
    if (dissolution && (dissolution.band === 'total' || dissolution.band === 'complete_dissolution')) {
      phases.push('dissolution sublimate');
    }
    if (consolidation && (consolidation.band === 'total' || consolidation.band === 'consolidation')) {
      phases.push('consolidation sublimate');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front sublimate');
    }
    if (!phases.length) phases.push('sublimation dormant');

    rows.push({
      regionId: rid,
      sublimationScore: op10mA11Round(sublimationScore),
      band: sublimationBand(sublimationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion sublimation ${sublimationBand(sublimationScore)} (${op10mA11Round(sublimationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.sublimationScore - a.sublimationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionSublimation(
  rows: OP10M_A11_VoidTotalErosionSublimationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_sublimation').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionSublimationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 57;
  return currentIndex >= 51 && currentIndex > priorIndex + 6;
}
