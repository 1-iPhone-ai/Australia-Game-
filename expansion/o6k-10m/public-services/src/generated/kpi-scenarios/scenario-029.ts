import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 029 — TAS/education. */
export const V1014_PUBSVC_KPI_SCENARIO_029_META = {
  id: 'kpi_029',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 28756,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_029_COEF = {
  c0: 52.6000,
  c1: 36.9000,
  c2: 21.2000,
  c3: 5.5000,
  c4: 89.5000,
  c5: 73.8000,
  c6: 58.1000,
  c7: 42.4000,
  c8: 26.7000,
  c9: 11.0000,
  c10: 95.0000,
  c11: 79.3000,
  c12: 63.6000,
  c13: 47.9000,
  c14: 32.2000,
  c15: 16.5000,
  c16: 0.8000,
  c17: 84.8000,
  c18: 69.1000,
  c19: 53.4000,
  c20: 37.7000,
  c21: 22.0000,
  c22: 6.3000,
  c23: 90.3000,
  c24: 74.6000,
  c25: 58.9000,
  c26: 43.2000,
  c27: 27.5000,
  c28: 11.8000,
  c29: 95.8000,
  c30: 80.1000,
  c31: 64.4000,
  c32: 48.7000,
  c33: 33.0000,
  c34: 17.3000,
  c35: 1.6000,
  c36: 85.6000,
  c37: 69.9000,
  c38: 54.2000,
  c39: 38.5000,
  c40: 22.8000,
  c41: 7.1000,
  c42: 91.1000,
  c43: 75.4000,
  c44: 59.7000,
  c45: 44.0000,
  c46: 28.3000,
  c47: 12.6000,
  c48: 96.6000,
  c49: 80.9000,
  c50: 65.2000,
  c51: 49.5000,
  c52: 33.8000,
  c53: 18.1000,
  c54: 2.4000,
  c55: 86.4000,
  c56: 70.7000,
  c57: 55.0000,
  c58: 39.3000,
  c59: 23.6000,
  c60: 7.9000,
  c61: 91.9000,
  c62: 76.2000,
  c63: 60.5000,
  c64: 44.8000,
  c65: 29.1000,
  c66: 13.4000,
  c67: 97.4000,
  c68: 81.7000,
  c69: 66.0000,
  c70: 50.3000,
  c71: 34.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_029_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_029_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_029_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_029_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_029_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_029_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_029_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_029_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_029_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_029_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
