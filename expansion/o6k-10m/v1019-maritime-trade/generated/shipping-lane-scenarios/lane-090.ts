import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 090 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_090_META = {
  id: 'lane_090',
  regionId: 'QLD' as V1019MtrdRegionId,
  primarySystem: 'freight' as V1019MtrdSystemDomain,
  laneBand: 'latent' as V1019MtrdLaneBand,
  seed: 78971,
} as const;

const V1019_MTRD_LANE_SCENARIO_090_COEF = {
  k0: 81.0000,
  k1: 50.1000,
  k2: 19.2000,
  k3: 87.4000,
  k4: 56.5000,
  k5: 25.6000,
  k6: 93.8000,
  k7: 62.9000,
  k8: 32.0000,
  k9: 1.1000,
  k10: 69.3000,
  k11: 38.4000,
  k12: 7.5000,
  k13: 75.7000,
  k14: 44.8000,
  k15: 13.9000,
  k16: 82.1000,
  k17: 51.2000,
  k18: 20.3000,
  k19: 88.5000,
  k20: 57.6000,
  k21: 26.7000,
  k22: 94.9000,
  k23: 64.0000,
  k24: 33.1000,
  k25: 2.2000,
  k26: 70.4000,
  k27: 39.5000,
  k28: 8.6000,
  k29: 76.8000,
  k30: 45.9000,
  k31: 15.0000,
  k32: 83.2000,
  k33: 52.3000,
  k34: 21.4000,
  k35: 89.6000,
  k36: 58.7000,
  k37: 27.8000,
  k38: 96.0000,
  k39: 65.1000,
  k40: 34.2000,
  k41: 3.3000,
  k42: 71.5000,
  k43: 40.6000,
  k44: 9.7000,
  k45: 77.9000,
  k46: 47.0000,
  k47: 16.1000,
  k48: 84.3000,
  k49: 53.4000,
  k50: 22.5000,
  k51: 90.7000,
  k52: 59.8000,
  k53: 28.9000,
  k54: 97.1000,
  k55: 66.2000,
  k56: 35.3000,
  k57: 4.4000,
  k58: 72.6000,
  k59: 41.7000,
  k60: 10.8000,
  k61: 79.0000,
  k62: 48.1000,
  k63: 17.2000,
  k64: 85.4000,
  k65: 54.5000,
  k66: 23.6000,
  k67: 91.8000,
  k68: 60.9000,
  k69: 30.0000,
  k70: 98.2000,
  k71: 67.3000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_090_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_090_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_090_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_090_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_090_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_090_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_090_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_090_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_090_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_090_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_090_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_090_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
