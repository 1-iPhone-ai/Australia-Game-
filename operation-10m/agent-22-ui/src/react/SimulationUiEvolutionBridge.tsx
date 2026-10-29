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
      {result.coachAnnouncements.slice(0, 3).map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}
