import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityUniversalismRow,
  OP10M_A11_ExistentialAbsoluteNullityRatificationBand,
  OP10M_A11_ExistentialAbsoluteNullityRatificationRow,
  OP10M_A11_ExistentialAbsoluteNullitySealingRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function ratificationBand(score: number): OP10M_A11_ExistentialAbsoluteNullityRatificationBand {
  if (score < 32) return 'trace';
  if (score < 48) return 'ratifying';
  if (score < 65) return 'absolute';
  return 'total_ratification';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityRatification(args: {
  existentialAbsoluteNullitySealing: OP10M_A11_ExistentialAbsoluteNullitySealingRow[];
  collapseOmniSingularityUniversalism: OP10M_A11_CollapseOmniSingularityUniversalismRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityRatificationRow[]; nationalIndex: number } {
  const sealingByRegion = new Map(args.existentialAbsoluteNullitySealing.map((s) => [s.regionId, s]));
  const universalismByRegion = new Map(args.collapseOmniSingularityUniversalism.map((u) => [u.regionId, u]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityRatificationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const sealing = sealingByRegion.get(rid);
    const universalism = universalismByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const sealingDrag = sealing ? op10mA11Clamp(sealing.sealingScore * 0.51) : 22;
    const universalismDrag = universalism ? op10mA11Clamp(universalism.universalismScore * 0.47) : 20;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.48) : 19;

    const ratificationScore = op10mA11Clamp(sealingDrag + universalismDrag + sentenceDrag * 0.59);
    weighted += ratificationScore;

    const marks: string[] = [];
    if (sealing && (sealing.band === 'absolute' || sealing.band === 'total_sealing')) {
      marks.push('sealing ratification');
    }
    if (universalism && (universalism.band === 'total' || universalism.band === 'universalism')) {
      marks.push('universalism ratification');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence ratification');
    }
    if (!marks.length) marks.push('ratification trace');

    rows.push({
      regionId: rid,
      ratificationScore: op10mA11Round(ratificationScore),
      band: ratificationBand(ratificationScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity ratification ${ratificationBand(ratificationScore)} (${op10mA11Round(ratificationScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.ratificationScore - a.ratificationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityRatification(
  rows: OP10M_A11_ExistentialAbsoluteNullityRatificationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_ratification').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityRatificationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 65;
  return currentIndex >= 59 && currentIndex > priorIndex + 6;
}
