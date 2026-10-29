import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityMonismRow,
  OP10M_A11_ExistentialAbsoluteNullityConvictionRow,
  OP10M_A11_ExistentialAbsoluteNullityFinalityBand,
  OP10M_A11_ExistentialAbsoluteNullityFinalityRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function finalityBand(score: number): OP10M_A11_ExistentialAbsoluteNullityFinalityBand {
  if (score < 30) return 'trace';
  if (score < 46) return 'settling';
  if (score < 63) return 'absolute';
  return 'total_finality';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityFinality(args: {
  existentialAbsoluteNullityConviction: OP10M_A11_ExistentialAbsoluteNullityConvictionRow[];
  collapseOmniSingularityMonism: OP10M_A11_CollapseOmniSingularityMonismRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityFinalityRow[]; nationalIndex: number } {
  const convictionByRegion = new Map(args.existentialAbsoluteNullityConviction.map((c) => [c.regionId, c]));
  const monismByRegion = new Map(args.collapseOmniSingularityMonism.map((m) => [m.regionId, m]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityFinalityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const conviction = convictionByRegion.get(rid);
    const monism = monismByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const convictionDrag = conviction ? op10mA11Clamp(conviction.convictionScore * 0.49) : 20;
    const monismDrag = monism ? op10mA11Clamp(monism.monismScore * 0.45) : 18;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.46) : 17;

    const finalityScore = op10mA11Clamp(convictionDrag + monismDrag + sentenceDrag * 0.57);
    weighted += finalityScore;

    const marks: string[] = [];
    if (conviction && (conviction.band === 'absolute' || conviction.band === 'total_conviction')) {
      marks.push('conviction finality');
    }
    if (monism && (monism.band === 'total' || monism.band === 'monism')) {
      marks.push('monism finality');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence finality');
    }
    if (!marks.length) marks.push('finality trace');

    rows.push({
      regionId: rid,
      finalityScore: op10mA11Round(finalityScore),
      band: finalityBand(finalityScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity finality ${finalityBand(finalityScore)} (${op10mA11Round(finalityScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.finalityScore - a.finalityScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityFinality(
  rows: OP10M_A11_ExistentialAbsoluteNullityFinalityRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_finality').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityFinalityEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 63;
  return currentIndex >= 57 && currentIndex > priorIndex + 6;
}
