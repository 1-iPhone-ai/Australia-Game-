import React from 'react';
import { NATIONAL_NETWORK_ICON, NATIONAL_NETWORK_LABEL } from '../core/constants.ts';
import type { NrDashCapacityHeadroom } from '../core/capacity-headroom.ts';

export const NrDashCapacityHeadroomStrip: React.FC<{ headroom: NrDashCapacityHeadroom | null }> = ({ headroom }) => {
  if (!headroom) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-capacity-headroom">
      <div className="font-semibold mb-1">National capacity headroom</div>
      <div>
        μ {headroom.meanHeadroom} · σ {headroom.stdDev} · spread {headroom.spread}
        {headroom.tightestNetwork ? (
          <>
            {' '}
            · tightest {NATIONAL_NETWORK_ICON[headroom.tightestNetwork]}{' '}
            {NATIONAL_NETWORK_LABEL[headroom.tightestNetwork]}
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};
