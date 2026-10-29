import type { Agent17VigilAccordSnapshot } from '../types/command-center-types.ts';

export interface Agent17Wave61VigilAccordExtensionSnapshot {
  wave61VigilScore: number;
  wave61GateBand: 'ready' | 'pending' | 'blocked';
  headline: string;
}

export function buildAgent17Wave61VigilAccordExtension(
  vigilAccord: Agent17VigilAccordSnapshot,
): Agent17Wave61VigilAccordExtensionSnapshot {
  const wave61VigilScore = Math.min(100, Math.round(vigilAccord.vigilScore * 0.96 + 4));
  const wave61GateBand: Agent17Wave61VigilAccordExtensionSnapshot['wave61GateBand'] =
    wave61VigilScore >= 62 && vigilAccord.vigilSeated ? 'ready' : wave61VigilScore >= 40 ? 'pending' : 'blocked';
  return {
    wave61VigilScore,
    wave61GateBand,
    headline: `Wave 61 O10-267 vigil accord extension (${wave61GateBand}) · ${vigilAccord.headline}`,
  };
}
