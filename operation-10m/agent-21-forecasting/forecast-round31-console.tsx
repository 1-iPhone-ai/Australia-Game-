/**
 * Agent 21 — scale wave round 31 console (wave-31 sync + origin handoff + wave-30 handoff).
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave30OriginGate } from './forecast-integration-wave30-origin-handoff';
import { syncAg21Wave31ProjectionBaseline } from './forecast-wave31-projection-sync';
import { handoffAg21IntegrationWave31OriginGate } from './forecast-integration-wave31-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound31Console: React.FC<{ seed?: number }> = ({ seed = 131 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 46 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.26), actorDebt: base.actorDebt + 870 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave30OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave31ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave31OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round31-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 31 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round31-prior">
        Wave 30 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round31-projection">
        Wave 31 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round31-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
