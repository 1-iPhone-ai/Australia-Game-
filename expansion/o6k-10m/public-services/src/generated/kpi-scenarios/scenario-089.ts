import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 089 — VIC/education. */
export const V1014_PUBSVC_KPI_SCENARIO_089_META = {
  id: 'kpi_089',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 88216,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_089_COEF = {
  c0: 44.3000,
  c1: 92.3000,
  c2: 40.6000,
  c3: 88.6000,
  c4: 36.9000,
  c5: 84.9000,
  c6: 33.2000,
  c7: 81.2000,
  c8: 29.5000,
  c9: 77.5000,
  c10: 25.8000,
  c11: 73.8000,
  c12: 22.1000,
  c13: 70.1000,
  c14: 18.4000,
  c15: 66.4000,
  c16: 14.7000,
  c17: 62.7000,
  c18: 11.0000,
  c19: 59.0000,
  c20: 7.3000,
  c21: 55.3000,
  c22: 3.6000,
  c23: 51.6000,
  c24: 99.6000,
  c25: 47.9000,
  c26: 95.9000,
  c27: 44.2000,
  c28: 92.2000,
  c29: 40.5000,
  c30: 88.5000,
  c31: 36.8000,
  c32: 84.8000,
  c33: 33.1000,
  c34: 81.1000,
  c35: 29.4000,
  c36: 77.4000,
  c37: 25.7000,
  c38: 73.7000,
  c39: 22.0000,
  c40: 70.0000,
  c41: 18.3000,
  c42: 66.3000,
  c43: 14.6000,
  c44: 62.6000,
  c45: 10.9000,
  c46: 58.9000,
  c47: 7.2000,
  c48: 55.2000,
  c49: 3.5000,
  c50: 51.5000,
  c51: 99.5000,
  c52: 47.8000,
  c53: 95.8000,
  c54: 44.1000,
  c55: 92.1000,
  c56: 40.4000,
  c57: 88.4000,
  c58: 36.7000,
  c59: 84.7000,
  c60: 33.0000,
  c61: 81.0000,
  c62: 29.3000,
  c63: 77.3000,
  c64: 25.6000,
  c65: 73.6000,
  c66: 21.9000,
  c67: 69.9000,
  c68: 18.2000,
  c69: 66.2000,
  c70: 14.5000,
  c71: 62.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_089_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_089_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_089_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_089_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_089_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_089_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_089_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_089_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_089_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_089_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
