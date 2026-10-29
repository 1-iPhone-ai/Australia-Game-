import type {
  Acc17CommandCenterOpsState,
  Acc17MultiStepPlan,
  Agent17ActorSlice,
  Agent17GameStateSlice,
} from '../types/command-center-types.ts';
import { AGENT17_PROJECT_TEMPLATE_CATALOG, acc17InstantiatePlanFromTemplate } from './templates.ts';

export type Agent17RecoveryLane =
  | 'liquidity_crisis'
  | 'supply_collapse'
  | 'regional_exposure'
  | 'debt_pressure'
  | 'plan_blocked';

export interface Agent17RecoverySignal {
  lane: Agent17RecoveryLane;
  severity: number;
  reason: string;
}

export interface Agent17RecoveryDecision {
  templateId: string;
  lane: Agent17RecoveryLane;
  rationale: string;
}

const RECOVERY_TEMPLATE_BY_LANE: Record<Agent17RecoveryLane, string> = {
  liquidity_crisis: 'agent17_tpl_deep_capital_program',
  supply_collapse: 'agent17_tpl_supply_deep_recovery',
  regional_exposure: 'agent17_tpl_regional_recovery',
  debt_pressure: 'agent17_tpl_debt_recovery',
  plan_blocked: 'agent17_tpl_crisis_stabilization',
};

function readActor(state: Agent17GameStateSlice, actorId: string): Agent17ActorSlice {
  return (
    state.actorsById?.[actorId] ||
    (actorId === 'player' ? state.player : undefined) ||
    {}
  );
}

/** Derive recovery lanes from lightweight state slices (no canonical TSX imports). */
export function detectAgent17RecoverySignals(
  state: Agent17GameStateSlice,
  actorId: string
): Agent17RecoverySignal[] {
  const actor = readActor(state, actorId);
  const signals: Agent17RecoverySignal[] = [];
  const cash = actor.money ?? 0;
  const netWorth = actor.netWorth ?? cash;
  const supplies =
    typeof (actor as { currentSupplies?: number }).currentSupplies === 'number'
      ? (actor as { currentSupplies: number }).currentSupplies
      : 100;
  const region = actor.currentRegion || actor.currentLocation || '';

  if (cash < 400) {
    signals.push({
      lane: 'liquidity_crisis',
      severity: Math.min(100, Math.round(100 - cash / 4)),
      reason: `Cash $${cash} below liquidity crisis threshold.`,
    });
  }
  if (supplies < 35) {
    signals.push({
      lane: 'supply_collapse',
      severity: Math.min(100, Math.round(100 - supplies)),
      reason: `Supplies ${supplies} critically low.`,
    });
  }
  if (netWorth > 0 && cash / netWorth < 0.08) {
    signals.push({
      lane: 'debt_pressure',
      severity: 70,
      reason: 'Cash to net-worth ratio indicates debt pressure.',
    });
  }
  if (region === 'QLD' && cash < 1200) {
    signals.push({
      lane: 'regional_exposure',
      severity: 55,
      reason: 'High exposure region with thin reserves.',
    });
  }
  return signals.sort((a, b) => b.severity - a.severity);
}

export function pickAgent17RecoveryTemplateId(
  signals: Agent17RecoverySignal[],
  planBlocked: boolean
): Agent17RecoveryDecision | null {
  if (planBlocked) {
    const top = signals[0];
    const lane = top?.lane ?? 'plan_blocked';
    return {
      templateId: RECOVERY_TEMPLATE_BY_LANE[lane] ?? RECOVERY_TEMPLATE_BY_LANE.plan_blocked,
      lane: top ? lane : 'plan_blocked',
      rationale: top
        ? `Blocked plan; escalating ${top.lane} recovery.`
        : 'Blocked plan; applying crisis stabilization sequence.',
    };
  }
  const top = signals[0];
  if (!top || top.severity < 40) return null;
  return {
    templateId: RECOVERY_TEMPLATE_BY_LANE[top.lane],
    lane: top.lane,
    rationale: top.reason,
  };
}

export function listAgent17RecoveryTemplateIds(): string[] {
  return Object.values(RECOVERY_TEMPLATE_BY_LANE).filter(
    (id, idx, arr) => arr.indexOf(id) === idx
  );
}

export function replanAcc17WithRecoveryTemplate(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  actorId: string,
  decision: Agent17RecoveryDecision
): Acc17CommandCenterOpsState {
  const replacement = acc17InstantiatePlanFromTemplate(decision.templateId, state, actorId);
  if (!replacement) return ops;
  const priorPlan = ops.activePlan;
  const replanCount = (priorPlan?.replanCount ?? 0) + 1;
  const plan: Acc17MultiStepPlan = {
    ...replacement,
    replanCount,
    objectiveSource: `recovery:${decision.lane}:${decision.templateId}`,
    title: `Recovery (${decision.lane}): ${replacement.title}`,
  };
  return {
    ...ops,
    activePlan: plan,
    delegatedProjects: [],
  };
}

/** When the active plan has blocked/failed steps, attempt a recovery replan. */
export function maybeApplyAgent17RecoveryPath(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  actorId: string
): { ops: Acc17CommandCenterOpsState; applied: boolean; decision?: Agent17RecoveryDecision } {
  const blocked =
    ops.activePlan?.steps.some(s => s.status === 'blocked' || s.status === 'failed') ?? false;
  const signals = detectAgent17RecoverySignals(state, actorId);
  const decision = pickAgent17RecoveryTemplateId(signals, blocked);
  if (!decision) return { ops, applied: false };
  if (!blocked && (signals[0]?.severity ?? 0) < 40) return { ops, applied: false };
  const nextOps = replanAcc17WithRecoveryTemplate(ops, state, actorId, decision);
  const changed = nextOps.activePlan?.id !== ops.activePlan?.id;
  return { ops: changed ? nextOps : ops, applied: changed, decision: changed ? decision : undefined };
}

export function resolveTemplateById(templateId: string) {
  return AGENT17_PROJECT_TEMPLATE_CATALOG.find(t => t.id === templateId);
}
