import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 173 — TAS/education. */
export const V1014_PUBSVC_KPI_SCENARIO_173_META = {
  id: 'kpi_173',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 171460,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_173_COEF = {
  c0: 92.5000,
  c1: 90.1000,
  c2: 87.7000,
  c3: 85.3000,
  c4: 82.9000,
  c5: 80.5000,
  c6: 78.1000,
  c7: 75.7000,
  c8: 73.3000,
  c9: 70.9000,
  c10: 68.5000,
  c11: 66.1000,
  c12: 63.7000,
  c13: 61.3000,
  c14: 58.9000,
  c15: 56.5000,
  c16: 54.1000,
  c17: 51.7000,
  c18: 49.3000,
  c19: 46.9000,
  c20: 44.5000,
  c21: 42.1000,
  c22: 39.7000,
  c23: 37.3000,
  c24: 34.9000,
  c25: 32.5000,
  c26: 30.1000,
  c27: 27.7000,
  c28: 25.3000,
  c29: 22.9000,
  c30: 20.5000,
  c31: 18.1000,
  c32: 15.7000,
  c33: 13.3000,
  c34: 10.9000,
  c35: 8.5000,
  c36: 6.1000,
  c37: 3.7000,
  c38: 1.3000,
  c39: 98.6000,
  c40: 96.2000,
  c41: 93.8000,
  c42: 91.4000,
  c43: 89.0000,
  c44: 86.6000,
  c45: 84.2000,
  c46: 81.8000,
  c47: 79.4000,
  c48: 77.0000,
  c49: 74.6000,
  c50: 72.2000,
  c51: 69.8000,
  c52: 67.4000,
  c53: 65.0000,
  c54: 62.6000,
  c55: 60.2000,
  c56: 57.8000,
  c57: 55.4000,
  c58: 53.0000,
  c59: 50.6000,
  c60: 48.2000,
  c61: 45.8000,
  c62: 43.4000,
  c63: 41.0000,
  c64: 38.6000,
  c65: 36.2000,
  c66: 33.8000,
  c67: 31.4000,
  c68: 29.0000,
  c69: 26.6000,
  c70: 24.2000,
  c71: 21.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_173_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_173_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_173_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_173_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_173_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_173_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_173_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_173_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_173_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_173_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
