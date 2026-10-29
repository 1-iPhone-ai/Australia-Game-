import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectFlexibilityReadinessBrief,
  type NationalSubjectInclusionReadinessBrief,
  type NationalWorkforceInclusionIndex,
  type SubjectFlexibilityReadinessBand
} from './types';

function flexibilityBand(index: number): SubjectFlexibilityReadinessBand {
  if (index <= 34) return 'below_flexibility';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'flexibility_ready';
  return 'inclusion_locked';
}

/** Round-42 / wave-42 subject flexibility readiness — inclusion × workforce inclusion (O10-215). */
export function computeNationalSubjectFlexibilityReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectInclusion: NationalSubjectInclusionReadinessBrief | null | undefined,
  workforceInclusion: NationalWorkforceInclusionIndex | null | undefined
): NationalSubjectFlexibilityReadinessBrief {
  if (!state.enabled || !subjectInclusion || !workforceInclusion) {
    return {
      turn: state.turn,
      flexibilityIndex: 50,
      band: 'approaching',
      flexibilityDrag: 0,
      summary: 'Subject flexibility readiness idle — subject inclusion or workforce inclusion unavailable.',
      stewardNote: 'Compute subject inclusion and workforce inclusion before flexibility guidance.'
    };
  }

  const flexibilityDrag = v1014laborClamp(
    subjectInclusion.inclusionDrag * 0.38 +
      workforceInclusion.inclusionDrag * 0.38 +
      (subjectInclusion.band === 'below_inclusion' || workforceInclusion.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectInclusion.band === 'inclusion_ready' || subjectInclusion.band === 'advocacy_locked'
      ? subjectInclusion.inclusionIndex * 0.27
      : subjectInclusion.inclusionIndex * 0.14;
  const workforceLift =
    workforceInclusion.band === 'elevated' || workforceInclusion.band === 'inclusion'
      ? workforceInclusion.inclusionIndex * 0.25
      : workforceInclusion.inclusionIndex * 0.12;

  const flexibilityIndex = v1014laborClamp(20 + subjectLift + workforceLift - flexibilityDrag);
  const band = flexibilityBand(flexibilityIndex);

  const stewardNote =
    band === 'below_flexibility' || band === 'approaching'
      ? 'Approaching flexibility — hold O10-215 wave-42 scale until inclusion-flexibility syncs.'
      : band === 'inclusion_locked'
        ? 'Inclusion-locked flexibility — still monitor flexibility flow during corridor peaks.'
        : 'Flexibility-ready — pair with workforce flexibility index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    flexibilityIndex,
    band,
    flexibilityDrag,
    summary: `Subject flexibility readiness ${band} (index ${Math.round(flexibilityIndex)}); flexibility drag ${Math.round(flexibilityDrag)}.`,
    stewardNote
  };
}
