import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 014 — NT/education. */
export const V1014_PUBSVC_KPI_SCENARIO_014_META = {
  id: 'kpi_014',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 13891,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_014_COEF = {
  c0: 79.6000,
  c1: 72.9000,
  c2: 66.2000,
  c3: 59.5000,
  c4: 52.8000,
  c5: 46.1000,
  c6: 39.4000,
  c7: 32.7000,
  c8: 26.0000,
  c9: 19.3000,
  c10: 12.6000,
  c11: 5.9000,
  c12: 98.9000,
  c13: 92.2000,
  c14: 85.5000,
  c15: 78.8000,
  c16: 72.1000,
  c17: 65.4000,
  c18: 58.7000,
  c19: 52.0000,
  c20: 45.3000,
  c21: 38.6000,
  c22: 31.9000,
  c23: 25.2000,
  c24: 18.5000,
  c25: 11.8000,
  c26: 5.1000,
  c27: 98.1000,
  c28: 91.4000,
  c29: 84.7000,
  c30: 78.0000,
  c31: 71.3000,
  c32: 64.6000,
  c33: 57.9000,
  c34: 51.2000,
  c35: 44.5000,
  c36: 37.8000,
  c37: 31.1000,
  c38: 24.4000,
  c39: 17.7000,
  c40: 11.0000,
  c41: 4.3000,
  c42: 97.3000,
  c43: 90.6000,
  c44: 83.9000,
  c45: 77.2000,
  c46: 70.5000,
  c47: 63.8000,
  c48: 57.1000,
  c49: 50.4000,
  c50: 43.7000,
  c51: 37.0000,
  c52: 30.3000,
  c53: 23.6000,
  c54: 16.9000,
  c55: 10.2000,
  c56: 3.5000,
  c57: 96.5000,
  c58: 89.8000,
  c59: 83.1000,
  c60: 76.4000,
  c61: 69.7000,
  c62: 63.0000,
  c63: 56.3000,
  c64: 49.6000,
  c65: 42.9000,
  c66: 36.2000,
  c67: 29.5000,
  c68: 22.8000,
  c69: 16.1000,
  c70: 9.4000,
  c71: 2.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_014_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_014_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_014_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_014_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_014_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_014_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_014_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_014_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_014_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_014_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
