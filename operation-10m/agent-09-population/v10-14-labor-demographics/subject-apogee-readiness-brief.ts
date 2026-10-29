import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectApogeeReadinessBrief,
  type NationalSubjectZenithReadinessBrief,
  type NationalWorkforceZenithIndex,
  type SubjectApogeeReadinessBand
} from './types';

function apogeeBand(index: number): SubjectApogeeReadinessBand {
  if (index <= 34) return 'below_apogee';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'apogee_ready';
  return 'orbit_locked';
}

/** Round-30 / wave-30 subject apogee readiness — zenith × workforce zenith (O10-191). */
export function computeNationalSubjectApogeeReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectZenith: NationalSubjectZenithReadinessBrief | null | undefined,
  workforceZenith: NationalWorkforceZenithIndex | null | undefined
): NationalSubjectApogeeReadinessBrief {
  if (!state.enabled || !subjectZenith || !workforceZenith) {
    return {
      turn: state.turn,
      apogeeIndex: 50,
      band: 'approaching',
      apogeeDrag: 0,
      summary: 'Subject apogee readiness idle — subject zenith or workforce zenith unavailable.',
      stewardNote: 'Compute subject zenith and workforce zenith before apogee guidance.'
    };
  }

  const apogeeDrag = v1014laborClamp(
    subjectZenith.zenithDrag * 0.38 +
      workforceZenith.zenithDrag * 0.38 +
      (subjectZenith.band === 'below_zenith' || workforceZenith.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectZenith.band === 'zenith_ready' || subjectZenith.band === 'horizon_locked'
      ? subjectZenith.zenithIndex * 0.27
      : subjectZenith.zenithIndex * 0.14;
  const workforceLift =
    workforceZenith.band === 'elevated' || workforceZenith.band === 'horizon'
      ? workforceZenith.zenithIndex * 0.25
      : workforceZenith.zenithIndex * 0.12;

  const apogeeIndex = v1014laborClamp(20 + subjectLift + workforceLift - apogeeDrag);
  const band = apogeeBand(apogeeIndex);

  const stewardNote =
    band === 'below_apogee' || band === 'approaching'
      ? 'Approaching apogee — hold O10-191 wave-30 scale until zenith-flexibility syncs.'
      : band === 'orbit_locked'
        ? 'Orbit-locked apogee — still monitor flexibility ascent during corridor peaks.'
        : 'Apogee-ready — pair with workforce apogee index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    apogeeIndex,
    band,
    apogeeDrag,
    summary: `Subject apogee readiness ${band} (index ${Math.round(apogeeIndex)}); apogee drag ${Math.round(apogeeDrag)}.`,
    stewardNote
  };
}
