import { v1014laborClamp } from './bands';
import {
  type NationalGritResolveCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalResolveResilienceOutlook,
  type NationalSubjectResolveReadinessBrief,
  type NationalWorkforceResolveDepthIndex,
  type WorkforceResolveDepthBand
} from './types';

function depthBand(index: number): WorkforceResolveDepthBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'resolve';
}

export function computeNationalWorkforceResolveDepthIndex(
  state: NationalLaborDemographicsState,
  gritResolve: NationalGritResolveCouplingBrief | null | undefined,
  resolveResilience: NationalResolveResilienceOutlook | null | undefined,
  subjectResolve: NationalSubjectResolveReadinessBrief | null | undefined
): NationalWorkforceResolveDepthIndex {
  if (!state.enabled || !gritResolve || !resolveResilience || !subjectResolve) {
    return {
      turn: state.turn,
      resolveIndex: 50,
      band: 'thin',
      resolveDrag: 0,
      summary: 'Workforce resolve depth idle — coupling, resilience, or subject resolve unavailable.',
      stewardNote: 'Compute O10-231 wave-50 depth stack before resolve guidance.'
    };
  }

  const resolveDrag = v1014laborClamp(
    subjectResolve.resolveDrag * 0.35 +
      gritResolve.gritDrag * 0.3 +
      resolveResilience.gritDrag * 0.25 +
      (subjectResolve.band === 'below_resolve' || gritResolve.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    gritResolve.band === 'amplified' || gritResolve.band === 'elevated'
      ? gritResolve.couplingIndex * 0.2
      : gritResolve.couplingIndex * 0.1;
  const resilienceLift =
    resolveResilience.band === 'rising' || resolveResilience.band === 'fortified'
      ? resolveResilience.resilienceIndex * 0.18
      : resolveResilience.resilienceIndex * 0.09;
  const subjectLift =
    subjectResolve.band === 'resolve_ready' || subjectResolve.band === 'grit_locked'
      ? subjectResolve.resolveIndex * 0.22
      : subjectResolve.resolveIndex * 0.11;

  const resolveIndex = v1014laborClamp(18 + couplingLift + resilienceLift + subjectLift - resolveDrag);
  const band = depthBand(resolveIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce resolve depth — sequence grit-resolve, resilience, and subject resolve before post-8aaaf700 tranche.'
      : band === 'resolve'
        ? 'Resolve band — avoid corridor overload that breaks subject resolve bands.'
        : 'Elevated resolve depth — refresh subject resolve checks each scale wave.';

  return {
    turn: state.turn,
    resolveIndex,
    band,
    resolveDrag,
    summary: `National workforce resolve depth ${band} (index ${Math.round(resolveIndex)}); resolve drag ${Math.round(resolveDrag)}.`,
    stewardNote
  };
}
