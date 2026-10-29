import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessChildcareServicesInflation,
  childcareServicesInflationScoreAdjustment,
} from '../inflation/childcare-services-inflation.js';
import {
  assessGovernmentChargesInflation,
  governmentChargesInflationScoreAdjustment,
} from '../inflation/government-charges-inflation.js';
import type { Agent02TurnsSnapshot } from '../integration/agent02-turns-bridge.js';
import type { Agent20AutomationSnapshot } from '../integration/agent20-automation-bridge.js';

export interface ChildcareGovernmentInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent02?: Agent02TurnsSnapshot | null;
  agent20?: Agent20AutomationSnapshot | null;
}

export function ChildcareGovernmentInflationPanel(props: ChildcareGovernmentInflationPanelProps) {
  const turns = props.agent02 ?? {
    turn: props.inputs.turn,
    calendarSeasonBand: props.inputs.highInflationScenario ? ('peak_demand' as const) : ('normal' as const),
    policyReviewWindowOpen: props.inputs.fiscalPressure === 'critical',
    multiTurnInflationCarryover: 0.12,
  };

  const automation = props.agent20 ?? {
    turn: props.inputs.turn,
    macroAutopilotInflationBias: props.inputs.highInflationScenario ? ('inflate' as const) : ('neutral' as const),
    unattendedShockDriftActive: props.inputs.creditShockActive,
    automationConfidenceScore: 0.5,
  };

  const childcare = assessChildcareServicesInflation({
    capacityShortageBand: turns.calendarSeasonBand === 'peak_demand' ? 'severe' : 'moderate',
    wageAwardPassThrough: automation.macroAutopilotInflationBias === 'inflate' ? 'strong' : 'normal',
    subsidyIndexationLag: props.inputs.fiscalPressure === 'critical',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const govCharges = assessGovernmentChargesInflation({
    feeIndexationBand: props.inputs.highInflationScenario ? 'above_cpi' : 'at_cpi',
    newLevyStackActive: turns.policyReviewWindowOpen,
    localGovernmentPressure: automation.unattendedShockDriftActive ? 'high' : 'medium',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-childcare-government-inflation" data-testid="childcare-government-inflation-panel">
      <h4>Childcare, government charges & time (round 13)</h4>
      <p>
        Childcare {childcare.pressureBand} · index {childcare.childcareIndex.toFixed(0)} · score adj{' '}
        {childcareServicesInflationScoreAdjustment(childcare.pressureBand)}
      </p>
      <p>
        Gov charges {govCharges.pressureBand} · index {govCharges.chargesIndex.toFixed(0)} · score adj{' '}
        {governmentChargesInflationScoreAdjustment(govCharges.pressureBand)}
      </p>
      <p data-testid="childcare-gov-care-note">{childcare.narrative}</p>
      <p>{govCharges.narrative}</p>
    </div>
  );
}
