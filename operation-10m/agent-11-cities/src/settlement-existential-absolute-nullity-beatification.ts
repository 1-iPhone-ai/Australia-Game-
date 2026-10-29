import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPanpsychismRow,
  OP10M_A11_ExistentialAbsoluteNullityConsecrationRow,
  OP10M_A11_ExistentialAbsoluteNullityBeatificationBand,
  OP10M_A11_ExistentialAbsoluteNullityBeatificationRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function beatificationBand(score: number): OP10M_A11_ExistentialAbsoluteNullityBeatificationBand {
  if (score < 34) return 'trace';
  if (score < 50) return 'beatifying';
  if (score < 67) return 'absolute';
  return 'total_beatification';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityBeatification(args: {
  existentialAbsoluteNullityConsecration: OP10M_A11_ExistentialAbsoluteNullityConsecrationRow[];
  collapseOmniSingularityPanpsychism: OP10M_A11_CollapseOmniSingularityPanpsychismRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityBeatificationRow[]; nationalIndex: number } {
  const consecrationByRegion = new Map(args.existentialAbsoluteNullityConsecration.map((c) => [c.regionId, c]));
  const panpsychismByRegion = new Map(args.collapseOmniSingularityPanpsychism.map((p) => [p.regionId, p]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityBeatificationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const consecration = consecrationByRegion.get(rid);
    const panpsychism = panpsychismByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const consecrationDrag = consecration ? op10mA11Clamp(consecration.consecrationScore * 0.53) : 23;
    const panpsychismDrag = panpsychism ? op10mA11Clamp(panpsychism.panpsychismScore * 0.49) : 21;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.48) : 20;

    const beatificationScore = op10mA11Clamp(consecrationDrag + panpsychismDrag + sentenceDrag * 0.61);
    weighted += beatificationScore;

    const marks: string[] = [];
    if (consecration && (consecration.band === 'absolute' || consecration.band === 'total_beatification')) {
      marks.push('consecration beatification');
    }
    if (panpsychism && (panpsychism.band === 'total' || panpsychism.band === 'panpsychism')) {
      marks.push('panpsychism beatification');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence beatification');
    }
    if (!marks.length) marks.push('beatification trace');

    rows.push({
      regionId: rid,
      beatificationScore: op10mA11Round(beatificationScore),
      band: beatificationBand(beatificationScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity beatification ${beatificationBand(beatificationScore)} (${op10mA11Round(beatificationScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.beatificationScore - a.beatificationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityBeatification(
  rows: OP10M_A11_ExistentialAbsoluteNullityBeatificationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_beatification').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityBeatificationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 67;
  return currentIndex >= 61 && currentIndex > priorIndex + 6;
}
