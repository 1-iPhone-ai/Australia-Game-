import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { V1014_FINSTAB_POLICY_TRANSMISSION_CHANNELS } from '../definitions/constants.js';

export interface TransmissionChannelHit {
  id: string;
  sourceDomain: string;
  targetDomain: string;
  weight: number;
  explanation: string;
  active: boolean;
  activationReason: string;
}

export function evaluatePolicyTransmissionChannels(
  inputs: MacroFinancialSystemInputs,
): TransmissionChannelHit[] {
  return V1014_FINSTAB_POLICY_TRANSMISSION_CHANNELS.map((ch) => {
    let active = false;
    let activationReason = 'inactive';
    switch (ch.id) {
      case 'fiscal_strain_tightens_credit':
        active = inputs.fiscalPressure === 'strained' || inputs.fiscalPressure === 'critical';
        activationReason = active ? `fiscalPressure=${inputs.fiscalPressure}` : activationReason;
        break;
      case 'debt_service_crowds_lending':
        active = inputs.sovereignDebtPressure === 'high' || inputs.sovereignDebtPressure === 'critical';
        activationReason = active ? `debt=${inputs.sovereignDebtPressure}` : activationReason;
        break;
      case 'capital_flexibility_eases_investment':
        active = inputs.capitalFlexibility === 'high' || inputs.capitalFlexibility === 'very_high';
        activationReason = active ? 'strong capital flexibility' : activationReason;
        break;
      case 'capital_squeeze_freezes_projects':
        active = inputs.capitalFlexibility === 'very_low' || inputs.capitalFlexibility === 'critical';
        activationReason = active ? 'capital squeeze' : activationReason;
        break;
      case 'household_strain_feeds_inflation':
        active =
          inputs.householdAffordability === 'strained' || inputs.householdAffordability === 'severe_pressure';
        activationReason = active ? `affordability=${inputs.householdAffordability}` : activationReason;
        break;
      case 'scenario_inflation_anchor_break':
        active = inputs.highInflationScenario;
        activationReason = active ? 'high inflation scenario' : activationReason;
        break;
      case 'liquidity_shock_stability':
        active = inputs.systemicLiquidityBand === 'strained' || inputs.systemicLiquidityBand === 'critical';
        activationReason = active ? `liquidity=${inputs.systemicLiquidityBand}` : activationReason;
        break;
      case 'public_stability_buffer':
        active = inputs.publicStability >= 55;
        activationReason = active ? `publicStability=${inputs.publicStability}` : activationReason;
        break;
      case 'actor_leverage_warning':
        active = inputs.actorCreditStressIndex > 0.55;
        activationReason = active ? `stress=${inputs.actorCreditStressIndex}` : activationReason;
        break;
      case 'crisis_stack_amplification':
        active = inputs.activeCrises >= 2;
        activationReason = active ? `crises=${inputs.activeCrises}` : activationReason;
        break;
      default:
        break;
    }
    return { ...ch, active, activationReason };
  });
}

export function sumActiveTransmissionWeight(hits: TransmissionChannelHit[], targetDomain: string): number {
  return hits
    .filter((h) => h.active && h.targetDomain === targetDomain)
    .reduce((s, h) => s + h.weight, 0);
}
