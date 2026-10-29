import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectAdvocacySteadfastReadinessBrief,
  type NationalSubjectResoluteReadinessBrief,
  type NationalWorkforceAdvocacyDepthIndex,
  type SubjectResoluteReadinessBand
} from './types';

function resoluteBand(index: number): SubjectResoluteReadinessBand {
  if (index <= 34) return 'below_resolute';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'resolute_ready';
  return 'advocacy_locked';
}

/** Round-54 / wave-54 subject resolute readiness — subject advocacy × advocacy depth (O10-240). */
export function computeNationalSubjectResoluteReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectAdvocacy: NationalSubjectAdvocacySteadfastReadinessBrief | null | undefined,
  advocacyDepth: NationalWorkforceAdvocacyDepthIndex | null | undefined
): NationalSubjectResoluteReadinessBrief {
  if (!state.enabled || !subjectAdvocacy || !advocacyDepth) {
    return {
      turn: state.turn,
      resoluteIndex: 50,
      band: 'approaching',
      resoluteDrag: 0,
      summary: 'Subject resolute readiness idle — subject advocacy or advocacy depth unavailable.',
      stewardNote: 'Compute subject advocacy and advocacy depth before resolute guidance.'
    };
  }

  const resoluteDrag = v1014laborClamp(
    subjectAdvocacy.advocacyDrag * 0.36 +
      advocacyDepth.advocacyDrag * 0.36 +
      (subjectAdvocacy.band === 'below_advocacy' || advocacyDepth.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectAdvocacy.band === 'advocacy_ready' || subjectAdvocacy.band === 'steadfast_locked'
      ? subjectAdvocacy.advocacyIndex * 0.25
      : subjectAdvocacy.advocacyIndex * 0.13;
  const depthLift =
    advocacyDepth.band === 'elevated' || advocacyDepth.band === 'advocacy'
      ? advocacyDepth.advocacyIndex * 0.23
      : advocacyDepth.advocacyIndex * 0.12;

  const resoluteIndex = v1014laborClamp(20 + subjectLift + depthLift - resoluteDrag);
  const band = resoluteBand(resoluteIndex);

  const stewardNote =
    band === 'below_resolute' || band === 'approaching'
      ? 'Approaching resolute — hold O10-240 wave-54 scale until advocacy-resolute syncs.'
      : band === 'advocacy_locked'
        ? 'Advocacy-locked resolute — still monitor resolute resilience during corridor peaks.'
        : 'Resolute-ready — pair with workforce resolute depth index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    resoluteIndex,
    band,
    resoluteDrag,
    summary: `Subject resolute readiness ${band} (index ${Math.round(resoluteIndex)}); resolute drag ${Math.round(resoluteDrag)}.`,
    stewardNote
  };
}
