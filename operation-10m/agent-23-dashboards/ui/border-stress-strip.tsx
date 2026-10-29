import React from 'react';
import type { NrDashBorderStressRow } from '../core/border-stress.ts';

export const NrDashBorderStressStrip: React.FC<{ rows: NrDashBorderStressRow[] }> = ({ rows }) => {
  if (!rows.length) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-border-stress">
      <div className="font-semibold mb-1">Border corridor stress (max per region)</div>
      <ul className="list-disc list-inside opacity-90">
        {rows.map(r => (
          <li key={r.regionId}>
            {r.regionId}: {Math.round(r.maxCorridorStress * 100)}% on {r.corridorCount} border(s)
          </li>
        ))}
      </ul>
    </div>
  );
};
