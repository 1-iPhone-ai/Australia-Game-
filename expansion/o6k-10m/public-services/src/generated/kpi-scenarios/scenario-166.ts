import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 166 — NT/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_166_META = {
  id: 'kpi_166',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 164523,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_166_COEF = {
  c0: 5.4000,
  c1: 7.2000,
  c2: 9.0000,
  c3: 10.8000,
  c4: 12.6000,
  c5: 14.4000,
  c6: 16.2000,
  c7: 18.0000,
  c8: 19.8000,
  c9: 21.6000,
  c10: 23.4000,
  c11: 25.2000,
  c12: 27.0000,
  c13: 28.8000,
  c14: 30.6000,
  c15: 32.4000,
  c16: 34.2000,
  c17: 36.0000,
  c18: 37.8000,
  c19: 39.6000,
  c20: 41.4000,
  c21: 43.2000,
  c22: 45.0000,
  c23: 46.8000,
  c24: 48.6000,
  c25: 50.4000,
  c26: 52.2000,
  c27: 54.0000,
  c28: 55.8000,
  c29: 57.6000,
  c30: 59.4000,
  c31: 61.2000,
  c32: 63.0000,
  c33: 64.8000,
  c34: 66.6000,
  c35: 68.4000,
  c36: 70.2000,
  c37: 72.0000,
  c38: 73.8000,
  c39: 75.6000,
  c40: 77.4000,
  c41: 79.2000,
  c42: 81.0000,
  c43: 82.8000,
  c44: 84.6000,
  c45: 86.4000,
  c46: 88.2000,
  c47: 90.0000,
  c48: 91.8000,
  c49: 93.6000,
  c50: 95.4000,
  c51: 97.2000,
  c52: 99.0000,
  c53: 1.1000,
  c54: 2.9000,
  c55: 4.7000,
  c56: 6.5000,
  c57: 8.3000,
  c58: 10.1000,
  c59: 11.9000,
  c60: 13.7000,
  c61: 15.5000,
  c62: 17.3000,
  c63: 19.1000,
  c64: 20.9000,
  c65: 22.7000,
  c66: 24.5000,
  c67: 26.3000,
  c68: 28.1000,
  c69: 29.9000,
  c70: 31.7000,
  c71: 33.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_166_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_166_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_166_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_166_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_166_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_166_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_166_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_166_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_166_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_166_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
