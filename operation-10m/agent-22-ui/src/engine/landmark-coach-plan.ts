import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import {
  landmarkTargetForSurface,
  planLandmarkReadingOrder,
  type LandmarkReadingOrderPlan,
} from './landmark-reading-order.js';

export const DEFAULT_COACH_SURFACE_LANDMARKS: Array<{ id: string; label: string }> = [
  { id: 'status_evolution_bridge', label: 'Simulation updates' },
  { id: 'nav_primary_rail', label: 'Primary navigation' },
  { id: 'coach_unlock_panel', label: 'Unlock coach' },
  { id: 'main_game_canvas', label: 'Main game view' },
  { id: 'complementary_quick_actions', label: 'Quick actions' },
];

export function buildCoachLandmarkReadingPlan(phase: V94StandardizedGamePhase): LandmarkReadingOrderPlan {
  const landmarks = DEFAULT_COACH_SURFACE_LANDMARKS.map((surface, index) =>
    landmarkTargetForSurface(surface.id, surface.label, true, index + 1)
  );
  return planLandmarkReadingOrder({ phase, landmarks });
}

export function landmarkReadingCoachCopy(plan: LandmarkReadingOrderPlan): string | null {
  if (plan.skipLinkLabels.length <= 1) return null;
  return `Screen reader order: ${plan.skipLinkLabels.slice(0, 2).join(', ')}…`;
}
