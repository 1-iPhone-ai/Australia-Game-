import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroDashboardsSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.23 dashboards & maps spillover (never mutates dashboard state). */
export function readMacroDashboardsSpilloverFromV1023(inputs: MacroEconomyInputs): MacroDashboardsSpillover {
  const dash: any =
    inputs.dashboardsMaps ??
    inputs.nationalDashboards ??
    inputs.mapsTelemetry ??
    inputs.nationalSystems?.dashboards;
  if (!dash) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const refreshLag = String(dash.refreshLag?.band ?? dash.dataLagBand ?? '');
  const signalCoherence = String(dash.signalCoherence?.band ?? dash.mapSignalBand ?? '');
  const alertDensity = String(dash.alertDensity?.band ?? dash.alertLoadBand ?? '');

  if (refreshLag === 'stale' || refreshLag === 'critical' || refreshLag === 'severe') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = `Stale dashboard refresh (${refreshLag}) lags macro situational read.`;
  } else if (refreshLag === 'realtime' || refreshLag === 'fresh') {
    productivityNudge += 0.5;
  }

  if (signalCoherence === 'fragmented' || signalCoherence === 'conflicting') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Fragmented map signals distort macro cycle aggregation.';
  } else if (signalCoherence === 'aligned' || signalCoherence === 'strong') {
    cycleNudge += 0.5;
    investmentNudge += 0.5;
  }

  if (alertDensity === 'flooded' || alertDensity === 'critical' || alertDensity === 'severe') {
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Flooded dashboard alerts cap macro investment confidence.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroDashboardsSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroDashboardsSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
