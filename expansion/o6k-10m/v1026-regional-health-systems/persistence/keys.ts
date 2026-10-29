/**
 * §6 persistence keys — V1026 regional health systems (O6K-59).
 */
export const V1026_RHS_SAVE_META_KEY = 'save.meta.v1026.regional_health_systems' as const;
export const V1026_RHS_LAB_SUITE_ID = 'v1026_regional_health_systems' as const;

export const V1026_RHS_PERSISTENCE_PATHS = {
  root: V1026_RHS_SAVE_META_KEY,
  careSnapshots: `${V1026_RHS_SAVE_META_KEY}.care_snapshots`,
  primaryCareAccess: `${V1026_RHS_SAVE_META_KEY}.primary_care_access_graph`,
  regional: `${V1026_RHS_SAVE_META_KEY}.regional_hospital_network`,
  history: `${V1026_RHS_SAVE_META_KEY}.history`,
  aiCache: `${V1026_RHS_SAVE_META_KEY}.ai_read_cache`,
} as const;
