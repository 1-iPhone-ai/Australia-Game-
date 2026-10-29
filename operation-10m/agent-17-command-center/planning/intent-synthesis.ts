import type {
  Acc17CommandCenterOpsState,
  Agent17GameStateSlice,
  Agent17IntentItem,
  Agent17IntentQueueSnapshot,
  Agent17PlanHealthBand,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';
import { defaultObjectiveResolver } from './ops-state.ts';
import { detectAgent17RecoverySignals } from './recovery-paths.ts';

export function buildAgent17IntentQueue(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  planHealth: Agent17PlanHealthBand
): Agent17IntentQueueSnapshot {
  const items: Agent17IntentItem[] = [];
  const push = (item: Agent17IntentItem) => items.push(item);

  const objective = defaultObjectiveResolver(state, settings, actorId);
  if (objective?.title) {
    push({
      id: 'intent_objective',
      priority: 100,
      label: objective.title,
      source: 'objective',
      actionHint: objective.recommendedNextStep?.actionType,
    });
  }

  if (state.gi3Strategy?.headline) {
    push({
      id: 'intent_gi3',
      priority: 90,
      label: state.gi3Strategy.headline,
      source: 'gi3',
      actionHint: 'verify_objective',
    });
  }

  const signals = detectAgent17RecoverySignals(state, actorId);
  if (signals[0]) {
    push({
      id: `intent_recovery_${signals[0].lane}`,
      priority: 80 + Math.min(15, Math.floor(signals[0].severity / 10)),
      label: signals[0].reason,
      source: 'recovery',
      actionHint: 'wait',
    });
  }

  if (planHealth.band === 'at_risk' || planHealth.band === 'critical') {
    push({
      id: 'intent_plan_health',
      priority: 95,
      label: `Plan health ${planHealth.band} (score ${planHealth.score})`,
      source: 'plan_health',
      actionHint: ops.activePlan?.steps.find(s => s.status === 'in_progress')?.actionType,
    });
  }

  if (ops.delegatedProjects.length > 0) {
    push({
      id: 'intent_delegation',
      priority: 70,
      label: `${ops.delegatedProjects.length} active delegation(s)`,
      source: 'delegation',
      actionHint: 'invest',
    });
  }

  items.sort((a, b) => b.priority - a.priority);
  return {
    items: items.slice(0, 8),
    primaryIntentId: items[0]?.id ?? null,
    queueDepth: items.length,
  };
}

export function intentQueueRequiresRecovery(intent: Agent17IntentQueueSnapshot): boolean {
  return intent.items.some(i => i.source === 'recovery' && i.priority >= 90);
}
