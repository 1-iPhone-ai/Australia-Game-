import type { V1014EnergyDepthPersisted, V1014EnergyDepthGridBand } from './types';
import { V1014_ENERGY_DEPTH_SCHEMA_VERSION } from './types';

export function createInitialV1014EnergyDepthPersisted(): V1014EnergyDepthPersisted {
  return {
    schemaVersion: V1014_ENERGY_DEPTH_SCHEMA_VERSION,
    revision: 0,
    initializedTurn: null,
    lastInputHash: '',
    cumulativeExtractionBySite: {},
    cumulativeEmissionsMt: 0,
    gridHysteresis: {},
    carbonPathwayId: 'v1014_depth_carbon_national_default',
    history: [],
  };
}

export function sanitizeV1014EnergyDepthPersisted(raw: unknown, turn = 1): V1014EnergyDepthPersisted {
  const base = createInitialV1014EnergyDepthPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  if (r.schemaVersion !== V1014_ENERGY_DEPTH_SCHEMA_VERSION) {
    return { ...base, initializedTurn: typeof r.initializedTurn === 'number' ? r.initializedTurn : turn };
  }
  return {
    schemaVersion: V1014_ENERGY_DEPTH_SCHEMA_VERSION,
    revision: Number(r.revision) || 0,
    initializedTurn: typeof r.initializedTurn === 'number' ? r.initializedTurn : null,
    lastInputHash: String(r.lastInputHash || ''),
    cumulativeExtractionBySite:
      typeof r.cumulativeExtractionBySite === 'object' && r.cumulativeExtractionBySite
        ? (r.cumulativeExtractionBySite as Record<string, number>)
        : {},
    cumulativeEmissionsMt: Number(r.cumulativeEmissionsMt) || 0,
    gridHysteresis:
      typeof r.gridHysteresis === 'object' && r.gridHysteresis
        ? (r.gridHysteresis as V1014EnergyDepthPersisted['gridHysteresis'])
        : {},
    carbonPathwayId: String(r.carbonPathwayId || base.carbonPathwayId),
    history: Array.isArray(r.history) ? r.history.slice(-24) : [],
  };
}

export function V1014_ENERGY_DEPTH_persistSlice(
  persisted: V1014EnergyDepthPersisted,
  turn: number,
  inputHash: string,
  nationalGridBand: V1014EnergyDepthGridBand,
): V1014EnergyDepthPersisted {
  return {
    ...persisted,
    revision: persisted.revision + 1,
    initializedTurn: persisted.initializedTurn ?? turn,
    lastInputHash: inputHash,
    history: [...persisted.history, { turn, nationalGridBand, hash: inputHash }].slice(-24),
  };
}
