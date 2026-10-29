import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseUltimateSingularityZenithRow,
  OP10M_A11_ExistentialAbsoluteNullityVerdictRow,
  OP10M_A11_ExistentialFinalNullityClosureRow,
  OP10M_A11_ExistentialFinalNullitySentenceBand,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function sentenceBand(score: number): OP10M_A11_ExistentialFinalNullitySentenceBand {
  if (score < 20) return 'trace';
  if (score < 36) return 'sentencing';
  if (score < 53) return 'final';
  return 'total_sentence';
}

export function op10mA11ComputeSettlementExistentialFinalNullitySentence(args: {
  existentialAbsoluteNullityVerdict: OP10M_A11_ExistentialAbsoluteNullityVerdictRow[];
  collapseUltimateSingularityZenith: OP10M_A11_CollapseUltimateSingularityZenithRow[];
  existentialFinalNullityClosure: OP10M_A11_ExistentialFinalNullityClosureRow[];
}): { rows: OP10M_A11_ExistentialFinalNullitySentenceRow[]; nationalIndex: number } {
  const verdictByRegion = new Map(args.existentialAbsoluteNullityVerdict.map((v) => [v.regionId, v]));
  const zenithByRegion = new Map(args.collapseUltimateSingularityZenith.map((z) => [z.regionId, z]));
  const closureByRegion = new Map(args.existentialFinalNullityClosure.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_ExistentialFinalNullitySentenceRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const verdict = verdictByRegion.get(rid);
    const zenith = zenithByRegion.get(rid);
    const closure = closureByRegion.get(rid);

    const verdictDrag = verdict ? op10mA11Clamp(verdict.verdictScore * 0.53) : 16;
    const zenithDrag = zenith ? op10mA11Clamp(zenith.zenithScore * 0.49) : 14;
    const closureDrag = closure ? op10mA11Clamp(closure.closureScore * 0.5) : 13;

    const sentenceScore = op10mA11Clamp(verdictDrag + zenithDrag + closureDrag * 0.6);
    weighted += sentenceScore;

    const marks: string[] = [];
    if (verdict && (verdict.band === 'absolute' || verdict.band === 'total_verdict')) {
      marks.push('verdict sentence');
    }
    if (zenith && (zenith.band === 'total' || zenith.band === 'zenith')) {
      marks.push('zenith sentence');
    }
    if (closure && (closure.band === 'final' || closure.band === 'total_closure')) {
      marks.push('closure sentence');
    }
    if (!marks.length) marks.push('sentence trace');

    rows.push({
      regionId: rid,
      sentenceScore: op10mA11Round(sentenceScore),
      band: sentenceBand(sentenceScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential final nullity sentence ${sentenceBand(sentenceScore)} (${op10mA11Round(sentenceScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.sentenceScore - a.sentenceScore), nationalIndex };
}

export function op10mA11RegionsWithTotalFinalNullitySentence(
  rows: OP10M_A11_ExistentialFinalNullitySentenceRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'final' || r.band === 'total_sentence').map((r) => r.regionId);
}

export function op10mA11ExistentialFinalNullitySentenceEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 53;
  return currentIndex >= 47 && currentIndex > priorIndex + 6;
}
