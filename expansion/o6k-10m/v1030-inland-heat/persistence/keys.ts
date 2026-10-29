/**
 * §6 persistence keys — V1030 inland heat / arid adaptation (O6K-66).
 */
export const V1030_IHEAT_SAVE_META_KEY = 'save.meta.v1030.inland_heat' as const;
export const V1030_IHEAT_LAB_SUITE_ID = 'v1030_inland_heat' as const;

export const V1030_IHEAT_PERSISTENCE_PATHS = {
  root: V1030_IHEAT_SAVE_META_KEY,
  heatwaveSnapshots: `${V1030_IHEAT_SAVE_META_KEY}.heatwave_snapshots`,
  aridBuffer: `${V1030_IHEAT_SAVE_META_KEY}.arid_buffer_graph`,
  regional: `${V1030_IHEAT_SAVE_META_KEY}.regional_inland_zone`,
  history: `${V1030_IHEAT_SAVE_META_KEY}.history`,
  aiCache: `${V1030_IHEAT_SAVE_META_KEY}.ai_read_cache`,
} as const;
