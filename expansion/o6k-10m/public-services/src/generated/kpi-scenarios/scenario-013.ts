import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 013 — TAS/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_013_META = {
  id: 'kpi_013',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 12900,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_013_COEF = {
  c0: 81.4000,
  c1: 75.3000,
  c2: 69.2000,
  c3: 63.1000,
  c4: 57.0000,
  c5: 50.9000,
  c6: 44.8000,
  c7: 38.7000,
  c8: 32.6000,
  c9: 26.5000,
  c10: 20.4000,
  c11: 14.3000,
  c12: 8.2000,
  c13: 2.1000,
  c14: 95.7000,
  c15: 89.6000,
  c16: 83.5000,
  c17: 77.4000,
  c18: 71.3000,
  c19: 65.2000,
  c20: 59.1000,
  c21: 53.0000,
  c22: 46.9000,
  c23: 40.8000,
  c24: 34.7000,
  c25: 28.6000,
  c26: 22.5000,
  c27: 16.4000,
  c28: 10.3000,
  c29: 4.2000,
  c30: 97.8000,
  c31: 91.7000,
  c32: 85.6000,
  c33: 79.5000,
  c34: 73.4000,
  c35: 67.3000,
  c36: 61.2000,
  c37: 55.1000,
  c38: 49.0000,
  c39: 42.9000,
  c40: 36.8000,
  c41: 30.7000,
  c42: 24.6000,
  c43: 18.5000,
  c44: 12.4000,
  c45: 6.3000,
  c46: 0.2000,
  c47: 93.8000,
  c48: 87.7000,
  c49: 81.6000,
  c50: 75.5000,
  c51: 69.4000,
  c52: 63.3000,
  c53: 57.2000,
  c54: 51.1000,
  c55: 45.0000,
  c56: 38.9000,
  c57: 32.8000,
  c58: 26.7000,
  c59: 20.6000,
  c60: 14.5000,
  c61: 8.4000,
  c62: 2.3000,
  c63: 95.9000,
  c64: 89.8000,
  c65: 83.7000,
  c66: 77.6000,
  c67: 71.5000,
  c68: 65.4000,
  c69: 59.3000,
  c70: 53.2000,
  c71: 47.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_013_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_013_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_013_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_013_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_013_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_013_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_013_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_013_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_013_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_013_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
