import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 098 — QLD/education. */
export const V1014_PUBSVC_KPI_SCENARIO_098_META = {
  id: 'kpi_098',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 97135,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_098_COEF = {
  c0: 28.1000,
  c1: 70.7000,
  c2: 13.6000,
  c3: 56.2000,
  c4: 98.8000,
  c5: 41.7000,
  c6: 84.3000,
  c7: 27.2000,
  c8: 69.8000,
  c9: 12.7000,
  c10: 55.3000,
  c11: 97.9000,
  c12: 40.8000,
  c13: 83.4000,
  c14: 26.3000,
  c15: 68.9000,
  c16: 11.8000,
  c17: 54.4000,
  c18: 97.0000,
  c19: 39.9000,
  c20: 82.5000,
  c21: 25.4000,
  c22: 68.0000,
  c23: 10.9000,
  c24: 53.5000,
  c25: 96.1000,
  c26: 39.0000,
  c27: 81.6000,
  c28: 24.5000,
  c29: 67.1000,
  c30: 10.0000,
  c31: 52.6000,
  c32: 95.2000,
  c33: 38.1000,
  c34: 80.7000,
  c35: 23.6000,
  c36: 66.2000,
  c37: 9.1000,
  c38: 51.7000,
  c39: 94.3000,
  c40: 37.2000,
  c41: 79.8000,
  c42: 22.7000,
  c43: 65.3000,
  c44: 8.2000,
  c45: 50.8000,
  c46: 93.4000,
  c47: 36.3000,
  c48: 78.9000,
  c49: 21.8000,
  c50: 64.4000,
  c51: 7.3000,
  c52: 49.9000,
  c53: 92.5000,
  c54: 35.4000,
  c55: 78.0000,
  c56: 20.9000,
  c57: 63.5000,
  c58: 6.4000,
  c59: 49.0000,
  c60: 91.6000,
  c61: 34.5000,
  c62: 77.1000,
  c63: 20.0000,
  c64: 62.6000,
  c65: 5.5000,
  c66: 48.1000,
  c67: 90.7000,
  c68: 33.6000,
  c69: 76.2000,
  c70: 19.1000,
  c71: 61.7000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_098_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_098_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_098_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_098_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_098_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_098_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_098_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_098_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_098_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_098_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
