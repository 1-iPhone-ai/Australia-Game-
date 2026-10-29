import { v1014laborClamp } from './bands';
import { advocacyEaseForRegion } from './catalog/workforce-advocacy-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalLaborMarketVelocityIndex,
  type NationalParticipationPressureBrief,
  type NationalParticipationVelocityCouplingBrief,
  type ParticipationVelocityCouplingBand
} from './types';

function couplingBand(index: number): ParticipationVelocityCouplingBand {
  if (index <= 34) return 'divergent';
  if (index <= 48) return 'lagging';
  if (index <= 62) return 'synced';
  return 'momentum';
}

export function computeNationalParticipationVelocityCouplingBrief(
  state: NationalLaborDemographicsState,
  participation: NationalParticipationPressureBrief | null | undefined,
  velocity: NationalLaborMarketVelocityIndex | null | undefined
): NationalParticipationVelocityCouplingBrief {
  if (!state.enabled || !participation || !velocity) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'lagging',
      velocityDrag: 0,
      summary: 'Participation-velocity coupling idle — participation or velocity unavailable.',
      stewardNote: 'Compute participation and velocity before coupling guidance.'
    };
  }

  let advocacyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    advocacyLift += advocacyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  advocacyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const velocityDrag =
    velocity.nationalBand === 'volatile'
      ? 16
      : velocity.nationalBand === 'sluggish'
        ? 6
        : velocity.nationalVelocityIndex * 0.08;
  const participationLift = participation.participationIndex * 0.34;
  const velocityLift =
    velocity.nationalBand === 'active' ? velocity.nationalVelocityIndex * 0.22 : velocity.nationalVelocityIndex * 0.12;
  const bandDrag =
    participation.band === 'shrinking' ? 10 : participation.band === 'constrained' ? 6 : 0;

  const couplingIndex = v1014laborClamp(
    30 + participationLift + velocityLift + advocacyLift * 18 - velocityDrag - bandDrag
  );
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'divergent' || band === 'lagging'
      ? 'Lagging participation-velocity coupling — deploy advocacy levers before volatile corridor commits.'
      : band === 'momentum'
        ? 'Momentum coupling — avoid hyper-mobility that drains shock buffers.'
        : 'Synced coupling — monitor velocity hotspots against equity gaps.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    velocityDrag,
    summary: `Participation-velocity coupling ${band} (index ${Math.round(couplingIndex)}); velocity drag ${Math.round(velocityDrag)}.`,
    stewardNote
  };
}
