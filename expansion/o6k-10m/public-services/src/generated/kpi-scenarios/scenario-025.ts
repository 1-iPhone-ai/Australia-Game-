import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 025 — VIC/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_025_META = {
  id: 'kpi_025',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 24792,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_025_COEF = {
  c0: 59.8000,
  c1: 46.5000,
  c2: 33.2000,
  c3: 19.9000,
  c4: 6.6000,
  c5: 93.0000,
  c6: 79.7000,
  c7: 66.4000,
  c8: 53.1000,
  c9: 39.8000,
  c10: 26.5000,
  c11: 13.2000,
  c12: 99.6000,
  c13: 86.3000,
  c14: 73.0000,
  c15: 59.7000,
  c16: 46.4000,
  c17: 33.1000,
  c18: 19.8000,
  c19: 6.5000,
  c20: 92.9000,
  c21: 79.6000,
  c22: 66.3000,
  c23: 53.0000,
  c24: 39.7000,
  c25: 26.4000,
  c26: 13.1000,
  c27: 99.5000,
  c28: 86.2000,
  c29: 72.9000,
  c30: 59.6000,
  c31: 46.3000,
  c32: 33.0000,
  c33: 19.7000,
  c34: 6.4000,
  c35: 92.8000,
  c36: 79.5000,
  c37: 66.2000,
  c38: 52.9000,
  c39: 39.6000,
  c40: 26.3000,
  c41: 13.0000,
  c42: 99.4000,
  c43: 86.1000,
  c44: 72.8000,
  c45: 59.5000,
  c46: 46.2000,
  c47: 32.9000,
  c48: 19.6000,
  c49: 6.3000,
  c50: 92.7000,
  c51: 79.4000,
  c52: 66.1000,
  c53: 52.8000,
  c54: 39.5000,
  c55: 26.2000,
  c56: 12.9000,
  c57: 99.3000,
  c58: 86.0000,
  c59: 72.7000,
  c60: 59.4000,
  c61: 46.1000,
  c62: 32.8000,
  c63: 19.5000,
  c64: 6.2000,
  c65: 92.6000,
  c66: 79.3000,
  c67: 66.0000,
  c68: 52.7000,
  c69: 39.4000,
  c70: 26.1000,
  c71: 12.8000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_025_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_025_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_025_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_025_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_025_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_025_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_025_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_025_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_025_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_025_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
