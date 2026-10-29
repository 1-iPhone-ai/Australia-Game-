/**
 * Agent 21 — scale wave round 3 console (ensemble + drift + trajectory fusion).
 */

import React, { useMemo } from 'react';
import { measureAg21CalibrationDrift } from './forecast-calibration-drift';
import { buildAg21EnsembleProjection } from './forecast-ensemble-projection';
import { fuseAg21ScenarioTrajectories } from './forecast-trajectory-fusion';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';

export const Ag21ForecastRound3Console: React.FC<{ seed?: number }> = ({ seed = 29 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 12 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.7), actorDebt: base.actorDebt + 200 }),
    [base]
  );

  const ensemble = useMemo(() => buildAg21EnsembleProjection(base), [base]);
  const drift = useMemo(() => measureAg21CalibrationDrift(base, stressed), [base, stressed]);
  const fusion = useMemo(
    () => fuseAg21ScenarioTrajectories(base, ['ag21_sc_003', 'ag21_sc_015', 'ag21_sc_027', 'ag21_sc_039']),
    [base]
  );

  return (
    <div className="border border-rose-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round3-console">
      <div className="font-bold text-rose-200">
        🛰️ Forecast Lab Round 3 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round3-ensemble">
        Ensemble · dispersion {(ensemble.dispersion * 100).toFixed(0)}% · p50 cash{' '}
        {ensemble.bands.find(b => b.label === 'p50')?.projectedCash ?? 0}
      </div>
      <div data-testid="ag21-round3-drift">
        Drift · severity {drift.severity} · score {(drift.driftScore * 100).toFixed(0)}%
      </div>
      <div data-testid="ag21-round3-fusion">{fusion.headline}</div>
    </div>
  );
};
