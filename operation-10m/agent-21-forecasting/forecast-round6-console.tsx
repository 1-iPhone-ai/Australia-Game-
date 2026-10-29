/**
 * Agent 21 — scale wave round 6 console (convergence + brief + playbook).
 */

import React, { useMemo } from 'react';
import { measureAg21EnsembleConvergence } from './forecast-ensemble-convergence';
import { assembleAg21PlayerForecastBrief } from './forecast-player-brief';
import { buildAg21LabPlaybook } from './forecast-lab-playbook';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound6Console: React.FC<{ seed?: number }> = ({ seed = 43 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 16 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.76), actorDebt: base.actorDebt + 210 }),
    [base]
  );

  const convergence = useMemo(() => measureAg21EnsembleConvergence(base), [base]);
  const brief = useMemo(() => assembleAg21PlayerForecastBrief(base, stressed), [base, stressed]);
  const playbook = useMemo(() => buildAg21LabPlaybook(base, stressed), [base, stressed]);

  return (
    <div className="border border-sky-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round6-console">
      <div className="font-bold text-sky-200">
        🔬 Forecast Lab Round 6 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round6-convergence">
        Convergence · {convergence.convergenceTone} · gap {convergence.convergenceGap.toFixed(2)}
      </div>
      <div data-testid="ag21-round6-brief">
        Brief · {brief.readinessScore}/100 · tier {brief.surfacingTier}
      </div>
      <div data-testid="ag21-round6-playbook">
        Playbook · mode {playbook.operatorMode} · hints {playbook.hints.length}
      </div>
    </div>
  );
};
