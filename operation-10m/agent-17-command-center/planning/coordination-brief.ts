import type {
  Acc17CommandCenterOpsState,
  Agent17CoordinationBrief,
  Agent17CoordinationBriefSection,
  Agent17GameStateSlice,
  Agent17IntentQueueSnapshot,
  Agent17PlanningDepthSnapshot,
  Agent17SettingsSlice,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';

export function buildAgent17CoordinationBrief(
  depth: Omit<
    Agent17PlanningDepthSnapshot,
    'intentQueue' | 'verificationPolicy' | 'coordinationBrief'
  >,
  intentQueue: Agent17IntentQueueSnapshot,
  verificationPolicy: Agent17VerificationPolicySnapshot,
  ops: Acc17CommandCenterOpsState,
  _state: Agent17GameStateSlice,
  _settings: Agent17SettingsSlice
): Agent17CoordinationBrief {
  const sections: Agent17CoordinationBriefSection[] = [];

  sections.push({
    id: 'intent',
    heading: 'Primary intents',
    bullets: intentQueue.items.slice(0, 4).map(i => `[${i.source}] ${i.label}`),
  });

  sections.push({
    id: 'plan',
    heading: 'Plan posture',
    bullets: [
      depth.planHealth
        ? `${depth.planHealth.band} · score ${depth.planHealth.score} · replans ${depth.planHealth.replanCount}`
        : 'No plan health',
      depth.suggestion.headline,
      depth.delegationLadder.headline,
    ],
  });

  sections.push({
    id: 'verify',
    heading: 'Verification policy',
    bullets: verificationPolicy.allowVerification
      ? ['All verification gates satisfied.']
      : verificationPolicy.blockingRuleIds.map(id => `Blocked: ${id}`),
  });

  if (ops.activePlan) {
    sections.push({
      id: 'steps',
      heading: 'Active plan steps',
      bullets: ops.activePlan.steps.slice(0, 5).map(
        (s, idx) => `${idx + 1}. ${s.title} (${s.status})`
      ),
    });
  }

  const giHandoffTags = [
    'agent17_command_center',
    `category_${depth.templateRouting.matchedCategory}`,
    depth.planHealth.band,
    verificationPolicy.allowVerification ? 'verify_ready' : 'verify_hold',
  ];
  if (intentQueue.primaryIntentId) giHandoffTags.push(intentQueue.primaryIntentId);

  const confidence =
    (depth.suggestion.confidence +
      (verificationPolicy.allowVerification ? 0.15 : 0) +
      (depth.planHealth.band === 'strong' ? 0.1 : 0)) /
    1.25;

  return {
    headline: depth.suggestion.headline || 'Command center coordination brief',
    sections,
    giHandoffTags,
    confidence: Math.min(0.99, Math.max(0.35, confidence)),
  };
}

export function coordinationBriefReadyForGi(brief: Agent17CoordinationBrief): boolean {
  return brief.sections.length >= 3 && brief.giHandoffTags.length >= 4;
}
