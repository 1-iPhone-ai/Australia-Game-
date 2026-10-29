import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityCoalescenceRow,
  OP10M_A11_ExistentialAbsoluteNullityInevitabilityBand,
  OP10M_A11_ExistentialAbsoluteNullityInevitabilityRow,
  OP10M_A11_ExistentialAbsoluteNullityPermanenceRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function inevitabilityBand(score: number): OP10M_A11_ExistentialAbsoluteNullityInevitabilityBand {
  if (score < 26) return 'trace';
  if (score < 42) return 'inevitable';
  if (score < 59) return 'absolute';
  return 'total_inevitability';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityInevitability(args: {
  existentialAbsoluteNullityPermanence: OP10M_A11_ExistentialAbsoluteNullityPermanenceRow[];
  collapseOmniSingularityCoalescence: OP10M_A11_CollapseOmniSingularityCoalescenceRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityInevitabilityRow[]; nationalIndex: number } {
  const permanenceByRegion = new Map(args.existentialAbsoluteNullityPermanence.map((p) => [p.regionId, p]));
  const coalescenceByRegion = new Map(args.collapseOmniSingularityCoalescence.map((c) => [c.regionId, c]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityInevitabilityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const permanence = permanenceByRegion.get(rid);
    const coalescence = coalescenceByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const permanenceDrag = permanence ? op10mA11Clamp(permanence.permanenceScore * 0.49) : 18;
    const coalescenceDrag = coalescence ? op10mA11Clamp(coalescence.coalescenceScore * 0.45) : 16;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.46) : 15;

    const inevitabilityScore = op10mA11Clamp(permanenceDrag + coalescenceDrag + sentenceDrag * 0.57);
    weighted += inevitabilityScore;

    const marks: string[] = [];
    if (permanence && (permanence.band === 'absolute' || permanence.band === 'total_permanence')) {
      marks.push('permanence inevitable');
    }
    if (coalescence && (coalescence.band === 'total' || coalescence.band === 'coalescence')) {
      marks.push('coalescence inevitable');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence inevitable');
    }
    if (!marks.length) marks.push('inevitability trace');

    rows.push({
      regionId: rid,
      inevitabilityScore: op10mA11Round(inevitabilityScore),
      band: inevitabilityBand(inevitabilityScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity inevitability ${inevitabilityBand(inevitabilityScore)} (${op10mA11Round(inevitabilityScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.inevitabilityScore - a.inevitabilityScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityInevitability(
  rows: OP10M_A11_ExistentialAbsoluteNullityInevitabilityRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_inevitability').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityInevitabilityEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 59;
  return currentIndex >= 53 && currentIndex > priorIndex + 6;
}
