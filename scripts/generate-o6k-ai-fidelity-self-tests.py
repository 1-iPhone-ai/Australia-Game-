#!/usr/bin/env python3
"""Emit run-v1014-ai-fidelity-self-tests.ts with >=50 cases."""
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "expansion/o6k-10m/ai-fidelity/self-tests/run-v1014-ai-fidelity-self-tests.ts"

head = '''/**
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
'''

blocks = []
for n in range(1, 21):
    t = n
    seed = 5000 + n
    sev = 0.1 + (n % 10) * 0.07
    coord = 0.4 + (n % 8) * 0.06
    blocks.append(f'''  {{
    const inp = baseInput({{ turn: {t}, seed: {seed}, advisoryMonitorSeverity: {sev:.2f}, teamCoordinationScore: {coord:.2f} }});
    const r = runV1014AiFidelityTurn(inp);
    check(results, 'v1014_af_{n:02d}a', 'turn {t} hash', r.state.inputHash.length >= 8);
    check(results, 'v1014_af_{n:02d}b', 'turn {t} schema', r.persisted.schemaVersion === V1014_AI_FIDELITY_SCHEMA_VERSION);
    check(results, 'v1014_af_{n:02d}c', 'turn {t} pav bounded', r.state.aggregatePavScore >= 0 && r.state.aggregatePavScore <= 1);
  }}''')

adapter_block = '''
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
'''

tail = '''
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
'''

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(head + "\n".join(blocks) + adapter_block + tail, encoding="utf-8")
print("wrote", OUT, "lines", len(OUT.read_text().splitlines()))
