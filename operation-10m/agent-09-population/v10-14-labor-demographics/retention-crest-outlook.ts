import { v1014laborClamp } from './bands';
import { retentionPullForRegion } from './catalog/workforce-retention-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalReengagementThrustOutlook,
  type NationalRetentionCrestOutlook,
  type RetentionCrestBand
} from './types';

function crestBand(index: number): RetentionCrestBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'cresting';
}

export function computeNationalRetentionCrestOutlook(
  state: NationalLaborDemographicsState,
  reengagementThrust: NationalReengagementThrustOutlook | null | undefined
): NationalRetentionCrestOutlook {
  if (!state.enabled || !reengagementThrust) {
    return {
      turn: state.turn,
      crestIndex: 50,
      band: 'patchy',
      thrustDrag: 0,
      summary: 'Retention crest idle — reengagement thrust unavailable.',
      stewardNote: 'Compute reengagement thrust before retention crest guidance.'
    };
  }

  let retentionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    retentionLift += retentionPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  retentionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const thrustDrag = v1014laborClamp(
    reengagementThrust.sustainDrag * 0.46 +
      (reengagementThrust.band === 'stalled' || reengagementThrust.band === 'patchy' ? 10 : 3)
  );
  const thrustLift =
    reengagementThrust.band === 'building' || reengagementThrust.band === 'surging'
      ? reengagementThrust.thrustIndex * 0.2
      : reengagementThrust.thrustIndex * 0.1;

  const crestIndex = v1014laborClamp(24 + retentionLift * 22 + thrustLift - thrustDrag);
  const band = crestBand(crestIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy retention crest — deploy retention levers before subject summit assembly.'
      : band === 'cresting'
        ? 'Cresting band — verify pinnacle-retention coupling before auto workforce pushes.'
        : 'Rising crest — align with retention anchor outlook checks.';

  return {
    turn: state.turn,
    crestIndex,
    band,
    thrustDrag,
    summary: `National retention crest ${band} (index ${Math.round(crestIndex)}); thrust drag ${Math.round(thrustDrag)}.`,
    stewardNote
  };
}
