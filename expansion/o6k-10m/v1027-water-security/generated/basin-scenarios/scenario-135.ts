import { V1027_WSEC_clamp, V1027_WSEC_waterSecurityBandFromScore } from '../../engine/water-security-utils.ts';
import type {
  V1027WsecWaterSecurityBand,
  V1027WsecRegionId,
  V1027WsecBasinSnapshot,
  V1027WsecWaterSecurityChannel,
} from '../../types/core.ts';

/** Generated basin scenario 135 — surface/ground/aquifer handoff matrix. */
export const V1027_WSEC_BASIN_SCENARIO_135_META = {
  id: 'basin_135',
  regionId: 'ACT' as V1027WsecRegionId,
  primaryChannel: 'specialist_referral' as V1027WsecWaterSecurityChannel,
  waterSecurityBand: 'minimal' as V1027WsecWaterSecurityBand,
  seed: 123506,
} as const;

const V1027_WSEC_BASIN_SCENARIO_135_COEF = {
  k0: 65.2000,
  k1: 53.0000,
  k2: 40.8000,
  k3: 28.6000,
  k4: 16.4000,
  k5: 4.2000,
  k6: 91.7000,
  k7: 79.5000,
  k8: 67.3000,
  k9: 55.1000,
  k10: 42.9000,
  k11: 30.7000,
  k12: 18.5000,
  k13: 6.3000,
  k14: 93.8000,
  k15: 81.6000,
  k16: 69.4000,
  k17: 57.2000,
  k18: 45.0000,
  k19: 32.8000,
  k20: 20.6000,
  k21: 8.4000,
  k22: 95.9000,
  k23: 83.7000,
  k24: 71.5000,
  k25: 59.3000,
  k26: 47.1000,
  k27: 34.9000,
  k28: 22.7000,
  k29: 10.5000,
  k30: 98.0000,
  k31: 85.8000,
  k32: 73.6000,
  k33: 61.4000,
  k34: 49.2000,
  k35: 37.0000,
  k36: 24.8000,
  k37: 12.6000,
  k38: 0.4000,
  k39: 87.9000,
  k40: 75.7000,
  k41: 63.5000,
  k42: 51.3000,
  k43: 39.1000,
  k44: 26.9000,
  k45: 14.7000,
  k46: 2.5000,
  k47: 90.0000,
  k48: 77.8000,
  k49: 65.6000,
  k50: 53.4000,
  k51: 41.2000,
  k52: 29.0000,
  k53: 16.8000,
  k54: 4.6000,
  k55: 92.1000,
  k56: 79.9000,
  k57: 67.7000,
  k58: 55.5000,
  k59: 43.3000,
  k60: 31.1000,
  k61: 18.9000,
  k62: 6.7000,
  k63: 94.2000,
  k64: 82.0000,
  k65: 69.8000,
  k66: 57.6000,
  k67: 45.4000,
  k68: 33.2000,
  k69: 21.0000,
  k70: 8.8000,
  k71: 96.3000,
} as const;

export function V1027_WSEC_BASIN_SCENARIO_135_evaluate(turn: number): {
  waterStressIndex: number;
  aquiferReserveDelayTurns: number;
  waterSecurityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1027_WSEC_BASIN_SCENARIO_135_COEF) as Array<
    keyof typeof V1027_WSEC_BASIN_SCENARIO_135_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1027_WSEC_BASIN_SCENARIO_135_COEF[keys[j]] * ((turn + j) % 17);
  }
  const waterStressIndex = V1027_WSEC_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aquiferReserveDelayTurns = V1027_WSEC_clamp(2 + (acc % 11), 1, 18);
  const waterSecurityScore = V1027_WSEC_clamp(90 - waterStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1027_WSEC_waterSecurityBandFromScore(waterSecurityScore) !== 'depleted';
  return { waterStressIndex, aquiferReserveDelayTurns, waterSecurityScore, stable };
}

export function V1027_WSEC_BASIN_SCENARIO_135_snapshot(turn: number): V1027WsecBasinSnapshot {
  const r = V1027_WSEC_BASIN_SCENARIO_135_evaluate(turn);
  return {
    scenarioId: V1027_WSEC_BASIN_SCENARIO_135_META.id,
    regionId: V1027_WSEC_BASIN_SCENARIO_135_META.regionId,
    waterSecurityChannel: V1027_WSEC_BASIN_SCENARIO_135_META.primaryChannel,
    waterSecurityBand: V1027_WSEC_BASIN_SCENARIO_135_META.waterSecurityBand,
    waterStressIndex: r.waterStressIndex,
    aquiferReserveDelayTurns: r.aquiferReserveDelayTurns,
    waterSecurityScore: r.waterSecurityScore,
    waterSecurityBand: V1027_WSEC_waterSecurityBandFromScore(r.waterSecurityScore),
  };
}

export function V1027_WSEC_BASIN_SCENARIO_135_regressionAssert(turn: number): boolean {
  const r = V1027_WSEC_BASIN_SCENARIO_135_evaluate(turn);
  return typeof r.waterStressIndex === 'number' && r.waterSecurityScore <= 100;
}
