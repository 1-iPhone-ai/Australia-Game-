import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityIntegrationRow,
  OP10M_A11_ExistentialAbsoluteNullityContinuityRow,
  OP10M_A11_ExistentialAbsoluteNullityPerpetuityBand,
  OP10M_A11_ExistentialAbsoluteNullityPerpetuityRow,
  OP10M_A11_ExistentialFinalNullitySentenceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function perpetuityBand(score: number): OP10M_A11_ExistentialAbsoluteNullityPerpetuityBand {
  if (score < 23) return 'trace';
  if (score < 39) return 'perpetuity';
  if (score < 56) return 'absolute';
  return 'total_perpetuity';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityPerpetuity(args: {
  existentialAbsoluteNullityContinuity: OP10M_A11_ExistentialAbsoluteNullityContinuityRow[];
  collapseOmniSingularityIntegration: OP10M_A11_CollapseOmniSingularityIntegrationRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityPerpetuityRow[]; nationalIndex: number } {
  const continuityByRegion = new Map(args.existentialAbsoluteNullityContinuity.map((c) => [c.regionId, c]));
  const integrationByRegion = new Map(args.collapseOmniSingularityIntegration.map((i) => [i.regionId, i]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityPerpetuityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const continuity = continuityByRegion.get(rid);
    const integration = integrationByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const continuityDrag = continuity ? op10mA11Clamp(continuity.continuityScore * 0.52) : 18;
    const integrationDrag = integration ? op10mA11Clamp(integration.integrationScore * 0.48) : 16;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.49) : 15;

    const perpetuityScore = op10mA11Clamp(continuityDrag + integrationDrag + sentenceDrag * 0.6);
    weighted += perpetuityScore;

    const marks: string[] = [];
    if (continuity && (continuity.band === 'absolute' || continuity.band === 'total_continuity')) {
      marks.push('continuity perpetuate');
    }
    if (integration && (integration.band === 'total' || integration.band === 'integration')) {
      marks.push('integration perpetuate');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence perpetuate');
    }
    if (!marks.length) marks.push('perpetuity trace');

    rows.push({
      regionId: rid,
      perpetuityScore: op10mA11Round(perpetuityScore),
      band: perpetuityBand(perpetuityScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity perpetuity ${perpetuityBand(perpetuityScore)} (${op10mA11Round(perpetuityScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.perpetuityScore - a.perpetuityScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityPerpetuity(
  rows: OP10M_A11_ExistentialAbsoluteNullityPerpetuityRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_perpetuity').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityPerpetuityEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 56;
  return currentIndex >= 50 && currentIndex > priorIndex + 6;
}
