/**
 * LAB suite: v1014_trade_depth — ≥40 deterministic trade-war escalation fixtures.
 * Register before SECTION 21B via runV1014TradeDepthSelfTests().
 */
import type { V1014TradeDepthSelfTestResult, V1014TradeDepthTurnInput } from '../types/core';
import {
  runV1014TradeDepthTurn,
  createEmptyV1014TradeDepthPersisted,
  v1014TradeDepthInputHash,
} from '../engine/trade-depth-orchestrator';
import { V1014_TRADE_DEPTH_SCHEMA_VERSION } from '../types/core';
import { clampTradeDepth } from '../engine/trade-depth-utils';
import { applyV1014TradeDepthGtelBridge } from '../adapters/adapter-20at-gtel';
import { readV1014TradeDepthDiplomacySlice } from '../adapters/adapter-20h-diplomacy';
import { computeV1014TradeDepthInvestmentDelta } from '../adapters/adapter-20ab-investment';
import { computeV1014TradeDepthFiscalBridge } from '../adapters/adapter-20ae-fiscal';
import { computeV1014TradeDepthHouseholdBridge } from '../adapters/adapter-20af-household';
import { sanitizeV1014TradeDepthPersisted } from '../persistence/migrations';

function baseInput(overrides: Partial<V1014TradeDepthTurnInput> = {}): V1014TradeDepthTurnInput {
  return {
    turn: 1,
    seed: 4242,
    gtelAccessBand: 'normal',
    diplomacyTrust: 60,
    tradeDeficitIndex: 0.2,
    fiscalPressureBand: 'healthy',
    householdSentiment: 0.55,
    investmentClimateScore: 52,
    counterpartySanctionsActive: false,
    bilateralPairIds: ['asia_pacific__china'],
    activeSanctionPackages: [],
    capitalRegimeIds: [],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1014TradeDepthSelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1014TradeDepthSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  results: V1014TradeDepthSelfTestResult[];
} {
  const results: V1014TradeDepthSelfTestResult[] = [];

  {
    const inp1 = baseInput({ turn: 1, seed: 1001, tradeDeficitIndex: 0.12, counterpartySanctionsActive: false });
    const r1 = runV1014TradeDepthTurn(inp1);
    check(results, 'v1014_td_01', 'trade depth turn 1 produces hash', r1.state.inputHash.length > 8);
    check(results, 'v1014_td_01b', 'trade depth turn 1 schema persisted', r1.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_01c', 'trade depth turn 1 tariff bounded', r1.state.aggregateTariffPressure >= 0 && r1.state.aggregateTariffPressure <= 1);
  }
  {
    const inp2 = baseInput({ turn: 2, seed: 1002, tradeDeficitIndex: 0.14, counterpartySanctionsActive: false });
    const r2 = runV1014TradeDepthTurn(inp2);
    check(results, 'v1014_td_02', 'trade depth turn 2 produces hash', r2.state.inputHash.length > 8);
    check(results, 'v1014_td_02b', 'trade depth turn 2 schema persisted', r2.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_02c', 'trade depth turn 2 tariff bounded', r2.state.aggregateTariffPressure >= 0 && r2.state.aggregateTariffPressure <= 1);
  }
  {
    const inp3 = baseInput({ turn: 3, seed: 1003, tradeDeficitIndex: 0.16, counterpartySanctionsActive: true });
    const r3 = runV1014TradeDepthTurn(inp3);
    check(results, 'v1014_td_03', 'trade depth turn 3 produces hash', r3.state.inputHash.length > 8);
    check(results, 'v1014_td_03b', 'trade depth turn 3 schema persisted', r3.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_03c', 'trade depth turn 3 tariff bounded', r3.state.aggregateTariffPressure >= 0 && r3.state.aggregateTariffPressure <= 1);
  }
  {
    const inp4 = baseInput({ turn: 4, seed: 1004, tradeDeficitIndex: 0.18, counterpartySanctionsActive: false });
    const r4 = runV1014TradeDepthTurn(inp4);
    check(results, 'v1014_td_04', 'trade depth turn 4 produces hash', r4.state.inputHash.length > 8);
    check(results, 'v1014_td_04b', 'trade depth turn 4 schema persisted', r4.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_04c', 'trade depth turn 4 tariff bounded', r4.state.aggregateTariffPressure >= 0 && r4.state.aggregateTariffPressure <= 1);
  }
  {
    const inp5 = baseInput({ turn: 5, seed: 1005, tradeDeficitIndex: 0.20, counterpartySanctionsActive: false });
    const r5 = runV1014TradeDepthTurn(inp5);
    check(results, 'v1014_td_05', 'trade depth turn 5 produces hash', r5.state.inputHash.length > 8);
    check(results, 'v1014_td_05b', 'trade depth turn 5 schema persisted', r5.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_05c', 'trade depth turn 5 tariff bounded', r5.state.aggregateTariffPressure >= 0 && r5.state.aggregateTariffPressure <= 1);
  }
  {
    const inp6 = baseInput({ turn: 6, seed: 1006, tradeDeficitIndex: 0.22, counterpartySanctionsActive: true });
    const r6 = runV1014TradeDepthTurn(inp6);
    check(results, 'v1014_td_06', 'trade depth turn 6 produces hash', r6.state.inputHash.length > 8);
    check(results, 'v1014_td_06b', 'trade depth turn 6 schema persisted', r6.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_06c', 'trade depth turn 6 tariff bounded', r6.state.aggregateTariffPressure >= 0 && r6.state.aggregateTariffPressure <= 1);
  }
  {
    const inp7 = baseInput({ turn: 7, seed: 1007, tradeDeficitIndex: 0.24, counterpartySanctionsActive: false });
    const r7 = runV1014TradeDepthTurn(inp7);
    check(results, 'v1014_td_07', 'trade depth turn 7 produces hash', r7.state.inputHash.length > 8);
    check(results, 'v1014_td_07b', 'trade depth turn 7 schema persisted', r7.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_07c', 'trade depth turn 7 tariff bounded', r7.state.aggregateTariffPressure >= 0 && r7.state.aggregateTariffPressure <= 1);
  }
  {
    const inp8 = baseInput({ turn: 8, seed: 1008, tradeDeficitIndex: 0.26, counterpartySanctionsActive: false });
    const r8 = runV1014TradeDepthTurn(inp8);
    check(results, 'v1014_td_08', 'trade depth turn 8 produces hash', r8.state.inputHash.length > 8);
    check(results, 'v1014_td_08b', 'trade depth turn 8 schema persisted', r8.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_08c', 'trade depth turn 8 tariff bounded', r8.state.aggregateTariffPressure >= 0 && r8.state.aggregateTariffPressure <= 1);
  }
  {
    const inp9 = baseInput({ turn: 9, seed: 1009, tradeDeficitIndex: 0.28, counterpartySanctionsActive: true });
    const r9 = runV1014TradeDepthTurn(inp9);
    check(results, 'v1014_td_09', 'trade depth turn 9 produces hash', r9.state.inputHash.length > 8);
    check(results, 'v1014_td_09b', 'trade depth turn 9 schema persisted', r9.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_09c', 'trade depth turn 9 tariff bounded', r9.state.aggregateTariffPressure >= 0 && r9.state.aggregateTariffPressure <= 1);
  }
  {
    const inp10 = baseInput({ turn: 10, seed: 1010, tradeDeficitIndex: 0.10, counterpartySanctionsActive: false });
    const r10 = runV1014TradeDepthTurn(inp10);
    check(results, 'v1014_td_10', 'trade depth turn 10 produces hash', r10.state.inputHash.length > 8);
    check(results, 'v1014_td_10b', 'trade depth turn 10 schema persisted', r10.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_10c', 'trade depth turn 10 tariff bounded', r10.state.aggregateTariffPressure >= 0 && r10.state.aggregateTariffPressure <= 1);
  }
  {
    const inp11 = baseInput({ turn: 11, seed: 1011, tradeDeficitIndex: 0.12, counterpartySanctionsActive: false });
    const r11 = runV1014TradeDepthTurn(inp11);
    check(results, 'v1014_td_11', 'trade depth turn 11 produces hash', r11.state.inputHash.length > 8);
    check(results, 'v1014_td_11b', 'trade depth turn 11 schema persisted', r11.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_11c', 'trade depth turn 11 tariff bounded', r11.state.aggregateTariffPressure >= 0 && r11.state.aggregateTariffPressure <= 1);
  }
  {
    const inp12 = baseInput({ turn: 12, seed: 1012, tradeDeficitIndex: 0.14, counterpartySanctionsActive: true });
    const r12 = runV1014TradeDepthTurn(inp12);
    check(results, 'v1014_td_12', 'trade depth turn 12 produces hash', r12.state.inputHash.length > 8);
    check(results, 'v1014_td_12b', 'trade depth turn 12 schema persisted', r12.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_12c', 'trade depth turn 12 tariff bounded', r12.state.aggregateTariffPressure >= 0 && r12.state.aggregateTariffPressure <= 1);
  }
  {
    const inp13 = baseInput({ turn: 13, seed: 1013, tradeDeficitIndex: 0.16, counterpartySanctionsActive: false });
    const r13 = runV1014TradeDepthTurn(inp13);
    check(results, 'v1014_td_13', 'trade depth turn 13 produces hash', r13.state.inputHash.length > 8);
    check(results, 'v1014_td_13b', 'trade depth turn 13 schema persisted', r13.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_13c', 'trade depth turn 13 tariff bounded', r13.state.aggregateTariffPressure >= 0 && r13.state.aggregateTariffPressure <= 1);
  }
  {
    const inp14 = baseInput({ turn: 14, seed: 1014, tradeDeficitIndex: 0.18, counterpartySanctionsActive: false });
    const r14 = runV1014TradeDepthTurn(inp14);
    check(results, 'v1014_td_14', 'trade depth turn 14 produces hash', r14.state.inputHash.length > 8);
    check(results, 'v1014_td_14b', 'trade depth turn 14 schema persisted', r14.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_14c', 'trade depth turn 14 tariff bounded', r14.state.aggregateTariffPressure >= 0 && r14.state.aggregateTariffPressure <= 1);
  }
  {
    const inp15 = baseInput({ turn: 15, seed: 1015, tradeDeficitIndex: 0.20, counterpartySanctionsActive: true });
    const r15 = runV1014TradeDepthTurn(inp15);
    check(results, 'v1014_td_15', 'trade depth turn 15 produces hash', r15.state.inputHash.length > 8);
    check(results, 'v1014_td_15b', 'trade depth turn 15 schema persisted', r15.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_15c', 'trade depth turn 15 tariff bounded', r15.state.aggregateTariffPressure >= 0 && r15.state.aggregateTariffPressure <= 1);
  }
  {
    const inp16 = baseInput({ turn: 16, seed: 1016, tradeDeficitIndex: 0.22, counterpartySanctionsActive: false });
    const r16 = runV1014TradeDepthTurn(inp16);
    check(results, 'v1014_td_16', 'trade depth turn 16 produces hash', r16.state.inputHash.length > 8);
    check(results, 'v1014_td_16b', 'trade depth turn 16 schema persisted', r16.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_16c', 'trade depth turn 16 tariff bounded', r16.state.aggregateTariffPressure >= 0 && r16.state.aggregateTariffPressure <= 1);
  }
  {
    const inp17 = baseInput({ turn: 17, seed: 1017, tradeDeficitIndex: 0.24, counterpartySanctionsActive: false });
    const r17 = runV1014TradeDepthTurn(inp17);
    check(results, 'v1014_td_17', 'trade depth turn 17 produces hash', r17.state.inputHash.length > 8);
    check(results, 'v1014_td_17b', 'trade depth turn 17 schema persisted', r17.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_17c', 'trade depth turn 17 tariff bounded', r17.state.aggregateTariffPressure >= 0 && r17.state.aggregateTariffPressure <= 1);
  }
  {
    const inp18 = baseInput({ turn: 18, seed: 1018, tradeDeficitIndex: 0.26, counterpartySanctionsActive: true });
    const r18 = runV1014TradeDepthTurn(inp18);
    check(results, 'v1014_td_18', 'trade depth turn 18 produces hash', r18.state.inputHash.length > 8);
    check(results, 'v1014_td_18b', 'trade depth turn 18 schema persisted', r18.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_18c', 'trade depth turn 18 tariff bounded', r18.state.aggregateTariffPressure >= 0 && r18.state.aggregateTariffPressure <= 1);
  }
  {
    const inp19 = baseInput({ turn: 19, seed: 1019, tradeDeficitIndex: 0.28, counterpartySanctionsActive: false });
    const r19 = runV1014TradeDepthTurn(inp19);
    check(results, 'v1014_td_19', 'trade depth turn 19 produces hash', r19.state.inputHash.length > 8);
    check(results, 'v1014_td_19b', 'trade depth turn 19 schema persisted', r19.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_19c', 'trade depth turn 19 tariff bounded', r19.state.aggregateTariffPressure >= 0 && r19.state.aggregateTariffPressure <= 1);
  }
  {
    const inp20 = baseInput({ turn: 20, seed: 1020, tradeDeficitIndex: 0.10, counterpartySanctionsActive: false });
    const r20 = runV1014TradeDepthTurn(inp20);
    check(results, 'v1014_td_20', 'trade depth turn 20 produces hash', r20.state.inputHash.length > 8);
    check(results, 'v1014_td_20b', 'trade depth turn 20 schema persisted', r20.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_20c', 'trade depth turn 20 tariff bounded', r20.state.aggregateTariffPressure >= 0 && r20.state.aggregateTariffPressure <= 1);
  }
  {
    const inp21 = baseInput({ turn: 21, seed: 1021, tradeDeficitIndex: 0.12, counterpartySanctionsActive: true });
    const r21 = runV1014TradeDepthTurn(inp21);
    check(results, 'v1014_td_21', 'trade depth turn 21 produces hash', r21.state.inputHash.length > 8);
    check(results, 'v1014_td_21b', 'trade depth turn 21 schema persisted', r21.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_21c', 'trade depth turn 21 tariff bounded', r21.state.aggregateTariffPressure >= 0 && r21.state.aggregateTariffPressure <= 1);
  }
  {
    const inp22 = baseInput({ turn: 22, seed: 1022, tradeDeficitIndex: 0.14, counterpartySanctionsActive: false });
    const r22 = runV1014TradeDepthTurn(inp22);
    check(results, 'v1014_td_22', 'trade depth turn 22 produces hash', r22.state.inputHash.length > 8);
    check(results, 'v1014_td_22b', 'trade depth turn 22 schema persisted', r22.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_22c', 'trade depth turn 22 tariff bounded', r22.state.aggregateTariffPressure >= 0 && r22.state.aggregateTariffPressure <= 1);
  }
  {
    const inp23 = baseInput({ turn: 23, seed: 1023, tradeDeficitIndex: 0.16, counterpartySanctionsActive: false });
    const r23 = runV1014TradeDepthTurn(inp23);
    check(results, 'v1014_td_23', 'trade depth turn 23 produces hash', r23.state.inputHash.length > 8);
    check(results, 'v1014_td_23b', 'trade depth turn 23 schema persisted', r23.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_23c', 'trade depth turn 23 tariff bounded', r23.state.aggregateTariffPressure >= 0 && r23.state.aggregateTariffPressure <= 1);
  }
  {
    const inp24 = baseInput({ turn: 24, seed: 1024, tradeDeficitIndex: 0.18, counterpartySanctionsActive: true });
    const r24 = runV1014TradeDepthTurn(inp24);
    check(results, 'v1014_td_24', 'trade depth turn 24 produces hash', r24.state.inputHash.length > 8);
    check(results, 'v1014_td_24b', 'trade depth turn 24 schema persisted', r24.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_24c', 'trade depth turn 24 tariff bounded', r24.state.aggregateTariffPressure >= 0 && r24.state.aggregateTariffPressure <= 1);
  }
  {
    const inp25 = baseInput({ turn: 25, seed: 1025, tradeDeficitIndex: 0.20, counterpartySanctionsActive: false });
    const r25 = runV1014TradeDepthTurn(inp25);
    check(results, 'v1014_td_25', 'trade depth turn 25 produces hash', r25.state.inputHash.length > 8);
    check(results, 'v1014_td_25b', 'trade depth turn 25 schema persisted', r25.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_25c', 'trade depth turn 25 tariff bounded', r25.state.aggregateTariffPressure >= 0 && r25.state.aggregateTariffPressure <= 1);
  }
  {
    const inp26 = baseInput({ turn: 26, seed: 1026, tradeDeficitIndex: 0.22, counterpartySanctionsActive: false });
    const r26 = runV1014TradeDepthTurn(inp26);
    check(results, 'v1014_td_26', 'trade depth turn 26 produces hash', r26.state.inputHash.length > 8);
    check(results, 'v1014_td_26b', 'trade depth turn 26 schema persisted', r26.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_26c', 'trade depth turn 26 tariff bounded', r26.state.aggregateTariffPressure >= 0 && r26.state.aggregateTariffPressure <= 1);
  }
  {
    const inp27 = baseInput({ turn: 27, seed: 1027, tradeDeficitIndex: 0.24, counterpartySanctionsActive: true });
    const r27 = runV1014TradeDepthTurn(inp27);
    check(results, 'v1014_td_27', 'trade depth turn 27 produces hash', r27.state.inputHash.length > 8);
    check(results, 'v1014_td_27b', 'trade depth turn 27 schema persisted', r27.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_27c', 'trade depth turn 27 tariff bounded', r27.state.aggregateTariffPressure >= 0 && r27.state.aggregateTariffPressure <= 1);
  }
  {
    const inp28 = baseInput({ turn: 28, seed: 1028, tradeDeficitIndex: 0.26, counterpartySanctionsActive: false });
    const r28 = runV1014TradeDepthTurn(inp28);
    check(results, 'v1014_td_28', 'trade depth turn 28 produces hash', r28.state.inputHash.length > 8);
    check(results, 'v1014_td_28b', 'trade depth turn 28 schema persisted', r28.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_28c', 'trade depth turn 28 tariff bounded', r28.state.aggregateTariffPressure >= 0 && r28.state.aggregateTariffPressure <= 1);
  }
  {
    const inp29 = baseInput({ turn: 29, seed: 1029, tradeDeficitIndex: 0.28, counterpartySanctionsActive: false });
    const r29 = runV1014TradeDepthTurn(inp29);
    check(results, 'v1014_td_29', 'trade depth turn 29 produces hash', r29.state.inputHash.length > 8);
    check(results, 'v1014_td_29b', 'trade depth turn 29 schema persisted', r29.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_29c', 'trade depth turn 29 tariff bounded', r29.state.aggregateTariffPressure >= 0 && r29.state.aggregateTariffPressure <= 1);
  }
  {
    const inp30 = baseInput({ turn: 30, seed: 1030, tradeDeficitIndex: 0.10, counterpartySanctionsActive: true });
    const r30 = runV1014TradeDepthTurn(inp30);
    check(results, 'v1014_td_30', 'trade depth turn 30 produces hash', r30.state.inputHash.length > 8);
    check(results, 'v1014_td_30b', 'trade depth turn 30 schema persisted', r30.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_30c', 'trade depth turn 30 tariff bounded', r30.state.aggregateTariffPressure >= 0 && r30.state.aggregateTariffPressure <= 1);
  }
  {
    const inp31 = baseInput({ turn: 31, seed: 1031, tradeDeficitIndex: 0.12, counterpartySanctionsActive: false });
    const r31 = runV1014TradeDepthTurn(inp31);
    check(results, 'v1014_td_31', 'trade depth turn 31 produces hash', r31.state.inputHash.length > 8);
    check(results, 'v1014_td_31b', 'trade depth turn 31 schema persisted', r31.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_31c', 'trade depth turn 31 tariff bounded', r31.state.aggregateTariffPressure >= 0 && r31.state.aggregateTariffPressure <= 1);
  }
  {
    const inp32 = baseInput({ turn: 32, seed: 1032, tradeDeficitIndex: 0.14, counterpartySanctionsActive: false });
    const r32 = runV1014TradeDepthTurn(inp32);
    check(results, 'v1014_td_32', 'trade depth turn 32 produces hash', r32.state.inputHash.length > 8);
    check(results, 'v1014_td_32b', 'trade depth turn 32 schema persisted', r32.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_32c', 'trade depth turn 32 tariff bounded', r32.state.aggregateTariffPressure >= 0 && r32.state.aggregateTariffPressure <= 1);
  }
  {
    const inp33 = baseInput({ turn: 33, seed: 1033, tradeDeficitIndex: 0.16, counterpartySanctionsActive: true });
    const r33 = runV1014TradeDepthTurn(inp33);
    check(results, 'v1014_td_33', 'trade depth turn 33 produces hash', r33.state.inputHash.length > 8);
    check(results, 'v1014_td_33b', 'trade depth turn 33 schema persisted', r33.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_33c', 'trade depth turn 33 tariff bounded', r33.state.aggregateTariffPressure >= 0 && r33.state.aggregateTariffPressure <= 1);
  }
  {
    const inp34 = baseInput({ turn: 34, seed: 1034, tradeDeficitIndex: 0.18, counterpartySanctionsActive: false });
    const r34 = runV1014TradeDepthTurn(inp34);
    check(results, 'v1014_td_34', 'trade depth turn 34 produces hash', r34.state.inputHash.length > 8);
    check(results, 'v1014_td_34b', 'trade depth turn 34 schema persisted', r34.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_34c', 'trade depth turn 34 tariff bounded', r34.state.aggregateTariffPressure >= 0 && r34.state.aggregateTariffPressure <= 1);
  }
  {
    const inp35 = baseInput({ turn: 35, seed: 1035, tradeDeficitIndex: 0.20, counterpartySanctionsActive: false });
    const r35 = runV1014TradeDepthTurn(inp35);
    check(results, 'v1014_td_35', 'trade depth turn 35 produces hash', r35.state.inputHash.length > 8);
    check(results, 'v1014_td_35b', 'trade depth turn 35 schema persisted', r35.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_35c', 'trade depth turn 35 tariff bounded', r35.state.aggregateTariffPressure >= 0 && r35.state.aggregateTariffPressure <= 1);
  }
  {
    const inp36 = baseInput({ turn: 36, seed: 1036, tradeDeficitIndex: 0.22, counterpartySanctionsActive: true });
    const r36 = runV1014TradeDepthTurn(inp36);
    check(results, 'v1014_td_36', 'trade depth turn 36 produces hash', r36.state.inputHash.length > 8);
    check(results, 'v1014_td_36b', 'trade depth turn 36 schema persisted', r36.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_36c', 'trade depth turn 36 tariff bounded', r36.state.aggregateTariffPressure >= 0 && r36.state.aggregateTariffPressure <= 1);
  }
  {
    const inp37 = baseInput({ turn: 37, seed: 1037, tradeDeficitIndex: 0.24, counterpartySanctionsActive: false });
    const r37 = runV1014TradeDepthTurn(inp37);
    check(results, 'v1014_td_37', 'trade depth turn 37 produces hash', r37.state.inputHash.length > 8);
    check(results, 'v1014_td_37b', 'trade depth turn 37 schema persisted', r37.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_37c', 'trade depth turn 37 tariff bounded', r37.state.aggregateTariffPressure >= 0 && r37.state.aggregateTariffPressure <= 1);
  }
  {
    const inp38 = baseInput({ turn: 38, seed: 1038, tradeDeficitIndex: 0.26, counterpartySanctionsActive: false });
    const r38 = runV1014TradeDepthTurn(inp38);
    check(results, 'v1014_td_38', 'trade depth turn 38 produces hash', r38.state.inputHash.length > 8);
    check(results, 'v1014_td_38b', 'trade depth turn 38 schema persisted', r38.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_38c', 'trade depth turn 38 tariff bounded', r38.state.aggregateTariffPressure >= 0 && r38.state.aggregateTariffPressure <= 1);
  }
  {
    const inp39 = baseInput({ turn: 39, seed: 1039, tradeDeficitIndex: 0.28, counterpartySanctionsActive: true });
    const r39 = runV1014TradeDepthTurn(inp39);
    check(results, 'v1014_td_39', 'trade depth turn 39 produces hash', r39.state.inputHash.length > 8);
    check(results, 'v1014_td_39b', 'trade depth turn 39 schema persisted', r39.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_39c', 'trade depth turn 39 tariff bounded', r39.state.aggregateTariffPressure >= 0 && r39.state.aggregateTariffPressure <= 1);
  }
  {
    const inp40 = baseInput({ turn: 40, seed: 1040, tradeDeficitIndex: 0.10, counterpartySanctionsActive: false });
    const r40 = runV1014TradeDepthTurn(inp40);
    check(results, 'v1014_td_40', 'trade depth turn 40 produces hash', r40.state.inputHash.length > 8);
    check(results, 'v1014_td_40b', 'trade depth turn 40 schema persisted', r40.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_40c', 'trade depth turn 40 tariff bounded', r40.state.aggregateTariffPressure >= 0 && r40.state.aggregateTariffPressure <= 1);
  }
  {
    const inp41 = baseInput({ turn: 41, seed: 1041, tradeDeficitIndex: 0.12, counterpartySanctionsActive: false });
    const r41 = runV1014TradeDepthTurn(inp41);
    check(results, 'v1014_td_41', 'trade depth turn 41 produces hash', r41.state.inputHash.length > 8);
    check(results, 'v1014_td_41b', 'trade depth turn 41 schema persisted', r41.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_41c', 'trade depth turn 41 tariff bounded', r41.state.aggregateTariffPressure >= 0 && r41.state.aggregateTariffPressure <= 1);
  }
  {
    const inp42 = baseInput({ turn: 42, seed: 1042, tradeDeficitIndex: 0.14, counterpartySanctionsActive: true });
    const r42 = runV1014TradeDepthTurn(inp42);
    check(results, 'v1014_td_42', 'trade depth turn 42 produces hash', r42.state.inputHash.length > 8);
    check(results, 'v1014_td_42b', 'trade depth turn 42 schema persisted', r42.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_42c', 'trade depth turn 42 tariff bounded', r42.state.aggregateTariffPressure >= 0 && r42.state.aggregateTariffPressure <= 1);
  }
  {
    const inp43 = baseInput({ turn: 43, seed: 1043, tradeDeficitIndex: 0.16, counterpartySanctionsActive: false });
    const r43 = runV1014TradeDepthTurn(inp43);
    check(results, 'v1014_td_43', 'trade depth turn 43 produces hash', r43.state.inputHash.length > 8);
    check(results, 'v1014_td_43b', 'trade depth turn 43 schema persisted', r43.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_43c', 'trade depth turn 43 tariff bounded', r43.state.aggregateTariffPressure >= 0 && r43.state.aggregateTariffPressure <= 1);
  }
  {
    const inp44 = baseInput({ turn: 44, seed: 1044, tradeDeficitIndex: 0.18, counterpartySanctionsActive: false });
    const r44 = runV1014TradeDepthTurn(inp44);
    check(results, 'v1014_td_44', 'trade depth turn 44 produces hash', r44.state.inputHash.length > 8);
    check(results, 'v1014_td_44b', 'trade depth turn 44 schema persisted', r44.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_44c', 'trade depth turn 44 tariff bounded', r44.state.aggregateTariffPressure >= 0 && r44.state.aggregateTariffPressure <= 1);
  }
  {
    const inp45 = baseInput({ turn: 45, seed: 1045, tradeDeficitIndex: 0.20, counterpartySanctionsActive: true });
    const r45 = runV1014TradeDepthTurn(inp45);
    check(results, 'v1014_td_45', 'trade depth turn 45 produces hash', r45.state.inputHash.length > 8);
    check(results, 'v1014_td_45b', 'trade depth turn 45 schema persisted', r45.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_45c', 'trade depth turn 45 tariff bounded', r45.state.aggregateTariffPressure >= 0 && r45.state.aggregateTariffPressure <= 1);
  }
  {
    const inp46 = baseInput({ turn: 46, seed: 1046, tradeDeficitIndex: 0.22, counterpartySanctionsActive: false });
    const r46 = runV1014TradeDepthTurn(inp46);
    check(results, 'v1014_td_46', 'trade depth turn 46 produces hash', r46.state.inputHash.length > 8);
    check(results, 'v1014_td_46b', 'trade depth turn 46 schema persisted', r46.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_46c', 'trade depth turn 46 tariff bounded', r46.state.aggregateTariffPressure >= 0 && r46.state.aggregateTariffPressure <= 1);
  }
  {
    const inp47 = baseInput({ turn: 47, seed: 1047, tradeDeficitIndex: 0.24, counterpartySanctionsActive: false });
    const r47 = runV1014TradeDepthTurn(inp47);
    check(results, 'v1014_td_47', 'trade depth turn 47 produces hash', r47.state.inputHash.length > 8);
    check(results, 'v1014_td_47b', 'trade depth turn 47 schema persisted', r47.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_47c', 'trade depth turn 47 tariff bounded', r47.state.aggregateTariffPressure >= 0 && r47.state.aggregateTariffPressure <= 1);
  }
  {
    const inp48 = baseInput({ turn: 48, seed: 1048, tradeDeficitIndex: 0.26, counterpartySanctionsActive: true });
    const r48 = runV1014TradeDepthTurn(inp48);
    check(results, 'v1014_td_48', 'trade depth turn 48 produces hash', r48.state.inputHash.length > 8);
    check(results, 'v1014_td_48b', 'trade depth turn 48 schema persisted', r48.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_48c', 'trade depth turn 48 tariff bounded', r48.state.aggregateTariffPressure >= 0 && r48.state.aggregateTariffPressure <= 1);
  }
  {
    const inp49 = baseInput({ turn: 49, seed: 1049, tradeDeficitIndex: 0.28, counterpartySanctionsActive: false });
    const r49 = runV1014TradeDepthTurn(inp49);
    check(results, 'v1014_td_49', 'trade depth turn 49 produces hash', r49.state.inputHash.length > 8);
    check(results, 'v1014_td_49b', 'trade depth turn 49 schema persisted', r49.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_49c', 'trade depth turn 49 tariff bounded', r49.state.aggregateTariffPressure >= 0 && r49.state.aggregateTariffPressure <= 1);
  }
  {
    const inp50 = baseInput({ turn: 50, seed: 1050, tradeDeficitIndex: 0.10, counterpartySanctionsActive: false });
    const r50 = runV1014TradeDepthTurn(inp50);
    check(results, 'v1014_td_50', 'trade depth turn 50 produces hash', r50.state.inputHash.length > 8);
    check(results, 'v1014_td_50b', 'trade depth turn 50 schema persisted', r50.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_50c', 'trade depth turn 50 tariff bounded', r50.state.aggregateTariffPressure >= 0 && r50.state.aggregateTariffPressure <= 1);
  }
  {
    const inp51 = baseInput({ turn: 51, seed: 1051, tradeDeficitIndex: 0.12, counterpartySanctionsActive: true });
    const r51 = runV1014TradeDepthTurn(inp51);
    check(results, 'v1014_td_51', 'trade depth turn 51 produces hash', r51.state.inputHash.length > 8);
    check(results, 'v1014_td_51b', 'trade depth turn 51 schema persisted', r51.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_51c', 'trade depth turn 51 tariff bounded', r51.state.aggregateTariffPressure >= 0 && r51.state.aggregateTariffPressure <= 1);
  }
  {
    const inp52 = baseInput({ turn: 52, seed: 1052, tradeDeficitIndex: 0.14, counterpartySanctionsActive: false });
    const r52 = runV1014TradeDepthTurn(inp52);
    check(results, 'v1014_td_52', 'trade depth turn 52 produces hash', r52.state.inputHash.length > 8);
    check(results, 'v1014_td_52b', 'trade depth turn 52 schema persisted', r52.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_52c', 'trade depth turn 52 tariff bounded', r52.state.aggregateTariffPressure >= 0 && r52.state.aggregateTariffPressure <= 1);
  }
  {
    const inp53 = baseInput({ turn: 53, seed: 1053, tradeDeficitIndex: 0.16, counterpartySanctionsActive: false });
    const r53 = runV1014TradeDepthTurn(inp53);
    check(results, 'v1014_td_53', 'trade depth turn 53 produces hash', r53.state.inputHash.length > 8);
    check(results, 'v1014_td_53b', 'trade depth turn 53 schema persisted', r53.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_53c', 'trade depth turn 53 tariff bounded', r53.state.aggregateTariffPressure >= 0 && r53.state.aggregateTariffPressure <= 1);
  }
  {
    const inp54 = baseInput({ turn: 54, seed: 1054, tradeDeficitIndex: 0.18, counterpartySanctionsActive: true });
    const r54 = runV1014TradeDepthTurn(inp54);
    check(results, 'v1014_td_54', 'trade depth turn 54 produces hash', r54.state.inputHash.length > 8);
    check(results, 'v1014_td_54b', 'trade depth turn 54 schema persisted', r54.persisted.schemaVersion === V1014_TRADE_DEPTH_SCHEMA_VERSION);
    check(results, 'v1014_td_54c', 'trade depth turn 54 tariff bounded', r54.state.aggregateTariffPressure >= 0 && r54.state.aggregateTariffPressure <= 1);
  }
  const hashA = v1014TradeDepthInputHash(baseInput());
  const hashB = v1014TradeDepthInputHash(baseInput());
  check(results, 'v1014_td_hash', 'input hash stable', hashA === hashB);

  const esc = runV1014TradeDepthTurn(baseInput({ counterpartySanctionsActive: true, tradeDeficitIndex: 0.55 }));
  const calm = runV1014TradeDepthTurn(baseInput({ counterpartySanctionsActive: false, tradeDeficitIndex: 0.05 }));
  check(results, 'v1014_td_esc', 'sanctions raise tariff pressure', esc.state.aggregateTariffPressure > calm.state.aggregateTariffPressure);

  const gtel = applyV1014TradeDepthGtelBridge(baseInput(), esc.state.aggregateTariffPressure);
  check(results, 'v1014_td_gt', 'GTEL bridge returns access band', typeof gtel.accessBand === 'string');

  const dip = readV1014TradeDepthDiplomacySlice(baseInput({ counterpartySanctionsActive: true }));
  check(results, 'v1014_td_dn', '20H slice flags violations', dip.violatedDeals >= 1);

  const inv = computeV1014TradeDepthInvestmentDelta(baseInput(), 0.4, 0.3);
  check(results, 'v1014_td_ab', '20AB delta negative under stress', inv.scoreDelta < 0);

  const fis = computeV1014TradeDepthFiscalBridge(baseInput({ fiscalPressureBand: 'critical' }), 0.35, 0.2);
  check(results, 'v1014_td_ae', '20AE fiscal bridge headroom', fis.headroomDelta <= 0);

  const hh = computeV1014TradeDepthHouseholdBridge(baseInput(), 0.3, 0.25);
  check(results, 'v1014_td_af', '20AF consumption bounded', hh.consumptionMultiplier >= 0.65 && hh.consumptionMultiplier <= 1.05);

  const empty = createEmptyV1014TradeDepthPersisted();
  const sanitized = sanitizeV1014TradeDepthPersisted(null, 9);
  check(results, 'v1014_td_persist', 'sanitize null safe', sanitized.revision >= empty.revision);

  let persisted = null as ReturnType<typeof createEmptyV1014TradeDepthPersisted> | null;
  for (let t = 1; t <= 12; t++) {
    const rr = runV1014TradeDepthTurn(baseInput({ turn: t, persisted, counterpartySanctionsActive: t > 4 && t < 10 }));
    persisted = rr.persisted;
  }
  check(results, 'v1014_td_roll', 'multi-turn roll-forward', (persisted?.lastProcessedTurn ?? 0) === 12);

  const passed = results.filter(r => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, results };
}

export function runV1014TradeDepthSelfTestsForLab(): Array<{ id: string; name: string; passed: boolean; detail: string }> {
  return runV1014TradeDepthSelfTests().results.map(r => ({
    id: r.id,
    name: r.name,
    passed: r.passed,
    detail: r.detail,
  }));
}
