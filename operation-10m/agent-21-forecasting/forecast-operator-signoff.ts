/**
 * Agent 21 — operator signoff checklist from readiness + runbook (read-only round 10).
 */

import { evaluateAg21HandoffReadiness } from './forecast-handoff-readiness';
import { buildAg21EscalationRunbook } from './forecast-escalation-runbook';
import { ag21LabelUncertainty, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export interface Ag21OperatorSignoffItem {
  id: string;
  label: string;
  satisfied: boolean;
}

export interface Ag21OperatorSignoffRecord {
  signoffId: string;
  readinessStatus: ReturnType<typeof evaluateAg21HandoffReadiness>['status'];
  items: Ag21OperatorSignoffItem[];
  satisfiedCount: number;
  mayStage: boolean;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Build operator signoff checklist before lab staging export (round 10). */
export function buildAg21OperatorSignoffRecord(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21OperatorSignoffRecord {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.77),
      actorDebt: baseCtx.actorDebt + 175
    } satisfies Ag21ForecastContext);

  const readiness = evaluateAg21HandoffReadiness(baseCtx, candidate);
  const runbook = buildAg21EscalationRunbook(baseCtx, candidate);

  const items: Ag21OperatorSignoffItem[] = [
    {
      id: 'readiness_clear',
      label: 'Handoff readiness not blocked',
      satisfied: readiness.status !== 'blocked'
    },
    {
      id: 'coherence_ok',
      label: 'Replay coherence not broken',
      satisfied: readiness.coherenceStatus !== 'broken'
    },
    {
      id: 'runbook_reviewed',
      label: 'Runbook steps acknowledged',
      satisfied: runbook.stepCount >= 1 && runbook.steps.every(s => s.action.length > 5)
    },
    {
      id: 'escalation_not_incident',
      label: 'No active incident tier',
      satisfied: readiness.escalationTier !== 'incident'
    }
  ];

  const satisfiedCount = items.filter(i => i.satisfied).length;
  const mayStage = readiness.status === 'ready' && satisfiedCount === items.length;
  const signoffId = `ag21_signoff_${baseCtx.turn}_${baseCtx.seed}_${readiness.status}`;

  return {
    signoffId,
    readinessStatus: readiness.status,
    items,
    satisfiedCount,
    mayStage,
    disclaimer: '(Non-authoritative forecast.) Operator signoff for lab staging only.',
    overallUncertainty: ag21LabelUncertainty(
      mayStage ? 'low' : readiness.status === 'blocked' ? 'high' : 'moderate',
      [`signoff=${signoffId}`, `satisfied=${satisfiedCount}`]
    ),
    authoritative: false
  };
}

export function runAg21OperatorSignoffSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 12, seed: 33, actorCash: 850, actorDebt: 140, regionsControlled: 2 };
  const signoff = buildAg21OperatorSignoffRecord(ctx);

  push('signoff_id', signoff.signoffId.startsWith('ag21_signoff_'), signoff.signoffId);
  push('signoff_items', signoff.items.length === 4, String(signoff.items.length));
  push('signoff_count', signoff.satisfiedCount <= signoff.items.length, String(signoff.satisfiedCount));
  push('signoff_non_auth', signoff.authoritative === false, signoff.disclaimer.slice(0, 28));

  return out;
}
