import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 090 — QLD/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_090_META = {
  id: 'kpi_090',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 89207,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_090_COEF = {
  c0: 42.5000,
  c1: 89.9000,
  c2: 37.6000,
  c3: 85.0000,
  c4: 32.7000,
  c5: 80.1000,
  c6: 27.8000,
  c7: 75.2000,
  c8: 22.9000,
  c9: 70.3000,
  c10: 18.0000,
  c11: 65.4000,
  c12: 13.1000,
  c13: 60.5000,
  c14: 8.2000,
  c15: 55.6000,
  c16: 3.3000,
  c17: 50.7000,
  c18: 98.1000,
  c19: 45.8000,
  c20: 93.2000,
  c21: 40.9000,
  c22: 88.3000,
  c23: 36.0000,
  c24: 83.4000,
  c25: 31.1000,
  c26: 78.5000,
  c27: 26.2000,
  c28: 73.6000,
  c29: 21.3000,
  c30: 68.7000,
  c31: 16.4000,
  c32: 63.8000,
  c33: 11.5000,
  c34: 58.9000,
  c35: 6.6000,
  c36: 54.0000,
  c37: 1.7000,
  c38: 49.1000,
  c39: 96.5000,
  c40: 44.2000,
  c41: 91.6000,
  c42: 39.3000,
  c43: 86.7000,
  c44: 34.4000,
  c45: 81.8000,
  c46: 29.5000,
  c47: 76.9000,
  c48: 24.6000,
  c49: 72.0000,
  c50: 19.7000,
  c51: 67.1000,
  c52: 14.8000,
  c53: 62.2000,
  c54: 9.9000,
  c55: 57.3000,
  c56: 5.0000,
  c57: 52.4000,
  c58: 0.1000,
  c59: 47.5000,
  c60: 94.9000,
  c61: 42.6000,
  c62: 90.0000,
  c63: 37.7000,
  c64: 85.1000,
  c65: 32.8000,
  c66: 80.2000,
  c67: 27.9000,
  c68: 75.3000,
  c69: 23.0000,
  c70: 70.4000,
  c71: 18.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_090_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_090_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_090_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_090_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_090_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_090_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_090_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_090_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_090_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_090_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
