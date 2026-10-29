/**
 * Agent 21 — scale wave round 8 console (validation + escalation + replay seed).
 */

import React, { useMemo } from 'react';
import { validateAg21CrosslinkHandoff } from './forecast-packet-validation';
import { resolveAg21OperatorEscalation } from './forecast-operator-escalation';
import { buildAg21LabReplaySeed } from './forecast-lab-replay-seed';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound8Console: React.FC<{ seed?: number }> = ({ seed = 51 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 18 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.72), actorDebt: base.actorDebt + 260 }),
    [base]
  );

  const validation = useMemo(() => validateAg21CrosslinkHandoff(base, stressed), [base, stressed]);
  const escalation = useMemo(() => resolveAg21OperatorEscalation(base, stressed), [base, stressed]);
  const replay = useMemo(() => buildAg21LabReplaySeed(base, stressed), [base, stressed]);

  return (
    <div className="border border-fuchsia-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round8-console">
      <div className="font-bold text-fuchsia-200">
        🔬 Forecast Lab Round 8 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round8-validation">
        Validation · {validation.status} · mismatches {validation.mismatchCount}
      </div>
      <div data-testid="ag21-round8-escalation">
        Escalation · {escalation.tier} · mode {escalation.operatorMode}
      </div>
      <div data-testid="ag21-round8-replay">
        Replay · {replay.seedId} · {replay.fingerprint.slice(0, 28)}…
      </div>
    </div>
  );
};
