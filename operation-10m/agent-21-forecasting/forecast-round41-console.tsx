/**
 * Agent 21 — scale wave round 41 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave40OriginGate } from './forecast-integration-wave40-origin-handoff';
import { syncAg21Wave41ProjectionBaseline } from './forecast-wave41-projection-sync';
import { handoffAg21IntegrationWave41OriginGate } from './forecast-integration-wave41-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound41Console: React.FC<{ seed?: number }> = ({ seed = 141 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 56 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.13), actorDebt: base.actorDebt + 1170 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave40OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave41ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave41OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round41-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 41 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round41-prior">
        Wave 40 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round41-projection">
        Wave 41 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round41-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
