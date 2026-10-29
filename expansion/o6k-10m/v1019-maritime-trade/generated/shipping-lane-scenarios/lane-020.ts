import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 020 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_020_META = {
  id: 'lane_020',
  regionId: 'SA' as V1019MtrdRegionId,
  primarySystem: 'freight' as V1019MtrdSystemDomain,
  laneBand: 'latent' as V1019MtrdLaneBand,
  seed: 17581,
} as const;

const V1019_MTRD_LANE_SCENARIO_020_COEF = {
  k0: 18.3000,
  k1: 91.7000,
  k2: 66.0000,
  k3: 40.3000,
  k4: 14.6000,
  k5: 88.0000,
  k6: 62.3000,
  k7: 36.6000,
  k8: 10.9000,
  k9: 84.3000,
  k10: 58.6000,
  k11: 32.9000,
  k12: 7.2000,
  k13: 80.6000,
  k14: 54.9000,
  k15: 29.2000,
  k16: 3.5000,
  k17: 76.9000,
  k18: 51.2000,
  k19: 25.5000,
  k20: 98.9000,
  k21: 73.2000,
  k22: 47.5000,
  k23: 21.8000,
  k24: 95.2000,
  k25: 69.5000,
  k26: 43.8000,
  k27: 18.1000,
  k28: 91.5000,
  k29: 65.8000,
  k30: 40.1000,
  k31: 14.4000,
  k32: 87.8000,
  k33: 62.1000,
  k34: 36.4000,
  k35: 10.7000,
  k36: 84.1000,
  k37: 58.4000,
  k38: 32.7000,
  k39: 7.0000,
  k40: 80.4000,
  k41: 54.7000,
  k42: 29.0000,
  k43: 3.3000,
  k44: 76.7000,
  k45: 51.0000,
  k46: 25.3000,
  k47: 98.7000,
  k48: 73.0000,
  k49: 47.3000,
  k50: 21.6000,
  k51: 95.0000,
  k52: 69.3000,
  k53: 43.6000,
  k54: 17.9000,
  k55: 91.3000,
  k56: 65.6000,
  k57: 39.9000,
  k58: 14.2000,
  k59: 87.6000,
  k60: 61.9000,
  k61: 36.2000,
  k62: 10.5000,
  k63: 83.9000,
  k64: 58.2000,
  k65: 32.5000,
  k66: 6.8000,
  k67: 80.2000,
  k68: 54.5000,
  k69: 28.8000,
  k70: 3.1000,
  k71: 76.5000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_020_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_020_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_020_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_020_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_020_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_020_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_020_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_020_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_020_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_020_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_020_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_020_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
