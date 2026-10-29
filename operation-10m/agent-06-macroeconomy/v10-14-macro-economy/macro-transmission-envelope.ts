import type {
  MacroTransmissionEnvelopeBand,
  MacroTransmissionEnvelopeSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionEnvelopeBand, MacroTransmissionEnvelopeSnapshot };

/** Peak active-layer magnitude scaled to a 0–100 envelope index. */
export function buildMacroTransmissionEnvelopeSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionEnvelopeSnapshot {
  let peak = 0;
  let active = 0;
  for (const layer of report.layers) {
    const m =
      Math.abs(layer.cycleContribution) +
      Math.abs(layer.investmentContribution) +
      Math.abs(layer.productivityContribution);
    if (m < 0.08) continue;
    active++;
    if (m > peak) peak = m;
  }
  if (active <= 0) {
    return {
      envelopeIndex: 0,
      band: 'quiet',
      peakMagnitude: 0,
      activeLayerCount: 0,
      summary: 'No active transmission envelope — spillover read is quiet.'
    };
  }
  const envelopeIndex = Math.round(v1014macroClamp(peak / 12, 0, 1) * 1000) / 10;

  let band: MacroTransmissionEnvelopeBand = 'moderate';
  if (envelopeIndex >= 68) band = 'wide';
  else if (envelopeIndex >= 45) band = 'moderate';
  else if (envelopeIndex <= 22) band = 'quiet';

  const summary = `Transmission envelope ${envelopeIndex.toFixed(1)} (${band}); peak ${peak.toFixed(2)} across ${active} active layers.`;

  return {
    envelopeIndex,
    band,
    peakMagnitude: Math.round(peak * 100) / 100,
    activeLayerCount: active,
    summary
  };
}
