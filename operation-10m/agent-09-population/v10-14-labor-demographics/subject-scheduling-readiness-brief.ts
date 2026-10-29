import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectCoordinationReadinessBrief,
  type NationalSubjectSchedulingReadinessBrief,
  type NationalWorkforceCoordinationIndex,
  type SubjectSchedulingReadinessBand
} from './types';

function schedulingBand(index: number): SubjectSchedulingReadinessBand {
  if (index <= 34) return 'below_scheduling';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'scheduling_ready';
  return 'coordination_locked';
}

/** Round-44 / wave-44 subject scheduling readiness — coordination × workforce coordination (O10-219). */
export function computeNationalSubjectSchedulingReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectCoordination: NationalSubjectCoordinationReadinessBrief | null | undefined,
  workforceCoordination: NationalWorkforceCoordinationIndex | null | undefined
): NationalSubjectSchedulingReadinessBrief {
  if (!state.enabled || !subjectCoordination || !workforceCoordination) {
    return {
      turn: state.turn,
      schedulingIndex: 50,
      band: 'approaching',
      schedulingDrag: 0,
      summary: 'Subject scheduling readiness idle — subject coordination or workforce coordination unavailable.',
      stewardNote: 'Compute subject coordination and workforce coordination before scheduling guidance.'
    };
  }

  const schedulingDrag = v1014laborClamp(
    subjectCoordination.coordinationDrag * 0.38 +
      workforceCoordination.coordinationDrag * 0.38 +
      (subjectCoordination.band === 'below_coordination' || workforceCoordination.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectCoordination.band === 'coordination_ready' || subjectCoordination.band === 'flexibility_locked'
      ? subjectCoordination.coordinationIndex * 0.27
      : subjectCoordination.coordinationIndex * 0.14;
  const workforceLift =
    workforceCoordination.band === 'elevated' || workforceCoordination.band === 'coordination'
      ? workforceCoordination.coordinationIndex * 0.25
      : workforceCoordination.coordinationIndex * 0.12;

  const schedulingIndex = v1014laborClamp(20 + subjectLift + workforceLift - schedulingDrag);
  const band = schedulingBand(schedulingIndex);

  const stewardNote =
    band === 'below_scheduling' || band === 'approaching'
      ? 'Approaching scheduling — hold O10-219 wave-44 scale until coordination-scheduling syncs.'
      : band === 'coordination_locked'
        ? 'Coordination-locked scheduling — still monitor scheduling pulse during corridor peaks.'
        : 'Scheduling-ready — pair with workforce scheduling index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    schedulingIndex,
    band,
    schedulingDrag,
    summary: `Subject scheduling readiness ${band} (index ${Math.round(schedulingIndex)}); scheduling drag ${Math.round(schedulingDrag)}.`,
    stewardNote
  };
}
