/**
 * §6 persistence keys — V1029 coastal resilience (O6K-64).
 */
export const V1029_CRES_SAVE_META_KEY = 'save.meta.v1029.coastal_resilience' as const;
export const V1029_CRES_LAB_SUITE_ID = 'v1029_coastal_resilience' as const;

export const V1029_CRES_PERSISTENCE_PATHS = {
  root: V1029_CRES_SAVE_META_KEY,
  surgeSnapshots: `${V1029_CRES_SAVE_META_KEY}.surge_snapshots`,
  adaptationBuffer: `${V1029_CRES_SAVE_META_KEY}.adaptation_buffer_graph`,
  regional: `${V1029_CRES_SAVE_META_KEY}.regional_littoral_zone`,
  history: `${V1029_CRES_SAVE_META_KEY}.history`,
  aiCache: `${V1029_CRES_SAVE_META_KEY}.ai_read_cache`,
} as const;
