import type { MacroFinancialSystemInputs } from '../definitions/types.js';
import { finClamp } from '../compute/math.js';

/** Read-only trade snapshot from Agent 15 (contract only). */
export interface Agent15TradeSnapshot {
  turn: number;
  tradeOpennessBand: 'closed' | 'mixed' | 'open';
  exchangeRatePressure: 'appreciation' | 'stable' | 'depreciation' | 'sharp_depreciation';
  commodityImportShare: number;
  /** Round 22: tariff shock inflation latch. */
  tariffShockInflationActive?: boolean;
  /** Round 22: import pipeline fragility band. */
  importPipelineFragileBand?: 'stable' | 'strained' | 'critical';
  /** Round 31: import tariff inflation latch. */
  importTariffInflationLatch?: boolean;
  /** Round 31: exchange pipeline stress band. */
  exchangePipelineStressBand?: 'stable' | 'stressed' | 'ruptured';
}

export function mergeAgent15IntoMacroFinancialInputs(
  base: MacroFinancialSystemInputs,
  snapshot: Agent15TradeSnapshot | null | undefined,
): MacroFinancialSystemInputs {
  if (!snapshot) return base;

  let inflationSettingMultiplier = base.inflationSettingMultiplier ?? 1;
  if (
    snapshot.exchangeRatePressure === 'sharp_depreciation' ||
    snapshot.exchangeRatePressure === 'depreciation'
  ) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.08, 0.85, 1.45);
  }
  if (snapshot.tradeOpennessBand === 'open' && snapshot.commodityImportShare > 0.35) {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  let highInflationScenario = base.highInflationScenario;
  if (snapshot.exchangeRatePressure === 'sharp_depreciation' && snapshot.tradeOpennessBand === 'open') {
    highInflationScenario = true;
  }
  if (snapshot.tariffShockInflationActive && snapshot.importPipelineFragileBand === 'critical') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.05, 0.85, 1.45);
  }

  if (snapshot.importTariffInflationLatch && snapshot.exchangePipelineStressBand === 'ruptured') {
    highInflationScenario = true;
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.06, 0.85, 1.45);
  } else if (snapshot.exchangePipelineStressBand === 'stressed' && snapshot.exchangeRatePressure === 'sharp_depreciation') {
    inflationSettingMultiplier = finClamp(inflationSettingMultiplier + 0.03, 0.85, 1.45);
  }

  return {
    ...base,
    turn: Math.max(base.turn, snapshot.turn),
    inflationSettingMultiplier,
    highInflationScenario,
  };
}

export function agent15TradeBridgeIntegrationNote(): string {
  return 'Agent 15 trade snapshot adjusts import-side inflation multiplier flags; macro CPI only.';
}
