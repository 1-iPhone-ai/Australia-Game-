import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 099 — WA/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_099_META = {
  id: 'kpi_099',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 98126,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_099_COEF = {
  c0: 26.3000,
  c1: 68.3000,
  c2: 10.6000,
  c3: 52.6000,
  c4: 94.6000,
  c5: 36.9000,
  c6: 78.9000,
  c7: 21.2000,
  c8: 63.2000,
  c9: 5.5000,
  c10: 47.5000,
  c11: 89.5000,
  c12: 31.8000,
  c13: 73.8000,
  c14: 16.1000,
  c15: 58.1000,
  c16: 0.4000,
  c17: 42.4000,
  c18: 84.4000,
  c19: 26.7000,
  c20: 68.7000,
  c21: 11.0000,
  c22: 53.0000,
  c23: 95.0000,
  c24: 37.3000,
  c25: 79.3000,
  c26: 21.6000,
  c27: 63.6000,
  c28: 5.9000,
  c29: 47.9000,
  c30: 89.9000,
  c31: 32.2000,
  c32: 74.2000,
  c33: 16.5000,
  c34: 58.5000,
  c35: 0.8000,
  c36: 42.8000,
  c37: 84.8000,
  c38: 27.1000,
  c39: 69.1000,
  c40: 11.4000,
  c41: 53.4000,
  c42: 95.4000,
  c43: 37.7000,
  c44: 79.7000,
  c45: 22.0000,
  c46: 64.0000,
  c47: 6.3000,
  c48: 48.3000,
  c49: 90.3000,
  c50: 32.6000,
  c51: 74.6000,
  c52: 16.9000,
  c53: 58.9000,
  c54: 1.2000,
  c55: 43.2000,
  c56: 85.2000,
  c57: 27.5000,
  c58: 69.5000,
  c59: 11.8000,
  c60: 53.8000,
  c61: 95.8000,
  c62: 38.1000,
  c63: 80.1000,
  c64: 22.4000,
  c65: 64.4000,
  c66: 6.7000,
  c67: 48.7000,
  c68: 90.7000,
  c69: 33.0000,
  c70: 75.0000,
  c71: 17.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_099_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_099_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_099_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_099_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_099_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_099_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_099_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_099_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_099_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_099_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
