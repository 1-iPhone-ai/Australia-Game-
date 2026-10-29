/**
 * Agent 21 — scale wave round 35 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave34OriginGate } from './forecast-integration-wave34-origin-handoff';
import { syncAg21Wave35ProjectionBaseline } from './forecast-wave35-projection-sync';
import { handoffAg21IntegrationWave35OriginGate } from './forecast-integration-wave35-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound35Console: React.FC<{ seed?: number }> = ({ seed = 135 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 50 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.19), actorDebt: base.actorDebt + 990 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave34OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave35ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave35OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round35-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 35 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round35-prior">
        Wave 34 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round35-projection">
        Wave 35 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round35-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
