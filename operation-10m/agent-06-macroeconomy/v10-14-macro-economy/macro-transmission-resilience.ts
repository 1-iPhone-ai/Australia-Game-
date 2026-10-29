import type {
  MacroTransmissionReport,
  MacroTransmissionResilienceBand,
  MacroTransmissionResilienceSnapshot
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionResilienceBand, MacroTransmissionResilienceSnapshot };

/** Share of layers whose net nudge is not materially restrictive — macro read resilience proxy. */
export function buildMacroTransmissionResilienceSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionResilienceSnapshot {
  let resilient = 0;
  let considered = 0;
  for (const layer of report.layers) {
    const net = layer.cycleContribution + layer.investmentContribution * 0.35 + layer.productivityContribution * 0.2;
    if (Math.abs(net) < 0.05) continue;
    considered++;
    if (net >= -0.15) resilient++;
  }
  const ratio = considered > 0 ? resilient / considered : 1;
  const resilienceIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionResilienceBand = 'fragile';
  if (resilienceIndex >= 78) band = 'robust';
  else if (resilienceIndex >= 62) band = 'steady';
  else if (resilienceIndex >= 45) band = 'mixed';

  const summary = `Transmission resilience ${resilienceIndex.toFixed(1)} (${band}); ${resilient}/${considered} layers non-restrictive.`;

  return { resilienceIndex, band, resilientLayerCount: resilient, consideredLayerCount: considered, summary };
}
