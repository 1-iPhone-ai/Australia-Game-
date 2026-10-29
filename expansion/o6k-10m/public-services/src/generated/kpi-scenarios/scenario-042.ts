import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 042 — QLD/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_042_META = {
  id: 'kpi_042',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 41639,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_042_COEF = {
  c0: 29.2000,
  c1: 5.7000,
  c2: 81.9000,
  c3: 58.4000,
  c4: 34.9000,
  c5: 11.4000,
  c6: 87.6000,
  c7: 64.1000,
  c8: 40.6000,
  c9: 17.1000,
  c10: 93.3000,
  c11: 69.8000,
  c12: 46.3000,
  c13: 22.8000,
  c14: 99.0000,
  c15: 75.5000,
  c16: 52.0000,
  c17: 28.5000,
  c18: 5.0000,
  c19: 81.2000,
  c20: 57.7000,
  c21: 34.2000,
  c22: 10.7000,
  c23: 86.9000,
  c24: 63.4000,
  c25: 39.9000,
  c26: 16.4000,
  c27: 92.6000,
  c28: 69.1000,
  c29: 45.6000,
  c30: 22.1000,
  c31: 98.3000,
  c32: 74.8000,
  c33: 51.3000,
  c34: 27.8000,
  c35: 4.3000,
  c36: 80.5000,
  c37: 57.0000,
  c38: 33.5000,
  c39: 10.0000,
  c40: 86.2000,
  c41: 62.7000,
  c42: 39.2000,
  c43: 15.7000,
  c44: 91.9000,
  c45: 68.4000,
  c46: 44.9000,
  c47: 21.4000,
  c48: 97.6000,
  c49: 74.1000,
  c50: 50.6000,
  c51: 27.1000,
  c52: 3.6000,
  c53: 79.8000,
  c54: 56.3000,
  c55: 32.8000,
  c56: 9.3000,
  c57: 85.5000,
  c58: 62.0000,
  c59: 38.5000,
  c60: 15.0000,
  c61: 91.2000,
  c62: 67.7000,
  c63: 44.2000,
  c64: 20.7000,
  c65: 96.9000,
  c66: 73.4000,
  c67: 49.9000,
  c68: 26.4000,
  c69: 2.9000,
  c70: 79.1000,
  c71: 55.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_042_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_042_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_042_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_042_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_042_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_042_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_042_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_042_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_042_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_042_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
