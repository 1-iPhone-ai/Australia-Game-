import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPanidealismRow,
  OP10M_A11_ExistentialAbsoluteNullityBeatificationRow,
  OP10M_A11_ExistentialAbsoluteNullityGlorificationBand,
  OP10M_A11_ExistentialAbsoluteNullityGlorificationRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function glorificationBand(score: number): OP10M_A11_ExistentialAbsoluteNullityGlorificationBand {
  if (score < 34) return 'trace';
  if (score < 50) return 'glorifying';
  if (score < 67) return 'absolute';
  return 'total_glorification';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityGlorification(args: {
  existentialAbsoluteNullityBeatification: OP10M_A11_ExistentialAbsoluteNullityBeatificationRow[];
  collapseOmniSingularityPanidealism: OP10M_A11_CollapseOmniSingularityPanidealismRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityGlorificationRow[]; nationalIndex: number } {
  const beatificationByRegion = new Map(args.existentialAbsoluteNullityBeatification.map((c) => [c.regionId, c]));
  const panidealismByRegion = new Map(args.collapseOmniSingularityPanidealism.map((p) => [p.regionId, p]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityGlorificationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const beatification = beatificationByRegion.get(rid);
    const panidealism = panidealismByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const beatificationDrag = beatification ? op10mA11Clamp(beatification.beatificationScore * 0.53) : 23;
    const panidealismDrag = panidealism ? op10mA11Clamp(panidealism.panidealismScore * 0.49) : 21;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.48) : 20;

    const glorificationScore = op10mA11Clamp(beatificationDrag + panidealismDrag + sentenceDrag * 0.61);
    weighted += glorificationScore;

    const marks: string[] = [];
    if (beatification && (beatification.band === 'absolute' || beatification.band === 'total_glorification')) {
      marks.push('beatification glorification');
    }
    if (panidealism && (panidealism.band === 'total' || panidealism.band === 'panidealism')) {
      marks.push('panidealism glorification');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence glorification');
    }
    if (!marks.length) marks.push('glorification trace');

    rows.push({
      regionId: rid,
      glorificationScore: op10mA11Round(glorificationScore),
      band: glorificationBand(glorificationScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity glorification ${glorificationBand(glorificationScore)} (${op10mA11Round(glorificationScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.glorificationScore - a.glorificationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityGlorification(
  rows: OP10M_A11_ExistentialAbsoluteNullityGlorificationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_glorification').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityGlorificationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 67;
  return currentIndex >= 61 && currentIndex > priorIndex + 6;
}
