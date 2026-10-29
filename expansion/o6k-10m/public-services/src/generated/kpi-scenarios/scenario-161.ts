import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 161 — VIC/education. */
export const V1014_PUBSVC_KPI_SCENARIO_161_META = {
  id: 'kpi_161',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 159568,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_161_COEF = {
  c0: 14.4000,
  c1: 19.2000,
  c2: 24.0000,
  c3: 28.8000,
  c4: 33.6000,
  c5: 38.4000,
  c6: 43.2000,
  c7: 48.0000,
  c8: 52.8000,
  c9: 57.6000,
  c10: 62.4000,
  c11: 67.2000,
  c12: 72.0000,
  c13: 76.8000,
  c14: 81.6000,
  c15: 86.4000,
  c16: 91.2000,
  c17: 96.0000,
  c18: 1.1000,
  c19: 5.9000,
  c20: 10.7000,
  c21: 15.5000,
  c22: 20.3000,
  c23: 25.1000,
  c24: 29.9000,
  c25: 34.7000,
  c26: 39.5000,
  c27: 44.3000,
  c28: 49.1000,
  c29: 53.9000,
  c30: 58.7000,
  c31: 63.5000,
  c32: 68.3000,
  c33: 73.1000,
  c34: 77.9000,
  c35: 82.7000,
  c36: 87.5000,
  c37: 92.3000,
  c38: 97.1000,
  c39: 2.2000,
  c40: 7.0000,
  c41: 11.8000,
  c42: 16.6000,
  c43: 21.4000,
  c44: 26.2000,
  c45: 31.0000,
  c46: 35.8000,
  c47: 40.6000,
  c48: 45.4000,
  c49: 50.2000,
  c50: 55.0000,
  c51: 59.8000,
  c52: 64.6000,
  c53: 69.4000,
  c54: 74.2000,
  c55: 79.0000,
  c56: 83.8000,
  c57: 88.6000,
  c58: 93.4000,
  c59: 98.2000,
  c60: 3.3000,
  c61: 8.1000,
  c62: 12.9000,
  c63: 17.7000,
  c64: 22.5000,
  c65: 27.3000,
  c66: 32.1000,
  c67: 36.9000,
  c68: 41.7000,
  c69: 46.5000,
  c70: 51.3000,
  c71: 56.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_161_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_161_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_161_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_161_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_161_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_161_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_161_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_161_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_161_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_161_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
