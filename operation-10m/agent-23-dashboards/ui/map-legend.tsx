import React from 'react';

export const NrDashMapLegend: React.FC = () => (
  <div className="flex flex-wrap gap-3 text-[10px] opacity-80" data-testid="nr-dash-map-legend">
    <span>— — land adjacency</span>
    <span>—— NS dependency (color = provider network condition)</span>
    <span>Ring: you / rival / neutral</span>
    <span>Dim: outside focus neighborhood</span>
  </div>
);
