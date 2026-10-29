import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityMonismRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionAttritionBand,
  OP10M_A11_VoidTotalErosionAttritionRow,
  OP10M_A11_VoidTotalErosionComminutionRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function attritionBand(score: number): OP10M_A11_VoidTotalErosionAttritionBand {
  if (score < 28) return 'dormant';
  if (score < 44) return 'attriting';
  if (score < 61) return 'total';
  return 'complete_attrition';
}

export function op10mA11ComputeInterregionalVoidTotalErosionAttrition(args: {
  voidTotalErosionComminution: OP10M_A11_VoidTotalErosionComminutionRow[];
  collapseOmniSingularityMonism: OP10M_A11_CollapseOmniSingularityMonismRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionAttritionRow[]; nationalIndex: number } {
  const comminutionByRegion = new Map(args.voidTotalErosionComminution.map((c) => [c.regionId, c]));
  const monismByRegion = new Map(args.collapseOmniSingularityMonism.map((m) => [m.regionId, m]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionAttritionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const comminution = comminutionByRegion.get(rid);
    const monism = monismByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const comminutionDrag = comminution ? op10mA11Clamp(comminution.comminutionScore * 0.5) : 20;
    const monismDrag = monism ? op10mA11Clamp(monism.monismScore * 0.46) : 18;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.43) : 17;

    const attritionScore = op10mA11Clamp(comminutionDrag + monismDrag + frontDrag * 0.53);
    weighted += attritionScore;

    const phases: string[] = [];
    if (comminution && (comminution.band === 'total' || comminution.band === 'complete_comminution')) {
      phases.push('comminution attrite');
    }
    if (monism && (monism.band === 'total' || monism.band === 'monism')) {
      phases.push('monism attrite');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front attrite');
    }
    if (!phases.length) phases.push('attrition dormant');

    rows.push({
      regionId: rid,
      attritionScore: op10mA11Round(attritionScore),
      band: attritionBand(attritionScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion attrition ${attritionBand(attritionScore)} (${op10mA11Round(attritionScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.attritionScore - a.attritionScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionAttrition(
  rows: OP10M_A11_VoidTotalErosionAttritionRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_attrition').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionAttritionEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 62;
  return currentIndex >= 56 && currentIndex > priorIndex + 6;
}
