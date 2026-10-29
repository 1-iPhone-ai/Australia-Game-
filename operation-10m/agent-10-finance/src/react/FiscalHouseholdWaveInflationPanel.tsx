import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessFiscalConsolidatedInflationPressureLatch,
  fiscalConsolidatedInflationPressureLatchScoreAdjustment,
} from '../inflation/fiscal-consolidated-inflation-pressure-latch.js';
import {
  assessHouseholdWageInflationStressSurge,
  householdWageInflationStressSurgeScoreAdjustment,
} from '../inflation/household-wage-inflation-stress-surge.js';
import type { Agent07FiscalSnapshot } from '../integration/agent07-fiscal-bridge.js';
import type { Agent09HouseholdSnapshot } from '../integration/agent09-household-bridge.js';

export interface FiscalHouseholdWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent07?: Agent07FiscalSnapshot | null;
  agent09?: Agent09HouseholdSnapshot | null;
}

export function FiscalHouseholdWaveInflationPanel(props: FiscalHouseholdWaveInflationPanelProps) {
  const fiscal = props.agent07 ?? {
    turn: props.inputs.turn,
    consolidatedDeficitBand: props.inputs.fiscalPressure === 'critical' ? ('large_deficit' as const) : ('moderate_deficit' as const),
    revenueMomentum: 'weak' as const,
    debtServicePressure: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('elevated' as const),
    wave46FiscalPressureLatch: props.inputs.householdInflationScenarioActive,
    consolidatedDeficitEscalationBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('elevated' as const),
  };

  const household = props.agent09 ?? {
    turn: props.inputs.turn,
    laborParticipationBand: 'steady' as const,
    wageGrowthBand: props.inputs.highInflationScenario ? ('surge' as const) : ('elevated' as const),
    costOfLivingStress: props.inputs.publicStability < 40 ? ('extreme' as const) : ('high' as const),
    wave46HouseholdStressLatch: props.inputs.creditShockActive,
    wageStressSurgeBand:
      props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('building' as const),
  };

  const pressure = assessFiscalConsolidatedInflationPressureLatch({
    consolidatedDeficitBand: fiscal.consolidatedDeficitBand,
    debtServicePressure: fiscal.debtServicePressure,
    wave46FiscalPressureLatch: fiscal.wave46FiscalPressureLatch === true,
    consolidatedDeficitEscalationBand: fiscal.consolidatedDeficitEscalationBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const surge = assessHouseholdWageInflationStressSurge({
    wageGrowthBand: household.wageGrowthBand,
    costOfLivingStress: household.costOfLivingStress,
    wave46HouseholdStressLatch: household.wave46HouseholdStressLatch === true,
    wageStressSurgeBand: household.wageStressSurgeBand ?? 'contained',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-fiscal-household-wave-inflation" data-testid="fiscal-household-wave-inflation-panel">
      <h4>Fiscal pressure latch & household wage stress surge (round 46)</h4>
      <p>
        Fiscal {pressure.latchBand} · index {pressure.pressureIndex.toFixed(0)} · score adj{' '}
        {fiscalConsolidatedInflationPressureLatchScoreAdjustment(pressure.latchBand)}
      </p>
      <p>
        Household {surge.surgeBand} · index {surge.stressIndex.toFixed(0)} · score adj{' '}
        {householdWageInflationStressSurgeScoreAdjustment(surge.surgeBand)}
      </p>
      <p data-testid="fiscal-household-wave-note">{pressure.narrative}</p>
      <p>{surge.narrative}</p>
    </div>
  );
}
