import type {
  Agent17CoordinationBrief,
  Agent17ExecutionPacingSnapshot,
  Agent17HandoffReadinessSnapshot,
  Agent17ResilienceScorecard,
  Agent17StrategicAlignmentSnapshot,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';
import { coordinationBriefReadyForGi } from './coordination-brief.ts';
import { resilienceScorecardNeedsIntervention } from './resilience-scorecard.ts';
import { strategicAlignmentNeedsReconcile } from './strategic-alignment.ts';

export interface Agent17HandoffReadinessInputs {
  coordinationBrief: Agent17CoordinationBrief;
  verificationPolicy: Agent17VerificationPolicySnapshot;
  executionPacing: Agent17ExecutionPacingSnapshot;
  resilienceScorecard: Agent17ResilienceScorecard;
  strategicAlignment: Agent17StrategicAlignmentSnapshot;
}

export function buildAgent17HandoffReadiness(
  inputs: Agent17HandoffReadinessInputs
): Agent17HandoffReadinessSnapshot {
  const checks: Agent17HandoffReadinessSnapshot['checks'] = [];

  const giReady = coordinationBriefReadyForGi(inputs.coordinationBrief);
  checks.push({
    id: 'gi_brief',
    label: 'Coordination brief GI-ready',
    passed: giReady,
    weight: 20,
  });

  checks.push({
    id: 'verify_gate',
    label: 'Verification gate open',
    passed: inputs.verificationPolicy.allowVerification,
    weight: 25,
  });

  checks.push({
    id: 'pacing',
    label: 'Execution pacing not throttled',
    passed: inputs.executionPacing.pacingBand !== 'throttled',
    weight: 15,
  });

  checks.push({
    id: 'resilience',
    label: 'Resilience posture stable',
    passed: !resilienceScorecardNeedsIntervention(inputs.resilienceScorecard),
    weight: 20,
  });

  checks.push({
    id: 'alignment',
    label: 'Strategic alignment not divergent',
    passed: !strategicAlignmentNeedsReconcile(inputs.strategicAlignment),
    weight: 20,
  });

  const earned = checks.filter(c => c.passed).reduce((n, c) => n + c.weight, 0);
  const totalWeight = checks.reduce((n, c) => n + c.weight, 0);
  const readinessScore = Math.round((earned / Math.max(1, totalWeight)) * 100);

  const blockers = checks.filter(c => !c.passed).map(c => c.id);
  const readyForTeamOs =
    readinessScore >= 72 &&
    inputs.verificationPolicy.allowVerification &&
    inputs.coordinationBrief.giHandoffTags.includes('agent17_command_center');

  const band: Agent17HandoffReadinessSnapshot['band'] =
    readinessScore >= 80 ? 'ready' : readinessScore >= 50 ? 'partial' : 'blocked';

  return {
    readinessScore,
    band,
    readyForTeamOs,
    checks,
    blockers,
    headline: `Handoff ${band} (${readinessScore}/100) · blockers ${blockers.length}`,
  };
}

export function handoffReadinessBlocked(snapshot: Agent17HandoffReadinessSnapshot): boolean {
  return snapshot.band === 'blocked' || snapshot.blockers.includes('verify_gate');
}
