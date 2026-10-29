import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseAbsoluteSingularityCulminationRow,
  OP10M_A11_ExistentialAbsoluteNullityMandateBand,
  OP10M_A11_ExistentialAbsoluteNullityMandateRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_ExistentialTotalNullityDecreeRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function mandateBand(score: number): OP10M_A11_ExistentialAbsoluteNullityMandateBand {
  if (score < 22) return 'trace';
  if (score < 38) return 'mandating';
  if (score < 55) return 'absolute';
  return 'total_mandate';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityMandate(args: {
  existentialTotalNullityDecree: OP10M_A11_ExistentialTotalNullityDecreeRow[];
  collapseAbsoluteSingularityCulmination: OP10M_A11_CollapseAbsoluteSingularityCulminationRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityMandateRow[]; nationalIndex: number } {
  const decreeByRegion = new Map(args.existentialTotalNullityDecree.map((d) => [d.regionId, d]));
  const culminationByRegion = new Map(args.collapseAbsoluteSingularityCulmination.map((c) => [c.regionId, c]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityMandateRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const decree = decreeByRegion.get(rid);
    const culmination = culminationByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const decreeDrag = decree ? op10mA11Clamp(decree.decreeScore * 0.55) : 18;
    const culminationDrag = culmination ? op10mA11Clamp(culmination.culminationScore * 0.51) : 16;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.52) : 15;

    const mandateScore = op10mA11Clamp(decreeDrag + culminationDrag + sentenceDrag * 0.63);
    weighted += mandateScore;

    const marks: string[] = [];
    if (decree && (decree.band === 'total' || decree.band === 'absolute_decree')) {
      marks.push('decree mandate');
    }
    if (culmination && (culmination.band === 'total' || culmination.band === 'culmination')) {
      marks.push('culmination mandate');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence mandate');
    }
    if (!marks.length) marks.push('mandate trace');

    rows.push({
      regionId: rid,
      mandateScore: op10mA11Round(mandateScore),
      band: mandateBand(mandateScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity mandate ${mandateBand(mandateScore)} (${op10mA11Round(mandateScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.mandateScore - a.mandateScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityMandate(
  rows: OP10M_A11_ExistentialAbsoluteNullityMandateRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_mandate').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityMandateEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 55;
  return currentIndex >= 49 && currentIndex > priorIndex + 6;
}
