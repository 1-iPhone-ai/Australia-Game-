import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 085 — TAS/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_085_META = {
  id: 'kpi_085',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 84252,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_085_COEF = {
  c0: 51.5000,
  c1: 2.2000,
  c2: 52.6000,
  c3: 3.3000,
  c4: 53.7000,
  c5: 4.4000,
  c6: 54.8000,
  c7: 5.5000,
  c8: 55.9000,
  c9: 6.6000,
  c10: 57.0000,
  c11: 7.7000,
  c12: 58.1000,
  c13: 8.8000,
  c14: 59.2000,
  c15: 9.9000,
  c16: 60.3000,
  c17: 11.0000,
  c18: 61.4000,
  c19: 12.1000,
  c20: 62.5000,
  c21: 13.2000,
  c22: 63.6000,
  c23: 14.3000,
  c24: 64.7000,
  c25: 15.4000,
  c26: 65.8000,
  c27: 16.5000,
  c28: 66.9000,
  c29: 17.6000,
  c30: 68.0000,
  c31: 18.7000,
  c32: 69.1000,
  c33: 19.8000,
  c34: 70.2000,
  c35: 20.9000,
  c36: 71.3000,
  c37: 22.0000,
  c38: 72.4000,
  c39: 23.1000,
  c40: 73.5000,
  c41: 24.2000,
  c42: 74.6000,
  c43: 25.3000,
  c44: 75.7000,
  c45: 26.4000,
  c46: 76.8000,
  c47: 27.5000,
  c48: 77.9000,
  c49: 28.6000,
  c50: 79.0000,
  c51: 29.7000,
  c52: 80.1000,
  c53: 30.8000,
  c54: 81.2000,
  c55: 31.9000,
  c56: 82.3000,
  c57: 33.0000,
  c58: 83.4000,
  c59: 34.1000,
  c60: 84.5000,
  c61: 35.2000,
  c62: 85.6000,
  c63: 36.3000,
  c64: 86.7000,
  c65: 37.4000,
  c66: 87.8000,
  c67: 38.5000,
  c68: 88.9000,
  c69: 39.6000,
  c70: 90.0000,
  c71: 40.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_085_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_085_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_085_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_085_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_085_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_085_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_085_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_085_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_085_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_085_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
