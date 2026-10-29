import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 129 — VIC/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_129_META = {
  id: 'kpi_129',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 127856,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_129_COEF = {
  c0: 72.0000,
  c1: 96.0000,
  c2: 20.3000,
  c3: 44.3000,
  c4: 68.3000,
  c5: 92.3000,
  c6: 16.6000,
  c7: 40.6000,
  c8: 64.6000,
  c9: 88.6000,
  c10: 12.9000,
  c11: 36.9000,
  c12: 60.9000,
  c13: 84.9000,
  c14: 9.2000,
  c15: 33.2000,
  c16: 57.2000,
  c17: 81.2000,
  c18: 5.5000,
  c19: 29.5000,
  c20: 53.5000,
  c21: 77.5000,
  c22: 1.8000,
  c23: 25.8000,
  c24: 49.8000,
  c25: 73.8000,
  c26: 97.8000,
  c27: 22.1000,
  c28: 46.1000,
  c29: 70.1000,
  c30: 94.1000,
  c31: 18.4000,
  c32: 42.4000,
  c33: 66.4000,
  c34: 90.4000,
  c35: 14.7000,
  c36: 38.7000,
  c37: 62.7000,
  c38: 86.7000,
  c39: 11.0000,
  c40: 35.0000,
  c41: 59.0000,
  c42: 83.0000,
  c43: 7.3000,
  c44: 31.3000,
  c45: 55.3000,
  c46: 79.3000,
  c47: 3.6000,
  c48: 27.6000,
  c49: 51.6000,
  c50: 75.6000,
  c51: 99.6000,
  c52: 23.9000,
  c53: 47.9000,
  c54: 71.9000,
  c55: 95.9000,
  c56: 20.2000,
  c57: 44.2000,
  c58: 68.2000,
  c59: 92.2000,
  c60: 16.5000,
  c61: 40.5000,
  c62: 64.5000,
  c63: 88.5000,
  c64: 12.8000,
  c65: 36.8000,
  c66: 60.8000,
  c67: 84.8000,
  c68: 9.1000,
  c69: 33.1000,
  c70: 57.1000,
  c71: 81.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_129_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_129_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_129_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_129_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_129_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_129_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_129_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_129_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_129_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_129_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
