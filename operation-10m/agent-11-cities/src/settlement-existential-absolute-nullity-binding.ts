import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularitySynthesisRow,
  OP10M_A11_ExistentialAbsoluteNullityBindingBand,
  OP10M_A11_ExistentialAbsoluteNullityBindingRow,
  OP10M_A11_ExistentialAbsoluteNullityMandateRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function bindingBand(score: number): OP10M_A11_ExistentialAbsoluteNullityBindingBand {
  if (score < 23) return 'trace';
  if (score < 39) return 'binding';
  if (score < 56) return 'absolute';
  return 'total_binding';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityBinding(args: {
  existentialAbsoluteNullityMandate: OP10M_A11_ExistentialAbsoluteNullityMandateRow[];
  collapseOmniSingularitySynthesis: OP10M_A11_CollapseOmniSingularitySynthesisRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityBindingRow[]; nationalIndex: number } {
  const mandateByRegion = new Map(args.existentialAbsoluteNullityMandate.map((m) => [m.regionId, m]));
  const synthesisByRegion = new Map(args.collapseOmniSingularitySynthesis.map((s) => [s.regionId, s]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityBindingRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const mandate = mandateByRegion.get(rid);
    const synthesis = synthesisByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const mandateDrag = mandate ? op10mA11Clamp(mandate.mandateScore * 0.54) : 18;
    const synthesisDrag = synthesis ? op10mA11Clamp(synthesis.synthesisScore * 0.5) : 16;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.51) : 15;

    const bindingScore = op10mA11Clamp(mandateDrag + synthesisDrag + sentenceDrag * 0.62);
    weighted += bindingScore;

    const marks: string[] = [];
    if (mandate && (mandate.band === 'absolute' || mandate.band === 'total_mandate')) {
      marks.push('mandate bind');
    }
    if (synthesis && (synthesis.band === 'total' || synthesis.band === 'synthesis')) {
      marks.push('synthesis bind');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence bind');
    }
    if (!marks.length) marks.push('binding trace');

    rows.push({
      regionId: rid,
      bindingScore: op10mA11Round(bindingScore),
      band: bindingBand(bindingScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity binding ${bindingBand(bindingScore)} (${op10mA11Round(bindingScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.bindingScore - a.bindingScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityBinding(
  rows: OP10M_A11_ExistentialAbsoluteNullityBindingRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_binding').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityBindingEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 56;
  return currentIndex >= 50 && currentIndex > priorIndex + 6;
}
