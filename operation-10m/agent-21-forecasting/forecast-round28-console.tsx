/**
 * Agent 21 — scale wave round 28 console (wave-28 sync + origin handoff + wave-27 handoff).
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave27OriginGate } from './forecast-integration-wave27-origin-handoff';
import { syncAg21Wave28ProjectionBaseline } from './forecast-wave28-projection-sync';
import { handoffAg21IntegrationWave28OriginGate } from './forecast-integration-wave28-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound28Console: React.FC<{ seed?: number }> = ({ seed = 128 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 43 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.32), actorDebt: base.actorDebt + 780 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave27OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave28ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave28OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round28-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 28 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round28-prior">
        Wave 27 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round28-projection">
        Wave 28 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round28-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
