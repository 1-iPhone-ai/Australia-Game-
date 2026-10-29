import type { Agent17VigilAccordSnapshot } from '../types/command-center-types.ts';

export interface Agent17Wave57VigilAccordExtensionSnapshot {
  wave57VigilScore: number;
  wave57GateBand: 'ready' | 'pending' | 'blocked';
  headline: string;
}

export function buildAgent17Wave57VigilAccordExtension(
  vigilAccord: Agent17VigilAccordSnapshot,
): Agent17Wave57VigilAccordExtensionSnapshot {
  const wave57VigilScore = Math.min(100, Math.round(vigilAccord.vigilScore * 0.96 + 4));
  const wave57GateBand: Agent17Wave57VigilAccordExtensionSnapshot['wave57GateBand'] =
    wave57VigilScore >= 62 && vigilAccord.vigilSeated ? 'ready' : wave57VigilScore >= 40 ? 'pending' : 'blocked';
  return {
    wave57VigilScore,
    wave57GateBand,
    headline: `Wave 57 O10-257 vigil accord extension (${wave57GateBand}) · ${vigilAccord.headline}`,
  };
}
