import { V1014_PUBSVC_computeQueueStep } from '../../queues/delivery-queue-engine.ts';
import { V1014_PUBSVC_clamp } from '../../core/math.ts';
import type { V1014PubsSvcRegionId, V1014PubsSvcPillar } from '../../core/types.ts';

/** Auto-generated KPI scenario 086 — NT/education. */
export const V1014_PUBSVC_KPI_SCENARIO_086_META = {
  id: 'kpi_086',
  regionId: 'NT' as V1014PubsSvcRegionId,
  pillar: 'education' as V1014PubsSvcPillar,
  seed: 85243,
} as const;

const V1014_PUBSVC_KPI_SCENARIO_086_COEF = {
  c0: 49.7000,
  c1: 99.5000,
  c2: 49.6000,
  c3: 99.4000,
  c4: 49.5000,
  c5: 99.3000,
  c6: 49.4000,
  c7: 99.2000,
  c8: 49.3000,
  c9: 99.1000,
  c10: 49.2000,
  c11: 99.0000,
  c12: 49.1000,
  c13: 98.9000,
  c14: 49.0000,
  c15: 98.8000,
  c16: 48.9000,
  c17: 98.7000,
  c18: 48.8000,
  c19: 98.6000,
  c20: 48.7000,
  c21: 98.5000,
  c22: 48.6000,
  c23: 98.4000,
  c24: 48.5000,
  c25: 98.3000,
  c26: 48.4000,
  c27: 98.2000,
  c28: 48.3000,
  c29: 98.1000,
  c30: 48.2000,
  c31: 98.0000,
  c32: 48.1000,
  c33: 97.9000,
  c34: 48.0000,
  c35: 97.8000,
  c36: 47.9000,
  c37: 97.7000,
  c38: 47.8000,
  c39: 97.6000,
  c40: 47.7000,
  c41: 97.5000,
  c42: 47.6000,
  c43: 97.4000,
  c44: 47.5000,
  c45: 97.3000,
  c46: 47.4000,
  c47: 97.2000,
  c48: 47.3000,
  c49: 97.1000,
  c50: 47.2000,
  c51: 97.0000,
  c52: 47.1000,
  c53: 96.9000,
  c54: 47.0000,
  c55: 96.8000,
  c56: 46.9000,
  c57: 96.7000,
  c58: 46.8000,
  c59: 96.6000,
  c60: 46.7000,
  c61: 96.5000,
  c62: 46.6000,
  c63: 96.4000,
  c64: 46.5000,
  c65: 96.3000,
  c66: 46.4000,
  c67: 96.2000,
  c68: 46.3000,
  c69: 96.1000,
  c70: 46.2000,
  c71: 96.0000,
} as const;

export function V1014_PUBSVC_KPI_SCENARIO_086_evaluate(turn: number): {
  waitTurns: number;
  pressureScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_PUBSVC_KPI_SCENARIO_086_COEF) as Array<keyof typeof V1014_PUBSVC_KPI_SCENARIO_086_COEF>;
  for (let i = 0; i < keys.length; i++) {
    acc += V1014_PUBSVC_KPI_SCENARIO_086_COEF[keys[i]] * ((turn + i) % 7);
  }
  const demand = V1014_PUBSVC_clamp(30 + (acc % 65), 0, 100);
  const slot = V1014_PUBSVC_computeQueueStep({
    turn,
    regionId: V1014_PUBSVC_KPI_SCENARIO_086_META.regionId,
    pillar: V1014_PUBSVC_KPI_SCENARIO_086_META.pillar,
    demandPressure: demand,
    throughputCapacity: V1014_PUBSVC_clamp(55 + (V1014_PUBSVC_KPI_SCENARIO_086_META.seed % 20), 5, 120),
    staffingCoverage: V1014_PUBSVC_clamp(48 + (V1014_PUBSVC_KPI_SCENARIO_086_META.seed % 15), 5, 120),
    policyFocus: V1014_PUBSVC_clamp(40 + (turn * 3) % 40, 0, 100),
    fiscalHeadroom: V1014_PUBSVC_clamp(50 + (turn % 5) * 4, 0, 100),
    priorWaitTurns: V1014_PUBSVC_clamp((acc % 40) + turn, 0, 240),
  });
  const pressureScore = V1014_PUBSVC_clamp(slot.waitTurns * 0.5 + demand * 0.35, 0, 100);
  return { waitTurns: slot.waitTurns, pressureScore, stable: slot.band !== 'critical' };
}

export function V1014_PUBSVC_KPI_SCENARIO_086_regressionAssert(turn: number): boolean {
  const r = V1014_PUBSVC_KPI_SCENARIO_086_evaluate(turn);
  return typeof r.waitTurns === 'number' && r.waitTurns >= 0 && r.pressureScore <= 100;
}
