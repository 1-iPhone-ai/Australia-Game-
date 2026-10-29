/**
 * Agent 21 — scale wave round 33 console (wave-33 sync + origin handoff + wave-32 handoff).
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave32OriginGate } from './forecast-integration-wave32-origin-handoff';
import { syncAg21Wave33ProjectionBaseline } from './forecast-wave33-projection-sync';
import { handoffAg21IntegrationWave33OriginGate } from './forecast-integration-wave33-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound33Console: React.FC<{ seed?: number }> = ({ seed = 133 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 48 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.22), actorDebt: base.actorDebt + 930 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave32OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave33ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave33OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round33-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 33 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round33-prior">
        Wave 32 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round33-projection">
        Wave 33 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round33-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
