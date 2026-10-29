import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 037 — TAS/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_037_META = {
  id: 'kpi_037',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 36684,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_037_COEF = {
  c0: 38.2000,
  c1: 17.7000,
  c2: 96.9000,
  c3: 76.4000,
  c4: 55.9000,
  c5: 35.4000,
  c6: 14.9000,
  c7: 94.1000,
  c8: 73.6000,
  c9: 53.1000,
  c10: 32.6000,
  c11: 12.1000,
  c12: 91.3000,
  c13: 70.8000,
  c14: 50.3000,
  c15: 29.8000,
  c16: 9.3000,
  c17: 88.5000,
  c18: 68.0000,
  c19: 47.5000,
  c20: 27.0000,
  c21: 6.5000,
  c22: 85.7000,
  c23: 65.2000,
  c24: 44.7000,
  c25: 24.2000,
  c26: 3.7000,
  c27: 82.9000,
  c28: 62.4000,
  c29: 41.9000,
  c30: 21.4000,
  c31: 0.9000,
  c32: 80.1000,
  c33: 59.6000,
  c34: 39.1000,
  c35: 18.6000,
  c36: 97.8000,
  c37: 77.3000,
  c38: 56.8000,
  c39: 36.3000,
  c40: 15.8000,
  c41: 95.0000,
  c42: 74.5000,
  c43: 54.0000,
  c44: 33.5000,
  c45: 13.0000,
  c46: 92.2000,
  c47: 71.7000,
  c48: 51.2000,
  c49: 30.7000,
  c50: 10.2000,
  c51: 89.4000,
  c52: 68.9000,
  c53: 48.4000,
  c54: 27.9000,
  c55: 7.4000,
  c56: 86.6000,
  c57: 66.1000,
  c58: 45.6000,
  c59: 25.1000,
  c60: 4.6000,
  c61: 83.8000,
  c62: 63.3000,
  c63: 42.8000,
  c64: 22.3000,
  c65: 1.8000,
  c66: 81.0000,
  c67: 60.5000,
  c68: 40.0000,
  c69: 19.5000,
  c70: 98.7000,
  c71: 78.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_037_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_037_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_037_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_037_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_037_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_037_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_037_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_037_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_037_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_037_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
