import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityConsolidationRow,
  OP10M_A11_ExistentialAbsoluteNullityImmutabilityRow,
  OP10M_A11_ExistentialAbsoluteNullityPermanenceBand,
  OP10M_A11_ExistentialAbsoluteNullityPermanenceRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function permanenceBand(score: number): OP10M_A11_ExistentialAbsoluteNullityPermanenceBand {
  if (score < 25) return 'trace';
  if (score < 41) return 'permanent';
  if (score < 58) return 'absolute';
  return 'total_permanence';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityPermanence(args: {
  existentialAbsoluteNullityImmutability: OP10M_A11_ExistentialAbsoluteNullityImmutabilityRow[];
  collapseOmniSingularityConsolidation: OP10M_A11_CollapseOmniSingularityConsolidationRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityPermanenceRow[]; nationalIndex: number } {
  const immutabilityByRegion = new Map(args.existentialAbsoluteNullityImmutability.map((i) => [i.regionId, i]));
  const consolidationByRegion = new Map(args.collapseOmniSingularityConsolidation.map((c) => [c.regionId, c]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityPermanenceRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const immutability = immutabilityByRegion.get(rid);
    const consolidation = consolidationByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const immutabilityDrag = immutability ? op10mA11Clamp(immutability.immutabilityScore * 0.5) : 18;
    const consolidationDrag = consolidation ? op10mA11Clamp(consolidation.consolidationScore * 0.46) : 16;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.47) : 15;

    const permanenceScore = op10mA11Clamp(immutabilityDrag + consolidationDrag + sentenceDrag * 0.58);
    weighted += permanenceScore;

    const marks: string[] = [];
    if (immutability && (immutability.band === 'absolute' || immutability.band === 'total_immutability')) {
      marks.push('immutability permanent');
    }
    if (consolidation && (consolidation.band === 'total' || consolidation.band === 'consolidation')) {
      marks.push('consolidation permanent');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence permanent');
    }
    if (!marks.length) marks.push('permanence trace');

    rows.push({
      regionId: rid,
      permanenceScore: op10mA11Round(permanenceScore),
      band: permanenceBand(permanenceScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity permanence ${permanenceBand(permanenceScore)} (${op10mA11Round(permanenceScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.permanenceScore - a.permanenceScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityPermanence(
  rows: OP10M_A11_ExistentialAbsoluteNullityPermanenceRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_permanence').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityPermanenceEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 58;
  return currentIndex >= 52 && currentIndex > priorIndex + 6;
}
