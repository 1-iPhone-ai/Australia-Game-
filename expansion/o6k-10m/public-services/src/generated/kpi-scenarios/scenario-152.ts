import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 152 — NSW/education. */
export const V1014_PUBSVC_KPI_SCENARIO_152_META = {
  id: 'kpi_152',
  regionId: 'NSW' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 150649,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_152_COEF = {
  c0: 30.6000,
  c1: 40.8000,
  c2: 51.0000,
  c3: 61.2000,
  c4: 71.4000,
  c5: 81.6000,
  c6: 91.8000,
  c7: 2.3000,
  c8: 12.5000,
  c9: 22.7000,
  c10: 32.9000,
  c11: 43.1000,
  c12: 53.3000,
  c13: 63.5000,
  c14: 73.7000,
  c15: 83.9000,
  c16: 94.1000,
  c17: 4.6000,
  c18: 14.8000,
  c19: 25.0000,
  c20: 35.2000,
  c21: 45.4000,
  c22: 55.6000,
  c23: 65.8000,
  c24: 76.0000,
  c25: 86.2000,
  c26: 96.4000,
  c27: 6.9000,
  c28: 17.1000,
  c29: 27.3000,
  c30: 37.5000,
  c31: 47.7000,
  c32: 57.9000,
  c33: 68.1000,
  c34: 78.3000,
  c35: 88.5000,
  c36: 98.7000,
  c37: 9.2000,
  c38: 19.4000,
  c39: 29.6000,
  c40: 39.8000,
  c41: 50.0000,
  c42: 60.2000,
  c43: 70.4000,
  c44: 80.6000,
  c45: 90.8000,
  c46: 1.3000,
  c47: 11.5000,
  c48: 21.7000,
  c49: 31.9000,
  c50: 42.1000,
  c51: 52.3000,
  c52: 62.5000,
  c53: 72.7000,
  c54: 82.9000,
  c55: 93.1000,
  c56: 3.6000,
  c57: 13.8000,
  c58: 24.0000,
  c59: 34.2000,
  c60: 44.4000,
  c61: 54.6000,
  c62: 64.8000,
  c63: 75.0000,
  c64: 85.2000,
  c65: 95.4000,
  c66: 5.9000,
  c67: 16.1000,
  c68: 26.3000,
  c69: 36.5000,
  c70: 46.7000,
  c71: 56.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_152_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_152_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_152_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_152_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_152_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_152_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_152_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_152_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_152_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_152_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
