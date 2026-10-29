import React from 'react';
import type { NrDashDependencyAsymmetryRow } from '../core/dependency-asymmetry.ts';

export const NrDashDependencyAsymmetryStrip: React.FC<{ rows: NrDashDependencyAsymmetryRow[] }> = ({ rows }) => {
  if (!rows.length) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dependency-asymmetry">
      <div className="font-semibold mb-1">Dependency flow asymmetry</div>
      <ul className="list-disc list-inside opacity-90">
        {rows.map(r => (
          <li key={r.regionId}>
            {r.regionId}: net {r.netImportWeight >= 0 ? 'import' : 'export'} {Math.abs(r.netImportWeight)} (in {r.inboundWeight} / out{' '}
            {r.outboundWeight})
          </li>
        ))}
      </ul>
    </div>
  );
};
