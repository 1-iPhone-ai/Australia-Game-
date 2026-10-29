/**
 * §6 persistence keys — V1023 climate adaptation (O6K-51).
 */
export const V1023_CLAD_SAVE_META_KEY = 'save.meta.v1023.climate_adaptation' as const;
export const V1023_CLAD_LAB_SUITE_ID = 'v1023_climate_adaptation' as const;

export const V1023_CLAD_PERSISTENCE_PATHS = {
  root: V1023_CLAD_SAVE_META_KEY,
  hazardSnapshots: `${V1023_CLAD_SAVE_META_KEY}.hazard_snapshots`,
  droughtBuffer: `${V1023_CLAD_SAVE_META_KEY}.drought_buffer_graph`,
  regional: `${V1023_CLAD_SAVE_META_KEY}.regional_flood_defend`,
  history: `${V1023_CLAD_SAVE_META_KEY}.history`,
  aiCache: `${V1023_CLAD_SAVE_META_KEY}.ai_read_cache`,
} as const;
