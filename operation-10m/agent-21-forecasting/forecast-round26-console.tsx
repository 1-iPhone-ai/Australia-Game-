/**
 * Agent 21 — scale wave round 26 console (wave-26 sync + origin handoff + wave-25 handoff).
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave25OriginGate } from './forecast-integration-wave25-origin-handoff';
import { syncAg21Wave26ProjectionBaseline } from './forecast-wave26-projection-sync';
import { handoffAg21IntegrationWave26OriginGate } from './forecast-integration-wave26-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound26Console: React.FC<{ seed?: number }> = ({ seed = 126 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 41 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.36), actorDebt: base.actorDebt + 720 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave25OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave26ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave26OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round26-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 26 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round26-prior">
        Wave 25 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round26-projection">
        Wave 26 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round26-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
