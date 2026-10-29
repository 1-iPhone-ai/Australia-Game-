/**
 * §6 persistence keys — V1014 workforce migration v2 (O6K-25).
 */
export const V1014_WORKFORCE_SAVE_META_KEY = 'save.meta.v1014.workforce_v2' as const;
export const V1014_WORKFORCE_LAB_SUITE_ID = 'v1014_workforce_v2' as const;

export const V1014_WORKFORCE_PERSISTENCE_PATHS = {
  root: V1014_WORKFORCE_SAVE_META_KEY,
  migration: `${V1014_WORKFORCE_SAVE_META_KEY}.migration`,
  skillsGraph: `${V1014_WORKFORCE_SAVE_META_KEY}.skills_graph`,
  regional: `${V1014_WORKFORCE_SAVE_META_KEY}.regional`,
  history: `${V1014_WORKFORCE_SAVE_META_KEY}.history`,
  aiCache: `${V1014_WORKFORCE_SAVE_META_KEY}.ai_read_cache`,
} as const;
