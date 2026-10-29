/**
 * §6 persistence keys — V1031 grid / energy network resilience (O6K-67).
 */
export const V1031_GRES_SAVE_META_KEY = 'save.meta.v1031.grid_resilience' as const;
export const V1031_GRES_LAB_SUITE_ID = 'v1031_grid_resilience' as const;

export const V1031_GRES_PERSISTENCE_PATHS = {
  root: V1031_GRES_SAVE_META_KEY,
  outageSnapshots: `${V1031_GRES_SAVE_META_KEY}.outage_snapshots`,
  gridBuffer: `${V1031_GRES_SAVE_META_KEY}.grid_buffer_graph`,
  regional: `${V1031_GRES_SAVE_META_KEY}.regional_substation_zone`,
  history: `${V1031_GRES_SAVE_META_KEY}.history`,
  aiCache: `${V1031_GRES_SAVE_META_KEY}.ai_read_cache`,
} as const;
