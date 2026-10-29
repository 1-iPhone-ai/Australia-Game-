import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 183 — ACT/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_183_META = {
  id: 'kpi_183',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 181370,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_183_COEF = {
  c0: 74.5000,
  c1: 66.1000,
  c2: 57.7000,
  c3: 49.3000,
  c4: 40.9000,
  c5: 32.5000,
  c6: 24.1000,
  c7: 15.7000,
  c8: 7.3000,
  c9: 98.6000,
  c10: 90.2000,
  c11: 81.8000,
  c12: 73.4000,
  c13: 65.0000,
  c14: 56.6000,
  c15: 48.2000,
  c16: 39.8000,
  c17: 31.4000,
  c18: 23.0000,
  c19: 14.6000,
  c20: 6.2000,
  c21: 97.5000,
  c22: 89.1000,
  c23: 80.7000,
  c24: 72.3000,
  c25: 63.9000,
  c26: 55.5000,
  c27: 47.1000,
  c28: 38.7000,
  c29: 30.3000,
  c30: 21.9000,
  c31: 13.5000,
  c32: 5.1000,
  c33: 96.4000,
  c34: 88.0000,
  c35: 79.6000,
  c36: 71.2000,
  c37: 62.8000,
  c38: 54.4000,
  c39: 46.0000,
  c40: 37.6000,
  c41: 29.2000,
  c42: 20.8000,
  c43: 12.4000,
  c44: 4.0000,
  c45: 95.3000,
  c46: 86.9000,
  c47: 78.5000,
  c48: 70.1000,
  c49: 61.7000,
  c50: 53.3000,
  c51: 44.9000,
  c52: 36.5000,
  c53: 28.1000,
  c54: 19.7000,
  c55: 11.3000,
  c56: 2.9000,
  c57: 94.2000,
  c58: 85.8000,
  c59: 77.4000,
  c60: 69.0000,
  c61: 60.6000,
  c62: 52.2000,
  c63: 43.8000,
  c64: 35.4000,
  c65: 27.0000,
  c66: 18.6000,
  c67: 10.2000,
  c68: 1.8000,
  c69: 93.1000,
  c70: 84.7000,
  c71: 76.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_183_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_183_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_183_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_183_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_183_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_183_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_183_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_183_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_183_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_183_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
