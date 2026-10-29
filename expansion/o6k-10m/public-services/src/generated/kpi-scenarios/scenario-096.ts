import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 096 — NSW/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_096_META = {
  id: 'kpi_096',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 95153,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_096_COEF = {
  c0: 31.7000,
  c1: 75.5000,
  c2: 19.6000,
  c3: 63.4000,
  c4: 7.5000,
  c5: 51.3000,
  c6: 95.1000,
  c7: 39.2000,
  c8: 83.0000,
  c9: 27.1000,
  c10: 70.9000,
  c11: 15.0000,
  c12: 58.8000,
  c13: 2.9000,
  c14: 46.7000,
  c15: 90.5000,
  c16: 34.6000,
  c17: 78.4000,
  c18: 22.5000,
  c19: 66.3000,
  c20: 10.4000,
  c21: 54.2000,
  c22: 98.0000,
  c23: 42.1000,
  c24: 85.9000,
  c25: 30.0000,
  c26: 73.8000,
  c27: 17.9000,
  c28: 61.7000,
  c29: 5.8000,
  c30: 49.6000,
  c31: 93.4000,
  c32: 37.5000,
  c33: 81.3000,
  c34: 25.4000,
  c35: 69.2000,
  c36: 13.3000,
  c37: 57.1000,
  c38: 1.2000,
  c39: 45.0000,
  c40: 88.8000,
  c41: 32.9000,
  c42: 76.7000,
  c43: 20.8000,
  c44: 64.6000,
  c45: 8.7000,
  c46: 52.5000,
  c47: 96.3000,
  c48: 40.4000,
  c49: 84.2000,
  c50: 28.3000,
  c51: 72.1000,
  c52: 16.2000,
  c53: 60.0000,
  c54: 4.1000,
  c55: 47.9000,
  c56: 91.7000,
  c57: 35.8000,
  c58: 79.6000,
  c59: 23.7000,
  c60: 67.5000,
  c61: 11.6000,
  c62: 55.4000,
  c63: 99.2000,
  c64: 43.3000,
  c65: 87.1000,
  c66: 31.2000,
  c67: 75.0000,
  c68: 19.1000,
  c69: 62.9000,
  c70: 7.0000,
  c71: 50.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_096_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_096_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_096_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_096_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_096_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_096_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_096_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_096_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_096_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_096_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
