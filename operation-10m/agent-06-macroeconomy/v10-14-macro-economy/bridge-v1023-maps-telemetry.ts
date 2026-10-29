import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroMapsTelemetrySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.23 maps telemetry spillover (Agent 23 domain; never mutates dashboard state). */
export function readMacroMapsTelemetrySpilloverFromV1023(inputs: MacroEconomyInputs): MacroMapsTelemetrySpillover {
  const maps: any =
    inputs.mapsTelemetry ??
    inputs.dashboardsMaps?.telemetry ??
    inputs.nationalDashboards?.maps ??
    inputs.nationalSystems?.mapsTelemetry;
  if (!maps) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const fidelity = String(maps.geoFidelityBand ?? maps.mapFidelity?.band ?? maps.fidelityBand ?? '');
  const latency = String(maps.tileLatencyBand ?? maps.renderLag?.band ?? maps.latencyBand ?? '');
  const coverage = String(maps.coverageBand ?? maps.regionalCoverage?.band ?? '');

  if (fidelity === 'distorted' || fidelity === 'critical' || fidelity === 'misaligned') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = `Distorted map fidelity (${fidelity}) obscures regional macro cycle read.`;
  } else if (fidelity === 'high' || fidelity === 'precise') {
    productivityNudge += 0.5;
  }

  if (latency === 'severe' || latency === 'critical' || latency === 'stale') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Stale map tile latency delays macro investment signal read.';
  }

  if (coverage === 'gaps' || coverage === 'partial' || coverage === 'critical') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Incomplete map coverage weakens macro regional spillover interpretation.';
  } else if (coverage === 'complete' || coverage === 'national') {
    cycleNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroMapsTelemetrySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroMapsTelemetrySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
