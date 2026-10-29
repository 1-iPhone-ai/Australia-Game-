import type {
  Agent17CommandPostureSnapshot,
  Agent17EscalationMatrixSnapshot,
  Agent17GovernanceAuditSnapshot,
  Agent17HandoffReadinessSnapshot,
} from '../types/command-center-types.ts';
import { commandPostureNeedsEscalation } from './command-posture.ts';
import { governanceAuditBlocksAutomation } from './governance-audit.ts';
import { handoffReadinessBlocked } from './handoff-readiness.ts';

export interface Agent17EscalationMatrixInputs {
  commandPosture: Agent17CommandPostureSnapshot;
  governanceAudit: Agent17GovernanceAuditSnapshot;
  handoffReadiness: Agent17HandoffReadinessSnapshot;
}

export function buildAgent17EscalationMatrix(
  inputs: Agent17EscalationMatrixInputs
): Agent17EscalationMatrixSnapshot {
  const rungs: Agent17EscalationMatrixSnapshot['rungs'] = [];

  const postureStress = commandPostureNeedsEscalation(inputs.commandPosture)
    ? 35
    : inputs.commandPosture.band === 'contested'
      ? 18
      : 0;
  rungs.push({
    id: 'posture',
    label: 'Command posture',
    triggered: postureStress > 0,
    severity: postureStress >= 35 ? 'high' : postureStress > 0 ? 'medium' : 'low',
    detail: `${inputs.commandPosture.band} (${inputs.commandPosture.postureIndex}/100)`,
  });

  const govStress = governanceAuditBlocksAutomation(inputs.governanceAudit)
    ? 40
    : inputs.governanceAudit.band === 'review'
      ? 15
      : 0;
  rungs.push({
    id: 'governance',
    label: 'Governance audit',
    triggered: govStress > 0,
    severity: govStress >= 40 ? 'high' : govStress > 0 ? 'medium' : 'low',
    detail: `${inputs.governanceAudit.band} (${inputs.governanceAudit.auditScore}/100)`,
  });

  const handoffStress = handoffReadinessBlocked(inputs.handoffReadiness)
    ? 25
    : inputs.handoffReadiness.band === 'partial'
      ? 12
      : 0;
  rungs.push({
    id: 'handoff',
    label: 'Team OS handoff',
    triggered: handoffStress > 0,
    severity: handoffStress >= 25 ? 'high' : handoffStress > 0 ? 'medium' : 'low',
    detail: `${inputs.handoffReadiness.band} (${inputs.handoffReadiness.readinessScore}/100)`,
  });

  const escalationIndex = Math.max(
    0,
    Math.min(100, Math.round(postureStress + govStress + handoffStress))
  );

  const band: Agent17EscalationMatrixSnapshot['band'] =
    escalationIndex >= 55 || inputs.governanceAudit.band === 'breach'
      ? 'urgent'
      : escalationIndex >= 20
        ? 'watch'
        : 'none';

  const triggeredCount = rungs.filter(r => r.triggered).length;

  return {
    escalationIndex,
    band,
    rungs,
    triggeredCount,
    headline: `Escalation ${band} (${escalationIndex}/100) · ${triggeredCount} rungs`,
  };
}

export function escalationMatrixBlocksAutomation(snapshot: Agent17EscalationMatrixSnapshot): boolean {
  return snapshot.band === 'urgent' || snapshot.escalationIndex >= 55;
}
