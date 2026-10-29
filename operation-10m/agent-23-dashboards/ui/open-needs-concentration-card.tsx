import React from 'react';
import type { NrDashOpenNeedsConcentration } from '../core/open-needs-concentration.ts';

export const NrDashOpenNeedsConcentrationCard: React.FC<{ conc: NrDashOpenNeedsConcentration | null }> = ({ conc }) => {
  if (!conc) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-open-needs-concentration">
      <div className="font-semibold mb-1">Open needs concentration</div>
      <div>
        HHI {conc.concentrationIndex} · top {conc.topRegionId ?? '—'} ({Math.round(conc.topRegionShare * 100)}% of{' '}
        {conc.totalOpenNeeds})
      </div>
    </div>
  );
};
