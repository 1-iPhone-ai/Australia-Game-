/**
 * Agent 21 — scale wave round 43 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave42OriginGate } from './forecast-integration-wave42-origin-handoff';
import { syncAg21Wave43ProjectionBaseline } from './forecast-wave43-projection-sync';
import { handoffAg21IntegrationWave43OriginGate } from './forecast-integration-wave43-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound43Console: React.FC<{ seed?: number }> = ({ seed = 143 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 58 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.11), actorDebt: base.actorDebt + 1230 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave42OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave43ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave43OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round43-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 43 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round43-prior">
        Wave 42 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round43-projection">
        Wave 43 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round43-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
