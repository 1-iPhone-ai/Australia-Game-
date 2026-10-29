import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectGritReadinessBrief,
  type NationalSubjectResolveReadinessBrief,
  type NationalWorkforceGritDepthIndex,
  type SubjectResolveReadinessBand
} from './types';

function resolveBand(index: number): SubjectResolveReadinessBand {
  if (index <= 34) return 'below_resolve';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'resolve_ready';
  return 'grit_locked';
}

/** Round-50 / wave-50 subject resolve readiness — subject grit × grit depth (O10-231). */
export function computeNationalSubjectResolveReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectGrit: NationalSubjectGritReadinessBrief | null | undefined,
  gritDepth: NationalWorkforceGritDepthIndex | null | undefined
): NationalSubjectResolveReadinessBrief {
  if (!state.enabled || !subjectGrit || !gritDepth) {
    return {
      turn: state.turn,
      resolveIndex: 50,
      band: 'approaching',
      resolveDrag: 0,
      summary: 'Subject resolve readiness idle — subject grit or grit depth unavailable.',
      stewardNote: 'Compute subject grit and grit depth before resolve guidance.'
    };
  }

  const resolveDrag = v1014laborClamp(
    subjectGrit.gritDrag * 0.36 +
      gritDepth.gritDrag * 0.36 +
      (subjectGrit.band === 'below_grit' || gritDepth.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectGrit.band === 'grit_ready' || subjectGrit.band === 'perseverance_locked'
      ? subjectGrit.gritIndex * 0.25
      : subjectGrit.gritIndex * 0.13;
  const depthLift =
    gritDepth.band === 'elevated' || gritDepth.band === 'grit'
      ? gritDepth.gritIndex * 0.23
      : gritDepth.gritIndex * 0.12;

  const resolveIndex = v1014laborClamp(20 + subjectLift + depthLift - resolveDrag);
  const band = resolveBand(resolveIndex);

  const stewardNote =
    band === 'below_resolve' || band === 'approaching'
      ? 'Approaching resolve — hold O10-231 wave-50 scale until grit-resolve syncs.'
      : band === 'grit_locked'
        ? 'Grit-locked resolve — still monitor resolve resilience during corridor peaks.'
        : 'Resolve-ready — pair with workforce resolve depth index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    resolveIndex,
    band,
    resolveDrag,
    summary: `Subject resolve readiness ${band} (index ${Math.round(resolveIndex)}); resolve drag ${Math.round(resolveDrag)}.`,
    stewardNote
  };
}
