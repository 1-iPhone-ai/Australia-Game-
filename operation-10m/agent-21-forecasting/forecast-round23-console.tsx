/**
 * Agent 21 — scale wave round 23 console (wave-23 sync + origin handoff + wave-22 handoff).
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave22OriginGate } from './forecast-integration-wave22-origin-handoff';
import { syncAg21Wave23ProjectionBaseline } from './forecast-wave23-projection-sync';
import { handoffAg21IntegrationWave23OriginGate } from './forecast-integration-wave23-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound23Console: React.FC<{ seed?: number }> = ({ seed = 123 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 38 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.42), actorDebt: base.actorDebt + 630 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave22OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave23ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave23OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round23-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 23 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round23-prior">
        Wave 22 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round23-projection">
        Wave 23 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round23-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
