/**
 * Turn orchestrator — runs after §11A day pipeline, before household demand tick (T6-6).
 */
import type {
  V1014TradeDepthPersisted,
  V1014TradeDepthTurnInput,
  V1014TradeDepthTurnResult,
  V1014TradeDepthRuntimeState,
} from '../types/core';
import {
  clampTradeDepth,
  tradeDepthHash,
  tradeDepthMixSeed,
  tradeDepthAccessRank,
} from '../engine/trade-depth-utils';
import {
  createEmptyV1014TradeDepthPersisted,
  sanitizeV1014TradeDepthPersisted,
} from '../persistence/migrations';
import { buildV1014TradeDepthAiBriefing } from '../ai/diplomatic-read-adapters';
import { applyV1014TradeDepthGtelBridge } from '../adapters/adapter-20at-gtel';
import { readV1014TradeDepthDiplomacySlice } from '../adapters/adapter-20h-diplomacy';
import { computeV1014TradeDepthInvestmentDelta } from '../adapters/adapter-20ab-investment';
import { computeV1014TradeDepthFiscalBridge } from '../adapters/adapter-20ae-fiscal';
import { computeV1014TradeDepthHouseholdBridge } from '../adapters/adapter-20af-household';

export function v1014TradeDepthInputHash(input: V1014TradeDepthTurnInput): string {
  return tradeDepthHash({
    turn: input.turn,
    seed: input.seed,
    gtel: input.gtelAccessBand,
    trust: input.diplomacyTrust,
    deficit: input.tradeDeficitIndex,
    fiscal: input.fiscalPressureBand,
    pairs: input.bilateralPairIds,
    sanctions: input.activeSanctionPackages,
  });
}

export function runV1014TradeDepthTurn(input: V1014TradeDepthTurnInput): V1014TradeDepthTurnResult {
  const persisted = sanitizeV1014TradeDepthPersisted(
    input.persisted ?? createEmptyV1014TradeDepthPersisted(),
    input.turn,
  );

  const diplomacy = readV1014TradeDepthDiplomacySlice(input);
  const mix = tradeDepthMixSeed(input.seed, input.turn, 'trade_depth_orchestrator');

  let aggregateTariff = clampTradeDepth(
    input.tradeDeficitIndex * 0.35 + (100 - input.diplomacyTrust) * 0.004 + mix * 0.08,
    0,
    1,
  );
  if (input.counterpartySanctionsActive) aggregateTariff = clampTradeDepth(aggregateTariff + 0.12, 0, 1);

  const sanctionsPressure = clampTradeDepth(
    input.activeSanctionPackages.length * 0.09 + (input.counterpartySanctionsActive ? 0.14 : 0),
    0,
    1,
  );

  const capitalFlight = clampTradeDepth(
    aggregateTariff * 0.4 + sanctionsPressure * 0.25 + (input.fiscalPressureBand === 'critical' ? 0.2 : 0.05),
    0,
    1,
  );

  const remittanceShock = clampTradeDepth(capitalFlight * 0.55 + mix * 0.1, 0, 1);

  const gtelBridge = applyV1014TradeDepthGtelBridge(input, aggregateTariff);
  const investment = computeV1014TradeDepthInvestmentDelta(input, aggregateTariff, sanctionsPressure);
  const fiscal = computeV1014TradeDepthFiscalBridge(input, aggregateTariff, sanctionsPressure);
  const household = computeV1014TradeDepthHouseholdBridge(input, remittanceShock, aggregateTariff);

  const state: V1014TradeDepthRuntimeState = {
    turn: input.turn,
    aggregateTariffPressure: aggregateTariff,
    aggregateSanctionsPressure: sanctionsPressure,
    capitalFlightIndex: capitalFlight,
    remittanceShockIndex: remittanceShock,
    householdConsumptionDrag: household.consumptionMultiplier,
    fiscalStressContribution: fiscal.expenditurePressure,
    investmentClimateDrag: investment.scoreDelta,
    gtelAccessHint: gtelBridge.accessBand,
    diplomaticBriefing: buildV1014TradeDepthAiBriefing(input, diplomacy, statePreview(aggregateTariff, sanctionsPressure)),
    inputHash: v1014TradeDepthInputHash(input),
  };

  const nextPersisted: V1014TradeDepthPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastProcessedTurn: input.turn,
    tariffRungs: {
      ...persisted.tariffRungs,
      global: Math.round(aggregateTariff * 100),
    },
    activePackages: [...input.activeSanctionPackages],
    aiReadCache: {
      ...persisted.aiReadCache,
      [`turn_${input.turn}`]: state.diplomaticBriefing.slice(0, 240),
    },
  };

  input.bilateralPairIds.forEach(pairId => {
    nextPersisted.bilateralSnapshots[pairId] = {
      phase: aggregateTariff > 0.5 ? 'escalating' : 'active',
      trustScore: clampTradeDepth(input.diplomacyTrust - aggregateTariff * 20, 0, 100),
      tariffPressure: aggregateTariff,
    };
  });

  const worldEvents =
    aggregateTariff > 0.45
      ? [
          {
            id: `td_evt_${input.turn}`,
            turn: input.turn,
            kind: 'trade' as const,
            title: 'Trade pressure elevated',
            summary: `Tariff index ${aggregateTariff.toFixed(2)}; GTEL band ${gtelBridge.accessBand}.`,
          },
        ]
      : [];

  if (sanctionsPressure > 0.35) {
    worldEvents.push({
      id: `td_san_${input.turn}`,
      turn: input.turn,
      kind: 'sanctions',
      title: 'Sanctions envelope tightened',
      summary: `${input.activeSanctionPackages.length} packages active; enforcement coupling on.`,
    });
  }

  if (capitalFlight > 0.5) {
    worldEvents.push({
      id: `td_cap_${input.turn}`,
      turn: input.turn,
      kind: 'capital',
      title: 'Capital flight risk',
      summary: `Flight index ${capitalFlight.toFixed(2)}; remittance shock ${remittanceShock.toFixed(2)}.`,
    });
  }

  void tradeDepthAccessRank(input.gtelAccessBand);

  return { state, persisted: nextPersisted, worldEvents };
}

function statePreview(tariff: number, sanctions: number): { tariff: number; sanctions: number } {
  return { tariff, sanctions };
}

export { createEmptyV1014TradeDepthPersisted, sanitizeV1014TradeDepthPersisted };
