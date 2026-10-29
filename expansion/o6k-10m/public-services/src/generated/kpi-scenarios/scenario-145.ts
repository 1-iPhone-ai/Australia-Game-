import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 145 — VIC/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_145_META = {
  id: 'kpi_145',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 143712,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_145_COEF = {
  c0: 43.2000,
  c1: 57.6000,
  c2: 72.0000,
  c3: 86.4000,
  c4: 1.1000,
  c5: 15.5000,
  c6: 29.9000,
  c7: 44.3000,
  c8: 58.7000,
  c9: 73.1000,
  c10: 87.5000,
  c11: 2.2000,
  c12: 16.6000,
  c13: 31.0000,
  c14: 45.4000,
  c15: 59.8000,
  c16: 74.2000,
  c17: 88.6000,
  c18: 3.3000,
  c19: 17.7000,
  c20: 32.1000,
  c21: 46.5000,
  c22: 60.9000,
  c23: 75.3000,
  c24: 89.7000,
  c25: 4.4000,
  c26: 18.8000,
  c27: 33.2000,
  c28: 47.6000,
  c29: 62.0000,
  c30: 76.4000,
  c31: 90.8000,
  c32: 5.5000,
  c33: 19.9000,
  c34: 34.3000,
  c35: 48.7000,
  c36: 63.1000,
  c37: 77.5000,
  c38: 91.9000,
  c39: 6.6000,
  c40: 21.0000,
  c41: 35.4000,
  c42: 49.8000,
  c43: 64.2000,
  c44: 78.6000,
  c45: 93.0000,
  c46: 7.7000,
  c47: 22.1000,
  c48: 36.5000,
  c49: 50.9000,
  c50: 65.3000,
  c51: 79.7000,
  c52: 94.1000,
  c53: 8.8000,
  c54: 23.2000,
  c55: 37.6000,
  c56: 52.0000,
  c57: 66.4000,
  c58: 80.8000,
  c59: 95.2000,
  c60: 9.9000,
  c61: 24.3000,
  c62: 38.7000,
  c63: 53.1000,
  c64: 67.5000,
  c65: 81.9000,
  c66: 96.3000,
  c67: 11.0000,
  c68: 25.4000,
  c69: 39.8000,
  c70: 54.2000,
  c71: 68.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_145_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_145_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_145_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_145_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_145_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_145_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_145_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_145_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_145_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_145_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
