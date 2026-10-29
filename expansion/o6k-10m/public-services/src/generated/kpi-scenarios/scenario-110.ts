import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 110 — NT/education. */
export const V1014_PUBSVC_KPI_SCENARIO_110_META = {
  id: 'kpi_110',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 109027,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_110_COEF = {
  c0: 6.5000,
  c1: 41.9000,
  c2: 77.3000,
  c3: 13.0000,
  c4: 48.4000,
  c5: 83.8000,
  c6: 19.5000,
  c7: 54.9000,
  c8: 90.3000,
  c9: 26.0000,
  c10: 61.4000,
  c11: 96.8000,
  c12: 32.5000,
  c13: 67.9000,
  c14: 3.6000,
  c15: 39.0000,
  c16: 74.4000,
  c17: 10.1000,
  c18: 45.5000,
  c19: 80.9000,
  c20: 16.6000,
  c21: 52.0000,
  c22: 87.4000,
  c23: 23.1000,
  c24: 58.5000,
  c25: 93.9000,
  c26: 29.6000,
  c27: 65.0000,
  c28: 0.7000,
  c29: 36.1000,
  c30: 71.5000,
  c31: 7.2000,
  c32: 42.6000,
  c33: 78.0000,
  c34: 13.7000,
  c35: 49.1000,
  c36: 84.5000,
  c37: 20.2000,
  c38: 55.6000,
  c39: 91.0000,
  c40: 26.7000,
  c41: 62.1000,
  c42: 97.5000,
  c43: 33.2000,
  c44: 68.6000,
  c45: 4.3000,
  c46: 39.7000,
  c47: 75.1000,
  c48: 10.8000,
  c49: 46.2000,
  c50: 81.6000,
  c51: 17.3000,
  c52: 52.7000,
  c53: 88.1000,
  c54: 23.8000,
  c55: 59.2000,
  c56: 94.6000,
  c57: 30.3000,
  c58: 65.7000,
  c59: 1.4000,
  c60: 36.8000,
  c61: 72.2000,
  c62: 7.9000,
  c63: 43.3000,
  c64: 78.7000,
  c65: 14.4000,
  c66: 49.8000,
  c67: 85.2000,
  c68: 20.9000,
  c69: 56.3000,
  c70: 91.7000,
  c71: 27.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_110_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_110_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_110_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_110_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_110_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_110_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_110_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_110_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_110_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_110_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
