import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseTotalSingularityNexusRow,
  OP10M_A11_ExistentialAbsoluteNullityVerdictRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_ExistentialTotalNullityDecreeBand,
  OP10M_A11_ExistentialTotalNullityDecreeRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function decreeBand(score: number): OP10M_A11_ExistentialTotalNullityDecreeBand {
  if (score < 21) return 'trace';
  if (score < 37) return 'decreeing';
  if (score < 54) return 'total';
  return 'absolute_decree';
}

export function op10mA11ComputeSettlementExistentialTotalNullityDecree(args: {
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
  collapseTotalSingularityNexus: OP10M_A11_CollapseTotalSingularityNexusRow[];
  existentialAbsoluteNullityVerdict: OP10M_A11_ExistentialAbsoluteNullityVerdictRow[];
}): { rows: OP10M_A11_ExistentialTotalNullityDecreeRow[]; nationalIndex: number } {
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));
  const nexusByRegion = new Map(args.collapseTotalSingularityNexus.map((n) => [n.regionId, n]));
  const verdictByRegion = new Map(args.existentialAbsoluteNullityVerdict.map((v) => [v.regionId, v]));

  const rows: OP10M_A11_ExistentialTotalNullityDecreeRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const sentence = sentenceByRegion.get(rid);
    const nexus = nexusByRegion.get(rid);
    const verdict = verdictByRegion.get(rid);

    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.54) : 17;
    const nexusDrag = nexus ? op10mA11Clamp(nexus.nexusScore * 0.5) : 15;
    const verdictDrag = verdict ? op10mA11Clamp(verdict.verdictScore * 0.51) : 14;

    const decreeScore = op10mA11Clamp(sentenceDrag + nexusDrag + verdictDrag * 0.62);
    weighted += decreeScore;

    const marks: string[] = [];
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence decree');
    }
    if (nexus && (nexus.band === 'total' || nexus.band === 'nexus')) {
      marks.push('nexus decree');
    }
    if (verdict && (verdict.band === 'absolute' || verdict.band === 'total_verdict')) {
      marks.push('verdict decree');
    }
    if (!marks.length) marks.push('decree trace');

    rows.push({
      regionId: rid,
      decreeScore: op10mA11Round(decreeScore),
      band: decreeBand(decreeScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential total nullity decree ${decreeBand(decreeScore)} (${op10mA11Round(decreeScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.decreeScore - a.decreeScore), nationalIndex };
}

export function op10mA11RegionsWithTotalNullityDecree(
  rows: OP10M_A11_ExistentialTotalNullityDecreeRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'absolute_decree').map((r) => r.regionId);
}

export function op10mA11ExistentialTotalNullityDecreeEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 54;
  return currentIndex >= 48 && currentIndex > priorIndex + 6;
}
