import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 032 — NSW/education. */
export const V1014_PUBSVC_KPI_SCENARIO_032_META = {
  id: 'kpi_032',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 31729,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_032_COEF = {
  c0: 47.2000,
  c1: 29.7000,
  c2: 12.2000,
  c3: 94.4000,
  c4: 76.9000,
  c5: 59.4000,
  c6: 41.9000,
  c7: 24.4000,
  c8: 6.9000,
  c9: 89.1000,
  c10: 71.6000,
  c11: 54.1000,
  c12: 36.6000,
  c13: 19.1000,
  c14: 1.6000,
  c15: 83.8000,
  c16: 66.3000,
  c17: 48.8000,
  c18: 31.3000,
  c19: 13.8000,
  c20: 96.0000,
  c21: 78.5000,
  c22: 61.0000,
  c23: 43.5000,
  c24: 26.0000,
  c25: 8.5000,
  c26: 90.7000,
  c27: 73.2000,
  c28: 55.7000,
  c29: 38.2000,
  c30: 20.7000,
  c31: 3.2000,
  c32: 85.4000,
  c33: 67.9000,
  c34: 50.4000,
  c35: 32.9000,
  c36: 15.4000,
  c37: 97.6000,
  c38: 80.1000,
  c39: 62.6000,
  c40: 45.1000,
  c41: 27.6000,
  c42: 10.1000,
  c43: 92.3000,
  c44: 74.8000,
  c45: 57.3000,
  c46: 39.8000,
  c47: 22.3000,
  c48: 4.8000,
  c49: 87.0000,
  c50: 69.5000,
  c51: 52.0000,
  c52: 34.5000,
  c53: 17.0000,
  c54: 99.2000,
  c55: 81.7000,
  c56: 64.2000,
  c57: 46.7000,
  c58: 29.2000,
  c59: 11.7000,
  c60: 93.9000,
  c61: 76.4000,
  c62: 58.9000,
  c63: 41.4000,
  c64: 23.9000,
  c65: 6.4000,
  c66: 88.6000,
  c67: 71.1000,
  c68: 53.6000,
  c69: 36.1000,
  c70: 18.6000,
  c71: 1.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_032_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_032_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_032_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_032_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_032_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_032_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_032_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_032_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_032_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_032_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
