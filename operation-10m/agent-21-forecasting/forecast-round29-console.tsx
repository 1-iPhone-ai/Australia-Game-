/**
 * Agent 21 — scale wave round 29 console (wave-29 sync + origin handoff + wave-28 handoff).
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave28OriginGate } from './forecast-integration-wave28-origin-handoff';
import { syncAg21Wave29ProjectionBaseline } from './forecast-wave29-projection-sync';
import { handoffAg21IntegrationWave29OriginGate } from './forecast-integration-wave29-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound29Console: React.FC<{ seed?: number }> = ({ seed = 129 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 44 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.3), actorDebt: base.actorDebt + 810 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave28OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave29ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave29OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round29-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 29 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round29-prior">
        Wave 28 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round29-projection">
        Wave 29 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round29-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
