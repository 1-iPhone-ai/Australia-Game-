/**
 * §6 persistence keys — V1031 grid / energy network resilience (O6K-84).
 */
export const V1035_CYRES_SAVE_META_KEY = 'save.meta.v1034.cyber_resilience' as const;
export const V1035_CYRES_LAB_SUITE_ID = 'v1035_cyber_resilience' as const;

export const V1035_CYRES_PERSISTENCE_PATHS = {
  root: V1035_CYRES_SAVE_META_KEY,
  intrusionSnapshots: `${V1035_CYRES_SAVE_META_KEY}.intrusion_snapshots`,
  segmentBuffer: `${V1035_CYRES_SAVE_META_KEY}.segment_buffer_graph`,
  regional: `${V1035_CYRES_SAVE_META_KEY}.regional_facility_zone`,
  history: `${V1035_CYRES_SAVE_META_KEY}.history`,
  aiCache: `${V1035_CYRES_SAVE_META_KEY}.ai_read_cache`,
} as const;
