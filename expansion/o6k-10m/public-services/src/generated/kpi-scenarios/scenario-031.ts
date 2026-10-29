import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 031 — ACT/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_031_META = {
  id: 'kpi_031',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 30738,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_031_COEF = {
  c0: 49.0000,
  c1: 32.1000,
  c2: 15.2000,
  c3: 98.0000,
  c4: 81.1000,
  c5: 64.2000,
  c6: 47.3000,
  c7: 30.4000,
  c8: 13.5000,
  c9: 96.3000,
  c10: 79.4000,
  c11: 62.5000,
  c12: 45.6000,
  c13: 28.7000,
  c14: 11.8000,
  c15: 94.6000,
  c16: 77.7000,
  c17: 60.8000,
  c18: 43.9000,
  c19: 27.0000,
  c20: 10.1000,
  c21: 92.9000,
  c22: 76.0000,
  c23: 59.1000,
  c24: 42.2000,
  c25: 25.3000,
  c26: 8.4000,
  c27: 91.2000,
  c28: 74.3000,
  c29: 57.4000,
  c30: 40.5000,
  c31: 23.6000,
  c32: 6.7000,
  c33: 89.5000,
  c34: 72.6000,
  c35: 55.7000,
  c36: 38.8000,
  c37: 21.9000,
  c38: 5.0000,
  c39: 87.8000,
  c40: 70.9000,
  c41: 54.0000,
  c42: 37.1000,
  c43: 20.2000,
  c44: 3.3000,
  c45: 86.1000,
  c46: 69.2000,
  c47: 52.3000,
  c48: 35.4000,
  c49: 18.5000,
  c50: 1.6000,
  c51: 84.4000,
  c52: 67.5000,
  c53: 50.6000,
  c54: 33.7000,
  c55: 16.8000,
  c56: 99.6000,
  c57: 82.7000,
  c58: 65.8000,
  c59: 48.9000,
  c60: 32.0000,
  c61: 15.1000,
  c62: 97.9000,
  c63: 81.0000,
  c64: 64.1000,
  c65: 47.2000,
  c66: 30.3000,
  c67: 13.4000,
  c68: 96.2000,
  c69: 79.3000,
  c70: 62.4000,
  c71: 45.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_031_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_031_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_031_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_031_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_031_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_031_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_031_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_031_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_031_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_031_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
