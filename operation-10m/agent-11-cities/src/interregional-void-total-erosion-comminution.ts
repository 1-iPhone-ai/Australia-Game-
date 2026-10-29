import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityHolismRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionComminutionBand,
  OP10M_A11_VoidTotalErosionComminutionRow,
  OP10M_A11_VoidTotalErosionGranulationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function comminutionBand(score: number): OP10M_A11_VoidTotalErosionComminutionBand {
  if (score < 27) return 'dormant';
  if (score < 43) return 'comminuting';
  if (score < 60) return 'total';
  return 'complete_comminution';
}

export function op10mA11ComputeInterregionalVoidTotalErosionComminution(args: {
  voidTotalErosionGranulation: OP10M_A11_VoidTotalErosionGranulationRow[];
  collapseOmniSingularityHolism: OP10M_A11_CollapseOmniSingularityHolismRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionComminutionRow[]; nationalIndex: number } {
  const granulationByRegion = new Map(args.voidTotalErosionGranulation.map((g) => [g.regionId, g]));
  const holismByRegion = new Map(args.collapseOmniSingularityHolism.map((h) => [h.regionId, h]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionComminutionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const granulation = granulationByRegion.get(rid);
    const holism = holismByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const granulationDrag = granulation ? op10mA11Clamp(granulation.granulationScore * 0.49) : 19;
    const holismDrag = holism ? op10mA11Clamp(holism.holismScore * 0.45) : 17;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.42) : 16;

    const comminutionScore = op10mA11Clamp(granulationDrag + holismDrag + frontDrag * 0.52);
    weighted += comminutionScore;

    const phases: string[] = [];
    if (granulation && (granulation.band === 'total' || granulation.band === 'complete_granulation')) {
      phases.push('granulation comminute');
    }
    if (holism && (holism.band === 'total' || holism.band === 'holism')) {
      phases.push('holism comminute');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front comminute');
    }
    if (!phases.length) phases.push('comminution dormant');

    rows.push({
      regionId: rid,
      comminutionScore: op10mA11Round(comminutionScore),
      band: comminutionBand(comminutionScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion comminution ${comminutionBand(comminutionScore)} (${op10mA11Round(comminutionScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.comminutionScore - a.comminutionScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionComminution(
  rows: OP10M_A11_VoidTotalErosionComminutionRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_comminution').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionComminutionEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 61;
  return currentIndex >= 55 && currentIndex > priorIndex + 6;
}
