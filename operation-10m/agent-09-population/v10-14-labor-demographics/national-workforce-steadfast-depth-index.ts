import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalResolveSteadfastCouplingBrief,
  type NationalSteadfastResilienceOutlook,
  type NationalSubjectSteadfastReadinessBrief,
  type NationalWorkforceSteadfastDepthIndex,
  type WorkforceSteadfastDepthBand
} from './types';

function depthBand(index: number): WorkforceSteadfastDepthBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'steadfast';
}

export function computeNationalWorkforceSteadfastDepthIndex(
  state: NationalLaborDemographicsState,
  resolveSteadfast: NationalResolveSteadfastCouplingBrief | null | undefined,
  steadfastResilience: NationalSteadfastResilienceOutlook | null | undefined,
  subjectSteadfast: NationalSubjectSteadfastReadinessBrief | null | undefined
): NationalWorkforceSteadfastDepthIndex {
  if (!state.enabled || !resolveSteadfast || !steadfastResilience || !subjectSteadfast) {
    return {
      turn: state.turn,
      steadfastIndex: 50,
      band: 'thin',
      steadfastDrag: 0,
      summary: 'Workforce steadfast depth idle — coupling, resilience, or subject steadfast unavailable.',
      stewardNote: 'Compute O10-233 wave-51 depth stack before steadfast guidance.'
    };
  }

  const steadfastDrag = v1014laborClamp(
    subjectSteadfast.steadfastDrag * 0.35 +
      resolveSteadfast.resolveDrag * 0.3 +
      steadfastResilience.resolveDrag * 0.25 +
      (subjectSteadfast.band === 'below_steadfast' || resolveSteadfast.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    resolveSteadfast.band === 'amplified' || resolveSteadfast.band === 'elevated'
      ? resolveSteadfast.couplingIndex * 0.2
      : resolveSteadfast.couplingIndex * 0.1;
  const resilienceLift =
    steadfastResilience.band === 'rising' || steadfastResilience.band === 'fortified'
      ? steadfastResilience.resilienceIndex * 0.18
      : steadfastResilience.resilienceIndex * 0.09;
  const subjectLift =
    subjectSteadfast.band === 'steadfast_ready' || subjectSteadfast.band === 'resolve_locked'
      ? subjectSteadfast.steadfastIndex * 0.22
      : subjectSteadfast.steadfastIndex * 0.11;

  const steadfastIndex = v1014laborClamp(18 + couplingLift + resilienceLift + subjectLift - steadfastDrag);
  const band = depthBand(steadfastIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce steadfast depth — sequence resolve-steadfast, resilience, and subject steadfast before post-a32b2b15 tranche.'
      : band === 'steadfast'
        ? 'Steadfast band — avoid corridor overload that breaks subject steadfast bands.'
        : 'Elevated steadfast depth — refresh subject steadfast checks each scale wave.';

  return {
    turn: state.turn,
    steadfastIndex,
    band,
    steadfastDrag,
    summary: `National workforce steadfast depth ${band} (index ${Math.round(steadfastIndex)}); steadfast drag ${Math.round(steadfastDrag)}.`,
    stewardNote
  };
}
