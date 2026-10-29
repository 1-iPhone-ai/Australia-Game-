import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityTotalismRow,
  OP10M_A11_CollapseOmniSingularityUniversalismBand,
  OP10M_A11_CollapseOmniSingularityUniversalismRow,
  OP10M_A11_ExistentialAbsoluteNullityFinalityRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionAttritionRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function universalismBand(score: number): OP10M_A11_CollapseOmniSingularityUniversalismBand {
  if (score < 30) return 'latent';
  if (score < 46) return 'aligning';
  if (score < 63) return 'total';
  return 'universalism';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityUniversalism(args: {
  collapseOmniSingularityTotalism: OP10M_A11_CollapseOmniSingularityTotalismRow[];
  voidTotalErosionAttrition: OP10M_A11_VoidTotalErosionAttritionRow[];
  existentialAbsoluteNullityFinality: OP10M_A11_ExistentialAbsoluteNullityFinalityRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityUniversalismRow[]; nationalIndex: number } {
  const totalismByRegion = new Map(args.collapseOmniSingularityTotalism.map((t) => [t.regionId, t]));
  const attritionByRegion = new Map(args.voidTotalErosionAttrition.map((a) => [a.regionId, a]));
  const finalityByRegion = new Map(args.existentialAbsoluteNullityFinality.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_CollapseOmniSingularityUniversalismRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const totalism = totalismByRegion.get(rid);
    const attrition = attritionByRegion.get(rid);
    const finality = finalityByRegion.get(rid);

    const totalismDrag = totalism ? op10mA11Clamp(totalism.totalismScore * 0.53) : 22;
    const attritionDrag = attrition ? op10mA11Clamp(attrition.attritionScore * 0.49) : 20;
    const finalityDrag = finality ? op10mA11Clamp(finality.finalityScore * 0.46) : 19;

    const universalismScore = op10mA11Clamp(totalismDrag + attritionDrag + finalityDrag * 0.57);
    weighted += universalismScore;

    const marks: string[] = [];
    if (totalism && (totalism.band === 'total' || totalism.band === 'totalism')) {
      marks.push('totalism universalism');
    }
    if (attrition && (attrition.band === 'total' || attrition.band === 'complete_attrition')) {
      marks.push('attrition universalism');
    }
    if (finality && (finality.band === 'absolute' || finality.band === 'total_finality')) {
      marks.push('finality universalism');
    }
    if (!marks.length) marks.push('universalism latent');

    rows.push({
      regionId: rid,
      universalismScore: op10mA11Round(universalismScore),
      band: universalismBand(universalismScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} collapse omni singularity universalism ${universalismBand(universalismScore)} (${op10mA11Round(universalismScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.universalismScore - a.universalismScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityUniversalism(
  rows: OP10M_A11_CollapseOmniSingularityUniversalismRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'universalism').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityUniversalismEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 62;
  return currentIndex >= 56 && currentIndex > priorIndex + 6;
}
