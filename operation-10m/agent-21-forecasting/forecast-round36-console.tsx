/**
 * Agent 21 — scale wave round 36 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave35OriginGate } from './forecast-integration-wave35-origin-handoff';
import { syncAg21Wave36ProjectionBaseline } from './forecast-wave36-projection-sync';
import { handoffAg21IntegrationWave36OriginGate } from './forecast-integration-wave36-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound36Console: React.FC<{ seed?: number }> = ({ seed = 136 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 51 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.18), actorDebt: base.actorDebt + 1020 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave35OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave36ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave36OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round36-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 36 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round36-prior">
        Wave 35 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round36-projection">
        Wave 36 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round36-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
