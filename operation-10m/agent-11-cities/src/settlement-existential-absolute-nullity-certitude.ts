import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularitySymbiosisRow,
  OP10M_A11_ExistentialAbsoluteNullityCertitudeBand,
  OP10M_A11_ExistentialAbsoluteNullityCertitudeRow,
  OP10M_A11_ExistentialAbsoluteNullityDeterminismRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function certitudeBand(score: number): OP10M_A11_ExistentialAbsoluteNullityCertitudeBand {
  if (score < 28) return 'trace';
  if (score < 44) return 'certain';
  if (score < 61) return 'absolute';
  return 'total_certitude';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityCertitude(args: {
  existentialAbsoluteNullityDeterminism: OP10M_A11_ExistentialAbsoluteNullityDeterminismRow[];
  collapseOmniSingularitySymbiosis: OP10M_A11_CollapseOmniSingularitySymbiosisRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityCertitudeRow[]; nationalIndex: number } {
  const determinismByRegion = new Map(args.existentialAbsoluteNullityDeterminism.map((d) => [d.regionId, d]));
  const symbiosisByRegion = new Map(args.collapseOmniSingularitySymbiosis.map((s) => [s.regionId, s]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityCertitudeRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const determinism = determinismByRegion.get(rid);
    const symbiosis = symbiosisByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const determinismDrag = determinism ? op10mA11Clamp(determinism.determinismScore * 0.47) : 18;
    const symbiosisDrag = symbiosis ? op10mA11Clamp(symbiosis.symbiosisScore * 0.43) : 16;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.44) : 15;

    const certitudeScore = op10mA11Clamp(determinismDrag + symbiosisDrag + sentenceDrag * 0.55);
    weighted += certitudeScore;

    const marks: string[] = [];
    if (determinism && (determinism.band === 'absolute' || determinism.band === 'total_determinism')) {
      marks.push('determinism certitude');
    }
    if (symbiosis && (symbiosis.band === 'total' || symbiosis.band === 'symbiosis')) {
      marks.push('symbiosis certitude');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence certitude');
    }
    if (!marks.length) marks.push('certitude trace');

    rows.push({
      regionId: rid,
      certitudeScore: op10mA11Round(certitudeScore),
      band: certitudeBand(certitudeScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity certitude ${certitudeBand(certitudeScore)} (${op10mA11Round(certitudeScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.certitudeScore - a.certitudeScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityCertitude(
  rows: OP10M_A11_ExistentialAbsoluteNullityCertitudeRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_certitude').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityCertitudeEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 61;
  return currentIndex >= 55 && currentIndex > priorIndex + 6;
}
