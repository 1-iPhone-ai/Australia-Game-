import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityCosmismRow,
  OP10M_A11_CollapseOmniSingularityPantheismBand,
  OP10M_A11_CollapseOmniSingularityPantheismRow,
  OP10M_A11_ExistentialAbsoluteNullityRatificationRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionDepletionRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function pantheismBand(score: number): OP10M_A11_CollapseOmniSingularityPantheismBand {
  if (score < 32) return 'latent';
  if (score < 48) return 'aligning';
  if (score < 65) return 'total';
  return 'pantheism';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityPantheism(args: {
  collapseOmniSingularityCosmism: OP10M_A11_CollapseOmniSingularityCosmismRow[];
  voidTotalErosionDepletion: OP10M_A11_VoidTotalErosionDepletionRow[];
  existentialAbsoluteNullityRatification: OP10M_A11_ExistentialAbsoluteNullityRatificationRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityPantheismRow[]; nationalIndex: number } {
  const cosmismByRegion = new Map(args.collapseOmniSingularityCosmism.map((c) => [c.regionId, c]));
  const depletionByRegion = new Map(args.voidTotalErosionDepletion.map((d) => [d.regionId, d]));
  const ratificationByRegion = new Map(args.existentialAbsoluteNullityRatification.map((r) => [r.regionId, r]));

  const rows: OP10M_A11_CollapseOmniSingularityPantheismRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const cosmism = cosmismByRegion.get(rid);
    const depletion = depletionByRegion.get(rid);
    const ratification = ratificationByRegion.get(rid);

    const cosmismDrag = cosmism ? op10mA11Clamp(cosmism.cosmismScore * 0.55) : 24;
    const depletionDrag = depletion ? op10mA11Clamp(depletion.depletionScore * 0.51) : 22;
    const ratificationDrag = ratification ? op10mA11Clamp(ratification.ratificationScore * 0.48) : 21;

    const pantheismScore = op10mA11Clamp(cosmismDrag + depletionDrag + ratificationDrag * 0.59);
    weighted += pantheismScore;

    const marks: string[] = [];
    if (cosmism && (cosmism.band === 'total' || cosmism.band === 'cosmism')) {
      marks.push('cosmism pantheism');
    }
    if (depletion && (depletion.band === 'total' || depletion.band === 'complete_depletion')) {
      marks.push('depletion pantheism');
    }
    if (ratification && (ratification.band === 'absolute' || ratification.band === 'total_ratification')) {
      marks.push('ratification pantheism');
    }
    if (!marks.length) marks.push('pantheism latent');

    rows.push({
      regionId: rid,
      pantheismScore: op10mA11Round(pantheismScore),
      band: pantheismBand(pantheismScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} collapse omni singularity pantheism ${pantheismBand(pantheismScore)} (${op10mA11Round(pantheismScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.pantheismScore - a.pantheismScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityPantheism(
  rows: OP10M_A11_CollapseOmniSingularityPantheismRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'pantheism').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityPantheismEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 64;
  return currentIndex >= 58 && currentIndex > priorIndex + 6;
}
