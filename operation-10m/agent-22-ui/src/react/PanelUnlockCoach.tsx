import React from 'react';
import { listMilestonesApproaching, listNextUnlockRecommendations } from '../engine/progression-coach.js';
import { isPhaseCoachSurfaceAllowed, planPhaseCoachSurfaces } from '../engine/phase-coach-gate.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';

export interface PanelUnlockCoachProps {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  phase?: V94StandardizedGamePhase;
  onSelectPanel?: (panelId: string) => void;
}

export function PanelUnlockCoach({ signals, policy, phase = 'human_turn', onSelectPanel }: PanelUnlockCoachProps): React.ReactElement {
  const gate = planPhaseCoachSurfaces(phase, 'moderate');
  if (!isPhaseCoachSurfaceAllowed(gate, 'panel_unlock_coach')) {
    return (
      <div data-testid="panel-unlock-coach" className="text-xs opacity-70">
        Panel unlock coach paused for {phase}.
      </div>
    );
  }
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
