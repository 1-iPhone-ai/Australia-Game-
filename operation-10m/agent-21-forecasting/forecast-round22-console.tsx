/**
 * Agent 21 — scale wave round 22 console (wave-22 sync + origin handoff + wave-21 handoff).
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave21OriginGate } from './forecast-integration-wave21-origin-handoff';
import { syncAg21Wave22ProjectionBaseline } from './forecast-wave22-projection-sync';
import { handoffAg21IntegrationWave22OriginGate } from './forecast-integration-wave22-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound22Console: React.FC<{ seed?: number }> = ({ seed = 122 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 37 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.44), actorDebt: base.actorDebt + 600 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave21OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave22ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave22OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round22-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 22 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round22-prior">
        Wave 21 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round22-projection">
        Wave 22 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round22-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
