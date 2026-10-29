import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 111 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_111_META = {
  id: 'lane_111',
  regionId: 'ACT' as V1019MtrdRegionId,
  primarySystem: 'energy' as V1019MtrdSystemDomain,
  laneBand: 'emerging' as V1019MtrdLaneBand,
  seed: 97388,
} as const;

const V1019_MTRD_LANE_SCENARIO_111_COEF = {
  k0: 89.9000,
  k1: 17.8000,
  k2: 44.8000,
  k3: 71.8000,
  k4: 98.8000,
  k5: 26.7000,
  k6: 53.7000,
  k7: 80.7000,
  k8: 8.6000,
  k9: 35.6000,
  k10: 62.6000,
  k11: 89.6000,
  k12: 17.5000,
  k13: 44.5000,
  k14: 71.5000,
  k15: 98.5000,
  k16: 26.4000,
  k17: 53.4000,
  k18: 80.4000,
  k19: 8.3000,
  k20: 35.3000,
  k21: 62.3000,
  k22: 89.3000,
  k23: 17.2000,
  k24: 44.2000,
  k25: 71.2000,
  k26: 98.2000,
  k27: 26.1000,
  k28: 53.1000,
  k29: 80.1000,
  k30: 8.0000,
  k31: 35.0000,
  k32: 62.0000,
  k33: 89.0000,
  k34: 16.9000,
  k35: 43.9000,
  k36: 70.9000,
  k37: 97.9000,
  k38: 25.8000,
  k39: 52.8000,
  k40: 79.8000,
  k41: 7.7000,
  k42: 34.7000,
  k43: 61.7000,
  k44: 88.7000,
  k45: 16.6000,
  k46: 43.6000,
  k47: 70.6000,
  k48: 97.6000,
  k49: 25.5000,
  k50: 52.5000,
  k51: 79.5000,
  k52: 7.4000,
  k53: 34.4000,
  k54: 61.4000,
  k55: 88.4000,
  k56: 16.3000,
  k57: 43.3000,
  k58: 70.3000,
  k59: 97.3000,
  k60: 25.2000,
  k61: 52.2000,
  k62: 79.2000,
  k63: 7.1000,
  k64: 34.1000,
  k65: 61.1000,
  k66: 88.1000,
  k67: 16.0000,
  k68: 43.0000,
  k69: 70.0000,
  k70: 97.0000,
  k71: 24.9000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_111_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_111_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_111_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_111_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_111_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_111_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_111_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_111_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_111_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_111_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_111_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_111_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
