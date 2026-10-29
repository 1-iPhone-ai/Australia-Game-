/**
 * §6 persistence keys — V1031 grid / energy network resilience (O6K-86).
 */
export const V1036_IIRES_SAVE_META_KEY = 'save.meta.v1034.information_integrity_resilience' as const;
export const V1036_IIRES_LAB_SUITE_ID = 'v1036_information_integrity_resilience' as const;

export const V1036_IIRES_PERSISTENCE_PATHS = {
  root: V1036_IIRES_SAVE_META_KEY,
  attestationSnapshots: `${V1036_IIRES_SAVE_META_KEY}.attestation_snapshots`,
  attestationMesh: `${V1036_IIRES_SAVE_META_KEY}.attestation_mesh_graph`,
  regional: `${V1036_IIRES_SAVE_META_KEY}.regional_facility_zone`,
  history: `${V1036_IIRES_SAVE_META_KEY}.history`,
  aiCache: `${V1036_IIRES_SAVE_META_KEY}.ai_read_cache`,
} as const;
