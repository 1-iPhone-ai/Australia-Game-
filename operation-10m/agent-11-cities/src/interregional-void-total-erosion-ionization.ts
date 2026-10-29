import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPanidealismRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionIonizationBand,
  OP10M_A11_VoidTotalErosionIonizationRow,
  OP10M_A11_VoidTotalErosionDissipationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function ionizationBand(score: number): OP10M_A11_VoidTotalErosionIonizationBand {
  if (score < 32) return 'dormant';
  if (score < 48) return 'ionizing';
  if (score < 65) return 'total';
  return 'complete_ionization';
}

export function op10mA11ComputeInterregionalVoidTotalErosionIonization(args: {
  voidTotalErosionEvaporation: OP10M_A11_VoidTotalErosionDissipationRow[];
  collapseOmniSingularityPantheosis: OP10M_A11_CollapseOmniSingularityPanidealismRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionIonizationRow[]; nationalIndex: number } {
  const dissipationByRegion = new Map(args.voidTotalErosionEvaporation.map((e) => [e.regionId, e]));
  const panidealismByRegion = new Map(args.collapseOmniSingularityPantheosis.map((p) => [p.regionId, p]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionIonizationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const dissipation = dissipationByRegion.get(rid);
    const panidealism = panidealismByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const dissipationDrag = dissipation ? op10mA11Clamp(dissipation.evaporationScore * 0.54) : 23;
    const panidealismDrag = panidealism ? op10mA11Clamp(panidealism.pantheosisScore * 0.5) : 21;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.47) : 20;

    const ionizationScore = op10mA11Clamp(dissipationDrag + panidealismDrag + frontDrag * 0.57);
    weighted += ionizationScore;

    const phases: string[] = [];
    if (dissipation && (dissipation.band === 'total' || dissipation.band === 'complete_ionization')) {
      phases.push('dissipation enervate');
    }
    if (panidealism && (panidealism.band === 'total' || panidealism.band === 'panidealism')) {
      phases.push('panidealism enervate');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front enervate');
    }
    if (!phases.length) phases.push('ionization dormant');

    rows.push({
      regionId: rid,
      ionizationScore: op10mA11Round(ionizationScore),
      band: ionizationBand(ionizationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion ionization ${ionizationBand(ionizationScore)} (${op10mA11Round(ionizationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.ionizationScore - a.ionizationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionIonization(
  rows: OP10M_A11_VoidTotalErosionIonizationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_ionization').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionIonizationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 66;
  return currentIndex >= 60 && currentIndex > priorIndex + 6;
}
