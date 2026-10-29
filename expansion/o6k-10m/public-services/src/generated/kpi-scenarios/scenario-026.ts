import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 026 — QLD/education. */
export const V1014_PUBSVC_KPI_SCENARIO_026_META = {
  id: 'kpi_026',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 25783,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_026_COEF = {
  c0: 58.0000,
  c1: 44.1000,
  c2: 30.2000,
  c3: 16.3000,
  c4: 2.4000,
  c5: 88.2000,
  c6: 74.3000,
  c7: 60.4000,
  c8: 46.5000,
  c9: 32.6000,
  c10: 18.7000,
  c11: 4.8000,
  c12: 90.6000,
  c13: 76.7000,
  c14: 62.8000,
  c15: 48.9000,
  c16: 35.0000,
  c17: 21.1000,
  c18: 7.2000,
  c19: 93.0000,
  c20: 79.1000,
  c21: 65.2000,
  c22: 51.3000,
  c23: 37.4000,
  c24: 23.5000,
  c25: 9.6000,
  c26: 95.4000,
  c27: 81.5000,
  c28: 67.6000,
  c29: 53.7000,
  c30: 39.8000,
  c31: 25.9000,
  c32: 12.0000,
  c33: 97.8000,
  c34: 83.9000,
  c35: 70.0000,
  c36: 56.1000,
  c37: 42.2000,
  c38: 28.3000,
  c39: 14.4000,
  c40: 0.5000,
  c41: 86.3000,
  c42: 72.4000,
  c43: 58.5000,
  c44: 44.6000,
  c45: 30.7000,
  c46: 16.8000,
  c47: 2.9000,
  c48: 88.7000,
  c49: 74.8000,
  c50: 60.9000,
  c51: 47.0000,
  c52: 33.1000,
  c53: 19.2000,
  c54: 5.3000,
  c55: 91.1000,
  c56: 77.2000,
  c57: 63.3000,
  c58: 49.4000,
  c59: 35.5000,
  c60: 21.6000,
  c61: 7.7000,
  c62: 93.5000,
  c63: 79.6000,
  c64: 65.7000,
  c65: 51.8000,
  c66: 37.9000,
  c67: 24.0000,
  c68: 10.1000,
  c69: 95.9000,
  c70: 82.0000,
  c71: 68.1000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_026_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_026_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_026_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_026_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_026_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_026_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_026_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_026_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_026_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_026_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
