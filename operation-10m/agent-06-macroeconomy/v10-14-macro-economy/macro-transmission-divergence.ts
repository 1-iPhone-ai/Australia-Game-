import type {
  MacroTransmissionDivergenceBand,
  MacroTransmissionDivergenceSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionDivergenceBand, MacroTransmissionDivergenceSnapshot };

/** Cycle vs investment directional disagreement across transmission layers. */
export function buildMacroTransmissionDivergenceSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionDivergenceSnapshot {
  let aligned = 0;
  let conflict = 0;
  for (const layer of report.layers) {
    const c = layer.cycleContribution;
    const i = layer.investmentContribution;
    if (Math.abs(c) < 0.05 && Math.abs(i) < 0.05) continue;
    if (c * i >= 0) aligned += 1;
    else conflict += 1;
  }
  const active = aligned + conflict;
  if (active <= 0) {
    return {
      divergenceIndex: 0,
      band: 'aligned',
      conflictingLayerCount: 0,
      alignedLayerCount: 0,
      summary: 'No active cycle/investment nudges — divergence read is aligned.'
    };
  }
  const ratio = conflict / active;
  const divergenceIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionDivergenceBand = 'moderate';
  if (divergenceIndex >= 62) band = 'wide';
  else if (divergenceIndex >= 45) band = 'elevated';
  else if (divergenceIndex <= 22) band = 'aligned';

  const summary = `Transmission divergence ${divergenceIndex.toFixed(1)} (${band}); ${conflict}/${active} layers disagree on cycle vs investment sign.`;

  return {
    divergenceIndex,
    band,
    conflictingLayerCount: conflict,
    alignedLayerCount: aligned,
    summary
  };
}
