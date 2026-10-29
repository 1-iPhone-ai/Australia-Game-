import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 151 — ACT/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_151_META = {
  id: 'kpi_151',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 149658,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_151_COEF = {
  c0: 32.4000,
  c1: 43.2000,
  c2: 54.0000,
  c3: 64.8000,
  c4: 75.6000,
  c5: 86.4000,
  c6: 97.2000,
  c7: 8.3000,
  c8: 19.1000,
  c9: 29.9000,
  c10: 40.7000,
  c11: 51.5000,
  c12: 62.3000,
  c13: 73.1000,
  c14: 83.9000,
  c15: 94.7000,
  c16: 5.8000,
  c17: 16.6000,
  c18: 27.4000,
  c19: 38.2000,
  c20: 49.0000,
  c21: 59.8000,
  c22: 70.6000,
  c23: 81.4000,
  c24: 92.2000,
  c25: 3.3000,
  c26: 14.1000,
  c27: 24.9000,
  c28: 35.7000,
  c29: 46.5000,
  c30: 57.3000,
  c31: 68.1000,
  c32: 78.9000,
  c33: 89.7000,
  c34: 0.8000,
  c35: 11.6000,
  c36: 22.4000,
  c37: 33.2000,
  c38: 44.0000,
  c39: 54.8000,
  c40: 65.6000,
  c41: 76.4000,
  c42: 87.2000,
  c43: 98.0000,
  c44: 9.1000,
  c45: 19.9000,
  c46: 30.7000,
  c47: 41.5000,
  c48: 52.3000,
  c49: 63.1000,
  c50: 73.9000,
  c51: 84.7000,
  c52: 95.5000,
  c53: 6.6000,
  c54: 17.4000,
  c55: 28.2000,
  c56: 39.0000,
  c57: 49.8000,
  c58: 60.6000,
  c59: 71.4000,
  c60: 82.2000,
  c61: 93.0000,
  c62: 4.1000,
  c63: 14.9000,
  c64: 25.7000,
  c65: 36.5000,
  c66: 47.3000,
  c67: 58.1000,
  c68: 68.9000,
  c69: 79.7000,
  c70: 90.5000,
  c71: 1.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_151_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_151_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_151_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_151_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_151_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_151_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_151_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_151_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_151_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_151_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
