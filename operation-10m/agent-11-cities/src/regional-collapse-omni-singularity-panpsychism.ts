import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPanentheismRow,
  OP10M_A11_CollapseOmniSingularityPanpsychismBand,
  OP10M_A11_CollapseOmniSingularityPanpsychismRow,
  OP10M_A11_ExistentialAbsoluteNullitySanctificationRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionEnervationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function panpsychismBand(score: number): OP10M_A11_CollapseOmniSingularityPanpsychismBand {
  if (score < 33) return 'latent';
  if (score < 49) return 'aligning';
  if (score < 66) return 'total';
  return 'panpsychism';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityPanpsychism(args: {
  collapseOmniSingularityPanentheism: OP10M_A11_CollapseOmniSingularityPanentheismRow[];
  voidTotalErosionEnervation: OP10M_A11_VoidTotalErosionEnervationRow[];
  existentialAbsoluteNullitySanctification: OP10M_A11_ExistentialAbsoluteNullitySanctificationRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityPanpsychismRow[]; nationalIndex: number } {
  const panentheismByRegion = new Map(args.collapseOmniSingularityPanentheism.map((p) => [p.regionId, p]));
  const enervationByRegion = new Map(args.voidTotalErosionEnervation.map((e) => [e.regionId, e]));
  const sanctificationByRegion = new Map(args.existentialAbsoluteNullitySanctification.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_CollapseOmniSingularityPanpsychismRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const panentheism = panentheismByRegion.get(rid);
    const enervation = enervationByRegion.get(rid);
    const sanctification = sanctificationByRegion.get(rid);

    const panentheismDrag = panentheism ? op10mA11Clamp(panentheism.panentheismScore * 0.54) : 24;
    const enervationDrag = enervation ? op10mA11Clamp(enervation.enervationScore * 0.52) : 22;
    const sanctificationDrag = sanctification ? op10mA11Clamp(sanctification.sanctificationScore * 0.47) : 21;

    const panpsychismScore = op10mA11Clamp(panentheismDrag + enervationDrag + sanctificationDrag * 0.58);
    weighted += panpsychismScore;

    const marks: string[] = [];
    if (panentheism && (panentheism.band === 'total' || panentheism.band === 'panentheism')) {
      marks.push('panentheism panpsychism');
    }
    if (enervation && (enervation.band === 'total' || enervation.band === 'complete_enervation')) {
      marks.push('enervation panpsychism');
    }
    if (sanctification && (sanctification.band === 'absolute' || sanctification.band === 'total_sanctification')) {
      marks.push('sanctification panpsychism');
    }
    if (!marks.length) marks.push('panpsychism latent');

    rows.push({
      regionId: rid,
      panpsychismScore: op10mA11Round(panpsychismScore),
      band: panpsychismBand(panpsychismScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} collapse omni singularity panpsychism ${panpsychismBand(panpsychismScore)} (${op10mA11Round(panpsychismScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.panpsychismScore - a.panpsychismScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityPanpsychism(
  rows: OP10M_A11_CollapseOmniSingularityPanpsychismRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'panpsychism').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityPanpsychismEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 65;
  return currentIndex >= 59 && currentIndex > priorIndex + 6;
}
