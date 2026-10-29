import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPanmonismRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionDissociationBand,
  OP10M_A11_VoidTotalErosionDissociationRow,
  OP10M_A11_VoidTotalErosionIonizationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function dissociationBand(score: number): OP10M_A11_VoidTotalErosionDissociationBand {
  if (score < 32) return 'dormant';
  if (score < 48) return 'dissociating';
  if (score < 65) return 'total';
  return 'complete_dissociation';
}

export function op10mA11ComputeInterregionalVoidTotalErosionDissociation(args: {
  voidTotalErosionIonization: OP10M_A11_VoidTotalErosionIonizationRow[];
  collapseOmniSingularityPanmonism: OP10M_A11_CollapseOmniSingularityPanmonismRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionDissociationRow[]; nationalIndex: number } {
  const ionizationByRegion = new Map(args.voidTotalErosionIonization.map((e) => [e.regionId, e]));
  const panmonismByRegion = new Map(args.collapseOmniSingularityPanmonism.map((p) => [p.regionId, p]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionDissociationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const ionization = ionizationByRegion.get(rid);
    const panmonism = panmonismByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const ionizationDrag = ionization ? op10mA11Clamp(ionization.ionizationScore * 0.54) : 23;
    const panmonismDrag = panmonism ? op10mA11Clamp(panmonism.panmonismScore * 0.5) : 21;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.47) : 20;

    const dissociationScore = op10mA11Clamp(ionizationDrag + panmonismDrag + frontDrag * 0.57);
    weighted += dissociationScore;

    const phases: string[] = [];
    if (ionization && (ionization.band === 'total' || ionization.band === 'complete_dissociation')) {
      phases.push('ionization enervate');
    }
    if (panmonism && (panmonism.band === 'total' || panmonism.band === 'panmonism')) {
      phases.push('panmonism enervate');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front enervate');
    }
    if (!phases.length) phases.push('dissociation dormant');

    rows.push({
      regionId: rid,
      dissociationScore: op10mA11Round(dissociationScore),
      band: dissociationBand(dissociationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion dissociation ${dissociationBand(dissociationScore)} (${op10mA11Round(dissociationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.dissociationScore - a.dissociationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionDissociation(
  rows: OP10M_A11_VoidTotalErosionDissociationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_dissociation').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionDissociationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 66;
  return currentIndex >= 60 && currentIndex > priorIndex + 6;
}
