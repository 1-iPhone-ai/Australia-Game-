import React from 'react';
import type { DayAdvanceUiEvolutionResult } from '../sim/evolution-hooks.js';

export interface SimulationUiEvolutionBridgeProps {
  result: DayAdvanceUiEvolutionResult | null;
  suppressedAnnouncementCount?: number;
}

export function SimulationUiEvolutionBridge({
  result,
  suppressedAnnouncementCount = 0,
}: SimulationUiEvolutionBridgeProps): React.ReactElement | null {
  if (!result || (result.newlyUnlockedPanelIds.length === 0 && suppressedAnnouncementCount <= 0)) return null;
  return (
    <div
      data-testid="sim-ui-evolution-bridge"
      role="status"
      aria-live="polite"
      className="text-xs space-y-1"
    >
      <div>Day {result.gameDay}: {result.newlyUnlockedPanelIds.length} new interface panels</div>
      {suppressedAnnouncementCount > 0 ? (
        <div data-testid="sim-ui-evolution-dedup-count">
          Held back {suppressedAnnouncementCount} repeated announcements
        </div>
      ) : null}
      {result.deferredCoachAnnouncementCount > 0 ? (
        <div data-testid="sim-ui-evolution-pacing-count">
          Staggered {result.deferredCoachAnnouncementCount} coach announcements
        </div>
      ) : null}
      {result.flushedDeferredAnnouncementCount > 0 ? (
        <div data-testid="sim-ui-evolution-flush-count">
          Flushed {result.flushedDeferredAnnouncementCount} queued coach announcements
        </div>
      ) : null}
      {result.coachLiveRegionMessageCount > 0 ? (
        <div data-testid="sim-ui-evolution-live-region-count">
          Scheduled {result.coachLiveRegionMessageCount} live-region coach messages
        </div>
      ) : null}
      {result.progressionCoverageDeltaCopy ? (
        <div data-testid="sim-ui-evolution-coverage-delta">{result.progressionCoverageDeltaCopy}</div>
      ) : null}
      {result.progressionSignalDeltaCopy ? (
        <div data-testid="sim-ui-evolution-signal-delta">{result.progressionSignalDeltaCopy}</div>
      ) : null}
      {result.activeNotificationLaneCount > 0 ? (
        <div data-testid="sim-ui-evolution-lane-count">
          {result.activeNotificationLaneCount} notification lanes active
        </div>
      ) : null}
      {result.milestoneForecastCoachCopy ? (
        <div data-testid="sim-ui-evolution-milestone-forecast">{result.milestoneForecastCoachCopy}</div>
      ) : null}
      {result.focusSessionSuppressedPanelCount > 0 ? (
        <div data-testid="sim-ui-evolution-focus-suppression">
          Focus session previewing {result.focusSessionSuppressedPanelCount} panels
        </div>
      ) : null}
      {result.calmRecoveryHintCopy ? (
        <div data-testid="sim-ui-evolution-calm-hint">{result.calmRecoveryHintCopy}</div>
      ) : null}
      {result.calmRecoveryAutoApplied ? (
        <div data-testid="sim-ui-evolution-calm-auto-applied">Calm recovery auto-applied</div>
      ) : null}
      {result.textScaleDensityDayHintCopy ? (
        <div data-testid="sim-ui-evolution-text-scale-hint">{result.textScaleDensityDayHintCopy}</div>
      ) : null}
      {result.textScaleDensityAutoApplied ? (
        <div data-testid="sim-ui-evolution-text-scale-auto-applied">Text scale density auto-applied</div>
      ) : null}
      {result.phaseShellAttentionCoachCopy ? (
        <div data-testid="sim-ui-evolution-phase-attention">{result.phaseShellAttentionCoachCopy}</div>
      ) : null}
      {result.phaseShellVisibilityDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-phase-visibility-day">{result.phaseShellVisibilityDayCoachCopy}</div>
      ) : null}
      {result.legacyNavAutoRememberedCount > 0 ? (
        <div data-testid="sim-ui-evolution-legacy-remember">
          Remembered {result.legacyNavAutoRememberedCount} legacy nav panels
        </div>
      ) : null}
      {result.calmRecoveryExpiryHintCopy ? (
        <div data-testid="sim-ui-evolution-calm-expiry">{result.calmRecoveryExpiryHintCopy}</div>
      ) : null}
      {result.coachDismissalQuietDayHintCopy ? (
        <div data-testid="sim-ui-evolution-dismissal-quiet">{result.coachDismissalQuietDayHintCopy}</div>
      ) : null}
      {result.sessionResumeDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-session-resume-day">{result.sessionResumeDayCoachCopy}</div>
      ) : null}
      {result.showAllOverrideDayHintCopy ? (
        <div data-testid="sim-ui-evolution-show-all-day">{result.showAllOverrideDayHintCopy}</div>
      ) : null}
      {result.highContrastChromeDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-hc-day">{result.highContrastChromeDayCoachCopy}</div>
      ) : null}
      {result.cognitiveLoadDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-cognitive-load-day">{result.cognitiveLoadDayCoachCopy}</div>
      ) : null}
      {result.focusSessionSnoozeDayHintCopy ? (
        <div data-testid="sim-ui-evolution-focus-snooze-day">{result.focusSessionSnoozeDayHintCopy}</div>
      ) : null}
      {result.touchTargetDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-touch-target-day">{result.touchTargetDayCoachCopy}</div>
      ) : null}
      {result.keyboardHintsDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-keyboard-hints-day">{result.keyboardHintsDayCoachCopy}</div>
      ) : null}
      {result.announcementDedupDayHintCopy ? (
        <div data-testid="sim-ui-evolution-dedup-day">{result.announcementDedupDayHintCopy}</div>
      ) : null}
      {result.layoutPresetDensityDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-layout-density-day">{result.layoutPresetDensityDayCoachCopy}</div>
      ) : null}
      {result.motionTimingDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-motion-day">{result.motionTimingDayCoachCopy}</div>
      ) : null}
      {result.memoryQuickActionDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-memory-qa-day">{result.memoryQuickActionDayCoachCopy}</div>
      ) : null}
      {result.deferredAnnouncementFlushDayHintCopy ? (
        <div data-testid="sim-ui-evolution-deferred-flush-day">{result.deferredAnnouncementFlushDayHintCopy}</div>
      ) : null}
      {result.textScaleReadabilityDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-text-readability-day">{result.textScaleReadabilityDayCoachCopy}</div>
      ) : null}
      {result.responsiveNavRailDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-nav-rail-day">{result.responsiveNavRailDayCoachCopy}</div>
      ) : null}
      {result.onboardingFunnelDayHintCopy ? (
        <div data-testid="sim-ui-evolution-onboarding-day">{result.onboardingFunnelDayHintCopy}</div>
      ) : null}
      {result.phaseCoachGateDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-phase-gate-day">{result.phaseCoachGateDayCoachCopy}</div>
      ) : null}
      {result.notificationLaneDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-lane-day">{result.notificationLaneDayCoachCopy}</div>
      ) : null}
      {result.landmarkReadingDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-landmark-day">{result.landmarkReadingDayCoachCopy}</div>
      ) : null}
      {result.coachLiveRegionDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-live-region-day">{result.coachLiveRegionDayCoachCopy}</div>
      ) : null}
      {result.attentionSurfaceDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-attention-day">{result.attentionSurfaceDayCoachCopy}</div>
      ) : null}
      {result.guidedLearningDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-guided-day">{result.guidedLearningDayCoachCopy}</div>
      ) : null}
      {result.keyboardShortcutConflictDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-shortcut-conflict-day">{result.keyboardShortcutConflictDayCoachCopy}</div>
      ) : null}
      {result.contextualWidgetDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-widget-day">{result.contextualWidgetDayCoachCopy}</div>
      ) : null}
      {result.legacyNavAuditDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-legacy-audit-day">{result.legacyNavAuditDayCoachCopy}</div>
      ) : null}
      {result.progressionCoverageDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-coverage-day">{result.progressionCoverageDayCoachCopy}</div>
      ) : null}
      {result.announcementPacingDayHintCopy ? (
        <div data-testid="sim-ui-evolution-pacing-day">{result.announcementPacingDayHintCopy}</div>
      ) : null}
      {result.phaseShellPlanDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-shell-plan-day">{result.phaseShellPlanDayCoachCopy}</div>
      ) : null}
      {result.milestoneForecastDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-milestone-day">{result.milestoneForecastDayCoachCopy}</div>
      ) : null}
      {result.focusSessionSuppressionDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-focus-suppression-day">{result.focusSessionSuppressionDayCoachCopy}</div>
      ) : null}
      {result.progressionSignalDeltaDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-signal-delta-day">{result.progressionSignalDeltaDayCoachCopy}</div>
      ) : null}
      {result.layoutOnboardingDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-layout-onboarding-day">{result.layoutOnboardingDayCoachCopy}</div>
      ) : null}
      {result.guidedLearningPanelDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-guided-panel-day">{result.guidedLearningPanelDayCoachCopy}</div>
      ) : null}
      {result.calmRecoveryStatusDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-calm-status-day">{result.calmRecoveryStatusDayCoachCopy}</div>
      ) : null}
      {result.phaseShellAttentionDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-phase-attention-day">{result.phaseShellAttentionDayCoachCopy}</div>
      ) : null}
      {result.modalFocusTrapDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-modal-trap-day">{result.modalFocusTrapDayCoachCopy}</div>
      ) : null}
      {result.showAllProgressiveSafetyDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-show-all-safety-day">{result.showAllProgressiveSafetyDayCoachCopy}</div>
      ) : null}
      {result.legacyNavAutoRememberDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-legacy-remember-day">{result.legacyNavAutoRememberDayCoachCopy}</div>
      ) : null}
      {result.focusSessionPolicyDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-focus-policy-day">{result.focusSessionPolicyDayCoachCopy}</div>
      ) : null}
      {result.coachDismissalBackoffDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-dismissal-backoff-day">{result.coachDismissalBackoffDayCoachCopy}</div>
      ) : null}
      {result.sessionResumeCoachPlanDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-session-plan-day">{result.sessionResumeCoachPlanDayCoachCopy}</div>
      ) : null}
      {result.dayAdvanceCalmRecoveryDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-calm-recovery-day">{result.dayAdvanceCalmRecoveryDayCoachCopy}</div>
      ) : null}
      {result.panelUnlockHeadlineDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-unlock-headline-day">{result.panelUnlockHeadlineDayCoachCopy}</div>
      ) : null}
      {result.uiDensityProfileDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-density-profile-day">{result.uiDensityProfileDayCoachCopy}</div>
      ) : null}
      {result.contextualQuickActionDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-contextual-qa-day">{result.contextualQuickActionDayCoachCopy}</div>
      ) : null}
      {result.nextUnlockRecommendationDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-next-unlock-day">{result.nextUnlockRecommendationDayCoachCopy}</div>
      ) : null}
      {result.milestoneApproachingDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-milestone-approaching-day">{result.milestoneApproachingDayCoachCopy}</div>
      ) : null}
      {result.accessibleChromeShellDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-chrome-shell-day">{result.accessibleChromeShellDayCoachCopy}</div>
      ) : null}
      {result.liveRegionQueueDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-live-region-queue-day">{result.liveRegionQueueDayCoachCopy}</div>
      ) : null}
      {result.modalFocusRestoreDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-modal-restore-day">{result.modalFocusRestoreDayCoachCopy}</div>
      ) : null}
      {result.layoutDensityMismatchDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-layout-mismatch-day">{result.layoutDensityMismatchDayCoachCopy}</div>
      ) : null}
      {result.newlyUnlockedBatchDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-unlock-batch-day">{result.newlyUnlockedBatchDayCoachCopy}</div>
      ) : null}
      {result.coachLiveRegionDeliveryDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-lr-delivery-day">{result.coachLiveRegionDeliveryDayCoachCopy}</div>
      ) : null}
      {result.shortcutConflictWarningDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-shortcut-warning-day">{result.shortcutConflictWarningDayCoachCopy}</div>
      ) : null}
      {result.attentionDeferralDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-attention-deferral-day">{result.attentionDeferralDayCoachCopy}</div>
      ) : null}
      {result.progressionVisibilitySummaryDayCoachCopy ? (
        <div data-testid="sim-ui-evolution-visibility-summary-day">{result.progressionVisibilitySummaryDayCoachCopy}</div>
      ) : null}
      {result.legacyNavPatchCoverageCount > 0 ? (
        <div data-testid="sim-ui-evolution-legacy-nav-coverage">
          Legacy nav patch coverage {result.legacyNavPatchCoverageCount} targets
        </div>
      ) : null}
      {result.coachAnnouncements.slice(0, 3).map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}
