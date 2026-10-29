import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 155 — WA/education. */
export const V1014_PUBSVC_KPI_SCENARIO_155_META = {
  id: 'kpi_155',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 153622,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_155_COEF = {
  c0: 25.2000,
  c1: 33.6000,
  c2: 42.0000,
  c3: 50.4000,
  c4: 58.8000,
  c5: 67.2000,
  c6: 75.6000,
  c7: 84.0000,
  c8: 92.4000,
  c9: 1.1000,
  c10: 9.5000,
  c11: 17.9000,
  c12: 26.3000,
  c13: 34.7000,
  c14: 43.1000,
  c15: 51.5000,
  c16: 59.9000,
  c17: 68.3000,
  c18: 76.7000,
  c19: 85.1000,
  c20: 93.5000,
  c21: 2.2000,
  c22: 10.6000,
  c23: 19.0000,
  c24: 27.4000,
  c25: 35.8000,
  c26: 44.2000,
  c27: 52.6000,
  c28: 61.0000,
  c29: 69.4000,
  c30: 77.8000,
  c31: 86.2000,
  c32: 94.6000,
  c33: 3.3000,
  c34: 11.7000,
  c35: 20.1000,
  c36: 28.5000,
  c37: 36.9000,
  c38: 45.3000,
  c39: 53.7000,
  c40: 62.1000,
  c41: 70.5000,
  c42: 78.9000,
  c43: 87.3000,
  c44: 95.7000,
  c45: 4.4000,
  c46: 12.8000,
  c47: 21.2000,
  c48: 29.6000,
  c49: 38.0000,
  c50: 46.4000,
  c51: 54.8000,
  c52: 63.2000,
  c53: 71.6000,
  c54: 80.0000,
  c55: 88.4000,
  c56: 96.8000,
  c57: 5.5000,
  c58: 13.9000,
  c59: 22.3000,
  c60: 30.7000,
  c61: 39.1000,
  c62: 47.5000,
  c63: 55.9000,
  c64: 64.3000,
  c65: 72.7000,
  c66: 81.1000,
  c67: 89.5000,
  c68: 97.9000,
  c69: 6.6000,
  c70: 15.0000,
  c71: 23.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_155_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_155_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_155_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_155_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_155_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_155_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_155_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_155_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_155_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_155_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
