/**
 * §6 persistence keys — V1017 intercity logistics (O6K-36).
 */
export const V1017_ICLOG_SAVE_META_KEY = 'save.meta.v1017.intercity_logistics' as const;
export const V1017_ICLOG_LAB_SUITE_ID = 'v1017_intercity_logistics' as const;

export const V1017_ICLOG_PERSISTENCE_PATHS = {
  root: V1017_ICLOG_SAVE_META_KEY,
  routes: `${V1017_ICLOG_SAVE_META_KEY}.freight_routes`,
  corridor: `${V1017_ICLOG_SAVE_META_KEY}.corridor_graph`,
  regional: `${V1017_ICLOG_SAVE_META_KEY}.regional_hub`,
  history: `${V1017_ICLOG_SAVE_META_KEY}.history`,
  aiCache: `${V1017_ICLOG_SAVE_META_KEY}.ai_read_cache`,
} as const;
