import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPanpsychismRow,
  OP10M_A11_CollapseOmniSingularityPanidealismBand,
  OP10M_A11_CollapseOmniSingularityPanidealismRow,
  OP10M_A11_ExistentialAbsoluteNullityConsecrationRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionAttenuationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function panidealismBand(score: number): OP10M_A11_CollapseOmniSingularityPanidealismBand {
  if (score < 33) return 'latent';
  if (score < 49) return 'aligning';
  if (score < 66) return 'total';
  return 'panidealism';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityPanidealism(args: {
  collapseOmniSingularityPanpsychism: OP10M_A11_CollapseOmniSingularityPanpsychismRow[];
  voidTotalErosionAttenuation: OP10M_A11_VoidTotalErosionAttenuationRow[];
  existentialAbsoluteNullityConsecration: OP10M_A11_ExistentialAbsoluteNullityConsecrationRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityPanidealismRow[]; nationalIndex: number } {
  const panpsychismByRegion = new Map(args.collapseOmniSingularityPanpsychism.map((p) => [p.regionId, p]));
  const attenuationByRegion = new Map(args.voidTotalErosionAttenuation.map((e) => [e.regionId, e]));
  const consecrationByRegion = new Map(args.existentialAbsoluteNullityConsecration.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_CollapseOmniSingularityPanidealismRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const panpsychism = panpsychismByRegion.get(rid);
    const attenuation = attenuationByRegion.get(rid);
    const consecration = consecrationByRegion.get(rid);

    const panpsychismDrag = panpsychism ? op10mA11Clamp(panpsychism.panpsychismScore * 0.54) : 24;
    const attenuationDrag = attenuation ? op10mA11Clamp(attenuation.attenuationScore * 0.52) : 22;
    const consecrationDrag = consecration ? op10mA11Clamp(consecration.consecrationScore * 0.47) : 21;

    const panidealismScore = op10mA11Clamp(panpsychismDrag + attenuationDrag + consecrationDrag * 0.58);
    weighted += panidealismScore;

    const marks: string[] = [];
    if (panpsychism && (panpsychism.band === 'total' || panpsychism.band === 'panpsychism')) {
      marks.push('panpsychism panidealism');
    }
    if (attenuation && (attenuation.band === 'total' || attenuation.band === 'complete_attenuation')) {
      marks.push('attenuation panidealism');
    }
    if (consecration && (consecration.band === 'absolute' || consecration.band === 'total_consecration')) {
      marks.push('consecration panidealism');
    }
    if (!marks.length) marks.push('panidealism latent');

    rows.push({
      regionId: rid,
      panidealismScore: op10mA11Round(panidealismScore),
      band: panidealismBand(panidealismScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} collapse omni singularity panidealism ${panidealismBand(panidealismScore)} (${op10mA11Round(panidealismScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.panidealismScore - a.panidealismScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityPanidealism(
  rows: OP10M_A11_CollapseOmniSingularityPanidealismRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'panidealism').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityPanidealismEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 65;
  return currentIndex >= 59 && currentIndex > priorIndex + 6;
}
