import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 125 — TAS/education. */
export const V1014_PUBSVC_KPI_SCENARIO_125_META = {
  id: 'kpi_125',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 123892,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_125_COEF = {
  c0: 79.2000,
  c1: 5.9000,
  c2: 32.3000,
  c3: 58.7000,
  c4: 85.1000,
  c5: 11.8000,
  c6: 38.2000,
  c7: 64.6000,
  c8: 91.0000,
  c9: 17.7000,
  c10: 44.1000,
  c11: 70.5000,
  c12: 96.9000,
  c13: 23.6000,
  c14: 50.0000,
  c15: 76.4000,
  c16: 3.1000,
  c17: 29.5000,
  c18: 55.9000,
  c19: 82.3000,
  c20: 9.0000,
  c21: 35.4000,
  c22: 61.8000,
  c23: 88.2000,
  c24: 14.9000,
  c25: 41.3000,
  c26: 67.7000,
  c27: 94.1000,
  c28: 20.8000,
  c29: 47.2000,
  c30: 73.6000,
  c31: 0.3000,
  c32: 26.7000,
  c33: 53.1000,
  c34: 79.5000,
  c35: 6.2000,
  c36: 32.6000,
  c37: 59.0000,
  c38: 85.4000,
  c39: 12.1000,
  c40: 38.5000,
  c41: 64.9000,
  c42: 91.3000,
  c43: 18.0000,
  c44: 44.4000,
  c45: 70.8000,
  c46: 97.2000,
  c47: 23.9000,
  c48: 50.3000,
  c49: 76.7000,
  c50: 3.4000,
  c51: 29.8000,
  c52: 56.2000,
  c53: 82.6000,
  c54: 9.3000,
  c55: 35.7000,
  c56: 62.1000,
  c57: 88.5000,
  c58: 15.2000,
  c59: 41.6000,
  c60: 68.0000,
  c61: 94.4000,
  c62: 21.1000,
  c63: 47.5000,
  c64: 73.9000,
  c65: 0.6000,
  c66: 27.0000,
  c67: 53.4000,
  c68: 79.8000,
  c69: 6.5000,
  c70: 32.9000,
  c71: 59.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_125_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_125_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_125_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_125_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_125_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_125_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_125_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_125_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_125_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_125_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
