import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectCareReadinessBrief,
  type NationalSubjectSafetyReadinessBrief,
  type NationalWorkforceSafetyIndex,
  type SubjectCareReadinessBand
} from './types';

function careBand(index: number): SubjectCareReadinessBand {
  if (index <= 34) return 'below_care';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'care_ready';
  return 'safety_locked';
}

/** Round-46 / wave-46 subject care readiness — safety × workforce safety (O10-223). */
export function computeNationalSubjectCareReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectSafety: NationalSubjectSafetyReadinessBrief | null | undefined,
  workforceSafety: NationalWorkforceSafetyIndex | null | undefined
): NationalSubjectCareReadinessBrief {
  if (!state.enabled || !subjectSafety || !workforceSafety) {
    return {
      turn: state.turn,
      careIndex: 50,
      band: 'approaching',
      careDrag: 0,
      summary: 'Subject care readiness idle — subject safety or workforce safety unavailable.',
      stewardNote: 'Compute subject safety and workforce safety before care guidance.'
    };
  }

  const careDrag = v1014laborClamp(
    subjectSafety.safetyDrag * 0.38 +
      workforceSafety.safetyDrag * 0.38 +
      (subjectSafety.band === 'below_safety' || workforceSafety.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectSafety.band === 'safety_ready' || subjectSafety.band === 'scheduling_locked'
      ? subjectSafety.safetyIndex * 0.27
      : subjectSafety.safetyIndex * 0.14;
  const workforceLift =
    workforceSafety.band === 'elevated' || workforceSafety.band === 'safety'
      ? workforceSafety.safetyIndex * 0.25
      : workforceSafety.safetyIndex * 0.12;

  const careIndex = v1014laborClamp(20 + subjectLift + workforceLift - careDrag);
  const band = careBand(careIndex);

  const stewardNote =
    band === 'below_care' || band === 'approaching'
      ? 'Approaching care — hold O10-223 wave-46 scale until safety-care syncs.'
      : band === 'safety_locked'
        ? 'Safety-locked care — still monitor care balance during corridor peaks.'
        : 'Care-ready — pair with workforce care index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    careIndex,
    band,
    careDrag,
    summary: `Subject care readiness ${band} (index ${Math.round(careIndex)}); care drag ${Math.round(careDrag)}.`,
    stewardNote
  };
}
