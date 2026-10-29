import { v1014laborClamp } from './bands';
import { retentionPullForRegion } from './catalog/workforce-retention-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type IntegrationRetentionCouplingBand,
  type NationalIntegrationRetentionCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceIntegrationIndex
} from './types';

function couplingBand(index: number): IntegrationRetentionCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-37 / wave-37 integration-retention coupling — integration × retention (O10-205). */
export function computeNationalIntegrationRetentionCouplingBrief(
  state: NationalLaborDemographicsState,
  integration: NationalWorkforceIntegrationIndex | null | undefined
): NationalIntegrationRetentionCouplingBrief {
  if (!state.enabled || !integration) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      integrationDrag: 0,
      summary: 'Integration-retention coupling idle — workforce integration unavailable.',
      stewardNote: 'Compute workforce integration before retention coupling guidance.'
    };
  }

  let retentionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    retentionLift += retentionPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  retentionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const integrationDrag = v1014laborClamp(
    integration.integrationDrag * 0.48 + (integration.band === 'fragile' || integration.band === 'thin' ? 11 : 3)
  );
  const integrationLift =
    integration.band === 'elevated' || integration.band === 'integration'
      ? integration.integrationIndex * 0.24
      : integration.integrationIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + retentionLift * 21 + integrationLift - integrationDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained integration-retention link — deploy retention levers before wave-37 retention commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard retention cohesion spikes that drain integration buffers.'
        : 'Amplified coupling — pair retention packs with subject retention readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    integrationDrag,
    summary: `Integration-retention coupling ${band} (index ${Math.round(couplingIndex)}); integration drag ${Math.round(integrationDrag)}.`,
    stewardNote
  };
}
