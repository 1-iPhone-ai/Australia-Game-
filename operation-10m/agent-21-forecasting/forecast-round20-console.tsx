/**
 * Agent 21 — scale wave round 20 console (wave-20 sync + origin handoff + wave-19 handoff).
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave19OriginGate } from './forecast-integration-wave19-origin-handoff';
import { syncAg21Wave20ProjectionBaseline } from './forecast-wave20-projection-sync';
import { handoffAg21IntegrationWave20OriginGate } from './forecast-integration-wave20-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound20Console: React.FC<{ seed?: number }> = ({ seed = 120 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 35 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.48), actorDebt: base.actorDebt + 540 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave19OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave20ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave20OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round20-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 20 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round20-prior">
        Wave 19 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round20-projection">
        Wave 20 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round20-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
