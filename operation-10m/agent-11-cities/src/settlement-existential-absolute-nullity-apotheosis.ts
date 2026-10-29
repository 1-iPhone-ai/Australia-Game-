import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPanmonismRow,
  OP10M_A11_ExistentialAbsoluteNullityDeificationRow,
  OP10M_A11_ExistentialAbsoluteNullityApotheosisBand,
  OP10M_A11_ExistentialAbsoluteNullityApotheosisRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function apotheosisBand(score: number): OP10M_A11_ExistentialAbsoluteNullityApotheosisBand {
  if (score < 34) return 'trace';
  if (score < 50) return 'apotheosizing';
  if (score < 67) return 'absolute';
  return 'total_apotheosis';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityApotheosis(args: {
  existentialAbsoluteNullityDeification: OP10M_A11_ExistentialAbsoluteNullityDeificationRow[];
  collapseOmniSingularityPanmonism: OP10M_A11_CollapseOmniSingularityPanmonismRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityApotheosisRow[]; nationalIndex: number } {
  const deificationByRegion = new Map(args.existentialAbsoluteNullityDeification.map((c) => [c.regionId, c]));
  const panmonismByRegion = new Map(args.collapseOmniSingularityPanmonism.map((p) => [p.regionId, p]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityApotheosisRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const deification = deificationByRegion.get(rid);
    const panmonism = panmonismByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const deificationDrag = deification ? op10mA11Clamp(deification.deificationScore * 0.53) : 23;
    const panmonismDrag = panmonism ? op10mA11Clamp(panmonism.panmonismScore * 0.49) : 21;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.48) : 20;

    const apotheosisScore = op10mA11Clamp(deificationDrag + panmonismDrag + sentenceDrag * 0.61);
    weighted += apotheosisScore;

    const marks: string[] = [];
    if (deification && (deification.band === 'absolute' || deification.band === 'total_apotheosis')) {
      marks.push('deification apotheosis');
    }
    if (panmonism && (panmonism.band === 'total' || panmonism.band === 'panmonism')) {
      marks.push('panmonism apotheosis');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence apotheosis');
    }
    if (!marks.length) marks.push('apotheosis trace');

    rows.push({
      regionId: rid,
      apotheosisScore: op10mA11Round(apotheosisScore),
      band: apotheosisBand(apotheosisScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity apotheosis ${apotheosisBand(apotheosisScore)} (${op10mA11Round(apotheosisScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.apotheosisScore - a.apotheosisScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityApotheosis(
  rows: OP10M_A11_ExistentialAbsoluteNullityApotheosisRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_apotheosis').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityApotheosisEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 67;
  return currentIndex >= 61 && currentIndex > priorIndex + 6;
}
