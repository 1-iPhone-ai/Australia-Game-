/**
 * Agent 21 — scale wave round 2 lab console (sensitivity + domain matrix + audit).
 */

import React, { useMemo } from 'react';
import { appendAg21ForecastAuditEntry, createAg21ForecastAuditLedger, summarizeAg21ForecastAuditLedger } from './forecast-audit-ledger';
import { buildAg21DomainStressMatrix } from './forecast-domain-matrix';
import { runAg21PolicySensitivitySweep } from './forecast-policy-sensitivity';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound2Console: React.FC<{ seed?: number }> = ({ seed = 23 }) => {
  const ctx = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 10 }), [seed]);
  const sensitivity = useMemo(() => runAg21PolicySensitivitySweep(ctx), [ctx]);
  const matrix = useMemo(() => buildAg21DomainStressMatrix(2), []);

  const audit = useMemo(() => {
    const ledger = createAg21ForecastAuditLedger(8);
    appendAg21ForecastAuditEntry(ledger, {
      atTurn: ctx.turn,
      kind: 'sensitivity',
      summary: `dominant=${sensitivity.dominantLever}`,
      payload: sensitivity.rows.slice(0, 2)
    });
    appendAg21ForecastAuditEntry(ledger, {
      atTurn: ctx.turn,
      kind: 'domain_matrix',
      summary: matrix.headline,
      payload: { hotspots: matrix.hotspots }
    });
    return summarizeAg21ForecastAuditLedger(ledger);
  }, [ctx.turn, matrix.headline, matrix.hotspots, sensitivity.dominantLever, sensitivity.rows]);

  return (
    <div className="border border-sky-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round2-console">
      <div className="font-bold text-sky-200">
        📊 Forecast Lab Round 2 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round2-sensitivity">
        Sensitivity · dominant lever {sensitivity.dominantLever} · rows {sensitivity.rows.length}
      </div>
      <div data-testid="ag21-round2-matrix">
        Domain matrix · score {(matrix.matrixScore * 100).toFixed(0)}% · grade {matrix.evaluationGrade}
      </div>
      <div data-testid="ag21-round2-audit">
        Audit · entries {audit.count} · latest {audit.latestSummary}
      </div>
    </div>
  );
};
