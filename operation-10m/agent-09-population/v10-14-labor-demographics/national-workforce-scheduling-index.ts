import { v1014laborClamp } from './bands';
import {
  type NationalCoordinationSchedulingCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalSchedulingPulseOutlook,
  type NationalSubjectSchedulingReadinessBrief,
  type NationalWorkforceSchedulingIndex,
  type WorkforceSchedulingBand
} from './types';

function schedulingBand(index: number): WorkforceSchedulingBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'scheduling';
}

export function computeNationalWorkforceSchedulingIndex(
  state: NationalLaborDemographicsState,
  schedulingCoupling: NationalCoordinationSchedulingCouplingBrief | null | undefined,
  schedulingPulse: NationalSchedulingPulseOutlook | null | undefined,
  subjectScheduling: NationalSubjectSchedulingReadinessBrief | null | undefined
): NationalWorkforceSchedulingIndex {
  if (!state.enabled || !schedulingCoupling || !schedulingPulse || !subjectScheduling) {
    return {
      turn: state.turn,
      schedulingIndex: 50,
      band: 'thin',
      schedulingDrag: 0,
      summary: 'Workforce scheduling idle — scheduling coupling, pulse, or subject scheduling unavailable.',
      stewardNote: 'Compute O10-219 wave-44 depth stack before scheduling guidance.'
    };
  }

  const schedulingDrag = v1014laborClamp(
    subjectScheduling.schedulingDrag * 0.35 +
      schedulingCoupling.coordinationDrag * 0.3 +
      schedulingPulse.coordinationDrag * 0.25 +
      (subjectScheduling.band === 'below_scheduling' || schedulingCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    schedulingCoupling.band === 'amplified' || schedulingCoupling.band === 'elevated'
      ? schedulingCoupling.couplingIndex * 0.2
      : schedulingCoupling.couplingIndex * 0.1;
  const pulseLift =
    schedulingPulse.band === 'rising' || schedulingPulse.band === 'pulsing'
      ? schedulingPulse.pulseIndex * 0.18
      : schedulingPulse.pulseIndex * 0.09;
  const subjectLift =
    subjectScheduling.band === 'scheduling_ready' || subjectScheduling.band === 'coordination_locked'
      ? subjectScheduling.schedulingIndex * 0.22
      : subjectScheduling.schedulingIndex * 0.11;

  const schedulingIndex = v1014laborClamp(18 + couplingLift + pulseLift + subjectLift - schedulingDrag);
  const band = schedulingBand(schedulingIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce scheduling — sequence coordination-scheduling, scheduling pulse, and subject scheduling before post-bca7e0a3 tranche.'
      : band === 'scheduling'
        ? 'Scheduling band — avoid corridor overload that breaks subject scheduling bands.'
        : 'Elevated scheduling — refresh subject scheduling checks each scale wave.';

  return {
    turn: state.turn,
    schedulingIndex,
    band,
    schedulingDrag,
    summary: `National workforce scheduling ${band} (index ${Math.round(schedulingIndex)}); scheduling drag ${Math.round(schedulingDrag)}.`,
    stewardNote
  };
}
