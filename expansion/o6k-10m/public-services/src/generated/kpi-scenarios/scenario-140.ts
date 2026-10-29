import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 140 — SA/education. */
export const V1014_PUBSVC_KPI_SCENARIO_140_META = {
  id: 'kpi_140',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 138757,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_140_COEF = {
  c0: 52.2000,
  c1: 69.6000,
  c2: 87.0000,
  c3: 4.7000,
  c4: 22.1000,
  c5: 39.5000,
  c6: 56.9000,
  c7: 74.3000,
  c8: 91.7000,
  c9: 9.4000,
  c10: 26.8000,
  c11: 44.2000,
  c12: 61.6000,
  c13: 79.0000,
  c14: 96.4000,
  c15: 14.1000,
  c16: 31.5000,
  c17: 48.9000,
  c18: 66.3000,
  c19: 83.7000,
  c20: 1.4000,
  c21: 18.8000,
  c22: 36.2000,
  c23: 53.6000,
  c24: 71.0000,
  c25: 88.4000,
  c26: 6.1000,
  c27: 23.5000,
  c28: 40.9000,
  c29: 58.3000,
  c30: 75.7000,
  c31: 93.1000,
  c32: 10.8000,
  c33: 28.2000,
  c34: 45.6000,
  c35: 63.0000,
  c36: 80.4000,
  c37: 97.8000,
  c38: 15.5000,
  c39: 32.9000,
  c40: 50.3000,
  c41: 67.7000,
  c42: 85.1000,
  c43: 2.8000,
  c44: 20.2000,
  c45: 37.6000,
  c46: 55.0000,
  c47: 72.4000,
  c48: 89.8000,
  c49: 7.5000,
  c50: 24.9000,
  c51: 42.3000,
  c52: 59.7000,
  c53: 77.1000,
  c54: 94.5000,
  c55: 12.2000,
  c56: 29.6000,
  c57: 47.0000,
  c58: 64.4000,
  c59: 81.8000,
  c60: 99.2000,
  c61: 16.9000,
  c62: 34.3000,
  c63: 51.7000,
  c64: 69.1000,
  c65: 86.5000,
  c66: 4.2000,
  c67: 21.6000,
  c68: 39.0000,
  c69: 56.4000,
  c70: 73.8000,
  c71: 91.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_140_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_140_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_140_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_140_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_140_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_140_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_140_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_140_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_140_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_140_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
