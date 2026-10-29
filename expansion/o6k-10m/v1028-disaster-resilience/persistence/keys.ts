/**
 * §6 persistence keys — V1028 disaster resilience (O6K-62).
 */
export const V1028_DRES_SAVE_META_KEY = 'save.meta.v1028.disaster_resilience' as const;
export const V1028_DRES_LAB_SUITE_ID = 'v1028_disaster_resilience' as const;

export const V1028_DRES_PERSISTENCE_PATHS = {
  root: V1028_DRES_SAVE_META_KEY,
  hazardSnapshots: `${V1028_DRES_SAVE_META_KEY}.hazard_snapshots`,
  evacuationCapacity: `${V1028_DRES_SAVE_META_KEY}.evacuation_capacity_graph`,
  regional: `${V1028_DRES_SAVE_META_KEY}.regional_emergency_response`,
  history: `${V1028_DRES_SAVE_META_KEY}.history`,
  aiCache: `${V1028_DRES_SAVE_META_KEY}.ai_read_cache`,
} as const;
