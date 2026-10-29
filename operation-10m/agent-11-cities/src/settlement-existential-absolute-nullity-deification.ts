import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPantheosisRow,
  OP10M_A11_ExistentialAbsoluteNullityGlorificationRow,
  OP10M_A11_ExistentialAbsoluteNullityDeificationBand,
  OP10M_A11_ExistentialAbsoluteNullityDeificationRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function deificationBand(score: number): OP10M_A11_ExistentialAbsoluteNullityDeificationBand {
  if (score < 34) return 'trace';
  if (score < 50) return 'deifying';
  if (score < 67) return 'absolute';
  return 'total_deification';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityDeification(args: {
  existentialAbsoluteNullityGlorification: OP10M_A11_ExistentialAbsoluteNullityGlorificationRow[];
  collapseOmniSingularityPantheosis: OP10M_A11_CollapseOmniSingularityPantheosisRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityDeificationRow[]; nationalIndex: number } {
  const glorificationByRegion = new Map(args.existentialAbsoluteNullityGlorification.map((c) => [c.regionId, c]));
  const pantheosisByRegion = new Map(args.collapseOmniSingularityPantheosis.map((p) => [p.regionId, p]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityDeificationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const glorification = glorificationByRegion.get(rid);
    const pantheosis = pantheosisByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const glorificationDrag = glorification ? op10mA11Clamp(glorification.glorificationScore * 0.53) : 23;
    const pantheosisDrag = pantheosis ? op10mA11Clamp(pantheosis.pantheosisScore * 0.49) : 21;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.48) : 20;

    const deificationScore = op10mA11Clamp(glorificationDrag + pantheosisDrag + sentenceDrag * 0.61);
    weighted += deificationScore;

    const marks: string[] = [];
    if (glorification && (glorification.band === 'absolute' || glorification.band === 'total_glorification')) {
      marks.push('glorification deification');
    }
    if (pantheosis && (pantheosis.band === 'total' || pantheosis.band === 'pantheosis')) {
      marks.push('pantheosis deification');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence deification');
    }
    if (!marks.length) marks.push('deification trace');

    rows.push({
      regionId: rid,
      deificationScore: op10mA11Round(deificationScore),
      band: deificationBand(deificationScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity deification ${deificationBand(deificationScore)} (${op10mA11Round(deificationScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.deificationScore - a.deificationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityDeification(
  rows: OP10M_A11_ExistentialAbsoluteNullityDeificationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_deification').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityDeificationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 67;
  return currentIndex >= 61 && currentIndex > priorIndex + 6;
}
