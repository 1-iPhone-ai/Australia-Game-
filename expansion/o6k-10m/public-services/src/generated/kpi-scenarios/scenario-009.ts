import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 009 — VIC/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_009_META = {
  id: 'kpi_009',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 8936,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_009_COEF = {
  c0: 88.6000,
  c1: 84.9000,
  c2: 81.2000,
  c3: 77.5000,
  c4: 73.8000,
  c5: 70.1000,
  c6: 66.4000,
  c7: 62.7000,
  c8: 59.0000,
  c9: 55.3000,
  c10: 51.6000,
  c11: 47.9000,
  c12: 44.2000,
  c13: 40.5000,
  c14: 36.8000,
  c15: 33.1000,
  c16: 29.4000,
  c17: 25.7000,
  c18: 22.0000,
  c19: 18.3000,
  c20: 14.6000,
  c21: 10.9000,
  c22: 7.2000,
  c23: 3.5000,
  c24: 99.5000,
  c25: 95.8000,
  c26: 92.1000,
  c27: 88.4000,
  c28: 84.7000,
  c29: 81.0000,
  c30: 77.3000,
  c31: 73.6000,
  c32: 69.9000,
  c33: 66.2000,
  c34: 62.5000,
  c35: 58.8000,
  c36: 55.1000,
  c37: 51.4000,
  c38: 47.7000,
  c39: 44.0000,
  c40: 40.3000,
  c41: 36.6000,
  c42: 32.9000,
  c43: 29.2000,
  c44: 25.5000,
  c45: 21.8000,
  c46: 18.1000,
  c47: 14.4000,
  c48: 10.7000,
  c49: 7.0000,
  c50: 3.3000,
  c51: 99.3000,
  c52: 95.6000,
  c53: 91.9000,
  c54: 88.2000,
  c55: 84.5000,
  c56: 80.8000,
  c57: 77.1000,
  c58: 73.4000,
  c59: 69.7000,
  c60: 66.0000,
  c61: 62.3000,
  c62: 58.6000,
  c63: 54.9000,
  c64: 51.2000,
  c65: 47.5000,
  c66: 43.8000,
  c67: 40.1000,
  c68: 36.4000,
  c69: 32.7000,
  c70: 29.0000,
  c71: 25.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_009_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_009_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_009_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_009_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_009_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_009_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_009_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_009_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_009_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_009_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
