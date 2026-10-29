import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectApogeeReadinessBrief,
  type NationalSubjectOrbitReadinessBrief,
  type NationalWorkforceApogeeIndex,
  type SubjectOrbitReadinessBand
} from './types';

function orbitBand(index: number): SubjectOrbitReadinessBand {
  if (index <= 34) return 'below_orbit';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'orbit_ready';
  return 'crown_locked';
}

/** Round-31 / wave-31 subject orbit readiness — apogee × workforce apogee (O10-193). */
export function computeNationalSubjectOrbitReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectApogee: NationalSubjectApogeeReadinessBrief | null | undefined,
  workforceApogee: NationalWorkforceApogeeIndex | null | undefined
): NationalSubjectOrbitReadinessBrief {
  if (!state.enabled || !subjectApogee || !workforceApogee) {
    return {
      turn: state.turn,
      orbitIndex: 50,
      band: 'approaching',
      orbitDrag: 0,
      summary: 'Subject orbit readiness idle — subject apogee or workforce apogee unavailable.',
      stewardNote: 'Compute subject apogee and workforce apogee before orbit guidance.'
    };
  }

  const orbitDrag = v1014laborClamp(
    subjectApogee.apogeeDrag * 0.38 +
      workforceApogee.apogeeDrag * 0.38 +
      (subjectApogee.band === 'below_apogee' || workforceApogee.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectApogee.band === 'apogee_ready' || subjectApogee.band === 'orbit_locked'
      ? subjectApogee.apogeeIndex * 0.27
      : subjectApogee.apogeeIndex * 0.14;
  const workforceLift =
    workforceApogee.band === 'elevated' || workforceApogee.band === 'apogee'
      ? workforceApogee.apogeeIndex * 0.25
      : workforceApogee.apogeeIndex * 0.12;

  const orbitIndex = v1014laborClamp(20 + subjectLift + workforceLift - orbitDrag);
  const band = orbitBand(orbitIndex);

  const stewardNote =
    band === 'below_orbit' || band === 'approaching'
      ? 'Approaching orbit — hold O10-193 wave-31 scale until apogee-inclusion syncs.'
      : band === 'crown_locked'
        ? 'Crown-locked orbit — still monitor inclusion orbit during corridor peaks.'
        : 'Orbit-ready — pair with workforce orbit index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    orbitIndex,
    band,
    orbitDrag,
    summary: `Subject orbit readiness ${band} (index ${Math.round(orbitIndex)}); orbit drag ${Math.round(orbitDrag)}.`,
    stewardNote
  };
}
