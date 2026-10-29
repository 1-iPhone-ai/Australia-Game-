import type {
  Acc17CommandCenterOpsState,
  Agent17GameStateSlice,
  Agent17IntentQueueSnapshot,
  Agent17StrategicAlignmentSnapshot,
} from '../types/command-center-types.ts';
import { defaultObjectiveResolver } from './ops-state.ts';

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 4)
  );
}

function overlapScore(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 50;
  let hits = 0;
  for (const w of a) {
    if (b.has(w)) hits += 1;
  }
  const denom = Math.max(1, Math.min(a.size, b.size));
  return Math.round((hits / denom) * 100);
}

export function buildAgent17StrategicAlignment(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: import('../types/command-center-types.ts').Agent17SettingsSlice,
  actorId: string,
  intentQueue: Agent17IntentQueueSnapshot
): Agent17StrategicAlignmentSnapshot {
  const objective = defaultObjectiveResolver(state, settings, actorId);
  const objectiveText = objective?.title || '';
  const gi3Text = state.gi3Strategy?.headline || '';
  const plannerText = state.strategyPlannerState?.activePlan?.title || '';
  const planText = ops.activePlan?.title || '';

  const objectiveTokens = tokenize(objectiveText);
  const gi3Tokens = tokenize(gi3Text);
  const plannerTokens = tokenize(plannerText);
  const planTokens = tokenize(planText || objectiveText);

  const gi3Overlap = gi3Text ? overlapScore(objectiveTokens, gi3Tokens) : 60;
  const plannerOverlap = plannerText ? overlapScore(objectiveTokens, plannerTokens) : 55;
  const planOverlap = ops.activePlan ? overlapScore(objectiveTokens, planTokens) : 50;

  const alignmentIndex = Math.max(
    0,
    Math.min(100, Math.round(gi3Overlap * 0.4 + plannerOverlap * 0.25 + planOverlap * 0.35))
  );

  const driftFlags: string[] = [];
  if (gi3Text && gi3Overlap < 35) driftFlags.push('gi3_objective_drift');
  if (plannerText && plannerOverlap < 30) driftFlags.push('planner_objective_drift');
  if (ops.activePlan && planOverlap < 25) driftFlags.push('plan_title_drift');
  if (intentQueue.primaryIntentId === 'intent_gi3' && gi3Overlap < 45) {
    driftFlags.push('primary_intent_misaligned');
  }

  const band: Agent17StrategicAlignmentSnapshot['band'] =
    alignmentIndex >= 70 ? 'aligned' : alignmentIndex >= 42 ? 'drifting' : 'divergent';

  const cues = [gi3Text, plannerText, planText].filter(Boolean);
  const headline =
    cues.length >= 2
      ? `Strategic ${band} (${alignmentIndex}/100) · GI3/plan cues ${cues.length}`
      : `Strategic ${band} (${alignmentIndex}/100) · sparse upstream cues`;

  return {
    alignmentIndex,
    band,
    gi3Overlap,
    plannerOverlap,
    planOverlap,
    driftFlags: driftFlags.slice(0, 4),
    primaryIntentId: intentQueue.primaryIntentId,
    headline,
  };
}

export function strategicAlignmentNeedsReconcile(snapshot: Agent17StrategicAlignmentSnapshot): boolean {
  return snapshot.band === 'divergent' || snapshot.driftFlags.length >= 2;
}
