import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectResolveReadinessBrief,
  type NationalSubjectSteadfastReadinessBrief,
  type NationalWorkforceResolveDepthIndex,
  type SubjectSteadfastReadinessBand
} from './types';

function steadfastBand(index: number): SubjectSteadfastReadinessBand {
  if (index <= 34) return 'below_steadfast';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'steadfast_ready';
  return 'resolve_locked';
}

/** Round-51 / wave-51 subject steadfast readiness — subject resolve × resolve depth (O10-233). */
export function computeNationalSubjectSteadfastReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectResolve: NationalSubjectResolveReadinessBrief | null | undefined,
  resolveDepth: NationalWorkforceResolveDepthIndex | null | undefined
): NationalSubjectSteadfastReadinessBrief {
  if (!state.enabled || !subjectResolve || !resolveDepth) {
    return {
      turn: state.turn,
      steadfastIndex: 50,
      band: 'approaching',
      steadfastDrag: 0,
      summary: 'Subject steadfast readiness idle — subject resolve or resolve depth unavailable.',
      stewardNote: 'Compute subject resolve and resolve depth before steadfast guidance.'
    };
  }

  const steadfastDrag = v1014laborClamp(
    subjectResolve.resolveDrag * 0.36 +
      resolveDepth.resolveDrag * 0.36 +
      (subjectResolve.band === 'below_resolve' || resolveDepth.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectResolve.band === 'resolve_ready' || subjectResolve.band === 'grit_locked'
      ? subjectResolve.resolveIndex * 0.25
      : subjectResolve.resolveIndex * 0.13;
  const depthLift =
    resolveDepth.band === 'elevated' || resolveDepth.band === 'resolve'
      ? resolveDepth.resolveIndex * 0.23
      : resolveDepth.resolveIndex * 0.12;

  const steadfastIndex = v1014laborClamp(20 + subjectLift + depthLift - steadfastDrag);
  const band = steadfastBand(steadfastIndex);

  const stewardNote =
    band === 'below_steadfast' || band === 'approaching'
      ? 'Approaching steadfast — hold O10-233 wave-51 scale until resolve-steadfast syncs.'
      : band === 'resolve_locked'
        ? 'Resolve-locked steadfast — still monitor steadfast resilience during corridor peaks.'
        : 'Steadfast-ready — pair with workforce steadfast depth index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    steadfastIndex,
    band,
    steadfastDrag,
    summary: `Subject steadfast readiness ${band} (index ${Math.round(steadfastIndex)}); steadfast drag ${Math.round(steadfastDrag)}.`,
    stewardNote
  };
}
