import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 092 — SA/education. */
export const V1014_PUBSVC_KPI_SCENARIO_092_META = {
  id: 'kpi_092',
  regionId: 'SA' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 91189,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_092_COEF = {
  c0: 38.9000,
  c1: 85.1000,
  c2: 31.6000,
  c3: 77.8000,
  c4: 24.3000,
  c5: 70.5000,
  c6: 17.0000,
  c7: 63.2000,
  c8: 9.7000,
  c9: 55.9000,
  c10: 2.4000,
  c11: 48.6000,
  c12: 94.8000,
  c13: 41.3000,
  c14: 87.5000,
  c15: 34.0000,
  c16: 80.2000,
  c17: 26.7000,
  c18: 72.9000,
  c19: 19.4000,
  c20: 65.6000,
  c21: 12.1000,
  c22: 58.3000,
  c23: 4.8000,
  c24: 51.0000,
  c25: 97.2000,
  c26: 43.7000,
  c27: 89.9000,
  c28: 36.4000,
  c29: 82.6000,
  c30: 29.1000,
  c31: 75.3000,
  c32: 21.8000,
  c33: 68.0000,
  c34: 14.5000,
  c35: 60.7000,
  c36: 7.2000,
  c37: 53.4000,
  c38: 99.6000,
  c39: 46.1000,
  c40: 92.3000,
  c41: 38.8000,
  c42: 85.0000,
  c43: 31.5000,
  c44: 77.7000,
  c45: 24.2000,
  c46: 70.4000,
  c47: 16.9000,
  c48: 63.1000,
  c49: 9.6000,
  c50: 55.8000,
  c51: 2.3000,
  c52: 48.5000,
  c53: 94.7000,
  c54: 41.2000,
  c55: 87.4000,
  c56: 33.9000,
  c57: 80.1000,
  c58: 26.6000,
  c59: 72.8000,
  c60: 19.3000,
  c61: 65.5000,
  c62: 12.0000,
  c63: 58.2000,
  c64: 4.7000,
  c65: 50.9000,
  c66: 97.1000,
  c67: 43.6000,
  c68: 89.8000,
  c69: 36.3000,
  c70: 82.5000,
  c71: 29.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_092_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_092_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_092_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_092_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_092_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_092_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_092_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_092_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_092_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_092_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
