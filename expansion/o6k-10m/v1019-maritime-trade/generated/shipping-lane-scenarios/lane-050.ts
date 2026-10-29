import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 050 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_050_META = {
  id: 'lane_050',
  regionId: 'QLD' as V1019MtrdRegionId,
  primarySystem: 'freight' as V1019MtrdSystemDomain,
  laneBand: 'latent' as V1019MtrdLaneBand,
  seed: 43891,
} as const;

const V1019_MTRD_LANE_SCENARIO_050_COEF = {
  k0: 2.7000,
  k1: 31.4000,
  k2: 60.1000,
  k3: 88.8000,
  k4: 18.4000,
  k5: 47.1000,
  k6: 75.8000,
  k7: 5.4000,
  k8: 34.1000,
  k9: 62.8000,
  k10: 91.5000,
  k11: 21.1000,
  k12: 49.8000,
  k13: 78.5000,
  k14: 8.1000,
  k15: 36.8000,
  k16: 65.5000,
  k17: 94.2000,
  k18: 23.8000,
  k19: 52.5000,
  k20: 81.2000,
  k21: 10.8000,
  k22: 39.5000,
  k23: 68.2000,
  k24: 96.9000,
  k25: 26.5000,
  k26: 55.2000,
  k27: 83.9000,
  k28: 13.5000,
  k29: 42.2000,
  k30: 70.9000,
  k31: 0.5000,
  k32: 29.2000,
  k33: 57.9000,
  k34: 86.6000,
  k35: 16.2000,
  k36: 44.9000,
  k37: 73.6000,
  k38: 3.2000,
  k39: 31.9000,
  k40: 60.6000,
  k41: 89.3000,
  k42: 18.9000,
  k43: 47.6000,
  k44: 76.3000,
  k45: 5.9000,
  k46: 34.6000,
  k47: 63.3000,
  k48: 92.0000,
  k49: 21.6000,
  k50: 50.3000,
  k51: 79.0000,
  k52: 8.6000,
  k53: 37.3000,
  k54: 66.0000,
  k55: 94.7000,
  k56: 24.3000,
  k57: 53.0000,
  k58: 81.7000,
  k59: 11.3000,
  k60: 40.0000,
  k61: 68.7000,
  k62: 97.4000,
  k63: 27.0000,
  k64: 55.7000,
  k65: 84.4000,
  k66: 14.0000,
  k67: 42.7000,
  k68: 71.4000,
  k69: 1.0000,
  k70: 29.7000,
  k71: 58.4000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_050_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_050_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_050_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_050_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_050_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_050_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_050_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_050_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_050_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_050_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_050_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_050_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
