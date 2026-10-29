/**
 * Sanctions package 010: composable export/financial measures with enforcement scoring.
 */
import { clampTradeDepth } from '../engine/trade-depth-utils';
import type { V1014TradeDepthSanctionsMeasure, V1014TradeDepthSanctionsState } from '../types/core';

export const V1014_TRADE_DEPTH_SANCTIONS_PKG_010_ID = 'sanctions_pkg_010' as const;

export const V1014_TRADE_DEPTH_SANCTIONS_PKG_010_MEASURES: readonly V1014TradeDepthSanctionsMeasure[] = [
    { id: 'measure_10_0', kind: 'export_control', severity: 1, targetSectors: ['sector_0'], complianceCost: 0.020 },
    { id: 'measure_10_1', kind: 'export_control', severity: 2, targetSectors: ['sector_1'], complianceCost: 0.028 },
    { id: 'measure_10_2', kind: 'export_control', severity: 3, targetSectors: ['sector_2'], complianceCost: 0.036 },
    { id: 'measure_10_3', kind: 'export_control', severity: 4, targetSectors: ['sector_3'], complianceCost: 0.044 },
    { id: 'measure_10_4', kind: 'export_control', severity: 5, targetSectors: ['sector_4'], complianceCost: 0.052 },
    { id: 'measure_10_5', kind: 'export_control', severity: 1, targetSectors: ['sector_5'], complianceCost: 0.060 },
    { id: 'measure_10_6', kind: 'export_control', severity: 2, targetSectors: ['sector_6'], complianceCost: 0.068 },
    { id: 'measure_10_7', kind: 'export_control', severity: 3, targetSectors: ['sector_0'], complianceCost: 0.076 },
    { id: 'measure_10_8', kind: 'export_control', severity: 4, targetSectors: ['sector_1'], complianceCost: 0.084 },
    { id: 'measure_10_9', kind: 'export_control', severity: 5, targetSectors: ['sector_2'], complianceCost: 0.092 },
    { id: 'measure_10_10', kind: 'export_control', severity: 1, targetSectors: ['sector_3'], complianceCost: 0.100 },
    { id: 'measure_10_11', kind: 'export_control', severity: 2, targetSectors: ['sector_4'], complianceCost: 0.108 },
    { id: 'measure_10_12', kind: 'export_control', severity: 3, targetSectors: ['sector_5'], complianceCost: 0.116 },
    { id: 'measure_10_13', kind: 'export_control', severity: 4, targetSectors: ['sector_6'], complianceCost: 0.124 },
    { id: 'measure_10_14', kind: 'export_control', severity: 5, targetSectors: ['sector_0'], complianceCost: 0.132 },
    { id: 'measure_10_15', kind: 'export_control', severity: 1, targetSectors: ['sector_1'], complianceCost: 0.140 },
    { id: 'measure_10_16', kind: 'export_control', severity: 2, targetSectors: ['sector_2'], complianceCost: 0.148 },
    { id: 'measure_10_17', kind: 'export_control', severity: 3, targetSectors: ['sector_3'], complianceCost: 0.156 },
    { id: 'measure_10_18', kind: 'export_control', severity: 4, targetSectors: ['sector_4'], complianceCost: 0.164 },
    { id: 'measure_10_19', kind: 'export_control', severity: 5, targetSectors: ['sector_5'], complianceCost: 0.172 }
] as const;

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_initial(turn: number): V1014TradeDepthSanctionsState {
  return {
    packageId: V1014_TRADE_DEPTH_SANCTIONS_PKG_010_ID,
    active: false,
    enforcementScore: 0,
    leakScore: 0.15,
    measuresApplied: [],
    startedTurn: turn,
    expiryTurn: null,
    waivers: [],
  };
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_activate(state: V1014TradeDepthSanctionsState, turn: number): V1014TradeDepthSanctionsState {
  return {
    ...state,
    active: true,
    startedTurn: turn,
    measuresApplied: V1014_TRADE_DEPTH_SANCTIONS_PKG_010_MEASURES.map(m => m.id),
    enforcementScore: clampTradeDepth(0.35 + (10 % 10) * 0.04, 0, 1),
  };
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_enforce(state: V1014TradeDepthSanctionsState, compliance: number): V1014TradeDepthSanctionsState {
  const c = clampTradeDepth(compliance, 0, 1);
  return {
    ...state,
    enforcementScore: clampTradeDepth(state.enforcementScore * 0.7 + c * 0.3, 0, 1),
    leakScore: clampTradeDepth(state.leakScore + (1 - c) * 0.04, 0, 1),
  };
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade(): number {
  return clampTradeDepth(0.08 + (10 % 7) * 0.015, 0, 0.75);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_00(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 0 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_01(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 1 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_02(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 2 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_03(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 3 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_04(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 4 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_05(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 5 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_06(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 6 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_07(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 7 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_08(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 8 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_09(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 9 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_10(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 10 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_11(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 11 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_12(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 12 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_13(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 13 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_14(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 14 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_15(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 15 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_16(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 16 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_17(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 17 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_18(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 18 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_19(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 19 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_20(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 20 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_21(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 21 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_22(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 22 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_23(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 23 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_24(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 24 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_25(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 25 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_26(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 26 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_27(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 27 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_28(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 28 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_29(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 29 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_30(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 30 * 0.002, 0, 1);
}

export function V1014_TRADE_DEPTH_SANCTIONS_PKG_010_retaliationRule_31(
  state: V1014TradeDepthSanctionsState,
  counterpartyStrength: number,
): number {
  const s = clampTradeDepth(counterpartyStrength, 0, 1);
  if (!state.active) return 0;
  return clampTradeDepth(V1014_TRADE_DEPTH_SANCTIONS_PKG_010_pressureOnTrade() * (0.5 + s * 0.5) + state.leakScore * 0.1 + 31 * 0.002, 0, 1);
}
