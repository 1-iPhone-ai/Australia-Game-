import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 053 — TAS/education. */
export const V1014_PUBSVC_KPI_SCENARIO_053_META = {
  id: 'kpi_053',
  regionId: 'TAS' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 52540,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_053_COEF = {
  c0: 9.4000,
  c1: 79.0000,
  c2: 48.9000,
  c3: 18.8000,
  c4: 88.4000,
  c5: 58.3000,
  c6: 28.2000,
  c7: 97.8000,
  c8: 67.7000,
  c9: 37.6000,
  c10: 7.5000,
  c11: 77.1000,
  c12: 47.0000,
  c13: 16.9000,
  c14: 86.5000,
  c15: 56.4000,
  c16: 26.3000,
  c17: 95.9000,
  c18: 65.8000,
  c19: 35.7000,
  c20: 5.6000,
  c21: 75.2000,
  c22: 45.1000,
  c23: 15.0000,
  c24: 84.6000,
  c25: 54.5000,
  c26: 24.4000,
  c27: 94.0000,
  c28: 63.9000,
  c29: 33.8000,
  c30: 3.7000,
  c31: 73.3000,
  c32: 43.2000,
  c33: 13.1000,
  c34: 82.7000,
  c35: 52.6000,
  c36: 22.5000,
  c37: 92.1000,
  c38: 62.0000,
  c39: 31.9000,
  c40: 1.8000,
  c41: 71.4000,
  c42: 41.3000,
  c43: 11.2000,
  c44: 80.8000,
  c45: 50.7000,
  c46: 20.6000,
  c47: 90.2000,
  c48: 60.1000,
  c49: 30.0000,
  c50: 99.6000,
  c51: 69.5000,
  c52: 39.4000,
  c53: 9.3000,
  c54: 78.9000,
  c55: 48.8000,
  c56: 18.7000,
  c57: 88.3000,
  c58: 58.2000,
  c59: 28.1000,
  c60: 97.7000,
  c61: 67.6000,
  c62: 37.5000,
  c63: 7.4000,
  c64: 77.0000,
  c65: 46.9000,
  c66: 16.8000,
  c67: 86.4000,
  c68: 56.3000,
  c69: 26.2000,
  c70: 95.8000,
  c71: 65.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_053_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_053_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_053_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_053_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_053_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_053_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_053_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_053_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_053_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_053_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
