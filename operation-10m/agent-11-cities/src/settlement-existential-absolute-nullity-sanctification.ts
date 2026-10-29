import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPantheismRow,
  OP10M_A11_ExistentialAbsoluteNullityCanonizationRow,
  OP10M_A11_ExistentialAbsoluteNullitySanctificationBand,
  OP10M_A11_ExistentialAbsoluteNullitySanctificationRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function sanctificationBand(score: number): OP10M_A11_ExistentialAbsoluteNullitySanctificationBand {
  if (score < 34) return 'trace';
  if (score < 50) return 'sanctifying';
  if (score < 67) return 'absolute';
  return 'total_sanctification';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullitySanctification(args: {
  existentialAbsoluteNullityCanonization: OP10M_A11_ExistentialAbsoluteNullityCanonizationRow[];
  collapseOmniSingularityPantheism: OP10M_A11_CollapseOmniSingularityPantheismRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullitySanctificationRow[]; nationalIndex: number } {
  const canonizationByRegion = new Map(args.existentialAbsoluteNullityCanonization.map((c) => [c.regionId, c]));
  const pantheismByRegion = new Map(args.collapseOmniSingularityPantheism.map((p) => [p.regionId, p]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullitySanctificationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const canonization = canonizationByRegion.get(rid);
    const pantheism = pantheismByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const canonizationDrag = canonization ? op10mA11Clamp(canonization.canonizationScore * 0.53) : 23;
    const pantheismDrag = pantheism ? op10mA11Clamp(pantheism.pantheismScore * 0.49) : 21;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.48) : 20;

    const sanctificationScore = op10mA11Clamp(canonizationDrag + pantheismDrag + sentenceDrag * 0.61);
    weighted += sanctificationScore;

    const marks: string[] = [];
    if (canonization && (canonization.band === 'absolute' || canonization.band === 'total_canonization')) {
      marks.push('canonization sanctification');
    }
    if (pantheism && (pantheism.band === 'total' || pantheism.band === 'pantheism')) {
      marks.push('pantheism sanctification');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence sanctification');
    }
    if (!marks.length) marks.push('sanctification trace');

    rows.push({
      regionId: rid,
      sanctificationScore: op10mA11Round(sanctificationScore),
      band: sanctificationBand(sanctificationScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity sanctification ${sanctificationBand(sanctificationScore)} (${op10mA11Round(sanctificationScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.sanctificationScore - a.sanctificationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullitySanctification(
  rows: OP10M_A11_ExistentialAbsoluteNullitySanctificationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_sanctification').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullitySanctificationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 67;
  return currentIndex >= 61 && currentIndex > priorIndex + 6;
}
