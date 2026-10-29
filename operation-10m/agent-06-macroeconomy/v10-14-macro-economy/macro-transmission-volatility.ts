import type {
  MacroTransmissionVolatilityBand,
  MacroTransmissionVolatilitySnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionVolatilityBand, MacroTransmissionVolatilitySnapshot };

/** Cross-layer magnitude spread — high spread implies volatile composite macro read. */
export function buildMacroTransmissionVolatilitySnapshot(
  report: MacroTransmissionReport
): MacroTransmissionVolatilitySnapshot {
  const magnitudes = report.layers.map(
    l => Math.abs(l.cycleContribution) + Math.abs(l.investmentContribution) + Math.abs(l.productivityContribution)
  );
  if (magnitudes.length === 0) {
    return {
      volatilityIndex: 0,
      band: 'stable',
      layerSpread: 0,
      summary: 'No transmission layers — volatility read is stable.'
    };
  }
  const mean = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
  const variance = magnitudes.reduce((a, v) => a + (v - mean) ** 2, 0) / magnitudes.length;
  const spread = Math.sqrt(variance);
  const normalized = mean > 0.01 ? v1014macroClamp(spread / mean, 0, 2) / 2 : 0;
  const volatilityIndex = Math.round(normalized * 1000) / 10;

  let band: MacroTransmissionVolatilityBand = 'stable';
  if (volatilityIndex >= 62) band = 'turbulent';
  else if (volatilityIndex >= 42) band = 'elevated';
  else if (volatilityIndex >= 22) band = 'moderate';

  const summary = `Transmission volatility ${volatilityIndex.toFixed(1)} (${band}); layer magnitude spread ${spread.toFixed(2)}.`;

  return { volatilityIndex, band, layerSpread: Math.round(spread * 100) / 100, summary };
}
