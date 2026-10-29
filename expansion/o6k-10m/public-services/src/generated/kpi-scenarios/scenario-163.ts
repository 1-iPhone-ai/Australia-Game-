import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 163 — WA/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_163_META = {
  id: 'kpi_163',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 161550,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_163_COEF = {
  c0: 10.8000,
  c1: 14.4000,
  c2: 18.0000,
  c3: 21.6000,
  c4: 25.2000,
  c5: 28.8000,
  c6: 32.4000,
  c7: 36.0000,
  c8: 39.6000,
  c9: 43.2000,
  c10: 46.8000,
  c11: 50.4000,
  c12: 54.0000,
  c13: 57.6000,
  c14: 61.2000,
  c15: 64.8000,
  c16: 68.4000,
  c17: 72.0000,
  c18: 75.6000,
  c19: 79.2000,
  c20: 82.8000,
  c21: 86.4000,
  c22: 90.0000,
  c23: 93.6000,
  c24: 97.2000,
  c25: 1.1000,
  c26: 4.7000,
  c27: 8.3000,
  c28: 11.9000,
  c29: 15.5000,
  c30: 19.1000,
  c31: 22.7000,
  c32: 26.3000,
  c33: 29.9000,
  c34: 33.5000,
  c35: 37.1000,
  c36: 40.7000,
  c37: 44.3000,
  c38: 47.9000,
  c39: 51.5000,
  c40: 55.1000,
  c41: 58.7000,
  c42: 62.3000,
  c43: 65.9000,
  c44: 69.5000,
  c45: 73.1000,
  c46: 76.7000,
  c47: 80.3000,
  c48: 83.9000,
  c49: 87.5000,
  c50: 91.1000,
  c51: 94.7000,
  c52: 98.3000,
  c53: 2.2000,
  c54: 5.8000,
  c55: 9.4000,
  c56: 13.0000,
  c57: 16.6000,
  c58: 20.2000,
  c59: 23.8000,
  c60: 27.4000,
  c61: 31.0000,
  c62: 34.6000,
  c63: 38.2000,
  c64: 41.8000,
  c65: 45.4000,
  c66: 49.0000,
  c67: 52.6000,
  c68: 56.2000,
  c69: 59.8000,
  c70: 63.4000,
  c71: 67.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_163_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_163_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_163_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_163_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_163_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_163_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_163_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_163_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_163_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_163_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
