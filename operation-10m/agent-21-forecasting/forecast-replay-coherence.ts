/**
 * Agent 21 — replay seed coherence vs validation + escalation (read-only round 9).
 */

import { buildAg21LabReplaySeed } from './forecast-lab-replay-seed';
import { validateAg21CrosslinkHandoff } from './forecast-packet-validation';
import { resolveAg21OperatorEscalation } from './forecast-operator-escalation';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21ReplayCoherenceStatus = 'coherent' | 'partial' | 'broken';

export interface Ag21ReplayCoherenceReport {
  status: Ag21ReplayCoherenceStatus;
  driftSignals: string[];
  replaySeedId: string;
  validationStatus: ReturnType<typeof validateAg21CrosslinkHandoff>['status'];
  escalationTier: ReturnType<typeof resolveAg21OperatorEscalation>['tier'];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Check replay seed fields against fresh validation + escalation (round 9). */
export function assessAg21ReplayCoherence(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21ReplayCoherenceReport {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.81),
      actorDebt: baseCtx.actorDebt + 130
    } satisfies Ag21ForecastContext);

  const replay = buildAg21LabReplaySeed(baseCtx, candidate);
  const validation = validateAg21CrosslinkHandoff(baseCtx, candidate);
  const escalation = resolveAg21OperatorEscalation(baseCtx, candidate);

  const driftSignals: string[] = [];
  if (replay.validationStatus !== validation.status) {
    driftSignals.push(`validation ${replay.validationStatus} vs live ${validation.status}`);
  }
  if (replay.escalationTier !== escalation.tier) {
    driftSignals.push(`escalation ${replay.escalationTier} vs live ${escalation.tier}`);
  }
  if (!replay.fingerprint.includes(String(escalation.tier))) {
    driftSignals.push('fingerprint missing escalation tier token');
  }

  let status: Ag21ReplayCoherenceStatus = 'coherent';
  if (driftSignals.length >= 2) status = 'broken';
  else if (driftSignals.length === 1) status = 'partial';

  return {
    status,
    driftSignals,
    replaySeedId: replay.seedId,
    validationStatus: validation.status,
    escalationTier: escalation.tier,
    disclaimer: '(Non-authoritative forecast.) Replay coherence check for history wiring only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'coherent' ? 'low' : status === 'partial' ? 'moderate' : 'high',
      [`coherence=${status}`, `drift=${driftSignals.length}`]
    ),
    authoritative: false
  };
}

export function runAg21ReplayCoherenceSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 14, seed: 61, actorCash: 940, actorDebt: 120, regionsControlled: 3 };
  const report = assessAg21ReplayCoherence(ctx);

  push('coherence_status', ['coherent', 'partial', 'broken'].includes(report.status), report.status);
  push('coherence_seed', report.replaySeedId.startsWith('ag21_lab_seed_'), report.replaySeedId);
  push('coherence_validation', ['aligned', 'drift', 'blocked'].includes(report.validationStatus), report.validationStatus);
  push('coherence_non_auth', report.authoritative === false, report.disclaimer.slice(0, 28));

  return out;
}
