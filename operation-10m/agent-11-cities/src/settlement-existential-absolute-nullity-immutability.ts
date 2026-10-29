import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityUnificationRow,
  OP10M_A11_ExistentialAbsoluteNullityImmutabilityBand,
  OP10M_A11_ExistentialAbsoluteNullityImmutabilityRow,
  OP10M_A11_ExistentialAbsoluteNullityPerpetuityRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function immutabilityBand(score: number): OP10M_A11_ExistentialAbsoluteNullityImmutabilityBand {
  if (score < 24) return 'trace';
  if (score < 40) return 'immutable';
  if (score < 57) return 'absolute';
  return 'total_immutability';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityImmutability(args: {
  existentialAbsoluteNullityPerpetuity: OP10M_A11_ExistentialAbsoluteNullityPerpetuityRow[];
  collapseOmniSingularityUnification: OP10M_A11_CollapseOmniSingularityUnificationRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityImmutabilityRow[]; nationalIndex: number } {
  const perpetuityByRegion = new Map(args.existentialAbsoluteNullityPerpetuity.map((p) => [p.regionId, p]));
  const unificationByRegion = new Map(args.collapseOmniSingularityUnification.map((u) => [u.regionId, u]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityImmutabilityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const perpetuity = perpetuityByRegion.get(rid);
    const unification = unificationByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const perpetuityDrag = perpetuity ? op10mA11Clamp(perpetuity.perpetuityScore * 0.51) : 18;
    const unificationDrag = unification ? op10mA11Clamp(unification.unificationScore * 0.47) : 16;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.48) : 15;

    const immutabilityScore = op10mA11Clamp(perpetuityDrag + unificationDrag + sentenceDrag * 0.59);
    weighted += immutabilityScore;

    const marks: string[] = [];
    if (perpetuity && (perpetuity.band === 'absolute' || perpetuity.band === 'total_perpetuity')) {
      marks.push('perpetuity immutabilize');
    }
    if (unification && (unification.band === 'total' || unification.band === 'unification')) {
      marks.push('unification immutabilize');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence immutabilize');
    }
    if (!marks.length) marks.push('immutability trace');

    rows.push({
      regionId: rid,
      immutabilityScore: op10mA11Round(immutabilityScore),
      band: immutabilityBand(immutabilityScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity immutability ${immutabilityBand(immutabilityScore)} (${op10mA11Round(immutabilityScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.immutabilityScore - a.immutabilityScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityImmutability(
  rows: OP10M_A11_ExistentialAbsoluteNullityImmutabilityRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_immutability').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityImmutabilityEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 57;
  return currentIndex >= 51 && currentIndex > priorIndex + 6;
}
