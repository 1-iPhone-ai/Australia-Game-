import { v1014laborClamp } from './bands';
import { onboardingEaseForRegion } from './catalog/workforce-onboarding-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type MigrationParticipationBufferBand,
  type NationalLaborDemographicsState,
  type NationalMigrationShockParticipationBufferOutlook,
  type NationalParticipationPressureBrief,
  type NationalRegionalLaborAbsorptionBrief
} from './types';

function bufferBand(index: number): MigrationParticipationBufferBand {
  if (index <= 34) return 'depleted';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'adequate';
  return 'cushioned';
}

export function computeNationalMigrationShockParticipationBufferOutlook(
  state: NationalLaborDemographicsState,
  participation: NationalParticipationPressureBrief | null | undefined,
  absorption: NationalRegionalLaborAbsorptionBrief | null | undefined
): NationalMigrationShockParticipationBufferOutlook {
  if (!state.enabled || !participation || !absorption) {
    return {
      turn: state.turn,
      bufferIndex: 50,
      band: 'thin',
      activeShockDrag: 0,
      summary: 'Migration-shock participation buffer idle — participation or absorption unavailable.',
      stewardNote: 'Compute participation and absorption before migration buffer guidance.'
    };
  }

  const shockCount = state.activeMigrationShocks?.length ?? 0;
  const activeShockDrag = v1014laborClamp(shockCount * 7 + (shockCount >= 2 ? 6 : 0));

  let onboardingEase = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    onboardingEase += onboardingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  onboardingEase /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const absorptionEase =
    absorption.band === 'headroom'
      ? 14
      : absorption.band === 'absorbing'
        ? 8
        : absorption.band === 'constrained'
          ? 2
          : 0;
  const participationLift = participation.participationIndex * 0.26;

  const bufferIndex = v1014laborClamp(
    30 + participationLift + absorptionEase + onboardingEase * 18 - activeShockDrag
  );
  const band = bufferBand(bufferIndex);

  const stewardNote =
    band === 'depleted' || band === 'thin'
      ? 'Thin migration-shock buffer — deploy onboarding levers before stacking corridor shocks.'
      : band === 'cushioned'
        ? 'Cushioned buffer — avoid hyper-mobility that drains anchor participation.'
        : 'Adequate buffer — monitor absorption in inbound shock regions.';

  return {
    turn: state.turn,
    bufferIndex,
    band,
    activeShockDrag,
    summary: `Migration-shock participation buffer ${band} (index ${Math.round(bufferIndex)}); shock drag ${Math.round(activeShockDrag)}.`,
    stewardNote
  };
}
