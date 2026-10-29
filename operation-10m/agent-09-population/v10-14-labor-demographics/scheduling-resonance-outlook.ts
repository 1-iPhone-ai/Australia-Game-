import { v1014laborClamp } from './bands';
import { schedulingEaseForRegion } from './catalog/workforce-scheduling-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalCareEquilibriumOutlook,
  type NationalLaborDemographicsState,
  type NationalSchedulingResonanceOutlook,
  type SchedulingResonanceBand
} from './types';

function resonanceBand(index: number): SchedulingResonanceBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'resonance';
}

export function computeNationalSchedulingResonanceOutlook(
  state: NationalLaborDemographicsState,
  careEquilibrium: NationalCareEquilibriumOutlook | null | undefined
): NationalSchedulingResonanceOutlook {
  if (!state.enabled || !careEquilibrium) {
    return {
      turn: state.turn,
      resonanceIndex: 50,
      band: 'patchy',
      equilibriumDrag: 0,
      summary: 'Scheduling resonance idle — care equilibrium unavailable.',
      stewardNote: 'Compute care equilibrium before scheduling resonance guidance.'
    };
  }

  let schedulingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    schedulingLift += schedulingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  schedulingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const equilibriumDrag = v1014laborClamp(
    careEquilibrium.orbitDrag * 0.46 +
      (careEquilibrium.band === 'ebbing' || careEquilibrium.band === 'patchy' ? 10 : 3)
  );
  const equilibriumLift =
    careEquilibrium.band === 'rising' || careEquilibrium.band === 'equilibrium'
      ? careEquilibrium.equilibriumIndex * 0.2
      : careEquilibrium.equilibriumIndex * 0.1;

  const resonanceIndex = v1014laborClamp(24 + schedulingLift * 22 + equilibriumLift - equilibriumDrag);
  const band = resonanceBand(resonanceIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy scheduling resonance — deploy scheduling levers before subject convergence assembly.'
      : band === 'resonance'
        ? 'Resonance band — verify nexus-scheduling coupling before auto workforce pushes.'
        : 'Rising resonance — align with steadfast-scheduling coupling checks.';

  return {
    turn: state.turn,
    resonanceIndex,
    band,
    equilibriumDrag,
    summary: `National scheduling resonance ${band} (index ${Math.round(resonanceIndex)}); equilibrium drag ${Math.round(equilibriumDrag)}.`,
    stewardNote
  };
}
