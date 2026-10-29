import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 045 — TAS/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_045_META = {
  id: 'kpi_045',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 44612,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_045_COEF = {
  c0: 23.8000,
  c1: 98.2000,
  c2: 72.9000,
  c3: 47.6000,
  c4: 22.3000,
  c5: 96.7000,
  c6: 71.4000,
  c7: 46.1000,
  c8: 20.8000,
  c9: 95.2000,
  c10: 69.9000,
  c11: 44.6000,
  c12: 19.3000,
  c13: 93.7000,
  c14: 68.4000,
  c15: 43.1000,
  c16: 17.8000,
  c17: 92.2000,
  c18: 66.9000,
  c19: 41.6000,
  c20: 16.3000,
  c21: 90.7000,
  c22: 65.4000,
  c23: 40.1000,
  c24: 14.8000,
  c25: 89.2000,
  c26: 63.9000,
  c27: 38.6000,
  c28: 13.3000,
  c29: 87.7000,
  c30: 62.4000,
  c31: 37.1000,
  c32: 11.8000,
  c33: 86.2000,
  c34: 60.9000,
  c35: 35.6000,
  c36: 10.3000,
  c37: 84.7000,
  c38: 59.4000,
  c39: 34.1000,
  c40: 8.8000,
  c41: 83.2000,
  c42: 57.9000,
  c43: 32.6000,
  c44: 7.3000,
  c45: 81.7000,
  c46: 56.4000,
  c47: 31.1000,
  c48: 5.8000,
  c49: 80.2000,
  c50: 54.9000,
  c51: 29.6000,
  c52: 4.3000,
  c53: 78.7000,
  c54: 53.4000,
  c55: 28.1000,
  c56: 2.8000,
  c57: 77.2000,
  c58: 51.9000,
  c59: 26.6000,
  c60: 1.3000,
  c61: 75.7000,
  c62: 50.4000,
  c63: 25.1000,
  c64: 99.5000,
  c65: 74.2000,
  c66: 48.9000,
  c67: 23.6000,
  c68: 98.0000,
  c69: 72.7000,
  c70: 47.4000,
  c71: 22.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_045_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_045_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_045_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_045_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_045_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_045_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_045_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_045_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_045_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_045_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
