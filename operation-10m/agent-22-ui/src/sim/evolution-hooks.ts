import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';
import { resolveEvolvingPanelVisibility } from '../engine/resolve-panel-visibility.js';
import { formatPanelUnlockAnnouncement } from '../a11y/live-region-controller.js';
import { buildUnlockHintForPanel } from '../engine/unlock-hint-formatter.js';
import {
  filterDedupedAnnouncements,
  mergeAnnouncementDedupLedgerIntoPersisted,
} from '../engine/announcement-dedup-ledger.js';
import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../types/accessibility.js';
import { resolveUiDensityProfile } from '../engine/ui-density-progression.js';
import {
  buildPacedAnnouncementSchedule,
  mergePacingDeferredIntoPersisted,
} from '../engine/paced-announcement-scheduler.js';
import {
  appendToAnnouncementPacingQueue,
  flushDeferredAnnouncementQueue,
  mergeAnnouncementPacingQueueIntoPersisted,
} from '../engine/deferred-announcement-flush.js';
import { buildCoachLiveRegionDeliveryPlan } from '../engine/coach-live-region-scheduler.js';
import { onboardingHighlightedPanelIds } from '../engine/onboarding-persist-bridge.js';
import {
  buildProgressionCoverageSnapshot,
  coverageDeltaCopy,
  mergeCoverageRatioIntoPersisted,
} from '../engine/progression-coverage-snapshot.js';
import { computeProgressionSignalDelta, mergeLastInterfaceLevelIntoPersisted } from '../engine/progression-signal-delta.js';
import { countActiveNotificationLanes } from '../engine/notification-lane-coach-plan.js';
import {
  forecastUpcomingMilestones,
  milestoneForecastCoachCopy,
} from '../engine/milestone-forecast-coach.js';
import { countIntroducedGuidedConcepts } from '../engine/guided-learning-panel-bridge.js';
import { summarizeFocusSessionSuppression } from '../engine/focus-session-suppression-summary.js';
import {
  auditLegacyNavTargets,
  countLegacyNavPatchCoverage,
} from '../engine/legacy-nav-audit-coach.js';
import { evaluateDayAdvanceCalmRecoveryHint } from '../engine/day-advance-calm-recovery-hint.js';
import { applyCalmRecoveryFromDayAdvanceHint } from '../engine/calm-recovery-auto-apply-bridge.js';
import { buildTextScaleDensityDayHint } from '../engine/text-scale-density-day-hint.js';
import { planPhaseShellAttentionGate } from '../engine/phase-shell-attention-gate.js';
import {
  applyLegacyNavAutoRemember,
  buildLegacyNavAutoRememberPlan,
} from '../engine/legacy-nav-auto-remember-bridge.js';
import { buildPhaseShellVisibilityDayCoach } from '../engine/phase-shell-visibility-day-coach.js';
import { applyTextScaleDensityFromDayHint } from '../engine/text-scale-density-auto-apply-bridge.js';
import { buildCalmRecoveryExpiryDayHint } from '../engine/calm-recovery-expiry-day-hint.js';
import { buildCoachDismissalQuietDayHint } from '../engine/coach-dismissal-quiet-day-hint.js';
import { buildSessionResumeDayAdvanceCoach } from '../engine/session-resume-day-advance-coach.js';
import { buildShowAllOverrideDayHint } from '../engine/show-all-override-day-hint.js';
import { buildHighContrastChromeDayCoach } from '../engine/high-contrast-chrome-day-coach.js';
import { buildCognitiveLoadDayCoach } from '../engine/cognitive-load-day-coach.js';
import { buildFocusSessionSnoozeDayHint } from '../engine/focus-session-snooze-day-hint.js';
import { buildTouchTargetDayCoach } from '../engine/touch-target-day-coach.js';
import { buildKeyboardHintsDayCoach } from '../engine/keyboard-hints-day-coach.js';
import { assessCognitiveLoad } from '../engine/cognitive-load-governor.js';
import type { SessionUiMemory } from './session-ui-memory.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';

/** Persisted slice proposed for `gameSettings.evolvingUi` (assembly-owned). */
export interface EvolvingUiPersistedState {
  showAllPanelsOverride?: boolean;
  rememberedPanelIds?: string[];
  lastProgressionTier?: number;
  /** panel ids first unlocked on a given game day */
  unlockedByDay?: Record<string, string[]>;
  lastCoachPanelId?: string | null;
  lastNavTarget?: string | null;
  preferredDensity?: 'compact' | 'comfortable' | 'spacious' | null;
  focusSessionSnoozedUntilDay?: number;
  cognitiveLoadCoachSnoozedUntilDay?: number;
  calmRecoveryUntilDay?: number;
  coachDismissalStreak?: number;
  coachDismissalQuietUntilDay?: number;
  /** announcement hash → last game day announced */
  announcementDedupLedger?: Record<string, number>;
  /** coach lines waiting for staggered live-region delivery */
  announcementPacingDeferredCount?: number;
  /** deferred coach copy awaiting flush on later ticks */
  announcementPacingQueue?: string[];
  /** onboarding funnel dismiss keys persisted for host */
  onboardingDismissedKeys?: string[];
  lastProgressionCoverageRatio?: number;
  lastInterfaceLevel?: import('../types/progression.js').InterfaceExperienceLevel;
}

export interface DayAdvanceUiEvolutionResult {
  gameDay: number;
  newlyUnlockedPanelIds: string[];
  coachAnnouncements: string[];
  deferredCoachAnnouncementCount: number;
  flushedDeferredAnnouncementCount: number;
  coachLiveRegionMessageCount: number;
  progressionCoverageRatio: number;
  progressionCoverageDeltaCopy: string | null;
  progressionSignalDeltaCopy: string | null;
  activeNotificationLaneCount: number;
  milestoneForecastCoachCopy: string | null;
  focusSessionSuppressedPanelCount: number;
  guidedLearningConceptCount: number;
  legacyNavPatchCoverageCount: number;
  calmRecoverySuggested: boolean;
  calmRecoveryHintCopy: string | null;
  calmRecoveryAutoApplied: boolean;
  textScaleDensityDayHintCopy: string | null;
  textScaleDensityAutoApplied: boolean;
  phaseShellAttentionCoachCopy: string | null;
  phaseShellVisibilityDayCoachCopy: string | null;
  legacyNavAutoRememberedCount: number;
  calmRecoveryExpiryHintCopy: string | null;
  coachDismissalQuietDayHintCopy: string | null;
  sessionResumeDayCoachCopy: string | null;
  showAllOverrideDayHintCopy: string | null;
  highContrastChromeDayCoachCopy: string | null;
  cognitiveLoadDayCoachCopy: string | null;
  focusSessionSnoozeDayHintCopy: string | null;
  touchTargetDayCoachCopy: string | null;
  keyboardHintsDayCoachCopy: string | null;
  updatedPersisted: EvolvingUiPersistedState;
  visiblePanelCount: number;
}

export interface TickEvolvingUiDayAdvanceContext {
  phase?: V94StandardizedGamePhase;
  accessibility?: AccessibilitySettingsSnapshot;
  autoApplyCalmRecovery?: boolean;
  autoApplyTextScaleDensity?: boolean;
  autoRememberLegacyNav?: boolean;
  sessionMemory?: SessionUiMemory;
}

export function createDefaultEvolvingUiPersistedState(): EvolvingUiPersistedState {
  return {
    showAllPanelsOverride: false,
    rememberedPanelIds: [],
    lastProgressionTier: 0,
    unlockedByDay: {},
    lastCoachPanelId: null,
  };
}

export function mergePersistedIntoAccessPolicy(
  persisted: EvolvingUiPersistedState | null | undefined,
  base: EvolvingUiAccessPolicy
): EvolvingUiAccessPolicy {
  if (!persisted) return base;
  return {
    ...base,
    showAllPanelsOverride: Boolean(persisted.showAllPanelsOverride ?? base.showAllPanelsOverride),
    rememberedPanelIds: Array.isArray(persisted.rememberedPanelIds)
      ? [...new Set([...base.rememberedPanelIds, ...persisted.rememberedPanelIds])]
      : base.rememberedPanelIds,
  };
}

/**
 * Simulation hook: call after day/turn advance to detect newly visible panels and coach copy.
 * Does not mutate canonical game state — returns patches for host to apply.
 */
export function tickEvolvingUiOnDayAdvance(
  priorSignals: ProgressionSignalSnapshot,
  nextSignals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  persisted: EvolvingUiPersistedState = createDefaultEvolvingUiPersistedState(),
  context: TickEvolvingUiDayAdvanceContext = {}
): DayAdvanceUiEvolutionResult {
  const newlyUnlockedPanelIds: string[] = [];
  const coachAnnouncements: string[] = [];
  const dayKey = String(nextSignals.gameDay);
  const unlockedByDay = { ...(persisted.unlockedByDay ?? {}) };

  for (const panelId of Object.keys(EVOLVING_UI_PANEL_BY_ID)) {
    const before = resolveEvolvingPanelVisibility(panelId, priorSignals, policy).state;
    const after = resolveEvolvingPanelVisibility(panelId, nextSignals, policy).state;
    if (before !== 'visible' && after === 'visible') {
      newlyUnlockedPanelIds.push(panelId);
      const panel = EVOLVING_UI_PANEL_BY_ID[panelId];
      if (panel) {
        coachAnnouncements.push(
          formatPanelUnlockAnnouncement(panel.label, buildUnlockHintForPanel(panel, nextSignals))
        );
      }
    }
  }

  if (newlyUnlockedPanelIds.length) {
    unlockedByDay[dayKey] = [...new Set([...(unlockedByDay[dayKey] ?? []), ...newlyUnlockedPanelIds])];
  }

  let visiblePanelCount = 0;
  for (const id of Object.keys(EVOLVING_UI_PANEL_BY_ID)) {
    if (resolveEvolvingPanelVisibility(id, nextSignals, policy).state === 'visible') visiblePanelCount++;
  }

  const updatedPersisted: EvolvingUiPersistedState = {
    ...persisted,
    unlockedByDay,
    lastProgressionTier: Math.max(persisted.lastProgressionTier ?? 0, nextSignals.gameDay >= 10 ? 3 : 2),
    lastCoachPanelId: newlyUnlockedPanelIds[0] ?? persisted.lastCoachPanelId ?? null,
  };

  const density = resolveUiDensityProfile({
    interfaceLevel: nextSignals.interfaceLevel,
    preferredTier: persisted.preferredDensity ?? null,
    textScaleMultiplier: DEFAULT_ACCESSIBILITY_SNAPSHOT.textScaleMultiplier,
  });

  const priorQueue = persisted.announcementPacingQueue ?? [];
  const flush = flushDeferredAnnouncementQueue(priorQueue, DEFAULT_ACCESSIBILITY_SNAPSHOT, density);

  const deduped = filterDedupedAnnouncements(
    coachAnnouncements,
    nextSignals.gameDay,
    persisted.announcementDedupLedger
  );

  const updatedPersistedWithDedup = mergeAnnouncementDedupLedgerIntoPersisted(
    updatedPersisted,
    deduped.ledger
  );

  const pacing = buildPacedAnnouncementSchedule(
    deduped.freshAnnouncements,
    DEFAULT_ACCESSIBILITY_SNAPSHOT,
    density
  );

  const combinedQueue = appendToAnnouncementPacingQueue(flush.remainingQueue, pacing.deferredAnnouncements);

  const updatedPersistedWithPacing = mergeAnnouncementPacingQueueIntoPersisted(
    mergePacingDeferredIntoPersisted(updatedPersistedWithDedup, combinedQueue.length),
    combinedQueue
  );

  const immediateCoach = [...flush.flushedAnnouncements, ...pacing.immediateAnnouncements];
  const liveRegionPlan = buildCoachLiveRegionDeliveryPlan(immediateCoach, DEFAULT_ACCESSIBILITY_SNAPSHOT);

  const highlightIds = onboardingHighlightedPanelIds(nextSignals.gameDay, updatedPersistedWithPacing);
  const coverage = buildProgressionCoverageSnapshot(nextSignals, policy);
  const deltaCopy = coverageDeltaCopy(persisted.lastProgressionCoverageRatio, coverage.coverageRatio);
  const signalDelta = computeProgressionSignalDelta(priorSignals, nextSignals);
  const laneCount = countActiveNotificationLanes(nextSignals, nextSignals.playerIntentOnboardingEnabled !== false);
  const milestoneEntries = forecastUpcomingMilestones(nextSignals, 2);
  const milestoneCopy = milestoneForecastCoachCopy(milestoneEntries);
  const focusSummary = summarizeFocusSessionSuppression({
    phase: 'human_turn',
    signals: nextSignals,
    policy,
    focusSessionSnoozedUntilDay: persisted.focusSessionSnoozedUntilDay,
  });
  const guidedCount = countIntroducedGuidedConcepts(nextSignals);
  const legacyAudit = auditLegacyNavTargets(nextSignals, policy);
  const legacyCoverage = countLegacyNavPatchCoverage(legacyAudit);

  const updatedPersistedFinal = mergeLastInterfaceLevelIntoPersisted(
    mergeCoverageRatioIntoPersisted(
      {
        ...updatedPersistedWithPacing,
        rememberedPanelIds: [
          ...new Set([...(updatedPersistedWithPacing.rememberedPanelIds ?? []), ...highlightIds]),
        ],
      },
      coverage.coverageRatio
    ),
    nextSignals.interfaceLevel
  );

  const calmHint = evaluateDayAdvanceCalmRecoveryHint({
    signals: nextSignals,
    policy,
    persisted: updatedPersistedFinal,
    newlyUnlockedPanelCount: newlyUnlockedPanelIds.length,
    deferredAnnouncementCount: combinedQueue.length,
  });

  const calmApply = applyCalmRecoveryFromDayAdvanceHint(
    updatedPersistedFinal,
    calmHint,
    nextSignals.gameDay,
    { autoApply: context.autoApplyCalmRecovery !== false }
  );
  let persistedAfterCalm = calmApply.persisted;

  const legacyRememberPlan = buildLegacyNavAutoRememberPlan(nextSignals, policy, persistedAfterCalm);
  const legacyRememberApply = applyLegacyNavAutoRemember(persistedAfterCalm, legacyRememberPlan, {
    autoRemember: context.autoRememberLegacyNav !== false,
  });
  persistedAfterCalm = legacyRememberApply.persisted;

  const accessibility = context.accessibility ?? DEFAULT_ACCESSIBILITY_SNAPSHOT;
  const textScaleDayHint = buildTextScaleDensityDayHint({
    signals: nextSignals,
    accessibility,
    preferredDensity: persistedAfterCalm.preferredDensity ?? null,
  });

  const textScaleDensityApply = applyTextScaleDensityFromDayHint(
    persistedAfterCalm,
    textScaleDayHint,
    accessibility,
    { autoApply: context.autoApplyTextScaleDensity !== false }
  );
  persistedAfterCalm = textScaleDensityApply.persisted;

  const calmExpiryHint = buildCalmRecoveryExpiryDayHint(persistedAfterCalm, nextSignals.gameDay);

  const dismissalQuietHint = buildCoachDismissalQuietDayHint(persistedAfterCalm, nextSignals.gameDay);

  const sessionResumeCoach = buildSessionResumeDayAdvanceCoach({
    priorGameDay: priorSignals.gameDay,
    nextGameDay: nextSignals.gameDay,
    signals: nextSignals,
    policy,
    accessibility,
    sessionMemory: context.sessionMemory,
    phaseAllowsResume: context.phase !== 'save_load' && context.phase !== 'main_menu',
  });

  const showAllDayHint =
    context.phase != null
      ? buildShowAllOverrideDayHint({
          persisted: persistedAfterCalm,
          phase: context.phase,
          signals: nextSignals,
          policy,
          nextGameDay: nextSignals.gameDay,
        })
      : { overrideActive: false, riskyPhase: false, coachCopy: null };

  const highContrastDayCoach = buildHighContrastChromeDayCoach({
    accessibility,
    nextGameDay: nextSignals.gameDay,
  });

  const densityForTouch = resolveUiDensityProfile({
    interfaceLevel: nextSignals.interfaceLevel,
    preferredTier: persistedAfterCalm.preferredDensity ?? null,
    textScaleMultiplier: accessibility.textScaleMultiplier,
  });

  const cognitiveLoadDayCoach = buildCognitiveLoadDayCoach({
    signals: nextSignals,
    policy,
    pendingCoachAnnouncements: combinedQueue.length,
    nextGameDay: nextSignals.gameDay,
    cognitiveLoadCoachSnoozedUntilDay: persistedAfterCalm.cognitiveLoadCoachSnoozedUntilDay,
  });

  const focusSnoozeDayHint = buildFocusSessionSnoozeDayHint(persistedAfterCalm, nextSignals.gameDay);

  const touchTargetDayCoach = buildTouchTargetDayCoach({
    densityTier: densityForTouch.tier,
    accessibility,
    nextGameDay: nextSignals.gameDay,
  });

  const keyboardHintsDayCoach =
    context.phase != null
      ? buildKeyboardHintsDayCoach({
          interfaceLevel: nextSignals.interfaceLevel,
          phase: context.phase,
          nextGameDay: nextSignals.gameDay,
        })
      : { shortcutCount: 0, conflictCount: 0, coachCopy: null };

  let phaseShellAttentionCoachCopy: string | null = null;
  let phaseShellVisibilityDayCoachCopy: string | null = null;
  if (context.phase) {
    const load = assessCognitiveLoad({
      signals: nextSignals,
      policy,
      pendingCoachAnnouncements: combinedQueue.length,
    });
    phaseShellAttentionCoachCopy = planPhaseShellAttentionGate({
      phase: context.phase,
      band: load.band,
      persisted: persistedAfterCalm,
      gameDay: nextSignals.gameDay,
      simEvolutionBridgeRequested: newlyUnlockedPanelIds.length > 0,
      panelUnlockCoachRequested: newlyUnlockedPanelIds.length > 0,
    }).coachCopy;

    phaseShellVisibilityDayCoachCopy = buildPhaseShellVisibilityDayCoach({
      phase: context.phase,
      priorGameDay: priorSignals.gameDay,
      nextGameDay: nextSignals.gameDay,
    }).coachCopy;
  }

  return {
    gameDay: nextSignals.gameDay,
    newlyUnlockedPanelIds,
    coachAnnouncements: immediateCoach,
    deferredCoachAnnouncementCount: combinedQueue.length,
    flushedDeferredAnnouncementCount: flush.flushedAnnouncements.length,
    coachLiveRegionMessageCount: liveRegionPlan.messages.length,
    progressionCoverageRatio: coverage.coverageRatio,
    progressionCoverageDeltaCopy: deltaCopy,
    progressionSignalDeltaCopy: signalDelta.coachCopy,
    activeNotificationLaneCount: laneCount,
    milestoneForecastCoachCopy: milestoneCopy,
    focusSessionSuppressedPanelCount: focusSummary.suppressedCount,
    guidedLearningConceptCount: guidedCount,
    legacyNavPatchCoverageCount: legacyCoverage,
    calmRecoverySuggested: calmHint.suggestCalmRecovery,
    calmRecoveryHintCopy: calmApply.coachCopy ?? calmHint.coachCopy,
    calmRecoveryAutoApplied: calmApply.applied,
    textScaleDensityDayHintCopy: textScaleDayHint.coachCopy,
    textScaleDensityAutoApplied: textScaleDensityApply.applied,
    phaseShellAttentionCoachCopy,
    phaseShellVisibilityDayCoachCopy,
    legacyNavAutoRememberedCount: legacyRememberApply.rememberedCount,
    calmRecoveryExpiryHintCopy: calmExpiryHint.coachCopy,
    coachDismissalQuietDayHintCopy: dismissalQuietHint.coachCopy,
    sessionResumeDayCoachCopy: sessionResumeCoach.coachCopy,
    showAllOverrideDayHintCopy: showAllDayHint.coachCopy,
    highContrastChromeDayCoachCopy: highContrastDayCoach.coachCopy,
    cognitiveLoadDayCoachCopy: cognitiveLoadDayCoach.coachCopy,
    focusSessionSnoozeDayHintCopy: focusSnoozeDayHint.coachCopy,
    touchTargetDayCoachCopy: touchTargetDayCoach.coachCopy,
    keyboardHintsDayCoachCopy: keyboardHintsDayCoach.coachCopy,
    updatedPersisted: persistedAfterCalm,
    visiblePanelCount,
  };
}

export interface DayAdvanceDedupMeta {
  suppressedAnnouncementCount: number;
}

/** Exposes dedup counts for status banners without re-running tick logic. */
export function summarizeAnnouncementDedup(
  rawAnnouncements: string[],
  gameDay: number,
  ledger: EvolvingUiPersistedState['announcementDedupLedger']
): DayAdvanceDedupMeta {
  return {
    suppressedAnnouncementCount: filterDedupedAnnouncements(rawAnnouncements, gameDay, ledger).suppressedCount,
  };
}

export interface GuidedLearningUiUnlockEvent {
  conceptId: string;
  status: 'introduced' | 'mastered';
}

/** Maps guided-learning concept transitions to panel ids that should be remembered (legacy access preserved). */
export function applyGuidedLearningUiUnlockEvents(
  events: GuidedLearningUiUnlockEvent[],
  persisted: EvolvingUiPersistedState
): EvolvingUiPersistedState {
  const remember = new Set(persisted.rememberedPanelIds ?? []);
  for (const ev of events) {
    if (ev.status !== 'introduced' && ev.status !== 'mastered') continue;
    if (ev.conceptId === 'capital_allocation') {
      remember.add('nav_investments');
      remember.add('modal_investments');
    }
    if (ev.conceptId === 'opportunity_cost') {
      remember.add('nav_contracts');
    }
    if (ev.conceptId === 'liquidity') {
      remember.add('nav_loans');
      remember.add('nav_market');
    }
  }
  return { ...persisted, rememberedPanelIds: [...remember] };
}

export function buildEvolvingUiSettingsPatch(persisted: EvolvingUiPersistedState): { evolvingUi: EvolvingUiPersistedState } {
  return { evolvingUi: persisted };
}
