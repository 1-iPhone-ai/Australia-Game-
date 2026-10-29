import type {
  Acc17CommandCenterOpsState,
  Acc17DelegateTargetKind,
  Acc17OperationsSnapshot,
  Agent17PlanningDepthSnapshot,
  Agent17PlanningSuggestion,
  Agent17GameStateSlice,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';
import { assessAgent17PlanHealth, planHealthNeedsRecovery } from './plan-health.ts';
import {
  buildAgent17DelegationAnalytics,
  pickAgent17DelegateKindFromAnalytics,
} from './delegation-analytics.ts';
import {
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from './template-selector.ts';
import { detectAgent17RecoverySignals, pickAgent17RecoveryTemplateId } from './recovery-paths.ts';
import { buildAgent17DelegationLadder } from './delegation-ladder.ts';
import { summarizeAgent17PlanLedger } from './plan-ledger.ts';
import { refineAgent17DelegationSuggestion } from './delegation-depth.ts';
import { buildAgent17IntentQueue } from './intent-synthesis.ts';
import { buildAgent17VerificationPolicy } from './verification-policy.ts';
import { buildAgent17CoordinationBrief } from './coordination-brief.ts';
import { buildAgent17ExecutionPacing } from './execution-pacing.ts';
import { buildAgent17ResilienceScorecard } from './resilience-scorecard.ts';
import { buildAgent17StrategicAlignment } from './strategic-alignment.ts';
import { buildAgent17HandoffReadiness } from './handoff-readiness.ts';
import { buildAgent17CommandPosture } from './command-posture.ts';
import { buildAgent17GovernanceAudit } from './governance-audit.ts';
import { buildAgent17EscalationMatrix } from './escalation-matrix.ts';
import { buildAgent17RollbackAssurance } from './rollback-assurance.ts';

export function buildAgent17PlanningSuggestion(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  recommendedDelegateKind: Acc17DelegateTargetKind
): Agent17PlanningSuggestion {
  const plan = ops.activePlan;
  const health = assessAgent17PlanHealth(plan, state, actorId);
  const blocked = plan?.steps.some(s => s.status === 'blocked' || s.status === 'failed') ?? false;
  const signals = detectAgent17RecoverySignals(state, actorId);
  const recovery = pickAgent17RecoveryTemplateId(signals, blocked);
  if (recovery && (blocked || planHealthNeedsRecovery(health))) {
    return {
      kind: 'recovery',
      templateId: recovery.templateId,
      headline: `Recovery lane: ${recovery.lane}`,
      rationale: recovery.rationale,
      confidence: Math.min(0.95, 0.55 + (signals[0]?.severity ?? 40) / 200),
    };
  }
  const routing = rankAgent17TemplateCandidates(state, settings, actorId);
  const templateId = routing.candidateTemplateIds[0];
  if (templateId && (!plan || health.band === 'steady' || health.band === 'strong')) {
    return {
      kind: 'template',
      templateId,
      headline: `Route ${routing.matchedCategory} → ${templateId}`,
      rationale: `Category ${routing.matchedCategory} from objective and state cues.`,
      confidence: 0.72,
    };
  }
  const analytics = buildAgent17DelegationAnalytics(ops, settings);
  const delegateKind = pickAgent17DelegateKindFromAnalytics(analytics, recommendedDelegateKind);
  if (plan && plan.completionPercent < 100) {
    return {
      kind: 'delegate',
      delegateKind,
      headline: `Delegate via ${delegateKind}`,
      rationale: 'Active plan incomplete; delegation analytics favor this target.',
      confidence: 0.65,
    };
  }
  return {
    kind: 'hold',
    headline: 'Hold planning posture',
    rationale: 'No recovery, template, or delegation action required this turn.',
    confidence: 0.5,
  };
}

export function buildAgent17PlanningDepthSnapshot(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  recommendedDelegateKind: Acc17DelegateTargetKind
): Agent17PlanningDepthSnapshot {
  const turn = state.turnCounter || state.day || 1;
  const planHealth = assessAgent17PlanHealth(ops.activePlan, state, actorId);
  const templateRouting = rankAgent17TemplateCandidates(state, settings, actorId);
  const delegationAnalytics = buildAgent17DelegationAnalytics(ops, settings);
  const delegationLadder = buildAgent17DelegationLadder(
    delegationAnalytics,
    settings,
    recommendedDelegateKind
  );
  const planLedger = summarizeAgent17PlanLedger(ops, state);
  let suggestion = buildAgent17PlanningSuggestion(
    ops,
    state,
    settings,
    actorId,
    recommendedDelegateKind
  );
  suggestion = refineAgent17DelegationSuggestion(
    ops,
    state,
    settings,
    actorId,
    suggestion,
    recommendedDelegateKind
  );
  const intentQueue = buildAgent17IntentQueue(ops, state, settings, actorId, planHealth);
  const verificationPolicy = buildAgent17VerificationPolicy(ops, state, actorId);
  const core = {
    turn,
    actorId,
    planHealth,
    suggestion,
    templateRouting,
    delegationAnalytics,
    delegationLadder,
    planLedger,
    catalogDepth: summarizeAgent17CatalogDepth(),
  };
  const coordinationBrief = buildAgent17CoordinationBrief(
    core,
    intentQueue,
    verificationPolicy,
    ops,
    state,
    settings
  );
  const executionPacing = buildAgent17ExecutionPacing(
    ops,
    state,
    planHealth,
    verificationPolicy
  );
  const resilienceScorecard = buildAgent17ResilienceScorecard(
    ops,
    state,
    actorId,
    planHealth,
    verificationPolicy
  );
  const strategicAlignment = buildAgent17StrategicAlignment(
    ops,
    state,
    settings,
    actorId,
    intentQueue
  );
  const handoffReadiness = buildAgent17HandoffReadiness({
    coordinationBrief,
    verificationPolicy,
    executionPacing,
    resilienceScorecard,
    strategicAlignment,
  });
  const commandPosture = buildAgent17CommandPosture({
    planHealth,
    handoffReadiness,
    resilienceScorecard,
    strategicAlignment,
  });
  const governanceAudit = buildAgent17GovernanceAudit(ops, settings, verificationPolicy);
  const escalationMatrix = buildAgent17EscalationMatrix({
    commandPosture,
    governanceAudit,
    handoffReadiness,
  });
  const rollbackAssurance = buildAgent17RollbackAssurance(ops, planHealth, governanceAudit);
  return {
    ...core,
    intentQueue,
    verificationPolicy,
    coordinationBrief,
    executionPacing,
    resilienceScorecard,
    strategicAlignment,
    handoffReadiness,
    commandPosture,
    governanceAudit,
    escalationMatrix,
    rollbackAssurance,
  };
}

export function attachAgent17PlanningDepth(
  snapshot: Acc17OperationsSnapshot,
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string
): Acc17OperationsSnapshot {
  return {
    ...snapshot,
    planningDepth: buildAgent17PlanningDepthSnapshot(
      ops,
      state,
      settings,
      actorId,
      snapshot.recommendedDelegateKind
    ),
  };
}
