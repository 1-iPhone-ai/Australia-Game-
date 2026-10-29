/**
 * Agent 21 — scale wave round 32 console (wave-32 sync + origin handoff + wave-31 handoff).
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave31OriginGate } from './forecast-integration-wave31-origin-handoff';
import { syncAg21Wave32ProjectionBaseline } from './forecast-wave32-projection-sync';
import { handoffAg21IntegrationWave32OriginGate } from './forecast-integration-wave32-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound32Console: React.FC<{ seed?: number }> = ({ seed = 132 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 47 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.24), actorDebt: base.actorDebt + 900 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave31OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave32ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave32OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round32-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 32 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round32-prior">
        Wave 31 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round32-projection">
        Wave 32 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round32-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
