import type {
  Acc17CommandCenterOpsState,
  Acc17DelegateTargetKind,
  Acc17OperationsSnapshot,
  Acc17V94DeepContextSlice,
  Agent17ContextAdapters,
  Agent17GameStateSlice,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';
import { acc17ComputeRelevantStateFingerprint } from '../planning/fingerprint.ts';
import {
  acc17AdvanceVerifiedPlanProgress,
  acc17CreateMultiStepPlanFromObjective,
  acc17DelegateProject,
  defaultObjectiveResolver,
  sanitizeAcc17CommandCenterOpsState,
} from '../planning/ops-state.ts';

export function buildAcc17V94DeepContextBundle(
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  adapters: Agent17ContextAdapters = {}
): import('../types/command-center-types.ts').Acc17V94DeepContextBundle {
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || 1;
  const fingerprint = acc17ComputeRelevantStateFingerprint(state, actorId);
  const actor =
    state.actorsById?.[actorId] || (actorId === 'player' ? state.player : undefined) || {
      id: actorId,
    };
  const slices: Acc17V94DeepContextSlice[] = [];
  const pushSlice = (
    key: string,
    label: string,
    summary: string,
    weight: number,
    tags: string[] = []
  ) => {
    if (summary) slices.push({ key, label, summary, weight, tags });
  };

  try {
    const objective = adapters.resolveObjective
      ? adapters.resolveObjective(state, settings, actor, state.playerTrackedObjective)
      : defaultObjectiveResolver(state, settings, actorId);
    if (objective?.title) {
      pushSlice(
        'objective',
        'Current objective',
        `${objective.title} — ${objective.description || ''}`,
        10,
        ['intent']
      );
    }
  } catch {
    /* noop */
  }

  if (adapters.classifyAttention) {
    try {
      const attention = adapters.classifyAttention(state, settings, actor);
      if (attention?.label) {
        pushSlice('attention', 'Attention', `${attention.label}: ${attention.detail || ''}`, 9, [
          'risk',
        ]);
      }
    } catch {
      /* noop */
    }
  }

  const gi3 = state.gi3Strategy;
  if (gi3?.headline) pushSlice('gi3', 'Strategy', String(gi3.headline), 8, ['gi3']);
  const planner = state.strategyPlannerState?.activePlan;
  if (planner?.title) pushSlice('planner', 'Planner', `Blueprint: ${planner.title}`, 7, ['planner']);
  pushSlice(
    'economy',
    'Economy',
    `Cash $${Number(actor.money || 0).toLocaleString()}`,
    5,
    ['economy']
  );
  slices.sort((a, b) => b.weight - a.weight);
  return {
    actorId,
    turn,
    day,
    fingerprint,
    headline: slices[0]?.summary || 'Deep context ready.',
    slices: slices.slice(0, 12),
    objectiveTitle: slices.find(s => s.key === 'objective')?.summary.split(' — ')[0],
    attentionLabel: slices.find(s => s.key === 'attention')?.label,
    strategyHeadline: slices.find(s => s.key === 'gi3')?.summary,
  };
}

export function evaluateAcc17CommandCenterOperations(
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  persisted: Acc17CommandCenterOpsState,
  adapters: Agent17ContextAdapters = {}
): { ops: Acc17CommandCenterOpsState; snapshot: Acc17OperationsSnapshot } {
  const enabled = persisted.enabled !== false && settings?.commandCenterSettings?.enabled !== false;
  const deepContext = buildAcc17V94DeepContextBundle(state, settings, actorId, adapters);
  let ops = sanitizeAcc17CommandCenterOpsState(persisted);
  if (!enabled) {
    return {
      ops,
      snapshot: {
        deepContext,
        activePlan: null,
        delegatedProjects: [],
        pendingVerificationCount: 0,
        verifiedStepsThisTurn: 0,
        blockedSteps: [],
        recommendedDelegateKind: 'copilot',
      },
    };
  }
  if (!ops.activePlan) {
    const fromObjective = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      actorId,
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    if (fromObjective) ops = { ...ops, activePlan: fromObjective };
  }
  const prevFp = ops.lastContextFingerprint || '';
  if (ops.activePlan) {
    const { plan, logEntries, fingerprint } = acc17AdvanceVerifiedPlanProgress(
      ops.activePlan,
      state,
      actorId,
      prevFp
    );
    ops = {
      ...ops,
      activePlan: plan,
      lastContextFingerprint: fingerprint,
      lastContextBundle: deepContext,
      verificationLog: [...ops.verificationLog, ...logEntries].slice(-200),
    };
    if (ops.delegatedProjects.length === 0 && plan.completionPercent < 100) {
      ops = {
        ...ops,
        delegatedProjects: [
          acc17DelegateProject(ops, plan, 'copilot', 'copilot_session', 'assisted'),
        ],
      };
    }
  } else {
    ops = { ...ops, lastContextFingerprint: deepContext.fingerprint, lastContextBundle: deepContext };
  }
  const blockedSteps =
    ops.activePlan?.steps.filter(s => s.status === 'blocked' || s.status === 'failed') || [];
  const pendingVerificationCount =
    ops.activePlan?.steps.filter(s => s.status === 'in_progress').length || 0;
  const verifiedStepsThisTurn = ops.verificationLog.filter(
    e => e.turn === (state.turnCounter || 1) && e.verified
  ).length;
  const autonomy = settings?.aiCommunicationAutonomyLevel;
  const recommendedDelegateKind: Acc17DelegateTargetKind =
    autonomy === 'delegated'
      ? 'team_os'
      : autonomy === 'assisted'
        ? 'copilot'
        : 'strategy_planner';
  return {
    ops,
    snapshot: {
      deepContext,
      activePlan: ops.activePlan,
      delegatedProjects: ops.delegatedProjects,
      pendingVerificationCount,
      verifiedStepsThisTurn,
      blockedSteps,
      recommendedDelegateKind,
    },
  };
}
