import { v1014laborClamp } from './bands';
import {
  type NationalFlexibilityAscentOutlook,
  type NationalLaborDemographicsState,
  type NationalSubjectApogeeReadinessBrief,
  type NationalWorkforceApogeeIndex,
  type NationalZenithFlexibilityCouplingBrief,
  type WorkforceApogeeBand
} from './types';

function apogeeBand(index: number): WorkforceApogeeBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'apogee';
}

export function computeNationalWorkforceApogeeIndex(
  state: NationalLaborDemographicsState,
  flexibilityCoupling: NationalZenithFlexibilityCouplingBrief | null | undefined,
  flexibilityAscent: NationalFlexibilityAscentOutlook | null | undefined,
  subjectApogee: NationalSubjectApogeeReadinessBrief | null | undefined
): NationalWorkforceApogeeIndex {
  if (!state.enabled || !flexibilityCoupling || !flexibilityAscent || !subjectApogee) {
    return {
      turn: state.turn,
      apogeeIndex: 50,
      band: 'thin',
      apogeeDrag: 0,
      summary: 'Workforce apogee idle — flexibility coupling, flexibility ascent, or subject apogee unavailable.',
      stewardNote: 'Compute O10-191 wave-30 depth stack before apogee guidance.'
    };
  }

  const apogeeDrag = v1014laborClamp(
    subjectApogee.apogeeDrag * 0.35 +
      flexibilityCoupling.zenithDrag * 0.3 +
      flexibilityAscent.horizonDrag * 0.25 +
      (subjectApogee.band === 'below_apogee' || flexibilityCoupling.band === 'decoupled' ? 8 : 2)
  );
  const flexibilityLift =
    flexibilityCoupling.band === 'amplified' || flexibilityCoupling.band === 'elevated'
      ? flexibilityCoupling.couplingIndex * 0.2
      : flexibilityCoupling.couplingIndex * 0.1;
  const ascentLift =
    flexibilityAscent.band === 'rising' || flexibilityAscent.band === 'ascent'
      ? flexibilityAscent.ascentIndex * 0.18
      : flexibilityAscent.ascentIndex * 0.09;
  const subjectLift =
    subjectApogee.band === 'apogee_ready' || subjectApogee.band === 'orbit_locked'
      ? subjectApogee.apogeeIndex * 0.22
      : subjectApogee.apogeeIndex * 0.11;

  const apogeeIndex = v1014laborClamp(18 + flexibilityLift + ascentLift + subjectLift - apogeeDrag);
  const band = apogeeBand(apogeeIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce apogee — sequence zenith-flexibility, flexibility ascent, and subject apogee before post-88fa570 tranche.'
      : band === 'apogee'
        ? 'Apogee band — avoid corridor overload that breaks subject apogee bands.'
        : 'Elevated apogee — refresh subject apogee checks each scale wave.';

  return {
    turn: state.turn,
    apogeeIndex,
    band,
    apogeeDrag,
    summary: `National workforce apogee ${band} (index ${Math.round(apogeeIndex)}); apogee drag ${Math.round(apogeeDrag)}.`,
    stewardNote
  };
}
