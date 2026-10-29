/**
 * Agent 21 — scale wave round 52 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave54OriginGate } from './forecast-integration-wave54-origin-handoff';
import { syncAg21Wave73ProjectionBaseline } from './forecast-wave73-projection-sync';
import { handoffAg21IntegrationWave73OriginGate } from './forecast-integration-wave73-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound73Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave54OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave73ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave73OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round73-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round73-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round73-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round73-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
