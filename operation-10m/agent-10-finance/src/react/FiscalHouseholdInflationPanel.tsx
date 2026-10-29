import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessFiscalIndexationInflationAnchorBreach,
  fiscalIndexationInflationAnchorBreachScoreAdjustment,
} from '../inflation/fiscal-indexation-inflation-anchor-breach.js';
import {
  assessHouseholdWageInflationDeanchoring,
  householdWageInflationDeanchoringScoreAdjustment,
} from '../inflation/household-wage-inflation-deanchoring.js';
import type { Agent07FiscalSnapshot } from '../integration/agent07-fiscal-bridge.js';
import type { Agent09HouseholdSnapshot } from '../integration/agent09-household-bridge.js';

export interface FiscalHouseholdInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent07?: Agent07FiscalSnapshot | null;
  agent09?: Agent09HouseholdSnapshot | null;
}

export function FiscalHouseholdInflationPanel(props: FiscalHouseholdInflationPanelProps) {
  const fiscal = props.agent07 ?? {
    turn: props.inputs.turn,
    consolidatedDeficitBand: props.inputs.fiscalPressure === 'critical' ? ('large_deficit' as const) : ('moderate_deficit' as const),
    revenueMomentum: 'weak' as const,
    debtServicePressure: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('elevated' as const),
    fiscalAnchorBreached: props.inputs.highInflationScenario,
    indexedChargesInflationPassThrough: props.inputs.creditShockActive,
    debtIndexationInflationLatch: props.inputs.householdInflationScenarioActive,
    fiscalPassThroughCascadeBand: props.inputs.systemicLiquidityBand === 'critical' ? ('runaway' as const) : ('building' as const),
  };

  const household = props.agent09 ?? {
    turn: props.inputs.turn,
    laborParticipationBand: 'steady' as const,
    wageGrowthBand: props.inputs.highInflationScenario ? ('surge' as const) : ('elevated' as const),
    costOfLivingStress: props.inputs.publicStability < 42 ? ('extreme' as const) : ('high' as const),
    householdExpectationsDeanchoring: props.inputs.householdInflationScenarioActive,
    wagePriceSpiralLatch: props.inputs.creditShockActive,
    householdDeanchoringBand: props.inputs.fiscalPressure === 'critical' ? ('unmoored' as const) : ('drifting' as const),
  };

  const breach = assessFiscalIndexationInflationAnchorBreach({
    consolidatedDeficitBand: fiscal.consolidatedDeficitBand,
    debtServicePressure: fiscal.debtServicePressure,
    fiscalAnchorBreached: fiscal.fiscalAnchorBreached === true,
    debtIndexationInflationLatch: fiscal.debtIndexationInflationLatch === true,
    fiscalPassThroughCascadeBand: fiscal.fiscalPassThroughCascadeBand ?? 'muted',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const deanchoring = assessHouseholdWageInflationDeanchoring({
    wageGrowthBand: household.wageGrowthBand,
    costOfLivingStress: household.costOfLivingStress,
    householdExpectationsDeanchoring: household.householdExpectationsDeanchoring === true,
    wagePriceSpiralLatch: household.wagePriceSpiralLatch === true,
    householdDeanchoringBand: household.householdDeanchoringBand ?? 'anchored',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-fiscal-household-inflation" data-testid="fiscal-household-inflation-panel">
      <h4>Fiscal indexation & household de-anchoring (round 30)</h4>
      <p>
        Fiscal {breach.breachBand} · index {breach.fiscalIndex.toFixed(0)} · score adj{' '}
        {fiscalIndexationInflationAnchorBreachScoreAdjustment(breach.breachBand)}
      </p>
      <p>
        Household {deanchoring.deanchoringBand} · index {deanchoring.householdIndex.toFixed(0)} · score adj{' '}
        {householdWageInflationDeanchoringScoreAdjustment(deanchoring.deanchoringBand)}
      </p>
      <p data-testid="fiscal-household-note">{breach.narrative}</p>
      <p>{deanchoring.narrative}</p>
    </div>
  );
}
