import { v1014laborClamp } from './bands';
import type {
  IntegratedLaborReadinessBand,
  LaborResilienceScorecard,
  NationalCapacityParticipationAlignmentBrief,
  NationalIntegratedLaborReadinessOutlook,
  NationalLaborDemographicsState,
  NationalLaborMarketStabilityOutlook,
  NationalMigrationShockParticipationBufferOutlook
} from './types';

function readinessBand(index: number): IntegratedLaborReadinessBand {
  if (index <= 34) return 'unprepared';
  if (index <= 48) return 'caution';
  if (index <= 62) return 'ready';
  return 'primed';
}

export function computeNationalIntegratedLaborReadinessOutlook(
  state: NationalLaborDemographicsState,
  stability: NationalLaborMarketStabilityOutlook | null | undefined,
  alignment: NationalCapacityParticipationAlignmentBrief | null | undefined,
  buffer: NationalMigrationShockParticipationBufferOutlook | null | undefined,
  resilience: LaborResilienceScorecard | null | undefined
): NationalIntegratedLaborReadinessOutlook {
  if (!state.enabled || !stability || !alignment || !buffer || !resilience) {
    return {
      turn: state.turn,
      readinessIndex: 50,
      band: 'caution',
      stabilityDrag: 0,
      summary: 'Integrated labor readiness idle — stability, alignment, buffer, or resilience unavailable.',
      stewardNote: 'Compute stability, alignment, buffer, and resilience before readiness guidance.'
    };
  }

  const stabilityDrag =
    stability.band === 'volatile'
      ? 16
      : stability.band === 'fragile'
        ? 11
        : stability.stressDrag * 0.35;
  const alignmentLift =
    alignment.band === 'aligned' || alignment.band === 'reinforcing'
      ? alignment.alignmentIndex * 0.26
      : alignment.alignmentIndex * 0.14;
  const bufferLift =
    buffer.band === 'cushioned' || buffer.band === 'adequate' ? buffer.bufferIndex * 0.22 : 0;
  const resilienceLift = resilience.compositeScore * 0.28;
  const alignmentDrag =
    alignment.band === 'misaligned' ? 12 : alignment.band === 'strained' ? 7 : 0;

  const readinessIndex = v1014laborClamp(
    28 + alignmentLift + bufferLift + resilienceLift - stabilityDrag - alignmentDrag
  );
  const band = readinessBand(readinessIndex);

  const stewardNote =
    band === 'unprepared' || band === 'caution'
      ? 'Caution readiness — deploy coordination and advocacy levers before auto workforce commits.'
      : band === 'primed'
        ? 'Primed readiness — avoid stacked shocks that erode migration buffers.'
        : 'Ready band — maintain intergenerational balance while scaling participation.';

  return {
    turn: state.turn,
    readinessIndex,
    band,
    stabilityDrag,
    summary: `Integrated labor readiness ${band} (index ${Math.round(readinessIndex)}); stability drag ${Math.round(stabilityDrag)}.`,
    stewardNote
  };
}
