/**
 * Agent 21 — lab telemetry rollup for operator dashboards (read-only round 7).
 */

import { measureAg21EnsembleConvergence } from './forecast-ensemble-convergence';
import { evaluateAg21ReliabilityGates } from './forecast-reliability-gates';
import { buildAg21LabPlaybook } from './forecast-lab-playbook';
import { resolveAg21SurfaceDecision } from './forecast-surface-decision';
import { ag21LabelUncertainty, type Ag21UncertaintyBand, type Ag21UncertaintyLabel } from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

export interface Ag21LabTelemetrySnapshot {
  convergenceGap: number;
  convergenceTone: ReturnType<typeof measureAg21EnsembleConvergence>['convergenceTone'];
  gatePassRatio: number;
  hintCount: number;
  surfaceDecision: ReturnType<typeof resolveAg21SurfaceDecision>['decision'];
  readinessScore: number;
  telemetryHealth: 'healthy' | 'degraded' | 'critical';
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21HealthFromSignals(
  gatePassRatio: number,
  convergenceTone: Ag21LabTelemetrySnapshot['convergenceTone'],
  decision: Ag21LabTelemetrySnapshot['surfaceDecision']
): Ag21LabTelemetrySnapshot['telemetryHealth'] {
  if (decision === 'suppress' || gatePassRatio < 0.25 || convergenceTone === 'divergent') return 'critical';
  if (decision === 'hold' || gatePassRatio < 0.55 || convergenceTone === 'drifting') return 'degraded';
  return 'healthy';
}

function ag21BandFromHealth(health: Ag21LabTelemetrySnapshot['telemetryHealth']): Ag21UncertaintyBand {
  if (health === 'healthy') return 'low';
  if (health === 'degraded') return 'moderate';
  return 'high';
}

/** Collect a single telemetry snapshot from round 4–7 lab modules. */
export function collectAg21LabTelemetry(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabTelemetrySnapshot {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.79),
      actorDebt: baseCtx.actorDebt + 150
    } satisfies Ag21ForecastContext);

  const convergence = measureAg21EnsembleConvergence(baseCtx);
  const gates = evaluateAg21ReliabilityGates(baseCtx, candidate);
  const playbook = buildAg21LabPlaybook(baseCtx, candidate);
  const decision = resolveAg21SurfaceDecision(baseCtx, candidate);

  const gatePassRatio = gates.passCount / Math.max(1, gates.gates.length);
  const telemetryHealth = ag21HealthFromSignals(gatePassRatio, convergence.convergenceTone, decision.decision);

  return {
    convergenceGap: convergence.convergenceGap,
    convergenceTone: convergence.convergenceTone,
    gatePassRatio,
    hintCount: playbook.hints.length,
    surfaceDecision: decision.decision,
    readinessScore: decision.readinessScore,
    telemetryHealth,
    overallUncertainty: ag21LabelUncertainty(ag21BandFromHealth(telemetryHealth), [
      `health=${telemetryHealth}`,
      `gap=${convergence.convergenceGap.toFixed(2)}`
    ]),
    authoritative: false
  };
}

export function runAg21LabTelemetrySelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 10, seed: 61, actorCash: 850, actorDebt: 130, regionsControlled: 2 };
  const snap = collectAg21LabTelemetry(ctx);

  push('telemetry_gap', snap.convergenceGap >= 0, String(snap.convergenceGap));
  push('telemetry_health', ['healthy', 'degraded', 'critical'].includes(snap.telemetryHealth), snap.telemetryHealth);
  push('telemetry_hints', snap.hintCount >= 1, String(snap.hintCount));
  push('telemetry_non_auth', snap.authoritative === false, snap.surfaceDecision);

  return out;
}
