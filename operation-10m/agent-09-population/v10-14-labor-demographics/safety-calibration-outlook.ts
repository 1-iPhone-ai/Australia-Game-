import { v1014laborClamp } from './bands';
import { safetyEaseForRegion } from './catalog/workforce-safety-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSafetyCalibrationOutlook,
  type NationalSchedulingPulseOutlook,
  type SafetyCalibrationBand
} from './types';

function calibrationBand(index: number): SafetyCalibrationBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'calibrated';
}

export function computeNationalSafetyCalibrationOutlook(
  state: NationalLaborDemographicsState,
  schedulingPulse: NationalSchedulingPulseOutlook | null | undefined
): NationalSafetyCalibrationOutlook {
  if (!state.enabled || !schedulingPulse) {
    return {
      turn: state.turn,
      calibrationIndex: 50,
      band: 'patchy',
      schedulingDrag: 0,
      summary: 'Safety calibration idle — scheduling pulse unavailable.',
      stewardNote: 'Compute scheduling pulse before safety calibration guidance.'
    };
  }

  let safetyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    safetyLift += safetyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  safetyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const schedulingDrag = v1014laborClamp(
    schedulingPulse.coordinationDrag * 0.46 +
      (schedulingPulse.band === 'ebbing' || schedulingPulse.band === 'patchy' ? 10 : 3)
  );
  const pulseLift =
    schedulingPulse.band === 'rising' || schedulingPulse.band === 'pulsing'
      ? schedulingPulse.pulseIndex * 0.2
      : schedulingPulse.pulseIndex * 0.1;

  const calibrationIndex = v1014laborClamp(24 + safetyLift * 22 + pulseLift - schedulingDrag);
  const band = calibrationBand(calibrationIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy safety calibration — deploy safety levers before subject safety assembly.'
      : band === 'calibrated'
        ? 'Calibrated band — verify scheduling-safety coupling before auto workforce pushes.'
        : 'Rising calibration — align with scheduling pulse outlook checks.';

  return {
    turn: state.turn,
    calibrationIndex,
    band,
    schedulingDrag,
    summary: `National safety calibration ${band} (index ${Math.round(calibrationIndex)}); scheduling drag ${Math.round(schedulingDrag)}.`,
    stewardNote
  };
}
