/**
 * Agent 21 — scale wave round 50 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave49OriginGate } from './forecast-integration-wave49-origin-handoff';
import { syncAg21Wave50ProjectionBaseline } from './forecast-wave50-projection-sync';
import { handoffAg21IntegrationWave50OriginGate } from './forecast-integration-wave50-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound50Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave49OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave50ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave50OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round50-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 50 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round50-prior">
        Wave 49 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round50-projection">
        Wave 50 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round50-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
