import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { listSuppressedNotificationCategories, NOTIFICATION_LANE_PROGRESSION } from './notification-lane-progression.js';
import { resolveEvolvingPanelVisibility } from './resolve-panel-visibility.js';
import { resolveUiDensityProfile } from './ui-density-progression.js';

export type CognitiveLoadBand = 'light' | 'moderate' | 'heavy';

export interface CognitiveLoadAssessment {
  band: CognitiveLoadBand;
  score: number;
  visibleNonEssentialPanels: number;
  activeNotificationLanes: number;
  recommendDeferCoach: boolean;
  recommendCollapseQuickActions: boolean;
  coachCopy: string;
}

export interface CognitiveLoadContext {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  onboardingEnabled?: boolean;
  focusSessionActive?: boolean;
  pendingCoachAnnouncements?: number;
}

function bandFromScore(score: number): CognitiveLoadBand {
  if (score >= 72) return 'heavy';
  if (score >= 42) return 'moderate';
  return 'light';
}

export function assessCognitiveLoad(ctx: CognitiveLoadContext): CognitiveLoadAssessment {
  const { signals, policy } = ctx;
  const onboardingEnabled = ctx.onboardingEnabled !== false;

  let visibleNonEssentialPanels = 0;
  for (const id of Object.keys(EVOLVING_UI_PANEL_BY_ID)) {
    const panel = EVOLVING_UI_PANEL_BY_ID[id];
    if (!panel || panel.essential) continue;
    if (resolveEvolvingPanelVisibility(id, signals, policy).state === 'visible') {
      visibleNonEssentialPanels++;
    }
  }

  const suppressedLanes = listSuppressedNotificationCategories(signals, onboardingEnabled);
  const activeNotificationLanes = NOTIFICATION_LANE_PROGRESSION.length - suppressedLanes.length;

  const density = resolveUiDensityProfile({
    interfaceLevel: signals.interfaceLevel,
    layoutPreset: signals.layoutPreset as never,
  });

  let score = visibleNonEssentialPanels * 6 + activeNotificationLanes * 5;
  if (density.tier === 'compact') score += 8;
  if (signals.interfaceLevel === 'simple' || signals.interfaceLevel === 'guided') score += 6;
  if (ctx.focusSessionActive) score -= 10;
  score += (ctx.pendingCoachAnnouncements ?? 0) * 4;

  if (signals.gameDay <= 2) score = Math.round(score * 0.6);
  if (signals.interfaceLevel === 'simple' && signals.gameDay <= 4) {
    score = Math.min(score, 36);
  }

  score = Math.max(0, Math.min(100, score));

  const band = bandFromScore(score);
  const recommendDeferCoach = band === 'heavy' && (ctx.pendingCoachAnnouncements ?? 0) > 1;
  const recommendCollapseQuickActions = band !== 'light' && visibleNonEssentialPanels >= 6;

  let coachCopy = '';
  if (band === 'heavy') {
    coachCopy = 'Interface load is high — consider snoozing coaching or switching to spacious density.';
  } else if (band === 'moderate') {
    coachCopy = 'Several panels and notification lanes are active; focus mode can tuck away advanced chrome.';
  }

  return {
    band,
    score,
    visibleNonEssentialPanels,
    activeNotificationLanes,
    recommendDeferCoach,
    recommendCollapseQuickActions,
    coachCopy,
  };
}

export function shouldShowCognitiveLoadCoach(
  assessment: CognitiveLoadAssessment,
  gameDay: number,
  snoozedUntilDay?: number
): boolean {
  if (assessment.band === 'light') return false;
  if (snoozedUntilDay != null && gameDay < snoozedUntilDay) return false;
  return Boolean(assessment.coachCopy);
}

export function snoozeCognitiveLoadCoachUntilDay(currentDay: number, snoozeDays = 2): number {
  return Math.max(1, currentDay + snoozeDays);
}
