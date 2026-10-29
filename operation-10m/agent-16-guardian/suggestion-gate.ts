import type { AiSuggestedAction, CommunicationAutonomyLevel, TeamStrategicPlan } from './types.js';

/** Co-Pilot / team suggested actions — never auto-execute on the advisory path. */

export function evaluateSuggestedActionGate(params: {
  autonomy: CommunicationAutonomyLevel | string;
  copilotEnabled: boolean;
  copilotAuthority?: string;
  plan?: TeamStrategicPlan | null;
  action: AiSuggestedAction;
  alreadyCommittedIds: string[];
}): { allowed: boolean; needsApproval: boolean; reason: string | null } {
  if (params.alreadyCommittedIds.includes(params.action.id)) {
    return { allowed: false, needsApproval: false, reason: 'This suggested action was already handled.' };
  }
  if (params.action.status === 'rejected' || params.action.status === 'executed') {
    return { allowed: false, needsApproval: false, reason: `This suggestion is already ${params.action.status}.` };
  }
  if (params.autonomy === 'advisory') {
    return {
      allowed: false,
      needsApproval: false,
      reason: 'Advisory communication only explains — it never acts. Switch autonomy to Assisted to approve suggestions.',
    };
  }
  if (params.plan && (params.plan.status === 'paused' || params.plan.status === 'cancelled')) {
    return {
      allowed: false,
      needsApproval: false,
      reason: `The team plan is ${params.plan.status}, so plan-driven suggestions are on hold.`,
    };
  }
  if (params.autonomy === 'assisted') return { allowed: true, needsApproval: true, reason: null };
  if (!params.copilotEnabled) {
    return {
      allowed: true,
      needsApproval: true,
      reason: 'Delegated actions still need the Co-Pilot; approval required while it is off.',
    };
  }
  if (params.autonomy === 'delegated') return { allowed: true, needsApproval: true, reason: null };
  return { allowed: true, needsApproval: false, reason: null };
}

export function markSuggestedAction(
  action: AiSuggestedAction,
  status: AiSuggestedAction['status'],
  committedIds: string[]
): { action: AiSuggestedAction; committedIds: string[]; executed: boolean } {
  const already = committedIds.includes(action.id);
  if (status === 'executed' && already) return { action, committedIds, executed: false };
  const commit = status === 'executed' || status === 'rejected';
  return {
    action: { ...action, status },
    committedIds: commit && !already ? [...committedIds, action.id].slice(-100) : committedIds,
    executed: status === 'executed',
  };
}

export function describeSuggestedActionOutcome(action: AiSuggestedAction): string {
  switch (action.status) {
    case 'executed':
      return `Done: ${action.label}. It went through the normal team-directive path.`;
    case 'approved':
      return `Sent for approval: ${action.label}. Nothing happens until you confirm in Co-Pilot.`;
    case 'rejected':
      return `Rejected: ${action.label}. Nothing was changed.`;
    case 'blocked':
      return `Not executed: ${action.label}. Advisory communication never acts on its own.`;
    default:
      return `Suggestion: ${action.label}. Approve or reject it; nothing happens automatically.`;
  }
}

export function stripExecutionFromCoPilotCandidate<T extends { execute?: unknown; dispatch?: unknown; autoApply?: unknown }>(
  candidate: T
): T & { recommendationOnly: true; mayExecute: false } {
  const copy = { ...candidate, recommendationOnly: true as const, mayExecute: false as const };
  delete (copy as Record<string, unknown>).execute;
  delete (copy as Record<string, unknown>).dispatch;
  delete (copy as Record<string, unknown>).autoApply;
  return copy as T & { recommendationOnly: true; mayExecute: false };
}

/** Explicit boundary: advisory stream must never carry executable payloads. */
export function partitionSuggestionFromExecution<T extends { mayExecute?: boolean; execute?: unknown }>(
  item: T
): { suggestion: T & { mayExecute: false }; executable: null } {
  const suggestion = stripExecutionFromCoPilotCandidate(item as T & { execute?: unknown });
  return { suggestion, executable: null };
}
