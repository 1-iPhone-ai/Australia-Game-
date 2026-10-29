import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPantheismRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionEnervationBand,
  OP10M_A11_VoidTotalErosionEnervationRow,
  OP10M_A11_VoidTotalErosionExhaustionRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function enervationBand(score: number): OP10M_A11_VoidTotalErosionEnervationBand {
  if (score < 32) return 'dormant';
  if (score < 48) return 'enervating';
  if (score < 65) return 'total';
  return 'complete_enervation';
}

export function op10mA11ComputeInterregionalVoidTotalErosionEnervation(args: {
  voidTotalErosionExhaustion: OP10M_A11_VoidTotalErosionExhaustionRow[];
  collapseOmniSingularityPantheism: OP10M_A11_CollapseOmniSingularityPantheismRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionEnervationRow[]; nationalIndex: number } {
  const exhaustionByRegion = new Map(args.voidTotalErosionExhaustion.map((e) => [e.regionId, e]));
  const pantheismByRegion = new Map(args.collapseOmniSingularityPantheism.map((p) => [p.regionId, p]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionEnervationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const exhaustion = exhaustionByRegion.get(rid);
    const pantheism = pantheismByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const exhaustionDrag = exhaustion ? op10mA11Clamp(exhaustion.exhaustionScore * 0.54) : 23;
    const pantheismDrag = pantheism ? op10mA11Clamp(pantheism.pantheismScore * 0.5) : 21;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.47) : 20;

    const enervationScore = op10mA11Clamp(exhaustionDrag + pantheismDrag + frontDrag * 0.57);
    weighted += enervationScore;

    const phases: string[] = [];
    if (exhaustion && (exhaustion.band === 'total' || exhaustion.band === 'complete_exhaustion')) {
      phases.push('exhaustion enervate');
    }
    if (pantheism && (pantheism.band === 'total' || pantheism.band === 'pantheism')) {
      phases.push('pantheism enervate');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front enervate');
    }
    if (!phases.length) phases.push('enervation dormant');

    rows.push({
      regionId: rid,
      enervationScore: op10mA11Round(enervationScore),
      band: enervationBand(enervationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion enervation ${enervationBand(enervationScore)} (${op10mA11Round(enervationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.enervationScore - a.enervationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionEnervation(
  rows: OP10M_A11_VoidTotalErosionEnervationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_enervation').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionEnervationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 66;
  return currentIndex >= 60 && currentIndex > priorIndex + 6;
}
