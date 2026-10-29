/**
 * Agent 21 — scale wave round 51 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave50OriginGate } from './forecast-integration-wave50-origin-handoff';
import { syncAg21Wave51ProjectionBaseline } from './forecast-wave51-projection-sync';
import { handoffAg21IntegrationWave51OriginGate } from './forecast-integration-wave51-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound51Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave50OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave51ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave51OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round51-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 51 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round51-prior">
        Wave 50 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round51-projection">
        Wave 51 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round51-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
