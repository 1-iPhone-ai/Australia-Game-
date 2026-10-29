import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 124 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_124_META = {
  id: 'lane_124',
  regionId: 'SA' as V1019MtrdRegionId,
  primarySystem: 'trade' as V1019MtrdSystemDomain,
  laneBand: 'recovering' as V1019MtrdLaneBand,
  seed: 108789,
} as const;

const V1019_MTRD_LANE_SCENARIO_124_COEF = {
  k0: 43.5000,
  k1: 21.4000,
  k2: 98.4000,
  k3: 76.3000,
  k4: 54.2000,
  k5: 32.1000,
  k6: 10.0000,
  k7: 87.0000,
  k8: 64.9000,
  k9: 42.8000,
  k10: 20.7000,
  k11: 97.7000,
  k12: 75.6000,
  k13: 53.5000,
  k14: 31.4000,
  k15: 9.3000,
  k16: 86.3000,
  k17: 64.2000,
  k18: 42.1000,
  k19: 20.0000,
  k20: 97.0000,
  k21: 74.9000,
  k22: 52.8000,
  k23: 30.7000,
  k24: 8.6000,
  k25: 85.6000,
  k26: 63.5000,
  k27: 41.4000,
  k28: 19.3000,
  k29: 96.3000,
  k30: 74.2000,
  k31: 52.1000,
  k32: 30.0000,
  k33: 7.9000,
  k34: 84.9000,
  k35: 62.8000,
  k36: 40.7000,
  k37: 18.6000,
  k38: 95.6000,
  k39: 73.5000,
  k40: 51.4000,
  k41: 29.3000,
  k42: 7.2000,
  k43: 84.2000,
  k44: 62.1000,
  k45: 40.0000,
  k46: 17.9000,
  k47: 94.9000,
  k48: 72.8000,
  k49: 50.7000,
  k50: 28.6000,
  k51: 6.5000,
  k52: 83.5000,
  k53: 61.4000,
  k54: 39.3000,
  k55: 17.2000,
  k56: 94.2000,
  k57: 72.1000,
  k58: 50.0000,
  k59: 27.9000,
  k60: 5.8000,
  k61: 82.8000,
  k62: 60.7000,
  k63: 38.6000,
  k64: 16.5000,
  k65: 93.5000,
  k66: 71.4000,
  k67: 49.3000,
  k68: 27.2000,
  k69: 5.1000,
  k70: 82.1000,
  k71: 60.0000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_124_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_124_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_124_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_124_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_124_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_124_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_124_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_124_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_124_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_124_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_124_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_124_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
