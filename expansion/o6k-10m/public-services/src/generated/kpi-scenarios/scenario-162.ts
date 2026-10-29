import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 162 — QLD/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_162_META = {
  id: 'kpi_162',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 160559,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_162_COEF = {
  c0: 12.6000,
  c1: 16.8000,
  c2: 21.0000,
  c3: 25.2000,
  c4: 29.4000,
  c5: 33.6000,
  c6: 37.8000,
  c7: 42.0000,
  c8: 46.2000,
  c9: 50.4000,
  c10: 54.6000,
  c11: 58.8000,
  c12: 63.0000,
  c13: 67.2000,
  c14: 71.4000,
  c15: 75.6000,
  c16: 79.8000,
  c17: 84.0000,
  c18: 88.2000,
  c19: 92.4000,
  c20: 96.6000,
  c21: 1.1000,
  c22: 5.3000,
  c23: 9.5000,
  c24: 13.7000,
  c25: 17.9000,
  c26: 22.1000,
  c27: 26.3000,
  c28: 30.5000,
  c29: 34.7000,
  c30: 38.9000,
  c31: 43.1000,
  c32: 47.3000,
  c33: 51.5000,
  c34: 55.7000,
  c35: 59.9000,
  c36: 64.1000,
  c37: 68.3000,
  c38: 72.5000,
  c39: 76.7000,
  c40: 80.9000,
  c41: 85.1000,
  c42: 89.3000,
  c43: 93.5000,
  c44: 97.7000,
  c45: 2.2000,
  c46: 6.4000,
  c47: 10.6000,
  c48: 14.8000,
  c49: 19.0000,
  c50: 23.2000,
  c51: 27.4000,
  c52: 31.6000,
  c53: 35.8000,
  c54: 40.0000,
  c55: 44.2000,
  c56: 48.4000,
  c57: 52.6000,
  c58: 56.8000,
  c59: 61.0000,
  c60: 65.2000,
  c61: 69.4000,
  c62: 73.6000,
  c63: 77.8000,
  c64: 82.0000,
  c65: 86.2000,
  c66: 90.4000,
  c67: 94.6000,
  c68: 98.8000,
  c69: 3.3000,
  c70: 7.5000,
  c71: 11.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_162_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_162_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_162_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_162_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_162_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_162_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_162_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_162_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_162_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_162_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
