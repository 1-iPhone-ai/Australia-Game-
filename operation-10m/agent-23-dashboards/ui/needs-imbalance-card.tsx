import React from 'react';
import type { NrDashNeedsImbalance } from '../core/needs-imbalance.ts';

export const NrDashNeedsImbalanceCard: React.FC<{ imbalance: NrDashNeedsImbalance | null }> = ({ imbalance }) => {
  if (!imbalance) return null;
  return (
    <div className="rounded border border-slate-600/50 p-2 text-xs" data-testid="nr-dash-needs-imbalance">
      <div className="font-semibold mb-1">Regional open-needs imbalance</div>
      <div>
        Σ {imbalance.totalOpenNeeds} · μ {imbalance.meanPerRegion}/region · σ {imbalance.stdDev}
        {imbalance.neediestRegionId ? ` · peak ${imbalance.neediestRegionId} (${imbalance.neediestOpenNeeds})` : ''}
        {imbalance.spreadRatio != null ? ` · spread ×${imbalance.spreadRatio}` : ''}
      </div>
    </div>
  );
};
