/**
 * Agent 21 — operator runbook steps from escalation tier (read-only round 9).
 */

import { resolveAg21OperatorEscalation } from './forecast-operator-escalation';
import { assessAg21ReplayCoherence } from './forecast-replay-coherence';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export interface Ag21EscalationRunbookStep {
  order: number;
  action: string;
  rationale: string;
}

export interface Ag21EscalationRunbook {
  tier: ReturnType<typeof resolveAg21OperatorEscalation>['tier'];
  stepCount: number;
  steps: Ag21EscalationRunbookStep[];
  coherenceStatus: ReturnType<typeof assessAg21ReplayCoherence>['status'];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21RunbookStepsForTier(
  tier: Ag21EscalationRunbook['tier'],
  coherence: Ag21EscalationRunbook['coherenceStatus']
): Ag21EscalationRunbookStep[] {
  const base: Ag21EscalationRunbookStep[] =
    tier === 'incident'
      ? [
          { order: 1, action: 'Suppress dashboard surfacing', rationale: 'Validation blocked or telemetry critical.' },
          { order: 2, action: 'Reconcile crosslink packet tags', rationale: 'Align decision/health tags with telemetry rollup.' },
          { order: 3, action: 'Capture replay seed snapshot', rationale: 'Hand off to history modules after coherence check.' }
        ]
      : tier === 'review'
        ? [
            { order: 1, action: 'Schedule operator review', rationale: 'Drift or degraded telemetry requires human sign-off.' },
            { order: 2, action: 'Cross-check playbook hints', rationale: 'Confirm high-priority hints against validation status.' }
          ]
        : tier === 'watch'
          ? [{ order: 1, action: 'Monitor gates and convergence', rationale: 'Hold surface decision until stability improves.' }]
          : [{ order: 1, action: 'Continue lab-only surfacing', rationale: 'No escalation; follow round 7 surface decision.' }];

  if (coherence !== 'coherent') {
    base.push({
      order: base.length + 1,
      action: 'Refresh replay coherence report',
      rationale: `Replay coherence is ${coherence}; rebuild seed before history export.`
    });
  }

  return base;
}

/** Build ordered operator runbook from escalation + replay coherence (round 9). */
export function buildAg21EscalationRunbook(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21EscalationRunbook {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.79),
      actorDebt: baseCtx.actorDebt + 150
    } satisfies Ag21ForecastContext);

  const escalation = resolveAg21OperatorEscalation(baseCtx, candidate);
  const coherence = assessAg21ReplayCoherence(baseCtx, candidate);
  const steps = ag21RunbookStepsForTier(escalation.tier, coherence.status);

  return {
    tier: escalation.tier,
    stepCount: steps.length,
    steps,
    coherenceStatus: coherence.status,
    disclaimer: '(Non-authoritative forecast.) Operator runbook for lab dashboards only.',
    overallUncertainty: ag21LabelUncertainty(
      escalation.tier === 'incident' || coherence.status === 'broken' ? 'high' : 'moderate',
      [`tier=${escalation.tier}`, `coherence=${coherence.status}`]
    ),
    authoritative: false
  };
}

export function runAg21EscalationRunbookSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 9, seed: 44, actorCash: 760, actorDebt: 190, regionsControlled: 2 };
  const runbook = buildAg21EscalationRunbook(ctx);

  push('runbook_steps', runbook.stepCount === runbook.steps.length && runbook.stepCount >= 1, String(runbook.stepCount));
  push('runbook_order', runbook.steps.every((s, i) => s.order === i + 1), runbook.steps.map(s => s.order).join(','));
  push('runbook_tier', ['none', 'watch', 'review', 'incident'].includes(runbook.tier), runbook.tier);
  push('runbook_non_auth', runbook.authoritative === false, runbook.disclaimer.slice(0, 28));

  return out;
}
