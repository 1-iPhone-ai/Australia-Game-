import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 158 — NT/education. */
export const V1014_PUBSVC_KPI_SCENARIO_158_META = {
  id: 'kpi_158',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 156595,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_158_COEF = {
  c0: 19.8000,
  c1: 26.4000,
  c2: 33.0000,
  c3: 39.6000,
  c4: 46.2000,
  c5: 52.8000,
  c6: 59.4000,
  c7: 66.0000,
  c8: 72.6000,
  c9: 79.2000,
  c10: 85.8000,
  c11: 92.4000,
  c12: 99.0000,
  c13: 5.9000,
  c14: 12.5000,
  c15: 19.1000,
  c16: 25.7000,
  c17: 32.3000,
  c18: 38.9000,
  c19: 45.5000,
  c20: 52.1000,
  c21: 58.7000,
  c22: 65.3000,
  c23: 71.9000,
  c24: 78.5000,
  c25: 85.1000,
  c26: 91.7000,
  c27: 98.3000,
  c28: 5.2000,
  c29: 11.8000,
  c30: 18.4000,
  c31: 25.0000,
  c32: 31.6000,
  c33: 38.2000,
  c34: 44.8000,
  c35: 51.4000,
  c36: 58.0000,
  c37: 64.6000,
  c38: 71.2000,
  c39: 77.8000,
  c40: 84.4000,
  c41: 91.0000,
  c42: 97.6000,
  c43: 4.5000,
  c44: 11.1000,
  c45: 17.7000,
  c46: 24.3000,
  c47: 30.9000,
  c48: 37.5000,
  c49: 44.1000,
  c50: 50.7000,
  c51: 57.3000,
  c52: 63.9000,
  c53: 70.5000,
  c54: 77.1000,
  c55: 83.7000,
  c56: 90.3000,
  c57: 96.9000,
  c58: 3.8000,
  c59: 10.4000,
  c60: 17.0000,
  c61: 23.6000,
  c62: 30.2000,
  c63: 36.8000,
  c64: 43.4000,
  c65: 50.0000,
  c66: 56.6000,
  c67: 63.2000,
  c68: 69.8000,
  c69: 76.4000,
  c70: 83.0000,
  c71: 89.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_158_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_158_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_158_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_158_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_158_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_158_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_158_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_158_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_158_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_158_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
