/**
 * Agent 21 — scale wave round 11 console (verification + export clearance + closeout).
 */

import React, { useMemo } from 'react';
import { verifyAg21StagingIntegrity } from './forecast-staging-verification';
import { buildAg21ExportClearance } from './forecast-export-clearance';
import { summarizeAg21LabCycleCloseout } from './forecast-lab-cycle-closeout';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound11Console: React.FC<{ seed?: number }> = ({ seed = 81 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 23 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.65), actorDebt: base.actorDebt + 340 }),
    [base]
  );

  const verification = useMemo(() => verifyAg21StagingIntegrity(base, stressed), [base, stressed]);
  const clearance = useMemo(() => buildAg21ExportClearance(base, stressed), [base, stressed]);
  const closeout = useMemo(() => summarizeAg21LabCycleCloseout(base, stressed), [base, stressed]);

  return (
    <div className="border border-teal-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round11-console">
      <div className="font-bold text-teal-200">
        🔬 Forecast Lab Round 11 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round11-verification">
        Verify · {verification.status} · findings {verification.findings.length}
      </div>
      <div data-testid="ag21-round11-clearance">
        Export · {clearance.level} · {clearance.replaySeedId.slice(0, 24)}…
      </div>
      <div data-testid="ag21-round11-closeout">
        Closeout · {closeout.exportLevel} · {closeout.closeoutId.slice(0, 28)}…
      </div>
    </div>
  );
};
