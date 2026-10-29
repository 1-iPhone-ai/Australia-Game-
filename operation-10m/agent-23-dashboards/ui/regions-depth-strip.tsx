import React from 'react';
import type { NrDashParityGapRow } from '../core/parity-gap.ts';
import type { NrDashResilienceSpread } from '../core/resilience-spread.ts';

export const NrDashRegionsDepthStrip: React.FC<{
  spread: NrDashResilienceSpread | null;
  outliers: NrDashParityGapRow[];
}> = ({ spread, outliers }) => (
  <div className="text-xs space-y-2 mb-3" data-testid="nr-dash-regions-depth">
    {spread && (
      <div className="rounded border border-slate-600/50 p-2">
        Resilience spread: {spread.min}–{spread.max} (μ {spread.mean}, n={spread.sampleSize}) · weak{' '}
        {spread.weakestRegionId ?? '—'} · strong {spread.strongestRegionId ?? '—'}
      </div>
    )}
    {outliers.length > 0 && (
      <div className="rounded border border-slate-600/50 p-2">
        <div className="font-semibold mb-1">Momentum vs resilience gap (|gap| leaders)</div>
        <ul className="list-disc list-inside">
          {outliers.map(o => (
            <li key={o.regionId}>
              {o.name}: gap {o.gapScore} (mom rank {o.momentumRank}, res {o.resilience})
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
