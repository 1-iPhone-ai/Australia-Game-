import { v1014laborClamp } from './bands';
import {
  type NationalAdvocacyResoluteCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalResoluteResilienceOutlook,
  type NationalSubjectResoluteReadinessBrief,
  type NationalWorkforceResoluteDepthIndex,
  type WorkforceResoluteDepthBand
} from './types';

function depthBand(index: number): WorkforceResoluteDepthBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'resolute';
}

export function computeNationalWorkforceResoluteDepthIndex(
  state: NationalLaborDemographicsState,
  advocacyResolute: NationalAdvocacyResoluteCouplingBrief | null | undefined,
  resoluteResilience: NationalResoluteResilienceOutlook | null | undefined,
  subjectResolute: NationalSubjectResoluteReadinessBrief | null | undefined
): NationalWorkforceResoluteDepthIndex {
  if (!state.enabled || !advocacyResolute || !resoluteResilience || !subjectResolute) {
    return {
      turn: state.turn,
      resoluteIndex: 50,
      band: 'thin',
      resoluteDrag: 0,
      summary: 'Workforce resolute depth idle — coupling, resilience, or subject resolute unavailable.',
      stewardNote: 'Compute O10-240 wave-54 depth stack before resolute guidance.'
    };
  }

  const resoluteDrag = v1014laborClamp(
    subjectResolute.resoluteDrag * 0.35 +
      advocacyResolute.advocacyDrag * 0.3 +
      resoluteResilience.advocacyDrag * 0.25 +
      (subjectResolute.band === 'below_resolute' || advocacyResolute.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    advocacyResolute.band === 'amplified' || advocacyResolute.band === 'elevated'
      ? advocacyResolute.couplingIndex * 0.2
      : advocacyResolute.couplingIndex * 0.1;
  const resilienceLift =
    resoluteResilience.band === 'rising' || resoluteResilience.band === 'fortified'
      ? resoluteResilience.resilienceIndex * 0.18
      : resoluteResilience.resilienceIndex * 0.09;
  const subjectLift =
    subjectResolute.band === 'resolute_ready' || subjectResolute.band === 'advocacy_locked'
      ? subjectResolute.resoluteIndex * 0.22
      : subjectResolute.resoluteIndex * 0.11;

  const resoluteIndex = v1014laborClamp(18 + couplingLift + resilienceLift + subjectLift - resoluteDrag);
  const band = depthBand(resoluteIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce resolute depth — sequence advocacy-resolute, resilience, and subject resolute before post-5bd043ad tranche.'
      : band === 'resolute'
        ? 'Resolute band — avoid corridor overload that breaks subject resolute bands.'
        : 'Elevated resolute depth — refresh subject resolute checks each scale wave.';

  return {
    turn: state.turn,
    resoluteIndex,
    band,
    resoluteDrag,
    summary: `National workforce resolute depth ${band} (index ${Math.round(resoluteIndex)}); resolute drag ${Math.round(resoluteDrag)}.`,
    stewardNote
  };
}
