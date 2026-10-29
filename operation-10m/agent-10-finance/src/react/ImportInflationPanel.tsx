import type { MacroFinancialSystemInputs, NationalMacroFinancialState } from '../definitions/types.js';
import {
  assessImportPricePassThrough,
  importPassThroughInflationScoreAdjustment,
} from '../inflation/import-price-pass-through.js';
import { assessTermPremiumInflationSignal } from '../rates/term-premium-inflation-signal.js';
import type { Agent15TradeSnapshot } from '../integration/agent15-trade-bridge.js';
import type { Agent08CorporateSnapshot } from '../integration/agent08-corporate-bridge.js';

export interface ImportInflationPanelProps {
  state: NationalMacroFinancialState;
  inputs: MacroFinancialSystemInputs;
  agent15?: Agent15TradeSnapshot | null;
  agent08?: Agent08CorporateSnapshot | null;
}

export function ImportInflationPanel(props: ImportInflationPanelProps) {
  const trade = props.agent15 ?? {
    turn: props.inputs.turn,
    tradeOpennessBand: 'mixed' as const,
    exchangeRatePressure: 'stable' as const,
    commodityImportShare: 0.28,
  };

  const imports = assessImportPricePassThrough({
    tradeOpennessBand: trade.tradeOpennessBand,
    exchangeRatePressure: trade.exchangeRatePressure,
    commodityImportShare: trade.commodityImportShare,
    inflationBand: props.state.inflation,
    turn: props.inputs.turn,
  });

  const term = assessTermPremiumInflationSignal({
    inflationBand: props.state.inflation,
    fiscalPressure: props.inputs.fiscalPressure,
    sovereignDebtPressure: props.inputs.sovereignDebtPressure,
    highInflationScenario: props.inputs.highInflationScenario,
  });

  const corpNote =
    props.agent08?.pricingPowerBand === 'dominant' || props.agent08?.passThroughIntent === 'full'
      ? 'Corporate pass-through elevated'
      : 'Corporate pass-through moderate';

  return (
    <div className="op10m-import-inflation" data-testid="import-inflation-panel">
      <h4>Import & term premium (round 7)</h4>
      <p>
        Import pass-through {imports.passThroughBand} · index {imports.importCostIndex.toFixed(0)} · score adj{' '}
        {importPassThroughInflationScoreAdjustment(imports.passThroughBand)}
      </p>
      <p>
        Term premium {term.premiumBps} bps · {term.signalBand}
      </p>
      <p>{imports.narrative}</p>
      <p data-testid="import-inflation-corp">{corpNote}</p>
    </div>
  );
}
