import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 172 — SA/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_172_META = {
  id: 'kpi_172',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 170469,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_172_COEF = {
  c0: 94.3000,
  c1: 92.5000,
  c2: 90.7000,
  c3: 88.9000,
  c4: 87.1000,
  c5: 85.3000,
  c6: 83.5000,
  c7: 81.7000,
  c8: 79.9000,
  c9: 78.1000,
  c10: 76.3000,
  c11: 74.5000,
  c12: 72.7000,
  c13: 70.9000,
  c14: 69.1000,
  c15: 67.3000,
  c16: 65.5000,
  c17: 63.7000,
  c18: 61.9000,
  c19: 60.1000,
  c20: 58.3000,
  c21: 56.5000,
  c22: 54.7000,
  c23: 52.9000,
  c24: 51.1000,
  c25: 49.3000,
  c26: 47.5000,
  c27: 45.7000,
  c28: 43.9000,
  c29: 42.1000,
  c30: 40.3000,
  c31: 38.5000,
  c32: 36.7000,
  c33: 34.9000,
  c34: 33.1000,
  c35: 31.3000,
  c36: 29.5000,
  c37: 27.7000,
  c38: 25.9000,
  c39: 24.1000,
  c40: 22.3000,
  c41: 20.5000,
  c42: 18.7000,
  c43: 16.9000,
  c44: 15.1000,
  c45: 13.3000,
  c46: 11.5000,
  c47: 9.7000,
  c48: 7.9000,
  c49: 6.1000,
  c50: 4.3000,
  c51: 2.5000,
  c52: 0.7000,
  c53: 98.6000,
  c54: 96.8000,
  c55: 95.0000,
  c56: 93.2000,
  c57: 91.4000,
  c58: 89.6000,
  c59: 87.8000,
  c60: 86.0000,
  c61: 84.2000,
  c62: 82.4000,
  c63: 80.6000,
  c64: 78.8000,
  c65: 77.0000,
  c66: 75.2000,
  c67: 73.4000,
  c68: 71.6000,
  c69: 69.8000,
  c70: 68.0000,
  c71: 66.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_172_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_172_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_172_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_172_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_172_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_172_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_172_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_172_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_172_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_172_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
