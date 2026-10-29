import React from 'react';
import { computeProgressionCoverage, listNextUnlockRecommendations } from '../engine/progression-coach.js';
import { resolveAllPanelVisibilities } from '../engine/resolve-panel-visibility.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';

export interface EvolvingUiProgressLabProps {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  onRunSelfTests?: () => void;
  selfTestSummary?: string;
}

export function EvolvingUiProgressLab({
  signals,
  policy,
  onRunSelfTests,
  selfTestSummary,
}: EvolvingUiProgressLabProps): React.ReactElement {
  const coverage = computeProgressionCoverage(signals, policy);
  const recs = listNextUnlockRecommendations(signals, policy, 5);
  const vis = resolveAllPanelVisibilities(signals, policy);
  const previewCount = vis.filter(v => v.state === 'preview').length;

  return (
    <div
      data-testid="evolving-ui-progress-lab"
      style={{ padding: 12, fontSize: 12, color: '#e2e8f0' }}
      role="region"
      aria-label="Evolving UI progression lab"
    >
      <strong style={{ color: '#22d3ee' }}>LAB — Agent 22 Evolving UI</strong>
      <div>
        Coverage: {(coverage.coverageRatio * 100).toFixed(0)}% visible ({coverage.visible}/{coverage.total}) · preview{' '}
        {previewCount} · hidden {coverage.hidden}
      </div>
      <div style={{ marginTop: 8 }}>
        {recs.map(r => (
          <div key={r.panelId}>
            {r.label}: {r.hint}
          </div>
        ))}
      </div>
      {onRunSelfTests && (
        <button type="button" onClick={onRunSelfTests} style={{ marginTop: 8 }} data-testid="evolving-ui-run-self-tests">
          Run Agent 22 Self-Tests
        </button>
      )}
      {selfTestSummary && <div style={{ marginTop: 4 }}>{selfTestSummary}</div>}
    </div>
  );
}
