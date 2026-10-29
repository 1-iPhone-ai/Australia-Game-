#!/usr/bin/env node
/**
 * Static architecture contracts for Operation 111 · Agent 79 (Late-Game Engineer).
 * Reads `(V9.4) australia-game-with-ai.tsx` — no runtime import of the monolith.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const BASELINE = resolve(ROOT, '(V9.4) australia-game-with-ai.tsx');
const src = readFileSync(BASELINE, 'utf8');

const checks = [
  {
    id: 'lg79_export_self_tests',
    name: 'runLateGamePhaseSelfTests is exported',
    run: () => /export function runLateGamePhaseSelfTests\(\)/.test(src),
  },
  {
    id: 'lg79_v95_registry',
    name: 'V95 suite registers lg79 quick tier',
    run: () => /id: 'lg79'/.test(src) && /runLateGamePhaseSelfTests/.test(src),
  },
  {
    id: 'lg79_directive_default_percent',
    name: 'generateTeamDirective uses DEFAULT_GAME_SETTINGS endgame percent fallback',
    run: () =>
      !/teamAiEndgameStartPercent \?\? 80/.test(src) &&
      /teamAiEndgameStartPercent \?\? DEFAULT_GAME_SETTINGS\.teamAiEndgameStartPercent/.test(src),
  },
  {
    id: 'lg79_phase_helpers',
    name: 'Core late-game helpers present',
    run: () =>
      /const isEndgamePeriod =/.test(src) &&
      /const computeEconomicPhase =/.test(src) &&
      /const computeTeamTreasuryReserve =/.test(src),
  },
  {
    id: 'lg79_emergency_endgame',
    name: 'Emergency layer defines endgame_threat',
    run: () =>
      /type EmergencyReasonTag = 'financial_crisis' \| 'region_control_loss' \| 'endgame_threat'/.test(src) &&
      /EMERGENCY_ACTIONS/.test(src),
  },
  {
    id: 'lg79_settings_hub',
    name: 'Settings hub documents endgame acceleration fields',
    run: () =>
      /id: 'teamModeAi\.endgameAcceleration'/.test(src) &&
      /teamAiEndgameStartPercent/.test(src),
  },
  {
    id: 'lg79_team_plans',
    name: 'Team plan types include endgame conversion verbs',
    run: () =>
      /const TEAM_PLAN_TYPES/.test(src) &&
      src.includes("'endgame_conversion'") &&
      src.includes("'block_opponent_win'"),
  },
];

let failed = 0;
for (const c of checks) {
  const ok = c.run();
  console.log(`${ok ? 'PASS' : 'FAIL'} ${c.id}: ${c.name}`);
  if (!ok) failed += 1;
}

if (failed) {
  console.error(`\n${failed} late-game contract(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} late-game contracts passed.`);
