import React from 'react';
import type { NrDashEconomyMomentumDriftRow } from '../core/economy-momentum-drift.ts';

export const NrDashEconomyMomentumDriftStrip: React.FC<{
  meanAbsDrift: number;
  rows: NrDashEconomyMomentumDriftRow[];
}> = ({ meanAbsDrift, rows }) => {
  if (!rows.length) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-economy-momentum-drift">
      <div className="font-semibold mb-1">Economy ↔ momentum rank drift</div>
      <div className="opacity-90 mb-1">μ |Δ| {meanAbsDrift}</div>
      <ul className="list-disc list-inside opacity-90">
        {rows.map(r => (
          <li key={r.regionId}>
            {r.regionId}: econ {r.economyRank} vs mom {r.momentumRank} (Δ {r.drift})
          </li>
        ))}
      </ul>
    </div>
  );
};
