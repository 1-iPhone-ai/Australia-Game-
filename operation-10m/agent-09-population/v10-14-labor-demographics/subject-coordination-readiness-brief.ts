import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectCoordinationReadinessBrief,
  type NationalSubjectFlexibilityReadinessBrief,
  type NationalWorkforceFlexibilityIndex,
  type SubjectCoordinationReadinessBand
} from './types';

function coordinationBand(index: number): SubjectCoordinationReadinessBand {
  if (index <= 34) return 'below_coordination';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'coordination_ready';
  return 'flexibility_locked';
}

/** Round-43 / wave-43 subject coordination readiness — flexibility × workforce flexibility (O10-217). */
export function computeNationalSubjectCoordinationReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectFlexibility: NationalSubjectFlexibilityReadinessBrief | null | undefined,
  workforceFlexibility: NationalWorkforceFlexibilityIndex | null | undefined
): NationalSubjectCoordinationReadinessBrief {
  if (!state.enabled || !subjectFlexibility || !workforceFlexibility) {
    return {
      turn: state.turn,
      coordinationIndex: 50,
      band: 'approaching',
      coordinationDrag: 0,
      summary: 'Subject coordination readiness idle — subject flexibility or workforce flexibility unavailable.',
      stewardNote: 'Compute subject flexibility and workforce flexibility before coordination guidance.'
    };
  }

  const coordinationDrag = v1014laborClamp(
    subjectFlexibility.flexibilityDrag * 0.38 +
      workforceFlexibility.flexibilityDrag * 0.38 +
      (subjectFlexibility.band === 'below_flexibility' || workforceFlexibility.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectFlexibility.band === 'flexibility_ready' || subjectFlexibility.band === 'inclusion_locked'
      ? subjectFlexibility.flexibilityIndex * 0.27
      : subjectFlexibility.flexibilityIndex * 0.14;
  const workforceLift =
    workforceFlexibility.band === 'elevated' || workforceFlexibility.band === 'flexibility'
      ? workforceFlexibility.flexibilityIndex * 0.25
      : workforceFlexibility.flexibilityIndex * 0.12;

  const coordinationIndex = v1014laborClamp(20 + subjectLift + workforceLift - coordinationDrag);
  const band = coordinationBand(coordinationIndex);

  const stewardNote =
    band === 'below_coordination' || band === 'approaching'
      ? 'Approaching coordination — hold O10-217 wave-43 scale until flexibility-coordination syncs.'
      : band === 'flexibility_locked'
        ? 'Flexibility-locked coordination — still monitor coordination mesh during corridor peaks.'
        : 'Coordination-ready — pair with workforce coordination index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    coordinationIndex,
    band,
    coordinationDrag,
    summary: `Subject coordination readiness ${band} (index ${Math.round(coordinationIndex)}); coordination drag ${Math.round(coordinationDrag)}.`,
    stewardNote
  };
}
