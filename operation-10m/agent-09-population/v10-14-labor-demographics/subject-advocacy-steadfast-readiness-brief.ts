import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectAdvocacySteadfastReadinessBrief,
  type NationalSubjectSteadfastReadinessBrief,
  type NationalWorkforceSteadfastDepthIndex,
  type SubjectAdvocacySteadfastReadinessBand
} from './types';

function advocacyBand(index: number): SubjectAdvocacySteadfastReadinessBand {
  if (index <= 34) return 'below_advocacy';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'advocacy_ready';
  return 'steadfast_locked';
}

/** Round-52 / wave-52 subject advocacy readiness — subject steadfast × steadfast depth (O10-235). */
export function computeNationalSubjectAdvocacySteadfastReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectSteadfast: NationalSubjectSteadfastReadinessBrief | null | undefined,
  steadfastDepth: NationalWorkforceSteadfastDepthIndex | null | undefined
): NationalSubjectAdvocacySteadfastReadinessBrief {
  if (!state.enabled || !subjectSteadfast || !steadfastDepth) {
    return {
      turn: state.turn,
      advocacyIndex: 50,
      band: 'approaching',
      advocacyDrag: 0,
      summary: 'Subject advocacy readiness idle — subject steadfast or steadfast depth unavailable.',
      stewardNote: 'Compute subject steadfast and steadfast depth before advocacy guidance.'
    };
  }

  const advocacyDrag = v1014laborClamp(
    subjectSteadfast.steadfastDrag * 0.36 +
      steadfastDepth.steadfastDrag * 0.36 +
      (subjectSteadfast.band === 'below_steadfast' || steadfastDepth.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectSteadfast.band === 'steadfast_ready' || subjectSteadfast.band === 'resolve_locked'
      ? subjectSteadfast.steadfastIndex * 0.25
      : subjectSteadfast.steadfastIndex * 0.13;
  const depthLift =
    steadfastDepth.band === 'elevated' || steadfastDepth.band === 'steadfast'
      ? steadfastDepth.steadfastIndex * 0.23
      : steadfastDepth.steadfastIndex * 0.12;

  const advocacyIndex = v1014laborClamp(20 + subjectLift + depthLift - advocacyDrag);
  const band = advocacyBand(advocacyIndex);

  const stewardNote =
    band === 'below_advocacy' || band === 'approaching'
      ? 'Approaching advocacy — hold O10-235 wave-52 scale until steadfast-advocacy syncs.'
      : band === 'steadfast_locked'
        ? 'Steadfast-locked advocacy — still monitor advocacy resilience during corridor peaks.'
        : 'Advocacy-ready — pair with workforce advocacy depth index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    advocacyIndex,
    band,
    advocacyDrag,
    summary: `Subject advocacy readiness ${band} (index ${Math.round(advocacyIndex)}); advocacy drag ${Math.round(advocacyDrag)}.`,
    stewardNote
  };
}
