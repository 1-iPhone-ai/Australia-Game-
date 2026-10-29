/**
 * §6 persistence keys — V1024 digital governance (O6K-54).
 */
export const V1024_DGOV_SAVE_META_KEY = 'save.meta.v1024.digital_governance' as const;
export const V1024_DGOV_LAB_SUITE_ID = 'v1024_digital_governance' as const;

export const V1024_DGOV_PERSISTENCE_PATHS = {
  root: V1024_DGOV_SAVE_META_KEY,
  policySnapshots: `${V1024_DGOV_SAVE_META_KEY}.policy_snapshots`,
  dataSovereignty: `${V1024_DGOV_SAVE_META_KEY}.data_sovereignty_graph`,
  regional: `${V1024_DGOV_SAVE_META_KEY}.regional_platform_regulation`,
  history: `${V1024_DGOV_SAVE_META_KEY}.history`,
  aiCache: `${V1024_DGOV_SAVE_META_KEY}.ai_read_cache`,
} as const;
