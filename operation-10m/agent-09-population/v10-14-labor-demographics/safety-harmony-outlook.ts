import { v1014laborClamp } from './bands';
import { safetyEaseForRegion } from './catalog/workforce-safety-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSafetyHarmonyOutlook,
  type NationalSchedulingResonanceOutlook,
  type SafetyHarmonyBand
} from './types';

function harmonyBand(index: number): SafetyHarmonyBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'harmony';
}

export function computeNationalSafetyHarmonyOutlook(
  state: NationalLaborDemographicsState,
  schedulingResonance: NationalSchedulingResonanceOutlook | null | undefined
): NationalSafetyHarmonyOutlook {
  if (!state.enabled || !schedulingResonance) {
    return {
      turn: state.turn,
      harmonyIndex: 50,
      band: 'patchy',
      resonanceDrag: 0,
      summary: 'Safety harmony idle — scheduling resonance unavailable.',
      stewardNote: 'Compute scheduling resonance before safety harmony guidance.'
    };
  }

  let safetyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    safetyLift += safetyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  safetyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const resonanceDrag = v1014laborClamp(
    schedulingResonance.equilibriumDrag * 0.46 +
      (schedulingResonance.band === 'ebbing' || schedulingResonance.band === 'patchy' ? 10 : 3)
  );
  const resonanceLift =
    schedulingResonance.band === 'rising' || schedulingResonance.band === 'resonance'
      ? schedulingResonance.resonanceIndex * 0.2
      : schedulingResonance.resonanceIndex * 0.1;

  const harmonyIndex = v1014laborClamp(24 + safetyLift * 22 + resonanceLift - resonanceDrag);
  const band = harmonyBand(harmonyIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy safety harmony — deploy safety levers before subject unification assembly.'
      : band === 'harmony'
        ? 'Harmony band — verify convergence-safety coupling before auto workforce pushes.'
        : 'Rising harmony — align with safety-cohesion outlook checks.';

  return {
    turn: state.turn,
    harmonyIndex,
    band,
    resonanceDrag,
    summary: `National safety harmony ${band} (index ${Math.round(harmonyIndex)}); resonance drag ${Math.round(resonanceDrag)}.`,
    stewardNote
  };
}
