import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPanmonismRow,
  OP10M_A11_CollapseOmniSingularityPansophismBand,
  OP10M_A11_CollapseOmniSingularityPansophismRow,
  OP10M_A11_ExistentialAbsoluteNullityDeificationRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionIonizationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function pansophismBand(score: number): OP10M_A11_CollapseOmniSingularityPansophismBand {
  if (score < 33) return 'latent';
  if (score < 49) return 'aligning';
  if (score < 66) return 'total';
  return 'pansophism';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityPansophism(args: {
  collapseOmniSingularityPanmonism: OP10M_A11_CollapseOmniSingularityPanmonismRow[];
  voidTotalErosionIonization: OP10M_A11_VoidTotalErosionIonizationRow[];
  existentialAbsoluteNullityDeification: OP10M_A11_ExistentialAbsoluteNullityDeificationRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityPansophismRow[]; nationalIndex: number } {
  const panmonismByRegion = new Map(args.collapseOmniSingularityPanmonism.map((p) => [p.regionId, p]));
  const ionizationByRegion = new Map(args.voidTotalErosionIonization.map((e) => [e.regionId, e]));
  const deificationByRegion = new Map(args.existentialAbsoluteNullityDeification.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_CollapseOmniSingularityPansophismRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const panmonism = panmonismByRegion.get(rid);
    const ionization = ionizationByRegion.get(rid);
    const deification = deificationByRegion.get(rid);

    const panmonismDrag = panmonism ? op10mA11Clamp(panmonism.panmonismScore * 0.54) : 24;
    const ionizationDrag = ionization ? op10mA11Clamp(ionization.ionizationScore * 0.52) : 22;
    const deificationDrag = deification ? op10mA11Clamp(deification.deificationScore * 0.47) : 21;

    const pansophismScore = op10mA11Clamp(panmonismDrag + ionizationDrag + deificationDrag * 0.58);
    weighted += pansophismScore;

    const marks: string[] = [];
    if (panmonism && (panmonism.band === 'total' || panmonism.band === 'panmonism')) {
      marks.push('panmonism pansophism');
    }
    if (ionization && (ionization.band === 'total' || ionization.band === 'complete_ionization')) {
      marks.push('ionization pansophism');
    }
    if (deification && (deification.band === 'absolute' || deification.band === 'total_deification')) {
      marks.push('deification pansophism');
    }
    if (!marks.length) marks.push('pansophism latent');

    rows.push({
      regionId: rid,
      pansophismScore: op10mA11Round(pansophismScore),
      band: pansophismBand(pansophismScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} collapse omni singularity pansophism ${pansophismBand(pansophismScore)} (${op10mA11Round(pansophismScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.pansophismScore - a.pansophismScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityPansophism(
  rows: OP10M_A11_CollapseOmniSingularityPansophismRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'pansophism').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityPansophismEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 65;
  return currentIndex >= 59 && currentIndex > priorIndex + 6;
}
