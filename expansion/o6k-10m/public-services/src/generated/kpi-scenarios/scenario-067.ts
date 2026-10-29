import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 067 — WA/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_067_META = {
  id: 'kpi_067',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 66414,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_067_COEF = {
  c0: 83.9000,
  c1: 45.4000,
  c2: 6.9000,
  c3: 68.1000,
  c4: 29.6000,
  c5: 90.8000,
  c6: 52.3000,
  c7: 13.8000,
  c8: 75.0000,
  c9: 36.5000,
  c10: 97.7000,
  c11: 59.2000,
  c12: 20.7000,
  c13: 81.9000,
  c14: 43.4000,
  c15: 4.9000,
  c16: 66.1000,
  c17: 27.6000,
  c18: 88.8000,
  c19: 50.3000,
  c20: 11.8000,
  c21: 73.0000,
  c22: 34.5000,
  c23: 95.7000,
  c24: 57.2000,
  c25: 18.7000,
  c26: 79.9000,
  c27: 41.4000,
  c28: 2.9000,
  c29: 64.1000,
  c30: 25.6000,
  c31: 86.8000,
  c32: 48.3000,
  c33: 9.8000,
  c34: 71.0000,
  c35: 32.5000,
  c36: 93.7000,
  c37: 55.2000,
  c38: 16.7000,
  c39: 77.9000,
  c40: 39.4000,
  c41: 0.9000,
  c42: 62.1000,
  c43: 23.6000,
  c44: 84.8000,
  c45: 46.3000,
  c46: 7.8000,
  c47: 69.0000,
  c48: 30.5000,
  c49: 91.7000,
  c50: 53.2000,
  c51: 14.7000,
  c52: 75.9000,
  c53: 37.4000,
  c54: 98.6000,
  c55: 60.1000,
  c56: 21.6000,
  c57: 82.8000,
  c58: 44.3000,
  c59: 5.8000,
  c60: 67.0000,
  c61: 28.5000,
  c62: 89.7000,
  c63: 51.2000,
  c64: 12.7000,
  c65: 73.9000,
  c66: 35.4000,
  c67: 96.6000,
  c68: 58.1000,
  c69: 19.6000,
  c70: 80.8000,
  c71: 42.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_067_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_067_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_067_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_067_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_067_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_067_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_067_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_067_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_067_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_067_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
