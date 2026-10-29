/**
 * Operation 111 · Agent 104 — Adaptive Complexity static contracts.
 * Reads `(V9.4) australia-game-with-ai.tsx` as text (no bundling the monolith).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const GAME_FILE = path.join(ROOT, '(V9.4) australia-game-with-ai.tsx');

function readGameSource() {
  if (!fs.existsSync(GAME_FILE)) {
    throw new Error(`Missing canonical game file: ${GAME_FILE}`);
  }
  return fs.readFileSync(GAME_FILE, 'utf8');
}

/** Mirror of shouldThrottleReplayDetail — must stay aligned with §6 replay helpers. */
export function shouldThrottleReplayDetail(detailLevel, usage, isCritical) {
  return usage >= 0.9 && !isCritical && (detailLevel || 'standard') === 'standard';
}

const results = [];
function check(id, passed, detail) {
  results.push({ id, passed, detail: detail || (passed ? 'ok' : 'failed') });
}

function assertBlockContains(src, label, pattern, minCount = 1) {
  const m = src.match(pattern);
  const count = m ? (Array.isArray(m) ? m.length : 1) : 0;
  check(label, count >= minCount, count >= minCount ? `matches=${count}` : `expected ≥${minCount}, got ${count}`);
}

function runStaticContracts(src) {
  assertBlockContains(
    src,
    'ac_type_game_complexity_preference',
    /export type GameComplexityPreference = 'simple' \| 'guided' \| 'detailed' \| 'full_simulation'/
  );

  for (const tier of ['simple', 'guided', 'detailed', 'full_simulation']) {
    assertBlockContains(
      src,
      `ac_smart_rule_complexity_${tier}`,
      new RegExp(`dimension: 'complexity'[\\s\\S]*?preferenceValue: '${tier}'`, 'm')
    );
  }

  assertBlockContains(
    src,
    'ac_simple_disables_team_ai_stack',
    /preferenceValue: 'simple'[\s\S]*?teamModeAiSystemsEnabled: false/
  );
  assertBlockContains(
    src,
    'ac_full_sim_enables_governance_surface',
    /preferenceValue: 'full_simulation'[\s\S]*?governanceControlSurfaceEnabled: true/
  );

  assertBlockContains(src, 'ac_evaluate_auto_mode_boundaries', /export function evaluateAutoModeBoundaries\(/);
  assertBlockContains(
    src,
    'ac_auto_mode_complexity_gates_economy',
    /allowEconomyChanges: profile\?\.complexity !== 'simple'/
  );
  assertBlockContains(
    src,
    'ac_generate_smart_settings_plan',
    /export function generateSmartSettingsPlan\(/
  );
  assertBlockContains(
    src,
    'ac_should_throttle_replay_detail_export',
    /export function shouldThrottleReplayDetail\(/
  );

  assertBlockContains(
    src,
    'ac_v95_match_scoped_national_master',
    /V95_MATCH_SCOPED_SETTING_KEYS[\s\S]*?'nationalSystemsEnabled'/
  );
  for (const key of [
    'industriesEnabled',
    'infraNetworksEnabled',
    'megaprojectsEnabled',
    'stateCapacityEnabled',
    'publicFinanceEnabled',
    'householdsEnabled',
  ]) {
    assertBlockContains(src, `ac_v95_match_scoped_${key}`, new RegExp(`'${key}'`));
  }

  assertBlockContains(
    src,
    'ac_adaptive_overseer_settings',
    /teamAiAdaptiveOverseerEnabled/
  );
  assertBlockContains(
    src,
    'ac_state_capacity_program_complexity',
    /complexity: 'low' \| 'moderate' \| 'high' \| 'national'/
  );
  assertBlockContains(
    src,
    'ac_guardian_high_complexity_program_warn',
    /high-complexity program under strained or overloaded national state capacity/
  );
}

function runPureMirrors() {
  check(
    'ac_mirror_throttle_standard_high_usage',
    shouldThrottleReplayDetail('standard', 0.95, false) === true
  );
  check(
    'ac_mirror_throttle_developer_bypass',
    shouldThrottleReplayDetail('developer', 0.95, false) === false
  );
  check(
    'ac_mirror_throttle_critical_bypass',
    shouldThrottleReplayDetail('standard', 0.95, true) === false
  );
  check(
    'ac_mirror_throttle_low_usage',
    shouldThrottleReplayDetail('standard', 0.5, false) === false
  );
}

function main() {
  const src = readGameSource();
  runStaticContracts(src);
  runPureMirrors();

  const failed = results.filter((r) => !r.passed);
  for (const r of results) {
    const mark = r.passed ? 'PASS' : 'FAIL';
    console.log(`${mark} ${r.id}${r.detail ? ` — ${r.detail}` : ''}`);
  }
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length) {
    process.exitCode = 1;
  }
}

main();
