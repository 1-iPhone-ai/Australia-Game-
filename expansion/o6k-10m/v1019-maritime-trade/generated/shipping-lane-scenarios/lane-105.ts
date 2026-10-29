import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 105 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_105_META = {
  id: 'lane_105',
  regionId: 'VIC' as V1019MtrdRegionId,
  primarySystem: 'pharma' as V1019MtrdSystemDomain,
  laneBand: 'latent' as V1019MtrdLaneBand,
  seed: 92126,
} as const;

const V1019_MTRD_LANE_SCENARIO_105_COEF = {
  k0: 73.2000,
  k1: 69.5000,
  k2: 65.8000,
  k3: 62.1000,
  k4: 58.4000,
  k5: 54.7000,
  k6: 51.0000,
  k7: 47.3000,
  k8: 43.6000,
  k9: 39.9000,
  k10: 36.2000,
  k11: 32.5000,
  k12: 28.8000,
  k13: 25.1000,
  k14: 21.4000,
  k15: 17.7000,
  k16: 14.0000,
  k17: 10.3000,
  k18: 6.6000,
  k19: 2.9000,
  k20: 98.3000,
  k21: 94.6000,
  k22: 90.9000,
  k23: 87.2000,
  k24: 83.5000,
  k25: 79.8000,
  k26: 76.1000,
  k27: 72.4000,
  k28: 68.7000,
  k29: 65.0000,
  k30: 61.3000,
  k31: 57.6000,
  k32: 53.9000,
  k33: 50.2000,
  k34: 46.5000,
  k35: 42.8000,
  k36: 39.1000,
  k37: 35.4000,
  k38: 31.7000,
  k39: 28.0000,
  k40: 24.3000,
  k41: 20.6000,
  k42: 16.9000,
  k43: 13.2000,
  k44: 9.5000,
  k45: 5.8000,
  k46: 2.1000,
  k47: 97.5000,
  k48: 93.8000,
  k49: 90.1000,
  k50: 86.4000,
  k51: 82.7000,
  k52: 79.0000,
  k53: 75.3000,
  k54: 71.6000,
  k55: 67.9000,
  k56: 64.2000,
  k57: 60.5000,
  k58: 56.8000,
  k59: 53.1000,
  k60: 49.4000,
  k61: 45.7000,
  k62: 42.0000,
  k63: 38.3000,
  k64: 34.6000,
  k65: 30.9000,
  k66: 27.2000,
  k67: 23.5000,
  k68: 19.8000,
  k69: 16.1000,
  k70: 12.4000,
  k71: 8.7000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_105_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_105_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_105_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_105_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_105_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_105_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_105_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_105_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_105_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_105_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_105_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_105_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
