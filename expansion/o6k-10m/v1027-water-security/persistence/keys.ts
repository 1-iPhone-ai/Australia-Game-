/**
 * §6 persistence keys — V1027 water security (O6K-61).
 */
export const V1027_WSEC_SAVE_META_KEY = 'save.meta.v1027.water_security' as const;
export const V1027_WSEC_LAB_SUITE_ID = 'v1027_water_security' as const;

export const V1027_WSEC_PERSISTENCE_PATHS = {
  root: V1027_WSEC_SAVE_META_KEY,
  basinSnapshots: `${V1027_WSEC_SAVE_META_KEY}.basin_snapshots`,
  aquiferReserve: `${V1027_WSEC_SAVE_META_KEY}.aquifer_reserve_graph`,
  regional: `${V1027_WSEC_SAVE_META_KEY}.regional_distribution_network`,
  history: `${V1027_WSEC_SAVE_META_KEY}.history`,
  aiCache: `${V1027_WSEC_SAVE_META_KEY}.ai_read_cache`,
} as const;
