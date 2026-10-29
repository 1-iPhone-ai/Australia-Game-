import { v1014laborClamp } from './bands';
import {
  type NationalCareTenacityCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalSubjectTenacityReadinessBrief,
  type NationalTenacityResilienceOutlook,
  type NationalWorkforceTenacityDepthIndex,
  type WorkforceTenacityDepthBand
} from './types';

function depthBand(index: number): WorkforceTenacityDepthBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'tenacity';
}

export function computeNationalWorkforceTenacityDepthIndex(
  state: NationalLaborDemographicsState,
  careTenacity: NationalCareTenacityCouplingBrief | null | undefined,
  tenacityResilience: NationalTenacityResilienceOutlook | null | undefined,
  subjectTenacity: NationalSubjectTenacityReadinessBrief | null | undefined
): NationalWorkforceTenacityDepthIndex {
  if (!state.enabled || !careTenacity || !tenacityResilience || !subjectTenacity) {
    return {
      turn: state.turn,
      tenacityIndex: 50,
      band: 'thin',
      tenacityDrag: 0,
      summary: 'Workforce tenacity depth idle — care-tenacity, resilience, or subject tenacity unavailable.',
      stewardNote: 'Compute O10-225 wave-47 depth stack before tenacity guidance.'
    };
  }

  const tenacityDrag = v1014laborClamp(
    subjectTenacity.tenacityDrag * 0.35 +
      careTenacity.careDrag * 0.3 +
      tenacityResilience.careDrag * 0.25 +
      (subjectTenacity.band === 'below_tenacity' || careTenacity.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    careTenacity.band === 'amplified' || careTenacity.band === 'elevated'
      ? careTenacity.couplingIndex * 0.2
      : careTenacity.couplingIndex * 0.1;
  const resilienceLift =
    tenacityResilience.band === 'rising' || tenacityResilience.band === 'fortified'
      ? tenacityResilience.resilienceIndex * 0.18
      : tenacityResilience.resilienceIndex * 0.09;
  const subjectLift =
    subjectTenacity.band === 'tenacity_ready' || subjectTenacity.band === 'care_locked'
      ? subjectTenacity.tenacityIndex * 0.22
      : subjectTenacity.tenacityIndex * 0.11;

  const tenacityIndex = v1014laborClamp(18 + couplingLift + resilienceLift + subjectLift - tenacityDrag);
  const band = depthBand(tenacityIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce tenacity depth — sequence care-tenacity, resilience, and subject tenacity before post-456efb9 tranche.'
      : band === 'tenacity'
        ? 'Tenacity band — avoid corridor overload that breaks subject tenacity bands.'
        : 'Elevated tenacity depth — refresh subject tenacity checks each scale wave.';

  return {
    turn: state.turn,
    tenacityIndex,
    band,
    tenacityDrag,
    summary: `National workforce tenacity depth ${band} (index ${Math.round(tenacityIndex)}); tenacity drag ${Math.round(tenacityDrag)}.`,
    stewardNote
  };
}
