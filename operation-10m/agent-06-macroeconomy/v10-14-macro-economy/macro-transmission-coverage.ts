import type {
  MacroTransmissionCoverageBand,
  MacroTransmissionCoverageSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionCoverageBand, MacroTransmissionCoverageSnapshot };

/** Share of transmission layers carrying material (non-zero) nudge magnitude. */
export function buildMacroTransmissionCoverageSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionCoverageSnapshot {
  const total = report.layers.length;
  if (total === 0) {
    return { coverageIndex: 0, band: 'sparse', activeLayerCount: 0, summary: 'No transmission layers — coverage is sparse.' };
  }
  let active = 0;
  for (const layer of report.layers) {
    const mag =
      Math.abs(layer.cycleContribution) +
      Math.abs(layer.investmentContribution) +
      Math.abs(layer.productivityContribution);
    if (mag > 0.05) active++;
  }
  const ratio = active / total;
  const coverageIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionCoverageBand = 'sparse';
  if (coverageIndex >= 75) band = 'broad';
  else if (coverageIndex >= 55) band = 'moderate';
  else if (coverageIndex >= 35) band = 'narrow';

  const summary = `Transmission coverage ${coverageIndex.toFixed(1)} (${band}); ${active}/${total} layers materially active.`;

  return { coverageIndex, band, activeLayerCount: active, summary };
}
