import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 050 — QLD/education. */
export const V1014_PUBSVC_KPI_SCENARIO_050_META = {
  id: 'kpi_050',
  regionId: 'QLD' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 49567,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_050_COEF = {
  c0: 14.8000,
  c1: 86.2000,
  c2: 57.9000,
  c3: 29.6000,
  c4: 1.3000,
  c5: 72.7000,
  c6: 44.4000,
  c7: 16.1000,
  c8: 87.5000,
  c9: 59.2000,
  c10: 30.9000,
  c11: 2.6000,
  c12: 74.0000,
  c13: 45.7000,
  c14: 17.4000,
  c15: 88.8000,
  c16: 60.5000,
  c17: 32.2000,
  c18: 3.9000,
  c19: 75.3000,
  c20: 47.0000,
  c21: 18.7000,
  c22: 90.1000,
  c23: 61.8000,
  c24: 33.5000,
  c25: 5.2000,
  c26: 76.6000,
  c27: 48.3000,
  c28: 20.0000,
  c29: 91.4000,
  c30: 63.1000,
  c31: 34.8000,
  c32: 6.5000,
  c33: 77.9000,
  c34: 49.6000,
  c35: 21.3000,
  c36: 92.7000,
  c37: 64.4000,
  c38: 36.1000,
  c39: 7.8000,
  c40: 79.2000,
  c41: 50.9000,
  c42: 22.6000,
  c43: 94.0000,
  c44: 65.7000,
  c45: 37.4000,
  c46: 9.1000,
  c47: 80.5000,
  c48: 52.2000,
  c49: 23.9000,
  c50: 95.3000,
  c51: 67.0000,
  c52: 38.7000,
  c53: 10.4000,
  c54: 81.8000,
  c55: 53.5000,
  c56: 25.2000,
  c57: 96.6000,
  c58: 68.3000,
  c59: 40.0000,
  c60: 11.7000,
  c61: 83.1000,
  c62: 54.8000,
  c63: 26.5000,
  c64: 97.9000,
  c65: 69.6000,
  c66: 41.3000,
  c67: 13.0000,
  c68: 84.4000,
  c69: 56.1000,
  c70: 27.8000,
  c71: 99.2000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_050_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_050_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_050_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_050_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_050_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_050_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_050_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_050_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_050_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_050_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
