import type {
  Acc17CommandCenterOpsState,
  Agent17GameStateSlice,
  Agent17PlanHealthBand,
  Agent17ResilienceScorecard,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';
import { detectAgent17RecoverySignals } from './recovery-paths.ts';

export function buildAgent17ResilienceScorecard(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  actorId: string,
  planHealth: Agent17PlanHealthBand,
  verificationPolicy: Agent17VerificationPolicySnapshot
): Agent17ResilienceScorecard {
  const signals = detectAgent17RecoverySignals(state, actorId);
  const topSeverity = signals[0]?.severity ?? 0;
  const recoveryPressure = Math.min(100, Math.round(topSeverity * 0.85 + signals.length * 6));

  const satisfiedRules = verificationPolicy.rules.filter(r => r.satisfied).length;
  const ruleTotal = Math.max(1, verificationPolicy.rules.length);
  const verificationStability = Math.round((satisfiedRules / ruleTotal) * 100);

  const healthComponent = planHealth.score;
  const delegationLoad = Math.min(30, ops.delegatedProjects.filter(p => p.status === 'executing').length * 8);
  const compositeIndex = Math.max(
    0,
    Math.min(
      100,
      Math.round(healthComponent * 0.45 + verificationStability * 0.35 + (100 - recoveryPressure) * 0.2 - delegationLoad)
    )
  );

  const mitigationHints: string[] = [];
  if (recoveryPressure >= 55) {
    mitigationHints.push('Prioritize recovery lane template before new delegation.');
  }
  if (!verificationPolicy.allowVerification) {
    mitigationHints.push(`Clear verification gates: ${verificationPolicy.blockingRuleIds.join(', ')}`);
  }
  if (planHealth.blockedCount > 0) {
    mitigationHints.push(`${planHealth.blockedCount} blocked step(s) — run replan or recovery path.`);
  }
  if (mitigationHints.length === 0) {
    mitigationHints.push('Posture stable; maintain verify-then-advance cadence.');
  }

  const band: Agent17ResilienceScorecard['band'] =
    compositeIndex >= 72 ? 'robust' : compositeIndex >= 45 ? 'watch' : 'fragile';

  return {
    recoveryPressure,
    verificationStability,
    compositeIndex,
    band,
    signalCount: signals.length,
    mitigationHints: mitigationHints.slice(0, 4),
    headline: `Resilience ${band} (${compositeIndex}/100) · recovery pressure ${recoveryPressure}`,
  };
}

export function resilienceScorecardNeedsIntervention(card: Agent17ResilienceScorecard): boolean {
  return card.band === 'fragile' || card.recoveryPressure >= 70;
}
