import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessResearchBreakthroughSupplySideInflationLatch,
  researchBreakthroughSupplySideInflationLatchScoreAdjustment,
} from '../inflation/research-breakthrough-supply-side-inflation-latch.js';
import {
  assessTradeImportExchangeInflationPipelineSurge,
  tradeImportExchangeInflationPipelineSurgeScoreAdjustment,
} from '../inflation/trade-import-exchange-inflation-pipeline-surge.js';
import type { Agent03ResearchSnapshot } from '../integration/agent03-research-bridge.js';
import type { Agent15TradeSnapshot } from '../integration/agent15-trade-bridge.js';

export interface ResearchTradeWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent03?: Agent03ResearchSnapshot | null;
  agent15?: Agent15TradeSnapshot | null;
}

export function ResearchTradeWaveInflationPanel(props: ResearchTradeWaveInflationPanelProps) {
  const research = props.agent03 ?? {
    turn: props.inputs.turn,
    productivityGainBand: props.inputs.highInflationScenario ? ('flat' as const) : ('moderate' as const),
    supplySideReliefActive: !props.inputs.householdInflationScenarioActive,
    innovationInflationOffsetScore: props.inputs.householdInflationScenarioActive ? 0.2 : 0.55,
    wave48ResearchBreakthroughLatch: props.inputs.householdInflationScenarioActive,
    researchSupplySideFailureBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('building' as const),
  };

  const trade = props.agent15 ?? {
    turn: props.inputs.turn,
    tradeOpennessBand: 'open' as const,
    exchangeRatePressure: props.inputs.creditShockActive ? ('sharp_depreciation' as const) : ('depreciation' as const),
    commodityImportShare: props.inputs.highInflationScenario ? 0.42 : 0.28,
    wave48TradeImportPipelineLatch: props.inputs.creditShockActive,
    importExchangePipelineSurgeBand:
      props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('stressed' as const),
  };

  const latch = assessResearchBreakthroughSupplySideInflationLatch({
    productivityGainBand: research.productivityGainBand,
    supplySideReliefActive: research.supplySideReliefActive,
    wave48ResearchBreakthroughLatch: research.wave48ResearchBreakthroughLatch === true,
    researchSupplySideFailureBand: research.researchSupplySideFailureBand ?? 'contained',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const surge = assessTradeImportExchangeInflationPipelineSurge({
    tradeOpennessBand: trade.tradeOpennessBand,
    exchangeRatePressure: trade.exchangeRatePressure,
    wave48TradeImportPipelineLatch: trade.wave48TradeImportPipelineLatch === true,
    importExchangePipelineSurgeBand: trade.importExchangePipelineSurgeBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-research-trade-wave-inflation" data-testid="research-trade-wave-inflation-panel">
      <h4>Research breakthrough latch & trade import pipeline surge (round 48)</h4>
      <p>
        Research {latch.latchBand} · index {latch.pressureIndex.toFixed(0)} · score adj{' '}
        {researchBreakthroughSupplySideInflationLatchScoreAdjustment(latch.latchBand)}
      </p>
      <p>
        Trade {surge.surgeBand} · index {surge.stressIndex.toFixed(0)} · score adj{' '}
        {tradeImportExchangeInflationPipelineSurgeScoreAdjustment(surge.surgeBand)}
      </p>
      <p data-testid="research-trade-wave-note">{latch.narrative}</p>
      <p>{surge.narrative}</p>
    </div>
  );
}
