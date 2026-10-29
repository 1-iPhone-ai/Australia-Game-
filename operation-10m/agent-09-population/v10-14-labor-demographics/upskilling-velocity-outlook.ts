import { v1014laborClamp } from './bands';
import { upskillingUpliftForRegion } from './catalog/workforce-upskilling-programs';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSkillsTightnessCoherenceOutlook,
  type NationalUpskillingVelocityOutlook,
  type UpskillingVelocityBand
} from './types';

function velocityBand(index: number): UpskillingVelocityBand {
  if (index <= 34) return 'stalled';
  if (index <= 48) return 'uneven';
  if (index <= 62) return 'active';
  return 'accelerating';
}

export function computeNationalUpskillingVelocityOutlook(
  state: NationalLaborDemographicsState,
  skillsCoherence: NationalSkillsTightnessCoherenceOutlook | null | undefined
): NationalUpskillingVelocityOutlook {
  if (!state.enabled || !skillsCoherence) {
    return {
      turn: state.turn,
      velocityIndex: 50,
      band: 'uneven',
      mismatchDrag: 0,
      summary: 'Upskilling velocity idle — skills tightness coherence unavailable.',
      stewardNote: 'Compute skills tightness coherence before upskilling velocity guidance.'
    };
  }

  let upskillingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    upskillingLift += upskillingUpliftForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  upskillingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const mismatchDrag = v1014laborClamp(
    skillsCoherence.mismatchDrag * 0.55 +
      (skillsCoherence.band === 'incoherent' || skillsCoherence.band === 'strained' ? 10 : 3)
  );
  const coherenceLift =
    skillsCoherence.band === 'coherent' || skillsCoherence.band === 'aligned'
      ? skillsCoherence.coherenceIndex * 0.24
      : skillsCoherence.coherenceIndex * 0.12;

  const velocityIndex = v1014laborClamp(26 + upskillingLift * 24 + coherenceLift - mismatchDrag);
  const band = velocityBand(velocityIndex);

  const stewardNote =
    band === 'stalled' || band === 'uneven'
      ? 'Uneven upskilling velocity — deploy program levers before corridor skill pulls.'
      : band === 'accelerating'
        ? 'Accelerating upskilling band — avoid hyper-mobility that drains retention pools.'
        : 'Active upskilling — align velocity with credential mobility checks.';

  return {
    turn: state.turn,
    velocityIndex,
    band,
    mismatchDrag,
    summary: `National upskilling velocity ${band} (index ${Math.round(velocityIndex)}); mismatch drag ${Math.round(mismatchDrag)}.`,
    stewardNote
  };
}
