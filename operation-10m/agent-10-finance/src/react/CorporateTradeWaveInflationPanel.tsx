import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessCorporateSurvivalPricingInflationLatch,
  corporateSurvivalPricingInflationLatchScoreAdjustment,
} from '../inflation/corporate-survival-pricing-inflation-latch.js';
import {
  assessTradeTariffExchangeInflationEscalation,
  tradeTariffExchangeInflationEscalationScoreAdjustment,
} from '../inflation/trade-tariff-exchange-inflation-escalation.js';
import type { Agent08CorporateSnapshot } from '../integration/agent08-corporate-bridge.js';
import type { Agent15TradeSnapshot } from '../integration/agent15-trade-bridge.js';

export interface CorporateTradeWaveInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent08?: Agent08CorporateSnapshot | null;
  agent15?: Agent15TradeSnapshot | null;
}

export function CorporateTradeWaveInflationPanel(props: CorporateTradeWaveInflationPanelProps) {
  const corporate = props.agent08 ?? {
    turn: props.inputs.turn,
    pricingPowerBand: props.inputs.highInflationScenario ? ('dominant' as const) : ('strong' as const),
    marginCompression: props.inputs.creditShockActive ? ('severe' as const) : ('mild' as const),
    passThroughIntent: props.inputs.fiscalPressure === 'critical' ? ('full' as const) : ('partial' as const),
    wave39SurvivalPricingLatch: props.inputs.householdInflationScenarioActive,
    corporateMarkupEscalationBand: props.inputs.systemicLiquidityBand === 'critical' ? ('dominant' as const) : ('building' as const),
  };

  const trade = props.agent15 ?? {
    turn: props.inputs.turn,
    tradeOpennessBand: 'open' as const,
    exchangeRatePressure: props.inputs.creditShockActive ? ('sharp_depreciation' as const) : ('depreciation' as const),
    commodityImportShare: 0.42,
    wave39TariffExchangeLatch: props.inputs.creditShockActive,
    importExchangeEscalationBand: props.inputs.fiscalPressure === 'critical' ? ('ruptured' as const) : ('stressed' as const),
  };

  const pricing = assessCorporateSurvivalPricingInflationLatch({
    pricingPowerBand: corporate.pricingPowerBand,
    passThroughIntent: corporate.passThroughIntent,
    marginCompression: corporate.marginCompression,
    wave39SurvivalPricingLatch: corporate.wave39SurvivalPricingLatch === true,
    corporateMarkupEscalationBand: corporate.corporateMarkupEscalationBand ?? 'contained',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const exchange = assessTradeTariffExchangeInflationEscalation({
    exchangeRatePressure: trade.exchangeRatePressure,
    tradeOpennessBand: trade.tradeOpennessBand,
    commodityImportShare: trade.commodityImportShare,
    wave39TariffExchangeLatch: trade.wave39TariffExchangeLatch === true,
    importExchangeEscalationBand: trade.importExchangeEscalationBand ?? 'stable',
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  return (
    <div className="op10m-corporate-trade-wave-inflation" data-testid="corporate-trade-wave-inflation-panel">
      <h4>Survival pricing latch & tariff exchange (round 39)</h4>
      <p>
        Corporate {pricing.latchBand} · index {pricing.pricingIndex.toFixed(0)} · score adj{' '}
        {corporateSurvivalPricingInflationLatchScoreAdjustment(pricing.latchBand)}
      </p>
      <p>
        Trade {exchange.escalationBand} · index {exchange.exchangeIndex.toFixed(0)} · score adj{' '}
        {tradeTariffExchangeInflationEscalationScoreAdjustment(exchange.escalationBand)}
      </p>
      <p data-testid="corporate-trade-wave-note">{pricing.narrative}</p>
      <p>{exchange.narrative}</p>
    </div>
  );
}
