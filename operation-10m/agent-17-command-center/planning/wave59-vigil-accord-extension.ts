import type { Agent17VigilAccordSnapshot } from '../types/command-center-types.ts';

export interface Agent17Wave59VigilAccordExtensionSnapshot {
  wave59VigilScore: number;
  wave59GateBand: 'ready' | 'pending' | 'blocked';
  headline: string;
}

export function buildAgent17Wave59VigilAccordExtension(
  vigilAccord: Agent17VigilAccordSnapshot,
): Agent17Wave59VigilAccordExtensionSnapshot {
  const wave59VigilScore = Math.min(100, Math.round(vigilAccord.vigilScore * 0.96 + 4));
  const wave59GateBand: Agent17Wave59VigilAccordExtensionSnapshot['wave59GateBand'] =
    wave59VigilScore >= 62 && vigilAccord.vigilSeated ? 'ready' : wave59VigilScore >= 40 ? 'pending' : 'blocked';
  return {
    wave59VigilScore,
    wave59GateBand,
    headline: `Wave 59 O10-263 vigil accord extension (${wave59GateBand}) · ${vigilAccord.headline}`,
  };
}
