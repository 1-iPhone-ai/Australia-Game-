import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 106 — QLD/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_106_META = {
  id: 'kpi_106',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 105063,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_106_COEF = {
  c0: 13.7000,
  c1: 51.5000,
  c2: 89.3000,
  c3: 27.4000,
  c4: 65.2000,
  c5: 3.3000,
  c6: 41.1000,
  c7: 78.9000,
  c8: 17.0000,
  c9: 54.8000,
  c10: 92.6000,
  c11: 30.7000,
  c12: 68.5000,
  c13: 6.6000,
  c14: 44.4000,
  c15: 82.2000,
  c16: 20.3000,
  c17: 58.1000,
  c18: 95.9000,
  c19: 34.0000,
  c20: 71.8000,
  c21: 9.9000,
  c22: 47.7000,
  c23: 85.5000,
  c24: 23.6000,
  c25: 61.4000,
  c26: 99.2000,
  c27: 37.3000,
  c28: 75.1000,
  c29: 13.2000,
  c30: 51.0000,
  c31: 88.8000,
  c32: 26.9000,
  c33: 64.7000,
  c34: 2.8000,
  c35: 40.6000,
  c36: 78.4000,
  c37: 16.5000,
  c38: 54.3000,
  c39: 92.1000,
  c40: 30.2000,
  c41: 68.0000,
  c42: 6.1000,
  c43: 43.9000,
  c44: 81.7000,
  c45: 19.8000,
  c46: 57.6000,
  c47: 95.4000,
  c48: 33.5000,
  c49: 71.3000,
  c50: 9.4000,
  c51: 47.2000,
  c52: 85.0000,
  c53: 23.1000,
  c54: 60.9000,
  c55: 98.7000,
  c56: 36.8000,
  c57: 74.6000,
  c58: 12.7000,
  c59: 50.5000,
  c60: 88.3000,
  c61: 26.4000,
  c62: 64.2000,
  c63: 2.3000,
  c64: 40.1000,
  c65: 77.9000,
  c66: 16.0000,
  c67: 53.8000,
  c68: 91.6000,
  c69: 29.7000,
  c70: 67.5000,
  c71: 5.6000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_106_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_106_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_106_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_106_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_106_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_106_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_106_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_106_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_106_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_106_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
