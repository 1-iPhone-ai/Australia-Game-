import type {
  Acc17CommandCenterOpsState,
  Acc17DelegateTargetKind,
  Acc17DelegatedProject,
  Acc17MultiStepPlan,
  Acc17MultiStepPlanStep,
  Acc17PlanStepStatus,
  Acc17ProjectDelegationStatus,
  Acc17VerifiedExecutionLogEntry,
  Acc17V94DeepContextBundle,
  Agent17GameStateSlice,
  Agent17SettingsSlice,
  ResolvedObjective,
} from '../types/command-center-types.ts';
import { acc17ComputeRelevantStateFingerprint } from './fingerprint.ts';

export function createDefaultAcc17CommandCenterOpsState(): Acc17CommandCenterOpsState {
  return {
    version: 1,
    activePlan: null,
    delegatedProjects: [],
    verificationLog: [],
    lastContextFingerprint: '',
    enabled: true,
  };
}

function acc17DelegateFallbackId(kind: Acc17DelegateTargetKind): string {
  if (kind === 'team_os') return 'team_os';
  if (kind === 'strategy_planner') return 'strategy_planner';
  return 'copilot';
}

export function sanitizeAcc17CommandCenterOpsState(input: unknown): Acc17CommandCenterOpsState {
  const defaults = createDefaultAcc17CommandCenterOpsState();
  if (!input || typeof input !== 'object') return defaults;
  const obj = input as Record<string, unknown>;
  const enabled = typeof obj.enabled === 'boolean' ? obj.enabled : defaults.enabled;
  const lastContextFingerprint =
    typeof obj.lastContextFingerprint === 'string' ? obj.lastContextFingerprint : '';

  let activePlan: Acc17MultiStepPlan | null = null;
  if (obj.activePlan && typeof obj.activePlan === 'object') {
    const p = obj.activePlan as Record<string, unknown>;
    const steps: Acc17MultiStepPlanStep[] = Array.isArray(p.steps)
      ? (p.steps as unknown[]).map((raw, idx) => {
          const s = raw as Record<string, unknown>;
          const statusList: Acc17PlanStepStatus[] = [
            'pending',
            'in_progress',
            'verified_complete',
            'failed',
            'skipped',
            'blocked',
          ];
          const status = statusList.includes(s?.status as Acc17PlanStepStatus)
            ? (s.status as Acc17PlanStepStatus)
            : 'pending';
          return {
            id: String(s?.id || `step_${idx}`),
            index: typeof s?.index === 'number' ? s.index : idx,
            title: String(s?.title || 'Step'),
            summary: String(s?.summary || ''),
            actionType: String(s?.actionType || 'wait'),
            requirements:
              s?.requirements && typeof s.requirements === 'object'
                ? (s.requirements as Acc17MultiStepPlanStep['requirements'])
                : {},
            status,
            verifiedOnTurn: typeof s?.verifiedOnTurn === 'number' ? s.verifiedOnTurn : undefined,
            verifiedOnDay: typeof s?.verifiedOnDay === 'number' ? s.verifiedOnDay : undefined,
            verifiedStateFingerprint:
              typeof s?.verifiedStateFingerprint === 'string'
                ? s.verifiedStateFingerprint
                : undefined,
            lastEvaluationFingerprint:
              typeof s?.lastEvaluationFingerprint === 'string'
                ? s.lastEvaluationFingerprint
                : undefined,
            blockerReason: typeof s?.blockerReason === 'string' ? s.blockerReason : undefined,
          };
        })
      : [];
    activePlan = {
      id: String(p.id || 'plan'),
      title: String(p.title || 'Plan'),
      objectiveSource: typeof p.objectiveSource === 'string' ? p.objectiveSource : undefined,
      createdTurn: typeof p.createdTurn === 'number' ? p.createdTurn : 1,
      createdDay: typeof p.createdDay === 'number' ? p.createdDay : 1,
      steps,
      activeStepIndex:
        typeof p.activeStepIndex === 'number'
          ? Math.max(0, Math.min(steps.length, p.activeStepIndex))
          : 0,
      completionPercent: typeof p.completionPercent === 'number' ? p.completionPercent : 0,
      isOnTrack: p.isOnTrack !== false,
      replanCount: typeof p.replanCount === 'number' ? p.replanCount : 0,
    };
  }

  const statusList: Acc17ProjectDelegationStatus[] = [
    'draft',
    'delegated',
    'executing',
    'awaiting_verification',
    'completed',
    'cancelled',
    'blocked',
  ];
  const kindList: Acc17DelegateTargetKind[] = [
    'copilot',
    'team_os',
    'teammate',
    'strategy_planner',
    'manual',
  ];

  const delegatedProjects: Acc17DelegatedProject[] = Array.isArray(obj.delegatedProjects)
    ? (obj.delegatedProjects as unknown[]).slice(0, 32).map((raw, i) => {
        const d = raw as Record<string, unknown>;
        const delegateKind = kindList.includes(d?.delegateKind as Acc17DelegateTargetKind)
          ? (d.delegateKind as Acc17DelegateTargetKind)
          : 'copilot';
        return {
          id: String(d?.id || `proj_${i}`),
          planId: String(d?.planId || ''),
          title: String(d?.title || 'Project'),
          delegateKind,
          delegateTargetId: String(
            d?.delegateTargetId || acc17DelegateFallbackId(delegateKind)
          ),
          status: statusList.includes(d?.status as Acc17ProjectDelegationStatus)
            ? (d.status as Acc17ProjectDelegationStatus)
            : 'draft',
          authorityCeiling: (['advisory', 'assisted', 'delegated'] as const).includes(
            d?.authorityCeiling as 'advisory'
          )
            ? (d.authorityCeiling as Acc17DelegatedProject['authorityCeiling'])
            : 'assisted',
          assignedTurn: typeof d?.assignedTurn === 'number' ? d.assignedTurn : 1,
          assignedDay: typeof d?.assignedDay === 'number' ? d.assignedDay : 1,
          lastVerifiedFingerprint:
            typeof d?.lastVerifiedFingerprint === 'string' ? d.lastVerifiedFingerprint : '',
          pendingVerificationStepId:
            typeof d?.pendingVerificationStepId === 'string'
              ? d.pendingVerificationStepId
              : undefined,
          notes: String(d?.notes || ''),
        };
      })
    : [];

  const verificationLog: Acc17VerifiedExecutionLogEntry[] = Array.isArray(obj.verificationLog)
    ? (obj.verificationLog as unknown[]).slice(-120).map((raw, i) => {
        const e = raw as Record<string, unknown>;
        return {
          id: String(e?.id || `vlog_${i}`),
          turn: typeof e?.turn === 'number' ? e.turn : 1,
          day: typeof e?.day === 'number' ? e.day : 1,
          stepId: String(e?.stepId || ''),
          projectId: String(e?.projectId || ''),
          fingerprintBefore: String(e?.fingerprintBefore || ''),
          fingerprintAfter: String(e?.fingerprintAfter || ''),
          verified: e?.verified === true,
          reason: String(e?.reason || ''),
        };
      })
    : [];

  const lastContextBundle =
    obj.lastContextBundle && typeof obj.lastContextBundle === 'object'
      ? (obj.lastContextBundle as Acc17V94DeepContextBundle)
      : undefined;

  return {
    version: 1,
    enabled,
    activePlan,
    delegatedProjects,
    verificationLog,
    lastContextFingerprint,
    lastContextBundle,
  };
}

export function acc17CreateMultiStepPlanFromObjective(
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  resolveObjective: (
    state: Agent17GameStateSlice,
    settings: Agent17SettingsSlice,
    actorId: string
  ) => ResolvedObjective | null
): Acc17MultiStepPlan | null {
  const objective = resolveObjective(state, settings, actorId);
  if (!objective?.title) return null;
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || 1;
  const planId = `acc17_obj_${objective.sourceType || 'goal'}_${turn}`;
  const next = objective.recommendedNextStep;
  const steps: Acc17MultiStepPlanStep[] = [
    {
      id: `${planId}_s0`,
      index: 0,
      title: 'Align with tracked objective',
      summary: objective.description || objective.title,
      actionType: next?.actionType || 'wait',
      requirements: {},
      status: 'in_progress',
    },
    {
      id: `${planId}_s1`,
      index: 1,
      title: next?.label || 'Execute recommended move',
      summary: 'Complete the recommended next step from the intent layer.',
      actionType: next?.actionType || 'wait',
      requirements: {},
      status: 'pending',
    },
    {
      id: `${planId}_s2`,
      index: 2,
      title: 'Verify objective progress',
      summary: 'Confirm goal progress after a verified state change.',
      actionType: 'verify_objective',
      requirements: {},
      status: 'pending',
    },
  ];
  return {
    id: planId,
    title: `Plan: ${objective.title}`,
    objectiveSource: objective.sourceId,
    createdTurn: turn,
    createdDay: day,
    steps,
    activeStepIndex: 0,
    completionPercent: 0,
    isOnTrack: true,
    replanCount: 0,
  };
}

export function defaultObjectiveResolver(
  state: Agent17GameStateSlice,
  _settings: Agent17SettingsSlice,
  actorId: string
): ResolvedObjective | null {
  const tracked = state.playerTrackedObjective;
  if (!tracked?.title) return null;
  return {
    title: tracked.title,
    description: tracked.description,
    sourceType: tracked.sourceType,
    sourceId: tracked.sourceId,
    recommendedNextStep: tracked.recommendedNextStep,
  };
}

function acc17StepRequirementsMet(
  step: Acc17MultiStepPlanStep,
  state: Agent17GameStateSlice,
  actorId: string,
  completedIds: Set<string>
): boolean {
  const req = step.requirements || {};
  const actor =
    state.actorsById?.[actorId] || (actorId === 'player' ? state.player : undefined) || {};
  if (typeof req.minCash === 'number' && (actor.money || 0) < req.minCash) return false;
  if (typeof req.minNetWorth === 'number' && (actor.netWorth || actor.money || 0) < req.minNetWorth)
    return false;
  const region = actor.currentRegion || actor.currentLocation || '';
  if (req.requiredRegion && region !== req.requiredRegion) return false;
  if (Array.isArray(req.prerequisiteStepIds)) {
    for (const pid of req.prerequisiteStepIds) {
      if (!completedIds.has(pid)) return false;
    }
  }
  return true;
}

function acc17DetectActionMatch(step: Acc17MultiStepPlanStep, state: Agent17GameStateSlice): boolean {
  const last = state.lastExecutedAction || state.lastAction;
  const lastType = typeof last === 'string' ? last : last?.type || last?.actionType || '';
  if (!lastType) return false;
  if (step.actionType === 'verify_objective') {
    return (
      String(lastType).includes('objective') ||
      String(lastType).includes('contract') ||
      String(lastType).includes('track')
    );
  }
  return String(lastType) === step.actionType || String(lastType).includes(step.actionType);
}

export function acc17AdvanceVerifiedPlanProgress(
  plan: Acc17MultiStepPlan,
  state: Agent17GameStateSlice,
  actorId: string,
  previousFingerprint: string
): { plan: Acc17MultiStepPlan; logEntries: Acc17VerifiedExecutionLogEntry[]; fingerprint: string } {
  const fingerprint = acc17ComputeRelevantStateFingerprint(state, actorId);
  const logEntries: Acc17VerifiedExecutionLogEntry[] = [];
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || 1;
  const stateChanged = fingerprint !== previousFingerprint && previousFingerprint !== '';
  const completedIds = new Set(
    plan.steps.filter(s => s.status === 'verified_complete').map(s => s.id)
  );
  const steps = plan.steps.map(s => ({ ...s }));
  let activeStepIndex = plan.activeStepIndex;

  if (stateChanged) {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (step.status === 'verified_complete' || step.status === 'skipped') continue;
      step.lastEvaluationFingerprint = fingerprint;
      if (!acc17StepRequirementsMet(step, state, actorId, completedIds)) {
        step.status = 'blocked';
        step.blockerReason = 'Requirements not satisfied after state change.';
        continue;
      }
      if (step.status === 'pending' && i === activeStepIndex) step.status = 'in_progress';
      if (step.status === 'in_progress' && acc17DetectActionMatch(step, state)) {
        step.status = 'verified_complete';
        step.verifiedOnTurn = turn;
        step.verifiedOnDay = day;
        step.verifiedStateFingerprint = fingerprint;
        completedIds.add(step.id);
        logEntries.push({
          id: `acc17_v_${step.id}_${turn}`,
          turn,
          day,
          stepId: step.id,
          projectId: plan.id,
          fingerprintBefore: previousFingerprint,
          fingerprintAfter: fingerprint,
          verified: true,
          reason: 'Verified after canonical state change matched step.',
        });
      }
    }
  }

  while (activeStepIndex < steps.length && steps[activeStepIndex]?.status === 'verified_complete') {
    activeStepIndex++;
  }
  if (activeStepIndex < steps.length && steps[activeStepIndex]?.status === 'pending') {
    steps[activeStepIndex].status = 'in_progress';
  }
  const done = steps.filter(s => s.status === 'verified_complete').length;
  const completionPercent = steps.length ? Math.round((done / steps.length) * 100) : 100;
  const blocked = steps.some(s => s.status === 'blocked');
  return {
    plan: {
      ...plan,
      steps,
      activeStepIndex,
      completionPercent,
      isOnTrack: !blocked && completionPercent < 100,
    },
    logEntries,
    fingerprint,
  };
}

export function acc17DelegateProject(
  ops: Acc17CommandCenterOpsState,
  plan: Acc17MultiStepPlan,
  delegateKind: Acc17DelegateTargetKind,
  delegateTargetId: string,
  authorityCeiling: Acc17DelegatedProject['authorityCeiling'] = 'assisted'
): Acc17DelegatedProject {
  return {
    id: `acc17_proj_${plan.id}_${ops.delegatedProjects.length}`,
    planId: plan.id,
    title: plan.title,
    delegateKind,
    delegateTargetId,
    status: 'delegated',
    authorityCeiling,
    assignedTurn: plan.createdTurn,
    assignedDay: plan.createdDay,
    lastVerifiedFingerprint: '',
    notes: `Delegated to ${delegateKind}:${delegateTargetId}`,
  };
}
