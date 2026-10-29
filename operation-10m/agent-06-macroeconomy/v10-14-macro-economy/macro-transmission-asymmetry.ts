import type {
  MacroTransmissionAsymmetryBand,
  MacroTransmissionAsymmetrySnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionAsymmetryBand, MacroTransmissionAsymmetrySnapshot };

/** Measures imbalance between supportive vs restrictive transmission nudges. */
export function buildMacroTransmissionAsymmetrySnapshot(
  report: MacroTransmissionReport
): MacroTransmissionAsymmetrySnapshot {
  let supportive = 0;
  let restrictive = 0;
  for (const layer of report.layers) {
    const net = layer.cycleContribution + layer.investmentContribution * 0.4 + layer.productivityContribution * 0.25;
    if (net > 0.05) supportive += Math.abs(net);
    else if (net < -0.05) restrictive += Math.abs(net);
  }
  const total = supportive + restrictive;
  if (total <= 0.01) {
    return {
      asymmetryIndex: 0,
      band: 'balanced',
      supportiveMass: 0,
      restrictiveMass: 0,
      summary: 'No directional transmission mass — asymmetry read is balanced.'
    };
  }
  const skew = (supportive - restrictive) / total;
  const asymmetryIndex = Math.round(Math.abs(skew) * 1000) / 10;

  let band: MacroTransmissionAsymmetryBand = 'balanced';
  if (asymmetryIndex >= 55) band = skew > 0 ? 'support_skewed' : 'restrict_skewed';
  else if (asymmetryIndex >= 30) band = skew > 0 ? 'mild_support' : 'mild_restrict';

  const summary = `Transmission asymmetry ${asymmetryIndex.toFixed(1)} (${band}); supportive ${supportive.toFixed(1)} vs restrictive ${restrictive.toFixed(1)}.`;

  return {
    asymmetryIndex,
    band,
    supportiveMass: Math.round(supportive * 100) / 100,
    restrictiveMass: Math.round(restrictive * 100) / 100,
    summary
  };
}
