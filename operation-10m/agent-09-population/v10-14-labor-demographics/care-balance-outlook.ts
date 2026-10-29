import { v1014laborClamp } from './bands';
import { careReliefForRegion } from './catalog/workforce-care-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type CareBalanceBand,
  type NationalCareBalanceOutlook,
  type NationalLaborDemographicsState,
  type NationalSafetyCalibrationOutlook
} from './types';

function balanceBand(index: number): CareBalanceBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'balanced';
}

export function computeNationalCareBalanceOutlook(
  state: NationalLaborDemographicsState,
  safetyCalibration: NationalSafetyCalibrationOutlook | null | undefined
): NationalCareBalanceOutlook {
  if (!state.enabled || !safetyCalibration) {
    return {
      turn: state.turn,
      balanceIndex: 50,
      band: 'patchy',
      safetyDrag: 0,
      summary: 'Care balance idle — safety calibration unavailable.',
      stewardNote: 'Compute safety calibration before care balance guidance.'
    };
  }

  let careLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    careLift += careReliefForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  careLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const safetyDrag = v1014laborClamp(
    safetyCalibration.schedulingDrag * 0.46 +
      (safetyCalibration.band === 'ebbing' || safetyCalibration.band === 'patchy' ? 10 : 3)
  );
  const calibrationLift =
    safetyCalibration.band === 'rising' || safetyCalibration.band === 'calibrated'
      ? safetyCalibration.calibrationIndex * 0.2
      : safetyCalibration.calibrationIndex * 0.1;

  const balanceIndex = v1014laborClamp(24 + careLift * 22 + calibrationLift - safetyDrag);
  const band = balanceBand(balanceIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy care balance — deploy care levers before subject care assembly.'
      : band === 'balanced'
        ? 'Balanced band — verify safety-care coupling before auto workforce pushes.'
        : 'Rising balance — align with safety calibration outlook checks.';

  return {
    turn: state.turn,
    balanceIndex,
    band,
    safetyDrag,
    summary: `National care balance ${band} (index ${Math.round(balanceIndex)}); safety drag ${Math.round(safetyDrag)}.`,
    stewardNote
  };
}
