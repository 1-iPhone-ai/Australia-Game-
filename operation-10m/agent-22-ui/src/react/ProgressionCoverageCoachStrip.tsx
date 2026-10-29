import React from 'react';
import type { ProgressionCoverageSnapshot } from '../engine/progression-coverage-snapshot.js';
import { coverageDeltaCopy } from '../engine/progression-coverage-snapshot.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { mergeHighContrastChromeStyle } from '../engine/high-contrast-chrome-policy.js';

export interface ProgressionCoverageCoachStripProps {
  snapshot: ProgressionCoverageSnapshot;
  previousCoverageRatio?: number;
  accessibility: AccessibilitySettingsSnapshot;
}

export function ProgressionCoverageCoachStrip({
  snapshot,
  previousCoverageRatio,
  accessibility,
}: ProgressionCoverageCoachStripProps): React.ReactElement | null {
  const delta = coverageDeltaCopy(previousCoverageRatio, snapshot.coverageRatio);
  if (!snapshot.coachCopy && !delta) return null;

  return (
    <div
      data-testid="progression-coverage-coach-strip"
      role="status"
      aria-live="polite"
      className="text-xs border border-cyan-500/30 rounded p-2 space-y-1"
      style={mergeHighContrastChromeStyle(accessibility)}
      data-coverage-tier={snapshot.tierLabel}
    >
      {snapshot.coachCopy ? <p>{snapshot.coachCopy}</p> : null}
      {delta ? <p data-testid="progression-coverage-delta">{delta}</p> : null}
      <p className="opacity-80">
        {snapshot.visible}/{snapshot.total} panels visible ({Math.round(snapshot.coverageRatio * 100)}%)
      </p>
    </div>
  );
}
