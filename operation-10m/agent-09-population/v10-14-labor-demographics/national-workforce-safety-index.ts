import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSafetyCalibrationOutlook,
  type NationalSchedulingSafetyCouplingBrief,
  type NationalSubjectSafetyReadinessBrief,
  type NationalWorkforceSafetyIndex,
  type WorkforceSafetyBand
} from './types';

function safetyBand(index: number): WorkforceSafetyBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'safety';
}

export function computeNationalWorkforceSafetyIndex(
  state: NationalLaborDemographicsState,
  safetyCoupling: NationalSchedulingSafetyCouplingBrief | null | undefined,
  safetyCalibration: NationalSafetyCalibrationOutlook | null | undefined,
  subjectSafety: NationalSubjectSafetyReadinessBrief | null | undefined
): NationalWorkforceSafetyIndex {
  if (!state.enabled || !safetyCoupling || !safetyCalibration || !subjectSafety) {
    return {
      turn: state.turn,
      safetyIndex: 50,
      band: 'thin',
      safetyDrag: 0,
      summary: 'Workforce safety idle — safety coupling, calibration, or subject safety unavailable.',
      stewardNote: 'Compute O10-221 wave-45 depth stack before safety guidance.'
    };
  }

  const safetyDrag = v1014laborClamp(
    subjectSafety.safetyDrag * 0.35 +
      safetyCoupling.schedulingDrag * 0.3 +
      safetyCalibration.schedulingDrag * 0.25 +
      (subjectSafety.band === 'below_safety' || safetyCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    safetyCoupling.band === 'amplified' || safetyCoupling.band === 'elevated'
      ? safetyCoupling.couplingIndex * 0.2
      : safetyCoupling.couplingIndex * 0.1;
  const calibrationLift =
    safetyCalibration.band === 'rising' || safetyCalibration.band === 'calibrated'
      ? safetyCalibration.calibrationIndex * 0.18
      : safetyCalibration.calibrationIndex * 0.09;
  const subjectLift =
    subjectSafety.band === 'safety_ready' || subjectSafety.band === 'scheduling_locked'
      ? subjectSafety.safetyIndex * 0.22
      : subjectSafety.safetyIndex * 0.11;

  const safetyIndex = v1014laborClamp(18 + couplingLift + calibrationLift + subjectLift - safetyDrag);
  const band = safetyBand(safetyIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce safety — sequence scheduling-safety, safety calibration, and subject safety before post-98bcd652 tranche.'
      : band === 'safety'
        ? 'Safety band — avoid corridor overload that breaks subject safety bands.'
        : 'Elevated safety — refresh subject safety checks each scale wave.';

  return {
    turn: state.turn,
    safetyIndex,
    band,
    safetyDrag,
    summary: `National workforce safety ${band} (index ${Math.round(safetyIndex)}); safety drag ${Math.round(safetyDrag)}.`,
    stewardNote
  };
}
