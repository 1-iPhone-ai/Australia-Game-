import React from 'react';
import type { NrDashPeripheralIsolationRow } from '../core/peripheral-isolation.ts';

export const NrDashPeripheralIsolationStrip: React.FC<{
  rows: NrDashPeripheralIsolationRow[];
}> = ({ rows }) => {
  if (!rows.length) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-peripheral-isolation">
      <div className="font-semibold mb-1">Peripheral isolation (low connectivity)</div>
      <ul className="list-disc list-inside opacity-90">
        {rows.map(r => (
          <li key={r.regionId}>
            {r.regionId}: isolation {r.isolationScore} (hub {r.hubScore})
          </li>
        ))}
      </ul>
    </div>
  );
};
