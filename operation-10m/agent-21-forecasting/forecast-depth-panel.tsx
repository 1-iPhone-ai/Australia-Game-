/**
 * Agent 21 — forecast lab depth panel (multi-horizon + batch scenario review).
 */

import React, { useMemo, useState } from 'react';
import {
  buildAg21MultiHorizonProjection,
  runAg21CounterfactualStressLadder,
  runAg21ScenarioBatchComparison,
  summarizeAg21ForecastBundleDepth
} from './forecast-lab-depth';
import { createDefaultAg21ForecastContext } from './strategic-forecast-policy-lab';
import { ag21LabelUncertainty } from './isolation-core';
import type { Ag21ForecastBundle } from './strategic-forecast-policy-lab';

export const Ag21ForecastDepthPanel: React.FC<{ seed?: number; compact?: boolean }> = ({ seed = 17, compact }) => {
  const [batchSeed, setBatchSeed] = useState(seed);
  const ctx = useMemo(() => createDefaultAg21ForecastContext({ seed: batchSeed, turn: 8 }), [batchSeed]);

  const projection = useMemo(() => buildAg21MultiHorizonProjection(ctx), [ctx]);
  const batch = useMemo(
    () => runAg21ScenarioBatchComparison(['ag21_sc_000', 'ag21_sc_006', 'ag21_sc_012', 'ag21_sc_018']),
    []
  );
  const depth = useMemo(() => {
    const pseudoBundle: Ag21ForecastBundle = {
      generatedAtTurn: ctx.turn,
      authoritativeMutationDetected: false,
      overallUncertainty: projection.overallUncertainty,
      experiments: batch.pairwise.map((pair, idx) => ({
        id: `ag21_depth_pair_${idx}`,
        label: pair.summary,
        domain: pair.sameDomain ? 'balance' : 'cross_domain',
        horizons: [
          {
            turns: 4 + idx,
            uncertainty: pair.uncertaintyDelta >= 2 ? 'high' : 'moderate',
            summary: pair.summary,
            metrics: { similarity: pair.titleSimilarity }
          }
        ],
        uncertainty: ag21LabelUncertainty(pair.uncertaintyDelta >= 2 ? 'high' : 'moderate'),
        provenance: {
          authoritative: false,
          label: 'projection',
          sourceSystems: ['Agent21 Forecast Depth Panel'],
          isolatedCopyVerified: true,
          fingerprintBefore: 'depth',
          fingerprintAfter: 'depth',
          disclaimer: 'non-authoritative'
        },
        notes: []
      }))
    };
    return summarizeAg21ForecastBundleDepth(pseudoBundle);
  }, [batch, ctx.turn, projection.overallUncertainty]);
  const stress = useMemo(() => runAg21CounterfactualStressLadder(ctx), [ctx]);

  return (
    <div
      className="border border-emerald-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2"
      data-testid="ag21-forecast-depth-panel"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-bold text-emerald-200">
          🧪 Forecast Lab Depth <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
        </div>
        {!compact && (
          <label className="flex items-center gap-1">
            Seed
            <input
              type="number"
              className="w-16 bg-slate-900 border border-slate-600 rounded px-1"
              value={batchSeed}
              onChange={e => setBatchSeed(Number(e.target.value) || 1)}
            />
          </label>
        )}
      </div>
      <div className="text-[10px] text-amber-200/90" data-testid="ag21-depth-headline">
        {batch.headline} · stress branches={stress.ladder.branches.length}
      </div>
      <div className="grid grid-cols-2 gap-2" data-testid="ag21-depth-metrics">
        <div className="rounded bg-slate-900/60 p-2 border border-slate-700/50">
          <div className="font-semibold text-emerald-100">Bundle depth</div>
          <div>Score {(depth.experimentScore * 100).toFixed(0)}% · domains {depth.domainCount}</div>
          <div>Worst uncertainty: {depth.worstUncertainty}</div>
        </div>
        <div className="rounded bg-slate-900/60 p-2 border border-slate-700/50">
          <div className="font-semibold text-emerald-100">Horizon ladder</div>
          {(compact ? projection.steps.slice(0, 2) : projection.steps).map(step => (
            <div key={step.turns}>
              {step.turns}t · cash {step.projectedCash} · {step.uncertainty}
            </div>
          ))}
        </div>
      </div>
      <div className="text-[10px] opacity-80">{projection.overallUncertainty.playerFacing}</div>
    </div>
  );
};
