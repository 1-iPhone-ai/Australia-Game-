import type {
  MacroTransmissionAlignmentBand,
  MacroTransmissionAlignmentSnapshot,
  MacroTransmissionReport
} from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroTransmissionAlignmentBand, MacroTransmissionAlignmentSnapshot };

/** Investment vs productivity directional disagreement across transmission layers. */
export function buildMacroTransmissionAlignmentSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionAlignmentSnapshot {
  let aligned = 0;
  let conflict = 0;
  for (const layer of report.layers) {
    const i = layer.investmentContribution;
    const p = layer.productivityContribution;
    if (Math.abs(i) < 0.05 && Math.abs(p) < 0.05) continue;
    if (i * p >= 0) aligned += 1;
    else conflict += 1;
  }
  const active = aligned + conflict;
  if (active <= 0) {
    return {
      alignmentIndex: 0,
      band: 'aligned',
      conflictingLayerCount: 0,
      alignedLayerCount: 0,
      summary: 'No active investment/productivity nudges — alignment read is aligned.'
    };
  }
  const ratio = conflict / active;
  const alignmentIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionAlignmentBand = 'moderate';
  if (alignmentIndex >= 62) band = 'misaligned';
  else if (alignmentIndex >= 45) band = 'strained';
  else if (alignmentIndex <= 22) band = 'aligned';

  const summary = `Transmission alignment ${alignmentIndex.toFixed(1)} (${band}); ${conflict}/${active} layers disagree on investment vs productivity sign.`;

  return {
    alignmentIndex,
    band,
    conflictingLayerCount: conflict,
    alignedLayerCount: aligned,
    summary
  };
}
