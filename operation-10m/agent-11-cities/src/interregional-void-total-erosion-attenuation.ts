import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPanentheismRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionAttenuationBand,
  OP10M_A11_VoidTotalErosionAttenuationRow,
  OP10M_A11_VoidTotalErosionEnervationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function attenuationBand(score: number): OP10M_A11_VoidTotalErosionAttenuationBand {
  if (score < 32) return 'dormant';
  if (score < 48) return 'attenuating';
  if (score < 65) return 'total';
  return 'complete_attenuation';
}

export function op10mA11ComputeInterregionalVoidTotalErosionAttenuation(args: {
  voidTotalErosionEnervation: OP10M_A11_VoidTotalErosionEnervationRow[];
  collapseOmniSingularityPanentheism: OP10M_A11_CollapseOmniSingularityPanentheismRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionAttenuationRow[]; nationalIndex: number } {
  const enervationByRegion = new Map(args.voidTotalErosionEnervation.map((e) => [e.regionId, e]));
  const panentheismByRegion = new Map(args.collapseOmniSingularityPanentheism.map((p) => [p.regionId, p]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionAttenuationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const enervation = enervationByRegion.get(rid);
    const panentheism = panentheismByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const enervationDrag = enervation ? op10mA11Clamp(enervation.enervationScore * 0.54) : 23;
    const panentheismDrag = panentheism ? op10mA11Clamp(panentheism.panentheismScore * 0.5) : 21;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.47) : 20;

    const attenuationScore = op10mA11Clamp(enervationDrag + panentheismDrag + frontDrag * 0.57);
    weighted += attenuationScore;

    const phases: string[] = [];
    if (enervation && (enervation.band === 'total' || enervation.band === 'complete_attenuation')) {
      phases.push('enervation enervate');
    }
    if (panentheism && (panentheism.band === 'total' || panentheism.band === 'panentheism')) {
      phases.push('panentheism enervate');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front enervate');
    }
    if (!phases.length) phases.push('attenuation dormant');

    rows.push({
      regionId: rid,
      attenuationScore: op10mA11Round(attenuationScore),
      band: attenuationBand(attenuationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion attenuation ${attenuationBand(attenuationScore)} (${op10mA11Round(attenuationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.attenuationScore - a.attenuationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionAttenuation(
  rows: OP10M_A11_VoidTotalErosionAttenuationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_attenuation').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionAttenuationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 66;
  return currentIndex >= 60 && currentIndex > priorIndex + 6;
}
