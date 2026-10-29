import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 049 — VIC/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_049_META = {
  id: 'kpi_049',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 48576,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_049_COEF = {
  c0: 16.6000,
  c1: 88.6000,
  c2: 60.9000,
  c3: 33.2000,
  c4: 5.5000,
  c5: 77.5000,
  c6: 49.8000,
  c7: 22.1000,
  c8: 94.1000,
  c9: 66.4000,
  c10: 38.7000,
  c11: 11.0000,
  c12: 83.0000,
  c13: 55.3000,
  c14: 27.6000,
  c15: 99.6000,
  c16: 71.9000,
  c17: 44.2000,
  c18: 16.5000,
  c19: 88.5000,
  c20: 60.8000,
  c21: 33.1000,
  c22: 5.4000,
  c23: 77.4000,
  c24: 49.7000,
  c25: 22.0000,
  c26: 94.0000,
  c27: 66.3000,
  c28: 38.6000,
  c29: 10.9000,
  c30: 82.9000,
  c31: 55.2000,
  c32: 27.5000,
  c33: 99.5000,
  c34: 71.8000,
  c35: 44.1000,
  c36: 16.4000,
  c37: 88.4000,
  c38: 60.7000,
  c39: 33.0000,
  c40: 5.3000,
  c41: 77.3000,
  c42: 49.6000,
  c43: 21.9000,
  c44: 93.9000,
  c45: 66.2000,
  c46: 38.5000,
  c47: 10.8000,
  c48: 82.8000,
  c49: 55.1000,
  c50: 27.4000,
  c51: 99.4000,
  c52: 71.7000,
  c53: 44.0000,
  c54: 16.3000,
  c55: 88.3000,
  c56: 60.6000,
  c57: 32.9000,
  c58: 5.2000,
  c59: 77.2000,
  c60: 49.5000,
  c61: 21.8000,
  c62: 93.8000,
  c63: 66.1000,
  c64: 38.4000,
  c65: 10.7000,
  c66: 82.7000,
  c67: 55.0000,
  c68: 27.3000,
  c69: 99.3000,
  c70: 71.6000,
  c71: 43.9000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_049_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_049_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_049_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_049_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_049_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_049_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_049_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_049_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_049_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_049_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
