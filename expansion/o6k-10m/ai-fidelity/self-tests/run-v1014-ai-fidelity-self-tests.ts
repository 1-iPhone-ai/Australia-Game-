/**
 * LAB suite: v1014_ai_fidelity — >=50 deterministic plan/act/verify fixtures.
 */
import type { V1014AiFidelitySelfTestResult, V1014AiFidelityTurnInput } from '../types/core';
import {
  runV1014AiFidelityTurn,
  createEmptyV1014AiFidelityPersisted,
  v1014AiFidelityInputHash,
} from '../engine/ai-fidelity-orchestrator';
import { V1014_AI_FIDELITY_SCHEMA_VERSION } from '../types/core';
import { sanitizeV1014AiFidelityPersisted } from '../persistence/migrations';
import { readV1014AiFidelityAcc17Slice, applyV1014AiFidelityAcc17VerifyBridge } from '../adapters/adapter-acc17-execution';
import { applyV1014AiFidelity20AuRoutingBridge } from '../adapters/adapter-20au-team-routing';
import { applyV1014AiFidelity20PaAdvisoryBridge } from '../adapters/adapter-20pa-advisory';
import { evaluateV1014AiFidelityUiUnlocks } from '../adapters/adapter-20bd-ui-gates';

function baseInput(overrides: Partial<V1014AiFidelityTurnInput> = {}): V1014AiFidelityTurnInput {
  return {
    turn: 1,
    seed: 5150,
    executionBand: 'normal',
    acc17QueueDepth: 4,
    teamCoordinationScore: 0.58,
    advisoryMonitorSeverity: 0.22,
    nationalDevelopmentIndex: 0.42,
    featureFlagsEnabled: true,
    activeLoopIds: ['pav_loop_001'],
    persisted: null,
    ...overrides,
  };
}

function check(
  results: V1014AiFidelitySelfTestResult[],
  id: string,
  name: string,
  ok: boolean,
  detail = 'ok',
): void {
  results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });
}

export function runV1014AiFidelitySelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  results: V1014AiFidelitySelfTestResult[];
} {
  const results: V1014AiFidelitySelfTestResult[] = [];
  {
    const inp = baseInput({ turn: 1, seed: 5001, advisoryMonitorSeverity: 0.17, teamCoordinationScore: 0.46 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_01a', 'turn 1 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_01b', 'turn 1 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_01c', 'turn 1 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 2, seed: 5002, advisoryMonitorSeverity: 0.24, teamCoordinationScore: 0.52 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_02a', 'turn 2 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_02b', 'turn 2 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_02c', 'turn 2 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 3, seed: 5003, advisoryMonitorSeverity: 0.31, teamCoordinationScore: 0.58 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_03a', 'turn 3 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_03b', 'turn 3 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_03c', 'turn 3 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 4, seed: 5004, advisoryMonitorSeverity: 0.38, teamCoordinationScore: 0.64 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_04a', 'turn 4 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_04b', 'turn 4 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_04c', 'turn 4 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 5, seed: 5005, advisoryMonitorSeverity: 0.45, teamCoordinationScore: 0.70 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_05a', 'turn 5 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_05b', 'turn 5 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_05c', 'turn 5 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 6, seed: 5006, advisoryMonitorSeverity: 0.52, teamCoordinationScore: 0.76 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_06a', 'turn 6 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_06b', 'turn 6 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_06c', 'turn 6 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 7, seed: 5007, advisoryMonitorSeverity: 0.59, teamCoordinationScore: 0.82 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_07a', 'turn 7 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_07b', 'turn 7 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_07c', 'turn 7 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 8, seed: 5008, advisoryMonitorSeverity: 0.66, teamCoordinationScore: 0.40 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_08a', 'turn 8 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_08b', 'turn 8 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_08c', 'turn 8 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 9, seed: 5009, advisoryMonitorSeverity: 0.73, teamCoordinationScore: 0.46 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_09a', 'turn 9 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_09b', 'turn 9 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_09c', 'turn 9 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 10, seed: 5010, advisoryMonitorSeverity: 0.10, teamCoordinationScore: 0.52 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_10a', 'turn 10 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_10b', 'turn 10 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_10c', 'turn 10 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 11, seed: 5011, advisoryMonitorSeverity: 0.17, teamCoordinationScore: 0.58 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_11a', 'turn 11 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_11b', 'turn 11 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_11c', 'turn 11 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 12, seed: 5012, advisoryMonitorSeverity: 0.24, teamCoordinationScore: 0.64 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_12a', 'turn 12 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_12b', 'turn 12 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_12c', 'turn 12 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 13, seed: 5013, advisoryMonitorSeverity: 0.31, teamCoordinationScore: 0.70 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_13a', 'turn 13 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_13b', 'turn 13 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_13c', 'turn 13 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 14, seed: 5014, advisoryMonitorSeverity: 0.38, teamCoordinationScore: 0.76 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_14a', 'turn 14 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_14b', 'turn 14 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_14c', 'turn 14 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 15, seed: 5015, advisoryMonitorSeverity: 0.45, teamCoordinationScore: 0.82 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_15a', 'turn 15 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_15b', 'turn 15 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_15c', 'turn 15 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 16, seed: 5016, advisoryMonitorSeverity: 0.52, teamCoordinationScore: 0.40 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_16a', 'turn 16 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_16b', 'turn 16 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_16c', 'turn 16 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 17, seed: 5017, advisoryMonitorSeverity: 0.59, teamCoordinationScore: 0.46 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_17a', 'turn 17 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_17b', 'turn 17 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_17c', 'turn 17 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 18, seed: 5018, advisoryMonitorSeverity: 0.66, teamCoordinationScore: 0.52 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_18a', 'turn 18 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_18b', 'turn 18 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_18c', 'turn 18 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 19, seed: 5019, advisoryMonitorSeverity: 0.73, teamCoordinationScore: 0.58 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_19a', 'turn 19 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_19b', 'turn 19 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_19c', 'turn 19 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ turn: 20, seed: 5020, advisoryMonitorSeverity: 0.10, teamCoordinationScore: 0.64 });
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_20a', 'turn 20 hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_20b', 'turn 20 schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_20c', 'turn 20 pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }
  {
    const inp = baseInput({ executionBand: 'accelerated', acc17QueueDepth: 2 });
    const r = runV1014AiFidelityTurn(inp);
    const acc = readV1014AiFidelityAcc17Slice(inp);
    const bridge = applyV1014AiFidelityAcc17VerifyBridge(inp, r.state.aggregatePavScore);
    check(results, 'v1014_af_acc17', 'acc17 slice queue', acc.queueDepth >= 0);
    check(results, 'v1014_af_acc17b', 'acc17 verify bridge', bridge.verifyBoost >= 0);
    const route = applyV1014AiFidelity20AuRoutingBridge(inp, r.state.aggregatePavScore);
    check(results, 'v1014_af_20au', '20au routing digest', route.routeDigest.length >= 8);
    const pa = applyV1014AiFidelity20PaAdvisoryBridge(inp, r.state.aggregatePavScore);
    check(results, 'v1014_af_20pa', '20pa advisory pressure', pa.advisoryPressure >= 0);
    const ui = evaluateV1014AiFidelityUiUnlocks(inp);
    check(results, 'v1014_af_ui', '20bd ui flags', typeof ui.team_coordination3_dashboard === 'boolean');
  }
  {
    const empty = createEmptyV1014AiFidelityPersisted();
    const sanitized = sanitizeV1014AiFidelityPersisted(null, 3);
    check(results, 'v1014_af_persist', 'sanitize null', sanitized.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_persist2', 'empty factory', empty.revision === 1);
    const h1 = v1014AiFidelityInputHash(baseInput({ turn: 9, seed: 1 }));
    const h2 = v1014AiFidelityInputHash(baseInput({ turn: 9, seed: 1 }));
    check(results, 'v1014_af_hash', 'input hash stable', h1 === h2);
  }
  {
    let p = createEmptyV1014AiFidelityPersisted();
    let last = runV1014AiFidelityTurn(baseInput({ turn: 1, persisted: p }));
    p = last.persisted;
    last = runV1014AiFidelityTurn(baseInput({ turn: 2, persisted: p }));
    check(results, 'v1014_af_multiturn', 'multi-turn revision', last.persisted.revision >= 2);
    check(results, 'v1014_af_multiturn2', 'route hash stored', Object.keys(last.persisted.routeHashes).length >= 1);
  }

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  return { passed, failed, total: results.length, allPassed: failed === 0, results };
}

export function runV1014AiFidelitySelfTestsForLab(): { ok: boolean; detail: string } {
  const summary = runV1014AiFidelitySelfTests();
  return {
    ok: summary.allPassed && summary.total >= 50,
    detail: `passed=${summary.passed}/${summary.total}`,
  };
}
