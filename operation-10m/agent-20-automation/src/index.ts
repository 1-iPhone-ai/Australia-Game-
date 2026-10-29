export * from './types.js';
export * from './conditional-actions.js';
export * from './limits.js';
export * from './logs.js';
export * from './safe-time-advance.js';
export * from './national-steward.js';
export * from './bridge-hooks.js';
export * from './idle-automation-depth.js';
export * from './turn-compute-engine.js';
export * from './turn-hooks.js';
export * from './idle-automation-simulation.js';

import type { O10SelfTestResult } from './types.js';
import { runO10Agent20NationalStewardSelfTests } from './national-steward.js';
import { createDefaultNationalStewardBridgeHooks } from './bridge-hooks.js';
import { createDefaultAutonomousIdleNationalPersisted } from './national-steward.js';
import { runO10Agent20IdleDepthSelfTests } from './idle-automation-depth.js';
import { runO10Agent20TurnComputeSelfTests } from './turn-compute-engine.js';
import { runO10Agent20TurnHooksSelfTests } from './turn-hooks.js';
import { runO10Agent20SimulationSelfTests } from './idle-automation-simulation.js';

/** Full module self-test bundle for Agent 25 dev lab registration. */
export function runO10Agent20ModuleSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: O10SelfTestResult[];
} {
  const results: O10SelfTestResult[] = [...runO10Agent20NationalStewardSelfTests()];
  const hooks = createDefaultNationalStewardBridgeHooks();
  const gs = { turnCounter: 2, takeoverSession: { status: 'active' } };
  const st = {
    autoModeEnabled: true,
    autoModeSettings: { permissionMode: 'recommend_only' },
    playerControlMode: 'assistant',
  };
  const after = hooks.onAfterAutoModeEvaluation?.({
    gameState: gs,
    settings: st,
    persisted: createDefaultAutonomousIdleNationalPersisted(),
  });
  const interrupted = hooks.onPlayerInterruptTakeover?.({
    persisted: createDefaultAutonomousIdleNationalPersisted(),
    turn: 2,
  });
  results.push({
    id: 'bridge_auto',
    name: 'bridge updates path after automode (assistant pcm)',
    passed: after?.automationPath === 'v94_player_control_assistant',
  });
  results.push({
    id: 'bridge_interrupt',
    name: 'interrupt latches manual override',
    passed: interrupted?.playerOverride.latched === true,
  });
  results.push(...runO10Agent20IdleDepthSelfTests());
  results.push(...runO10Agent20TurnComputeSelfTests());
  results.push(...runO10Agent20TurnHooksSelfTests());
  results.push(...runO10Agent20SimulationSelfTests());
  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
