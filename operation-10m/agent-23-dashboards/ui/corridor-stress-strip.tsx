import React from 'react';
import type { NrDashCorridorStressRow } from '../core/corridor-stress.ts';

export const NrDashCorridorStressStrip: React.FC<{ corridors: NrDashCorridorStressRow[] }> = ({ corridors }) => {
  if (!corridors.length) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-corridor-stress">
      <div className="font-semibold mb-1">Highest-stress land corridors (NS endpoints)</div>
      <ul className="list-disc list-inside">
        {corridors.map(c => (
          <li key={c.corridorKey}>
            {c.regionA}–{c.regionB}: {Math.round(c.meanPeakUtilization * 100)}% · {c.worstLabel}
          </li>
        ))}
      </ul>
    </div>
  );
};
