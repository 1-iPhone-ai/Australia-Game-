import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityAmalgamationRow,
  OP10M_A11_ExistentialAbsoluteNullityDeterminismBand,
  OP10M_A11_ExistentialAbsoluteNullityDeterminismRow,
  OP10M_A11_ExistentialAbsoluteNullityInevitabilityRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function determinismBand(score: number): OP10M_A11_ExistentialAbsoluteNullityDeterminismBand {
  if (score < 27) return 'trace';
  if (score < 43) return 'determined';
  if (score < 60) return 'absolute';
  return 'total_determinism';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityDeterminism(args: {
  existentialAbsoluteNullityInevitability: OP10M_A11_ExistentialAbsoluteNullityInevitabilityRow[];
  collapseOmniSingularityAmalgamation: OP10M_A11_CollapseOmniSingularityAmalgamationRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityDeterminismRow[]; nationalIndex: number } {
  const inevitabilityByRegion = new Map(args.existentialAbsoluteNullityInevitability.map((i) => [i.regionId, i]));
  const amalgamationByRegion = new Map(args.collapseOmniSingularityAmalgamation.map((a) => [a.regionId, a]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityDeterminismRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const inevitability = inevitabilityByRegion.get(rid);
    const amalgamation = amalgamationByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const inevitabilityDrag = inevitability ? op10mA11Clamp(inevitability.inevitabilityScore * 0.48) : 18;
    const amalgamationDrag = amalgamation ? op10mA11Clamp(amalgamation.amalgamationScore * 0.44) : 16;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.45) : 15;

    const determinismScore = op10mA11Clamp(inevitabilityDrag + amalgamationDrag + sentenceDrag * 0.56);
    weighted += determinismScore;

    const marks: string[] = [];
    if (inevitability && (inevitability.band === 'absolute' || inevitability.band === 'total_inevitability')) {
      marks.push('inevitability determine');
    }
    if (amalgamation && (amalgamation.band === 'total' || amalgamation.band === 'amalgamation')) {
      marks.push('amalgamation determine');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence determine');
    }
    if (!marks.length) marks.push('determinism trace');

    rows.push({
      regionId: rid,
      determinismScore: op10mA11Round(determinismScore),
      band: determinismBand(determinismScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity determinism ${determinismBand(determinismScore)} (${op10mA11Round(determinismScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.determinismScore - a.determinismScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityDeterminism(
  rows: OP10M_A11_ExistentialAbsoluteNullityDeterminismRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_determinism').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityDeterminismEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 60;
  return currentIndex >= 54 && currentIndex > priorIndex + 6;
}
