import type {
  MacroTransmissionImbalanceBand,
  MacroTransmissionImbalanceSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionImbalanceBand, MacroTransmissionImbalanceSnapshot };

/** Net restrictive minus supportive transmission mass (signed imbalance index). */
export function buildMacroTransmissionImbalanceSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionImbalanceSnapshot {
  let support = 0;
  let restrict = 0;
  for (const layer of report.layers) {
    const net = layer.cycleContribution + layer.investmentContribution + layer.productivityContribution;
    if (net > 0.08) support += net;
    else if (net < -0.08) restrict += Math.abs(net);
  }
  const total = support + restrict;
  if (total <= 0) {
    return {
      imbalanceIndex: 0,
      band: 'balanced',
      supportiveMass: 0,
      restrictiveMass: 0,
      summary: 'No directional transmission mass — imbalance read is balanced.'
    };
  }
  const skew = (restrict - support) / total;
  const imbalanceIndex = Math.round(v1014macroClamp((skew + 1) / 2, 0, 1) * 1000) / 10;

  let band: MacroTransmissionImbalanceBand = 'balanced';
  if (imbalanceIndex >= 72) band = skew > 0 ? 'restrictive_heavy' : 'supportive_heavy';
  else if (imbalanceIndex >= 55) band = 'tilted';

  const summary = `Transmission imbalance ${imbalanceIndex.toFixed(1)} (${band}); restrict ${restrict.toFixed(1)} vs support ${support.toFixed(1)}.`;

  return {
    imbalanceIndex,
    band,
    supportiveMass: Math.round(support * 100) / 100,
    restrictiveMass: Math.round(restrict * 100) / 100,
    summary
  };
}
