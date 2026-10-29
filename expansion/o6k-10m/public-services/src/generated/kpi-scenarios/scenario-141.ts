import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 141 — TAS/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_141_META = {
  id: 'kpi_141',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 139748,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_141_COEF = {
  c0: 50.4000,
  c1: 67.2000,
  c2: 84.0000,
  c3: 1.1000,
  c4: 17.9000,
  c5: 34.7000,
  c6: 51.5000,
  c7: 68.3000,
  c8: 85.1000,
  c9: 2.2000,
  c10: 19.0000,
  c11: 35.8000,
  c12: 52.6000,
  c13: 69.4000,
  c14: 86.2000,
  c15: 3.3000,
  c16: 20.1000,
  c17: 36.9000,
  c18: 53.7000,
  c19: 70.5000,
  c20: 87.3000,
  c21: 4.4000,
  c22: 21.2000,
  c23: 38.0000,
  c24: 54.8000,
  c25: 71.6000,
  c26: 88.4000,
  c27: 5.5000,
  c28: 22.3000,
  c29: 39.1000,
  c30: 55.9000,
  c31: 72.7000,
  c32: 89.5000,
  c33: 6.6000,
  c34: 23.4000,
  c35: 40.2000,
  c36: 57.0000,
  c37: 73.8000,
  c38: 90.6000,
  c39: 7.7000,
  c40: 24.5000,
  c41: 41.3000,
  c42: 58.1000,
  c43: 74.9000,
  c44: 91.7000,
  c45: 8.8000,
  c46: 25.6000,
  c47: 42.4000,
  c48: 59.2000,
  c49: 76.0000,
  c50: 92.8000,
  c51: 9.9000,
  c52: 26.7000,
  c53: 43.5000,
  c54: 60.3000,
  c55: 77.1000,
  c56: 93.9000,
  c57: 11.0000,
  c58: 27.8000,
  c59: 44.6000,
  c60: 61.4000,
  c61: 78.2000,
  c62: 95.0000,
  c63: 12.1000,
  c64: 28.9000,
  c65: 45.7000,
  c66: 62.5000,
  c67: 79.3000,
  c68: 96.1000,
  c69: 13.2000,
  c70: 30.0000,
  c71: 46.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_141_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_141_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_141_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_141_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_141_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_141_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_141_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_141_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_141_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_141_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
