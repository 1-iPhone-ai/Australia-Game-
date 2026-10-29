import React from 'react';
import type { NrDashRiskExposureSummary } from '../core/risk-exposure.ts';

export const NrDashRiskExposureCard: React.FC<{ exposure: NrDashRiskExposureSummary | null }> = ({ exposure }) => {
  if (!exposure) return null;
  const top = exposure.rows.slice(0, 3);
  return (
    <div className="rounded-lg border border-slate-600/50 p-3 text-xs" data-testid="nr-dash-risk-exposure">
      <div className="font-semibold mb-1">Risk exposure (LR needs + high risks)</div>
      <div className="opacity-80 mb-2">
        Total index {exposure.totalExposure} · σ {exposure.stdDev}
        {exposure.hotspotRegionId ? ` · hotspot ${exposure.hotspotRegionId}` : ''}
      </div>
      <ul className="list-disc list-inside opacity-90">
        {top.map(r => (
          <li key={r.regionId}>
            {r.regionId}: score {r.exposureScore} ({r.openNeeds} needs, {r.highRisks} high risks)
          </li>
        ))}
      </ul>
    </div>
  );
};
