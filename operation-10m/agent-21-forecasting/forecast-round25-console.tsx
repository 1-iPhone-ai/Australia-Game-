/**
 * Agent 21 — scale wave round 25 console (wave-25 sync + origin handoff + wave-24 handoff).
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave24OriginGate } from './forecast-integration-wave24-origin-handoff';
import { syncAg21Wave25ProjectionBaseline } from './forecast-wave25-projection-sync';
import { handoffAg21IntegrationWave25OriginGate } from './forecast-integration-wave25-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound25Console: React.FC<{ seed?: number }> = ({ seed = 125 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 40 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.38), actorDebt: base.actorDebt + 690 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave24OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave25ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave25OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round25-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 25 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round25-prior">
        Wave 24 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round25-projection">
        Wave 25 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round25-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
