/**
 * Agent 21 — scale wave round 27 console (wave-27 sync + origin handoff + wave-26 handoff).
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave26OriginGate } from './forecast-integration-wave26-origin-handoff';
import { syncAg21Wave27ProjectionBaseline } from './forecast-wave27-projection-sync';
import { handoffAg21IntegrationWave27OriginGate } from './forecast-integration-wave27-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound27Console: React.FC<{ seed?: number }> = ({ seed = 127 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 42 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.34), actorDebt: base.actorDebt + 750 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave26OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave27ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave27OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round27-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 27 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round27-prior">
        Wave 26 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round27-projection">
        Wave 27 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round27-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
