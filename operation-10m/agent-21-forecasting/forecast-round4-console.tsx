/**
 * Agent 21 — scale wave round 4 console (backtest residuals + regret + reliability gates).
 */

import React, { useMemo } from 'react';
import { evaluateAg21ReliabilityGates } from './forecast-reliability-gates';
import { rankAg21PolicyRegret } from './forecast-policy-regret';
import { runAg21EnsembleResidualBacktest } from './forecast-residual-backtest';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound4Console: React.FC<{ seed?: number }> = ({ seed = 37 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 14 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.75), actorDebt: base.actorDebt + 180 }),
    [base]
  );

  const backtest = useMemo(() => runAg21EnsembleResidualBacktest(base), [base]);
  const regret = useMemo(() => rankAg21PolicyRegret(base), [base]);
  const gates = useMemo(() => evaluateAg21ReliabilityGates(base, stressed), [base, stressed]);

  return (
    <div className="border border-amber-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round4-console">
      <div className="font-bold text-amber-200">
        🔬 Forecast Lab Round 4 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round4-backtest">
        Backtest · tone {backtest.calibrationTone} · mean residual {(backtest.meanAbsoluteResidualPct * 100).toFixed(0)}%
      </div>
      <div data-testid="ag21-round4-regret">
        Regret · lowest {regret.lowestRegretBranchId ?? 'none'} · branches {regret.rows.length}
      </div>
      <div data-testid="ag21-round4-gates">
        Gates · {gates.passCount}/3 · guidance {gates.playerGuidance}
      </div>
    </div>
  );
};
