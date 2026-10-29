import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityTotalismRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionAblationBand,
  OP10M_A11_VoidTotalErosionAblationRow,
  OP10M_A11_VoidTotalErosionAttritionRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function ablationBand(score: number): OP10M_A11_VoidTotalErosionAblationBand {
  if (score < 29) return 'dormant';
  if (score < 45) return 'ablating';
  if (score < 62) return 'total';
  return 'complete_ablation';
}

export function op10mA11ComputeInterregionalVoidTotalErosionAblation(args: {
  voidTotalErosionAttrition: OP10M_A11_VoidTotalErosionAttritionRow[];
  collapseOmniSingularityTotalism: OP10M_A11_CollapseOmniSingularityTotalismRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionAblationRow[]; nationalIndex: number } {
  const attritionByRegion = new Map(args.voidTotalErosionAttrition.map((a) => [a.regionId, a]));
  const totalismByRegion = new Map(args.collapseOmniSingularityTotalism.map((t) => [t.regionId, t]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionAblationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const attrition = attritionByRegion.get(rid);
    const totalism = totalismByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const attritionDrag = attrition ? op10mA11Clamp(attrition.attritionScore * 0.51) : 21;
    const totalismDrag = totalism ? op10mA11Clamp(totalism.totalismScore * 0.47) : 19;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.44) : 18;

    const ablationScore = op10mA11Clamp(attritionDrag + totalismDrag + frontDrag * 0.54);
    weighted += ablationScore;

    const phases: string[] = [];
    if (attrition && (attrition.band === 'total' || attrition.band === 'complete_attrition')) {
      phases.push('attrition ablate');
    }
    if (totalism && (totalism.band === 'total' || totalism.band === 'totalism')) {
      phases.push('totalism ablate');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front ablate');
    }
    if (!phases.length) phases.push('ablation dormant');

    rows.push({
      regionId: rid,
      ablationScore: op10mA11Round(ablationScore),
      band: ablationBand(ablationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion ablation ${ablationBand(ablationScore)} (${op10mA11Round(ablationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.ablationScore - a.ablationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionAblation(
  rows: OP10M_A11_VoidTotalErosionAblationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_ablation').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionAblationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 63;
  return currentIndex >= 57 && currentIndex > priorIndex + 6;
}
