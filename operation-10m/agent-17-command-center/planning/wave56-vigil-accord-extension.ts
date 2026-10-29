import type { Agent17VigilAccordSnapshot } from '../types/command-center-types.ts';

export interface Agent17Wave56VigilAccordExtensionSnapshot {
  wave56VigilScore: number;
  wave56GateBand: 'ready' | 'pending' | 'blocked';
  headline: string;
}

export function buildAgent17Wave56VigilAccordExtension(
  vigilAccord: Agent17VigilAccordSnapshot,
): Agent17Wave56VigilAccordExtensionSnapshot {
  const wave56VigilScore = Math.min(100, Math.round(vigilAccord.vigilScore * 0.96 + 4));
  const wave56GateBand: Agent17Wave56VigilAccordExtensionSnapshot['wave56GateBand'] =
    wave56VigilScore >= 62 && vigilAccord.vigilSeated ? 'ready' : wave56VigilScore >= 40 ? 'pending' : 'blocked';
  return {
    wave56VigilScore,
    wave56GateBand,
    headline: `Wave 56 O10-254 vigil accord extension (${wave56GateBand}) · ${vigilAccord.headline}`,
  };
}
