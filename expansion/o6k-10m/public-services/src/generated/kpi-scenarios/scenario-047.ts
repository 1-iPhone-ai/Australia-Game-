import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 047 — ACT/education. */
export const V1014_PUBSVC_KPI_SCENARIO_047_META = {
  id: 'kpi_047',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 46594,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_047_COEF = {
  c0: 20.2000,
  c1: 93.4000,
  c2: 66.9000,
  c3: 40.4000,
  c4: 13.9000,
  c5: 87.1000,
  c6: 60.6000,
  c7: 34.1000,
  c8: 7.6000,
  c9: 80.8000,
  c10: 54.3000,
  c11: 27.8000,
  c12: 1.3000,
  c13: 74.5000,
  c14: 48.0000,
  c15: 21.5000,
  c16: 94.7000,
  c17: 68.2000,
  c18: 41.7000,
  c19: 15.2000,
  c20: 88.4000,
  c21: 61.9000,
  c22: 35.4000,
  c23: 8.9000,
  c24: 82.1000,
  c25: 55.6000,
  c26: 29.1000,
  c27: 2.6000,
  c28: 75.8000,
  c29: 49.3000,
  c30: 22.8000,
  c31: 96.0000,
  c32: 69.5000,
  c33: 43.0000,
  c34: 16.5000,
  c35: 89.7000,
  c36: 63.2000,
  c37: 36.7000,
  c38: 10.2000,
  c39: 83.4000,
  c40: 56.9000,
  c41: 30.4000,
  c42: 3.9000,
  c43: 77.1000,
  c44: 50.6000,
  c45: 24.1000,
  c46: 97.3000,
  c47: 70.8000,
  c48: 44.3000,
  c49: 17.8000,
  c50: 91.0000,
  c51: 64.5000,
  c52: 38.0000,
  c53: 11.5000,
  c54: 84.7000,
  c55: 58.2000,
  c56: 31.7000,
  c57: 5.2000,
  c58: 78.4000,
  c59: 51.9000,
  c60: 25.4000,
  c61: 98.6000,
  c62: 72.1000,
  c63: 45.6000,
  c64: 19.1000,
  c65: 92.3000,
  c66: 65.8000,
  c67: 39.3000,
  c68: 12.8000,
  c69: 86.0000,
  c70: 59.5000,
  c71: 33.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_047_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_047_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_047_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_047_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_047_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_047_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_047_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_047_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_047_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_047_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
