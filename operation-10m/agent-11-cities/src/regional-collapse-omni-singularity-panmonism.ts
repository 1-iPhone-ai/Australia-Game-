import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPantheosisRow,
  OP10M_A11_CollapseOmniSingularityPanmonismBand,
  OP10M_A11_CollapseOmniSingularityPanmonismRow,
  OP10M_A11_ExistentialAbsoluteNullityGlorificationRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionEvaporationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function panmonismBand(score: number): OP10M_A11_CollapseOmniSingularityPanmonismBand {
  if (score < 33) return 'latent';
  if (score < 49) return 'aligning';
  if (score < 66) return 'total';
  return 'panmonism';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityPanmonism(args: {
  collapseOmniSingularityPantheosis: OP10M_A11_CollapseOmniSingularityPantheosisRow[];
  voidTotalErosionEvaporation: OP10M_A11_VoidTotalErosionEvaporationRow[];
  existentialAbsoluteNullityGlorification: OP10M_A11_ExistentialAbsoluteNullityGlorificationRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityPanmonismRow[]; nationalIndex: number } {
  const pantheosisByRegion = new Map(args.collapseOmniSingularityPantheosis.map((p) => [p.regionId, p]));
  const evaporationByRegion = new Map(args.voidTotalErosionEvaporation.map((e) => [e.regionId, e]));
  const glorificationByRegion = new Map(args.existentialAbsoluteNullityGlorification.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_CollapseOmniSingularityPanmonismRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const pantheosis = pantheosisByRegion.get(rid);
    const evaporation = evaporationByRegion.get(rid);
    const glorification = glorificationByRegion.get(rid);

    const pantheosisDrag = pantheosis ? op10mA11Clamp(pantheosis.pantheosisScore * 0.54) : 24;
    const evaporationDrag = evaporation ? op10mA11Clamp(evaporation.evaporationScore * 0.52) : 22;
    const glorificationDrag = glorification ? op10mA11Clamp(glorification.glorificationScore * 0.47) : 21;

    const panmonismScore = op10mA11Clamp(pantheosisDrag + evaporationDrag + glorificationDrag * 0.58);
    weighted += panmonismScore;

    const marks: string[] = [];
    if (pantheosis && (pantheosis.band === 'total' || pantheosis.band === 'pantheosis')) {
      marks.push('pantheosis panmonism');
    }
    if (evaporation && (evaporation.band === 'total' || evaporation.band === 'complete_evaporation')) {
      marks.push('evaporation panmonism');
    }
    if (glorification && (glorification.band === 'absolute' || glorification.band === 'total_glorification')) {
      marks.push('glorification panmonism');
    }
    if (!marks.length) marks.push('panmonism latent');

    rows.push({
      regionId: rid,
      panmonismScore: op10mA11Round(panmonismScore),
      band: panmonismBand(panmonismScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} collapse omni singularity panmonism ${panmonismBand(panmonismScore)} (${op10mA11Round(panmonismScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.panmonismScore - a.panmonismScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityPanmonism(
  rows: OP10M_A11_CollapseOmniSingularityPanmonismRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'panmonism').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityPanmonismEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 65;
  return currentIndex >= 59 && currentIndex > priorIndex + 6;
}
