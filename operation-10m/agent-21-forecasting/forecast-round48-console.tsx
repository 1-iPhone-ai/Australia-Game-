/**
 * Agent 21 — scale wave round 48 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave47OriginGate } from './forecast-integration-wave47-origin-handoff';
import { syncAg21Wave48ProjectionBaseline } from './forecast-wave48-projection-sync';
import { handoffAg21IntegrationWave48OriginGate } from './forecast-integration-wave48-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound48Console: React.FC<{ seed?: number }> = ({ seed = 148 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 63 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.075), actorDebt: base.actorDebt + 1345 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave47OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave48ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave48OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round48-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 48 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round48-prior">
        Wave 47 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round48-projection">
        Wave 48 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round48-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
