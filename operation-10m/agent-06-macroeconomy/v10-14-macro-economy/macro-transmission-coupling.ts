import type {
  MacroTransmissionCouplingBand,
  MacroTransmissionCouplingSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionCouplingBand, MacroTransmissionCouplingSnapshot };

/** Mean absolute co-movement of cycle and investment contributions across layers. */
export function buildMacroTransmissionCouplingSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionCouplingSnapshot {
  let sum = 0;
  let count = 0;
  for (const layer of report.layers) {
    const c = layer.cycleContribution;
    const i = layer.investmentContribution;
    if (Math.abs(c) < 0.05 && Math.abs(i) < 0.05) continue;
    sum += Math.min(Math.abs(c), Math.abs(i)) * (c * i >= 0 ? 1 : 0.35);
    count += 1;
  }
  if (count <= 0) {
    return {
      couplingIndex: 0,
      band: 'loose',
      coupledLayerCount: 0,
      summary: 'No active cycle/investment pairs — coupling read is loose.'
    };
  }
  const avg = sum / count;
  const couplingIndex = Math.round(v1014macroClamp(avg / 3, 0, 1) * 1000) / 10;

  let band: MacroTransmissionCouplingBand = 'moderate';
  if (couplingIndex >= 68) band = 'tight';
  else if (couplingIndex >= 48) band = 'firm';
  else if (couplingIndex <= 25) band = 'loose';

  const summary = `Transmission coupling ${couplingIndex.toFixed(1)} (${band}); ${count} layers with co-moving cycle/investment nudges.`;

  return {
    couplingIndex,
    band,
    coupledLayerCount: count,
    summary
  };
}
