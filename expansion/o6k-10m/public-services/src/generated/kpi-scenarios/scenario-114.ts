import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 114 — QLD/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_114_META = {
  id: 'kpi_114',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 112991,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_114_COEF = {
  c0: 99.0000,
  c1: 32.3000,
  c2: 65.3000,
  c3: 98.3000,
  c4: 31.6000,
  c5: 64.6000,
  c6: 97.6000,
  c7: 30.9000,
  c8: 63.9000,
  c9: 96.9000,
  c10: 30.2000,
  c11: 63.2000,
  c12: 96.2000,
  c13: 29.5000,
  c14: 62.5000,
  c15: 95.5000,
  c16: 28.8000,
  c17: 61.8000,
  c18: 94.8000,
  c19: 28.1000,
  c20: 61.1000,
  c21: 94.1000,
  c22: 27.4000,
  c23: 60.4000,
  c24: 93.4000,
  c25: 26.7000,
  c26: 59.7000,
  c27: 92.7000,
  c28: 26.0000,
  c29: 59.0000,
  c30: 92.0000,
  c31: 25.3000,
  c32: 58.3000,
  c33: 91.3000,
  c34: 24.6000,
  c35: 57.6000,
  c36: 90.6000,
  c37: 23.9000,
  c38: 56.9000,
  c39: 89.9000,
  c40: 23.2000,
  c41: 56.2000,
  c42: 89.2000,
  c43: 22.5000,
  c44: 55.5000,
  c45: 88.5000,
  c46: 21.8000,
  c47: 54.8000,
  c48: 87.8000,
  c49: 21.1000,
  c50: 54.1000,
  c51: 87.1000,
  c52: 20.4000,
  c53: 53.4000,
  c54: 86.4000,
  c55: 19.7000,
  c56: 52.7000,
  c57: 85.7000,
  c58: 19.0000,
  c59: 52.0000,
  c60: 85.0000,
  c61: 18.3000,
  c62: 51.3000,
  c63: 84.3000,
  c64: 17.6000,
  c65: 50.6000,
  c66: 83.6000,
  c67: 16.9000,
  c68: 49.9000,
  c69: 82.9000,
  c70: 16.2000,
  c71: 49.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_114_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_114_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_114_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_114_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_114_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_114_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_114_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_114_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_114_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_114_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
