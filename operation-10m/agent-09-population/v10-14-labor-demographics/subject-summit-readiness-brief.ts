import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectPinnacleReadinessBrief,
  type NationalSubjectSummitReadinessBrief,
  type NationalWorkforcePinnacleIndex,
  type SubjectSummitReadinessBand
} from './types';

function summitBand(index: number): SubjectSummitReadinessBand {
  if (index <= 34) return 'below_summit';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'summit_ready';
  return 'zenith_locked';
}

/** Round-28 / wave-28 subject summit readiness — pinnacle × workforce pinnacle (O10-187). */
export function computeNationalSubjectSummitReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectPinnacle: NationalSubjectPinnacleReadinessBrief | null | undefined,
  workforcePinnacle: NationalWorkforcePinnacleIndex | null | undefined
): NationalSubjectSummitReadinessBrief {
  if (!state.enabled || !subjectPinnacle || !workforcePinnacle) {
    return {
      turn: state.turn,
      summitIndex: 50,
      band: 'approaching',
      summitDrag: 0,
      summary: 'Subject summit readiness idle — subject pinnacle or workforce pinnacle unavailable.',
      stewardNote: 'Compute subject pinnacle and workforce pinnacle before summit guidance.'
    };
  }

  const summitDrag = v1014laborClamp(
    subjectPinnacle.pinnacleDrag * 0.38 +
      workforcePinnacle.pinnacleDrag * 0.38 +
      (subjectPinnacle.band === 'below_pinnacle' || workforcePinnacle.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectPinnacle.band === 'pinnacle_ready' || subjectPinnacle.band === 'summit_locked'
      ? subjectPinnacle.pinnacleIndex * 0.27
      : subjectPinnacle.pinnacleIndex * 0.14;
  const workforceLift =
    workforcePinnacle.band === 'elevated' || workforcePinnacle.band === 'summit'
      ? workforcePinnacle.pinnacleIndex * 0.25
      : workforcePinnacle.pinnacleIndex * 0.12;

  const summitIndex = v1014laborClamp(20 + subjectLift + workforceLift - summitDrag);
  const band = summitBand(summitIndex);

  const stewardNote =
    band === 'below_summit' || band === 'approaching'
      ? 'Approaching summit — hold O10-187 wave-28 scale until pinnacle-retention syncs.'
      : band === 'zenith_locked'
        ? 'Zenith-locked summit — still monitor retention crest during corridor peaks.'
        : 'Summit-ready — pair with workforce summit index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    summitIndex,
    band,
    summitDrag,
    summary: `Subject summit readiness ${band} (index ${Math.round(summitIndex)}); summit drag ${Math.round(summitDrag)}.`,
    stewardNote
  };
}
