import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessRecreationLeisureInflation,
  recreationLeisureInflationScoreAdjustment,
} from '../inflation/recreation-leisure-inflation.js';
import {
  assessProfessionalServicesFeeInflation,
  professionalServicesFeeInflationScoreAdjustment,
} from '../inflation/professional-services-fee-inflation.js';
import type { Agent17CommandSnapshot } from '../integration/agent17-command-bridge.js';
import type { Agent18TeamSnapshot } from '../integration/agent18-team-bridge.js';

export interface RecreationProfessionalInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent17?: Agent17CommandSnapshot | null;
  agent18?: Agent18TeamSnapshot | null;
}

export function RecreationProfessionalInflationPanel(props: RecreationProfessionalInflationPanelProps) {
  const command = props.agent17 ?? {
    turn: props.inputs.turn,
    macroAlertLevel: props.inputs.highInflationScenario ? ('red' as const) : ('amber' as const),
    inflationFusionScore: 0.55,
    coordinatedTighteningSuggested: props.inputs.fiscalPressure === 'critical',
  };

  const team = props.agent18 ?? {
    turn: props.inputs.turn,
    consensusInflationOutlook: props.inputs.highInflationScenario ? ('reacceleration' as const) : ('stable' as const),
    briefingUrgencyBand: props.inputs.publicStability < 45 ? ('critical' as const) : ('elevated' as const),
    crossDomainStressScore: 0.5,
  };

  const leisure = assessRecreationLeisureInflation({
    tourismDemandBand: command.macroAlertLevel === 'red' ? 'surge' : 'strong',
    laborCostPassThrough: team.briefingUrgencyBand === 'critical' ? 'high' : 'medium',
    discretionarySpendPressure: props.inputs.householdInflationScenarioActive,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const professional = assessProfessionalServicesFeeInflation({
    billingRatePressure: team.consensusInflationOutlook === 'upside_risk' ? 'extreme' : 'elevated',
    complianceCostStack: command.coordinatedTighteningSuggested,
    corporateDemandBand: props.inputs.highInflationScenario ? 'strong' : 'steady',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-recreation-professional-inflation" data-testid="recreation-professional-inflation-panel">
      <h4>Recreation, professional fees & command (round 12)</h4>
      <p>
        Leisure {leisure.pressureBand} · index {leisure.leisureIndex.toFixed(0)} · score adj{' '}
        {recreationLeisureInflationScoreAdjustment(leisure.pressureBand)}
      </p>
      <p>
        Professional {professional.feeBand} · index {professional.feeIndex.toFixed(0)} · score adj{' '}
        {professionalServicesFeeInflationScoreAdjustment(professional.feeBand)}
      </p>
      <p data-testid="recreation-prof-leisure-note">{leisure.narrative}</p>
      <p>{professional.narrative}</p>
    </div>
  );
}
