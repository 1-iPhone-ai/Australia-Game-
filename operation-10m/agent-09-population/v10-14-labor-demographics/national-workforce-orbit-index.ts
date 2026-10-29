import { v1014laborClamp } from './bands';
import {
  type NationalApogeeInclusionCouplingBrief,
  type NationalInclusionOrbitOutlook,
  type NationalLaborDemographicsState,
  type NationalSubjectOrbitReadinessBrief,
  type NationalWorkforceOrbitIndex,
  type WorkforceOrbitBand
} from './types';

function orbitBand(index: number): WorkforceOrbitBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'orbit';
}

export function computeNationalWorkforceOrbitIndex(
  state: NationalLaborDemographicsState,
  inclusionCoupling: NationalApogeeInclusionCouplingBrief | null | undefined,
  inclusionOrbit: NationalInclusionOrbitOutlook | null | undefined,
  subjectOrbit: NationalSubjectOrbitReadinessBrief | null | undefined
): NationalWorkforceOrbitIndex {
  if (!state.enabled || !inclusionCoupling || !inclusionOrbit || !subjectOrbit) {
    return {
      turn: state.turn,
      orbitIndex: 50,
      band: 'thin',
      orbitDrag: 0,
      summary: 'Workforce orbit idle — inclusion coupling, inclusion orbit, or subject orbit unavailable.',
      stewardNote: 'Compute O10-193 wave-31 depth stack before orbit guidance.'
    };
  }

  const orbitDrag = v1014laborClamp(
    subjectOrbit.orbitDrag * 0.35 +
      inclusionCoupling.apogeeDrag * 0.3 +
      inclusionOrbit.ascentDrag * 0.25 +
      (subjectOrbit.band === 'below_orbit' || inclusionCoupling.band === 'decoupled' ? 8 : 2)
  );
  const inclusionLift =
    inclusionCoupling.band === 'amplified' || inclusionCoupling.band === 'elevated'
      ? inclusionCoupling.couplingIndex * 0.2
      : inclusionCoupling.couplingIndex * 0.1;
  const orbitLift =
    inclusionOrbit.band === 'rising' || inclusionOrbit.band === 'orbit'
      ? inclusionOrbit.orbitIndex * 0.18
      : inclusionOrbit.orbitIndex * 0.09;
  const subjectLift =
    subjectOrbit.band === 'orbit_ready' || subjectOrbit.band === 'crown_locked'
      ? subjectOrbit.orbitIndex * 0.22
      : subjectOrbit.orbitIndex * 0.11;

  const orbitIndex = v1014laborClamp(18 + inclusionLift + orbitLift + subjectLift - orbitDrag);
  const band = orbitBand(orbitIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce orbit — sequence apogee-inclusion, inclusion orbit, and subject orbit before post-81b50b8 tranche.'
      : band === 'orbit'
        ? 'Orbit band — avoid corridor overload that breaks subject orbit bands.'
        : 'Elevated orbit — refresh subject orbit checks each scale wave.';

  return {
    turn: state.turn,
    orbitIndex,
    band,
    orbitDrag,
    summary: `National workforce orbit ${band} (index ${Math.round(orbitIndex)}); orbit drag ${Math.round(orbitDrag)}.`,
    stewardNote
  };
}
