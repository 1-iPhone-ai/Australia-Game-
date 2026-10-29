import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 128 — NSW/education. */
export const V1014_PUBSVC_KPI_SCENARIO_128_META = {
  id: 'kpi_128',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 126865,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_128_COEF = {
  c0: 73.8000,
  c1: 98.4000,
  c2: 23.3000,
  c3: 47.9000,
  c4: 72.5000,
  c5: 97.1000,
  c6: 22.0000,
  c7: 46.6000,
  c8: 71.2000,
  c9: 95.8000,
  c10: 20.7000,
  c11: 45.3000,
  c12: 69.9000,
  c13: 94.5000,
  c14: 19.4000,
  c15: 44.0000,
  c16: 68.6000,
  c17: 93.2000,
  c18: 18.1000,
  c19: 42.7000,
  c20: 67.3000,
  c21: 91.9000,
  c22: 16.8000,
  c23: 41.4000,
  c24: 66.0000,
  c25: 90.6000,
  c26: 15.5000,
  c27: 40.1000,
  c28: 64.7000,
  c29: 89.3000,
  c30: 14.2000,
  c31: 38.8000,
  c32: 63.4000,
  c33: 88.0000,
  c34: 12.9000,
  c35: 37.5000,
  c36: 62.1000,
  c37: 86.7000,
  c38: 11.6000,
  c39: 36.2000,
  c40: 60.8000,
  c41: 85.4000,
  c42: 10.3000,
  c43: 34.9000,
  c44: 59.5000,
  c45: 84.1000,
  c46: 9.0000,
  c47: 33.6000,
  c48: 58.2000,
  c49: 82.8000,
  c50: 7.7000,
  c51: 32.3000,
  c52: 56.9000,
  c53: 81.5000,
  c54: 6.4000,
  c55: 31.0000,
  c56: 55.6000,
  c57: 80.2000,
  c58: 5.1000,
  c59: 29.7000,
  c60: 54.3000,
  c61: 78.9000,
  c62: 3.8000,
  c63: 28.4000,
  c64: 53.0000,
  c65: 77.6000,
  c66: 2.5000,
  c67: 27.1000,
  c68: 51.7000,
  c69: 76.3000,
  c70: 1.2000,
  c71: 25.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_128_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_128_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_128_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_128_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_128_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_128_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_128_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_128_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_128_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_128_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
