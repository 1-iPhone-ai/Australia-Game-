import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 103 — ACT/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_103_META = {
  id: 'kpi_103',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 102090,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_103_COEF = {
  c0: 19.1000,
  c1: 58.7000,
  c2: 98.3000,
  c3: 38.2000,
  c4: 77.8000,
  c5: 17.7000,
  c6: 57.3000,
  c7: 96.9000,
  c8: 36.8000,
  c9: 76.4000,
  c10: 16.3000,
  c11: 55.9000,
  c12: 95.5000,
  c13: 35.4000,
  c14: 75.0000,
  c15: 14.9000,
  c16: 54.5000,
  c17: 94.1000,
  c18: 34.0000,
  c19: 73.6000,
  c20: 13.5000,
  c21: 53.1000,
  c22: 92.7000,
  c23: 32.6000,
  c24: 72.2000,
  c25: 12.1000,
  c26: 51.7000,
  c27: 91.3000,
  c28: 31.2000,
  c29: 70.8000,
  c30: 10.7000,
  c31: 50.3000,
  c32: 89.9000,
  c33: 29.8000,
  c34: 69.4000,
  c35: 9.3000,
  c36: 48.9000,
  c37: 88.5000,
  c38: 28.4000,
  c39: 68.0000,
  c40: 7.9000,
  c41: 47.5000,
  c42: 87.1000,
  c43: 27.0000,
  c44: 66.6000,
  c45: 6.5000,
  c46: 46.1000,
  c47: 85.7000,
  c48: 25.6000,
  c49: 65.2000,
  c50: 5.1000,
  c51: 44.7000,
  c52: 84.3000,
  c53: 24.2000,
  c54: 63.8000,
  c55: 3.7000,
  c56: 43.3000,
  c57: 82.9000,
  c58: 22.8000,
  c59: 62.4000,
  c60: 2.3000,
  c61: 41.9000,
  c62: 81.5000,
  c63: 21.4000,
  c64: 61.0000,
  c65: 0.9000,
  c66: 40.5000,
  c67: 80.1000,
  c68: 20.0000,
  c69: 59.6000,
  c70: 99.2000,
  c71: 39.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_103_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_103_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_103_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_103_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_103_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_103_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_103_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_103_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_103_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_103_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
