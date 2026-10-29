import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 019 — WA/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_019_META = {
  id: 'kpi_019',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 18846,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_019_COEF = {
  c0: 70.6000,
  c1: 60.9000,
  c2: 51.2000,
  c3: 41.5000,
  c4: 31.8000,
  c5: 22.1000,
  c6: 12.4000,
  c7: 2.7000,
  c8: 92.7000,
  c9: 83.0000,
  c10: 73.3000,
  c11: 63.6000,
  c12: 53.9000,
  c13: 44.2000,
  c14: 34.5000,
  c15: 24.8000,
  c16: 15.1000,
  c17: 5.4000,
  c18: 95.4000,
  c19: 85.7000,
  c20: 76.0000,
  c21: 66.3000,
  c22: 56.6000,
  c23: 46.9000,
  c24: 37.2000,
  c25: 27.5000,
  c26: 17.8000,
  c27: 8.1000,
  c28: 98.1000,
  c29: 88.4000,
  c30: 78.7000,
  c31: 69.0000,
  c32: 59.3000,
  c33: 49.6000,
  c34: 39.9000,
  c35: 30.2000,
  c36: 20.5000,
  c37: 10.8000,
  c38: 1.1000,
  c39: 91.1000,
  c40: 81.4000,
  c41: 71.7000,
  c42: 62.0000,
  c43: 52.3000,
  c44: 42.6000,
  c45: 32.9000,
  c46: 23.2000,
  c47: 13.5000,
  c48: 3.8000,
  c49: 93.8000,
  c50: 84.1000,
  c51: 74.4000,
  c52: 64.7000,
  c53: 55.0000,
  c54: 45.3000,
  c55: 35.6000,
  c56: 25.9000,
  c57: 16.2000,
  c58: 6.5000,
  c59: 96.5000,
  c60: 86.8000,
  c61: 77.1000,
  c62: 67.4000,
  c63: 57.7000,
  c64: 48.0000,
  c65: 38.3000,
  c66: 28.6000,
  c67: 18.9000,
  c68: 9.2000,
  c69: 99.2000,
  c70: 89.5000,
  c71: 79.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_019_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_019_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_019_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_019_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_019_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_019_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_019_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_019_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_019_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_019_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
