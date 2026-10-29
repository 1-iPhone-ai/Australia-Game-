import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 108 — SA/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_108_META = {
  id: 'kpi_108',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 107045,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_108_COEF = {
  c0: 10.1000,
  c1: 46.7000,
  c2: 83.3000,
  c3: 20.2000,
  c4: 56.8000,
  c5: 93.4000,
  c6: 30.3000,
  c7: 66.9000,
  c8: 3.8000,
  c9: 40.4000,
  c10: 77.0000,
  c11: 13.9000,
  c12: 50.5000,
  c13: 87.1000,
  c14: 24.0000,
  c15: 60.6000,
  c16: 97.2000,
  c17: 34.1000,
  c18: 70.7000,
  c19: 7.6000,
  c20: 44.2000,
  c21: 80.8000,
  c22: 17.7000,
  c23: 54.3000,
  c24: 90.9000,
  c25: 27.8000,
  c26: 64.4000,
  c27: 1.3000,
  c28: 37.9000,
  c29: 74.5000,
  c30: 11.4000,
  c31: 48.0000,
  c32: 84.6000,
  c33: 21.5000,
  c34: 58.1000,
  c35: 94.7000,
  c36: 31.6000,
  c37: 68.2000,
  c38: 5.1000,
  c39: 41.7000,
  c40: 78.3000,
  c41: 15.2000,
  c42: 51.8000,
  c43: 88.4000,
  c44: 25.3000,
  c45: 61.9000,
  c46: 98.5000,
  c47: 35.4000,
  c48: 72.0000,
  c49: 8.9000,
  c50: 45.5000,
  c51: 82.1000,
  c52: 19.0000,
  c53: 55.6000,
  c54: 92.2000,
  c55: 29.1000,
  c56: 65.7000,
  c57: 2.6000,
  c58: 39.2000,
  c59: 75.8000,
  c60: 12.7000,
  c61: 49.3000,
  c62: 85.9000,
  c63: 22.8000,
  c64: 59.4000,
  c65: 96.0000,
  c66: 32.9000,
  c67: 69.5000,
  c68: 6.4000,
  c69: 43.0000,
  c70: 79.6000,
  c71: 16.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_108_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_108_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_108_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_108_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_108_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_108_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_108_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_108_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_108_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_108_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
