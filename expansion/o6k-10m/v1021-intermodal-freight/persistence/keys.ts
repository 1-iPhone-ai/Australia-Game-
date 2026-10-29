/**
 * §6 persistence keys — V1021 intermodal freight (O6K-45).
 */
export const V1021_IMFD_SAVE_META_KEY = 'save.meta.v1021.intermodal_freight' as const;
export const V1021_IMFD_LAB_SUITE_ID = 'v1021_intermodal_freight' as const;

export const V1021_IMFD_PERSISTENCE_PATHS = {
  root: V1021_IMFD_SAVE_META_KEY,
  corridorSnapshots: `${V1021_IMFD_SAVE_META_KEY}.corridor_snapshots`,
  handoffStack: `${V1021_IMFD_SAVE_META_KEY}.handoff_stack_graph`,
  regional: `${V1021_IMFD_SAVE_META_KEY}.regional_dwell_hub`,
  history: `${V1021_IMFD_SAVE_META_KEY}.history`,
  aiCache: `${V1021_IMFD_SAVE_META_KEY}.ai_read_cache`,
} as const;
