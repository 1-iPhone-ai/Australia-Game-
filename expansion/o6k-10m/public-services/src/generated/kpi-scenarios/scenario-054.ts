import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 054 — NT/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_054_META = {
  id: 'kpi_054',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 53531,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_054_COEF = {
  c0: 7.6000,
  c1: 76.6000,
  c2: 45.9000,
  c3: 15.2000,
  c4: 84.2000,
  c5: 53.5000,
  c6: 22.8000,
  c7: 91.8000,
  c8: 61.1000,
  c9: 30.4000,
  c10: 99.4000,
  c11: 68.7000,
  c12: 38.0000,
  c13: 7.3000,
  c14: 76.3000,
  c15: 45.6000,
  c16: 14.9000,
  c17: 83.9000,
  c18: 53.2000,
  c19: 22.5000,
  c20: 91.5000,
  c21: 60.8000,
  c22: 30.1000,
  c23: 99.1000,
  c24: 68.4000,
  c25: 37.7000,
  c26: 7.0000,
  c27: 76.0000,
  c28: 45.3000,
  c29: 14.6000,
  c30: 83.6000,
  c31: 52.9000,
  c32: 22.2000,
  c33: 91.2000,
  c34: 60.5000,
  c35: 29.8000,
  c36: 98.8000,
  c37: 68.1000,
  c38: 37.4000,
  c39: 6.7000,
  c40: 75.7000,
  c41: 45.0000,
  c42: 14.3000,
  c43: 83.3000,
  c44: 52.6000,
  c45: 21.9000,
  c46: 90.9000,
  c47: 60.2000,
  c48: 29.5000,
  c49: 98.5000,
  c50: 67.8000,
  c51: 37.1000,
  c52: 6.4000,
  c53: 75.4000,
  c54: 44.7000,
  c55: 14.0000,
  c56: 83.0000,
  c57: 52.3000,
  c58: 21.6000,
  c59: 90.6000,
  c60: 59.9000,
  c61: 29.2000,
  c62: 98.2000,
  c63: 67.5000,
  c64: 36.8000,
  c65: 6.1000,
  c66: 75.1000,
  c67: 44.4000,
  c68: 13.7000,
  c69: 82.7000,
  c70: 52.0000,
  c71: 21.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_054_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_054_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_054_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_054_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_054_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_054_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_054_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_054_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_054_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_054_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
