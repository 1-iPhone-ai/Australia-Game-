import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 136 — NSW/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_136_META = {
  id: 'kpi_136',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 134793,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_136_COEF = {
  c0: 59.4000,
  c1: 79.2000,
  c2: 99.0000,
  c3: 19.1000,
  c4: 38.9000,
  c5: 58.7000,
  c6: 78.5000,
  c7: 98.3000,
  c8: 18.4000,
  c9: 38.2000,
  c10: 58.0000,
  c11: 77.8000,
  c12: 97.6000,
  c13: 17.7000,
  c14: 37.5000,
  c15: 57.3000,
  c16: 77.1000,
  c17: 96.9000,
  c18: 17.0000,
  c19: 36.8000,
  c20: 56.6000,
  c21: 76.4000,
  c22: 96.2000,
  c23: 16.3000,
  c24: 36.1000,
  c25: 55.9000,
  c26: 75.7000,
  c27: 95.5000,
  c28: 15.6000,
  c29: 35.4000,
  c30: 55.2000,
  c31: 75.0000,
  c32: 94.8000,
  c33: 14.9000,
  c34: 34.7000,
  c35: 54.5000,
  c36: 74.3000,
  c37: 94.1000,
  c38: 14.2000,
  c39: 34.0000,
  c40: 53.8000,
  c41: 73.6000,
  c42: 93.4000,
  c43: 13.5000,
  c44: 33.3000,
  c45: 53.1000,
  c46: 72.9000,
  c47: 92.7000,
  c48: 12.8000,
  c49: 32.6000,
  c50: 52.4000,
  c51: 72.2000,
  c52: 92.0000,
  c53: 12.1000,
  c54: 31.9000,
  c55: 51.7000,
  c56: 71.5000,
  c57: 91.3000,
  c58: 11.4000,
  c59: 31.2000,
  c60: 51.0000,
  c61: 70.8000,
  c62: 90.6000,
  c63: 10.7000,
  c64: 30.5000,
  c65: 50.3000,
  c66: 70.1000,
  c67: 89.9000,
  c68: 10.0000,
  c69: 29.8000,
  c70: 49.6000,
  c71: 69.4000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_136_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_136_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_136_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_136_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_136_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_136_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_136_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_136_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_136_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_136_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
