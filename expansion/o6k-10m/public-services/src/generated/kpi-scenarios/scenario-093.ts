import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 093 — TAS/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_093_META = {
  id: 'kpi_093',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 92180,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_093_COEF = {
  c0: 37.1000,
  c1: 82.7000,
  c2: 28.6000,
  c3: 74.2000,
  c4: 20.1000,
  c5: 65.7000,
  c6: 11.6000,
  c7: 57.2000,
  c8: 3.1000,
  c9: 48.7000,
  c10: 94.3000,
  c11: 40.2000,
  c12: 85.8000,
  c13: 31.7000,
  c14: 77.3000,
  c15: 23.2000,
  c16: 68.8000,
  c17: 14.7000,
  c18: 60.3000,
  c19: 6.2000,
  c20: 51.8000,
  c21: 97.4000,
  c22: 43.3000,
  c23: 88.9000,
  c24: 34.8000,
  c25: 80.4000,
  c26: 26.3000,
  c27: 71.9000,
  c28: 17.8000,
  c29: 63.4000,
  c30: 9.3000,
  c31: 54.9000,
  c32: 0.8000,
  c33: 46.4000,
  c34: 92.0000,
  c35: 37.9000,
  c36: 83.5000,
  c37: 29.4000,
  c38: 75.0000,
  c39: 20.9000,
  c40: 66.5000,
  c41: 12.4000,
  c42: 58.0000,
  c43: 3.9000,
  c44: 49.5000,
  c45: 95.1000,
  c46: 41.0000,
  c47: 86.6000,
  c48: 32.5000,
  c49: 78.1000,
  c50: 24.0000,
  c51: 69.6000,
  c52: 15.5000,
  c53: 61.1000,
  c54: 7.0000,
  c55: 52.6000,
  c56: 98.2000,
  c57: 44.1000,
  c58: 89.7000,
  c59: 35.6000,
  c60: 81.2000,
  c61: 27.1000,
  c62: 72.7000,
  c63: 18.6000,
  c64: 64.2000,
  c65: 10.1000,
  c66: 55.7000,
  c67: 1.6000,
  c68: 47.2000,
  c69: 92.8000,
  c70: 38.7000,
  c71: 84.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_093_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_093_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_093_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_093_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_093_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_093_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_093_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_093_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_093_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_093_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
