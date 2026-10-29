/**
 * Agent 21 — reliability gates (ensemble + drift + fusion composite, read-only).
 */

import { measureAg21CalibrationDrift } from './forecast-calibration-drift';
import { buildAg21EnsembleProjection } from './forecast-ensemble-projection';
import { fuseAg21ScenarioTrajectories } from './forecast-trajectory-fusion';
import { ag21LabelUncertainty, type Ag21UncertaintyBand, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export interface Ag21ReliabilityGate {
  id: 'ensemble_dispersion' | 'calibration_drift' | 'trajectory_fusion';
  passed: boolean;
  score: number;
  detail: string;
}

export interface Ag21ReliabilityGateReport {
  gates: Ag21ReliabilityGate[];
  passCount: number;
  overallPass: boolean;
  playerGuidance: 'proceed_with_caution' | 'hold_for_review' | 'do_not_surface';
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21GuidanceFromGates(passCount: number, gates: Ag21ReliabilityGate[]): Ag21ReliabilityGateReport['playerGuidance'] {
  if (passCount >= 3) return 'proceed_with_caution';
  if (passCount >= 1) return 'hold_for_review';
  return 'do_not_surface';
}

function ag21BandFromPass(passCount: number): Ag21UncertaintyBand {
  if (passCount >= 3) return 'low';
  if (passCount >= 2) return 'moderate';
  return 'high';
}

/** Evaluate whether lab signals are reliable enough for player-facing surfacing (non-authoritative). */
export function evaluateAg21ReliabilityGates(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21ReliabilityGateReport {
  const ensemble = buildAg21EnsembleProjection(baseCtx);
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.82),
      actorDebt: baseCtx.actorDebt + 150
    } satisfies Ag21ForecastContext);

  const drift = measureAg21CalibrationDrift(baseCtx, candidate);
  const fusion = fuseAg21ScenarioTrajectories(baseCtx, ['ag21_sc_004', 'ag21_sc_011', 'ag21_sc_018', 'ag21_sc_022']);

  const gates: Ag21ReliabilityGate[] = [
    {
      id: 'ensemble_dispersion',
      passed: ensemble.dispersion <= 0.62,
      score: Math.max(0, 1 - ensemble.dispersion),
      detail: `dispersion=${ensemble.dispersion.toFixed(2)}`
    },
    {
      id: 'calibration_drift',
      passed: drift.severity === 'stable' || drift.severity === 'watch',
      score: Math.max(0, 1 - drift.driftScore),
      detail: `severity=${drift.severity}`
    },
    {
      id: 'trajectory_fusion',
      passed: fusion.fusionScore >= 0.42,
      score: fusion.fusionScore,
      detail: `fusion=${fusion.fusionScore.toFixed(2)}`
    }
  ];

  const passCount = gates.filter(g => g.passed).length;
  const overallPass = passCount === gates.length;

  return {
    gates,
    passCount,
    overallPass,
    playerGuidance: ag21GuidanceFromGates(passCount, gates),
    overallUncertainty: ag21LabelUncertainty(ag21BandFromPass(passCount), [`pass=${passCount}/${gates.length}`]),
    authoritative: false
  };
}

export function runAg21ReliabilityGatesSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 9, seed: 18, actorCash: 1000, actorDebt: 70, regionsControlled: 3 };
  const report = evaluateAg21ReliabilityGates(ctx);

  push('gates_count', report.gates.length === 3, String(report.gates.length));
  push('gates_pass_range', report.passCount >= 0 && report.passCount <= 3, String(report.passCount));
  push('gates_non_auth', report.authoritative === false, String(report.overallPass));
  push('gates_guidance', ['proceed_with_caution', 'hold_for_review', 'do_not_surface'].includes(report.playerGuidance), report.playerGuidance);

  return out;
}
