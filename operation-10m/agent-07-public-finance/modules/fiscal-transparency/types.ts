export const FISCAL_TRANSPARENCY_SCHEMA = 'op10m-agent07-fiscal-transparency-v1';

export type TransparencyTier = 'basic' | 'enhanced' | 'leading';

export interface TransparencyDimensionScore {
  id: string;
  label: string;
  score: number;
  maxScore: number;
  tier: TransparencyTier;
  detail: string;
}

export interface FiscalTransparencyIndex {
  schemaVersion: string;
  turn: number;
  dimensions: TransparencyDimensionScore[];
  compositeScore: number;
  compositeTier: TransparencyTier;
  openDataReady: boolean;
  improvementActions: string[];
}
