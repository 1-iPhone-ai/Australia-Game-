import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectCareReadinessBrief,
  type NationalSubjectTenacityReadinessBrief,
  type NationalWorkforceCareIndex,
  type SubjectTenacityReadinessBand
} from './types';

function tenacityBand(index: number): SubjectTenacityReadinessBand {
  if (index <= 34) return 'below_tenacity';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'tenacity_ready';
  return 'care_locked';
}

/** Round-47 / wave-47 subject tenacity readiness — care × workforce care (O10-225). */
export function computeNationalSubjectTenacityReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectCare: NationalSubjectCareReadinessBrief | null | undefined,
  workforceCare: NationalWorkforceCareIndex | null | undefined
): NationalSubjectTenacityReadinessBrief {
  if (!state.enabled || !subjectCare || !workforceCare) {
    return {
      turn: state.turn,
      tenacityIndex: 50,
      band: 'approaching',
      tenacityDrag: 0,
      summary: 'Subject tenacity readiness idle — subject care or workforce care unavailable.',
      stewardNote: 'Compute subject care and workforce care before tenacity guidance.'
    };
  }

  const tenacityDrag = v1014laborClamp(
    subjectCare.careDrag * 0.38 +
      workforceCare.careDrag * 0.38 +
      (subjectCare.band === 'below_care' || workforceCare.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectCare.band === 'care_ready' || subjectCare.band === 'safety_locked'
      ? subjectCare.careIndex * 0.27
      : subjectCare.careIndex * 0.14;
  const workforceLift =
    workforceCare.band === 'elevated' || workforceCare.band === 'care'
      ? workforceCare.careIndex * 0.25
      : workforceCare.careIndex * 0.12;

  const tenacityIndex = v1014laborClamp(20 + subjectLift + workforceLift - tenacityDrag);
  const band = tenacityBand(tenacityIndex);

  const stewardNote =
    band === 'below_tenacity' || band === 'approaching'
      ? 'Approaching tenacity — hold O10-225 wave-47 scale until care-tenacity syncs.'
      : band === 'care_locked'
        ? 'Care-locked tenacity — still monitor tenacity resilience during corridor peaks.'
        : 'Tenacity-ready — pair with workforce tenacity depth index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    tenacityIndex,
    band,
    tenacityDrag,
    summary: `Subject tenacity readiness ${band} (index ${Math.round(tenacityIndex)}); tenacity drag ${Math.round(tenacityDrag)}.`,
    stewardNote
  };
}
