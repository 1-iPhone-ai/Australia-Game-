import { v1014laborClamp } from './bands';
import {
  type NationalCoordinationHorizonOutlook,
  type NationalLaborDemographicsState,
  type NationalSubjectZenithReadinessBrief,
  type NationalSummitCoordinationCouplingBrief,
  type NationalWorkforceZenithIndex,
  type WorkforceZenithBand
} from './types';

function zenithBand(index: number): WorkforceZenithBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'horizon';
}

export function computeNationalWorkforceZenithIndex(
  state: NationalLaborDemographicsState,
  coordinationCoupling: NationalSummitCoordinationCouplingBrief | null | undefined,
  coordinationHorizon: NationalCoordinationHorizonOutlook | null | undefined,
  subjectZenith: NationalSubjectZenithReadinessBrief | null | undefined
): NationalWorkforceZenithIndex {
  if (!state.enabled || !coordinationCoupling || !coordinationHorizon || !subjectZenith) {
    return {
      turn: state.turn,
      zenithIndex: 50,
      band: 'thin',
      zenithDrag: 0,
      summary: 'Workforce zenith idle — coordination coupling, coordination horizon, or subject zenith unavailable.',
      stewardNote: 'Compute O10-189 wave-29 depth stack before zenith guidance.'
    };
  }

  const zenithDrag = v1014laborClamp(
    subjectZenith.zenithDrag * 0.35 +
      coordinationCoupling.summitDrag * 0.3 +
      coordinationHorizon.crestDrag * 0.25 +
      (subjectZenith.band === 'below_zenith' || coordinationCoupling.band === 'decoupled' ? 8 : 2)
  );
  const coordinationLift =
    coordinationCoupling.band === 'amplified' || coordinationCoupling.band === 'elevated'
      ? coordinationCoupling.couplingIndex * 0.2
      : coordinationCoupling.couplingIndex * 0.1;
  const horizonLift =
    coordinationHorizon.band === 'rising' || coordinationHorizon.band === 'horizon'
      ? coordinationHorizon.horizonIndex * 0.18
      : coordinationHorizon.horizonIndex * 0.09;
  const subjectLift =
    subjectZenith.band === 'zenith_ready' || subjectZenith.band === 'horizon_locked'
      ? subjectZenith.zenithIndex * 0.22
      : subjectZenith.zenithIndex * 0.11;

  const zenithIndex = v1014laborClamp(18 + coordinationLift + horizonLift + subjectLift - zenithDrag);
  const band = zenithBand(zenithIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce zenith — sequence summit-coordination, coordination horizon, and subject zenith before post-70df4aee tranche.'
      : band === 'horizon'
        ? 'Horizon zenith — avoid corridor overload that breaks subject zenith bands.'
        : 'Elevated zenith — refresh subject zenith checks each scale wave.';

  return {
    turn: state.turn,
    zenithIndex,
    band,
    zenithDrag,
    summary: `National workforce zenith ${band} (index ${Math.round(zenithIndex)}); zenith drag ${Math.round(zenithDrag)}.`,
    stewardNote
  };
}
