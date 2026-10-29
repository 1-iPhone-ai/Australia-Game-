import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 164 — SA/education. */
export const V1014_PUBSVC_KPI_SCENARIO_164_META = {
  id: 'kpi_164',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 162541,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_164_COEF = {
  c0: 9.0000,
  c1: 12.0000,
  c2: 15.0000,
  c3: 18.0000,
  c4: 21.0000,
  c5: 24.0000,
  c6: 27.0000,
  c7: 30.0000,
  c8: 33.0000,
  c9: 36.0000,
  c10: 39.0000,
  c11: 42.0000,
  c12: 45.0000,
  c13: 48.0000,
  c14: 51.0000,
  c15: 54.0000,
  c16: 57.0000,
  c17: 60.0000,
  c18: 63.0000,
  c19: 66.0000,
  c20: 69.0000,
  c21: 72.0000,
  c22: 75.0000,
  c23: 78.0000,
  c24: 81.0000,
  c25: 84.0000,
  c26: 87.0000,
  c27: 90.0000,
  c28: 93.0000,
  c29: 96.0000,
  c30: 99.0000,
  c31: 2.3000,
  c32: 5.3000,
  c33: 8.3000,
  c34: 11.3000,
  c35: 14.3000,
  c36: 17.3000,
  c37: 20.3000,
  c38: 23.3000,
  c39: 26.3000,
  c40: 29.3000,
  c41: 32.3000,
  c42: 35.3000,
  c43: 38.3000,
  c44: 41.3000,
  c45: 44.3000,
  c46: 47.3000,
  c47: 50.3000,
  c48: 53.3000,
  c49: 56.3000,
  c50: 59.3000,
  c51: 62.3000,
  c52: 65.3000,
  c53: 68.3000,
  c54: 71.3000,
  c55: 74.3000,
  c56: 77.3000,
  c57: 80.3000,
  c58: 83.3000,
  c59: 86.3000,
  c60: 89.3000,
  c61: 92.3000,
  c62: 95.3000,
  c63: 98.3000,
  c64: 1.6000,
  c65: 4.6000,
  c66: 7.6000,
  c67: 10.6000,
  c68: 13.6000,
  c69: 16.6000,
  c70: 19.6000,
  c71: 22.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_164_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_164_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_164_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_164_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_164_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_164_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_164_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_164_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_164_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_164_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
