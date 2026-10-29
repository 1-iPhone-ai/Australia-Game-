import type {
  MacroTransmissionHarmonicBand,
  MacroTransmissionHarmonicSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionHarmonicBand, MacroTransmissionHarmonicSnapshot };

/** Share of active layers whose cycle, investment, and productivity nudges share the same sign. */
export function buildMacroTransmissionHarmonicSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionHarmonicSnapshot {
  let harmonic = 0;
  let active = 0;
  for (const layer of report.layers) {
    const c = layer.cycleContribution;
    const i = layer.investmentContribution;
    const p = layer.productivityContribution;
    if (Math.abs(c) < 0.05 && Math.abs(i) < 0.05 && Math.abs(p) < 0.05) continue;
    active++;
    const signs = [c, i, p].filter(v => Math.abs(v) >= 0.05).map(v => Math.sign(v));
    const unique = new Set(signs);
    if (unique.size === 1) harmonic++;
  }
  if (active <= 0) {
    return {
      harmonicIndex: 0,
      band: 'dissonant',
      harmonicLayerCount: 0,
      activeLayerCount: 0,
      summary: 'No active multi-channel transmission layers — harmonic read is neutral.'
    };
  }
  const ratio = harmonic / active;
  const harmonicIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionHarmonicBand = 'mixed';
  if (harmonicIndex >= 72) band = 'aligned';
  else if (harmonicIndex >= 52) band = 'partial';
  else if (harmonicIndex <= 28) band = 'dissonant';

  const summary = `Transmission harmonic ${harmonicIndex.toFixed(1)} (${band}); ${harmonic}/${active} layers with aligned channel signs.`;

  return {
    harmonicIndex,
    band,
    harmonicLayerCount: harmonic,
    activeLayerCount: active,
    summary
  };
}
