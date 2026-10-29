/**
 * §6 persistence keys — V1031 grid / energy network resilience (O6K-68).
 */
export const V1032_TRES_SAVE_META_KEY = 'save.meta.v1032.telecom_resilience' as const;
export const V1032_TRES_LAB_SUITE_ID = 'v1032_telecom_resilience' as const;

export const V1032_TRES_PERSISTENCE_PATHS = {
  root: V1032_TRES_SAVE_META_KEY,
  failoverSnapshots: `${V1032_TRES_SAVE_META_KEY}.failover_snapshots`,
  backboneBuffer: `${V1032_TRES_SAVE_META_KEY}.backbone_buffer_graph`,
  regional: `${V1032_TRES_SAVE_META_KEY}.regional_exchange_zone`,
  history: `${V1032_TRES_SAVE_META_KEY}.history`,
  aiCache: `${V1032_TRES_SAVE_META_KEY}.ai_read_cache`,
} as const;
