import type { Agent17VigilAccordSnapshot } from '../types/command-center-types.ts';

export interface Agent17Wave60VigilAccordExtensionSnapshot {
  wave60VigilScore: number;
  wave60GateBand: 'ready' | 'pending' | 'blocked';
  headline: string;
}

export function buildAgent17Wave60VigilAccordExtension(
  vigilAccord: Agent17VigilAccordSnapshot,
): Agent17Wave60VigilAccordExtensionSnapshot {
  const wave60VigilScore = Math.min(100, Math.round(vigilAccord.vigilScore * 0.96 + 4));
  const wave60GateBand: Agent17Wave60VigilAccordExtensionSnapshot['wave60GateBand'] =
    wave60VigilScore >= 62 && vigilAccord.vigilSeated ? 'ready' : wave60VigilScore >= 40 ? 'pending' : 'blocked';
  return {
    wave60VigilScore,
    wave60GateBand,
    headline: `Wave 60 O10-265 vigil accord extension (${wave60GateBand}) · ${vigilAccord.headline}`,
  };
}
