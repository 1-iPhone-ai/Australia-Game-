import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 070 — NT/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_070_META = {
  id: 'kpi_070',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 69387,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_070_COEF = {
  c0: 78.5000,
  c1: 38.2000,
  c2: 97.6000,
  c3: 57.3000,
  c4: 17.0000,
  c5: 76.4000,
  c6: 36.1000,
  c7: 95.5000,
  c8: 55.2000,
  c9: 14.9000,
  c10: 74.3000,
  c11: 34.0000,
  c12: 93.4000,
  c13: 53.1000,
  c14: 12.8000,
  c15: 72.2000,
  c16: 31.9000,
  c17: 91.3000,
  c18: 51.0000,
  c19: 10.7000,
  c20: 70.1000,
  c21: 29.8000,
  c22: 89.2000,
  c23: 48.9000,
  c24: 8.6000,
  c25: 68.0000,
  c26: 27.7000,
  c27: 87.1000,
  c28: 46.8000,
  c29: 6.5000,
  c30: 65.9000,
  c31: 25.6000,
  c32: 85.0000,
  c33: 44.7000,
  c34: 4.4000,
  c35: 63.8000,
  c36: 23.5000,
  c37: 82.9000,
  c38: 42.6000,
  c39: 2.3000,
  c40: 61.7000,
  c41: 21.4000,
  c42: 80.8000,
  c43: 40.5000,
  c44: 0.2000,
  c45: 59.6000,
  c46: 19.3000,
  c47: 78.7000,
  c48: 38.4000,
  c49: 97.8000,
  c50: 57.5000,
  c51: 17.2000,
  c52: 76.6000,
  c53: 36.3000,
  c54: 95.7000,
  c55: 55.4000,
  c56: 15.1000,
  c57: 74.5000,
  c58: 34.2000,
  c59: 93.6000,
  c60: 53.3000,
  c61: 13.0000,
  c62: 72.4000,
  c63: 32.1000,
  c64: 91.5000,
  c65: 51.2000,
  c66: 10.9000,
  c67: 70.3000,
  c68: 30.0000,
  c69: 89.4000,
  c70: 49.1000,
  c71: 8.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_070_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_070_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_070_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_070_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_070_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_070_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_070_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_070_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_070_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_070_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
