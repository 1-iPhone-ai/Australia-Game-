/**
 * §6 persistence keys — V1031 grid / energy network resilience (O6K-80).
 */
export const V1034_CIRES_SAVE_META_KEY = 'save.meta.v1034.critical_infrastructure_resilience' as const;
export const V1034_CIRES_LAB_SUITE_ID = 'v1034_critical_infrastructure_resilience' as const;

export const V1034_CIRES_PERSISTENCE_PATHS = {
  root: V1034_CIRES_SAVE_META_KEY,
  compromiseSnapshots: `${V1034_CIRES_SAVE_META_KEY}.compromise_snapshots`,
  segmentBuffer: `${V1034_CIRES_SAVE_META_KEY}.segment_buffer_graph`,
  regional: `${V1034_CIRES_SAVE_META_KEY}.regional_facility_zone`,
  history: `${V1034_CIRES_SAVE_META_KEY}.history`,
  aiCache: `${V1034_CIRES_SAVE_META_KEY}.ai_read_cache`,
} as const;
