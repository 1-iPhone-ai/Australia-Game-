import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessCorporatePricingPassThroughInflation,
  corporatePricingPassThroughInflationScoreAdjustment,
} from '../inflation/corporate-pricing-pass-through-inflation.js';
import {
  assessTradeExchangeImportInflation,
  tradeExchangeImportInflationScoreAdjustment,
} from '../inflation/trade-exchange-import-inflation.js';
import type { Agent08CorporateSnapshot } from '../integration/agent08-corporate-bridge.js';
import type { Agent15TradeSnapshot } from '../integration/agent15-trade-bridge.js';

export interface CorporateTradeInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent08?: Agent08CorporateSnapshot | null;
  agent15?: Agent15TradeSnapshot | null;
}

export function CorporateTradeInflationPanel(props: CorporateTradeInflationPanelProps) {
  const corporate = props.agent08 ?? {
    turn: props.inputs.turn,
    pricingPowerBand: props.inputs.highInflationScenario ? ('strong' as const) : ('moderate' as const),
    marginCompression: props.inputs.actorCreditStressIndex > 0.55 ? ('severe' as const) : ('mild' as const),
    passThroughIntent: props.inputs.fiscalPressure === 'critical' ? ('full' as const) : ('partial' as const),
    productionCapacityStrainInflationFlag: props.inputs.systemicLiquidityBand === 'strained',
    corporateMarkupCascadeBand: props.inputs.creditShockActive ? ('active' as const) : ('building' as const),
  };

  const trade = props.agent15 ?? {
    turn: props.inputs.turn,
    tradeOpennessBand: 'open' as const,
    exchangeRatePressure: props.inputs.highInflationScenario ? ('sharp_depreciation' as const) : ('depreciation' as const),
    commodityImportShare: 0.42,
    tariffShockInflationActive: props.inputs.creditShockActive,
    importPipelineFragileBand:
      props.inputs.systemicLiquidityBand === 'critical' ? ('critical' as const) : ('strained' as const),
  };

  const pricing = assessCorporatePricingPassThroughInflation({
    pricingPowerBand: corporate.pricingPowerBand,
    marginCompression: corporate.marginCompression,
    passThroughIntent: corporate.passThroughIntent,
    productionCapacityStrainInflationFlag: corporate.productionCapacityStrainInflationFlag === true,
    corporateMarkupCascadeBand: corporate.corporateMarkupCascadeBand ?? 'none',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const imports = assessTradeExchangeImportInflation({
    tradeOpennessBand: trade.tradeOpennessBand,
    exchangeRatePressure: trade.exchangeRatePressure,
    commodityImportShare: trade.commodityImportShare,
    tariffShockInflationActive: trade.tariffShockInflationActive === true,
    importPipelineFragileBand: trade.importPipelineFragileBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-corporate-trade-inflation" data-testid="corporate-trade-inflation-panel">
      <h4>Corporate pricing & trade import (round 22)</h4>
      <p>
        Corporate {pricing.passThroughBand} · index {pricing.corporateIndex.toFixed(0)} · score adj{' '}
        {corporatePricingPassThroughInflationScoreAdjustment(pricing.passThroughBand)}
      </p>
      <p>
        Trade {imports.importBand} · index {imports.tradeIndex.toFixed(0)} · score adj{' '}
        {tradeExchangeImportInflationScoreAdjustment(imports.importBand)}
      </p>
      <p data-testid="corporate-trade-note">{pricing.narrative}</p>
      <p>{imports.narrative}</p>
    </div>
  );
}
