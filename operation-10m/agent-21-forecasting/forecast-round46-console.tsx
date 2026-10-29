/**
 * Agent 21 — scale wave round 46 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave45OriginGate } from './forecast-integration-wave45-origin-handoff';
import { syncAg21Wave46ProjectionBaseline } from './forecast-wave46-projection-sync';
import { handoffAg21IntegrationWave46OriginGate } from './forecast-integration-wave46-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound46Console: React.FC<{ seed?: number }> = ({ seed = 146 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 61 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.08), actorDebt: base.actorDebt + 1320 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave45OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave46ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave46OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round46-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 46 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round46-prior">
        Wave 45 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round46-projection">
        Wave 46 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round46-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
