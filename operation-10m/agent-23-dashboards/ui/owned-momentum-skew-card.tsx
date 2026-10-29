import React from 'react';
import type { NrDashOwnedMomentumSkew } from '../core/owned-momentum-skew.ts';

export const NrDashOwnedMomentumSkewCard: React.FC<{ skew: NrDashOwnedMomentumSkew | null }> = ({ skew }) => {
  if (!skew) return null;
  return (
    <div className="rounded border border-slate-600/50 p-2 text-xs" data-testid="nr-dash-owned-momentum-skew">
      <div className="font-semibold mb-1">Your portfolio momentum skew</div>
      <div>
        {skew.ownedRegionCount} owned · rank μ {skew.ownedMeanRank} vs {skew.nationalMeanRank} national (Δ{' '}
        {skew.rankSkew >= 0 ? '+' : ''}
        {skew.rankSkew})
      </div>
    </div>
  );
};
