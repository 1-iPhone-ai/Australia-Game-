import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessSovereignGrantReconciliationOutlookInflationLatch,
  sovereignGrantReconciliationOutlookInflationLatchScoreAdjustment,
} from '../inflation/sovereign-grant-reconciliation-outlook-inflation-latch.js';
import {
  assessFiscalBufferReconciliationOutlookCoherenceInflationLatch,
  fiscalBufferReconciliationOutlookCoherenceInflationLatchScoreAdjustment,
} from '../inflation/fiscal-buffer-reconciliation-outlook-coherence-inflation-latch.js';
import {
  assessWave55SovereignGrantReconciliationOutlookInflationDepthLatch,
  wave55SovereignGrantReconciliationOutlookInflationDepthLatchScoreAdjustment,
} from '../inflation/wave55-sovereign-grant-reconciliation-outlook-inflation-depth-latch.js';
import {
  assessWave55FiscalBufferReconciliationOutlookCoherenceInflationDepthLatch,
  wave55FiscalBufferReconciliationOutlookCoherenceInflationDepthLatchScoreAdjustment,
} from '../inflation/wave55-fiscal-buffer-reconciliation-outlook-coherence-inflation-depth-latch.js';
import type { Agent07FiscalSnapshot } from '../integration/agent07-fiscal-bridge.js';

export interface MacroFiscalWave55InflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent07?: Agent07FiscalSnapshot | null;
}

export function MacroFiscalWave55InflationPanel(props: MacroFiscalWave55InflationPanelProps) {
  const a7 = props.agent07;
  const consolidatedDeficitBand =
    a7?.consolidatedDeficitBand ??
    (props.inputs.fiscalPressure === 'critical' ? ('large_deficit' as const) : ('moderate_deficit' as const));
  const revenueMomentum =
    a7?.revenueMomentum ?? (props.inputs.fiscalPressure === 'critical' ? ('weak' as const) : ('steady' as const));
  const debtServicePressure =
    a7?.debtServicePressure ??
    (props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('elevated' as const));
  const wave53GrantLatch =
    a7?.wave52FiscalSovereignReconciliationOutlookLatch ?? props.inputs.creditShockActive;
  const sovereignGrantBand =
    a7?.fiscalSovereignReconciliationOutlookBand ??
    (props.inputs.systemicLiquidityBand === 'critical' ? ('ruptured' as const) : ('strained' as const));
  const wave53BufferLatch =
    a7?.wave52BufferGrantReconciliationOutlookCoherenceLatch ?? props.inputs.householdInflationScenarioActive;
  const fiscalBufferBand =
    a7?.bufferGrantReconciliationOutlookCoherenceBand ??
    (props.inputs.fiscalPressure === 'critical' ? ('critical' as const) : ('building' as const));
  const grantOutlookWithinBand = a7?.grantOutlookWithinBand ?? !props.inputs.creditShockActive;
  const sovereignBufferBridgeGapElevated =
    a7?.sovereignBufferBridgeGapElevated ?? props.inputs.systemicLiquidityBand === 'critical';
  const grantFiscalCoherenceGapElevated =
    a7?.grantFiscalCoherenceGapElevated ?? props.inputs.fiscalPressure === 'critical';

  const wave54Grant = assessSovereignGrantReconciliationOutlookInflationLatch({
    consolidatedDeficitBand,
    debtServicePressure,
    wave53GrantSovereignReconciliationOutlookLatch: wave53GrantLatch === true,
    sovereignGrantReconciliationOutlookBand: sovereignGrantBand,
    sovereignBufferBridgeGapElevated: sovereignBufferBridgeGapElevated === true,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const wave54Buffer = assessFiscalBufferReconciliationOutlookCoherenceInflationLatch({
    revenueMomentum,
    grantFiscalCoherenceGapElevated: grantFiscalCoherenceGapElevated === true,
    wave53BufferFiscalReconciliationOutlookCoherenceLatch: wave53BufferLatch === true,
    fiscalBufferReconciliationOutlookCoherenceBand: fiscalBufferBand,
    grantOutlookWithinBand: grantOutlookWithinBand !== false,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const grantDepth = assessWave55SovereignGrantReconciliationOutlookInflationDepthLatch({
    wave54SovereignGrantReconciliationOutlookLatch: wave54Grant.latchBand !== 'aligned',
    wave54SovereignGrantReconciliationOutlookBand: wave54Grant.latchBand,
    consolidatedDeficitBand,
    sovereignBufferBridgeGapElevated: sovereignBufferBridgeGapElevated === true,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const bufferDepth = assessWave55FiscalBufferReconciliationOutlookCoherenceInflationDepthLatch({
    wave54FiscalBufferReconciliationOutlookCoherenceLatch: wave54Buffer.latchBand !== 'coherent',
    wave54FiscalBufferReconciliationOutlookCoherenceBand: wave54Buffer.latchBand,
    revenueMomentum,
    grantFiscalCoherenceGapElevated: grantFiscalCoherenceGapElevated === true,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-macro-fiscal-wave55-inflation" data-testid="macro-fiscal-wave55-inflation-panel">
      <h4>Sovereign grant & fiscal buffer reconciliation depth (wave 55 · O10-247)</h4>
      <p>
        Wave-54 grant {wave54Grant.latchBand} · depth {grantDepth.latchBand} · index {grantDepth.depthIndex.toFixed(0)}{' '}
        · score adj{' '}
        {wave55SovereignGrantReconciliationOutlookInflationDepthLatchScoreAdjustment(grantDepth.latchBand)}
      </p>
      <p>
        Wave-54 buffer {wave54Buffer.latchBand} · depth {bufferDepth.latchBand} · index{' '}
        {bufferDepth.depthIndex.toFixed(0)} · score adj{' '}
        {wave55FiscalBufferReconciliationOutlookCoherenceInflationDepthLatchScoreAdjustment(bufferDepth.latchBand)}
      </p>
      <p data-testid="macro-fiscal-wave55-note">{grantDepth.narrative}</p>
      <p>{bufferDepth.narrative}</p>
      <p>
        Wave-54 adj grant {sovereignGrantReconciliationOutlookInflationLatchScoreAdjustment(wave54Grant.latchBand)} ·
        buffer {fiscalBufferReconciliationOutlookCoherenceInflationLatchScoreAdjustment(wave54Buffer.latchBand)}
      </p>
    </div>
  );
}
