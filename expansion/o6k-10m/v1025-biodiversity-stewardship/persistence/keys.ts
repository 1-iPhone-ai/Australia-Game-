/**
 * §6 persistence keys — V1025 biodiversity stewardship (O6K-56).
 */
export const V1025_BIO_SAVE_META_KEY = 'save.meta.v1025.biodiversity_stewardship' as const;
export const V1025_BIO_LAB_SUITE_ID = 'v1025_biodiversity_stewardship' as const;

export const V1025_BIO_PERSISTENCE_PATHS = {
  root: V1025_BIO_SAVE_META_KEY,
  recoverySnapshots: `${V1025_BIO_SAVE_META_KEY}.recovery_snapshots`,
  conservationOffset: `${V1025_BIO_SAVE_META_KEY}.conservation_offset_graph`,
  regional: `${V1025_BIO_SAVE_META_KEY}.regional_protected_area`,
  history: `${V1025_BIO_SAVE_META_KEY}.history`,
  aiCache: `${V1025_BIO_SAVE_META_KEY}.ai_read_cache`,
} as const;
