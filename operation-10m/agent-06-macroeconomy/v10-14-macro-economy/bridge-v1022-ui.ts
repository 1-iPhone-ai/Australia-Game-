import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroUiSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.22 UI shell spillover (never mutates UI state). */
export function readMacroUiSpilloverFromV1022(inputs: MacroEconomyInputs): MacroUiSpillover {
  const ui: any =
    inputs.gameUi ??
    inputs.uiShell ??
    inputs.nationalUi ??
    inputs.nationalSystems?.ui ??
    inputs.nationalSystems?.gameUi;
  if (!ui) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const panelLatency = String(ui.panelLatency?.band ?? ui.renderLatencyBand ?? ui.latencyBand ?? '');
  const navigationClutter = String(ui.navigationClutter?.band ?? ui.navClutterBand ?? ui.clutterBand ?? '');
  const renderHealth = String(ui.renderHealth?.band ?? ui.shellHealthBand ?? ui.stabilityBand ?? '');

  if (panelLatency === 'severe' || panelLatency === 'critical' || panelLatency === 'degraded') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = `Degraded UI panel latency (${panelLatency}) slows macro operator throughput.`;
  } else if (panelLatency === 'snappy' || panelLatency === 'realtime') {
    productivityNudge += 0.5;
  }

  if (navigationClutter === 'overloaded' || navigationClutter === 'critical' || navigationClutter === 'severe') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Navigation clutter obscures macro investment signals.';
  } else if (navigationClutter === 'minimal' || navigationClutter === 'clear') {
    investmentNudge += 0.5;
  }

  if (renderHealth === 'unstable' || renderHealth === 'fragile' || renderHealth === 'critical') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Unstable UI shell undermines macro cycle confidence.';
  } else if (renderHealth === 'robust' || renderHealth === 'stable') {
    cycleNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroUiSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroUiSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
