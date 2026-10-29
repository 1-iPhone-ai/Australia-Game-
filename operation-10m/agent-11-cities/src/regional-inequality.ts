import { OP10M_A11_CORE_REGIONS, type OP10M_A11_RegionId } from './types.ts';
import { op10mA11Clamp, op10mA11Round } from './constants.ts';

export function op10mA11RelativeStanding(scores: Record<OP10M_A11_RegionId, number>): Record<OP10M_A11_RegionId, number> {
  const vals = OP10M_A11_CORE_REGIONS.map((r) => scores[r]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = Math.max(1, max - min);
  const out = {} as Record<OP10M_A11_RegionId, number>;
  for (const rid of OP10M_A11_CORE_REGIONS) {
    out[rid] = op10mA11Clamp(((scores[rid] - min) / span) * 100);
  }
  return out;
}

export function op10mA11LeadingLaggingFlags(
  relative: Record<OP10M_A11_RegionId, number>,
): Record<OP10M_A11_RegionId, { leading: boolean; lagging: boolean }> {
  const out = {} as Record<OP10M_A11_RegionId, { leading: boolean; lagging: boolean }>;
  for (const rid of OP10M_A11_CORE_REGIONS) {
    out[rid] = {
      leading: relative[rid] >= 72,
      lagging: relative[rid] <= 28,
    };
  }
  return out;
}

export function op10mA11SummarizeInequality(args: {
  inequalityIndex: number;
  inequalityBand: string;
  metroGap: number;
  leading: OP10M_A11_RegionId[];
  lagging: OP10M_A11_RegionId[];
}): string {
  const lead = args.leading.slice(0, 2).join('/') || 'none';
  const lag = args.lagging.slice(0, 2).join('/') || 'none';
  return `Regional inequality ${args.inequalityBand} (index ${op10mA11Round(args.inequalityIndex)}); metro gap ${op10mA11Round(args.metroGap)}; leaders ${lead}; lagging ${lag}.`;
}
