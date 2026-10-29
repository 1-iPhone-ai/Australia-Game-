import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 057 — VIC/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_057_META = {
  id: 'kpi_057',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 56504,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_057_COEF = {
  c0: 2.2000,
  c1: 69.4000,
  c2: 36.9000,
  c3: 4.4000,
  c4: 71.6000,
  c5: 39.1000,
  c6: 6.6000,
  c7: 73.8000,
  c8: 41.3000,
  c9: 8.8000,
  c10: 76.0000,
  c11: 43.5000,
  c12: 11.0000,
  c13: 78.2000,
  c14: 45.7000,
  c15: 13.2000,
  c16: 80.4000,
  c17: 47.9000,
  c18: 15.4000,
  c19: 82.6000,
  c20: 50.1000,
  c21: 17.6000,
  c22: 84.8000,
  c23: 52.3000,
  c24: 19.8000,
  c25: 87.0000,
  c26: 54.5000,
  c27: 22.0000,
  c28: 89.2000,
  c29: 56.7000,
  c30: 24.2000,
  c31: 91.4000,
  c32: 58.9000,
  c33: 26.4000,
  c34: 93.6000,
  c35: 61.1000,
  c36: 28.6000,
  c37: 95.8000,
  c38: 63.3000,
  c39: 30.8000,
  c40: 98.0000,
  c41: 65.5000,
  c42: 33.0000,
  c43: 0.5000,
  c44: 67.7000,
  c45: 35.2000,
  c46: 2.7000,
  c47: 69.9000,
  c48: 37.4000,
  c49: 4.9000,
  c50: 72.1000,
  c51: 39.6000,
  c52: 7.1000,
  c53: 74.3000,
  c54: 41.8000,
  c55: 9.3000,
  c56: 76.5000,
  c57: 44.0000,
  c58: 11.5000,
  c59: 78.7000,
  c60: 46.2000,
  c61: 13.7000,
  c62: 80.9000,
  c63: 48.4000,
  c64: 15.9000,
  c65: 83.1000,
  c66: 50.6000,
  c67: 18.1000,
  c68: 85.3000,
  c69: 52.8000,
  c70: 20.3000,
  c71: 87.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_057_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_057_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_057_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_057_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_057_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_057_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_057_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_057_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_057_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_057_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
