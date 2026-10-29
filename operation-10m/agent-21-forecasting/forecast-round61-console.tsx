/**
 * Agent 21 — scale wave round 52 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave54OriginGate } from './forecast-integration-wave54-origin-handoff';
import { syncAg21Wave61ProjectionBaseline } from './forecast-wave61-projection-sync';
import { handoffAg21IntegrationWave61OriginGate } from './forecast-integration-wave61-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound61Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave54OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave61ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave61OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round61-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round61-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round61-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round61-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
