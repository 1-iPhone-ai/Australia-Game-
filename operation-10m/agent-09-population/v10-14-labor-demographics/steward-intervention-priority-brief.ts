import { v1014laborClamp } from './bands';
import type {
  NationalIntegratedLaborReadinessOutlook,
  NationalLaborDemographicsState,
  NationalLaborMarketStabilityOutlook,
  NationalLaborRebalancingStressBrief,
  NationalStewardInterventionPriorityBrief,
  StewardInterventionBand
} from './types';

function interventionBand(index: number): StewardInterventionBand {
  if (index <= 34) return 'observe';
  if (index <= 48) return 'nudge';
  if (index <= 62) return 'act';
  return 'urgent';
}

export function computeNationalStewardInterventionPriorityBrief(
  state: NationalLaborDemographicsState,
  readiness: NationalIntegratedLaborReadinessOutlook | null | undefined,
  stability: NationalLaborMarketStabilityOutlook | null | undefined,
  rebalancingStress: NationalLaborRebalancingStressBrief | null | undefined
): NationalStewardInterventionPriorityBrief {
  if (!state.enabled || !readiness || !stability || !rebalancingStress) {
    return {
      turn: state.turn,
      priorityIndex: 50,
      band: 'nudge',
      readinessDrag: 0,
      summary: 'Steward intervention priority idle — readiness, stability, or stress unavailable.',
      stewardNote: 'Compute integrated readiness and stability before intervention priority guidance.'
    };
  }

  const readinessDrag =
    readiness.band === 'unprepared'
      ? 18
      : readiness.band === 'caution'
        ? 12
        : readiness.stabilityDrag * 0.4;
  const stabilityDrag =
    stability.band === 'volatile'
      ? 16
      : stability.band === 'fragile'
        ? 10
        : stability.stressDrag * 0.35;
  const stressLift =
    rebalancingStress.band === 'critical'
      ? 20
      : rebalancingStress.band === 'acute'
        ? 14
        : rebalancingStress.stressIndex * 0.22;
  const readinessEase =
    readiness.band === 'ready' || readiness.band === 'primed' ? readiness.readinessIndex * 0.2 : 0;

  const priorityIndex = v1014laborClamp(24 + stressLift + stabilityDrag + readinessDrag - readinessEase);
  const band = interventionBand(priorityIndex);

  const stewardNote =
    band === 'urgent' || band === 'act'
      ? 'Elevated steward intervention — sequence coordination levers before auto workforce commits.'
      : band === 'observe'
        ? 'Observe band — maintain mentorship and advocacy while monitoring corridor stress.'
        : 'Nudge band — align hybrid-remote outlook with participation equity gaps.';

  return {
    turn: state.turn,
    priorityIndex,
    band,
    readinessDrag,
    summary: `Steward intervention priority ${band} (index ${Math.round(priorityIndex)}); readiness drag ${Math.round(readinessDrag)}.`,
    stewardNote
  };
}
