import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 139 — WA/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_139_META = {
  id: 'kpi_139',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 137766,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_139_COEF = {
  c0: 54.0000,
  c1: 72.0000,
  c2: 90.0000,
  c3: 8.3000,
  c4: 26.3000,
  c5: 44.3000,
  c6: 62.3000,
  c7: 80.3000,
  c8: 98.3000,
  c9: 16.6000,
  c10: 34.6000,
  c11: 52.6000,
  c12: 70.6000,
  c13: 88.6000,
  c14: 6.9000,
  c15: 24.9000,
  c16: 42.9000,
  c17: 60.9000,
  c18: 78.9000,
  c19: 96.9000,
  c20: 15.2000,
  c21: 33.2000,
  c22: 51.2000,
  c23: 69.2000,
  c24: 87.2000,
  c25: 5.5000,
  c26: 23.5000,
  c27: 41.5000,
  c28: 59.5000,
  c29: 77.5000,
  c30: 95.5000,
  c31: 13.8000,
  c32: 31.8000,
  c33: 49.8000,
  c34: 67.8000,
  c35: 85.8000,
  c36: 4.1000,
  c37: 22.1000,
  c38: 40.1000,
  c39: 58.1000,
  c40: 76.1000,
  c41: 94.1000,
  c42: 12.4000,
  c43: 30.4000,
  c44: 48.4000,
  c45: 66.4000,
  c46: 84.4000,
  c47: 2.7000,
  c48: 20.7000,
  c49: 38.7000,
  c50: 56.7000,
  c51: 74.7000,
  c52: 92.7000,
  c53: 11.0000,
  c54: 29.0000,
  c55: 47.0000,
  c56: 65.0000,
  c57: 83.0000,
  c58: 1.3000,
  c59: 19.3000,
  c60: 37.3000,
  c61: 55.3000,
  c62: 73.3000,
  c63: 91.3000,
  c64: 9.6000,
  c65: 27.6000,
  c66: 45.6000,
  c67: 63.6000,
  c68: 81.6000,
  c69: 99.6000,
  c70: 17.9000,
  c71: 35.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_139_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_139_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_139_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_139_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_139_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_139_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_139_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_139_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_139_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_139_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
