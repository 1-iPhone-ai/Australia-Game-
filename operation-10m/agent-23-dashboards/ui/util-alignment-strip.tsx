import React from 'react';
import type { NrDashUtilAlignmentDrift } from '../core/util-alignment-drift.ts';

export const NrDashUtilAlignmentStrip: React.FC<{ drift: NrDashUtilAlignmentDrift | null }> = ({ drift }) => {
  if (!drift) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-util-alignment">
      <div className="font-semibold mb-1">National vs regional util drift</div>
      <div>
        mean drift {drift.meanDrift}
        {drift.worstNetwork ? ` · widest gap ${drift.worstNetwork}` : ''}
      </div>
    </div>
  );
};
