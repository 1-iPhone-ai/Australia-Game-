/**
 * §6 persistence keys — V1019 maritime trade (O6K-41).
 */
export const V1019_MTRD_SAVE_META_KEY = 'save.meta.v1019.maritime_trade' as const;
export const V1019_MTRD_LAB_SUITE_ID = 'v1019_maritime_trade' as const;

export const V1019_MTRD_PERSISTENCE_PATHS = {
  root: V1019_MTRD_SAVE_META_KEY,
  lanes: `${V1019_MTRD_SAVE_META_KEY}.shipping_lanes`,
  laneGraph: `${V1019_MTRD_SAVE_META_KEY}.lane_graph`,
  regional: `${V1019_MTRD_SAVE_META_KEY}.regional_port`,
  history: `${V1019_MTRD_SAVE_META_KEY}.history`,
  aiCache: `${V1019_MTRD_SAVE_META_KEY}.ai_read_cache`,
} as const;
