import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessHealthcareServicesInflation,
  healthcareServicesInflationScoreAdjustment,
} from '../inflation/healthcare-services-inflation.js';
import {
  assessInsurancePremiumPassThrough,
  insurancePremiumPassThroughInflationScoreAdjustment,
} from '../inflation/insurance-premium-pass-through.js';
import type { Agent03ResearchSnapshot } from '../integration/agent03-research-bridge.js';
import type { Agent05EventsSnapshot } from '../integration/agent05-events-bridge.js';

export interface HealthcareInsuranceInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent03?: Agent03ResearchSnapshot | null;
  agent05?: Agent05EventsSnapshot | null;
}

export function HealthcareInsuranceInflationPanel(props: HealthcareInsuranceInflationPanelProps) {
  const research = props.agent03 ?? {
    turn: props.inputs.turn,
    productivityGainBand: 'moderate' as const,
    supplySideReliefActive: !props.inputs.highInflationScenario,
    innovationInflationOffsetScore: 0.35,
  };

  const events = props.agent05 ?? {
    turn: props.inputs.turn,
    inflationShockEventActive: props.inputs.highInflationScenario,
    supplyDisruptionSeverity: props.inputs.creditShockActive ? ('national' as const) : ('localized' as const),
    confidenceShockBand: props.inputs.publicStability < 45 ? ('severe' as const) : ('uneasy' as const),
  };

  const healthcare = assessHealthcareServicesInflation({
    wagePressureBand:
      events.inflationShockEventActive && events.supplyDisruptionSeverity === 'national'
        ? 'acute'
        : props.inputs.fiscalPressure === 'critical'
          ? 'high'
          : 'moderate',
    demandSurgeActive: events.inflationShockEventActive,
    workforceShortageBand: research.productivityGainBand === 'flat' ? 'severe' : 'moderate',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const insurance = assessInsurancePremiumPassThrough({
    claimsInflationBand: events.supplyDisruptionSeverity === 'national' ? 'extreme' : 'high',
    reinsuranceStress: props.inputs.fiscalPressure === 'critical',
    catastropheLoadActive: events.confidenceShockBand === 'severe',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-healthcare-insurance-inflation" data-testid="healthcare-insurance-inflation-panel">
      <h4>Healthcare, insurance & events (round 10)</h4>
      <p>
        Healthcare {healthcare.pressureBand} · index {healthcare.servicesIndex.toFixed(0)} · score adj{' '}
        {healthcareServicesInflationScoreAdjustment(healthcare.pressureBand)}
      </p>
      <p>
        Insurance {insurance.passThroughBand} · index {insurance.premiumIndex.toFixed(0)} · score adj{' '}
        {insurancePremiumPassThroughInflationScoreAdjustment(insurance.passThroughBand)}
      </p>
      <p data-testid="healthcare-insurance-care-note">{healthcare.narrative}</p>
      <p>{insurance.narrative}</p>
    </div>
  );
}
