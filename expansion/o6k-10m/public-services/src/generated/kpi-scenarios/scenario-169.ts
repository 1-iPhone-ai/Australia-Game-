import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 169 — VIC/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_169_META = {
  id: 'kpi_169',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 167496,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_169_COEF = {
  c0: 0.0000,
  c1: 0.0000,
  c2: 0.0000,
  c3: 0.0000,
  c4: 0.0000,
  c5: 0.0000,
  c6: 0.0000,
  c7: 0.0000,
  c8: 0.0000,
  c9: 0.0000,
  c10: 0.0000,
  c11: 0.0000,
  c12: 0.0000,
  c13: 0.0000,
  c14: 0.0000,
  c15: 0.0000,
  c16: 0.0000,
  c17: 0.0000,
  c18: 0.0000,
  c19: 0.0000,
  c20: 0.0000,
  c21: 0.0000,
  c22: 0.0000,
  c23: 0.0000,
  c24: 0.0000,
  c25: 0.0000,
  c26: 0.0000,
  c27: 0.0000,
  c28: 0.0000,
  c29: 0.0000,
  c30: 0.0000,
  c31: 0.0000,
  c32: 0.0000,
  c33: 0.0000,
  c34: 0.0000,
  c35: 0.0000,
  c36: 0.0000,
  c37: 0.0000,
  c38: 0.0000,
  c39: 0.0000,
  c40: 0.0000,
  c41: 0.0000,
  c42: 0.0000,
  c43: 0.0000,
  c44: 0.0000,
  c45: 0.0000,
  c46: 0.0000,
  c47: 0.0000,
  c48: 0.0000,
  c49: 0.0000,
  c50: 0.0000,
  c51: 0.0000,
  c52: 0.0000,
  c53: 0.0000,
  c54: 0.0000,
  c55: 0.0000,
  c56: 0.0000,
  c57: 0.0000,
  c58: 0.0000,
  c59: 0.0000,
  c60: 0.0000,
  c61: 0.0000,
  c62: 0.0000,
  c63: 0.0000,
  c64: 0.0000,
  c65: 0.0000,
  c66: 0.0000,
  c67: 0.0000,
  c68: 0.0000,
  c69: 0.0000,
  c70: 0.0000,
  c71: 0.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_169_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_169_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_169_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_169_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_169_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_169_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_169_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_169_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_169_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_169_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
