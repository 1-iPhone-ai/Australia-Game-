import type {
  MacroTransmissionSynthesisBand,
  MacroTransmissionSynthesisSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionSynthesisBand, MacroTransmissionSynthesisSnapshot };

/** Weighted net transmission magnitude normalized to a synthesis index. */
export function buildMacroTransmissionSynthesisSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionSynthesisSnapshot {
  let mass = 0;
  for (const layer of report.layers) {
    mass +=
      Math.abs(layer.cycleContribution) +
      Math.abs(layer.investmentContribution) * 0.45 +
      Math.abs(layer.productivityContribution) * 0.35;
  }
  const synthesisIndex = Math.round(v1014macroClamp(mass / (report.layers.length * 2.2), 0, 1) * 1000) / 10;

  let band: MacroTransmissionSynthesisBand = 'moderate';
  if (synthesisIndex >= 68) band = 'elevated';
  else if (synthesisIndex <= 28) band = 'subdued';

  const netSigned =
    report.netCycleNudge + report.netInvestmentNudge * 0.45 + report.netProductivityNudge * 0.35;
  const summary = `Transmission synthesis ${synthesisIndex.toFixed(1)} (${band}); net signed impulse ${netSigned.toFixed(2)} across ${report.layers.length} layers.`;

  return {
    synthesisIndex,
    band,
    grossMass: Math.round(mass * 100) / 100,
    netSignedImpulse: Math.round(netSigned * 100) / 100,
    summary
  };
}
