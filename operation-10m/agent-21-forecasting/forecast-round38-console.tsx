/**
 * Agent 21 — scale wave round 38 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave37OriginGate } from './forecast-integration-wave37-origin-handoff';
import { syncAg21Wave38ProjectionBaseline } from './forecast-wave38-projection-sync';
import { handoffAg21IntegrationWave38OriginGate } from './forecast-integration-wave38-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound38Console: React.FC<{ seed?: number }> = ({ seed = 138 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 53 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.16), actorDebt: base.actorDebt + 1080 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave37OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave38ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave38OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round38-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 38 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round38-prior">
        Wave 37 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round38-projection">
        Wave 38 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round38-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
