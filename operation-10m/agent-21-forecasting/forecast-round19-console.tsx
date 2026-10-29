/**
 * Agent 21 — scale wave round 19 console (wave-19 sync + origin handoff + wave-18 handoff).
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave18OriginGate } from './forecast-integration-wave18-origin-handoff';
import { syncAg21Wave19ProjectionBaseline } from './forecast-wave19-projection-sync';
import { handoffAg21IntegrationWave19OriginGate } from './forecast-integration-wave19-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound19Console: React.FC<{ seed?: number }> = ({ seed = 119 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 34 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.5), actorDebt: base.actorDebt + 510 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave18OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave19ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave19OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round19-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 19 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round19-prior">
        Wave 18 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round19-projection">
        Wave 19 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round19-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
