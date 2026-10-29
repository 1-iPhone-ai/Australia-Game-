import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityPanentheismRow,
  OP10M_A11_ExistentialAbsoluteNullitySanctificationRow,
  OP10M_A11_ExistentialAbsoluteNullityConsecrationBand,
  OP10M_A11_ExistentialAbsoluteNullityConsecrationRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function consecrationBand(score: number): OP10M_A11_ExistentialAbsoluteNullityConsecrationBand {
  if (score < 34) return 'trace';
  if (score < 50) return 'consecrating';
  if (score < 67) return 'absolute';
  return 'total_consecration';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityConsecration(args: {
  existentialAbsoluteNullitySanctification: OP10M_A11_ExistentialAbsoluteNullitySanctificationRow[];
  collapseOmniSingularityPanentheism: OP10M_A11_CollapseOmniSingularityPanentheismRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityConsecrationRow[]; nationalIndex: number } {
  const sanctificationByRegion = new Map(args.existentialAbsoluteNullitySanctification.map((c) => [c.regionId, c]));
  const panentheismByRegion = new Map(args.collapseOmniSingularityPanentheism.map((p) => [p.regionId, p]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityConsecrationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const sanctification = sanctificationByRegion.get(rid);
    const panentheism = panentheismByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const sanctificationDrag = sanctification ? op10mA11Clamp(sanctification.sanctificationScore * 0.53) : 23;
    const panentheismDrag = panentheism ? op10mA11Clamp(panentheism.panentheismScore * 0.49) : 21;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.48) : 20;

    const consecrationScore = op10mA11Clamp(sanctificationDrag + panentheismDrag + sentenceDrag * 0.61);
    weighted += consecrationScore;

    const marks: string[] = [];
    if (sanctification && (sanctification.band === 'absolute' || sanctification.band === 'total_consecration')) {
      marks.push('sanctification consecration');
    }
    if (panentheism && (panentheism.band === 'total' || panentheism.band === 'panentheism')) {
      marks.push('panentheism consecration');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence consecration');
    }
    if (!marks.length) marks.push('consecration trace');

    rows.push({
      regionId: rid,
      consecrationScore: op10mA11Round(consecrationScore),
      band: consecrationBand(consecrationScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity consecration ${consecrationBand(consecrationScore)} (${op10mA11Round(consecrationScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.consecrationScore - a.consecrationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityConsecration(
  rows: OP10M_A11_ExistentialAbsoluteNullityConsecrationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_consecration').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityConsecrationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 67;
  return currentIndex >= 61 && currentIndex > priorIndex + 6;
}
