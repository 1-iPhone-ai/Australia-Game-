import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 066 — QLD/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_066_META = {
  id: 'kpi_066',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 65423,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_066_COEF = {
  c0: 85.7000,
  c1: 47.8000,
  c2: 9.9000,
  c3: 71.7000,
  c4: 33.8000,
  c5: 95.6000,
  c6: 57.7000,
  c7: 19.8000,
  c8: 81.6000,
  c9: 43.7000,
  c10: 5.8000,
  c11: 67.6000,
  c12: 29.7000,
  c13: 91.5000,
  c14: 53.6000,
  c15: 15.7000,
  c16: 77.5000,
  c17: 39.6000,
  c18: 1.7000,
  c19: 63.5000,
  c20: 25.6000,
  c21: 87.4000,
  c22: 49.5000,
  c23: 11.6000,
  c24: 73.4000,
  c25: 35.5000,
  c26: 97.3000,
  c27: 59.4000,
  c28: 21.5000,
  c29: 83.3000,
  c30: 45.4000,
  c31: 7.5000,
  c32: 69.3000,
  c33: 31.4000,
  c34: 93.2000,
  c35: 55.3000,
  c36: 17.4000,
  c37: 79.2000,
  c38: 41.3000,
  c39: 3.4000,
  c40: 65.2000,
  c41: 27.3000,
  c42: 89.1000,
  c43: 51.2000,
  c44: 13.3000,
  c45: 75.1000,
  c46: 37.2000,
  c47: 99.0000,
  c48: 61.1000,
  c49: 23.2000,
  c50: 85.0000,
  c51: 47.1000,
  c52: 9.2000,
  c53: 71.0000,
  c54: 33.1000,
  c55: 94.9000,
  c56: 57.0000,
  c57: 19.1000,
  c58: 80.9000,
  c59: 43.0000,
  c60: 5.1000,
  c61: 66.9000,
  c62: 29.0000,
  c63: 90.8000,
  c64: 52.9000,
  c65: 15.0000,
  c66: 76.8000,
  c67: 38.9000,
  c68: 1.0000,
  c69: 62.8000,
  c70: 24.9000,
  c71: 86.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_066_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_066_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_066_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_066_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_066_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_066_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_066_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_066_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_066_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_066_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
