/**
 * §6 persistence keys — V1018 fiscal federalism (O6K-37).
 */
export const V1018_FFED_SAVE_META_KEY = 'save.meta.v1018.fiscal_federalism' as const;
export const V1018_FFED_LAB_SUITE_ID = 'v1018_fiscal_federalism' as const;

export const V1018_FFED_PERSISTENCE_PATHS = {
  root: V1018_FFED_SAVE_META_KEY,
  transfers: `${V1018_FFED_SAVE_META_KEY}.supply_transfers`,
  grantStack: `${V1018_FFED_SAVE_META_KEY}.grantStack_graph`,
  regional: `${V1018_FFED_SAVE_META_KEY}.regional_audit_trail`,
  history: `${V1018_FFED_SAVE_META_KEY}.history`,
  aiCache: `${V1018_FFED_SAVE_META_KEY}.ai_read_cache`,
} as const;
