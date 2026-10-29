import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 075 — WA/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_075_META = {
  id: 'kpi_075',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 74342,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_075_COEF = {
  c0: 69.5000,
  c1: 26.2000,
  c2: 82.6000,
  c3: 39.3000,
  c4: 95.7000,
  c5: 52.4000,
  c6: 9.1000,
  c7: 65.5000,
  c8: 22.2000,
  c9: 78.6000,
  c10: 35.3000,
  c11: 91.7000,
  c12: 48.4000,
  c13: 5.1000,
  c14: 61.5000,
  c15: 18.2000,
  c16: 74.6000,
  c17: 31.3000,
  c18: 87.7000,
  c19: 44.4000,
  c20: 1.1000,
  c21: 57.5000,
  c22: 14.2000,
  c23: 70.6000,
  c24: 27.3000,
  c25: 83.7000,
  c26: 40.4000,
  c27: 96.8000,
  c28: 53.5000,
  c29: 10.2000,
  c30: 66.6000,
  c31: 23.3000,
  c32: 79.7000,
  c33: 36.4000,
  c34: 92.8000,
  c35: 49.5000,
  c36: 6.2000,
  c37: 62.6000,
  c38: 19.3000,
  c39: 75.7000,
  c40: 32.4000,
  c41: 88.8000,
  c42: 45.5000,
  c43: 2.2000,
  c44: 58.6000,
  c45: 15.3000,
  c46: 71.7000,
  c47: 28.4000,
  c48: 84.8000,
  c49: 41.5000,
  c50: 97.9000,
  c51: 54.6000,
  c52: 11.3000,
  c53: 67.7000,
  c54: 24.4000,
  c55: 80.8000,
  c56: 37.5000,
  c57: 93.9000,
  c58: 50.6000,
  c59: 7.3000,
  c60: 63.7000,
  c61: 20.4000,
  c62: 76.8000,
  c63: 33.5000,
  c64: 89.9000,
  c65: 46.6000,
  c66: 3.3000,
  c67: 59.7000,
  c68: 16.4000,
  c69: 72.8000,
  c70: 29.5000,
  c71: 85.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_075_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_075_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_075_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_075_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_075_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_075_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_075_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_075_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_075_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_075_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
