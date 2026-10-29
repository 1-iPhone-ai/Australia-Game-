/**
 * Agent 21 — scale wave round 17 console (dry-run execution + wave-17 sync + integration closure).
 */

import React, { useMemo } from 'react';
import { recordAg21FullChunksDryRunExecution } from './forecast-full-chunks-dry-run-execution';
import { syncAg21Wave17ProjectionBaseline } from './forecast-wave17-projection-sync';
import { closeAg21IntegrationDryRunCycle } from './forecast-integration-dry-run-closure';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound17Console: React.FC<{ seed?: number }> = ({ seed = 103 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 32 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.54), actorDebt: base.actorDebt + 450 }),
    [base]
  );

  const execution = useMemo(() => recordAg21FullChunksDryRunExecution(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave17ProjectionBaseline(base, stressed), [base, stressed]);
  const closure = useMemo(() => closeAg21IntegrationDryRunCycle(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round17-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 17 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round17-execution">
        Dry-run execution · {execution.status} · {execution.operatorCopy.slice(0, 48)}…
      </div>
      <div data-testid="ag21-round17-projection">
        Wave 17 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round17-closure">
        Integration · {closure.status} · {closure.closureCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
