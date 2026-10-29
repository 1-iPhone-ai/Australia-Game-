import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityUniversalismRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionAblationRow,
  OP10M_A11_VoidTotalErosionDepletionBand,
  OP10M_A11_VoidTotalErosionDepletionRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function depletionBand(score: number): OP10M_A11_VoidTotalErosionDepletionBand {
  if (score < 30) return 'dormant';
  if (score < 46) return 'depleting';
  if (score < 63) return 'total';
  return 'complete_depletion';
}

export function op10mA11ComputeInterregionalVoidTotalErosionDepletion(args: {
  voidTotalErosionAblation: OP10M_A11_VoidTotalErosionAblationRow[];
  collapseOmniSingularityUniversalism: OP10M_A11_CollapseOmniSingularityUniversalismRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionDepletionRow[]; nationalIndex: number } {
  const ablationByRegion = new Map(args.voidTotalErosionAblation.map((a) => [a.regionId, a]));
  const universalismByRegion = new Map(args.collapseOmniSingularityUniversalism.map((u) => [u.regionId, u]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionDepletionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const ablation = ablationByRegion.get(rid);
    const universalism = universalismByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const ablationDrag = ablation ? op10mA11Clamp(ablation.ablationScore * 0.52) : 22;
    const universalismDrag = universalism ? op10mA11Clamp(universalism.universalismScore * 0.48) : 20;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.45) : 19;

    const depletionScore = op10mA11Clamp(ablationDrag + universalismDrag + frontDrag * 0.55);
    weighted += depletionScore;

    const phases: string[] = [];
    if (ablation && (ablation.band === 'total' || ablation.band === 'complete_ablation')) {
      phases.push('ablation deplete');
    }
    if (universalism && (universalism.band === 'total' || universalism.band === 'universalism')) {
      phases.push('universalism deplete');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front deplete');
    }
    if (!phases.length) phases.push('depletion dormant');

    rows.push({
      regionId: rid,
      depletionScore: op10mA11Round(depletionScore),
      band: depletionBand(depletionScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion depletion ${depletionBand(depletionScore)} (${op10mA11Round(depletionScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.depletionScore - a.depletionScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionDepletion(
  rows: OP10M_A11_VoidTotalErosionDepletionRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_depletion').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionDepletionEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 64;
  return currentIndex >= 58 && currentIndex > priorIndex + 6;
}
