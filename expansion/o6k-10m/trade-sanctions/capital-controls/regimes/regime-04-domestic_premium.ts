/**
 * Capital controls + remittance shock regime (domestic_premium, shard 4).
 */
import { clampTradeDepth } from '../engine/trade-depth-utils';
import type { V1014TradeDepthCapitalState, V1014TradeDepthRemittanceShock } from '../types/core';

export const V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_REGIME_ID = 'capital_domestic_premium_04' as const;

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_initial(turn: number): V1014TradeDepthCapitalState {
  return {
    regimeId: V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_REGIME_ID,
    outflowLimit: 0.65 - (4 * 0.008),
    remittanceCap: 0.55,
    flightRisk: 0.12,
    fxPressure: 0.08,
    lastTurn: turn,
    shocks: [],
  };
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_applyRemittanceShock(
  state: V1014TradeDepthCapitalState,
  shock: V1014TradeDepthRemittanceShock,
): V1014TradeDepthCapitalState {
  return {
    ...state,
    remittanceCap: clampTradeDepth(state.remittanceCap - shock.severity * 0.15, 0.05, 1),
    flightRisk: clampTradeDepth(state.flightRisk + shock.severity * 0.2, 0, 1),
    fxPressure: clampTradeDepth(state.fxPressure + shock.severity * 0.12, 0, 1),
    shocks: [...state.shocks.slice(-20), shock],
  };
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_00(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 0 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_01(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 1 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_02(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 2 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_03(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 3 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_04(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 4 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_05(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 5 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_06(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 6 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_07(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 7 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_08(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 8 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_09(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 9 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_10(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 10 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_11(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 11 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_12(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 12 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_13(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 13 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_14(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 14 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_15(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 15 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_16(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 16 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_17(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 17 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_18(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 18 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_19(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 19 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_20(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 20 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_21(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 21 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_22(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 22 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_23(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 23 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_24(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 24 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_25(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 25 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_26(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 26 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_27(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 27 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_28(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 28 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_29(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 29 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_30(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 30 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_31(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 31 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_32(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 32 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_33(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 33 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_34(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 34 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_35(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 35 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_36(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 36 * 0.001, 0, 1);
}

export function V1014_TRADE_DEPTH_CAPITAL_DOMESTIC_PREMIUM_04_flightModel_37(state: V1014TradeDepthCapitalState, tradeStress: number): number {
  const stress = clampTradeDepth(tradeStress, 0, 1);
  return clampTradeDepth(state.flightRisk + stress * 0.25 - state.outflowLimit * 0.1 + 37 * 0.001, 0, 1);
}
