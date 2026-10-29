/**
 * Agent 21 — scale wave round 9 console (coherence + runbook + integration handoff).
 */

import React, { useMemo } from 'react';
import { assessAg21ReplayCoherence } from './forecast-replay-coherence';
import { buildAg21EscalationRunbook } from './forecast-escalation-runbook';
import { buildAg21LabIntegrationHandoff } from './forecast-lab-integration-handoff';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound9Console: React.FC<{ seed?: number }> = ({ seed = 63 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 20 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.7), actorDebt: base.actorDebt + 280 }),
    [base]
  );

  const coherence = useMemo(() => assessAg21ReplayCoherence(base, stressed), [base, stressed]);
  const runbook = useMemo(() => buildAg21EscalationRunbook(base, stressed), [base, stressed]);
  const handoff = useMemo(() => buildAg21LabIntegrationHandoff(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round9-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 9 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round9-coherence">
        Coherence · {coherence.status} · drift {coherence.driftSignals.length}
      </div>
      <div data-testid="ag21-round9-runbook">
        Runbook · {runbook.tier} · {runbook.stepCount} steps
      </div>
      <div data-testid="ag21-round9-handoff">
        Handoff · {handoff.handoffId.slice(0, 32)}… · tags {handoff.integrationTags.length}
      </div>
    </div>
  );
};
