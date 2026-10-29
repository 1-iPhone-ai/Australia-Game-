import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';

export type UiLandmarkRole =
  | 'status'
  | 'navigation'
  | 'main'
  | 'complementary'
  | 'banner';

export interface UiLandmarkTarget {
  id: string;
  role: UiLandmarkRole;
  label: string;
  visible: boolean;
  /** Lower sorts earlier within the same role band. */
  priority: number;
}

export interface LandmarkReadingOrderPlan {
  ordered: UiLandmarkTarget[];
  skipLinkLabels: string[];
  phaseHint: V94StandardizedGamePhase;
}

const ROLE_BAND: Record<UiLandmarkRole, number> = {
  status: 0,
  banner: 1,
  navigation: 2,
  main: 3,
  complementary: 4,
};

export function compareLandmarkReadingOrder(a: UiLandmarkTarget, b: UiLandmarkTarget): number {
  const bandDiff = ROLE_BAND[a.role] - ROLE_BAND[b.role];
  if (bandDiff !== 0) return bandDiff;
  return a.priority - b.priority;
}

export function planLandmarkReadingOrder(input: {
  phase: V94StandardizedGamePhase;
  landmarks: UiLandmarkTarget[];
}): LandmarkReadingOrderPlan {
  const visible = input.landmarks.filter(l => l.visible);
  const ordered = [...visible].sort(compareLandmarkReadingOrder);

  if (input.phase === 'main_menu') {
    const navFirst = ordered.filter(l => l.role === 'navigation' || l.role === 'banner');
    const rest = ordered.filter(l => l.role !== 'navigation' && l.role !== 'banner');
    ordered.splice(0, ordered.length, ...navFirst, ...rest);
  }

  const skipLinkLabels = ordered
    .filter(l => l.role === 'navigation' || l.role === 'main')
    .slice(0, 4)
    .map(l => `Skip to ${l.label}`);

  return {
    ordered,
    skipLinkLabels,
    phaseHint: input.phase,
  };
}

export function landmarkTargetForSurface(
  surfaceId: string,
  label: string,
  visible: boolean,
  priority: number
): UiLandmarkTarget {
  const role: UiLandmarkRole =
    surfaceId.includes('nav') || surfaceId.includes('rail')
      ? 'navigation'
      : surfaceId.includes('coach') || surfaceId.includes('banner') || surfaceId.includes('status')
        ? 'status'
        : surfaceId.includes('quick') || surfaceId.includes('widget')
          ? 'complementary'
          : 'main';
  return { id: surfaceId, role, label, visible, priority };
}
