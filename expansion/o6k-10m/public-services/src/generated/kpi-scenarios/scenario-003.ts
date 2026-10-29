import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 003 — WA/housing. */
export const V1014_PUBSVC_KPI_SCENARIO_003_META = {
  id: 'kpi_003',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'housing' as V1014PubsSvcPillar,
  seed: 2990,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_003_COEF = {
  c0: 99.4000,
  c1: 99.3000,
  c2: 99.2000,
  c3: 99.1000,
  c4: 99.0000,
  c5: 98.9000,
  c6: 98.8000,
  c7: 98.7000,
  c8: 98.6000,
  c9: 98.5000,
  c10: 98.4000,
  c11: 98.3000,
  c12: 98.2000,
  c13: 98.1000,
  c14: 98.0000,
  c15: 97.9000,
  c16: 97.8000,
  c17: 97.7000,
  c18: 97.6000,
  c19: 97.5000,
  c20: 97.4000,
  c21: 97.3000,
  c22: 97.2000,
  c23: 97.1000,
  c24: 97.0000,
  c25: 96.9000,
  c26: 96.8000,
  c27: 96.7000,
  c28: 96.6000,
  c29: 96.5000,
  c30: 96.4000,
  c31: 96.3000,
  c32: 96.2000,
  c33: 96.1000,
  c34: 96.0000,
  c35: 95.9000,
  c36: 95.8000,
  c37: 95.7000,
  c38: 95.6000,
  c39: 95.5000,
  c40: 95.4000,
  c41: 95.3000,
  c42: 95.2000,
  c43: 95.1000,
  c44: 95.0000,
  c45: 94.9000,
  c46: 94.8000,
  c47: 94.7000,
  c48: 94.6000,
  c49: 94.5000,
  c50: 94.4000,
  c51: 94.3000,
  c52: 94.2000,
  c53: 94.1000,
  c54: 94.0000,
  c55: 93.9000,
  c56: 93.8000,
  c57: 93.7000,
  c58: 93.6000,
  c59: 93.5000,
  c60: 93.4000,
  c61: 93.3000,
  c62: 93.2000,
  c63: 93.1000,
  c64: 93.0000,
  c65: 92.9000,
  c66: 92.8000,
  c67: 92.7000,
  c68: 92.6000,
  c69: 92.5000,
  c70: 92.4000,
  c71: 92.3000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_003_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_003_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_003_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_003_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_003_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_003_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_003_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_003_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_003_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_003_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
