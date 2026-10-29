import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityUnificationRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionDissolutionBand,
  OP10M_A11_VoidTotalErosionDissolutionRow,
  OP10M_A11_VoidTotalErosionEliminationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function dissolutionBand(score: number): OP10M_A11_VoidTotalErosionDissolutionBand {
  if (score < 22) return 'dormant';
  if (score < 38) return 'dissolving';
  if (score < 55) return 'total';
  return 'complete_dissolution';
}

export function op10mA11ComputeInterregionalVoidTotalErosionDissolution(args: {
  voidTotalErosionElimination: OP10M_A11_VoidTotalErosionEliminationRow[];
  collapseOmniSingularityUnification: OP10M_A11_CollapseOmniSingularityUnificationRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionDissolutionRow[]; nationalIndex: number } {
  const eliminationByRegion = new Map(args.voidTotalErosionElimination.map((e) => [e.regionId, e]));
  const unificationByRegion = new Map(args.collapseOmniSingularityUnification.map((u) => [u.regionId, u]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionDissolutionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const elimination = eliminationByRegion.get(rid);
    const unification = unificationByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const eliminationDrag = elimination ? op10mA11Clamp(elimination.eliminationScore * 0.52) : 18;
    const unificationDrag = unification ? op10mA11Clamp(unification.unificationScore * 0.48) : 16;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.45) : 15;

    const dissolutionScore = op10mA11Clamp(eliminationDrag + unificationDrag + frontDrag * 0.55);
    weighted += dissolutionScore;

    const phases: string[] = [];
    if (elimination && (elimination.band === 'total' || elimination.band === 'complete_elimination')) {
      phases.push('elimination dissolve');
    }
    if (unification && (unification.band === 'total' || unification.band === 'unification')) {
      phases.push('unification dissolve');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front dissolve');
    }
    if (!phases.length) phases.push('dissolution dormant');

    rows.push({
      regionId: rid,
      dissolutionScore: op10mA11Round(dissolutionScore),
      band: dissolutionBand(dissolutionScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion dissolution ${dissolutionBand(dissolutionScore)} (${op10mA11Round(dissolutionScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.dissolutionScore - a.dissolutionScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionDissolution(
  rows: OP10M_A11_VoidTotalErosionDissolutionRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_dissolution').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionDissolutionEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 56;
  return currentIndex >= 50 && currentIndex > priorIndex + 6;
}
