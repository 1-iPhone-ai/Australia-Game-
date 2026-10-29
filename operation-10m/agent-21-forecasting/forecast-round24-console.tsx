/**
 * Agent 21 — scale wave round 24 console (wave-24 sync + origin handoff + wave-23 handoff).
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave23OriginGate } from './forecast-integration-wave23-origin-handoff';
import { syncAg21Wave24ProjectionBaseline } from './forecast-wave24-projection-sync';
import { handoffAg21IntegrationWave24OriginGate } from './forecast-integration-wave24-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound24Console: React.FC<{ seed?: number }> = ({ seed = 124 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 39 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.4), actorDebt: base.actorDebt + 660 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave23OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave24ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave24OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round24-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 24 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round24-prior">
        Wave 23 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round24-projection">
        Wave 24 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round24-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
