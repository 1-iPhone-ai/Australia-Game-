import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 096 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_096_META = {
  id: 'lane_096',
  regionId: 'NSW' as V1019MtrdRegionId,
  primarySystem: 'food' as V1019MtrdSystemDomain,
  laneBand: 'emerging' as V1019MtrdLaneBand,
  seed: 84233,
} as const;

const V1019_MTRD_LANE_SCENARIO_096_COEF = {
  k0: 97.7000,
  k1: 97.5000,
  k2: 97.3000,
  k3: 97.1000,
  k4: 96.9000,
  k5: 96.7000,
  k6: 96.5000,
  k7: 96.3000,
  k8: 96.1000,
  k9: 95.9000,
  k10: 95.7000,
  k11: 95.5000,
  k12: 95.3000,
  k13: 95.1000,
  k14: 94.9000,
  k15: 94.7000,
  k16: 94.5000,
  k17: 94.3000,
  k18: 94.1000,
  k19: 93.9000,
  k20: 93.7000,
  k21: 93.5000,
  k22: 93.3000,
  k23: 93.1000,
  k24: 92.9000,
  k25: 92.7000,
  k26: 92.5000,
  k27: 92.3000,
  k28: 92.1000,
  k29: 91.9000,
  k30: 91.7000,
  k31: 91.5000,
  k32: 91.3000,
  k33: 91.1000,
  k34: 90.9000,
  k35: 90.7000,
  k36: 90.5000,
  k37: 90.3000,
  k38: 90.1000,
  k39: 89.9000,
  k40: 89.7000,
  k41: 89.5000,
  k42: 89.3000,
  k43: 89.1000,
  k44: 88.9000,
  k45: 88.7000,
  k46: 88.5000,
  k47: 88.3000,
  k48: 88.1000,
  k49: 87.9000,
  k50: 87.7000,
  k51: 87.5000,
  k52: 87.3000,
  k53: 87.1000,
  k54: 86.9000,
  k55: 86.7000,
  k56: 86.5000,
  k57: 86.3000,
  k58: 86.1000,
  k59: 85.9000,
  k60: 85.7000,
  k61: 85.5000,
  k62: 85.3000,
  k63: 85.1000,
  k64: 84.9000,
  k65: 84.7000,
  k66: 84.5000,
  k67: 84.3000,
  k68: 84.1000,
  k69: 83.9000,
  k70: 83.7000,
  k71: 83.5000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_096_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_096_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_096_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_096_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_096_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_096_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_096_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_096_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_096_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_096_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_096_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_096_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
