import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessTradeClearedForwardArcInflationHandoffLatch,
  tradeClearedForwardArcInflationHandoffLatchScoreAdjustment,
} from '../inflation/trade-cleared-forward-arc-inflation-handoff-latch.js';
import {
  assessGuardianEntrustmentEnvelopeInflationPressureSurge,
  guardianEntrustmentEnvelopeInflationPressureSurgeScoreAdjustment,
} from '../inflation/guardian-entrustment-envelope-inflation-pressure-surge.js';
import type { Agent15TradeSnapshot } from '../integration/agent15-trade-bridge.js';
import type { Agent16GuardianSnapshot } from '../integration/agent16-guardian-bridge.js';

export interface TradeGuardianWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent15?: Agent15TradeSnapshot | null;
  agent16?: Agent16GuardianSnapshot | null;
}

export function TradeGuardianWaveInflationPanel(props: TradeGuardianWaveInflationPanelProps) {
  const trade = props.agent15 ?? {
    turn: props.inputs.turn,
    tradeOpennessBand: 'open' as const,
    exchangeRatePressure: props.inputs.creditShockActive ? ('sharp_depreciation' as const) : ('depreciation' as const),
    commodityImportShare: props.inputs.highInflationScenario ? 0.44 : 0.3,
    wave49ClearedForwardArcHandoffLatch: props.inputs.creditShockActive,
    clearedForwardArcHandoffContinuityBand:
      props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('strained' as const),
  };

  const guardian = props.agent16 ?? {
    turn: props.inputs.turn,
    inflationGuardrailTripped: props.inputs.highInflationScenario,
    stabilityInterventionBand:
      props.inputs.publicStability < 35 ? ('urgent' as const) : props.inputs.fiscalPressure === 'critical' ? ('advisory' as const) : ('none' as const),
    narrativeShockSeverity: props.inputs.systemicLiquidityBand === 'critical' ? ('high' as const) : ('medium' as const),
    wave49EntrustmentEnvelopeLatch: props.inputs.householdInflationScenarioActive,
    entrustmentEnvelopePressureBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('ruptured' as const) : ('elevated' as const),
    entrustmentStrainIndex: props.inputs.publicStability < 40 ? 0.78 : 0.52,
  };

  const handoff = assessTradeClearedForwardArcInflationHandoffLatch({
    tradeOpennessBand: trade.tradeOpennessBand,
    exchangeRatePressure: trade.exchangeRatePressure,
    wave49ClearedForwardArcHandoffLatch: trade.wave49ClearedForwardArcHandoffLatch === true,
    clearedForwardArcHandoffContinuityBand: trade.clearedForwardArcHandoffContinuityBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const envelope = assessGuardianEntrustmentEnvelopeInflationPressureSurge({
    inflationGuardrailTripped: guardian.inflationGuardrailTripped,
    stabilityInterventionBand: guardian.stabilityInterventionBand,
    wave49EntrustmentEnvelopeLatch: guardian.wave49EntrustmentEnvelopeLatch === true,
    entrustmentEnvelopePressureBand: guardian.entrustmentEnvelopePressureBand ?? 'contained',
    entrustmentStrainIndex: guardian.entrustmentStrainIndex ?? 0.4,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-trade-guardian-wave-inflation" data-testid="trade-guardian-wave-inflation-panel">
      <h4>Trade cleared forward-arc handoff & guardian entrustment envelope (round 49)</h4>
      <p>
        Handoff {handoff.latchBand} · index {handoff.continuityIndex.toFixed(0)} · score adj{' '}
        {tradeClearedForwardArcInflationHandoffLatchScoreAdjustment(handoff.latchBand)}
      </p>
      <p>
        Envelope {envelope.surgeBand} · index {envelope.strainIndex.toFixed(0)} · score adj{' '}
        {guardianEntrustmentEnvelopeInflationPressureSurgeScoreAdjustment(envelope.surgeBand)}
      </p>
      <p data-testid="trade-guardian-wave-note">{handoff.narrative}</p>
      <p>{envelope.narrative}</p>
    </div>
  );
}
