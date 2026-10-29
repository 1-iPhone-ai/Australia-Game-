import { v1014laborClamp } from './bands';
import type {
  IntegratedLaborMarketBrief,
  NationalLaborDemographicsState,
  NationalLaborSupplyElasticityBrief,
  NationalParticipationPressureBrief,
  SupplyElasticityBand
} from './types';

function elasticityBand(score: number): SupplyElasticityBand {
  if (score >= 68) return 'responsive';
  if (score >= 52) return 'moderate';
  if (score >= 38) return 'inelastic';
  return 'rigid';
}

export function computeNationalLaborSupplyElasticityBrief(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  participation: NationalParticipationPressureBrief | null | undefined
): NationalLaborSupplyElasticityBrief {
  if (!state.enabled || !brief || !participation) {
    return {
      turn: state.turn,
      elasticityIndex: 50,
      band: 'moderate',
      wageSensitivity: 0,
      participationSensitivity: 0,
      summary: 'Supply elasticity idle — labor layer off.',
      stewardNote: 'Enable labor demographics before elasticity guidance.'
    };
  }

  const wageLift =
    state.nationalWagePressure === 'surging' || state.nationalWagePressure === 'elevated' ? 14 : 6;
  const participationLift = participation.participationIndex * 0.35;
  const strainDrag = brief.compositePressureIndex * 0.42;
  const automationDrag = (state.regions.NSW?.automationPressureIndex ?? 50) * 0.18;
  const capacityEase =
    state.workforceCapacityBridge?.nationalBand === 'surplus'
      ? 10
      : state.workforceCapacityBridge?.nationalBand === 'critical_gap'
        ? -12
        : 0;

  const elasticityIndex = v1014laborClamp(
    48 + wageLift + participationLift + capacityEase - strainDrag - automationDrag
  );
  const band = elasticityBand(elasticityIndex);
  const wageSensitivity = v1014laborClamp(state.wagePressureScore * 0.55);
  const participationSensitivity = v1014laborClamp(participation.participationIndex * 0.65);

  const stewardNote =
    band === 'rigid' || band === 'inelastic'
      ? 'Inelastic labor supply — avoid aggressive automation until participation and mismatch ease.'
      : band === 'responsive'
        ? 'Responsive supply — monitor wage surges so expansion does not overshoot capacity.'
        : 'Moderate elasticity — maintain corridor and upskilling balance.';

  return {
    turn: state.turn,
    elasticityIndex,
    band,
    wageSensitivity,
    participationSensitivity,
    summary: `Labor supply elasticity ${band} (index ${Math.round(elasticityIndex)}); wage sens ${Math.round(wageSensitivity)}, participation sens ${Math.round(participationSensitivity)}.`,
    stewardNote
  };
}
