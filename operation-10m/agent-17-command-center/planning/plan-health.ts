import type {
  Acc17MultiStepPlan,
  Agent17PlanHealthBand,
  Agent17GameStateSlice,
} from '../types/command-center-types.ts';

export function assessAgent17PlanHealth(
  plan: Acc17MultiStepPlan | null,
  _state: Agent17GameStateSlice,
  _actorId: string
): Agent17PlanHealthBand {
  if (!plan || plan.steps.length === 0) {
    return {
      band: 'critical',
      score: 0,
      blockedCount: 0,
      verifiedRatio: 0,
      replanCount: 0,
      onTrack: false,
    };
  }
  const blockedCount = plan.steps.filter(
    s => s.status === 'blocked' || s.status === 'failed'
  ).length;
  const verified = plan.steps.filter(s => s.status === 'verified_complete').length;
  const verifiedRatio = verified / plan.steps.length;
  const inFlight = plan.steps.some(s => s.status === 'in_progress' || s.status === 'pending');
  let score = Math.round(verifiedRatio * 70 + (plan.isOnTrack ? 20 : 0));
  if (verifiedRatio === 0 && inFlight && blockedCount === 0) {
    score = Math.max(score, 52);
  }
  score -= blockedCount * 15;
  score -= Math.min(15, plan.replanCount * 3);
  score = Math.max(0, Math.min(100, score));
  let band: Agent17PlanHealthBand['band'] = 'steady';
  if (score < 35 || blockedCount >= 2) band = 'critical';
  else if (score < 50 || blockedCount >= 1) band = 'at_risk';
  else if (score >= 80 && verifiedRatio >= 0.6) band = 'strong';
  else if (verifiedRatio === 0 && inFlight && blockedCount === 0) band = 'steady';
  return {
    band,
    score,
    blockedCount,
    verifiedRatio,
    replanCount: plan.replanCount,
    onTrack: plan.isOnTrack && blockedCount === 0,
  };
}

export function planHealthNeedsRecovery(health: Agent17PlanHealthBand): boolean {
  return health.band === 'critical' || health.band === 'at_risk';
}

export function formatAgent17PlanHealthSummary(health: Agent17PlanHealthBand): string {
  return `${health.band} · score ${health.score} · verified ${Math.round(health.verifiedRatio * 100)}% · replans ${health.replanCount}`;
}
