import type { O10IdleEscalationTier } from './automation-idle-escalation.js';
import { appendNationalStewardHistory } from './logs.js';
import { createDefaultAutonomousIdleNationalPersisted } from './national-steward.js';
import type { NationalStewardPersisted, O10SelfTestResult } from './types.js';

export interface O10StewardIdleCoordinationResult {
  persisted: NationalStewardPersisted;
  throttled: boolean;
  reason: string;
}

const AUTONOMOUS_MODES = new Set(['autonomous_idle', 'autonomous_active', 'assisted']);

/**
 * Clamp national steward autonomy when idle ops backpressure tier is elevated.
 * Respects player pause/latch overrides.
 */
export function coordinateNationalStewardWithIdleOpsTier(
  persisted: NationalStewardPersisted,
  effectiveTier: O10IdleEscalationTier,
  turn: number
): O10StewardIdleCoordinationResult {
  if (persisted.playerOverride.paused || persisted.playerOverride.latched) {
    return { persisted, throttled: false, reason: 'player_override_active' };
  }

  if (effectiveTier <= 1) {
    return { persisted, throttled: false, reason: 'tier_nominal' };
  }

  let next = { ...persisted };
  let throttled = false;
  let reason = 'tier_nominal';

  if (effectiveTier >= 3) {
    throttled = true;
    reason = 'idle_ops_tier3_watch_only';
    next = {
      ...next,
      operatingMode: 'watch_only',
      automationPath: 'v94_idle_steward_watch',
    };
  } else if (effectiveTier >= 2 && AUTONOMOUS_MODES.has(persisted.operatingMode)) {
    throttled = true;
    reason = 'idle_ops_tier2_throttle_autonomy';
    next = {
      ...next,
      operatingMode: 'recommend',
      automationPath: 'v94_idle_steward_soft_nudge',
    };
  }

  if (!throttled) {
    return { persisted, throttled: false, reason: 'tier_nominal' };
  }

  const withHistory = appendNationalStewardHistory(
    next,
    turn,
    next.automationPath,
    'idle',
    reason
  );
  return { persisted: withHistory, throttled, reason };
}

export function formatStewardIdleCoordinationLine(result: O10StewardIdleCoordinationResult): string {
  return `steward_idle throttle=${result.throttled} reason=${result.reason}`;
}

export function runO10Agent20StewardIdleCoordinationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const base = createDefaultAutonomousIdleNationalPersisted();
  const nominal = coordinateNationalStewardWithIdleOpsTier(
    { ...base, operatingMode: 'autonomous_idle' },
    1,
    4
  );
  push('steward_idle_t1', 'tier 1 leaves autonomous mode', nominal.throttled === false);

  const throttle = coordinateNationalStewardWithIdleOpsTier(
    { ...base, operatingMode: 'autonomous_active' },
    2,
    5
  );
  push(
    'steward_idle_t2',
    'tier 2 throttles autonomous modes to recommend',
    throttle.throttled === true &&
      throttle.persisted.operatingMode === 'recommend' &&
      throttle.persisted.automationPath === 'v94_idle_steward_soft_nudge'
  );

  const watch = coordinateNationalStewardWithIdleOpsTier(
    { ...base, operatingMode: 'autonomous_active' },
    3,
    6
  );
  push(
    'steward_idle_t3',
    'tier 3 forces watch-only steward path',
    watch.throttled === true &&
      watch.persisted.operatingMode === 'watch_only' &&
      watch.persisted.automationPath === 'v94_idle_steward_watch'
  );

  const latched = coordinateNationalStewardWithIdleOpsTier(
    {
      ...base,
      operatingMode: 'autonomous_active',
      playerOverride: { ...base.playerOverride, latched: true },
    },
    3,
    7
  );
  push(
    'steward_idle_override',
    'latched player override skips idle coordination',
    latched.throttled === false && latched.persisted.operatingMode === 'autonomous_active'
  );

  return results;
}
