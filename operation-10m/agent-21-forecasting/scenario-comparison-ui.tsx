/**
 * Agent 21 — scenario comparison UI fragment (non-authoritative lab review).
 */

import React, { useMemo, useState } from 'react';
import { compareAg21Scenarios, evaluateAg21ForecastRun } from './forecast-evaluation-metrics';
import { AG21_FORECAST_SCENARIO_CATALOG, lookupAg21Scenario } from './scenario-catalog';

const AG21_DEFAULT_PAIR: [string, string] = ['ag21_sc_000', 'ag21_sc_001'];

export interface Ag21ScenarioComparisonStripProps {
  leftScenarioId?: string;
  rightScenarioId?: string;
  compact?: boolean;
}

export const Ag21ScenarioComparisonStrip: React.FC<Ag21ScenarioComparisonStripProps> = ({
  leftScenarioId,
  rightScenarioId,
  compact
}) => {
  const [leftId, setLeftId] = useState(leftScenarioId ?? AG21_DEFAULT_PAIR[0]);
  const [rightId, setRightId] = useState(rightScenarioId ?? AG21_DEFAULT_PAIR[1]);

  const left = lookupAg21Scenario(leftId);
  const right = lookupAg21Scenario(rightId);

  const comparison = useMemo(() => {
    if (!left || !right) return null;
    return compareAg21Scenarios(left, right);
  }, [left, right]);

  const evaluation = useMemo(() => {
    const scenarios = [left, right].filter(Boolean) as NonNullable<typeof left>[];
    return evaluateAg21ForecastRun({
      scenarioIds: [leftId, rightId],
      scenarios,
      experimentCount: 4,
      overallUncertainty: scenarios[0]?.defaultUncertainty ?? 'moderate',
      authoritativeMutationDetected: false,
      isolatedCopyVerifiedRatio: 1
    });
  }, [left, right, leftId, rightId]);

  const options = useMemo(
    () => AG21_FORECAST_SCENARIO_CATALOG.slice(0, compact ? 24 : 40),
    [compact]
  );

  return (
    <div
      className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/80 text-xs space-y-2"
      data-testid="ag21-scenario-comparison"
    >
      <div className="font-bold text-violet-200">
        🔀 Scenario Comparison <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase opacity-70">Scenario A</span>
          <select
            className="bg-slate-900 border border-slate-600 rounded px-1 py-0.5"
            value={leftId}
            onChange={e => setLeftId(e.target.value)}
            data-testid="ag21-scenario-left"
          >
            {options.map(s => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase opacity-70">Scenario B</span>
          <select
            className="bg-slate-900 border border-slate-600 rounded px-1 py-0.5"
            value={rightId}
            onChange={e => setRightId(e.target.value)}
            data-testid="ag21-scenario-right"
          >
            {options.map(s => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      {comparison && left && right ? (
        <div className="rounded border border-slate-700/60 bg-slate-900/50 p-2 space-y-1">
          <div className="font-semibold text-violet-100" data-testid="ag21-comparison-recommendation">
            {comparison.recommendation.toUpperCase()} · {comparison.summary}
          </div>
          <div className="opacity-80">{left.narrative.slice(0, compact ? 90 : 140)}</div>
          <div className="opacity-80">{right.narrative.slice(0, compact ? 90 : 140)}</div>
        </div>
      ) : (
        <div className="text-amber-200/90">Select valid scenarios to compare.</div>
      )}
      <div className="flex flex-wrap gap-2 text-[10px]" data-testid="ag21-evaluation-metrics">
        <span className="px-2 py-0.5 rounded bg-slate-800">Grade {evaluation.grade}</span>
        <span className="px-2 py-0.5 rounded bg-slate-800">Composite {(evaluation.compositeScore * 100).toFixed(0)}%</span>
        <span className="px-2 py-0.5 rounded bg-slate-800">Coverage {(evaluation.coverageScore * 100).toFixed(0)}%</span>
        <span className="px-2 py-0.5 rounded bg-slate-800">Isolation {(evaluation.isolationIntegrityScore * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
};
