import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 137 — VIC/education. */
export const V1014_PUBSVC_KPI_SCENARIO_137_META = {
  id: 'kpi_137',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 135784,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_137_COEF = {
  c0: 57.6000,
  c1: 76.8000,
  c2: 96.0000,
  c3: 15.5000,
  c4: 34.7000,
  c5: 53.9000,
  c6: 73.1000,
  c7: 92.3000,
  c8: 11.8000,
  c9: 31.0000,
  c10: 50.2000,
  c11: 69.4000,
  c12: 88.6000,
  c13: 8.1000,
  c14: 27.3000,
  c15: 46.5000,
  c16: 65.7000,
  c17: 84.9000,
  c18: 4.4000,
  c19: 23.6000,
  c20: 42.8000,
  c21: 62.0000,
  c22: 81.2000,
  c23: 0.7000,
  c24: 19.9000,
  c25: 39.1000,
  c26: 58.3000,
  c27: 77.5000,
  c28: 96.7000,
  c29: 16.2000,
  c30: 35.4000,
  c31: 54.6000,
  c32: 73.8000,
  c33: 93.0000,
  c34: 12.5000,
  c35: 31.7000,
  c36: 50.9000,
  c37: 70.1000,
  c38: 89.3000,
  c39: 8.8000,
  c40: 28.0000,
  c41: 47.2000,
  c42: 66.4000,
  c43: 85.6000,
  c44: 5.1000,
  c45: 24.3000,
  c46: 43.5000,
  c47: 62.7000,
  c48: 81.9000,
  c49: 1.4000,
  c50: 20.6000,
  c51: 39.8000,
  c52: 59.0000,
  c53: 78.2000,
  c54: 97.4000,
  c55: 16.9000,
  c56: 36.1000,
  c57: 55.3000,
  c58: 74.5000,
  c59: 93.7000,
  c60: 13.2000,
  c61: 32.4000,
  c62: 51.6000,
  c63: 70.8000,
  c64: 90.0000,
  c65: 9.5000,
  c66: 28.7000,
  c67: 47.9000,
  c68: 67.1000,
  c69: 86.3000,
  c70: 5.8000,
  c71: 25.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_137_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_137_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_137_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_137_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_137_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_137_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_137_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_137_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_137_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_137_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
