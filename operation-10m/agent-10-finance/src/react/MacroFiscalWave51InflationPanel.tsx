import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessMacroTransmissionCoherenceInflationReconciliationLatch,
  macroTransmissionCoherenceInflationReconciliationLatchScoreAdjustment,
} from '../inflation/macro-transmission-coherence-inflation-reconciliation-latch.js';
import {
  assessPublicFinanceChargesIndexationInflationSurgeLatch,
  publicFinanceChargesIndexationInflationSurgeLatchScoreAdjustment,
} from '../inflation/public-finance-charges-indexation-inflation-surge-latch.js';
import type { Agent06MacroSnapshot } from '../integration/agent06-macro-bridge.js';
import type { Agent07FiscalSnapshot } from '../integration/agent07-fiscal-bridge.js';

export interface MacroFiscalWave51InflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent06?: Agent06MacroSnapshot | null;
  agent07?: Agent07FiscalSnapshot | null;
}

export function MacroFiscalWave51InflationPanel(props: MacroFiscalWave51InflationPanelProps) {
  const macro = props.agent06 ?? {
    turn: props.inputs.turn,
    gdpGrowthBand: props.inputs.highInflationScenario ? ('strong' as const) : ('steady' as const),
    unemploymentBand: 'moderate' as const,
    outputGap: props.inputs.householdInflationScenarioActive ? 0.44 : 0.12,
    nominalDemandPressure: props.inputs.householdInflationScenarioActive ? 0.52 : 0.18,
    wave51MacroTransmissionCoherenceLatch: props.inputs.householdInflationScenarioActive,
    transmissionCoherenceEscalationBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('elevated' as const),
    transmissionSlippageBand:
      props.inputs.fiscalPressure === 'critical' ? ('dislocated' as const) : ('slipping' as const),
  };

  const fiscal = props.agent07 ?? {
    turn: props.inputs.turn,
    consolidatedDeficitBand: props.inputs.fiscalPressure === 'critical' ? ('large_deficit' as const) : ('moderate_deficit' as const),
    revenueMomentum: 'weak' as const,
    debtServicePressure: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('elevated' as const),
    wave51PublicFinanceIndexationSurgeLatch: props.inputs.creditShockActive,
    chargesIndexationSurgeBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('ruptured' as const) : ('building' as const),
    indexedChargesInflationPassThrough: props.inputs.creditShockActive,
  };

  const coherence = assessMacroTransmissionCoherenceInflationReconciliationLatch({
    gdpGrowthBand: macro.gdpGrowthBand,
    nominalDemandPressure: macro.nominalDemandPressure,
    wave51MacroTransmissionCoherenceLatch: macro.wave51MacroTransmissionCoherenceLatch === true,
    transmissionCoherenceEscalationBand: macro.transmissionCoherenceEscalationBand ?? 'stable',
    transmissionSlippageBand: macro.transmissionSlippageBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const indexation = assessPublicFinanceChargesIndexationInflationSurgeLatch({
    consolidatedDeficitBand: fiscal.consolidatedDeficitBand,
    debtServicePressure: fiscal.debtServicePressure,
    wave51PublicFinanceIndexationSurgeLatch: fiscal.wave51PublicFinanceIndexationSurgeLatch === true,
    chargesIndexationSurgeBand: fiscal.chargesIndexationSurgeBand ?? 'contained',
    indexedChargesInflationPassThrough: fiscal.indexedChargesInflationPassThrough === true,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-macro-fiscal-wave51-inflation" data-testid="macro-fiscal-wave51-inflation-panel">
      <h4>Macro transmission coherence & public finance indexation surge (round 51)</h4>
      <p>
        Coherence {coherence.latchBand} · index {coherence.coherenceIndex.toFixed(0)} · score adj{' '}
        {macroTransmissionCoherenceInflationReconciliationLatchScoreAdjustment(coherence.latchBand)}
      </p>
      <p>
        Indexation {indexation.surgeBand} · index {indexation.indexationIndex.toFixed(0)} · score adj{' '}
        {publicFinanceChargesIndexationInflationSurgeLatchScoreAdjustment(indexation.surgeBand)}
      </p>
      <p data-testid="macro-fiscal-wave51-note">{coherence.narrative}</p>
      <p>{indexation.narrative}</p>
    </div>
  );
}
