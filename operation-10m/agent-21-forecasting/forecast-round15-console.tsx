/**
 * Agent 21 — scale wave round 15 console (remediation + origin gate + continuity).
 */

import React, { useMemo } from 'react';
import { buildAg21GovernanceRemediationPlan } from './forecast-governance-remediation-plan';
import { attestAg21OriginGateReadiness } from './forecast-origin-gate-attestation';
import { resolveAg21LabContinuityVerdict } from './forecast-lab-continuity-verdict';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound15Console: React.FC<{ seed?: number }> = ({ seed = 97 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 28 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.57), actorDebt: base.actorDebt + 410 }),
    [base]
  );

  const remediation = useMemo(() => buildAg21GovernanceRemediationPlan(base, stressed), [base, stressed]);
  const origin = useMemo(() => attestAg21OriginGateReadiness(base, stressed), [base, stressed]);
  const continuity = useMemo(() => resolveAg21LabContinuityVerdict(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round15-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 15 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round15-remediation">
        Remediation · {remediation.status} · steps {remediation.stepCount}
      </div>
      <div data-testid="ag21-round15-origin">
        Origin gate · {origin.status} · {origin.originGateCopy}
      </div>
      <div data-testid="ag21-round15-continuity">
        Continuity · {continuity.verdict} · {continuity.summary}
      </div>
    </div>
  );
};
