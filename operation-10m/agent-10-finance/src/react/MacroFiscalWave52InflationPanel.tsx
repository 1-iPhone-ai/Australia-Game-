import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessFiscalSovereignReconciliationOutlookInflationLatch,
  fiscalSovereignReconciliationOutlookInflationLatchScoreAdjustment,
} from '../inflation/fiscal-sovereign-reconciliation-outlook-inflation-latch.js';
import {
  assessBufferGrantReconciliationOutlookCoherenceInflationLatch,
  bufferGrantReconciliationOutlookCoherenceInflationLatchScoreAdjustment,
} from '../inflation/buffer-grant-reconciliation-outlook-coherence-inflation-latch.js';
import type { Agent07FiscalSnapshot } from '../integration/agent07-fiscal-bridge.js';

export interface MacroFiscalWave52InflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent07?: Agent07FiscalSnapshot | null;
}

export function MacroFiscalWave52InflationPanel(props: MacroFiscalWave52InflationPanelProps) {
  const fiscal = props.agent07 ?? {
    turn: props.inputs.turn,
    consolidatedDeficitBand: props.inputs.fiscalPressure === 'critical' ? ('large_deficit' as const) : ('moderate_deficit' as const),
    revenueMomentum: props.inputs.fiscalPressure === 'critical' ? ('weak' as const) : ('steady' as const),
    debtServicePressure: props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('elevated' as const),
    wave52FiscalSovereignReconciliationOutlookLatch: props.inputs.creditShockActive,
    fiscalSovereignReconciliationOutlookBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('ruptured' as const) : ('strained' as const),
    wave52BufferGrantReconciliationOutlookCoherenceLatch: props.inputs.householdInflationScenarioActive,
    bufferGrantReconciliationOutlookCoherenceBand:
      props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('building' as const),
    grantOutlookWithinBand: !props.inputs.creditShockActive,
    sovereignBufferBridgeGapElevated: props.inputs.systemicLiquidityBand === 'critical',
  };

  const sovereign = assessFiscalSovereignReconciliationOutlookInflationLatch({
    consolidatedDeficitBand: fiscal.consolidatedDeficitBand,
    debtServicePressure: fiscal.debtServicePressure,
    wave52FiscalSovereignReconciliationOutlookLatch: fiscal.wave52FiscalSovereignReconciliationOutlookLatch === true,
    fiscalSovereignReconciliationOutlookBand: fiscal.fiscalSovereignReconciliationOutlookBand ?? 'aligned',
    sovereignBufferBridgeGapElevated: fiscal.sovereignBufferBridgeGapElevated === true,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const grantCoherence = assessBufferGrantReconciliationOutlookCoherenceInflationLatch({
    revenueMomentum: fiscal.revenueMomentum,
    grantFiscalCoherenceGapElevated: fiscal.grantFiscalCoherenceGapElevated === true,
    wave52BufferGrantReconciliationOutlookCoherenceLatch:
      fiscal.wave52BufferGrantReconciliationOutlookCoherenceLatch === true,
    bufferGrantReconciliationOutlookCoherenceBand: fiscal.bufferGrantReconciliationOutlookCoherenceBand ?? 'contained',
    grantOutlookWithinBand: fiscal.grantOutlookWithinBand !== false,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-macro-fiscal-wave52-inflation" data-testid="macro-fiscal-wave52-inflation-panel">
      <h4>Fiscal sovereign reconciliation outlook & buffer grant coherence (round 52)</h4>
      <p>
        Sovereign {sovereign.latchBand} · index {sovereign.reconciliationIndex.toFixed(0)} · score adj{' '}
        {fiscalSovereignReconciliationOutlookInflationLatchScoreAdjustment(sovereign.latchBand)}
      </p>
      <p>
        Grant coherence {grantCoherence.latchBand} · index {grantCoherence.coherenceIndex.toFixed(0)} · score adj{' '}
        {bufferGrantReconciliationOutlookCoherenceInflationLatchScoreAdjustment(grantCoherence.latchBand)}
      </p>
      <p data-testid="macro-fiscal-wave52-note">{sovereign.narrative}</p>
      <p>{grantCoherence.narrative}</p>
    </div>
  );
}
