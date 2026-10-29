/**
 * §6 persistence keys — V1022 housing affordability (O6K-49).
 */
export const V1022_HAFF_SAVE_META_KEY = 'save.meta.v1022.housing_affordability' as const;
export const V1022_HAFF_LAB_SUITE_ID = 'v1022_housing_affordability' as const;

export const V1022_HAFF_PERSISTENCE_PATHS = {
  root: V1022_HAFF_SAVE_META_KEY,
  stressSnapshots: `${V1022_HAFF_SAVE_META_KEY}.stress_snapshots`,
  supplyPipeline: `${V1022_HAFF_SAVE_META_KEY}.supply_pipeline_graph`,
  regional: `${V1022_HAFF_SAVE_META_KEY}.regional_zoning_friction`,
  history: `${V1022_HAFF_SAVE_META_KEY}.history`,
  aiCache: `${V1022_HAFF_SAVE_META_KEY}.ai_read_cache`,
} as const;
