import { classifyIdleAutomationBand } from './idle-automation-depth.js';
import type { IdleAutomationBand, O10SelfTestResult } from './types.js';

export type O10IdleEscalationTier = 0 | 1 | 2 | 3;

export interface O10IdleEscalationInput {
  idleMs: number;
  consecutiveIdleTurns: number;
  stewardEnabled?: boolean;
  playerPaused?: boolean;
  queuedIntentCount?: number;
  blockedEndTurnStreak?: number;
}

export interface O10IdleEscalationResult {
  band: IdleAutomationBand;
  tier: O10IdleEscalationTier;
  throttleHumanAutomation: boolean;
  stewardOnly: boolean;
  blockNewIntents: boolean;
  reason: string;
}

const TIER_REASON: Record<O10IdleEscalationTier, string> = {
  0: 'nominal',
  1: 'idle_watch',
  2: 'deep_idle_pressure',
  3: 'steward_or_queue_saturation',
};

/** Map idle telemetry + queue pressure to a discrete escalation tier for automation policy. */
export function evaluateIdleAutomationEscalation(input: O10IdleEscalationInput): O10IdleEscalationResult {
  const band = classifyIdleAutomationBand({
    idleMs: input.idleMs,
    consecutiveIdleTurns: input.consecutiveIdleTurns,
    stewardEnabled: input.stewardEnabled ?? true,
    playerPaused: input.playerPaused ?? false,
  });

  const queued = Math.max(0, input.queuedIntentCount ?? 0);
  const blockedStreak = Math.max(0, input.blockedEndTurnStreak ?? 0);

  let tier: O10IdleEscalationTier = 0;
  if (band === 'steward_tick' || queued >= 6 || blockedStreak >= 3) tier = 3;
  else if (band === 'deep_idle' || queued >= 4 || blockedStreak >= 2) tier = 2;
  else if (band === 'idle' || band === 'drifting' || queued >= 2) tier = 1;

  return {
    band,
    tier,
    throttleHumanAutomation: tier >= 2,
    stewardOnly: tier >= 3 && band === 'steward_tick',
    blockNewIntents: tier >= 3 && queued >= 4,
    reason: TIER_REASON[tier],
  };
}

export function mergeIdleEscalationTier(a: O10IdleEscalationTier, b: O10IdleEscalationTier): O10IdleEscalationTier {
  return (Math.max(a, b) as O10IdleEscalationTier);
}

export function formatIdleEscalationSummary(result: O10IdleEscalationResult): string {
  return `escalation t${result.tier} band=${result.band} ${result.reason}`;
}

export function runO10Agent20IdleEscalationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const nominal = evaluateIdleAutomationEscalation({
    idleMs: 1000,
    consecutiveIdleTurns: 0,
  });
  push('esc_nominal', 'active band stays tier 0', nominal.tier === 0 && !nominal.throttleHumanAutomation);

  const deep = evaluateIdleAutomationEscalation({
    idleMs: 600_000,
    consecutiveIdleTurns: 6,
  });
  push('esc_deep', 'deep idle reaches tier 2+', deep.tier >= 2 && deep.throttleHumanAutomation);

  const steward = evaluateIdleAutomationEscalation({
    idleMs: 900_000,
    consecutiveIdleTurns: 12,
    queuedIntentCount: 2,
  });
  push(
    'esc_steward',
    'steward tick tier 3 steward-only',
    steward.tier === 3 && steward.stewardOnly && steward.band === 'steward_tick'
  );

  push(
    'esc_merge',
    'merge picks higher tier',
    mergeIdleEscalationTier(1, 3) === 3 && mergeIdleEscalationTier(0, 2) === 2
  );

  return results;
}
