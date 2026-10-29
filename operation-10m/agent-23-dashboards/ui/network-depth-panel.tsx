import React from 'react';
import type { NrDashConstraintCount } from '../core/constraint-profile.ts';
import type { NrDashDependencyImportanceCount } from '../core/dependency-profile.ts';
import type { NrDashHeatRowSummary } from '../core/heat-summary.ts';

export const NrDashNetworkDepthPanel: React.FC<{
  constraints: NrDashConstraintCount[];
  dependencies: NrDashDependencyImportanceCount[];
  heatRows: NrDashHeatRowSummary[];
}> = ({ constraints, dependencies, heatRows }) => (
  <div className="grid md:grid-cols-2 gap-3 text-xs" data-testid="nr-dash-network-depth">
    {constraints.length > 0 && (
      <div className="rounded border border-slate-600/50 p-2">
        <div className="font-semibold mb-1">Primary constraints (regions)</div>
        <ul className="list-disc list-inside">
          {constraints.map(c => (
            <li key={c.network}>
              {c.label}: {c.regionCount}
            </li>
          ))}
        </ul>
      </div>
    )}
    {dependencies.length > 0 && (
      <div className="rounded border border-slate-600/50 p-2">
        <div className="font-semibold mb-1">Dependency importance</div>
        <ul className="list-disc list-inside">
          {dependencies.map(d => (
            <li key={d.importance}>
              {d.importance}: {d.count}
            </li>
          ))}
        </ul>
      </div>
    )}
    {heatRows.length > 0 && (
      <div className="rounded border border-slate-600/50 p-2 md:col-span-2">
        <div className="font-semibold mb-1">Regional worst network condition</div>
        <div className="flex flex-wrap gap-1">
          {heatRows.map(h => (
            <span key={h.regionId} className="px-1 py-0.5 rounded bg-slate-800/70">
              {h.regionId} {h.worstLabel}
              {h.strainedNetworks > 0 ? ` (${h.strainedNetworks} strained+)` : ''}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);
