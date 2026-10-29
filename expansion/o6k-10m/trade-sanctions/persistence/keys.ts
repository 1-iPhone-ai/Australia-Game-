/**
 * §6 persistence keys for V1014_TRADE_DEPTH (Agent 25 merge).
 */
export const V1014_TRADE_DEPTH_SAVE_META_KEY = 'save.meta.v1014.trade_depth' as const;
export const V1014_TRADE_DEPTH_LAB_SUITE_ID = 'v1014_trade_depth' as const;

export const V1014_TRADE_DEPTH_PERSISTENCE_PATHS = {
  root: V1014_TRADE_DEPTH_SAVE_META_KEY,
  bilateral: `${V1014_TRADE_DEPTH_SAVE_META_KEY}.bilateral`,
  tariffs: `${V1014_TRADE_DEPTH_SAVE_META_KEY}.tariffs`,
  sanctions: `${V1014_TRADE_DEPTH_SAVE_META_KEY}.sanctions`,
  capital: `${V1014_TRADE_DEPTH_SAVE_META_KEY}.capital`,
  aiCache: `${V1014_TRADE_DEPTH_SAVE_META_KEY}.ai_read_cache`,
} as const;
