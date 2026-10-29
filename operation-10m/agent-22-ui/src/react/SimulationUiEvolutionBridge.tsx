import React from 'react';
import type { DayAdvanceUiEvolutionResult } from '../sim/evolution-hooks.js';

export interface SimulationUiEvolutionBridgeProps {
  result: DayAdvanceUiEvolutionResult | null;
}

export function SimulationUiEvolutionBridge({ result }: SimulationUiEvolutionBridgeProps): React.ReactElement | null {
  if (!result || result.newlyUnlockedPanelIds.length === 0) return null;
  return (
    <div
      data-testid="sim-ui-evolution-bridge"
      role="status"
      aria-live="polite"
      className="text-xs space-y-1"
    >
      <div>Day {result.gameDay}: {result.newlyUnlockedPanelIds.length} new interface panels</div>
      {result.coachAnnouncements.slice(0, 3).map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}
