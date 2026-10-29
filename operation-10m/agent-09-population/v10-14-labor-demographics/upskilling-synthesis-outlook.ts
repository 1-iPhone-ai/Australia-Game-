import { v1014laborClamp } from './bands';
import { upskillingUpliftForRegion } from './catalog/workforce-upskilling-programs';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSafetyHarmonyOutlook,
  type NationalUpskillingSynthesisOutlook,
  type UpskillingSynthesisBand
} from './types';

function synthesisBand(index: number): UpskillingSynthesisBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'synthesis';
}

export function computeNationalUpskillingSynthesisOutlook(
  state: NationalLaborDemographicsState,
  safetyHarmony: NationalSafetyHarmonyOutlook | null | undefined
): NationalUpskillingSynthesisOutlook {
  if (!state.enabled || !safetyHarmony) {
    return {
      turn: state.turn,
      synthesisIndex: 50,
      band: 'patchy',
      harmonyDrag: 0,
      summary: 'Upskilling synthesis idle — safety harmony unavailable.',
      stewardNote: 'Compute safety harmony before upskilling synthesis guidance.'
    };
  }

  let upskillingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    upskillingLift += upskillingUpliftForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  upskillingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const harmonyDrag = v1014laborClamp(
    safetyHarmony.resonanceDrag * 0.46 +
      (safetyHarmony.band === 'ebbing' || safetyHarmony.band === 'patchy' ? 10 : 3)
  );
  const harmonyLift =
    safetyHarmony.band === 'rising' || safetyHarmony.band === 'harmony'
      ? safetyHarmony.harmonyIndex * 0.2
      : safetyHarmony.harmonyIndex * 0.1;

  const synthesisIndex = v1014laborClamp(24 + upskillingLift * 22 + harmonyLift - harmonyDrag);
  const band = synthesisBand(synthesisIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy upskilling synthesis — deploy upskilling programs before subject synthesis assembly.'
      : band === 'synthesis'
        ? 'Synthesis band — verify unification-upskilling coupling before auto workforce pushes.'
        : 'Rising synthesis — align with upskilling velocity outlook checks.';

  return {
    turn: state.turn,
    synthesisIndex,
    band,
    harmonyDrag,
    summary: `National upskilling synthesis ${band} (index ${Math.round(synthesisIndex)}); harmony drag ${Math.round(harmonyDrag)}.`,
    stewardNote
  };
}
