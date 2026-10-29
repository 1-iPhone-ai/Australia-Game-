/**
 * Agent 21 — scale wave round 5 console (volatility + attribution + surfacing scorecard).
 */

import React, { useMemo } from 'react';
import { buildAg21LeverAttributionReport } from './forecast-lever-attribution';
import { measureAg21HorizonVolatility } from './forecast-horizon-volatility';
import { buildAg21SurfacingScorecard } from './forecast-surfacing-scorecard';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound5Console: React.FC<{ seed?: number }> = ({ seed = 41 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 15 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.78), actorDebt: base.actorDebt + 200 }),
    [base]
  );

  const volatility = useMemo(() => measureAg21HorizonVolatility(base), [base]);
  const attribution = useMemo(() => buildAg21LeverAttributionReport(base), [base]);
  const scorecard = useMemo(() => buildAg21SurfacingScorecard(base, stressed), [base, stressed]);

  return (
    <div className="border border-emerald-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round5-console">
      <div className="font-bold text-emerald-200">
        🔬 Forecast Lab Round 5 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round5-volatility">
        Volatility · {volatility.stabilityTone} · index {volatility.compositeVolatility.toFixed(2)}
      </div>
      <div data-testid="ag21-round5-attribution">
        Attribution · top {attribution.topLever ?? 'none'} · concentration {attribution.concentrationIndex.toFixed(2)}
      </div>
      <div data-testid="ag21-round5-scorecard">
        Scorecard · {scorecard.readinessScore}/100 · tier {scorecard.tier} · {scorecard.playerGuidance}
      </div>
    </div>
  );
};
