import React from 'react';
import { computeProgressionCoverage, listMilestonesApproaching, listNextUnlockRecommendations } from '../engine/progression-coach.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';

export interface PanelUnlockCoachProps {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  onSelectPanel?: (panelId: string) => void;
}

export function PanelUnlockCoach({ signals, policy, onSelectPanel }: PanelUnlockCoachProps): React.ReactElement {
  const recs = listNextUnlockRecommendations(signals, policy, 3);
  const milestones = listMilestonesApproaching(signals, 2);
  if (recs.length === 0 && milestones.length === 0) {
    return (
      <div data-testid="panel-unlock-coach" className="text-xs opacity-80">
        All tracked panels unlocked for your current progression.
      </div>
    );
  }
  return (
    <div data-testid="panel-unlock-coach" className="text-xs space-y-1" role="complementary" aria-label="Upcoming interface unlocks">
      {recs.map(r => (
        <button
          key={r.panelId}
          type="button"
          className="block text-left underline"
          onClick={() => onSelectPanel?.(r.panelId)}
          data-testid={`coach-rec-${r.panelId}`}
        >
          {r.headline}
        </button>
      ))}
      {milestones.map(m => (
        <div key={m.milestoneId} data-testid={`coach-milestone-${m.milestoneId}`}>
          {m.coachCopy}
        </div>
      ))}
    </div>
  );
}
