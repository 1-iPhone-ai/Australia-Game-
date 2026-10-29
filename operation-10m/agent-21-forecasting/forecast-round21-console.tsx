/**
 * Agent 21 — scale wave round 21 console (wave-21 sync + origin handoff + wave-20 handoff).
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave20OriginGate } from './forecast-integration-wave20-origin-handoff';
import { syncAg21Wave21ProjectionBaseline } from './forecast-wave21-projection-sync';
import { handoffAg21IntegrationWave21OriginGate } from './forecast-integration-wave21-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound21Console: React.FC<{ seed?: number }> = ({ seed = 121 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 36 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.46), actorDebt: base.actorDebt + 570 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave20OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave21ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave21OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round21-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 21 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round21-prior">
        Wave 20 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round21-projection">
        Wave 21 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round21-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
