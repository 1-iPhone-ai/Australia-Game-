/**
 * §6 persistence keys — V1016 national resilience (O6K-33).
 */
export const V1016_NRES_SAVE_META_KEY = 'save.meta.v1016.national_resilience' as const;
export const V1016_NRES_LAB_SUITE_ID = 'v1016_national_resilience' as const;

export const V1016_NRES_PERSISTENCE_PATHS = {
  root: V1016_NRES_SAVE_META_KEY,
  shocks: `${V1016_NRES_SAVE_META_KEY}.supply_shocks`,
  propagation: `${V1016_NRES_SAVE_META_KEY}.propagation_graph`,
  regional: `${V1016_NRES_SAVE_META_KEY}.regional_continuity`,
  history: `${V1016_NRES_SAVE_META_KEY}.history`,
  aiCache: `${V1016_NRES_SAVE_META_KEY}.ai_read_cache`,
} as const;
