import React from 'react';
import type { NrDashOwnerStressGap } from '../core/owner-stress-gap.ts';

export const NrDashOwnerStressGapCard: React.FC<{ gap: NrDashOwnerStressGap | null }> = ({ gap }) => {
  if (!gap) return null;
  return (
    <div className="rounded border border-slate-600/50 p-2 text-xs" data-testid="nr-dash-owner-stress-gap">
      <div className="font-semibold mb-1">Your regions vs national stress</div>
      <div>
        {gap.ownedRegionCount} owned · needs μ {gap.ownedMeanOpenNeeds} vs {gap.nationalMeanOpenNeeds} national (Δ{' '}
        {gap.openNeedsGap >= 0 ? '+' : ''}
        {gap.openNeedsGap})
        {gap.resilienceGap != null
          ? ` · resilience Δ ${gap.resilienceGap >= 0 ? '+' : ''}${gap.resilienceGap}`
          : ''}
      </div>
    </div>
  );
};
