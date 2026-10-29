import type { V1014PubsSvcPillar, V1014PubsSvcRegionId } from './types.ts';

export const V1014_PUBSVC_REGION_WEIGHT: Record<V1014PubsSvcRegionId, number> = {
  NSW: 0.24,
  VIC: 0.22,
  QLD: 0.18,
  WA: 0.13,
  SA: 0.09,
  ACT: 0.06,
  TAS: 0.04,
  NT: 0.04,
};

export const V1014_PUBSVC_PILLAR_WEIGHT: Record<V1014PubsSvcPillar, number> = {
  housing: 0.34,
  healthcare: 0.38,
  education: 0.28,
};

export const V1014_PUBSVC_SKILL_DOMAIN_FOR_PILLAR: Record<V1014PubsSvcPillar, string[]> = {
  housing: ['construction', 'planning', 'trades'],
  healthcare: ['clinical', 'nursing', 'allied_health'],
  education: ['teaching', 'early_learning', 'vocational'],
};

export const V1014_PUBSVC_LIMITS = {
  maxQueueHistory: 32,
  maxMigrationLoopGain: 1.85,
  minCompositeKpi: 0,
  maxCompositeKpi: 100,
  hysteresisDeadband: 1.75,
  section6HistoryDepth: 8,
} as const;

export const V1014_PUBSVC_LAB_SUITE_ID = 'v1014_public_services_v2' as const;
