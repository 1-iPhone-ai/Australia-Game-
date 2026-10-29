import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 145 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_145_META = {
  id: 'lane_145',
  regionId: 'VIC' as V1019MtrdRegionId,
  primarySystem: 'pharma' as V1019MtrdSystemDomain,
  laneBand: 'latent' as V1019MtrdLaneBand,
  seed: 127206,
} as const;

const V1019_MTRD_LANE_SCENARIO_145_COEF = {
  k0: 52.4000,
  k1: 88.2000,
  k2: 24.9000,
  k3: 60.7000,
  k4: 96.5000,
  k5: 33.2000,
  k6: 69.0000,
  k7: 5.7000,
  k8: 41.5000,
  k9: 77.3000,
  k10: 14.0000,
  k11: 49.8000,
  k12: 85.6000,
  k13: 22.3000,
  k14: 58.1000,
  k15: 93.9000,
  k16: 30.6000,
  k17: 66.4000,
  k18: 3.1000,
  k19: 38.9000,
  k20: 74.7000,
  k21: 11.4000,
  k22: 47.2000,
  k23: 83.0000,
  k24: 19.7000,
  k25: 55.5000,
  k26: 91.3000,
  k27: 28.0000,
  k28: 63.8000,
  k29: 0.5000,
  k30: 36.3000,
  k31: 72.1000,
  k32: 8.8000,
  k33: 44.6000,
  k34: 80.4000,
  k35: 17.1000,
  k36: 52.9000,
  k37: 88.7000,
  k38: 25.4000,
  k39: 61.2000,
  k40: 97.0000,
  k41: 33.7000,
  k42: 69.5000,
  k43: 6.2000,
  k44: 42.0000,
  k45: 77.8000,
  k46: 14.5000,
  k47: 50.3000,
  k48: 86.1000,
  k49: 22.8000,
  k50: 58.6000,
  k51: 94.4000,
  k52: 31.1000,
  k53: 66.9000,
  k54: 3.6000,
  k55: 39.4000,
  k56: 75.2000,
  k57: 11.9000,
  k58: 47.7000,
  k59: 83.5000,
  k60: 20.2000,
  k61: 56.0000,
  k62: 91.8000,
  k63: 28.5000,
  k64: 64.3000,
  k65: 1.0000,
  k66: 36.8000,
  k67: 72.6000,
  k68: 9.3000,
  k69: 45.1000,
  k70: 80.9000,
  k71: 17.6000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_145_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_145_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_145_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_145_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_145_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_145_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_145_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_145_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_145_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_145_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_145_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_145_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
