import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 147 — WA/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_147_META = {
  id: 'kpi_147',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 145694,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_147_COEF = {
  c0: 39.6000,
  c1: 52.8000,
  c2: 66.0000,
  c3: 79.2000,
  c4: 92.4000,
  c5: 5.9000,
  c6: 19.1000,
  c7: 32.3000,
  c8: 45.5000,
  c9: 58.7000,
  c10: 71.9000,
  c11: 85.1000,
  c12: 98.3000,
  c13: 11.8000,
  c14: 25.0000,
  c15: 38.2000,
  c16: 51.4000,
  c17: 64.6000,
  c18: 77.8000,
  c19: 91.0000,
  c20: 4.5000,
  c21: 17.7000,
  c22: 30.9000,
  c23: 44.1000,
  c24: 57.3000,
  c25: 70.5000,
  c26: 83.7000,
  c27: 96.9000,
  c28: 10.4000,
  c29: 23.6000,
  c30: 36.8000,
  c31: 50.0000,
  c32: 63.2000,
  c33: 76.4000,
  c34: 89.6000,
  c35: 3.1000,
  c36: 16.3000,
  c37: 29.5000,
  c38: 42.7000,
  c39: 55.9000,
  c40: 69.1000,
  c41: 82.3000,
  c42: 95.5000,
  c43: 9.0000,
  c44: 22.2000,
  c45: 35.4000,
  c46: 48.6000,
  c47: 61.8000,
  c48: 75.0000,
  c49: 88.2000,
  c50: 1.7000,
  c51: 14.9000,
  c52: 28.1000,
  c53: 41.3000,
  c54: 54.5000,
  c55: 67.7000,
  c56: 80.9000,
  c57: 94.1000,
  c58: 7.6000,
  c59: 20.8000,
  c60: 34.0000,
  c61: 47.2000,
  c62: 60.4000,
  c63: 73.6000,
  c64: 86.8000,
  c65: 0.3000,
  c66: 13.5000,
  c67: 26.7000,
  c68: 39.9000,
  c69: 53.1000,
  c70: 66.3000,
  c71: 79.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_147_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_147_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_147_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_147_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_147_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_147_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_147_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_147_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_147_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_147_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
