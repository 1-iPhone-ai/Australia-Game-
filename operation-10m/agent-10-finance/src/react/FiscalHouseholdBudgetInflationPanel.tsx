import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessFiscalAppropriationInflationPressureLatch,
  fiscalAppropriationInflationPressureLatchScoreAdjustment,
} from '../inflation/fiscal-appropriation-inflation-pressure-latch.js';
import {
  assessHouseholdBudgetInflationStressCascade,
  householdBudgetInflationStressCascadeScoreAdjustment,
} from '../inflation/household-budget-inflation-stress-cascade.js';
import type { Agent07FiscalSnapshot } from '../integration/agent07-fiscal-bridge.js';
import type { Agent09HouseholdSnapshot } from '../integration/agent09-household-bridge.js';

export interface FiscalHouseholdBudgetInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent07?: Agent07FiscalSnapshot | null;
  agent09?: Agent09HouseholdSnapshot | null;
}

export function FiscalHouseholdBudgetInflationPanel(props: FiscalHouseholdBudgetInflationPanelProps) {
  const fiscal = props.agent07 ?? {
    turn: props.inputs.turn,
    consolidatedDeficitBand: props.inputs.fiscalPressure === 'critical' ? ('large_deficit' as const) : ('moderate_deficit' as const),
    revenueMomentum: props.inputs.creditShockActive ? ('weak' as const) : ('steady' as const),
    debtServicePressure: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('elevated' as const),
    wave38AppropriationInflationLatch: props.inputs.highInflationScenario,
    fiscalPressureEscalationBand: props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const household = props.agent09 ?? {
    turn: props.inputs.turn,
    laborParticipationBand: 'steady' as const,
    wageGrowthBand: props.inputs.householdInflationScenarioActive ? ('surge' as const) : ('elevated' as const),
    costOfLivingStress: props.inputs.publicStability < 42 ? ('extreme' as const) : ('high' as const),
    wave38BudgetInflationLatch: props.inputs.householdInflationScenarioActive,
    householdStressCascadeBand: props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('building' as const),
  };

  const appropriation = assessFiscalAppropriationInflationPressureLatch({
    consolidatedDeficitBand: fiscal.consolidatedDeficitBand,
    debtServicePressure: fiscal.debtServicePressure,
    wave38AppropriationInflationLatch: fiscal.wave38AppropriationInflationLatch === true,
    fiscalPressureEscalationBand: fiscal.fiscalPressureEscalationBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const budget = assessHouseholdBudgetInflationStressCascade({
    wageGrowthBand: household.wageGrowthBand,
    costOfLivingStress: household.costOfLivingStress,
    wave38BudgetInflationLatch: household.wave38BudgetInflationLatch === true,
    householdStressCascadeBand: household.householdStressCascadeBand ?? 'contained',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-fiscal-household-budget-inflation" data-testid="fiscal-household-budget-inflation-panel">
      <h4>Appropriation latch & budget stress (round 38)</h4>
      <p>
        Fiscal {appropriation.latchBand} · index {appropriation.pressureIndex.toFixed(0)} · score adj{' '}
        {fiscalAppropriationInflationPressureLatchScoreAdjustment(appropriation.latchBand)}
      </p>
      <p>
        Household {budget.cascadeBand} · index {budget.stressIndex.toFixed(0)} · score adj{' '}
        {householdBudgetInflationStressCascadeScoreAdjustment(budget.cascadeBand)}
      </p>
      <p data-testid="fiscal-household-budget-note">{appropriation.narrative}</p>
      <p>{budget.narrative}</p>
    </div>
  );
}
