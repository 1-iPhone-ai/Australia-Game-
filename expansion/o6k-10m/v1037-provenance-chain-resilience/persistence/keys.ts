/**
 * §6 persistence keys — V1031 grid / energy network resilience (O6K-88).
 */
export const V1037_PCRS_SAVE_META_KEY = 'save.meta.v1034.provenance_chain_resilience' as const;
export const V1037_PCRS_LAB_SUITE_ID = 'v1037_provenance_chain_resilience' as const;

export const V1037_PCRS_PERSISTENCE_PATHS = {
  root: V1037_PCRS_SAVE_META_KEY,
  custodySnapshots: `${V1037_PCRS_SAVE_META_KEY}.custody_snapshots`,
  custodyChainMesh: `${V1037_PCRS_SAVE_META_KEY}.custody_chain_mesh_graph`,
  regional: `${V1037_PCRS_SAVE_META_KEY}.regional_facility_zone`,
  history: `${V1037_PCRS_SAVE_META_KEY}.history`,
  aiCache: `${V1037_PCRS_SAVE_META_KEY}.ai_read_cache`,
} as const;
