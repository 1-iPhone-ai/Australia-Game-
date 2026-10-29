/**
 * Agent 21 — scale wave round 45 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave44OriginGate } from './forecast-integration-wave44-origin-handoff';
import { syncAg21Wave45ProjectionBaseline } from './forecast-wave45-projection-sync';
import { handoffAg21IntegrationWave45OriginGate } from './forecast-integration-wave45-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound45Console: React.FC<{ seed?: number }> = ({ seed = 145 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 60 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.09), actorDebt: base.actorDebt + 1290 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave44OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave45ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave45OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round45-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 45 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round45-prior">
        Wave 44 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round45-projection">
        Wave 45 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round45-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
