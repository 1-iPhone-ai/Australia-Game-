import {
  V1014_TRADE_DEPTH_SCHEMA_VERSION,
  type V1014TradeDepthPersisted,
} from '../types/core';
import { clampTradeDepth } from '../engine/trade-depth-utils';

export function createEmptyV1014TradeDepthPersisted(): V1014TradeDepthPersisted {
  return {
    schemaVersion: V1014_TRADE_DEPTH_SCHEMA_VERSION,
    revision: 1,
    lastProcessedTurn: null,
    bilateralSnapshots: {},
    tariffRungs: {},
    activePackages: [],
    capitalRegimes: {},
    aiReadCache: {},
  };
}

export function sanitizeV1014TradeDepthPersisted(
  raw: unknown,
  turn: number,
): V1014TradeDepthPersisted {
  const base = createEmptyV1014TradeDepthPersisted();
  if (!raw || typeof raw !== 'object') return { ...base, lastProcessedTurn: turn };
  const r = raw as Partial<V1014TradeDepthPersisted>;
  return {
    schemaVersion: V1014_TRADE_DEPTH_SCHEMA_VERSION,
    revision: clampTradeDepth(typeof r.revision === 'number' ? r.revision : 1, 1, 9999),
    lastProcessedTurn: typeof r.lastProcessedTurn === 'number' ? r.lastProcessedTurn : turn,
    bilateralSnapshots:
      r.bilateralSnapshots && typeof r.bilateralSnapshots === 'object' ? { ...r.bilateralSnapshots } : {},
    tariffRungs: r.tariffRungs && typeof r.tariffRungs === 'object' ? { ...r.tariffRungs } : {},
    activePackages: Array.isArray(r.activePackages) ? r.activePackages.filter(x => typeof x === 'string') : [],
    capitalRegimes:
      r.capitalRegimes && typeof r.capitalRegimes === 'object'
        ? { ...(r.capitalRegimes as V1014TradeDepthPersisted['capitalRegimes']) }
        : {},
    aiReadCache: r.aiReadCache && typeof r.aiReadCache === 'object' ? { ...r.aiReadCache } : {},
  };
}

export function migrateV1014TradeDepthPersisted(
  raw: unknown,
  turn: number,
): V1014TradeDepthPersisted {
  return sanitizeV1014TradeDepthPersisted(raw, turn);
}
