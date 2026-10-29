import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 146 — QLD/education. */
export const V1014_PUBSVC_KPI_SCENARIO_146_META = {
  id: 'kpi_146',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 144703,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_146_COEF = {
  c0: 41.4000,
  c1: 55.2000,
  c2: 69.0000,
  c3: 82.8000,
  c4: 96.6000,
  c5: 10.7000,
  c6: 24.5000,
  c7: 38.3000,
  c8: 52.1000,
  c9: 65.9000,
  c10: 79.7000,
  c11: 93.5000,
  c12: 7.6000,
  c13: 21.4000,
  c14: 35.2000,
  c15: 49.0000,
  c16: 62.8000,
  c17: 76.6000,
  c18: 90.4000,
  c19: 4.5000,
  c20: 18.3000,
  c21: 32.1000,
  c22: 45.9000,
  c23: 59.7000,
  c24: 73.5000,
  c25: 87.3000,
  c26: 1.4000,
  c27: 15.2000,
  c28: 29.0000,
  c29: 42.8000,
  c30: 56.6000,
  c31: 70.4000,
  c32: 84.2000,
  c33: 98.0000,
  c34: 12.1000,
  c35: 25.9000,
  c36: 39.7000,
  c37: 53.5000,
  c38: 67.3000,
  c39: 81.1000,
  c40: 94.9000,
  c41: 9.0000,
  c42: 22.8000,
  c43: 36.6000,
  c44: 50.4000,
  c45: 64.2000,
  c46: 78.0000,
  c47: 91.8000,
  c48: 5.9000,
  c49: 19.7000,
  c50: 33.5000,
  c51: 47.3000,
  c52: 61.1000,
  c53: 74.9000,
  c54: 88.7000,
  c55: 2.8000,
  c56: 16.6000,
  c57: 30.4000,
  c58: 44.2000,
  c59: 58.0000,
  c60: 71.8000,
  c61: 85.6000,
  c62: 99.4000,
  c63: 13.5000,
  c64: 27.3000,
  c65: 41.1000,
  c66: 54.9000,
  c67: 68.7000,
  c68: 82.5000,
  c69: 96.3000,
  c70: 10.4000,
  c71: 24.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_146_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_146_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_146_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_146_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_146_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_146_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_146_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_146_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_146_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_146_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
