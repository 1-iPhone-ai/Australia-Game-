/**
 * Agent 21 — scale wave round 49 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave48OriginGate } from './forecast-integration-wave48-origin-handoff';
import { syncAg21Wave49ProjectionBaseline } from './forecast-wave49-projection-sync';
import { handoffAg21IntegrationWave49OriginGate } from './forecast-integration-wave49-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound49Console: React.FC<{ seed?: number }> = ({ seed = 149 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 64 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.074), actorDebt: base.actorDebt + 1350 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave48OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave49ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave49OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round49-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 49 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round49-prior">
        Wave 48 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round49-projection">
        Wave 49 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round49-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
