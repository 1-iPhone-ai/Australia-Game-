/**
 * §6 persistence keys — V1031 grid / energy network resilience (O6K-79).
 */
export const V1033_SCRES_SAVE_META_KEY = 'save.meta.v1032.supply_chain_resilience' as const;
export const V1033_SCRES_LAB_SUITE_ID = 'v1033_supply_chain_resilience' as const;

export const V1033_SCRES_PERSISTENCE_PATHS = {
  root: V1033_SCRES_SAVE_META_KEY,
  disruptionSnapshots: `${V1033_SCRES_SAVE_META_KEY}.disruption_snapshots`,
  corridorBuffer: `${V1033_SCRES_SAVE_META_KEY}.corridor_buffer_graph`,
  regional: `${V1033_SCRES_SAVE_META_KEY}.regional_hub_zone`,
  history: `${V1033_SCRES_SAVE_META_KEY}.history`,
  aiCache: `${V1033_SCRES_SAVE_META_KEY}.ai_read_cache`,
} as const;
