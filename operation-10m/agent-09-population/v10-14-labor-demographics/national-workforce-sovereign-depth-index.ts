import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalResoluteSovereignCouplingBrief,
  type NationalSovereignResilienceOutlook,
  type NationalSubjectSovereignReadinessBrief,
  type NationalWorkforceSovereignDepthIndex,
  type WorkforceSovereignDepthBand
} from './types';

function depthBand(index: number): WorkforceSovereignDepthBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'sovereign';
}

export function computeNationalWorkforceSovereignDepthIndex(
  state: NationalLaborDemographicsState,
  resoluteSovereign: NationalResoluteSovereignCouplingBrief | null | undefined,
  sovereignResilience: NationalSovereignResilienceOutlook | null | undefined,
  subjectSovereign: NationalSubjectSovereignReadinessBrief | null | undefined
): NationalWorkforceSovereignDepthIndex {
  if (!state.enabled || !resoluteSovereign || !sovereignResilience || !subjectSovereign) {
    return {
      turn: state.turn,
      sovereignIndex: 50,
      band: 'thin',
      sovereignDrag: 0,
      summary: 'Workforce sovereign depth idle — coupling, resilience, or subject sovereign unavailable.',
      stewardNote: 'Compute O10-247 wave-55 depth stack before sovereign guidance.'
    };
  }

  const sovereignDrag = v1014laborClamp(
    subjectSovereign.sovereignDrag * 0.35 +
      resoluteSovereign.resoluteDrag * 0.3 +
      sovereignResilience.resoluteDrag * 0.25 +
      (subjectSovereign.band === 'below_sovereign' || resoluteSovereign.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    resoluteSovereign.band === 'amplified' || resoluteSovereign.band === 'elevated'
      ? resoluteSovereign.couplingIndex * 0.2
      : resoluteSovereign.couplingIndex * 0.1;
  const resilienceLift =
    sovereignResilience.band === 'rising' || sovereignResilience.band === 'fortified'
      ? sovereignResilience.resilienceIndex * 0.18
      : sovereignResilience.resilienceIndex * 0.09;
  const subjectLift =
    subjectSovereign.band === 'sovereign_ready' || subjectSovereign.band === 'resolute_locked'
      ? subjectSovereign.sovereignIndex * 0.22
      : subjectSovereign.sovereignIndex * 0.11;

  const sovereignIndex = v1014laborClamp(18 + couplingLift + resilienceLift + subjectLift - sovereignDrag);
  const band = depthBand(sovereignIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce sovereign depth — sequence resolute-sovereign, resilience, and subject sovereign before post-c4bbec67 tranche.'
      : band === 'sovereign'
        ? 'Sovereign band — avoid corridor overload that breaks subject sovereign bands.'
        : 'Elevated sovereign depth — refresh subject sovereign checks each scale wave.';

  return {
    turn: state.turn,
    sovereignIndex,
    band,
    sovereignDrag,
    summary: `National workforce sovereign depth ${band} (index ${Math.round(sovereignIndex)}); sovereign drag ${Math.round(sovereignDrag)}.`,
    stewardNote
  };
}
