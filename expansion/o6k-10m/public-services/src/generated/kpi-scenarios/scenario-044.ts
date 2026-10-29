import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 044 — SA/education. */
export const V1014_PUBSVC_KPI_SCENARIO_044_META = {
  id: 'kpi_044',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 43621,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_044_COEF = {
  c0: 25.6000,
  c1: 0.9000,
  c2: 75.9000,
  c3: 51.2000,
  c4: 26.5000,
  c5: 1.8000,
  c6: 76.8000,
  c7: 52.1000,
  c8: 27.4000,
  c9: 2.7000,
  c10: 77.7000,
  c11: 53.0000,
  c12: 28.3000,
  c13: 3.6000,
  c14: 78.6000,
  c15: 53.9000,
  c16: 29.2000,
  c17: 4.5000,
  c18: 79.5000,
  c19: 54.8000,
  c20: 30.1000,
  c21: 5.4000,
  c22: 80.4000,
  c23: 55.7000,
  c24: 31.0000,
  c25: 6.3000,
  c26: 81.3000,
  c27: 56.6000,
  c28: 31.9000,
  c29: 7.2000,
  c30: 82.2000,
  c31: 57.5000,
  c32: 32.8000,
  c33: 8.1000,
  c34: 83.1000,
  c35: 58.4000,
  c36: 33.7000,
  c37: 9.0000,
  c38: 84.0000,
  c39: 59.3000,
  c40: 34.6000,
  c41: 9.9000,
  c42: 84.9000,
  c43: 60.2000,
  c44: 35.5000,
  c45: 10.8000,
  c46: 85.8000,
  c47: 61.1000,
  c48: 36.4000,
  c49: 11.7000,
  c50: 86.7000,
  c51: 62.0000,
  c52: 37.3000,
  c53: 12.6000,
  c54: 87.6000,
  c55: 62.9000,
  c56: 38.2000,
  c57: 13.5000,
  c58: 88.5000,
  c59: 63.8000,
  c60: 39.1000,
  c61: 14.4000,
  c62: 89.4000,
  c63: 64.7000,
  c64: 40.0000,
  c65: 15.3000,
  c66: 90.3000,
  c67: 65.6000,
  c68: 40.9000,
  c69: 16.2000,
  c70: 91.2000,
  c71: 66.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_044_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_044_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_044_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_044_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_044_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_044_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_044_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_044_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_044_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_044_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
