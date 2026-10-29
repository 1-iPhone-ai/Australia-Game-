import {
  V1014_SCENARIO_V2_SCHEMA_VERSION,
  type V1014ScenarioV2Persisted,
} from './v1014-scenario-v2-types';

export const V1014_SCENARIO_V2_SAVE_KEY = 'v1014_scenario_v2_state' as const;
export const V1014_SCENARIO_V2_LEGACY_KEYS = ['v94_scenario_mission_state', 'scenario_objective_v1'] as const;

export type V1014ScenarioV2MigrationResult =
  | { ok: true; persisted: V1014ScenarioV2Persisted; from: string }
  | { ok: false; reason: string };

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export function migrateV1014ScenarioV2Persisted(raw: unknown): V1014ScenarioV2MigrationResult {
  if (!isRecord(raw)) return { ok: false, reason: 'not_object' };
  const ver = raw.schemaVersion;
  if (ver === V1014_SCENARIO_V2_SCHEMA_VERSION) {
    return { ok: true, from: 'native', persisted: raw as V1014ScenarioV2Persisted };
  }
  if (ver === '10.14.0-scenario-v1' || ver === 'v94_scenario_missions') {
    const migrated: V1014ScenarioV2Persisted = {
      schemaVersion: V1014_SCENARIO_V2_SCHEMA_VERSION,
      revision: typeof raw.revision === 'number' ? raw.revision + 1 : 1,
      activeScenarioId: typeof raw.activeScenarioId === 'string' ? raw.activeScenarioId : null,
      missionGraphId: typeof raw.missionGraphId === 'string' ? raw.missionGraphId : null,
      nodeStates: isRecord(raw.nodeStates) ? (raw.nodeStates as V1014ScenarioV2Persisted['nodeStates']) : {},
      completedGateIds: Array.isArray(raw.completedGateIds) ? raw.completedGateIds.filter(x => typeof x === 'string') : [],
      replaySeed: typeof raw.replaySeed === 'number' ? raw.replaySeed : 0,
      inputHash: typeof raw.inputHash === 'string' ? raw.inputHash : '',
      history: Array.isArray(raw.history)
        ? raw.history.filter(h => isRecord(h) && typeof h.turn === 'number').map(h => ({
            turn: h.turn as number,
            note: String(h.note ?? 'migrated'),
            nodeId: String(h.nodeId ?? 'unknown'),
          }))
        : [],
    };
    return { ok: true, from: String(ver), persisted: migrated };
  }
  return { ok: false, reason: `unsupported_schema:${String(ver)}` };
}

export function serializeV1014ScenarioV2Persisted(p: V1014ScenarioV2Persisted): string {
  return JSON.stringify(p);
}

export function parseV1014ScenarioV2Persisted(json: string): V1014ScenarioV2MigrationResult {
  try {
    return migrateV1014ScenarioV2Persisted(JSON.parse(json));
  } catch {
    return { ok: false, reason: 'invalid_json' };
  }
}
