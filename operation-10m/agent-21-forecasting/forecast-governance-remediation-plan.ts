/**
 * Agent 21 — remediation plan from governance checkpoint (read-only round 15).
 */

import { runAg21LabGovernanceCheckpoint } from './forecast-lab-governance-checkpoint';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21RemediationPlanStatus = 'clear' | 'planned' | 'blocked';

export interface Ag21GovernanceRemediationPlan {
  planId: string;
  status: Ag21RemediationPlanStatus;
  checkpointVerdict: ReturnType<typeof runAg21LabGovernanceCheckpoint>['verdict'];
  stepCount: number;
  steps: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Build operator remediation steps from governance checkpoint action items (round 15). */
export function buildAg21GovernanceRemediationPlan(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21GovernanceRemediationPlan {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.62),
      actorDebt: baseCtx.actorDebt + 315
    } satisfies Ag21ForecastContext);

  const checkpoint = runAg21LabGovernanceCheckpoint(baseCtx, candidate);
  const steps = checkpoint.actionItems.length
    ? checkpoint.actionItems.map((item, i) => `${i + 1}. ${item}`)
    : ['no remediation — governance checkpoint pass'];

  let status: Ag21RemediationPlanStatus = 'clear';
  if (checkpoint.verdict === 'fail') status = 'blocked';
  else if (checkpoint.actionItems.length > 0) status = 'planned';

  const planId = `ag21_remed_${baseCtx.turn}_${baseCtx.seed}_${status}`;

  return {
    planId,
    status,
    checkpointVerdict: checkpoint.verdict,
    stepCount: steps.length,
    steps,
    disclaimer: '(Non-authoritative forecast.) Remediation plan for scale-wave origin review only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'clear' ? 'low' : status === 'planned' ? 'moderate' : 'high',
      [`plan=${planId}`, `steps=${steps.length}`]
    ),
    authoritative: false
  };
}

export function runAg21GovernanceRemediationPlanSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 31, seed: 15, actorCash: 1420, actorDebt: 52, regionsControlled: 4 };
  const plan = buildAg21GovernanceRemediationPlan(ctx);

  push('remed_id', plan.planId.startsWith('ag21_remed_'), plan.planId);
  push('remed_status', ['clear', 'planned', 'blocked'].includes(plan.status), plan.status);
  push('remed_steps', plan.stepCount >= 1, String(plan.stepCount));
  push('remed_non_auth', plan.authoritative === false, plan.disclaimer.slice(0, 28));

  return out;
}
