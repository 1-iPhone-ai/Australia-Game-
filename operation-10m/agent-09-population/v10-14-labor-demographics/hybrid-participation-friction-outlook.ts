import { v1014laborClamp } from './bands';
import { careReliefForRegion } from './catalog/workforce-care-levers';
import { V1014_LABOR_CORE_REGIONS, type HybridParticipationFrictionBand, type NationalHybridParticipationFrictionOutlook, type NationalLaborDemographicsState, type NationalTalentMobilityOutlook, type NationalWorkforceTransitionFrictionOutlook } from './types';

function hybridFrictionBand(index: number): HybridParticipationFrictionBand {
  if (index <= 34) return 'low';
  if (index <= 50) return 'moderate';
  if (index <= 64) return 'elevated';
  return 'binding';
}

export function computeNationalHybridParticipationFrictionOutlook(
  state: NationalLaborDemographicsState,
  transition: NationalWorkforceTransitionFrictionOutlook | null | undefined,
  mobility: NationalTalentMobilityOutlook | null | undefined
): NationalHybridParticipationFrictionOutlook {
  if (!state.enabled || !transition || !mobility) {
    return {
      turn: state.turn,
      frictionIndex: 50,
      band: 'moderate',
      careReliefLift: 0,
      summary: 'Hybrid participation friction idle — transition or mobility unavailable.',
      stewardNote: 'Compute transition friction and talent mobility before hybrid guidance.'
    };
  }

  let careReliefLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    careReliefLift += careReliefForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  careReliefLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const transitionDrag =
    transition.band === 'bottleneck' ? 18 : transition.band === 'sticky' ? 12 : transition.frictionIndex * 0.22;
  const mobilityDrag = mobility.band === 'hyper_mobile' ? 10 : mobility.band === 'fluid' ? 6 : 0;
  const householdDrag =
    state.participationPressureBrief?.band === 'constrained' ||
    state.participationPressureBrief?.band === 'shrinking'
      ? 8
      : 0;

  const frictionIndex = v1014laborClamp(
    24 + transitionDrag + mobilityDrag + householdDrag - careReliefLift * 20
  );
  const band = hybridFrictionBand(frictionIndex);

  const stewardNote =
    band === 'binding' || band === 'elevated'
      ? 'Elevated hybrid friction — deploy care levers before remote-work automation expansions.'
      : band === 'low'
        ? 'Low hybrid friction — maintain care relief while scaling corridor mobility.'
        : 'Moderate hybrid friction — watch volatile mobility regions.';

  return {
    turn: state.turn,
    frictionIndex,
    band,
    careReliefLift,
    summary: `Hybrid participation friction ${band} (index ${Math.round(frictionIndex)}); care relief ${Math.round(careReliefLift * 100)}%.`,
    stewardNote
  };
}
