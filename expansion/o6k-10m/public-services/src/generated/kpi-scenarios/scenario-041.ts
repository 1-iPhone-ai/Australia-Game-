import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 041 — VIC/education. */
export const V1014_PUBSVC_KPI_SCENARIO_041_META = {
  id: 'kpi_041',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 40648,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_041_COEF = {
  c0: 31.0000,
  c1: 8.1000,
  c2: 84.9000,
  c3: 62.0000,
  c4: 39.1000,
  c5: 16.2000,
  c6: 93.0000,
  c7: 70.1000,
  c8: 47.2000,
  c9: 24.3000,
  c10: 1.4000,
  c11: 78.2000,
  c12: 55.3000,
  c13: 32.4000,
  c14: 9.5000,
  c15: 86.3000,
  c16: 63.4000,
  c17: 40.5000,
  c18: 17.6000,
  c19: 94.4000,
  c20: 71.5000,
  c21: 48.6000,
  c22: 25.7000,
  c23: 2.8000,
  c24: 79.6000,
  c25: 56.7000,
  c26: 33.8000,
  c27: 10.9000,
  c28: 87.7000,
  c29: 64.8000,
  c30: 41.9000,
  c31: 19.0000,
  c32: 95.8000,
  c33: 72.9000,
  c34: 50.0000,
  c35: 27.1000,
  c36: 4.2000,
  c37: 81.0000,
  c38: 58.1000,
  c39: 35.2000,
  c40: 12.3000,
  c41: 89.1000,
  c42: 66.2000,
  c43: 43.3000,
  c44: 20.4000,
  c45: 97.2000,
  c46: 74.3000,
  c47: 51.4000,
  c48: 28.5000,
  c49: 5.6000,
  c50: 82.4000,
  c51: 59.5000,
  c52: 36.6000,
  c53: 13.7000,
  c54: 90.5000,
  c55: 67.6000,
  c56: 44.7000,
  c57: 21.8000,
  c58: 98.6000,
  c59: 75.7000,
  c60: 52.8000,
  c61: 29.9000,
  c62: 7.0000,
  c63: 83.8000,
  c64: 60.9000,
  c65: 38.0000,
  c66: 15.1000,
  c67: 91.9000,
  c68: 69.0000,
  c69: 46.1000,
  c70: 23.2000,
  c71: 0.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_041_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_041_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_041_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_041_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_041_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_041_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_041_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_041_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_041_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_041_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
