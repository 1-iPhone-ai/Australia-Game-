/**
 * Agent 21 — scale wave round 39 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave38OriginGate } from './forecast-integration-wave38-origin-handoff';
import { syncAg21Wave39ProjectionBaseline } from './forecast-wave39-projection-sync';
import { handoffAg21IntegrationWave39OriginGate } from './forecast-integration-wave39-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound39Console: React.FC<{ seed?: number }> = ({ seed = 139 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 54 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.15), actorDebt: base.actorDebt + 1110 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave38OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave39ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave39OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round39-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 39 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round39-prior">
        Wave 38 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round39-projection">
        Wave 39 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round39-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
