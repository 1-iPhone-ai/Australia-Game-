import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 005 — TAS/education. */
export const V1014_PUBSVC_KPI_SCENARIO_005_META = {
  id: 'kpi_005',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 4972,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_005_COEF = {
  c0: 95.8000,
  c1: 94.5000,
  c2: 93.2000,
  c3: 91.9000,
  c4: 90.6000,
  c5: 89.3000,
  c6: 88.0000,
  c7: 86.7000,
  c8: 85.4000,
  c9: 84.1000,
  c10: 82.8000,
  c11: 81.5000,
  c12: 80.2000,
  c13: 78.9000,
  c14: 77.6000,
  c15: 76.3000,
  c16: 75.0000,
  c17: 73.7000,
  c18: 72.4000,
  c19: 71.1000,
  c20: 69.8000,
  c21: 68.5000,
  c22: 67.2000,
  c23: 65.9000,
  c24: 64.6000,
  c25: 63.3000,
  c26: 62.0000,
  c27: 60.7000,
  c28: 59.4000,
  c29: 58.1000,
  c30: 56.8000,
  c31: 55.5000,
  c32: 54.2000,
  c33: 52.9000,
  c34: 51.6000,
  c35: 50.3000,
  c36: 49.0000,
  c37: 47.7000,
  c38: 46.4000,
  c39: 45.1000,
  c40: 43.8000,
  c41: 42.5000,
  c42: 41.2000,
  c43: 39.9000,
  c44: 38.6000,
  c45: 37.3000,
  c46: 36.0000,
  c47: 34.7000,
  c48: 33.4000,
  c49: 32.1000,
  c50: 30.8000,
  c51: 29.5000,
  c52: 28.2000,
  c53: 26.9000,
  c54: 25.6000,
  c55: 24.3000,
  c56: 23.0000,
  c57: 21.7000,
  c58: 20.4000,
  c59: 19.1000,
  c60: 17.8000,
  c61: 16.5000,
  c62: 15.2000,
  c63: 13.9000,
  c64: 12.6000,
  c65: 11.3000,
  c66: 10.0000,
  c67: 8.7000,
  c68: 7.4000,
  c69: 6.1000,
  c70: 4.8000,
  c71: 3.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_005_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_005_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_005_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_005_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_005_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_005_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_005_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_005_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_005_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_005_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
