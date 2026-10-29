import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 084 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_084_META = {
  id: 'lane_084',
  regionId: 'SA' as V1019MtrdRegionId,
  primarySystem: 'trade' as V1019MtrdSystemDomain,
  laneBand: 'recovering' as V1019MtrdLaneBand,
  seed: 73709,
} as const;

const V1019_MTRD_LANE_SCENARIO_084_COEF = {
  k0: 64.3000,
  k1: 2.7000,
  k2: 40.2000,
  k3: 77.7000,
  k4: 16.1000,
  k5: 53.6000,
  k6: 91.1000,
  k7: 29.5000,
  k8: 67.0000,
  k9: 5.4000,
  k10: 42.9000,
  k11: 80.4000,
  k12: 18.8000,
  k13: 56.3000,
  k14: 93.8000,
  k15: 32.2000,
  k16: 69.7000,
  k17: 8.1000,
  k18: 45.6000,
  k19: 83.1000,
  k20: 21.5000,
  k21: 59.0000,
  k22: 96.5000,
  k23: 34.9000,
  k24: 72.4000,
  k25: 10.8000,
  k26: 48.3000,
  k27: 85.8000,
  k28: 24.2000,
  k29: 61.7000,
  k30: 0.1000,
  k31: 37.6000,
  k32: 75.1000,
  k33: 13.5000,
  k34: 51.0000,
  k35: 88.5000,
  k36: 26.9000,
  k37: 64.4000,
  k38: 2.8000,
  k39: 40.3000,
  k40: 77.8000,
  k41: 16.2000,
  k42: 53.7000,
  k43: 91.2000,
  k44: 29.6000,
  k45: 67.1000,
  k46: 5.5000,
  k47: 43.0000,
  k48: 80.5000,
  k49: 18.9000,
  k50: 56.4000,
  k51: 93.9000,
  k52: 32.3000,
  k53: 69.8000,
  k54: 8.2000,
  k55: 45.7000,
  k56: 83.2000,
  k57: 21.6000,
  k58: 59.1000,
  k59: 96.6000,
  k60: 35.0000,
  k61: 72.5000,
  k62: 10.9000,
  k63: 48.4000,
  k64: 85.9000,
  k65: 24.3000,
  k66: 61.8000,
  k67: 0.2000,
  k68: 37.7000,
  k69: 75.2000,
  k70: 13.6000,
  k71: 51.1000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_084_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_084_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_084_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_084_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_084_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_084_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_084_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_084_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_084_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_084_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_084_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_084_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
