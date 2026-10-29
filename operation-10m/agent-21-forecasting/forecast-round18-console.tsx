/**
 * Agent 21 — scale wave round 18 console (wave-18 sync + origin handoff + dry-run execution).
 */

import React, { useMemo } from 'react';
import { recordAg21FullChunksDryRunExecution } from './forecast-full-chunks-dry-run-execution';
import { syncAg21Wave18ProjectionBaseline } from './forecast-wave18-projection-sync';
import { handoffAg21IntegrationWave18OriginGate } from './forecast-integration-wave18-origin-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound18Console: React.FC<{ seed?: number }> = ({ seed = 118 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 33 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.52), actorDebt: base.actorDebt + 480 }),
    [base]
  );

  const execution = useMemo(() => recordAg21FullChunksDryRunExecution(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave18ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave18OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round18-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 18 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round18-execution">
        Dry-run execution · {execution.status} · {execution.operatorCopy.slice(0, 48)}…
      </div>
      <div data-testid="ag21-round18-projection">
        Wave 18 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round18-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
