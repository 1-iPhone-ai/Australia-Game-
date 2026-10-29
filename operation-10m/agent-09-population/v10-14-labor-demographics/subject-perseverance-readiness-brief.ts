import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectPerseveranceReadinessBrief,
  type NationalSubjectTenacityReadinessBrief,
  type NationalWorkforceTenacityDepthIndex,
  type SubjectPerseveranceReadinessBand
} from './types';

function perseveranceBand(index: number): SubjectPerseveranceReadinessBand {
  if (index <= 34) return 'below_perseverance';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'perseverance_ready';
  return 'tenacity_locked';
}

/** Round-48 / wave-48 subject perseverance readiness — subject tenacity × tenacity depth (O10-227). */
export function computeNationalSubjectPerseveranceReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectTenacity: NationalSubjectTenacityReadinessBrief | null | undefined,
  tenacityDepth: NationalWorkforceTenacityDepthIndex | null | undefined
): NationalSubjectPerseveranceReadinessBrief {
  if (!state.enabled || !subjectTenacity || !tenacityDepth) {
    return {
      turn: state.turn,
      perseveranceIndex: 50,
      band: 'approaching',
      perseveranceDrag: 0,
      summary: 'Subject perseverance readiness idle — subject tenacity or tenacity depth unavailable.',
      stewardNote: 'Compute subject tenacity and tenacity depth before perseverance guidance.'
    };
  }

  const perseveranceDrag = v1014laborClamp(
    subjectTenacity.tenacityDrag * 0.37 +
      tenacityDepth.tenacityDrag * 0.37 +
      (subjectTenacity.band === 'below_tenacity' || tenacityDepth.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectTenacity.band === 'tenacity_ready' || subjectTenacity.band === 'care_locked'
      ? subjectTenacity.tenacityIndex * 0.26
      : subjectTenacity.tenacityIndex * 0.13;
  const depthLift =
    tenacityDepth.band === 'elevated' || tenacityDepth.band === 'tenacity'
      ? tenacityDepth.tenacityIndex * 0.24
      : tenacityDepth.tenacityIndex * 0.12;

  const perseveranceIndex = v1014laborClamp(20 + subjectLift + depthLift - perseveranceDrag);
  const band = perseveranceBand(perseveranceIndex);

  const stewardNote =
    band === 'below_perseverance' || band === 'approaching'
      ? 'Approaching perseverance — hold O10-227 wave-48 scale until tenacity-perseverance syncs.'
      : band === 'tenacity_locked'
        ? 'Tenacity-locked perseverance — still monitor perseverance resilience during corridor peaks.'
        : 'Perseverance-ready — pair with workforce perseverance depth index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    perseveranceIndex,
    band,
    perseveranceDrag,
    summary: `Subject perseverance readiness ${band} (index ${Math.round(perseveranceIndex)}); perseverance drag ${Math.round(perseveranceDrag)}.`,
    stewardNote
  };
}
