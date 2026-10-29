/**
 * Agent 21 — export clearance for history / replay modules (read-only round 11).
 */

import { verifyAg21StagingIntegrity } from './forecast-staging-verification';
import { evaluateAg21HandoffReadiness } from './forecast-handoff-readiness';
import { buildAg21LabReplaySeed } from './forecast-lab-replay-seed';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21ExportClearanceLevel = 'denied' | 'conditional' | 'cleared';

export interface Ag21ExportClearance {
  level: Ag21ExportClearanceLevel;
  replaySeedId: string;
  verificationStatus: ReturnType<typeof verifyAg21StagingIntegrity>['status'];
  readinessStatus: ReturnType<typeof evaluateAg21HandoffReadiness>['status'];
  clearanceNotes: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Resolve whether lab outputs may export to Agent 24 history wiring (round 11). */
export function buildAg21ExportClearance(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21ExportClearance {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.74),
      actorDebt: baseCtx.actorDebt + 205
    } satisfies Ag21ForecastContext);

  const verification = verifyAg21StagingIntegrity(baseCtx, candidate);
  const readiness = evaluateAg21HandoffReadiness(baseCtx, candidate);
  const replay = buildAg21LabReplaySeed(baseCtx, candidate);

  const clearanceNotes: string[] = [];
  if (verification.status === 'failed') clearanceNotes.push('staging verification failed');
  if (readiness.status === 'blocked') clearanceNotes.push('handoff readiness blocked');
  if (verification.findings.length > 0) {
    clearanceNotes.push(`${verification.findings.length} staging finding(s)`);
  }

  let level: Ag21ExportClearanceLevel = 'cleared';
  if (readiness.status === 'blocked' || verification.status === 'failed') level = 'denied';
  else if (readiness.status === 'hold' || verification.status === 'warning') level = 'conditional';

  return {
    level,
    replaySeedId: replay.seedId,
    verificationStatus: verification.status,
    readinessStatus: readiness.status,
    clearanceNotes,
    disclaimer: '(Non-authoritative forecast.) Export clearance for history modules only.',
    overallUncertainty: ag21LabelUncertainty(
      level === 'cleared' ? 'low' : level === 'conditional' ? 'moderate' : 'high',
      [`clearance=${level}`, `notes=${clearanceNotes.length}`]
    ),
    authoritative: false
  };
}

export function runAg21ExportClearanceSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 10, seed: 28, actorCash: 720, actorDebt: 210, regionsControlled: 2 };
  const clearance = buildAg21ExportClearance(ctx);

  push('clearance_level', ['denied', 'conditional', 'cleared'].includes(clearance.level), clearance.level);
  push('clearance_replay', clearance.replaySeedId.startsWith('ag21_lab_seed_'), clearance.replaySeedId);
  push('clearance_notes', Array.isArray(clearance.clearanceNotes), String(clearance.clearanceNotes.length));
  push('clearance_non_auth', clearance.authoritative === false, clearance.disclaimer.slice(0, 28));

  return out;
}
