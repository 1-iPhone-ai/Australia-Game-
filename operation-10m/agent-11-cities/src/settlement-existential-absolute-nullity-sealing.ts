import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityTotalismRow,
  OP10M_A11_ExistentialAbsoluteNullityFinalityRow,
  OP10M_A11_ExistentialAbsoluteNullitySealingBand,
  OP10M_A11_ExistentialAbsoluteNullitySealingRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function sealingBand(score: number): OP10M_A11_ExistentialAbsoluteNullitySealingBand {
  if (score < 31) return 'trace';
  if (score < 47) return 'sealing';
  if (score < 64) return 'absolute';
  return 'total_sealing';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullitySealing(args: {
  existentialAbsoluteNullityFinality: OP10M_A11_ExistentialAbsoluteNullityFinalityRow[];
  collapseOmniSingularityTotalism: OP10M_A11_CollapseOmniSingularityTotalismRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullitySealingRow[]; nationalIndex: number } {
  const finalityByRegion = new Map(args.existentialAbsoluteNullityFinality.map((f) => [f.regionId, f]));
  const totalismByRegion = new Map(args.collapseOmniSingularityTotalism.map((t) => [t.regionId, t]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullitySealingRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const finality = finalityByRegion.get(rid);
    const totalism = totalismByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const finalityDrag = finality ? op10mA11Clamp(finality.finalityScore * 0.5) : 21;
    const totalismDrag = totalism ? op10mA11Clamp(totalism.totalismScore * 0.46) : 19;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.47) : 18;

    const sealingScore = op10mA11Clamp(finalityDrag + totalismDrag + sentenceDrag * 0.58);
    weighted += sealingScore;

    const marks: string[] = [];
    if (finality && (finality.band === 'absolute' || finality.band === 'total_finality')) {
      marks.push('finality sealing');
    }
    if (totalism && (totalism.band === 'total' || totalism.band === 'totalism')) {
      marks.push('totalism sealing');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence sealing');
    }
    if (!marks.length) marks.push('sealing trace');

    rows.push({
      regionId: rid,
      sealingScore: op10mA11Round(sealingScore),
      band: sealingBand(sealingScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity sealing ${sealingBand(sealingScore)} (${op10mA11Round(sealingScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.sealingScore - a.sealingScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullitySealing(
  rows: OP10M_A11_ExistentialAbsoluteNullitySealingRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_sealing').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullitySealingEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 64;
  return currentIndex >= 58 && currentIndex > priorIndex + 6;
}
