import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 006 — NT/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_006_META = {
  id: 'kpi_006',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 5963,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_006_COEF = {
  c0: 94.0000,
  c1: 92.1000,
  c2: 90.2000,
  c3: 88.3000,
  c4: 86.4000,
  c5: 84.5000,
  c6: 82.6000,
  c7: 80.7000,
  c8: 78.8000,
  c9: 76.9000,
  c10: 75.0000,
  c11: 73.1000,
  c12: 71.2000,
  c13: 69.3000,
  c14: 67.4000,
  c15: 65.5000,
  c16: 63.6000,
  c17: 61.7000,
  c18: 59.8000,
  c19: 57.9000,
  c20: 56.0000,
  c21: 54.1000,
  c22: 52.2000,
  c23: 50.3000,
  c24: 48.4000,
  c25: 46.5000,
  c26: 44.6000,
  c27: 42.7000,
  c28: 40.8000,
  c29: 38.9000,
  c30: 37.0000,
  c31: 35.1000,
  c32: 33.2000,
  c33: 31.3000,
  c34: 29.4000,
  c35: 27.5000,
  c36: 25.6000,
  c37: 23.7000,
  c38: 21.8000,
  c39: 19.9000,
  c40: 18.0000,
  c41: 16.1000,
  c42: 14.2000,
  c43: 12.3000,
  c44: 10.4000,
  c45: 8.5000,
  c46: 6.6000,
  c47: 4.7000,
  c48: 2.8000,
  c49: 0.9000,
  c50: 98.7000,
  c51: 96.8000,
  c52: 94.9000,
  c53: 93.0000,
  c54: 91.1000,
  c55: 89.2000,
  c56: 87.3000,
  c57: 85.4000,
  c58: 83.5000,
  c59: 81.6000,
  c60: 79.7000,
  c61: 77.8000,
  c62: 75.9000,
  c63: 74.0000,
  c64: 72.1000,
  c65: 70.2000,
  c66: 68.3000,
  c67: 66.4000,
  c68: 64.5000,
  c69: 62.6000,
  c70: 60.7000,
  c71: 58.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_006_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_006_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_006_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_006_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_006_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_006_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_006_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_006_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_006_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_006_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
