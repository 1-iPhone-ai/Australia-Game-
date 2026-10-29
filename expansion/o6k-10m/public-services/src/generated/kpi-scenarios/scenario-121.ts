import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 121 — VIC/healthcare. */
export const V1014_PUBSVC_KPI_SCENARIO_121_META = {
  id: 'kpi_121',
  regionId: 'VIC' as V1014PubsSvcRegionId,
  pillar: 'healthcare' as V1014PubsSvcPillar,
  seed: 119928,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_121_COEF = {
  c0: 86.4000,
  c1: 15.5000,
  c2: 44.3000,
  c3: 73.1000,
  c4: 2.2000,
  c5: 31.0000,
  c6: 59.8000,
  c7: 88.6000,
  c8: 17.7000,
  c9: 46.5000,
  c10: 75.3000,
  c11: 4.4000,
  c12: 33.2000,
  c13: 62.0000,
  c14: 90.8000,
  c15: 19.9000,
  c16: 48.7000,
  c17: 77.5000,
  c18: 6.6000,
  c19: 35.4000,
  c20: 64.2000,
  c21: 93.0000,
  c22: 22.1000,
  c23: 50.9000,
  c24: 79.7000,
  c25: 8.8000,
  c26: 37.6000,
  c27: 66.4000,
  c28: 95.2000,
  c29: 24.3000,
  c30: 53.1000,
  c31: 81.9000,
  c32: 11.0000,
  c33: 39.8000,
  c34: 68.6000,
  c35: 97.4000,
  c36: 26.5000,
  c37: 55.3000,
  c38: 84.1000,
  c39: 13.2000,
  c40: 42.0000,
  c41: 70.8000,
  c42: 99.6000,
  c43: 28.7000,
  c44: 57.5000,
  c45: 86.3000,
  c46: 15.4000,
  c47: 44.2000,
  c48: 73.0000,
  c49: 2.1000,
  c50: 30.9000,
  c51: 59.7000,
  c52: 88.5000,
  c53: 17.6000,
  c54: 46.4000,
  c55: 75.2000,
  c56: 4.3000,
  c57: 33.1000,
  c58: 61.9000,
  c59: 90.7000,
  c60: 19.8000,
  c61: 48.6000,
  c62: 77.4000,
  c63: 6.5000,
  c64: 35.3000,
  c65: 64.1000,
  c66: 92.9000,
  c67: 22.0000,
  c68: 50.8000,
  c69: 79.6000,
  c70: 8.7000,
  c71: 37.5000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_121_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_121_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_121_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_121_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_121_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_121_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_121_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_121_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_121_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_121_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
