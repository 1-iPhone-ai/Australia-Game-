import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 118 — NT/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_118_META = {
  id: 'kpi_118',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 116955,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_118_COEF = {
  c0: 91.8000,
  c1: 22.7000,
  c2: 53.3000,
  c3: 83.9000,
  c4: 14.8000,
  c5: 45.4000,
  c6: 76.0000,
  c7: 6.9000,
  c8: 37.5000,
  c9: 68.1000,
  c10: 98.7000,
  c11: 29.6000,
  c12: 60.2000,
  c13: 90.8000,
  c14: 21.7000,
  c15: 52.3000,
  c16: 82.9000,
  c17: 13.8000,
  c18: 44.4000,
  c19: 75.0000,
  c20: 5.9000,
  c21: 36.5000,
  c22: 67.1000,
  c23: 97.7000,
  c24: 28.6000,
  c25: 59.2000,
  c26: 89.8000,
  c27: 20.7000,
  c28: 51.3000,
  c29: 81.9000,
  c30: 12.8000,
  c31: 43.4000,
  c32: 74.0000,
  c33: 4.9000,
  c34: 35.5000,
  c35: 66.1000,
  c36: 96.7000,
  c37: 27.6000,
  c38: 58.2000,
  c39: 88.8000,
  c40: 19.7000,
  c41: 50.3000,
  c42: 80.9000,
  c43: 11.8000,
  c44: 42.4000,
  c45: 73.0000,
  c46: 3.9000,
  c47: 34.5000,
  c48: 65.1000,
  c49: 95.7000,
  c50: 26.6000,
  c51: 57.2000,
  c52: 87.8000,
  c53: 18.7000,
  c54: 49.3000,
  c55: 79.9000,
  c56: 10.8000,
  c57: 41.4000,
  c58: 72.0000,
  c59: 2.9000,
  c60: 33.5000,
  c61: 64.1000,
  c62: 94.7000,
  c63: 25.6000,
  c64: 56.2000,
  c65: 86.8000,
  c66: 17.7000,
  c67: 48.3000,
  c68: 78.9000,
  c69: 9.8000,
  c70: 40.4000,
  c71: 71.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_118_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_118_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_118_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_118_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_118_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_118_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_118_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_118_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_118_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_118_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
