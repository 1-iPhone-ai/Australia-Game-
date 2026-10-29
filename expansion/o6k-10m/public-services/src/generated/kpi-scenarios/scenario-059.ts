import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 059 — WA/education. */
export const V1014_PUBSVC_KPI_SCENARIO_059_META = {
  id: 'kpi_059',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 58486,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_059_COEF = {
  c0: 98.3000,
  c1: 64.6000,
  c2: 30.9000,
  c3: 96.9000,
  c4: 63.2000,
  c5: 29.5000,
  c6: 95.5000,
  c7: 61.8000,
  c8: 28.1000,
  c9: 94.1000,
  c10: 60.4000,
  c11: 26.7000,
  c12: 92.7000,
  c13: 59.0000,
  c14: 25.3000,
  c15: 91.3000,
  c16: 57.6000,
  c17: 23.9000,
  c18: 89.9000,
  c19: 56.2000,
  c20: 22.5000,
  c21: 88.5000,
  c22: 54.8000,
  c23: 21.1000,
  c24: 87.1000,
  c25: 53.4000,
  c26: 19.7000,
  c27: 85.7000,
  c28: 52.0000,
  c29: 18.3000,
  c30: 84.3000,
  c31: 50.6000,
  c32: 16.9000,
  c33: 82.9000,
  c34: 49.2000,
  c35: 15.5000,
  c36: 81.5000,
  c37: 47.8000,
  c38: 14.1000,
  c39: 80.1000,
  c40: 46.4000,
  c41: 12.7000,
  c42: 78.7000,
  c43: 45.0000,
  c44: 11.3000,
  c45: 77.3000,
  c46: 43.6000,
  c47: 9.9000,
  c48: 75.9000,
  c49: 42.2000,
  c50: 8.5000,
  c51: 74.5000,
  c52: 40.8000,
  c53: 7.1000,
  c54: 73.1000,
  c55: 39.4000,
  c56: 5.7000,
  c57: 71.7000,
  c58: 38.0000,
  c59: 4.3000,
  c60: 70.3000,
  c61: 36.6000,
  c62: 2.9000,
  c63: 68.9000,
  c64: 35.2000,
  c65: 1.5000,
  c66: 67.5000,
  c67: 33.8000,
  c68: 0.1000,
  c69: 66.1000,
  c70: 32.4000,
  c71: 98.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_059_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_059_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_059_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_059_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_059_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_059_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_059_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_059_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_059_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_059_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
