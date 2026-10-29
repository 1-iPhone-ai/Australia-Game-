import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityConvergenceRow,
  OP10M_A11_ExistentialAbsoluteNullityBindingRow,
  OP10M_A11_ExistentialAbsoluteNullityContinuityBand,
  OP10M_A11_ExistentialAbsoluteNullityContinuityRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function continuityBand(score: number): OP10M_A11_ExistentialAbsoluteNullityContinuityBand {
  if (score < 23) return 'trace';
  if (score < 39) return 'continuity';
  if (score < 56) return 'absolute';
  return 'total_continuity';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityContinuity(args: {
  existentialAbsoluteNullityBinding: OP10M_A11_ExistentialAbsoluteNullityBindingRow[];
  collapseOmniSingularityConvergence: OP10M_A11_CollapseOmniSingularityConvergenceRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityContinuityRow[]; nationalIndex: number } {
  const bindingByRegion = new Map(args.existentialAbsoluteNullityBinding.map((b) => [b.regionId, b]));
  const convergenceByRegion = new Map(args.collapseOmniSingularityConvergence.map((c) => [c.regionId, c]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityContinuityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const binding = bindingByRegion.get(rid);
    const convergence = convergenceByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const bindingDrag = binding ? op10mA11Clamp(binding.bindingScore * 0.53) : 18;
    const convergenceDrag = convergence ? op10mA11Clamp(convergence.convergenceScore * 0.49) : 16;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.5) : 15;

    const continuityScore = op10mA11Clamp(bindingDrag + convergenceDrag + sentenceDrag * 0.61);
    weighted += continuityScore;

    const marks: string[] = [];
    if (binding && (binding.band === 'absolute' || binding.band === 'total_binding')) {
      marks.push('binding continue');
    }
    if (convergence && (convergence.band === 'total' || convergence.band === 'convergence')) {
      marks.push('convergence continue');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence continue');
    }
    if (!marks.length) marks.push('continuity trace');

    rows.push({
      regionId: rid,
      continuityScore: op10mA11Round(continuityScore),
      band: continuityBand(continuityScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity continuity ${continuityBand(continuityScore)} (${op10mA11Round(continuityScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.continuityScore - a.continuityScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityContinuity(
  rows: OP10M_A11_ExistentialAbsoluteNullityContinuityRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_continuity').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityContinuityEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 56;
  return currentIndex >= 50 && currentIndex > priorIndex + 6;
}
