import { v1014laborClamp } from './bands';
import type {
  NationalLaborDemographicsState,
  NationalLaborMarketVelocityIndex,
  NationalLaborSupplyElasticityBrief,
  NationalWorkforceTransitionFrictionOutlook,
  TransitionFrictionBand
} from './types';

function frictionBand(index: number): TransitionFrictionBand {
  if (index <= 35) return 'smooth';
  if (index <= 50) return 'moderate';
  if (index <= 64) return 'sticky';
  return 'bottleneck';
}

export function computeNationalWorkforceTransitionFrictionOutlook(
  state: NationalLaborDemographicsState,
  velocity: NationalLaborMarketVelocityIndex | null | undefined,
  elasticity: NationalLaborSupplyElasticityBrief | null | undefined
): NationalWorkforceTransitionFrictionOutlook {
  if (!state.enabled || !velocity || !elasticity) {
    return {
      turn: state.turn,
      frictionIndex: 50,
      band: 'moderate',
      automationDrag: 0,
      summary: 'Transition friction idle — velocity or elasticity unavailable.',
      stewardNote: 'Compute velocity and supply elasticity before transition friction guidance.'
    };
  }

  const automationSamples = Object.values(state.regions).map(r => r.automationPressureIndex ?? 50);
  const automationDrag = v1014laborClamp(
    automationSamples.reduce((a, b) => a + b, 0) / Math.max(1, automationSamples.length)
  );

  const velocityDrag = velocity.nationalBand === 'volatile' ? 16 : velocity.nationalVelocityIndex * 0.22;
  const elasticityDrag =
    elasticity.band === 'rigid' ? 18 : elasticity.band === 'inelastic' ? 12 : elasticity.band === 'moderate' ? 6 : 0;
  const mobilityEase =
    state.talentMobilityOutlook?.band === 'hyper_mobile' ? 8 : state.talentMobilityOutlook?.band === 'fluid' ? 4 : 0;

  const frictionIndex = v1014laborClamp(
    22 + velocityDrag + elasticityDrag + automationDrag * 0.35 - mobilityEase
  );
  const band = frictionBand(frictionIndex);

  const stewardNote =
    band === 'bottleneck' || band === 'sticky'
      ? 'Sticky transition friction — sequence upskilling and retention before automation expansions.'
      : band === 'smooth'
        ? 'Smooth transitions — maintain elasticity while scaling corridor moves.'
        : 'Moderate friction — watch volatile velocity regions.';

  return {
    turn: state.turn,
    frictionIndex,
    band,
    automationDrag,
    summary: `Workforce transition friction ${band} (index ${Math.round(frictionIndex)}); automation drag ${Math.round(automationDrag)}.`,
    stewardNote
  };
}
