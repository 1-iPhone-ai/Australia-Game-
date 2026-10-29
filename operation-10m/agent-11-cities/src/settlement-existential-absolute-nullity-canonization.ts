import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityCosmismRow,
  OP10M_A11_ExistentialAbsoluteNullityCanonizationBand,
  OP10M_A11_ExistentialAbsoluteNullityCanonizationRow,
  OP10M_A11_ExistentialAbsoluteNullityRatificationRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function canonizationBand(score: number): OP10M_A11_ExistentialAbsoluteNullityCanonizationBand {
  if (score < 33) return 'trace';
  if (score < 49) return 'canonizing';
  if (score < 66) return 'absolute';
  return 'total_canonization';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityCanonization(args: {
  existentialAbsoluteNullityRatification: OP10M_A11_ExistentialAbsoluteNullityRatificationRow[];
  collapseOmniSingularityCosmism: OP10M_A11_CollapseOmniSingularityCosmismRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityCanonizationRow[]; nationalIndex: number } {
  const ratificationByRegion = new Map(args.existentialAbsoluteNullityRatification.map((r) => [r.regionId, r]));
  const cosmismByRegion = new Map(args.collapseOmniSingularityCosmism.map((c) => [c.regionId, c]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityCanonizationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const ratification = ratificationByRegion.get(rid);
    const cosmism = cosmismByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const ratificationDrag = ratification ? op10mA11Clamp(ratification.ratificationScore * 0.52) : 23;
    const cosmismDrag = cosmism ? op10mA11Clamp(cosmism.cosmismScore * 0.48) : 21;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.49) : 20;

    const canonizationScore = op10mA11Clamp(ratificationDrag + cosmismDrag + sentenceDrag * 0.6);
    weighted += canonizationScore;

    const marks: string[] = [];
    if (ratification && (ratification.band === 'absolute' || ratification.band === 'total_ratification')) {
      marks.push('ratification canonization');
    }
    if (cosmism && (cosmism.band === 'total' || cosmism.band === 'cosmism')) {
      marks.push('cosmism canonization');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence canonization');
    }
    if (!marks.length) marks.push('canonization trace');

    rows.push({
      regionId: rid,
      canonizationScore: op10mA11Round(canonizationScore),
      band: canonizationBand(canonizationScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity canonization ${canonizationBand(canonizationScore)} (${op10mA11Round(canonizationScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.canonizationScore - a.canonizationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityCanonization(
  rows: OP10M_A11_ExistentialAbsoluteNullityCanonizationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_canonization').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityCanonizationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 66;
  return currentIndex >= 60 && currentIndex > priorIndex + 6;
}
