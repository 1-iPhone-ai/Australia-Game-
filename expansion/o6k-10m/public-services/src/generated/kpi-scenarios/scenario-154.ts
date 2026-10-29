import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 154 — QLD/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_154_META = {
  id: 'kpi_154',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 152631,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_154_COEF = {
  c0: 27.0000,
  c1: 36.0000,
  c2: 45.0000,
  c3: 54.0000,
  c4: 63.0000,
  c5: 72.0000,
  c6: 81.0000,
  c7: 90.0000,
  c8: 99.0000,
  c9: 8.3000,
  c10: 17.3000,
  c11: 26.3000,
  c12: 35.3000,
  c13: 44.3000,
  c14: 53.3000,
  c15: 62.3000,
  c16: 71.3000,
  c17: 80.3000,
  c18: 89.3000,
  c19: 98.3000,
  c20: 7.6000,
  c21: 16.6000,
  c22: 25.6000,
  c23: 34.6000,
  c24: 43.6000,
  c25: 52.6000,
  c26: 61.6000,
  c27: 70.6000,
  c28: 79.6000,
  c29: 88.6000,
  c30: 97.6000,
  c31: 6.9000,
  c32: 15.9000,
  c33: 24.9000,
  c34: 33.9000,
  c35: 42.9000,
  c36: 51.9000,
  c37: 60.9000,
  c38: 69.9000,
  c39: 78.9000,
  c40: 87.9000,
  c41: 96.9000,
  c42: 6.2000,
  c43: 15.2000,
  c44: 24.2000,
  c45: 33.2000,
  c46: 42.2000,
  c47: 51.2000,
  c48: 60.2000,
  c49: 69.2000,
  c50: 78.2000,
  c51: 87.2000,
  c52: 96.2000,
  c53: 5.5000,
  c54: 14.5000,
  c55: 23.5000,
  c56: 32.5000,
  c57: 41.5000,
  c58: 50.5000,
  c59: 59.5000,
  c60: 68.5000,
  c61: 77.5000,
  c62: 86.5000,
  c63: 95.5000,
  c64: 4.8000,
  c65: 13.8000,
  c66: 22.8000,
  c67: 31.8000,
  c68: 40.8000,
  c69: 49.8000,
  c70: 58.8000,
  c71: 67.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_154_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_154_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_154_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_154_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_154_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_154_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_154_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_154_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_154_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_154_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
