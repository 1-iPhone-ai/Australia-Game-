/** Bilateral deal state machine: North America ↔ European Union aggregate (T6-6 shard 07). */
import type { V1014TradeDepthBilateralContext, V1014TradeDepthDealPhase } from '../types/core';
import { clampTradeDepth, tradeDepthHash } from '../engine/trade-depth-utils';

export const V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_PAIR_ID = 'north_america__europe' as const;

export interface V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState {
  pairId: typeof V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_PAIR_ID;
  phase: V1014TradeDepthDealPhase;
  trustScore: number;
  tariffPressure: number;
  sanctionsIntensity: number;
  capitalControlLeakage: number;
  lastTransitionTurn: number;
  retaliationDebt: number;
  evidence: string[];
}

export const V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_TRANSITIONS = [
  { from: 'dormant', event: 'advance_turn', to: 'scoping', guard: (ctx) => ctx.turn >= 7 && ctx.trustScore >= 10 },
  { from: 'scoping', event: 'advance_turn', to: 'negotiating', guard: (ctx) => ctx.turn >= 8 && ctx.trustScore >= 11 },
  { from: 'negotiating', event: 'advance_turn', to: 'ratifying', guard: (ctx) => ctx.turn >= 9 && ctx.trustScore >= 12 },
  { from: 'ratifying', event: 'advance_turn', to: 'active', guard: (ctx) => ctx.turn >= 10 && ctx.trustScore >= 13 },
  { from: 'active', event: 'advance_turn', to: 'review', guard: (ctx) => ctx.turn >= 11 && ctx.trustScore >= 14 },
  { from: 'review', event: 'advance_turn', to: 'escalating', guard: (ctx) => ctx.turn >= 12 && ctx.trustScore >= 15 },
  { from: 'escalating', event: 'advance_turn', to: 'retaliating', guard: (ctx) => ctx.turn >= 13 && ctx.trustScore >= 16 },
  { from: 'retaliating', event: 'advance_turn', to: 'cooling', guard: (ctx) => ctx.turn >= 14 && ctx.trustScore >= 17 },
  { from: 'cooling', event: 'advance_turn', to: 'suspended', guard: (ctx) => ctx.turn >= 15 && ctx.trustScore >= 18 },
  { from: 'suspended', event: 'advance_turn', to: 'terminated', guard: (ctx) => ctx.turn >= 16 && ctx.trustScore >= 19 },
  { from: 'terminated', event: 'advance_turn', to: 'dormant', guard: (ctx) => ctx.turn >= 17 && ctx.trustScore >= 20 }
] as const;

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_initialState(turn: number): V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState {
  return {
    pairId: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_PAIR_ID,
    phase: 'dormant',
    trustScore: 55 + (7 % 7),
    tariffPressure: 0.12 + (7 * 0.003),
    sanctionsIntensity: 0,
    capitalControlLeakage: 0.04,
    lastTransitionTurn: turn,
    retaliationDebt: 0,
    evidence: ['init:north_america:europe'],
  };
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_applyRetaliation(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, magnitude: number): V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState {
  const m = clampTradeDepth(magnitude, 0, 1);
  return {
    ...state,
    phase: m > 0.55 ? 'retaliating' : 'escalating',
    trustScore: clampTradeDepth(state.trustScore - m * 22, 0, 100),
    tariffPressure: clampTradeDepth(state.tariffPressure + m * 0.18, 0, 1),
    retaliationDebt: state.retaliationDebt + m * 8,
    evidence: [...state.evidence.slice(-12), `retaliation:${m.toFixed(3)}`],
  };
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_tick(
  state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState,
  ctx: V1014TradeDepthBilateralContext,
): { state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState; events: string[] } {
  let next = { ...state };
  const events: string[] = [];
  for (const tr of V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_TRANSITIONS) {
    if (next.phase !== tr.from) continue;
    if (!tr.guard({ ...ctx, trustScore: next.trustScore })) continue;
    next = { ...next, phase: tr.to as V1014TradeDepthDealPhase, lastTransitionTurn: ctx.turn };
    events.push(`${tr.from}->${tr.to}@${ctx.turn}`);
    break;
  }
  const tradeVolume = ctx.baselineVolume * (1 - next.tariffPressure * 0.6);
  next.trustScore = clampTradeDepth(
    next.trustScore + (tradeVolume > ctx.baselineVolume * 0.7 ? 0.4 : -0.9),
    0,
    100,
  );
  if (ctx.counterpartySanctionsActive) {
    next = V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_applyRetaliation(next, 0.15 + (7 % 5) * 0.02);
    events.push('auto_retaliation');
  }
  next.evidence = [...next.evidence.slice(-14), tradeDepthHash({ pair: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_PAIR_ID, turn: ctx.turn, vol: tradeVolume })];
  return { state: next, events };
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_exportPressure(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState): number {
  return clampTradeDepth(
    state.tariffPressure * 0.5 + state.sanctionsIntensity * 0.35 + state.retaliationDebt * 0.02,
    0,
    1,
  );
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_commodityTariff_iron_ore(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, baseRate: number): number {
  const bias = (7 % 9) * 0.004;
  const phaseMul = state.phase === 'active' ? 0.85 : state.phase === 'retaliating' ? 1.35 : 1;
  return clampTradeDepth(baseRate * phaseMul + state.tariffPressure * 0.2 + bias, 0, 0.95);
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_commodityTariff_coal(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, baseRate: number): number {
  const bias = (8 % 9) * 0.004;
  const phaseMul = state.phase === 'active' ? 0.85 : state.phase === 'retaliating' ? 1.35 : 1;
  return clampTradeDepth(baseRate * phaseMul + state.tariffPressure * 0.2 + bias, 0, 0.95);
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_commodityTariff_lng(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, baseRate: number): number {
  const bias = (9 % 9) * 0.004;
  const phaseMul = state.phase === 'active' ? 0.85 : state.phase === 'retaliating' ? 1.35 : 1;
  return clampTradeDepth(baseRate * phaseMul + state.tariffPressure * 0.2 + bias, 0, 0.95);
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_commodityTariff_wheat(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, baseRate: number): number {
  const bias = (10 % 9) * 0.004;
  const phaseMul = state.phase === 'active' ? 0.85 : state.phase === 'retaliating' ? 1.35 : 1;
  return clampTradeDepth(baseRate * phaseMul + state.tariffPressure * 0.2 + bias, 0, 0.95);
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_commodityTariff_beef(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, baseRate: number): number {
  const bias = (11 % 9) * 0.004;
  const phaseMul = state.phase === 'active' ? 0.85 : state.phase === 'retaliating' ? 1.35 : 1;
  return clampTradeDepth(baseRate * phaseMul + state.tariffPressure * 0.2 + bias, 0, 0.95);
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_commodityTariff_aluminium(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, baseRate: number): number {
  const bias = (12 % 9) * 0.004;
  const phaseMul = state.phase === 'active' ? 0.85 : state.phase === 'retaliating' ? 1.35 : 1;
  return clampTradeDepth(baseRate * phaseMul + state.tariffPressure * 0.2 + bias, 0, 0.95);
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_commodityTariff_services(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, baseRate: number): number {
  const bias = (13 % 9) * 0.004;
  const phaseMul = state.phase === 'active' ? 0.85 : state.phase === 'retaliating' ? 1.35 : 1;
  return clampTradeDepth(baseRate * phaseMul + state.tariffPressure * 0.2 + bias, 0, 0.95);
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_commodityTariff_manufacturing(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, baseRate: number): number {
  const bias = (14 % 9) * 0.004;
  const phaseMul = state.phase === 'active' ? 0.85 : state.phase === 'retaliating' ? 1.35 : 1;
  return clampTradeDepth(baseRate * phaseMul + state.tariffPressure * 0.2 + bias, 0, 0.95);
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_historyReducer_00(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, event: string): V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState {
  const delta = event.includes('escalation') ? 0.04 : event.includes('cooling') ? -0.03 : 0;
  return { ...state, tariffPressure: clampTradeDepth(state.tariffPressure + delta + 0 * 0.0001, 0, 1) };
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_historyReducer_01(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, event: string): V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState {
  const delta = event.includes('escalation') ? 0.04 : event.includes('cooling') ? -0.03 : 0;
  return { ...state, tariffPressure: clampTradeDepth(state.tariffPressure + delta + 1 * 0.0001, 0, 1) };
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_historyReducer_02(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, event: string): V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState {
  const delta = event.includes('escalation') ? 0.04 : event.includes('cooling') ? -0.03 : 0;
  return { ...state, tariffPressure: clampTradeDepth(state.tariffPressure + delta + 2 * 0.0001, 0, 1) };
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_historyReducer_03(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, event: string): V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState {
  const delta = event.includes('escalation') ? 0.04 : event.includes('cooling') ? -0.03 : 0;
  return { ...state, tariffPressure: clampTradeDepth(state.tariffPressure + delta + 3 * 0.0001, 0, 1) };
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_historyReducer_04(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, event: string): V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState {
  const delta = event.includes('escalation') ? 0.04 : event.includes('cooling') ? -0.03 : 0;
  return { ...state, tariffPressure: clampTradeDepth(state.tariffPressure + delta + 4 * 0.0001, 0, 1) };
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_historyReducer_05(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, event: string): V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState {
  const delta = event.includes('escalation') ? 0.04 : event.includes('cooling') ? -0.03 : 0;
  return { ...state, tariffPressure: clampTradeDepth(state.tariffPressure + delta + 5 * 0.0001, 0, 1) };
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_historyReducer_06(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, event: string): V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState {
  const delta = event.includes('escalation') ? 0.04 : event.includes('cooling') ? -0.03 : 0;
  return { ...state, tariffPressure: clampTradeDepth(state.tariffPressure + delta + 6 * 0.0001, 0, 1) };
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_historyReducer_07(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, event: string): V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState {
  const delta = event.includes('escalation') ? 0.04 : event.includes('cooling') ? -0.03 : 0;
  return { ...state, tariffPressure: clampTradeDepth(state.tariffPressure + delta + 7 * 0.0001, 0, 1) };
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_historyReducer_08(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, event: string): V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState {
  const delta = event.includes('escalation') ? 0.04 : event.includes('cooling') ? -0.03 : 0;
  return { ...state, tariffPressure: clampTradeDepth(state.tariffPressure + delta + 8 * 0.0001, 0, 1) };
}

export function V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPE_historyReducer_09(state: V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState, event: string): V1014_TRADE_DEPTH_BILAT_NORTH_AMERICA_EUROPEState {
  const delta = event.includes('escalation') ? 0.04 : event.includes('cooling') ? -0.03 : 0;
  return { ...state, tariffPressure: clampTradeDepth(state.tariffPressure + delta + 9 * 0.0001, 0, 1) };
}
