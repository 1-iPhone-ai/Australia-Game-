import React from 'react';
import type { NrDashRiskExposureConcentration } from '../core/risk-exposure-concentration.ts';

export const NrDashRiskExposureConcentrationCard: React.FC<{
  conc: NrDashRiskExposureConcentration | null;
}> = ({ conc }) => {
  if (!conc) return null;
  return (
    <div className="rounded-lg border border-slate-600/50 p-3 text-xs" data-testid="nr-dash-risk-exposure-concentration">
      <div className="font-semibold mb-1">Risk exposure concentration</div>
      <div className="opacity-80">
        HHI {conc.concentrationIndex} · top {conc.topRegionId ?? '—'} ({Math.round(conc.topRegionShare * 100)}% of{' '}
        {conc.totalExposure})
      </div>
    </div>
  );
};
