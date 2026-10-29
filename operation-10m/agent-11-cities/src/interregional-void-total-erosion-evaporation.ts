import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPanidealismRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionEvaporationBand,
  OP10M_A11_VoidTotalErosionEvaporationRow,
  OP10M_A11_VoidTotalErosionDissipationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function evaporationBand(score: number): OP10M_A11_VoidTotalErosionEvaporationBand {
  if (score < 32) return 'dormant';
  if (score < 48) return 'evaporating';
  if (score < 65) return 'total';
  return 'complete_evaporation';
}

export function op10mA11ComputeInterregionalVoidTotalErosionEvaporation(args: {
  voidTotalErosionDissipation: OP10M_A11_VoidTotalErosionDissipationRow[];
  collapseOmniSingularityPanidealism: OP10M_A11_CollapseOmniSingularityPanidealismRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionEvaporationRow[]; nationalIndex: number } {
  const dissipationByRegion = new Map(args.voidTotalErosionDissipation.map((e) => [e.regionId, e]));
  const panidealismByRegion = new Map(args.collapseOmniSingularityPanidealism.map((p) => [p.regionId, p]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionEvaporationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const dissipation = dissipationByRegion.get(rid);
    const panidealism = panidealismByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const dissipationDrag = dissipation ? op10mA11Clamp(dissipation.dissipationScore * 0.54) : 23;
    const panidealismDrag = panidealism ? op10mA11Clamp(panidealism.panidealismScore * 0.5) : 21;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.47) : 20;

    const evaporationScore = op10mA11Clamp(dissipationDrag + panidealismDrag + frontDrag * 0.57);
    weighted += evaporationScore;

    const phases: string[] = [];
    if (dissipation && (dissipation.band === 'total' || dissipation.band === 'complete_evaporation')) {
      phases.push('dissipation enervate');
    }
    if (panidealism && (panidealism.band === 'total' || panidealism.band === 'panidealism')) {
      phases.push('panidealism enervate');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front enervate');
    }
    if (!phases.length) phases.push('evaporation dormant');

    rows.push({
      regionId: rid,
      evaporationScore: op10mA11Round(evaporationScore),
      band: evaporationBand(evaporationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion evaporation ${evaporationBand(evaporationScore)} (${op10mA11Round(evaporationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.evaporationScore - a.evaporationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionEvaporation(
  rows: OP10M_A11_VoidTotalErosionEvaporationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_evaporation').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionEvaporationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 66;
  return currentIndex >= 60 && currentIndex > priorIndex + 6;
}
