/**
 * Agent 21 — scale wave round 10 console (readiness + signoff + staging packet).
 */

import React, { useMemo } from 'react';
import { evaluateAg21HandoffReadiness } from './forecast-handoff-readiness';
import { buildAg21OperatorSignoffRecord } from './forecast-operator-signoff';
import { buildAg21LabStagingPacket } from './forecast-lab-staging-packet';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound10Console: React.FC<{ seed?: number }> = ({ seed = 74 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 21 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.68), actorDebt: base.actorDebt + 310 }),
    [base]
  );

  const readiness = useMemo(() => evaluateAg21HandoffReadiness(base, stressed), [base, stressed]);
  const signoff = useMemo(() => buildAg21OperatorSignoffRecord(base, stressed), [base, stressed]);
  const staging = useMemo(() => buildAg21LabStagingPacket(base, stressed), [base, stressed]);

  return (
    <div className="border border-sky-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round10-console">
      <div className="font-bold text-sky-200">
        🔬 Forecast Lab Round 10 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round10-readiness">
        Readiness · {readiness.status} · blockers {readiness.blockers.length}
      </div>
      <div data-testid="ag21-round10-signoff">
        Signoff · {signoff.satisfiedCount}/{signoff.items.length} · stage {signoff.mayStage ? 'yes' : 'no'}
      </div>
      <div data-testid="ag21-round10-staging">
        Staging · {staging.phase} · {staging.packetId.slice(0, 30)}…
      </div>
    </div>
  );
};
