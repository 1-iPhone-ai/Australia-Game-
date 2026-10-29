import type {
  LREconomyBand,
  LRDevTier,
  LRMomentumBand,
  NationalNetworkCondition,
  NationalNetworkKind,
  NationalResilienceBand,
  RegionMapLayoutEntry,
} from '../types.ts';

export const COMM_REGION_CODES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as const;

/** Canonical REGIONS.position from V9.4 (strategic map overlay, not geographic GIS). */
export const AGENT23_REGION_MAP_LAYOUT: RegionMapLayoutEntry[] = [
  { regionId: 'QLD', name: 'Queensland', color: '#f4a261', x: 80, y: 35 },
  { regionId: 'NSW', name: 'New South Wales', color: '#e76f51', x: 80, y: 65 },
  { regionId: 'VIC', name: 'Victoria', color: '#264653', x: 65, y: 85 },
  { regionId: 'TAS', name: 'Tasmania', color: '#2a9d8f', x: 75, y: 100 },
  { regionId: 'SA', name: 'South Australia', color: '#e9c46a', x: 45, y: 75 },
  { regionId: 'WA', name: 'Western Australia', color: '#f4a261', x: 15, y: 55 },
  { regionId: 'NT', name: 'Northern Territory', color: '#e76f51', x: 45, y: 35 },
  { regionId: 'ACT', name: 'Australian Capital Territory', color: '#264653', x: 75, y: 70 },
];

export const NATIONAL_NETWORKS: NationalNetworkKind[] = [
  'freight',
  'energy',
  'water',
  'trade',
  'digital',
];

export const NATIONAL_NETWORK_LABEL: Record<NationalNetworkKind, string> = {
  freight: 'Freight',
  energy: 'Energy',
  water: 'Water',
  trade: 'Trade',
  digital: 'Digital',
};

export const NATIONAL_NETWORK_ICON: Record<NationalNetworkKind, string> = {
  freight: '🚆',
  energy: '⚡',
  water: '💧',
  trade: '🚢',
  digital: '🛰',
};

export const NATIONAL_CONDITION_LABEL: Record<NationalNetworkCondition, string> = {
  surplus: 'Surplus',
  healthy: 'Healthy',
  strained: 'Strained',
  bottlenecked: 'Bottlenecked',
  critical: 'Critical',
};

export const NATIONAL_CONDITION_ICON: Record<NationalNetworkCondition, string> = {
  surplus: '✚',
  healthy: '✓',
  strained: '●',
  bottlenecked: '⚠',
  critical: '⛔',
};

export const NATIONAL_RESILIENCE_LABEL: Record<NationalResilienceBand, string> = {
  fragile: 'Fragile',
  exposed: 'Exposed',
  stable: 'Stable',
  resilient: 'Resilient',
  highly_resilient: 'Highly resilient',
};

export const LR_DEV_LABEL: Record<LRDevTier, string> = {
  underdeveloped: 'Underdeveloped',
  emerging: 'Emerging',
  developing: 'Developing',
  advanced: 'Advanced',
  highly_developed: 'Highly Developed',
};

export const LR_MOMENTUM_LABEL: Record<LRMomentumBand, string> = {
  declining: 'Declining',
  weakening: 'Weakening',
  stable: 'Stable',
  growing: 'Growing',
  rapid_growth: 'Rapid Growth',
  booming: 'Booming',
};

export const LR_ECON_LABEL: Record<LREconomyBand, string> = {
  depressed: 'Depressed',
  weak: 'Weak',
  moderate: 'Moderate',
  strong: 'Strong',
  booming: 'Booming',
};

export const NR_DASH_COND_COLOR: Record<NationalNetworkCondition, string> = {
  surplus: '#34d399',
  healthy: '#5eead4',
  strained: '#fbbf24',
  bottlenecked: '#fb923c',
  critical: '#f87171',
};

export const NR_DASH_TAB_ORDER = [
  'overview',
  'regions',
  'networks',
  'trends',
  'map',
] as const;

export const NR_DASH_TAB_LABELS: Record<(typeof NR_DASH_TAB_ORDER)[number], string> = {
  overview: 'National overview',
  regions: 'Regional compare',
  networks: 'Network matrix',
  trends: 'Turning points',
  map: 'Strategic map',
};

export const NR_DASH_MOM_RANK: Record<LRMomentumBand, number> = {
  declining: 0,
  weakening: 1,
  stable: 2,
  growing: 3,
  rapid_growth: 4,
  booming: 5,
};
