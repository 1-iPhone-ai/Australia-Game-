/**
 * Agent 21 — scale wave round 47 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave46OriginGate } from './forecast-integration-wave46-origin-handoff';
import { syncAg21Wave47ProjectionBaseline } from './forecast-wave47-projection-sync';
import { handoffAg21IntegrationWave47OriginGate } from './forecast-integration-wave47-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound47Console: React.FC<{ seed?: number }> = ({ seed = 147 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 62 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.08), actorDebt: base.actorDebt + 1335 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave46OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave47ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave47OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round47-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 47 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round47-prior">
        Wave 46 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round47-projection">
        Wave 47 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round47-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
