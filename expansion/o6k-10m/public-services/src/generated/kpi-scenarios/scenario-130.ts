import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 130 — QLD/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_130_META = {
  id: 'kpi_130',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 128847,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_130_COEF = {
  c0: 70.2000,
  c1: 93.6000,
  c2: 17.3000,
  c3: 40.7000,
  c4: 64.1000,
  c5: 87.5000,
  c6: 11.2000,
  c7: 34.6000,
  c8: 58.0000,
  c9: 81.4000,
  c10: 5.1000,
  c11: 28.5000,
  c12: 51.9000,
  c13: 75.3000,
  c14: 98.7000,
  c15: 22.4000,
  c16: 45.8000,
  c17: 69.2000,
  c18: 92.6000,
  c19: 16.3000,
  c20: 39.7000,
  c21: 63.1000,
  c22: 86.5000,
  c23: 10.2000,
  c24: 33.6000,
  c25: 57.0000,
  c26: 80.4000,
  c27: 4.1000,
  c28: 27.5000,
  c29: 50.9000,
  c30: 74.3000,
  c31: 97.7000,
  c32: 21.4000,
  c33: 44.8000,
  c34: 68.2000,
  c35: 91.6000,
  c36: 15.3000,
  c37: 38.7000,
  c38: 62.1000,
  c39: 85.5000,
  c40: 9.2000,
  c41: 32.6000,
  c42: 56.0000,
  c43: 79.4000,
  c44: 3.1000,
  c45: 26.5000,
  c46: 49.9000,
  c47: 73.3000,
  c48: 96.7000,
  c49: 20.4000,
  c50: 43.8000,
  c51: 67.2000,
  c52: 90.6000,
  c53: 14.3000,
  c54: 37.7000,
  c55: 61.1000,
  c56: 84.5000,
  c57: 8.2000,
  c58: 31.6000,
  c59: 55.0000,
  c60: 78.4000,
  c61: 2.1000,
  c62: 25.5000,
  c63: 48.9000,
  c64: 72.3000,
  c65: 95.7000,
  c66: 19.4000,
  c67: 42.8000,
  c68: 66.2000,
  c69: 89.6000,
  c70: 13.3000,
  c71: 36.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_130_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_130_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_130_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_130_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_130_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_130_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_130_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_130_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_130_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_130_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
