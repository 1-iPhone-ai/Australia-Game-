import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type MemoryRealmInflationPersistenceLatchBand = 'subdued' | 'building' | 'latched' | 'realm_rupture';

export interface MemoryRealmInflationPersistenceLatchAssessment {
  latchBand: MemoryRealmInflationPersistenceLatchBand;
  persistenceIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Memory realm inflation persistence latch (Agent 19, round 42). */
export function assessMemoryRealmInflationPersistenceLatch(input: {
  recalledInflationRegimeConfidence: number;
  narrativeDriftTowardHigherInflation: boolean;
  wave42MemoryRecallLatch: boolean;
  realmPersistenceGateBand: 'anchored' | 'slipping' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): MemoryRealmInflationPersistenceLatchAssessment {
  let pressure = 0;
  if (input.narrativeDriftTowardHigherInflation) pressure += 0.18;
  pressure += finClamp(input.recalledInflationRegimeConfidence, 0, 1) * 0.2;
  if (input.wave42MemoryRecallLatch) pressure += 0.14;
  if (input.realmPersistenceGateBand === 'ruptured') pressure += 0.23;
  else if (input.realmPersistenceGateBand === 'slipping') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const persistenceIndex = finRound(100 + pressure * 16, 1);

  let latchBand: MemoryRealmInflationPersistenceLatchBand = 'subdued';
  if (pressure >= 0.58) latchBand = 'realm_rupture';
  else if (pressure >= 0.38) latchBand = 'latched';
  else if (pressure >= 0.17) latchBand = 'building';

  const inflationScoreNudge =
    latchBand === 'realm_rupture'
      ? 0.093
      : latchBand === 'latched'
        ? 0.059
        : latchBand === 'building'
          ? 0.028
          : 0;

  const narrative =
    latchBand === 'realm_rupture' || latchBand === 'latched'
      ? 'Memory realm persistence latch elevating CPI recall metadata.'
      : latchBand === 'building'
        ? 'Realm recall latch building under narrative drift.'
        : 'Memory realm persistence latch subdued versus headline CPI.';

  return { latchBand, persistenceIndex, inflationScoreNudge, narrative };
}

export function memoryRealmInflationPersistenceLatchScoreAdjustment(
  band: MemoryRealmInflationPersistenceLatchBand,
): number {
  if (band === 'realm_rupture') return 4;
  if (band === 'latched') return 3;
  if (band === 'building') return 2;
  return 0;
}
