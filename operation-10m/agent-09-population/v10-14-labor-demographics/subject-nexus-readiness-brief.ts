import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectNexusReadinessBrief,
  type NationalSubjectOrbitReadinessBrief,
  type NationalWorkforceOrbitIndex,
  type SubjectNexusReadinessBand
} from './types';

function nexusBand(index: number): SubjectNexusReadinessBand {
  if (index <= 34) return 'below_nexus';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'nexus_ready';
  return 'sealed_locked';
}

/** Round-32 / wave-32 subject nexus readiness — orbit × workforce orbit (O10-195). */
export function computeNationalSubjectNexusReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectOrbit: NationalSubjectOrbitReadinessBrief | null | undefined,
  workforceOrbit: NationalWorkforceOrbitIndex | null | undefined
): NationalSubjectNexusReadinessBrief {
  if (!state.enabled || !subjectOrbit || !workforceOrbit) {
    return {
      turn: state.turn,
      nexusIndex: 50,
      band: 'approaching',
      nexusDrag: 0,
      summary: 'Subject nexus readiness idle — subject orbit or workforce orbit unavailable.',
      stewardNote: 'Compute subject orbit and workforce orbit before nexus guidance.'
    };
  }

  const nexusDrag = v1014laborClamp(
    subjectOrbit.orbitDrag * 0.38 +
      workforceOrbit.orbitDrag * 0.38 +
      (subjectOrbit.band === 'below_orbit' || workforceOrbit.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectOrbit.band === 'orbit_ready' || subjectOrbit.band === 'crown_locked'
      ? subjectOrbit.orbitIndex * 0.27
      : subjectOrbit.orbitIndex * 0.14;
  const workforceLift =
    workforceOrbit.band === 'elevated' || workforceOrbit.band === 'orbit'
      ? workforceOrbit.orbitIndex * 0.25
      : workforceOrbit.orbitIndex * 0.12;

  const nexusIndex = v1014laborClamp(20 + subjectLift + workforceLift - nexusDrag);
  const band = nexusBand(nexusIndex);

  const stewardNote =
    band === 'below_nexus' || band === 'approaching'
      ? 'Approaching nexus — hold O10-195 wave-32 scale until orbit-care syncs.'
      : band === 'sealed_locked'
        ? 'Sealed-locked nexus — still monitor care equilibrium during corridor peaks.'
        : 'Nexus-ready — pair with workforce nexus index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    nexusIndex,
    band,
    nexusDrag,
    summary: `Subject nexus readiness ${band} (index ${Math.round(nexusIndex)}); nexus drag ${Math.round(nexusDrag)}.`,
    stewardNote
  };
}
