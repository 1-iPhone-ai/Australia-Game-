import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 122 — QLD/education. */
export const V1014_PUBSVC_KPI_SCENARIO_122_META = {
  id: 'kpi_122',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 120919,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_122_COEF = {
  c0: 84.6000,
  c1: 13.1000,
  c2: 41.3000,
  c3: 69.5000,
  c4: 97.7000,
  c5: 26.2000,
  c6: 54.4000,
  c7: 82.6000,
  c8: 11.1000,
  c9: 39.3000,
  c10: 67.5000,
  c11: 95.7000,
  c12: 24.2000,
  c13: 52.4000,
  c14: 80.6000,
  c15: 9.1000,
  c16: 37.3000,
  c17: 65.5000,
  c18: 93.7000,
  c19: 22.2000,
  c20: 50.4000,
  c21: 78.6000,
  c22: 7.1000,
  c23: 35.3000,
  c24: 63.5000,
  c25: 91.7000,
  c26: 20.2000,
  c27: 48.4000,
  c28: 76.6000,
  c29: 5.1000,
  c30: 33.3000,
  c31: 61.5000,
  c32: 89.7000,
  c33: 18.2000,
  c34: 46.4000,
  c35: 74.6000,
  c36: 3.1000,
  c37: 31.3000,
  c38: 59.5000,
  c39: 87.7000,
  c40: 16.2000,
  c41: 44.4000,
  c42: 72.6000,
  c43: 1.1000,
  c44: 29.3000,
  c45: 57.5000,
  c46: 85.7000,
  c47: 14.2000,
  c48: 42.4000,
  c49: 70.6000,
  c50: 98.8000,
  c51: 27.3000,
  c52: 55.5000,
  c53: 83.7000,
  c54: 12.2000,
  c55: 40.4000,
  c56: 68.6000,
  c57: 96.8000,
  c58: 25.3000,
  c59: 53.5000,
  c60: 81.7000,
  c61: 10.2000,
  c62: 38.4000,
  c63: 66.6000,
  c64: 94.8000,
  c65: 23.3000,
  c66: 51.5000,
  c67: 79.7000,
  c68: 8.2000,
  c69: 36.4000,
  c70: 64.6000,
  c71: 92.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_122_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_122_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_122_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_122_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_122_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_122_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_122_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_122_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_122_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_122_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
