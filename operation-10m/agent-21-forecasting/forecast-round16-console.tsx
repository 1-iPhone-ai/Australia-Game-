/**
 * Agent 21 — scale wave round 16 console (dry-run readiness + projection sync + integration attestation).
 */

import React, { useMemo } from 'react';
import { evaluateAg21FullChunksDryRunReadiness } from './forecast-full-chunks-dry-run-readiness';
import { syncAg21Wave16ProjectionBaseline } from './forecast-wave16-projection-sync';
import { attestAg21IntegrationDryRunReadiness } from './forecast-integration-dry-run-attestation';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound16Console: React.FC<{ seed?: number }> = ({ seed = 101 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 30 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.55), actorDebt: base.actorDebt + 430 }),
    [base]
  );

  const readiness = useMemo(() => evaluateAg21FullChunksDryRunReadiness(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave16ProjectionBaseline(base, stressed), [base, stressed]);
  const attestation = useMemo(() => attestAg21IntegrationDryRunReadiness(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round16-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 16 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round16-readiness">
        Dry-run readiness · {readiness.status} · {readiness.operatorCopy.slice(0, 48)}…
      </div>
      <div data-testid="ag21-round16-projection">
        Wave 16 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round16-attestation">
        Integration · {attestation.status} · {attestation.attestationCopy.slice(0, 48)}…
      </div>
    </div>
  );
};
