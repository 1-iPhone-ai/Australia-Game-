import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 153 — VIC/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_153_META = {
  id: 'kpi_153',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 151640,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_153_COEF = {
  c0: 28.8000,
  c1: 38.4000,
  c2: 48.0000,
  c3: 57.6000,
  c4: 67.2000,
  c5: 76.8000,
  c6: 86.4000,
  c7: 96.0000,
  c8: 5.9000,
  c9: 15.5000,
  c10: 25.1000,
  c11: 34.7000,
  c12: 44.3000,
  c13: 53.9000,
  c14: 63.5000,
  c15: 73.1000,
  c16: 82.7000,
  c17: 92.3000,
  c18: 2.2000,
  c19: 11.8000,
  c20: 21.4000,
  c21: 31.0000,
  c22: 40.6000,
  c23: 50.2000,
  c24: 59.8000,
  c25: 69.4000,
  c26: 79.0000,
  c27: 88.6000,
  c28: 98.2000,
  c29: 8.1000,
  c30: 17.7000,
  c31: 27.3000,
  c32: 36.9000,
  c33: 46.5000,
  c34: 56.1000,
  c35: 65.7000,
  c36: 75.3000,
  c37: 84.9000,
  c38: 94.5000,
  c39: 4.4000,
  c40: 14.0000,
  c41: 23.6000,
  c42: 33.2000,
  c43: 42.8000,
  c44: 52.4000,
  c45: 62.0000,
  c46: 71.6000,
  c47: 81.2000,
  c48: 90.8000,
  c49: 0.7000,
  c50: 10.3000,
  c51: 19.9000,
  c52: 29.5000,
  c53: 39.1000,
  c54: 48.7000,
  c55: 58.3000,
  c56: 67.9000,
  c57: 77.5000,
  c58: 87.1000,
  c59: 96.7000,
  c60: 6.6000,
  c61: 16.2000,
  c62: 25.8000,
  c63: 35.4000,
  c64: 45.0000,
  c65: 54.6000,
  c66: 64.2000,
  c67: 73.8000,
  c68: 83.4000,
  c69: 93.0000,
  c70: 2.9000,
  c71: 12.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_153_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_153_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_153_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_153_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_153_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_153_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_153_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_153_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_153_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_153_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
