import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 055 — ACT/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_055_META = {
  id: 'kpi_055',
  regionId: 'ACT' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 54522,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_055_COEF = {
  c0: 5.8000,
  c1: 74.2000,
  c2: 42.9000,
  c3: 11.6000,
  c4: 80.0000,
  c5: 48.7000,
  c6: 17.4000,
  c7: 85.8000,
  c8: 54.5000,
  c9: 23.2000,
  c10: 91.6000,
  c11: 60.3000,
  c12: 29.0000,
  c13: 97.4000,
  c14: 66.1000,
  c15: 34.8000,
  c16: 3.5000,
  c17: 71.9000,
  c18: 40.6000,
  c19: 9.3000,
  c20: 77.7000,
  c21: 46.4000,
  c22: 15.1000,
  c23: 83.5000,
  c24: 52.2000,
  c25: 20.9000,
  c26: 89.3000,
  c27: 58.0000,
  c28: 26.7000,
  c29: 95.1000,
  c30: 63.8000,
  c31: 32.5000,
  c32: 1.2000,
  c33: 69.6000,
  c34: 38.3000,
  c35: 7.0000,
  c36: 75.4000,
  c37: 44.1000,
  c38: 12.8000,
  c39: 81.2000,
  c40: 49.9000,
  c41: 18.6000,
  c42: 87.0000,
  c43: 55.7000,
  c44: 24.4000,
  c45: 92.8000,
  c46: 61.5000,
  c47: 30.2000,
  c48: 98.6000,
  c49: 67.3000,
  c50: 36.0000,
  c51: 4.7000,
  c52: 73.1000,
  c53: 41.8000,
  c54: 10.5000,
  c55: 78.9000,
  c56: 47.6000,
  c57: 16.3000,
  c58: 84.7000,
  c59: 53.4000,
  c60: 22.1000,
  c61: 90.5000,
  c62: 59.2000,
  c63: 27.9000,
  c64: 96.3000,
  c65: 65.0000,
  c66: 33.7000,
  c67: 2.4000,
  c68: 70.8000,
  c69: 39.5000,
  c70: 8.2000,
  c71: 76.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_055_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_055_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_055_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_055_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_055_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_055_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_055_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_055_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_055_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_055_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
