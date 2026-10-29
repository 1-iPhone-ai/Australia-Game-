import { v1014laborClamp } from './bands';
import {
  type NationalAdvocacyResilienceOutlook,
  type NationalLaborDemographicsState,
  type NationalSteadfastAdvocacyCouplingBrief,
  type NationalSubjectAdvocacySteadfastReadinessBrief,
  type NationalWorkforceAdvocacyDepthIndex,
  type WorkforceAdvocacyDepthBand
} from './types';

function depthBand(index: number): WorkforceAdvocacyDepthBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'advocacy';
}

export function computeNationalWorkforceAdvocacyDepthIndex(
  state: NationalLaborDemographicsState,
  steadfastAdvocacy: NationalSteadfastAdvocacyCouplingBrief | null | undefined,
  advocacyResilience: NationalAdvocacyResilienceOutlook | null | undefined,
  subjectAdvocacySteadfast: NationalSubjectAdvocacySteadfastReadinessBrief | null | undefined
): NationalWorkforceAdvocacyDepthIndex {
  if (!state.enabled || !steadfastAdvocacy || !advocacyResilience || !subjectAdvocacySteadfast) {
    return {
      turn: state.turn,
      advocacyIndex: 50,
      band: 'thin',
      advocacyDrag: 0,
      summary: 'Workforce advocacy depth idle — coupling, resilience, or subject advocacy unavailable.',
      stewardNote: 'Compute O10-235 wave-52 depth stack before advocacy guidance.'
    };
  }

  const advocacyDrag = v1014laborClamp(
    subjectAdvocacySteadfast.advocacyDrag * 0.35 +
      steadfastAdvocacy.steadfastDrag * 0.3 +
      advocacyResilience.steadfastDrag * 0.25 +
      (subjectAdvocacySteadfast.band === 'below_advocacy' || steadfastAdvocacy.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    steadfastAdvocacy.band === 'amplified' || steadfastAdvocacy.band === 'elevated'
      ? steadfastAdvocacy.couplingIndex * 0.2
      : steadfastAdvocacy.couplingIndex * 0.1;
  const resilienceLift =
    advocacyResilience.band === 'rising' || advocacyResilience.band === 'fortified'
      ? advocacyResilience.resilienceIndex * 0.18
      : advocacyResilience.resilienceIndex * 0.09;
  const subjectLift =
    subjectAdvocacySteadfast.band === 'advocacy_ready' || subjectAdvocacySteadfast.band === 'steadfast_locked'
      ? subjectAdvocacySteadfast.advocacyIndex * 0.22
      : subjectAdvocacySteadfast.advocacyIndex * 0.11;

  const advocacyIndex = v1014laborClamp(18 + couplingLift + resilienceLift + subjectLift - advocacyDrag);
  const band = depthBand(advocacyIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce advocacy depth — sequence steadfast-advocacy, resilience, and subject advocacy before post-ba97bdce tranche.'
      : band === 'advocacy'
        ? 'Advocacy band — avoid corridor overload that breaks subject advocacy bands.'
        : 'Elevated advocacy depth — refresh subject advocacy checks each scale wave.';

  return {
    turn: state.turn,
    advocacyIndex,
    band,
    advocacyDrag,
    summary: `National workforce advocacy depth ${band} (index ${Math.round(advocacyIndex)}); advocacy drag ${Math.round(advocacyDrag)}.`,
    stewardNote
  };
}
