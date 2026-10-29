import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectSafetyReadinessBrief,
  type NationalSubjectSchedulingReadinessBrief,
  type NationalWorkforceSchedulingIndex,
  type SubjectSafetyReadinessBand
} from './types';

function safetyBand(index: number): SubjectSafetyReadinessBand {
  if (index <= 34) return 'below_safety';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'safety_ready';
  return 'scheduling_locked';
}

/** Round-45 / wave-45 subject safety readiness — scheduling × workforce scheduling (O10-221). */
export function computeNationalSubjectSafetyReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectScheduling: NationalSubjectSchedulingReadinessBrief | null | undefined,
  workforceScheduling: NationalWorkforceSchedulingIndex | null | undefined
): NationalSubjectSafetyReadinessBrief {
  if (!state.enabled || !subjectScheduling || !workforceScheduling) {
    return {
      turn: state.turn,
      safetyIndex: 50,
      band: 'approaching',
      safetyDrag: 0,
      summary: 'Subject safety readiness idle — subject scheduling or workforce scheduling unavailable.',
      stewardNote: 'Compute subject scheduling and workforce scheduling before safety guidance.'
    };
  }

  const safetyDrag = v1014laborClamp(
    subjectScheduling.schedulingDrag * 0.38 +
      workforceScheduling.schedulingDrag * 0.38 +
      (subjectScheduling.band === 'below_scheduling' || workforceScheduling.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectScheduling.band === 'scheduling_ready' || subjectScheduling.band === 'coordination_locked'
      ? subjectScheduling.schedulingIndex * 0.27
      : subjectScheduling.schedulingIndex * 0.14;
  const workforceLift =
    workforceScheduling.band === 'elevated' || workforceScheduling.band === 'scheduling'
      ? workforceScheduling.schedulingIndex * 0.25
      : workforceScheduling.schedulingIndex * 0.12;

  const safetyIndex = v1014laborClamp(20 + subjectLift + workforceLift - safetyDrag);
  const band = safetyBand(safetyIndex);

  const stewardNote =
    band === 'below_safety' || band === 'approaching'
      ? 'Approaching safety — hold O10-221 wave-45 scale until scheduling-safety syncs.'
      : band === 'scheduling_locked'
        ? 'Scheduling-locked safety — still monitor safety calibration during corridor peaks.'
        : 'Safety-ready — pair with workforce safety index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    safetyIndex,
    band,
    safetyDrag,
    summary: `Subject safety readiness ${band} (index ${Math.round(safetyIndex)}); safety drag ${Math.round(safetyDrag)}.`,
    stewardNote
  };
}
