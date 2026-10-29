import { v1014laborClamp } from './bands';
import { coordinationEaseForRegion } from './catalog/workforce-coordination-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type IntegratedLaborMarketBrief,
  type LaborMarketStabilityBand,
  type NationalAutomationParticipationResilienceOutlook,
  type NationalLaborDemographicsState,
  type NationalLaborMarketStabilityOutlook,
  type NationalLaborRebalancingStressBrief
} from './types';

function stabilityBand(index: number): LaborMarketStabilityBand {
  if (index <= 34) return 'volatile';
  if (index <= 48) return 'fragile';
  if (index <= 62) return 'steady';
  return 'anchored';
}

export function computeNationalLaborMarketStabilityOutlook(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  rebalancingStress: NationalLaborRebalancingStressBrief | null | undefined,
  automationResilience: NationalAutomationParticipationResilienceOutlook | null | undefined
): NationalLaborMarketStabilityOutlook {
  if (!state.enabled || !brief || !rebalancingStress || !automationResilience) {
    return {
      turn: state.turn,
      stabilityIndex: 50,
      band: 'fragile',
      stressDrag: 0,
      summary: 'Labor market stability idle — brief, stress, or automation resilience unavailable.',
      stewardNote: 'Compute integrated brief, rebalancing stress, and automation resilience before stability guidance.'
    };
  }

  let coordinationLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    coordinationLift += coordinationEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  coordinationLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const pressureDrag =
    brief.pressureBand === 'critical' ? 18 : brief.pressureBand === 'elevated' ? 12 : brief.compositePressureIndex * 0.2;
  const stressDrag =
    rebalancingStress.band === 'critical'
      ? 16
      : rebalancingStress.band === 'acute'
        ? 11
        : rebalancingStress.stressIndex * 0.12;
  const resilienceLift =
    automationResilience.band === 'adaptive' || automationResilience.band === 'stable'
      ? automationResilience.resilienceIndex * 0.28
      : automationResilience.resilienceIndex * 0.15;

  const stabilityIndex = v1014laborClamp(
    32 + resilienceLift + coordinationLift * 22 - pressureDrag - stressDrag
  );
  const band = stabilityBand(stabilityIndex);

  const stewardNote =
    band === 'volatile' || band === 'fragile'
      ? 'Fragile labor stability — deploy coordination levers before stacked corridor commits.'
      : band === 'anchored'
        ? 'Anchored stability — avoid hyper-mobility that erodes shock buffers.'
        : 'Steady stability — monitor rebalancing stress in tight absorption hubs.';

  return {
    turn: state.turn,
    stabilityIndex,
    band,
    stressDrag,
    summary: `Labor market stability ${band} (index ${Math.round(stabilityIndex)}); stress drag ${Math.round(stressDrag)}.`,
    stewardNote
  };
}
