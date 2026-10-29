import type {
  Agent17CommandPostureSnapshot,
  Agent17HandoffReadinessSnapshot,
  Agent17PlanHealthBand,
  Agent17ResilienceScorecard,
  Agent17StrategicAlignmentSnapshot,
} from '../types/command-center-types.ts';
import { handoffReadinessBlocked } from './handoff-readiness.ts';
import { resilienceScorecardNeedsIntervention } from './resilience-scorecard.ts';
import { strategicAlignmentNeedsReconcile } from './strategic-alignment.ts';

export interface Agent17CommandPostureInputs {
  planHealth: Agent17PlanHealthBand;
  handoffReadiness: Agent17HandoffReadinessSnapshot;
  resilienceScorecard: Agent17ResilienceScorecard;
  strategicAlignment: Agent17StrategicAlignmentSnapshot;
}

function scorePlanHealthContribution(health: Agent17PlanHealthBand): number {
  return Math.max(0, Math.min(100, health.score));
}

export function buildAgent17CommandPosture(
  inputs: Agent17CommandPostureInputs
): Agent17CommandPostureSnapshot {
  const handoffContribution = inputs.handoffReadiness.readinessScore;
  const resilienceContribution = inputs.resilienceScorecard.compositeIndex;
  const planHealthContribution = scorePlanHealthContribution(inputs.planHealth);
  const alignmentContribution = inputs.strategicAlignment.alignmentIndex;

  const postureIndex = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        handoffContribution * 0.3 +
          resilienceContribution * 0.25 +
          planHealthContribution * 0.25 +
          alignmentContribution * 0.2
      )
    )
  );

  const degradedSignals =
    handoffReadinessBlocked(inputs.handoffReadiness) ||
    resilienceScorecardNeedsIntervention(inputs.resilienceScorecard) ||
    strategicAlignmentNeedsReconcile(inputs.strategicAlignment) ||
    inputs.planHealth.band === 'critical';

  const band: Agent17CommandPostureSnapshot['band'] =
    postureIndex >= 72 && !degradedSignals
      ? 'commanding'
      : postureIndex >= 45
        ? 'contested'
        : 'degraded';

  const headline = `Command ${band} (${postureIndex}/100) · handoff ${inputs.handoffReadiness.band}`;

  return {
    postureIndex,
    band,
    handoffContribution,
    resilienceContribution,
    planHealthContribution,
    alignmentContribution,
    headline,
  };
}

export function commandPostureNeedsEscalation(snapshot: Agent17CommandPostureSnapshot): boolean {
  return snapshot.band === 'degraded' || snapshot.postureIndex < 40;
}
