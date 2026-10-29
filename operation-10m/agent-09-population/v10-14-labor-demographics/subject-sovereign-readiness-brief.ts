import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectResoluteReadinessBrief,
  type NationalSubjectSovereignReadinessBrief,
  type NationalWorkforceResoluteDepthIndex,
  type SubjectSovereignReadinessBand
} from './types';

function sovereignBand(index: number): SubjectSovereignReadinessBand {
  if (index <= 34) return 'below_sovereign';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'sovereign_ready';
  return 'resolute_locked';
}

/** Round-55 / wave-55 subject sovereign readiness — subject resolute × resolute depth (O10-247). */
export function computeNationalSubjectSovereignReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectResolute: NationalSubjectResoluteReadinessBrief | null | undefined,
  resoluteDepth: NationalWorkforceResoluteDepthIndex | null | undefined
): NationalSubjectSovereignReadinessBrief {
  if (!state.enabled || !subjectResolute || !resoluteDepth) {
    return {
      turn: state.turn,
      sovereignIndex: 50,
      band: 'approaching',
      sovereignDrag: 0,
      summary: 'Subject sovereign readiness idle — subject resolute or resolute depth unavailable.',
      stewardNote: 'Compute subject resolute and resolute depth before sovereign guidance.'
    };
  }

  const sovereignDrag = v1014laborClamp(
    subjectResolute.resoluteDrag * 0.36 +
      resoluteDepth.resoluteDrag * 0.36 +
      (subjectResolute.band === 'below_resolute' || resoluteDepth.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectResolute.band === 'resolute_ready' || subjectResolute.band === 'advocacy_locked'
      ? subjectResolute.resoluteIndex * 0.25
      : subjectResolute.resoluteIndex * 0.13;
  const depthLift =
    resoluteDepth.band === 'elevated' || resoluteDepth.band === 'resolute'
      ? resoluteDepth.resoluteIndex * 0.23
      : resoluteDepth.resoluteIndex * 0.12;

  const sovereignIndex = v1014laborClamp(20 + subjectLift + depthLift - sovereignDrag);
  const band = sovereignBand(sovereignIndex);

  const stewardNote =
    band === 'below_sovereign' || band === 'approaching'
      ? 'Approaching sovereign — hold O10-247 wave-55 scale until resolute-sovereign syncs.'
      : band === 'resolute_locked'
        ? 'Resolute-locked sovereign — still monitor sovereign resilience during corridor peaks.'
        : 'Sovereign-ready — pair with workforce sovereign depth index for post-c4bbec67 tranche.';

  return {
    turn: state.turn,
    sovereignIndex,
    band,
    sovereignDrag,
    summary: `Subject sovereign readiness ${band} (index ${Math.round(sovereignIndex)}); sovereign drag ${Math.round(sovereignDrag)}.`,
    stewardNote
  };
}
