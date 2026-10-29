/**
 * Agent 21 — scale wave round 34 console.
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave33OriginGate } from './forecast-integration-wave33-origin-handoff';
import { syncAg21Wave34ProjectionBaseline } from './forecast-wave34-projection-sync';
import { handoffAg21IntegrationWave34OriginGate } from './forecast-integration-wave34-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound34Console: React.FC<{ seed?: number }> = ({ seed = 134 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 49 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.2), actorDebt: base.actorDebt + 960 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave33OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave34ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave34OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round34-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 34 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round34-prior">
        Wave 33 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round34-projection">
        Wave 34 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round34-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
