import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectApexReadinessBrief,
  type NationalSubjectPinnacleReadinessBrief,
  type NationalWorkforceApexIndex,
  type SubjectPinnacleReadinessBand
} from './types';

function pinnacleBand(index: number): SubjectPinnacleReadinessBand {
  if (index <= 34) return 'below_pinnacle';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'pinnacle_ready';
  return 'summit_locked';
}

/** Round-27 / wave-27 subject pinnacle readiness — apex × workforce apex (O10-185). */
export function computeNationalSubjectPinnacleReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectApex: NationalSubjectApexReadinessBrief | null | undefined,
  workforceApex: NationalWorkforceApexIndex | null | undefined
): NationalSubjectPinnacleReadinessBrief {
  if (!state.enabled || !subjectApex || !workforceApex) {
    return {
      turn: state.turn,
      pinnacleIndex: 50,
      band: 'approaching',
      pinnacleDrag: 0,
      summary: 'Subject pinnacle readiness idle — subject apex or workforce apex unavailable.',
      stewardNote: 'Compute subject apex and workforce apex before pinnacle guidance.'
    };
  }

  const pinnacleDrag = v1014laborClamp(
    subjectApex.apexDrag * 0.38 +
      workforceApex.apexDrag * 0.38 +
      (subjectApex.band === 'below_apex' || workforceApex.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectApex.band === 'apex_ready' || subjectApex.band === 'summit_locked'
      ? subjectApex.apexIndex * 0.27
      : subjectApex.apexIndex * 0.14;
  const workforceLift =
    workforceApex.band === 'elevated' || workforceApex.band === 'summit'
      ? workforceApex.apexIndex * 0.25
      : workforceApex.apexIndex * 0.12;

  const pinnacleIndex = v1014laborClamp(20 + subjectLift + workforceLift - pinnacleDrag);
  const band = pinnacleBand(pinnacleIndex);

  const stewardNote =
    band === 'below_pinnacle' || band === 'approaching'
      ? 'Approaching pinnacle — hold O10-185 wave-27 scale until apex-advocacy syncs.'
      : band === 'summit_locked'
        ? 'Summit-locked pinnacle — still monitor reengagement thrust during corridor peaks.'
        : 'Pinnacle-ready — pair with workforce pinnacle index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    pinnacleIndex,
    band,
    pinnacleDrag,
    summary: `Subject pinnacle readiness ${band} (index ${Math.round(pinnacleIndex)}); pinnacle drag ${Math.round(pinnacleDrag)}.`,
    stewardNote
  };
}
