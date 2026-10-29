import type { Agent17VigilAccordSnapshot } from '../types/command-center-types.ts';

export interface Agent17Wave58VigilAccordExtensionSnapshot {
  wave58VigilScore: number;
  wave58GateBand: 'ready' | 'pending' | 'blocked';
  headline: string;
}

export function buildAgent17Wave58VigilAccordExtension(
  vigilAccord: Agent17VigilAccordSnapshot,
): Agent17Wave58VigilAccordExtensionSnapshot {
  const wave58VigilScore = Math.min(100, Math.round(vigilAccord.vigilScore * 0.96 + 4));
  const wave58GateBand: Agent17Wave58VigilAccordExtensionSnapshot['wave58GateBand'] =
    wave58VigilScore >= 62 && vigilAccord.vigilSeated ? 'ready' : wave58VigilScore >= 40 ? 'pending' : 'blocked';
  return {
    wave58VigilScore,
    wave58GateBand,
    headline: `Wave 58 O10-260 vigil accord extension (${wave58GateBand}) · ${vigilAccord.headline}`,
  };
}
