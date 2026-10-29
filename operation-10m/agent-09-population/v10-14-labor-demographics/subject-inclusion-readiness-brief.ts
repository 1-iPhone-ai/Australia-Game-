import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectAdvocacyReadinessBrief,
  type NationalSubjectInclusionReadinessBrief,
  type NationalWorkforceAdvocacyIndex,
  type SubjectInclusionReadinessBand
} from './types';

function inclusionBand(index: number): SubjectInclusionReadinessBand {
  if (index <= 34) return 'below_inclusion';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'inclusion_ready';
  return 'advocacy_locked';
}

/** Round-41 / wave-41 subject inclusion readiness — advocacy × workforce advocacy (O10-213). */
export function computeNationalSubjectInclusionReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectAdvocacy: NationalSubjectAdvocacyReadinessBrief | null | undefined,
  workforceAdvocacy: NationalWorkforceAdvocacyIndex | null | undefined
): NationalSubjectInclusionReadinessBrief {
  if (!state.enabled || !subjectAdvocacy || !workforceAdvocacy) {
    return {
      turn: state.turn,
      inclusionIndex: 50,
      band: 'approaching',
      inclusionDrag: 0,
      summary: 'Subject inclusion readiness idle — subject advocacy or workforce advocacy unavailable.',
      stewardNote: 'Compute subject advocacy and workforce advocacy before inclusion guidance.'
    };
  }

  const inclusionDrag = v1014laborClamp(
    subjectAdvocacy.advocacyDrag * 0.38 +
      workforceAdvocacy.advocacyDrag * 0.38 +
      (subjectAdvocacy.band === 'below_advocacy' || workforceAdvocacy.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectAdvocacy.band === 'advocacy_ready' || subjectAdvocacy.band === 'mentorship_locked'
      ? subjectAdvocacy.advocacyIndex * 0.27
      : subjectAdvocacy.advocacyIndex * 0.14;
  const workforceLift =
    workforceAdvocacy.band === 'elevated' || workforceAdvocacy.band === 'advocacy'
      ? workforceAdvocacy.advocacyIndex * 0.25
      : workforceAdvocacy.advocacyIndex * 0.12;

  const inclusionIndex = v1014laborClamp(20 + subjectLift + workforceLift - inclusionDrag);
  const band = inclusionBand(inclusionIndex);

  const stewardNote =
    band === 'below_inclusion' || band === 'approaching'
      ? 'Approaching inclusion — hold O10-213 wave-41 scale until advocacy-inclusion syncs.'
      : band === 'advocacy_locked'
        ? 'Advocacy-locked inclusion — still monitor inclusion equity during corridor peaks.'
        : 'Inclusion-ready — pair with workforce inclusion index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    inclusionIndex,
    band,
    inclusionDrag,
    summary: `Subject inclusion readiness ${band} (index ${Math.round(inclusionIndex)}); inclusion drag ${Math.round(inclusionDrag)}.`,
    stewardNote
  };
}
