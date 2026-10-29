/**
 * Agent 21 — scale wave round 40 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave39OriginGate } from './forecast-integration-wave39-origin-handoff';
import { syncAg21Wave40ProjectionBaseline } from './forecast-wave40-projection-sync';
import { handoffAg21IntegrationWave40OriginGate } from './forecast-integration-wave40-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound40Console: React.FC<{ seed?: number }> = ({ seed = 140 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 55 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.14), actorDebt: base.actorDebt + 1140 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave39OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave40ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave40OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round40-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 40 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round40-prior">
        Wave 39 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round40-projection">
        Wave 40 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round40-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
