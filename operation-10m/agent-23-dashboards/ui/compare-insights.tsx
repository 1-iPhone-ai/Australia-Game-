import React from 'react';
import type { NrDashCompareInsights } from '../core/analytics.ts';
import type { NrDashConditionBucket } from '../core/condition-catalog.ts';
import type { NrDashMomentumDivergence } from '../core/momentum-divergence.ts';
import { NATIONAL_NETWORK_LABEL } from '../core/constants.ts';

export const NrDashCompareInsightsPanel: React.FC<{
  insights: NrDashCompareInsights;
  divergence?: NrDashMomentumDivergence | null;
  conditionBuckets?: NrDashConditionBucket[];
}> = ({ insights, divergence, conditionBuckets = [] }) => (
  <div className="grid md:grid-cols-2 gap-3 text-xs" data-testid="nr-dash-compare-insights">
    <div className="rounded border border-slate-600/50 p-2">
      <div className="font-semibold mb-1">Regional control (snapshot)</div>
      <div>You {insights.ownerBreakdown.you} · Rival {insights.ownerBreakdown.rival} · Neutral {insights.ownerBreakdown.neutral}</div>
      <div className="opacity-75 mt-1">
        Open needs Σ {insights.totalOpenNeeds} · High risks Σ {insights.totalHighRisks}
      </div>
    </div>
    <div className="rounded border border-slate-600/50 p-2">
      <div className="font-semibold mb-1">Momentum leaders</div>
      <ul className="list-disc list-inside">
        {insights.momentumLeaders.map(l => (
          <li key={l.regionId}>
            {l.name} ({l.momentumBand})
          </li>
        ))}
      </ul>
    </div>
    <div className="rounded border border-slate-600/50 p-2 md:col-span-2">
      <div className="font-semibold mb-1">Network stress (peak utilization by network)</div>
      <div className="flex flex-wrap gap-2">
        {insights.networkStress.map(s => (
          <span key={s.network} className="px-1.5 py-0.5 rounded bg-slate-800/80">
            {NATIONAL_NETWORK_LABEL[s.network]} {Math.round(s.peakUtilization * 100)}%
            {s.worstRegionId ? ` @ ${s.worstRegionId}` : ''}
          </span>
        ))}
      </div>
    </div>
    {divergence && (
      <div className="rounded border border-slate-600/50 p-2" data-testid="nr-dash-momentum-divergence">
        <div className="font-semibold mb-1">Momentum divergence</div>
        <div>
          Spread {divergence.spread} · dispersion {divergence.dispersion} · hot {divergence.hottestRegionId ?? '—'} · cold{' '}
          {divergence.coldestRegionId ?? '—'}
        </div>
      </div>
    )}
    {conditionBuckets.length > 0 && (
      <div className="rounded border border-slate-600/50 p-2 md:col-span-2" data-testid="nr-dash-condition-catalog">
        <div className="font-semibold mb-1">Network condition counts (regions)</div>
        <div className="flex flex-wrap gap-1">
          {conditionBuckets.slice(0, 12).map(b => (
            <span key={`${b.network}-${b.condition}`} className="px-1 py-0.5 rounded bg-slate-800/70">
              {b.networkLabel} {b.conditionLabel}: {b.regionCount}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);
