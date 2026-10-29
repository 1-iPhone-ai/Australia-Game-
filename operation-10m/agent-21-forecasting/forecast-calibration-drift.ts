/**
 * Agent 21 — calibration drift diagnostics (compare isolated forecast contexts).
 */

import { ag21FingerprintSnapshot, ag21LabelUncertainty, type Ag21UncertaintyBand, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export interface Ag21CalibrationDriftReport {
  baselineFingerprint: string;
  candidateFingerprint: string;
  cashDriftPct: number;
  debtDriftPct: number;
  regionDrift: number;
  driftScore: number;
  severity: 'stable' | 'watch' | 'elevated' | 'critical';
  uncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21PctDelta(baseline: number, candidate: number): number {
  return Math.abs(candidate - baseline) / Math.max(1, Math.abs(baseline));
}

function ag21Severity(score: number): Ag21CalibrationDriftReport['severity'] {
  if (score >= 0.65) return 'critical';
  if (score >= 0.4) return 'elevated';
  if (score >= 0.18) return 'watch';
  return 'stable';
}

function ag21BandFromSeverity(severity: Ag21CalibrationDriftReport['severity']): Ag21UncertaintyBand {
  if (severity === 'critical') return 'high';
  if (severity === 'elevated') return 'moderate';
  if (severity === 'watch') return 'moderate';
  return 'low';
}

/** Read-only drift check between two lab contexts (does not mutate either input). */
export function measureAg21CalibrationDrift(
  baseline: Ag21ForecastContext,
  candidate: Ag21ForecastContext
): Ag21CalibrationDriftReport {
  const baselineFingerprint = ag21FingerprintSnapshot(baseline);
  const candidateFingerprint = ag21FingerprintSnapshot(candidate);
  const cashDriftPct = ag21PctDelta(baseline.actorCash, candidate.actorCash);
  const debtDriftPct = ag21PctDelta(baseline.actorDebt, candidate.actorDebt);
  const regionDrift = Math.abs(baseline.regionsControlled - candidate.regionsControlled);
  const driftScore = Math.min(1, cashDriftPct * 0.45 + debtDriftPct * 0.35 + regionDrift * 0.12);
  const severity = ag21Severity(driftScore);

  return {
    baselineFingerprint,
    candidateFingerprint,
    cashDriftPct,
    debtDriftPct,
    regionDrift,
    driftScore,
    severity,
    uncertainty: ag21LabelUncertainty(ag21BandFromSeverity(severity), [`severity=${severity}`]),
    authoritative: false
  };
}

export function runAg21CalibrationDriftSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const base: Ag21ForecastContext = { turn: 4, seed: 10, actorCash: 1000, actorDebt: 100, regionsControlled: 2 };
  const near: Ag21ForecastContext = { ...base, actorCash: 980 };
  const far: Ag21ForecastContext = { ...base, actorCash: 400, actorDebt: 900, regionsControlled: 0 };

  const stable = measureAg21CalibrationDrift(base, near);
  const critical = measureAg21CalibrationDrift(base, far);
  push('drift_stable', stable.severity === 'stable' || stable.severity === 'watch', stable.severity);
  push('drift_critical', critical.severity === 'critical' || critical.severity === 'elevated', critical.severity);
  push('drift_non_auth', stable.authoritative === false && critical.authoritative === false, 'flags');

  return out;
}
