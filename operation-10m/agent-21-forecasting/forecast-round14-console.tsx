/**
 * Agent 21 — scale wave round 14 console (compliance + rollup + governance).
 */

import React, { useMemo } from 'react';
import { assessAg21RetentionCompliance } from './forecast-retention-compliance';
import { rollupAg21ArchiveAuditSummary } from './forecast-archive-audit-rollup';
import { runAg21LabGovernanceCheckpoint } from './forecast-lab-governance-checkpoint';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound14Console: React.FC<{ seed?: number }> = ({ seed = 96 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 27 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.58), actorDebt: base.actorDebt + 400 }),
    [base]
  );

  const compliance = useMemo(() => assessAg21RetentionCompliance(base, stressed), [base, stressed]);
  const rollup = useMemo(() => rollupAg21ArchiveAuditSummary(base, stressed), [base, stressed]);
  const governance = useMemo(() => runAg21LabGovernanceCheckpoint(base, stressed), [base, stressed]);

  return (
    <div className="border border-rose-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round14-console">
      <div className="font-bold text-rose-200">
        🔬 Forecast Lab Round 14 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round14-compliance">
        Compliance · {compliance.status} · {compliance.disposition}
      </div>
      <div data-testid="ag21-round14-rollup">
        Rollup · {rollup.sealStatus} · {rollup.complianceStatus}
      </div>
      <div data-testid="ag21-round14-governance">
        Governance · {governance.verdict} · actions {governance.actionItems.length}
      </div>
    </div>
  );
};
