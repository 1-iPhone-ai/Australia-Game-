import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityHolismRow,
  OP10M_A11_ExistentialAbsoluteNullityCertitudeRow,
  OP10M_A11_ExistentialAbsoluteNullityConvictionBand,
  OP10M_A11_ExistentialAbsoluteNullityConvictionRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function convictionBand(score: number): OP10M_A11_ExistentialAbsoluteNullityConvictionBand {
  if (score < 29) return 'trace';
  if (score < 45) return 'convinced';
  if (score < 62) return 'absolute';
  return 'total_conviction';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityConviction(args: {
  existentialAbsoluteNullityCertitude: OP10M_A11_ExistentialAbsoluteNullityCertitudeRow[];
  collapseOmniSingularityHolism: OP10M_A11_CollapseOmniSingularityHolismRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityConvictionRow[]; nationalIndex: number } {
  const certitudeByRegion = new Map(args.existentialAbsoluteNullityCertitude.map((c) => [c.regionId, c]));
  const holismByRegion = new Map(args.collapseOmniSingularityHolism.map((h) => [h.regionId, h]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityConvictionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const certitude = certitudeByRegion.get(rid);
    const holism = holismByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const certitudeDrag = certitude ? op10mA11Clamp(certitude.certitudeScore * 0.48) : 19;
    const holismDrag = holism ? op10mA11Clamp(holism.holismScore * 0.44) : 17;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.45) : 16;

    const convictionScore = op10mA11Clamp(certitudeDrag + holismDrag + sentenceDrag * 0.56);
    weighted += convictionScore;

    const marks: string[] = [];
    if (certitude && (certitude.band === 'absolute' || certitude.band === 'total_certitude')) {
      marks.push('certitude conviction');
    }
    if (holism && (holism.band === 'total' || holism.band === 'holism')) {
      marks.push('holism conviction');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence conviction');
    }
    if (!marks.length) marks.push('conviction trace');

    rows.push({
      regionId: rid,
      convictionScore: op10mA11Round(convictionScore),
      band: convictionBand(convictionScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity conviction ${convictionBand(convictionScore)} (${op10mA11Round(convictionScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.convictionScore - a.convictionScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityConviction(
  rows: OP10M_A11_ExistentialAbsoluteNullityConvictionRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_conviction').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityConvictionEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 62;
  return currentIndex >= 56 && currentIndex > priorIndex + 6;
}
