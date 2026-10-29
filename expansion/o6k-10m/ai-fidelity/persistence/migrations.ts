import {
  V1014_AI_FIDELITY_SCHEMA_VERSION,
  type V1014AiFidelityPersisted,
} from '../types/core';
import { clampAiFidelity } from '../engine/ai-fidelity-utils';

export function createEmptyV1014AiFidelityPersisted(): V1014AiFidelityPersisted {
  return {
    schemaVersion: V1014_AI_FIDELITY_SCHEMA_VERSION,
    revision: 1,
    lastProcessedTurn: null,
    loopSnapshots: {},
    verifyPassRate: 0.85,
    routeHashes: {},
    advisoryEscalations: [],
    uiUnlockFlags: {},
    explainabilityCache: {},
  };
}

export function sanitizeV1014AiFidelityPersisted(raw: unknown, turn: number): V1014AiFidelityPersisted {
  const base = createEmptyV1014AiFidelityPersisted();
  if (!raw || typeof raw !== 'object') return { ...base, lastProcessedTurn: turn };
  const r = raw as Partial<V1014AiFidelityPersisted>;
  return {
    schemaVersion: V1014_AI_FIDELITY_SCHEMA_VERSION,
    revision: clampAiFidelity(typeof r.revision === 'number' ? r.revision : 1, 1, 9999),
    lastProcessedTurn: typeof r.lastProcessedTurn === 'number' ? r.lastProcessedTurn : turn,
    loopSnapshots:
      r.loopSnapshots && typeof r.loopSnapshots === 'object' ? { ...r.loopSnapshots } : {},
    verifyPassRate: clampAiFidelity(typeof r.verifyPassRate === 'number' ? r.verifyPassRate : 0.85, 0, 1),
    routeHashes: r.routeHashes && typeof r.routeHashes === 'object' ? { ...r.routeHashes } : {},
    advisoryEscalations: Array.isArray(r.advisoryEscalations)
      ? r.advisoryEscalations.filter(x => typeof x === 'string')
      : [],
    uiUnlockFlags: r.uiUnlockFlags && typeof r.uiUnlockFlags === 'object' ? { ...r.uiUnlockFlags } : {},
    explainabilityCache:
      r.explainabilityCache && typeof r.explainabilityCache === 'object' ? { ...r.explainabilityCache } : {},
  };
}

export function migrateV1014AiFidelityPersisted(raw: unknown, turn: number): V1014AiFidelityPersisted {
  return sanitizeV1014AiFidelityPersisted(raw, turn);
}
