import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 127 — ACT/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_127_META = {
  id: 'kpi_127',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 125874,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_127_COEF = {
  c0: 75.6000,
  c1: 1.1000,
  c2: 26.3000,
  c3: 51.5000,
  c4: 76.7000,
  c5: 2.2000,
  c6: 27.4000,
  c7: 52.6000,
  c8: 77.8000,
  c9: 3.3000,
  c10: 28.5000,
  c11: 53.7000,
  c12: 78.9000,
  c13: 4.4000,
  c14: 29.6000,
  c15: 54.8000,
  c16: 80.0000,
  c17: 5.5000,
  c18: 30.7000,
  c19: 55.9000,
  c20: 81.1000,
  c21: 6.6000,
  c22: 31.8000,
  c23: 57.0000,
  c24: 82.2000,
  c25: 7.7000,
  c26: 32.9000,
  c27: 58.1000,
  c28: 83.3000,
  c29: 8.8000,
  c30: 34.0000,
  c31: 59.2000,
  c32: 84.4000,
  c33: 9.9000,
  c34: 35.1000,
  c35: 60.3000,
  c36: 85.5000,
  c37: 11.0000,
  c38: 36.2000,
  c39: 61.4000,
  c40: 86.6000,
  c41: 12.1000,
  c42: 37.3000,
  c43: 62.5000,
  c44: 87.7000,
  c45: 13.2000,
  c46: 38.4000,
  c47: 63.6000,
  c48: 88.8000,
  c49: 14.3000,
  c50: 39.5000,
  c51: 64.7000,
  c52: 89.9000,
  c53: 15.4000,
  c54: 40.6000,
  c55: 65.8000,
  c56: 91.0000,
  c57: 16.5000,
  c58: 41.7000,
  c59: 66.9000,
  c60: 92.1000,
  c61: 17.6000,
  c62: 42.8000,
  c63: 68.0000,
  c64: 93.2000,
  c65: 18.7000,
  c66: 43.9000,
  c67: 69.1000,
  c68: 94.3000,
  c69: 19.8000,
  c70: 45.0000,
  c71: 70.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_127_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_127_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_127_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_127_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_127_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_127_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_127_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_127_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_127_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_127_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
