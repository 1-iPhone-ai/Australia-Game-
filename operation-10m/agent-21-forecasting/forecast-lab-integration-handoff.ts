/**
 * Agent 21 — compact integration handoff for Agent 24/25 assembly (read-only round 9).
 */

import { buildAg21EscalationRunbook } from './forecast-escalation-runbook';
import { assessAg21ReplayCoherence } from './forecast-replay-coherence';
import { buildAg21LabReplaySeed } from './forecast-lab-replay-seed';
import { validateAg21CrosslinkHandoff } from './forecast-packet-validation';
import { ag21LabelUncertainty, O10M_AGENT21_MODULE_VERSION, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export interface Ag21LabIntegrationHandoff {
  handoffId: string;
  moduleVersion: string;
  validationStatus: ReturnType<typeof validateAg21CrosslinkHandoff>['status'];
  replaySeedId: string;
  coherenceStatus: ReturnType<typeof assessAg21ReplayCoherence>['status'];
  runbookStepCount: number;
  integrationTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package round 8–9 lab outputs for modular assembly wiring. */
export function buildAg21LabIntegrationHandoff(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabIntegrationHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.84),
      actorDebt: baseCtx.actorDebt + 100
    } satisfies Ag21ForecastContext);

  const validation = validateAg21CrosslinkHandoff(baseCtx, candidate);
  const replay = buildAg21LabReplaySeed(baseCtx, candidate);
  const coherence = assessAg21ReplayCoherence(baseCtx, candidate);
  const runbook = buildAg21EscalationRunbook(baseCtx, candidate);

  const handoffId = `ag21_handoff_${baseCtx.turn}_${baseCtx.seed}_${validation.status}`;

  const integrationTags = [
    `validation:${validation.status}`,
    `coherence:${coherence.status}`,
    `tier:${runbook.tier}`,
    `replay:${replay.seedId}`,
    `steps:${runbook.stepCount}`
  ];

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    validationStatus: validation.status,
    replaySeedId: replay.seedId,
    coherenceStatus: coherence.status,
    runbookStepCount: runbook.stepCount,
    integrationTags,
    disclaimer: '(Non-authoritative forecast.) Integration handoff for Operation 10M assembly only.',
    overallUncertainty: ag21LabelUncertainty(
      validation.status === 'blocked' || coherence.status === 'broken' ? 'high' : 'moderate',
      [`handoff=${handoffId}`, `tags=${integrationTags.length}`]
    ),
    authoritative: false
  };
}

export function runAg21LabIntegrationHandoffSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 22, seed: 3, actorCash: 1300, actorDebt: 55, regionsControlled: 5 };
  const handoff = buildAg21LabIntegrationHandoff(ctx);

  push('handoff_id', handoff.handoffId.startsWith('ag21_handoff_'), handoff.handoffId);
  push('handoff_tags', handoff.integrationTags.length >= 5, String(handoff.integrationTags.length));
  push('handoff_version', handoff.moduleVersion === O10M_AGENT21_MODULE_VERSION, handoff.moduleVersion);
  push('handoff_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}
