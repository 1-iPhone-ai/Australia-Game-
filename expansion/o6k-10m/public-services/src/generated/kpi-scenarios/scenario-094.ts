import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 094 — NT/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_094_META = {
  id: 'kpi_094',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 93171,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_094_COEF = {
  c0: 35.3000,
  c1: 80.3000,
  c2: 25.6000,
  c3: 70.6000,
  c4: 15.9000,
  c5: 60.9000,
  c6: 6.2000,
  c7: 51.2000,
  c8: 96.2000,
  c9: 41.5000,
  c10: 86.5000,
  c11: 31.8000,
  c12: 76.8000,
  c13: 22.1000,
  c14: 67.1000,
  c15: 12.4000,
  c16: 57.4000,
  c17: 2.7000,
  c18: 47.7000,
  c19: 92.7000,
  c20: 38.0000,
  c21: 83.0000,
  c22: 28.3000,
  c23: 73.3000,
  c24: 18.6000,
  c25: 63.6000,
  c26: 8.9000,
  c27: 53.9000,
  c28: 98.9000,
  c29: 44.2000,
  c30: 89.2000,
  c31: 34.5000,
  c32: 79.5000,
  c33: 24.8000,
  c34: 69.8000,
  c35: 15.1000,
  c36: 60.1000,
  c37: 5.4000,
  c38: 50.4000,
  c39: 95.4000,
  c40: 40.7000,
  c41: 85.7000,
  c42: 31.0000,
  c43: 76.0000,
  c44: 21.3000,
  c45: 66.3000,
  c46: 11.6000,
  c47: 56.6000,
  c48: 1.9000,
  c49: 46.9000,
  c50: 91.9000,
  c51: 37.2000,
  c52: 82.2000,
  c53: 27.5000,
  c54: 72.5000,
  c55: 17.8000,
  c56: 62.8000,
  c57: 8.1000,
  c58: 53.1000,
  c59: 98.1000,
  c60: 43.4000,
  c61: 88.4000,
  c62: 33.7000,
  c63: 78.7000,
  c64: 24.0000,
  c65: 69.0000,
  c66: 14.3000,
  c67: 59.3000,
  c68: 4.6000,
  c69: 49.6000,
  c70: 94.6000,
  c71: 39.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_094_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_094_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_094_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_094_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_094_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_094_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_094_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_094_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_094_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_094_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
