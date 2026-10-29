import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessPublicFinanceDebtServiceInflation,
  publicFinanceDebtServiceInflationScoreAdjustment,
} from '../inflation/public-finance-debt-service-inflation.js';
import {
  assessPopulationLaborWageInflation,
  populationLaborWageInflationScoreAdjustment,
} from '../inflation/population-labor-wage-inflation.js';
import type { Agent07FiscalSnapshot } from '../integration/agent07-fiscal-bridge.js';
import type { Agent09HouseholdSnapshot } from '../integration/agent09-household-bridge.js';

export interface FiscalLaborInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent07?: Agent07FiscalSnapshot | null;
  agent09?: Agent09HouseholdSnapshot | null;
}

export function FiscalLaborInflationPanel(props: FiscalLaborInflationPanelProps) {
  const fiscal = props.agent07 ?? {
    turn: props.inputs.turn,
    consolidatedDeficitBand:
      props.inputs.fiscalPressure === 'critical' ? ('large_deficit' as const) : ('moderate_deficit' as const),
    revenueMomentum: props.inputs.fiscalSustainability === 'vulnerable' ? ('weak' as const) : ('steady' as const),
    debtServicePressure:
      props.inputs.sovereignDebtPressure === 'critical'
        ? ('critical' as const)
        : props.inputs.sovereignDebtPressure === 'elevated'
          ? ('elevated' as const)
          : ('moderate' as const),
    fiscalAnchorBreached: props.inputs.fiscalPressure === 'critical',
    indexedChargesInflationPassThrough: props.inputs.fiscalPressure !== 'healthy',
  };

  const household = props.agent09 ?? {
    turn: props.inputs.turn,
    laborParticipationBand: props.inputs.actorCreditStressIndex > 0.5 ? ('weak' as const) : ('steady' as const),
    wageGrowthBand:
      props.inputs.highInflationScenario && props.inputs.householdInflationScenarioActive
        ? ('surge' as const)
        : props.inputs.householdInflationScenarioActive
          ? ('elevated' as const)
          : ('moderate' as const),
    costOfLivingStress:
      props.inputs.householdAffordability === 'severe_pressure'
        ? ('extreme' as const)
        : props.inputs.householdAffordability === 'strained'
          ? ('high' as const)
          : ('moderate' as const),
    participationSlackInflationBand:
      props.inputs.householdAffordability === 'severe_pressure' ? ('severe_slack' as const) : ('slack' as const),
    householdExpectationsDeanchoring: props.inputs.highInflationScenario && props.inputs.householdInflationScenarioActive,
  };

  const debtService = assessPublicFinanceDebtServiceInflation({
    consolidatedDeficitBand: fiscal.consolidatedDeficitBand,
    debtServicePressure: fiscal.debtServicePressure,
    fiscalAnchorBreached: fiscal.fiscalAnchorBreached === true,
    indexedChargesInflationPassThrough: fiscal.indexedChargesInflationPassThrough === true,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const laborWage = assessPopulationLaborWageInflation({
    laborParticipationBand: household.laborParticipationBand,
    wageGrowthBand: household.wageGrowthBand,
    costOfLivingStress: household.costOfLivingStress,
    participationSlackInflationBand: household.participationSlackInflationBand ?? 'balanced',
    householdExpectationsDeanchoring: household.householdExpectationsDeanchoring === true,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-fiscal-labor-inflation" data-testid="fiscal-labor-inflation-panel">
      <h4>Public finance debt service & labor wage (round 20)</h4>
      <p>
        Fiscal {debtService.debtServiceBand} · index {debtService.fiscalIndex.toFixed(0)} · score adj{' '}
        {publicFinanceDebtServiceInflationScoreAdjustment(debtService.debtServiceBand)}
      </p>
      <p>
        Labor wage {laborWage.wageBand} · index {laborWage.laborIndex.toFixed(0)} · score adj{' '}
        {populationLaborWageInflationScoreAdjustment(laborWage.wageBand)}
      </p>
      <p data-testid="fiscal-labor-note">{debtService.narrative}</p>
      <p>{laborWage.narrative}</p>
    </div>
  );
}
