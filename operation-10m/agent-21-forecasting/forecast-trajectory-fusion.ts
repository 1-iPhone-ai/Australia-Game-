/**
 * Agent 21 — trajectory fusion (scenario + ensemble alignment, read-only).
 */

import { buildAg21EnsembleProjection } from './forecast-ensemble-projection';
import { measureAg21CalibrationDrift } from './forecast-calibration-drift';
import { lookupAg21Scenario } from './scenario-catalog';
import { ag21LabelUncertainty, type Ag21UncertaintyBand } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export interface Ag21TrajectoryFusionPoint {
  scenarioId: string;
  domain: string;
  alignmentScore: number;
  driftSeverity: ReturnType<typeof measureAg21CalibrationDrift>['severity'];
  uncertainty: Ag21UncertaintyBand;
}

export interface Ag21TrajectoryFusionReport {
  points: Ag21TrajectoryFusionPoint[];
  fusionScore: number;
  headline: string;
  overallUncertainty: ReturnType<typeof ag21LabelUncertainty>;
  authoritative: false;
}

function ag21ScenarioContext(base: Ag21ForecastContext, scenarioId: string): Ag21ForecastContext {
  const scenario = lookupAg21Scenario(scenarioId);
  const domainBoost =
    scenario?.domain === 'fiscal' ? -80 :
    scenario?.domain === 'workforce' ? 40 :
    scenario?.domain === 'resilience' ? -120 :
    0;
  return {
    ...base,
    actorCash: Math.max(0, base.actorCash + domainBoost),
    actorDebt: Math.max(0, base.actorDebt + (scenario?.defaultUncertainty === 'high' ? 60 : 20))
  };
}

export function fuseAg21ScenarioTrajectories(
  baseCtx: Ag21ForecastContext,
  scenarioIds: string[]
): Ag21TrajectoryFusionReport {
  const ensemble = buildAg21EnsembleProjection(baseCtx);
  const p50 = ensemble.bands.find(b => b.label === 'p50') ?? ensemble.bands[1];

  const points: Ag21TrajectoryFusionPoint[] = scenarioIds.map(id => {
    const scenario = lookupAg21Scenario(id);
    const candidate = ag21ScenarioContext(baseCtx, id);
    const drift = measureAg21CalibrationDrift(baseCtx, candidate);
    const cashGap = Math.abs((p50?.projectedCash ?? baseCtx.actorCash) - candidate.actorCash);
    const alignmentScore = Math.max(0, 1 - cashGap / Math.max(1, baseCtx.actorCash));
    const uncertainty: Ag21UncertaintyBand =
      drift.severity === 'critical' ? 'high' :
      drift.severity === 'elevated' ? 'moderate' :
      scenario?.defaultUncertainty ?? 'moderate';

    return {
      scenarioId: id,
      domain: scenario?.domain ?? 'unknown',
      alignmentScore,
      driftSeverity: drift.severity,
      uncertainty
    };
  });

  const fusionScore = points.reduce((sum, p) => sum + p.alignmentScore, 0) / Math.max(1, points.length);
  const overallBand: Ag21UncertaintyBand = fusionScore < 0.45 ? 'high' : fusionScore < 0.7 ? 'moderate' : 'low';

  return {
    points,
    fusionScore,
    headline: `Fusion score ${(fusionScore * 100).toFixed(0)}% across ${points.length} scenario trajectories.`,
    overallUncertainty: ag21LabelUncertainty(overallBand, [`ensemble_dispersion=${ensemble.dispersion.toFixed(2)}`]),
    authoritative: false
  };
}

export function runAg21TrajectoryFusionSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 6, seed: 21, actorCash: 950, actorDebt: 80, regionsControlled: 2 };
  const fusion = fuseAg21ScenarioTrajectories(ctx, ['ag21_sc_002', 'ag21_sc_006', 'ag21_sc_012']);
  push('fusion_points', fusion.points.length === 3, String(fusion.points.length));
  push('fusion_score_range', fusion.fusionScore >= 0 && fusion.fusionScore <= 1, String(fusion.fusionScore));
  push('fusion_non_auth', fusion.authoritative === false, fusion.headline);

  return out;
}
