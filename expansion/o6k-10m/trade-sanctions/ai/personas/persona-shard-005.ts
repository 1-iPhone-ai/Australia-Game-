/** AI diplomatic read shard 005 — persona-specific trade interpretations. */
import { clampTradeDepth } from '../engine/trade-depth-utils';
import type { V1014TradeDepthTurnInput } from '../types/core';

export const V1014_TRADE_DEPTH_AI_PERSONA_005_PERSONAS = ['economic', 'aggressive', 'cooperative', 'balanced', 'opportunistic'] as const;

export function V1014_TRADE_DEPTH_AI_PERSONA_005_interpret(input: V1014TradeDepthTurnInput, persona: string): string {
  const t = input.tradeDeficitIndex;
  const base = `persona=${persona} turn=${input.turn} deficit=${t.toFixed(2)}`;
  return base + ' ' + persona.slice(0, 3) + '_5';
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_00(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.00 + sanctions * 0.800 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_01(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.01 + sanctions * 0.808 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_02(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.02 + sanctions * 0.816 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_03(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.03 + sanctions * 0.824 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_04(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.04 + sanctions * 0.832 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_05(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.05 + sanctions * 0.840 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_06(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.06 + sanctions * 0.848 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_07(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.07 + sanctions * 0.856 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_08(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.08 + sanctions * 0.864 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_09(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.09 + sanctions * 0.872 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_10(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.10 + sanctions * 0.880 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_11(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.11 + sanctions * 0.888 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_12(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.12 + sanctions * 0.896 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_13(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.13 + sanctions * 0.904 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_14(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.14 + sanctions * 0.912 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_15(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.15 + sanctions * 0.920 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_16(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.16 + sanctions * 0.928 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_economic_score_17(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.17 + sanctions * 0.936 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_00(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.00 + sanctions * 0.800 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_01(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.01 + sanctions * 0.808 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_02(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.02 + sanctions * 0.816 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_03(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.03 + sanctions * 0.824 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_04(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.04 + sanctions * 0.832 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_05(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.05 + sanctions * 0.840 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_06(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.06 + sanctions * 0.848 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_07(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.07 + sanctions * 0.856 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_08(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.08 + sanctions * 0.864 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_09(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.09 + sanctions * 0.872 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_10(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.10 + sanctions * 0.880 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_11(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.11 + sanctions * 0.888 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_12(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.12 + sanctions * 0.896 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_13(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.13 + sanctions * 0.904 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_14(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.14 + sanctions * 0.912 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_15(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.15 + sanctions * 0.920 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_16(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.16 + sanctions * 0.928 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_aggressive_score_17(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.17 + sanctions * 0.936 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_00(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.00 + sanctions * 0.800 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_01(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.01 + sanctions * 0.808 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_02(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.02 + sanctions * 0.816 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_03(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.03 + sanctions * 0.824 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_04(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.04 + sanctions * 0.832 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_05(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.05 + sanctions * 0.840 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_06(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.06 + sanctions * 0.848 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_07(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.07 + sanctions * 0.856 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_08(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.08 + sanctions * 0.864 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_09(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.09 + sanctions * 0.872 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_10(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.10 + sanctions * 0.880 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_11(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.11 + sanctions * 0.888 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_12(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.12 + sanctions * 0.896 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_13(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.13 + sanctions * 0.904 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_14(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.14 + sanctions * 0.912 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_15(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.15 + sanctions * 0.920 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_16(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.16 + sanctions * 0.928 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_cooperative_score_17(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.17 + sanctions * 0.936 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_00(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.00 + sanctions * 0.800 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_01(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.01 + sanctions * 0.808 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_02(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.02 + sanctions * 0.816 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_03(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.03 + sanctions * 0.824 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_04(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.04 + sanctions * 0.832 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_05(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.05 + sanctions * 0.840 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_06(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.06 + sanctions * 0.848 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_07(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.07 + sanctions * 0.856 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_08(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.08 + sanctions * 0.864 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_09(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.09 + sanctions * 0.872 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_10(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.10 + sanctions * 0.880 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_11(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.11 + sanctions * 0.888 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_12(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.12 + sanctions * 0.896 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_13(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.13 + sanctions * 0.904 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_14(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.14 + sanctions * 0.912 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_15(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.15 + sanctions * 0.920 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_16(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.16 + sanctions * 0.928 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_balanced_score_17(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.17 + sanctions * 0.936 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_00(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.00 + sanctions * 0.800 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_01(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.01 + sanctions * 0.808 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_02(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.02 + sanctions * 0.816 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_03(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.03 + sanctions * 0.824 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_04(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.04 + sanctions * 0.832 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_05(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.05 + sanctions * 0.840 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_06(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.06 + sanctions * 0.848 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_07(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.07 + sanctions * 0.856 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_08(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.08 + sanctions * 0.864 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_09(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.09 + sanctions * 0.872 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_10(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.10 + sanctions * 0.880 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_11(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.11 + sanctions * 0.888 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_12(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.12 + sanctions * 0.896 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_13(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.13 + sanctions * 0.904 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_14(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.14 + sanctions * 0.912 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_15(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.15 + sanctions * 0.920 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_16(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.16 + sanctions * 0.928 + 5 * 0.001, 0, 2);
}

export function V1014_TRADE_DEPTH_AI_PERSONA_005_opportunistic_score_17(tariff: number, sanctions: number): number {
  return clampTradeDepth(tariff * 1.17 + sanctions * 0.936 + 5 * 0.001, 0, 2);
}
