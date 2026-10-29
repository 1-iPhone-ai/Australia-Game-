import type {
  Acc17CommandCenterOpsState,
  Agent17GameStateSlice,
  Agent17VerificationPolicyRule,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';
import { acc17ComputeRelevantStateFingerprint } from './fingerprint.ts';

export function buildAgent17VerificationPolicy(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  actorId: string
): Agent17VerificationPolicySnapshot {
  const fp = acc17ComputeRelevantStateFingerprint(state, actorId);
  const prev = ops.lastContextFingerprint || '';
  const rules: Agent17VerificationPolicyRule[] = [
    {
      id: 'vp_fingerprint_delta',
      description: 'State fingerprint must differ from last evaluation to verify progress.',
      satisfied: prev !== '' && fp !== prev,
    },
    {
      id: 'vp_active_plan',
      description: 'An active multi-step plan must exist.',
      satisfied: !!ops.activePlan && ops.activePlan.steps.length > 0,
    },
    {
      id: 'vp_last_action',
      description: 'Last executed action must be recorded.',
      satisfied: !!(state.lastExecutedAction?.type || state.lastAction?.type),
    },
    {
      id: 'vp_not_evaluating',
      description: 'Command center must not be in a blocked-only terminal state.',
      satisfied: !(
        ops.activePlan?.steps.every(s => s.status === 'blocked' || s.status === 'failed') ?? false
      ),
    },
    {
      id: 'vp_ops_enabled',
      description: 'Ops pipeline enabled.',
      satisfied: ops.enabled !== false,
    },
  ];

  const blockingRuleIds = rules.filter(r => !r.satisfied).map(r => r.id);
  return {
    rules,
    allowVerification: blockingRuleIds.length === 0,
    blockingRuleIds,
  };
}

export function verificationPolicyBlocksAdvance(policy: Agent17VerificationPolicySnapshot): boolean {
  return !policy.allowVerification && policy.blockingRuleIds.includes('vp_fingerprint_delta');
}
