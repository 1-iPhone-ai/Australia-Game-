import { v1014laborClamp } from './bands';
import {
  type NationalApexAdvocacyCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalReengagementThrustOutlook,
  type NationalSubjectPinnacleReadinessBrief,
  type NationalWorkforcePinnacleIndex,
  type WorkforcePinnacleBand
} from './types';

function pinnacleBand(index: number): WorkforcePinnacleBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'summit';
}

export function computeNationalWorkforcePinnacleIndex(
  state: NationalLaborDemographicsState,
  advocacyCoupling: NationalApexAdvocacyCouplingBrief | null | undefined,
  reengagementThrust: NationalReengagementThrustOutlook | null | undefined,
  subjectPinnacle: NationalSubjectPinnacleReadinessBrief | null | undefined
): NationalWorkforcePinnacleIndex {
  if (!state.enabled || !advocacyCoupling || !reengagementThrust || !subjectPinnacle) {
    return {
      turn: state.turn,
      pinnacleIndex: 50,
      band: 'thin',
      pinnacleDrag: 0,
      summary: 'Workforce pinnacle idle — advocacy coupling, reengagement thrust, or subject pinnacle unavailable.',
      stewardNote: 'Compute O10-185 wave-27 depth stack before pinnacle guidance.'
    };
  }

  const pinnacleDrag = v1014laborClamp(
    subjectPinnacle.pinnacleDrag * 0.35 +
      advocacyCoupling.apexDrag * 0.3 +
      reengagementThrust.sustainDrag * 0.25 +
      (subjectPinnacle.band === 'below_pinnacle' || advocacyCoupling.band === 'decoupled' ? 8 : 2)
  );
  const advocacyLift =
    advocacyCoupling.band === 'amplified' || advocacyCoupling.band === 'elevated'
      ? advocacyCoupling.couplingIndex * 0.2
      : advocacyCoupling.couplingIndex * 0.1;
  const thrustLift =
    reengagementThrust.band === 'building' || reengagementThrust.band === 'surging'
      ? reengagementThrust.thrustIndex * 0.18
      : reengagementThrust.thrustIndex * 0.09;
  const subjectLift =
    subjectPinnacle.band === 'pinnacle_ready' || subjectPinnacle.band === 'summit_locked'
      ? subjectPinnacle.pinnacleIndex * 0.22
      : subjectPinnacle.pinnacleIndex * 0.11;

  const pinnacleIndex = v1014laborClamp(18 + advocacyLift + thrustLift + subjectLift - pinnacleDrag);
  const band = pinnacleBand(pinnacleIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce pinnacle — sequence apex-advocacy, reengagement thrust, and subject pinnacle before post-7c1cfd89 tranche.'
      : band === 'summit'
        ? 'Summit pinnacle — avoid corridor overload that breaks subject pinnacle bands.'
        : 'Elevated pinnacle — refresh subject pinnacle checks each scale wave.';

  return {
    turn: state.turn,
    pinnacleIndex,
    band,
    pinnacleDrag,
    summary: `National workforce pinnacle ${band} (index ${Math.round(pinnacleIndex)}); pinnacle drag ${Math.round(pinnacleDrag)}.`,
    stewardNote
  };
}
