import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPanpsychismRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionDissipationBand,
  OP10M_A11_VoidTotalErosionDissipationRow,
  OP10M_A11_VoidTotalErosionAttenuationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function dissipationBand(score: number): OP10M_A11_VoidTotalErosionDissipationBand {
  if (score < 32) return 'dormant';
  if (score < 48) return 'dissipating';
  if (score < 65) return 'total';
  return 'complete_dissipation';
}

export function op10mA11ComputeInterregionalVoidTotalErosionDissipation(args: {
  voidTotalErosionAttenuation: OP10M_A11_VoidTotalErosionAttenuationRow[];
  collapseOmniSingularityPanpsychism: OP10M_A11_CollapseOmniSingularityPanpsychismRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionDissipationRow[]; nationalIndex: number } {
  const attenuationByRegion = new Map(args.voidTotalErosionAttenuation.map((e) => [e.regionId, e]));
  const panpsychismByRegion = new Map(args.collapseOmniSingularityPanpsychism.map((p) => [p.regionId, p]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionDissipationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const attenuation = attenuationByRegion.get(rid);
    const panpsychism = panpsychismByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const attenuationDrag = attenuation ? op10mA11Clamp(attenuation.attenuationScore * 0.54) : 23;
    const panpsychismDrag = panpsychism ? op10mA11Clamp(panpsychism.panpsychismScore * 0.5) : 21;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.47) : 20;

    const dissipationScore = op10mA11Clamp(attenuationDrag + panpsychismDrag + frontDrag * 0.57);
    weighted += dissipationScore;

    const phases: string[] = [];
    if (attenuation && (attenuation.band === 'total' || attenuation.band === 'complete_dissipation')) {
      phases.push('attenuation enervate');
    }
    if (panpsychism && (panpsychism.band === 'total' || panpsychism.band === 'panpsychism')) {
      phases.push('panpsychism enervate');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front enervate');
    }
    if (!phases.length) phases.push('dissipation dormant');

    rows.push({
      regionId: rid,
      dissipationScore: op10mA11Round(dissipationScore),
      band: dissipationBand(dissipationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion dissipation ${dissipationBand(dissipationScore)} (${op10mA11Round(dissipationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.dissipationScore - a.dissipationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionDissipation(
  rows: OP10M_A11_VoidTotalErosionDissipationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_dissipation').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionDissipationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 66;
  return currentIndex >= 60 && currentIndex > priorIndex + 6;
}
