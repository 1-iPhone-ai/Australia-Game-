import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessCorporateMarkupInflationCascade,
  corporateMarkupInflationCascadeScoreAdjustment,
} from '../inflation/corporate-markup-inflation-cascade.js';
import {
  assessTradeTariffImportInflationPipeline,
  tradeTariffImportInflationPipelineScoreAdjustment,
} from '../inflation/trade-tariff-import-inflation-pipeline.js';
import type { Agent08CorporateSnapshot } from '../integration/agent08-corporate-bridge.js';
import type { Agent15TradeSnapshot } from '../integration/agent15-trade-bridge.js';

export interface MarkupTariffInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent08?: Agent08CorporateSnapshot | null;
  agent15?: Agent15TradeSnapshot | null;
}

export function MarkupTariffInflationPanel(props: MarkupTariffInflationPanelProps) {
  const corporate = props.agent08 ?? {
    turn: props.inputs.turn,
    pricingPowerBand: props.inputs.highInflationScenario ? ('dominant' as const) : ('strong' as const),
    marginCompression: props.inputs.creditShockActive ? ('mild' as const) : ('none' as const),
    passThroughIntent: props.inputs.highInflationScenario ? ('full' as const) : ('partial' as const),
    corporatePricingInflationLatch: props.inputs.householdInflationScenarioActive,
    markupPassThroughCascadeBand: props.inputs.fiscalPressure === 'critical' ? ('full' as const) : ('partial' as const),
  };

  const trade = props.agent15 ?? {
    turn: props.inputs.turn,
    tradeOpennessBand: 'open' as const,
    exchangeRatePressure: props.inputs.creditShockActive ? ('sharp_depreciation' as const) : ('depreciation' as const),
    commodityImportShare: 0.42,
    importTariffInflationLatch: props.inputs.creditShockActive,
    exchangePipelineStressBand: props.inputs.systemicLiquidityBand === 'critical' ? ('ruptured' as const) : ('stressed' as const),
  };

  const markup = assessCorporateMarkupInflationCascade({
    pricingPowerBand: corporate.pricingPowerBand,
    passThroughIntent: corporate.passThroughIntent,
    marginCompression: corporate.marginCompression,
    corporatePricingInflationLatch: corporate.corporatePricingInflationLatch === true,
    markupPassThroughCascadeBand: corporate.markupPassThroughCascadeBand ?? 'absorbed',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const pipeline = assessTradeTariffImportInflationPipeline({
    tradeOpennessBand: trade.tradeOpennessBand,
    exchangeRatePressure: trade.exchangeRatePressure,
    commodityImportShare: trade.commodityImportShare,
    importTariffInflationLatch: trade.importTariffInflationLatch === true,
    exchangePipelineStressBand: trade.exchangePipelineStressBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-markup-tariff-inflation" data-testid="markup-tariff-inflation-panel">
      <h4>Corporate markup & trade tariff pipeline (round 31)</h4>
      <p>
        Markup {markup.cascadeBand} · index {markup.markupIndex.toFixed(0)} · score adj{' '}
        {corporateMarkupInflationCascadeScoreAdjustment(markup.cascadeBand)}
      </p>
      <p>
        Trade {pipeline.pipelineBand} · index {pipeline.tradeIndex.toFixed(0)} · score adj{' '}
        {tradeTariffImportInflationPipelineScoreAdjustment(pipeline.pipelineBand)}
      </p>
      <p data-testid="markup-tariff-note">{markup.narrative}</p>
      <p>{pipeline.narrative}</p>
    </div>
  );
}
