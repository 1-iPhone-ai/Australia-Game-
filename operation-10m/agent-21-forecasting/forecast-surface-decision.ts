/**
 * Agent 21 — surface / hold / suppress decision from brief + playbook (read-only round 7).
 */

import { assembleAg21PlayerForecastBrief } from './forecast-player-brief';
import { buildAg21LabPlaybook } from './forecast-lab-playbook';
import { ag21LabelUncertainty, type Ag21UncertaintyBand, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export type Ag21SurfaceDecisionKind = 'surface' | 'hold' | 'suppress';

export interface Ag21SurfaceDecision {
  decision: Ag21SurfaceDecisionKind;
  rationale: string;
  readinessScore: number;
  operatorMode: ReturnType<typeof buildAg21LabPlaybook>['operatorMode'];
  highPriorityHints: number;
  surfacingTier: ReturnType<typeof assembleAg21PlayerForecastBrief>['surfacingTier'];
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21DecisionFromSignals(
  tier: ReturnType<typeof assembleAg21PlayerForecastBrief>['surfacingTier'],
  operatorMode: ReturnType<typeof buildAg21LabPlaybook>['operatorMode'],
  highPriorityHints: number,
  convergenceTone: ReturnType<typeof assembleAg21PlayerForecastBrief>['convergenceTone']
): Ag21SurfaceDecisionKind {
  if (tier === 'red' || operatorMode === 'investigate') return 'suppress';
  if (highPriorityHints >= 2 || convergenceTone === 'divergent') return 'hold';
  if (tier === 'green' && operatorMode === 'surface') return 'surface';
  if (tier === 'amber' && operatorMode !== 'investigate') return 'hold';
  return 'hold';
}

function ag21BandFromDecision(decision: Ag21SurfaceDecisionKind): Ag21UncertaintyBand {
  if (decision === 'surface') return 'low';
  if (decision === 'hold') return 'moderate';
  return 'high';
}

/** Resolve whether lab outputs may surface given round 6 brief + playbook signals. */
export function resolveAg21SurfaceDecision(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21SurfaceDecision {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.77),
      actorDebt: baseCtx.actorDebt + 180
    } satisfies Ag21ForecastContext);

  const brief = assembleAg21PlayerForecastBrief(baseCtx, candidate);
  const playbook = buildAg21LabPlaybook(baseCtx, candidate);
  const highPriorityHints = playbook.hints.filter(h => h.priority === 'high').length;

  const decision = ag21DecisionFromSignals(
    brief.surfacingTier,
    playbook.operatorMode,
    highPriorityHints,
    brief.convergenceTone
  );

  const rationale = `Tier ${brief.surfacingTier} · mode ${playbook.operatorMode} · ${highPriorityHints} high-priority hints · convergence ${brief.convergenceTone}.`;

  return {
    decision,
    rationale,
    readinessScore: brief.readinessScore,
    operatorMode: playbook.operatorMode,
    highPriorityHints,
    surfacingTier: brief.surfacingTier,
    overallUncertainty: ag21LabelUncertainty(ag21BandFromDecision(decision), [
      ...brief.overallUncertainty.factors,
      `decision=${decision}`
    ]),
    authoritative: false
  };
}

export function runAg21SurfaceDecisionSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 12, seed: 44, actorCash: 920, actorDebt: 110, regionsControlled: 2 };
  const resolved = resolveAg21SurfaceDecision(ctx);

  push('surface_decision_kind', ['surface', 'hold', 'suppress'].includes(resolved.decision), resolved.decision);
  push('surface_readiness', resolved.readinessScore >= 0 && resolved.readinessScore <= 100, String(resolved.readinessScore));
  push('surface_hints', resolved.highPriorityHints >= 0, String(resolved.highPriorityHints));
  push('surface_non_auth', resolved.authoritative === false, resolved.rationale);

  return out;
}
