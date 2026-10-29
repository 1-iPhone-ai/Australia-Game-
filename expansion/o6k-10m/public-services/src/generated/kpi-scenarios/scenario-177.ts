import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 177 — VIC/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_177_META = {
  id: 'kpi_177',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 175424,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_177_COEF = {
  c0: 85.3000,
  c1: 80.5000,
  c2: 75.7000,
  c3: 70.9000,
  c4: 66.1000,
  c5: 61.3000,
  c6: 56.5000,
  c7: 51.7000,
  c8: 46.9000,
  c9: 42.1000,
  c10: 37.3000,
  c11: 32.5000,
  c12: 27.7000,
  c13: 22.9000,
  c14: 18.1000,
  c15: 13.3000,
  c16: 8.5000,
  c17: 3.7000,
  c18: 98.6000,
  c19: 93.8000,
  c20: 89.0000,
  c21: 84.2000,
  c22: 79.4000,
  c23: 74.6000,
  c24: 69.8000,
  c25: 65.0000,
  c26: 60.2000,
  c27: 55.4000,
  c28: 50.6000,
  c29: 45.8000,
  c30: 41.0000,
  c31: 36.2000,
  c32: 31.4000,
  c33: 26.6000,
  c34: 21.8000,
  c35: 17.0000,
  c36: 12.2000,
  c37: 7.4000,
  c38: 2.6000,
  c39: 97.5000,
  c40: 92.7000,
  c41: 87.9000,
  c42: 83.1000,
  c43: 78.3000,
  c44: 73.5000,
  c45: 68.7000,
  c46: 63.9000,
  c47: 59.1000,
  c48: 54.3000,
  c49: 49.5000,
  c50: 44.7000,
  c51: 39.9000,
  c52: 35.1000,
  c53: 30.3000,
  c54: 25.5000,
  c55: 20.7000,
  c56: 15.9000,
  c57: 11.1000,
  c58: 6.3000,
  c59: 1.5000,
  c60: 96.4000,
  c61: 91.6000,
  c62: 86.8000,
  c63: 82.0000,
  c64: 77.2000,
  c65: 72.4000,
  c66: 67.6000,
  c67: 62.8000,
  c68: 58.0000,
  c69: 53.2000,
  c70: 48.4000,
  c71: 43.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_177_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_177_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_177_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_177_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_177_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_177_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_177_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_177_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_177_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_177_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
