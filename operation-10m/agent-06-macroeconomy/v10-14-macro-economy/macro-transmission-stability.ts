import type {
  MacroTransmissionReport,
  MacroTransmissionStabilityBand,
  MacroTransmissionStabilitySnapshot
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionStabilityBand, MacroTransmissionStabilitySnapshot };

/** Cycle vs productivity directional disagreement across transmission layers. */
export function buildMacroTransmissionStabilitySnapshot(
  report: MacroTransmissionReport
): MacroTransmissionStabilitySnapshot {
  let aligned = 0;
  let conflict = 0;
  for (const layer of report.layers) {
    const c = layer.cycleContribution;
    const p = layer.productivityContribution;
    if (Math.abs(c) < 0.05 && Math.abs(p) < 0.05) continue;
    if (c * p >= 0) aligned += 1;
    else conflict += 1;
  }
  const active = aligned + conflict;
  if (active <= 0) {
    return {
      stabilityIndex: 0,
      band: 'stable',
      conflictingLayerCount: 0,
      alignedLayerCount: 0,
      summary: 'No active cycle/productivity nudges — stability read is stable.'
    };
  }
  const ratio = conflict / active;
  const stabilityIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionStabilityBand = 'moderate';
  if (stabilityIndex >= 62) band = 'unstable';
  else if (stabilityIndex >= 45) band = 'fragile';
  else if (stabilityIndex <= 22) band = 'stable';

  const summary = `Transmission stability ${stabilityIndex.toFixed(1)} (${band}); ${conflict}/${active} layers disagree on cycle vs productivity sign.`;

  return {
    stabilityIndex,
    band,
    conflictingLayerCount: conflict,
    alignedLayerCount: aligned,
    summary
  };
}
