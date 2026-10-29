import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 171 — WA/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_171_META = {
  id: 'kpi_171',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 169478,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_171_COEF = {
  c0: 96.1000,
  c1: 94.9000,
  c2: 93.7000,
  c3: 92.5000,
  c4: 91.3000,
  c5: 90.1000,
  c6: 88.9000,
  c7: 87.7000,
  c8: 86.5000,
  c9: 85.3000,
  c10: 84.1000,
  c11: 82.9000,
  c12: 81.7000,
  c13: 80.5000,
  c14: 79.3000,
  c15: 78.1000,
  c16: 76.9000,
  c17: 75.7000,
  c18: 74.5000,
  c19: 73.3000,
  c20: 72.1000,
  c21: 70.9000,
  c22: 69.7000,
  c23: 68.5000,
  c24: 67.3000,
  c25: 66.1000,
  c26: 64.9000,
  c27: 63.7000,
  c28: 62.5000,
  c29: 61.3000,
  c30: 60.1000,
  c31: 58.9000,
  c32: 57.7000,
  c33: 56.5000,
  c34: 55.3000,
  c35: 54.1000,
  c36: 52.9000,
  c37: 51.7000,
  c38: 50.5000,
  c39: 49.3000,
  c40: 48.1000,
  c41: 46.9000,
  c42: 45.7000,
  c43: 44.5000,
  c44: 43.3000,
  c45: 42.1000,
  c46: 40.9000,
  c47: 39.7000,
  c48: 38.5000,
  c49: 37.3000,
  c50: 36.1000,
  c51: 34.9000,
  c52: 33.7000,
  c53: 32.5000,
  c54: 31.3000,
  c55: 30.1000,
  c56: 28.9000,
  c57: 27.7000,
  c58: 26.5000,
  c59: 25.3000,
  c60: 24.1000,
  c61: 22.9000,
  c62: 21.7000,
  c63: 20.5000,
  c64: 19.3000,
  c65: 18.1000,
  c66: 16.9000,
  c67: 15.7000,
  c68: 14.5000,
  c69: 13.3000,
  c70: 12.1000,
  c71: 10.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_171_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_171_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_171_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_171_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_171_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_171_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_171_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_171_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_171_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_171_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
