/**
 * Agent 21 — lab operator playbook hints (regret + gates + brief, read-only).
 */

import { evaluateAg21ReliabilityGates } from './forecast-reliability-gates';
import { rankAg21PolicyRegret } from './forecast-policy-regret';
import { assembleAg21PlayerForecastBrief } from './forecast-player-brief';
import { ag21LabelUncertainty, type Ag21UncertaintyBand, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export interface Ag21LabPlaybookHint {
  id: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
  rationale: string;
}

export interface Ag21LabPlaybook {
  hints: Ag21LabPlaybookHint[];
  lowestRegretBranchId: string | null;
  gatePassRatio: number;
  briefHeadline: string;
  operatorMode: 'investigate' | 'monitor' | 'surface';
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21OperatorMode(
  gatePassRatio: number,
  readinessScore: number
): Ag21LabPlaybook['operatorMode'] {
  if (gatePassRatio >= 0.66 && readinessScore >= 60) return 'surface';
  if (gatePassRatio >= 0.33 || readinessScore >= 45) return 'monitor';
  return 'investigate';
}

function ag21BandFromMode(mode: Ag21LabPlaybook['operatorMode']): Ag21UncertaintyBand {
  if (mode === 'surface') return 'low';
  if (mode === 'monitor') return 'moderate';
  return 'high';
}

/** Build operator playbook hints from regret, gates, and assembled brief. */
export function buildAg21LabPlaybook(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabPlaybook {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.78),
      actorDebt: baseCtx.actorDebt + 160
    } satisfies Ag21ForecastContext);

  const gates = evaluateAg21ReliabilityGates(baseCtx, candidate);
  const regret = rankAg21PolicyRegret(baseCtx);
  const brief = assembleAg21PlayerForecastBrief(baseCtx, candidate);

  const gatePassRatio = gates.passCount / Math.max(1, gates.gates.length);
  const hints: Ag21LabPlaybookHint[] = [];

  if (gatePassRatio < 0.66) {
    hints.push({
      id: 'recheck_gates',
      priority: 'high',
      action: 'Re-run reliability gates after adjusting stress context.',
      rationale: `Only ${gates.passCount}/${gates.gates.length} gates passed.`
    });
  }

  if (regret.rows.length >= 2) {
    const spread = Math.abs(regret.rows[regret.rows.length - 1].regretScore - regret.rows[0].regretScore);
    if (spread > 0.35) {
      hints.push({
        id: 'compare_regret',
        priority: 'medium',
        action: `Compare branch ${regret.lowestRegretBranchId ?? 'baseline'} against highest-regret path.`,
        rationale: `Regret spread ${spread.toFixed(2)} exceeds comfort band.`
      });
    }
  }

  if (brief.convergenceTone === 'divergent') {
    hints.push({
      id: 'fusion_reconcile',
      priority: 'high',
      action: 'Reconcile ensemble dispersion with scenario fusion before surfacing.',
      rationale: 'Ensemble/fusion convergence is divergent.'
    });
  } else if (brief.surfacingTier === 'green') {
    hints.push({
      id: 'surface_brief',
      priority: 'low',
      action: 'Brief may surface with standard non-authoritative disclaimer.',
      rationale: brief.headline
    });
  }

  if (!hints.length) {
    hints.push({
      id: 'hold_monitor',
      priority: 'medium',
      action: 'Continue monitoring; no urgent lab intervention required.',
      rationale: `Operator mode ${ag21OperatorMode(gatePassRatio, brief.readinessScore)}.`
    });
  }

  const operatorMode = ag21OperatorMode(gatePassRatio, brief.readinessScore);

  return {
    hints,
    lowestRegretBranchId: regret.lowestRegretBranchId,
    gatePassRatio,
    briefHeadline: brief.headline,
    operatorMode,
    overallUncertainty: ag21LabelUncertainty(ag21BandFromMode(operatorMode), [`mode=${operatorMode}`]),
    authoritative: false
  };
}

export function runAg21LabPlaybookSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 8, seed: 52, actorCash: 810, actorDebt: 140, regionsControlled: 2 };
  const playbook = buildAg21LabPlaybook(ctx);

  push('playbook_hints', playbook.hints.length >= 1, String(playbook.hints.length));
  push('playbook_mode', ['investigate', 'monitor', 'surface'].includes(playbook.operatorMode), playbook.operatorMode);
  push('playbook_ratio', playbook.gatePassRatio >= 0 && playbook.gatePassRatio <= 1, String(playbook.gatePassRatio));
  push('playbook_non_auth', playbook.authoritative === false, playbook.briefHeadline);

  return out;
}
