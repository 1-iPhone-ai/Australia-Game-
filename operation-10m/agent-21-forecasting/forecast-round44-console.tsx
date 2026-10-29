/**
 * Agent 21 — scale wave round 44 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave43OriginGate } from './forecast-integration-wave43-origin-handoff';
import { syncAg21Wave44ProjectionBaseline } from './forecast-wave44-projection-sync';
import { handoffAg21IntegrationWave44OriginGate } from './forecast-integration-wave44-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound44Console: React.FC<{ seed?: number }> = ({ seed = 144 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 59 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.1), actorDebt: base.actorDebt + 1260 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave43OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave44ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave44OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round44-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 44 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round44-prior">
        Wave 43 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round44-projection">
        Wave 44 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round44-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
