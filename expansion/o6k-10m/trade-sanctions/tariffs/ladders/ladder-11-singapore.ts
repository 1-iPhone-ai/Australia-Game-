/**
 * Tariff escalation ladder for Singapore (T6-6 ladder 11).
 * Automatic retaliation couples to bilateral deal machines and GTEL access bands.
 */
import { clampTradeDepth } from '../engine/trade-depth-utils';
import type { V1014TradeDepthTariffContext } from '../types/core';

export const V1014_TRADE_DEPTH_TARIFF_SINGAPORE_PARTNER = 'singapore' as const;

export interface V1014_TRADE_DEPTH_TARIFF_SINGAPORERung {
  rung: number;
  label: string;
  rate: number;
  triggerEscalationIf: (ctx: V1014TradeDepthTariffContext) => boolean;
}

export const V1014_TRADE_DEPTH_TARIFF_SINGAPORE_LADDER: readonly V1014_TRADE_DEPTH_TARIFF_SINGAPORERung[] = [
  { rung: 0, label: 'Singapore tier 0', rate: 0.0310, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.15 && ctx.diplomaticTrust < 70 },
  { rung: 1, label: 'Singapore tier 1', rate: 0.0460, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.17 && ctx.diplomaticTrust < 69 },
  { rung: 2, label: 'Singapore tier 2', rate: 0.0610, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.19 && ctx.diplomaticTrust < 68 },
  { rung: 3, label: 'Singapore tier 3', rate: 0.0760, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.21 && ctx.diplomaticTrust < 67 },
  { rung: 4, label: 'Singapore tier 4', rate: 0.0910, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.23 && ctx.diplomaticTrust < 66 },
  { rung: 5, label: 'Singapore tier 5', rate: 0.1060, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.25 && ctx.diplomaticTrust < 65 },
  { rung: 6, label: 'Singapore tier 6', rate: 0.1210, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.27 && ctx.diplomaticTrust < 64 },
  { rung: 7, label: 'Singapore tier 7', rate: 0.1360, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.29 && ctx.diplomaticTrust < 63 },
  { rung: 8, label: 'Singapore tier 8', rate: 0.1510, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.31 && ctx.diplomaticTrust < 62 },
  { rung: 9, label: 'Singapore tier 9', rate: 0.1660, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.33 && ctx.diplomaticTrust < 61 },
  { rung: 10, label: 'Singapore tier 10', rate: 0.1810, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.35 && ctx.diplomaticTrust < 60 },
  { rung: 11, label: 'Singapore tier 11', rate: 0.1960, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.37 && ctx.diplomaticTrust < 59 },
  { rung: 12, label: 'Singapore tier 12', rate: 0.2110, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.39 && ctx.diplomaticTrust < 58 },
  { rung: 13, label: 'Singapore tier 13', rate: 0.2260, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.41 && ctx.diplomaticTrust < 57 },
  { rung: 14, label: 'Singapore tier 14', rate: 0.2410, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.43 && ctx.diplomaticTrust < 56 },
  { rung: 15, label: 'Singapore tier 15', rate: 0.2560, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.45 && ctx.diplomaticTrust < 55 },
  { rung: 16, label: 'Singapore tier 16', rate: 0.2710, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.47 && ctx.diplomaticTrust < 54 },
  { rung: 17, label: 'Singapore tier 17', rate: 0.2860, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.49 && ctx.diplomaticTrust < 53 },
  { rung: 18, label: 'Singapore tier 18', rate: 0.3010, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.51 && ctx.diplomaticTrust < 52 },
  { rung: 19, label: 'Singapore tier 19', rate: 0.3160, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.53 && ctx.diplomaticTrust < 51 },
  { rung: 20, label: 'Singapore tier 20', rate: 0.3310, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.55 && ctx.diplomaticTrust < 50 },
  { rung: 21, label: 'Singapore tier 21', rate: 0.3460, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.57 && ctx.diplomaticTrust < 49 },
  { rung: 22, label: 'Singapore tier 22', rate: 0.3610, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.59 && ctx.diplomaticTrust < 48 },
  { rung: 23, label: 'Singapore tier 23', rate: 0.3760, triggerEscalationIf: (ctx) => ctx.tradeDeficitIndex > 0.61 && ctx.diplomaticTrust < 47 }
] as const;

export interface V1014_TRADE_DEPTH_TARIFF_SINGAPOREState {
  partnerId: typeof V1014_TRADE_DEPTH_TARIFF_SINGAPORE_PARTNER;
  currentRung: number;
  cooldownTurns: number;
  autoRetaliationEnabled: boolean;
  history: Array<{ turn: number; rung: number; reason: string }>;
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_initial(): V1014_TRADE_DEPTH_TARIFF_SINGAPOREState {
  return {
    partnerId: V1014_TRADE_DEPTH_TARIFF_SINGAPORE_PARTNER,
    currentRung: 0,
    cooldownTurns: 0,
    autoRetaliationEnabled: true,
    history: [],
  };
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_resolveRung(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): V1014_TRADE_DEPTH_TARIFF_SINGAPOREState {
  if (state.cooldownTurns > 0) {
    return { ...state, cooldownTurns: state.cooldownTurns - 1 };
  }
  let target = state.currentRung;
  for (const rung of V1014_TRADE_DEPTH_TARIFF_SINGAPORE_LADDER) {
    if (rung.rung <= state.currentRung) continue;
    if (rung.triggerEscalationIf(ctx)) target = rung.rung;
  }
  if (target === state.currentRung) return state;
  return {
    ...state,
    currentRung: target,
    cooldownTurns: 2 + (target % 3),
    history: [...state.history.slice(-40), { turn: ctx.turn, rung: target, reason: 'auto_escalation' }],
  };
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const rung = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_LADDER.find(r => r.rung === state.currentRung);
  return rung ? clampTradeDepth(rung.rate, 0, 0.95) : 0;
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_deescalate(state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState, steps: number): V1014_TRADE_DEPTH_TARIFF_SINGAPOREState {
  return {
    ...state,
    currentRung: Math.max(0, state.currentRung - Math.max(1, steps)),
    cooldownTurns: 3,
  };
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_00(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 0 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_01(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 1 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_02(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 2 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_03(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 3 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_04(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 4 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_05(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 5 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_06(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 6 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_07(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 7 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_08(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 8 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_09(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 9 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_10(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 10 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_11(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 11 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_12(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 12 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_13(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 13 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_14(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 14 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_15(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 15 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_16(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 16 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_17(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 17 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_18(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 18 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_19(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 19 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_20(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 20 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_21(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 21 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_22(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 22 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_23(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 23 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_24(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 24 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_25(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 25 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_26(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 26 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_27(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 27 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_28(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 28 * 0.0007, 0, 0.95);
}

export function V1014_TRADE_DEPTH_TARIFF_SINGAPORE_scenarioModifier_29(ctx: V1014TradeDepthTariffContext, state: V1014_TRADE_DEPTH_TARIFF_SINGAPOREState): number {
  const base = V1014_TRADE_DEPTH_TARIFF_SINGAPORE_effectiveRate(state);
  const trustFactor = clampTradeDepth(ctx.diplomaticTrust / 100, 0, 1);
  const deficitFactor = clampTradeDepth(ctx.tradeDeficitIndex, 0, 1);
  return clampTradeDepth(base + deficitFactor * 0.05 - trustFactor * 0.04 + 29 * 0.0007, 0, 0.95);
}
