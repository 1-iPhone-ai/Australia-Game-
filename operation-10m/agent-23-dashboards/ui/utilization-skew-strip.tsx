import React from 'react';
import { NATIONAL_NETWORK_ICON, NATIONAL_NETWORK_LABEL } from '../core/constants.ts';
import type { NrDashUtilizationSkew } from '../core/utilization-skew.ts';

export const NrDashUtilizationSkewStrip: React.FC<{ skew: NrDashUtilizationSkew | null }> = ({ skew }) => {
  if (!skew) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-utilization-skew">
      National utilization spread {skew.spread} (σ {skew.stdDev}) · hottest{' '}
      {skew.hottestNetwork ? `${NATIONAL_NETWORK_ICON[skew.hottestNetwork]} ${NATIONAL_NETWORK_LABEL[skew.hottestNetwork]}` : '—'}
    </div>
  );
};
