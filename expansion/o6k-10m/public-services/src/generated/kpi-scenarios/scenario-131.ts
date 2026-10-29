import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 131 — WA/education. */
export const V1014_PUBSVC_KPI_SCENARIO_131_META = {
  id: 'kpi_131',
  regionId: 'WA' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 129838,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_131_COEF = {
  c0: 68.4000,
  c1: 91.2000,
  c2: 14.3000,
  c3: 37.1000,
  c4: 59.9000,
  c5: 82.7000,
  c6: 5.8000,
  c7: 28.6000,
  c8: 51.4000,
  c9: 74.2000,
  c10: 97.0000,
  c11: 20.1000,
  c12: 42.9000,
  c13: 65.7000,
  c14: 88.5000,
  c15: 11.6000,
  c16: 34.4000,
  c17: 57.2000,
  c18: 80.0000,
  c19: 3.1000,
  c20: 25.9000,
  c21: 48.7000,
  c22: 71.5000,
  c23: 94.3000,
  c24: 17.4000,
  c25: 40.2000,
  c26: 63.0000,
  c27: 85.8000,
  c28: 8.9000,
  c29: 31.7000,
  c30: 54.5000,
  c31: 77.3000,
  c32: 0.4000,
  c33: 23.2000,
  c34: 46.0000,
  c35: 68.8000,
  c36: 91.6000,
  c37: 14.7000,
  c38: 37.5000,
  c39: 60.3000,
  c40: 83.1000,
  c41: 6.2000,
  c42: 29.0000,
  c43: 51.8000,
  c44: 74.6000,
  c45: 97.4000,
  c46: 20.5000,
  c47: 43.3000,
  c48: 66.1000,
  c49: 88.9000,
  c50: 12.0000,
  c51: 34.8000,
  c52: 57.6000,
  c53: 80.4000,
  c54: 3.5000,
  c55: 26.3000,
  c56: 49.1000,
  c57: 71.9000,
  c58: 94.7000,
  c59: 17.8000,
  c60: 40.6000,
  c61: 63.4000,
  c62: 86.2000,
  c63: 9.3000,
  c64: 32.1000,
  c65: 54.9000,
  c66: 77.7000,
  c67: 0.8000,
  c68: 23.6000,
  c69: 46.4000,
  c70: 69.2000,
  c71: 92.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_131_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_131_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_131_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_131_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_131_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_131_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_131_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_131_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_131_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_131_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
