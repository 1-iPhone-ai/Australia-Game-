import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityMonismRow,
  OP10M_A11_CollapseOmniSingularityTotalismBand,
  OP10M_A11_CollapseOmniSingularityTotalismRow,
  OP10M_A11_ExistentialAbsoluteNullityConvictionRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionComminutionRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function totalismBand(score: number): OP10M_A11_CollapseOmniSingularityTotalismBand {
  if (score < 29) return 'latent';
  if (score < 45) return 'aligning';
  if (score < 62) return 'total';
  return 'totalism';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityTotalism(args: {
  collapseOmniSingularityMonism: OP10M_A11_CollapseOmniSingularityMonismRow[];
  voidTotalErosionComminution: OP10M_A11_VoidTotalErosionComminutionRow[];
  existentialAbsoluteNullityConviction: OP10M_A11_ExistentialAbsoluteNullityConvictionRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityTotalismRow[]; nationalIndex: number } {
  const monismByRegion = new Map(args.collapseOmniSingularityMonism.map((m) => [m.regionId, m]));
  const comminutionByRegion = new Map(args.voidTotalErosionComminution.map((c) => [c.regionId, c]));
  const convictionByRegion = new Map(args.existentialAbsoluteNullityConviction.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_CollapseOmniSingularityTotalismRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const monism = monismByRegion.get(rid);
    const comminution = comminutionByRegion.get(rid);
    const conviction = convictionByRegion.get(rid);

    const monismDrag = monism ? op10mA11Clamp(monism.monismScore * 0.52) : 21;
    const comminutionDrag = comminution ? op10mA11Clamp(comminution.comminutionScore * 0.48) : 19;
    const convictionDrag = conviction ? op10mA11Clamp(conviction.convictionScore * 0.45) : 18;

    const totalismScore = op10mA11Clamp(monismDrag + comminutionDrag + convictionDrag * 0.56);
    weighted += totalismScore;

    const marks: string[] = [];
    if (monism && (monism.band === 'total' || monism.band === 'monism')) {
      marks.push('monism totalism');
    }
    if (comminution && (comminution.band === 'total' || comminution.band === 'complete_comminution')) {
      marks.push('comminution totalism');
    }
    if (conviction && (conviction.band === 'absolute' || conviction.band === 'total_conviction')) {
      marks.push('conviction totalism');
    }
    if (!marks.length) marks.push('totalism latent');

    rows.push({
      regionId: rid,
      totalismScore: op10mA11Round(totalismScore),
      band: totalismBand(totalismScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} collapse omni singularity totalism ${totalismBand(totalismScore)} (${op10mA11Round(totalismScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.totalismScore - a.totalismScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityTotalism(
  rows: OP10M_A11_CollapseOmniSingularityTotalismRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'totalism').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityTotalismEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 61;
  return currentIndex >= 55 && currentIndex > priorIndex + 6;
}
