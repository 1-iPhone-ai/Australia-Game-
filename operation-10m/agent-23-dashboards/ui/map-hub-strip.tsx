import React from 'react';
import type { NrDashMapHubRow } from '../core/map-hub-index.ts';

export const NrDashMapHubStrip: React.FC<{ hubs: NrDashMapHubRow[]; primaryHubId: string | null }> = ({
  hubs,
  primaryHubId,
}) => {
  if (!hubs.length) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-map-hubs">
      <div className="font-semibold mb-1">Connectivity hubs (adjacency + dependencies)</div>
      <ul className="list-disc list-inside opacity-90">
        {hubs.map(h => (
          <li key={h.regionId}>
            {h.regionId}: score {h.hubScore}
            {primaryHubId === h.regionId ? ' · primary' : ''} (adj {h.adjacencyCount}, in {h.dependencyIn}, out{' '}
            {h.dependencyOut})
          </li>
        ))}
      </ul>
    </div>
  );
};
