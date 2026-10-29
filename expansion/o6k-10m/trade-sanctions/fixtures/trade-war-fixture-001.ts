/**
 * Deterministic trade-war escalation fixture 001 for LAB / self-tests.
 */
import type { V1014TradeDepthTurnInput, V1014TradeDepthTurnResult } from '../types/core';
import { runV1014TradeDepthTurn } from '../engine/trade-depth-orchestrator';

export const V1014_TRADE_DEPTH_FIXTURE_001_SEED = 1001;

export function V1014_TRADE_DEPTH_FIXTURE_001_buildInput(turn: number): V1014TradeDepthTurnInput {
  return {
    turn,
    seed: V1014_TRADE_DEPTH_FIXTURE_001_SEED,
    gtelAccessBand: turn % 4 === 0 ? 'restricted' : 'normal',
    diplomacyTrust: 62 - (turn % 7) * 3,
    tradeDeficitIndex: 0.18 + (turn % 5) * 0.04,
    fiscalPressureBand: turn > 8 ? 'stressed' : 'healthy',
    householdSentiment: 0.58 - turn * 0.01,
    investmentClimateScore: 54 - turn,
    counterpartySanctionsActive: turn >= 3 && turn <= 12,
    bilateralPairIds: ['asia_pacific__china', 'europe__north_america'],
    activeSanctionPackages: turn >= 5 ? ['sanctions_pkg_001'] : [],
    capitalRegimeIds: ['capital_asia_pacific_01'],
  };
}

export function V1014_TRADE_DEPTH_FIXTURE_001_runTurns(count: number): V1014TradeDepthTurnResult[] {
  const out: V1014TradeDepthTurnResult[] = [];
  let persisted = null as V1014TradeDepthTurnResult['persisted'] | null;
  for (let t = 1; t <= count; t++) {
    const input = V1014_TRADE_DEPTH_FIXTURE_001_buildInput(t);
    const r = runV1014TradeDepthTurn({ ...input, persisted });
    persisted = r.persisted;
    out.push(r);
  }
  return out;
}

export function V1014_TRADE_DEPTH_FIXTURE_001_expectMonotonicEscalation(): boolean {
  const trace = V1014_TRADE_DEPTH_FIXTURE_001_runTurns(6);
  const pressures = trace.map(r => r.state.aggregateTariffPressure);
  return pressures[pressures.length - 1] >= pressures[0];
}
