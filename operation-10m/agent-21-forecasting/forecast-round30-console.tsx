/**
 * Agent 21 — scale wave round 30 console (wave-30 sync + origin handoff + wave-29 handoff).
 */

import React, { useMemo } from 'react';
import { handoffAg21IntegrationWave29OriginGate } from './forecast-integration-wave29-origin-handoff';
import { syncAg21Wave30ProjectionBaseline } from './forecast-wave30-projection-sync';
import { handoffAg21IntegrationWave30OriginGate } from './forecast-integration-wave30-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound30Console: React.FC<{ seed?: number }> = ({ seed = 130 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 45 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.28), actorDebt: base.actorDebt + 840 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave29OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave30ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave30OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round30-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 30 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round30-prior">
        Wave 29 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round30-projection">
        Wave 30 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round30-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
