import type { V1014WorkforceRegionId, V1014WorkforceSkillDomain } from '../types/core';

export const V1014_WORKFORCE_REGION_IDS: readonly V1014WorkforceRegionId[] = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'NT',
  'ACT',
];

export const V1014_WORKFORCE_SKILL_DOMAINS: readonly V1014WorkforceSkillDomain[] = [
  'engineering',
  'healthcare',
  'trades',
  'digital',
  'logistics',
  'education',
  'mining',
  'agriculture',
  'hospitality',
  'public_admin',
];

export const V1014_WORKFORCE_LIMITS = {
  section6HistoryDepth: 12,
  maxActiveScenarios: 32,
  maxCorridorBacklogTurns: 36,
} as const;
