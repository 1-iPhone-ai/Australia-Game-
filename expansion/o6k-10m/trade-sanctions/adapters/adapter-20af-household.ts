/**
 * Cross-wire adapter: SECTION 20AF (households & domestic demand).
 */
import type { V1014TradeDepthHouseholdDemandBridge, V1014TradeDepthTurnInput } from '../types/core';
import { clampTradeDepth } from '../engine/trade-depth-utils';

export function computeV1014TradeDepthHouseholdBridge(
  input: V1014TradeDepthTurnInput,
  remittanceShock: number,
  tariffPressure: number,
): V1014TradeDepthHouseholdDemandBridge {
  const importPriceShock = clampTradeDepth(tariffPressure * 0.18, 0, 0.35);
  const remittanceIncomeEffect = clampTradeDepth(-remittanceShock * 0.12, -0.2, 0);
  const consumptionMultiplier = clampTradeDepth(
    1 - importPriceShock * 0.4 - remittanceShock * 0.25 + input.householdSentiment * 0.05,
    0.65,
    1.05,
  );
  return { consumptionMultiplier, importPriceShock, remittanceIncomeEffect };
}

export function applyV1014TradeDepthHouseholdOverrides<T extends { consumptionElasticity?: number }>(
  inputs: T,
  bridge: V1014TradeDepthHouseholdDemandBridge,
): T {
  return {
    ...inputs,
    consumptionElasticity: clampTradeDepth((inputs.consumptionElasticity ?? 1) * bridge.consumptionMultiplier, 0.5, 1.2),
  };
}
