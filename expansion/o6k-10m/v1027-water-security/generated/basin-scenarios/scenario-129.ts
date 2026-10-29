import { V1027_WSEC_clamp, V1027_WSEC_waterSecurityBandFromScore } from '../../engine/water-security-utils.ts';
import type {
  V1027WsecWaterSecurityBand,
  V1027WsecRegionId,
  V1027WsecBasinSnapshot,
  V1027WsecWaterSecurityChannel,
} from '../../types/core.ts';

/** Generated basin scenario 129 — surface/ground/aquifer handoff matrix. */
export const V1027_WSEC_BASIN_SCENARIO_129_META = {
  id: 'basin_129',
  regionId: 'VIC' as V1027WsecRegionId,
  primaryChannel: 'remote' as V1027WsecWaterSecurityChannel,
  waterSecurityBand: 'recovering' as V1027WsecWaterSecurityBand,
  seed: 118040,
} as const;

const V1027_WSEC_BASIN_SCENARIO_129_COEF = {
  k0: 34.6000,
  k1: 74.0000,
  k2: 13.7000,
  k3: 53.1000,
  k4: 92.5000,
  k5: 32.2000,
  k6: 71.6000,
  k7: 11.3000,
  k8: 50.7000,
  k9: 90.1000,
  k10: 29.8000,
  k11: 69.2000,
  k12: 8.9000,
  k13: 48.3000,
  k14: 87.7000,
  k15: 27.4000,
  k16: 66.8000,
  k17: 6.5000,
  k18: 45.9000,
  k19: 85.3000,
  k20: 25.0000,
  k21: 64.4000,
  k22: 4.1000,
  k23: 43.5000,
  k24: 82.9000,
  k25: 22.6000,
  k26: 62.0000,
  k27: 1.7000,
  k28: 41.1000,
  k29: 80.5000,
  k30: 20.2000,
  k31: 59.6000,
  k32: 99.0000,
  k33: 38.7000,
  k34: 78.1000,
  k35: 17.8000,
  k36: 57.2000,
  k37: 96.6000,
  k38: 36.3000,
  k39: 75.7000,
  k40: 15.4000,
  k41: 54.8000,
  k42: 94.2000,
  k43: 33.9000,
  k44: 73.3000,
  k45: 13.0000,
  k46: 52.4000,
  k47: 91.8000,
  k48: 31.5000,
  k49: 70.9000,
  k50: 10.6000,
  k51: 50.0000,
  k52: 89.4000,
  k53: 29.1000,
  k54: 68.5000,
  k55: 8.2000,
  k56: 47.6000,
  k57: 87.0000,
  k58: 26.7000,
  k59: 66.1000,
  k60: 5.8000,
  k61: 45.2000,
  k62: 84.6000,
  k63: 24.3000,
  k64: 63.7000,
  k65: 3.4000,
  k66: 42.8000,
  k67: 82.2000,
  k68: 21.9000,
  k69: 61.3000,
  k70: 1.0000,
  k71: 40.4000,
} as const;

export function V1027_WSEC_BASIN_SCENARIO_129_evaluate(turn: number): {
  waterStressIndex: number;
  aquiferReserveDelayTurns: number;
  waterSecurityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1027_WSEC_BASIN_SCENARIO_129_COEF) as Array<
    keyof typeof V1027_WSEC_BASIN_SCENARIO_129_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1027_WSEC_BASIN_SCENARIO_129_COEF[keys[j]] * ((turn + j) % 17);
  }
  const waterStressIndex = V1027_WSEC_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aquiferReserveDelayTurns = V1027_WSEC_clamp(2 + (acc % 11), 1, 18);
  const waterSecurityScore = V1027_WSEC_clamp(90 - waterStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1027_WSEC_waterSecurityBandFromScore(waterSecurityScore) !== 'depleted';
  return { waterStressIndex, aquiferReserveDelayTurns, waterSecurityScore, stable };
}

export function V1027_WSEC_BASIN_SCENARIO_129_snapshot(turn: number): V1027WsecBasinSnapshot {
  const r = V1027_WSEC_BASIN_SCENARIO_129_evaluate(turn);
  return {
    scenarioId: V1027_WSEC_BASIN_SCENARIO_129_META.id,
    regionId: V1027_WSEC_BASIN_SCENARIO_129_META.regionId,
    waterSecurityChannel: V1027_WSEC_BASIN_SCENARIO_129_META.primaryChannel,
    waterSecurityBand: V1027_WSEC_BASIN_SCENARIO_129_META.waterSecurityBand,
    waterStressIndex: r.waterStressIndex,
    aquiferReserveDelayTurns: r.aquiferReserveDelayTurns,
    waterSecurityScore: r.waterSecurityScore,
    waterSecurityBand: V1027_WSEC_waterSecurityBandFromScore(r.waterSecurityScore),
  };
}

export function V1027_WSEC_BASIN_SCENARIO_129_regressionAssert(turn: number): boolean {
  const r = V1027_WSEC_BASIN_SCENARIO_129_evaluate(turn);
  return typeof r.waterStressIndex === 'number' && r.waterSecurityScore <= 100;
}
