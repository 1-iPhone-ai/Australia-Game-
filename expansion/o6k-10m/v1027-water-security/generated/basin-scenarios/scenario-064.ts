import { V1027_WSEC_clamp, V1027_WSEC_waterSecurityBandFromScore } from '../../engine/water-security-utils.ts';
import type {
  V1027WsecWaterSecurityBand,
  V1027WsecRegionId,
  V1027WsecBasinSnapshot,
  V1027WsecWaterSecurityChannel,
} from '../../types/core.ts';

/** Generated basin scenario 064 — surface/ground/aquifer handoff matrix. */
export const V1027_WSEC_BASIN_SCENARIO_064_META = {
  id: 'basin_064',
  regionId: 'NSW' as V1027WsecRegionId,
  primaryChannel: 'rural_clinic' as V1027WsecWaterSecurityChannel,
  waterSecurityBand: 'recovering' as V1027WsecWaterSecurityBand,
  seed: 58825,
} as const;

const V1027_WSEC_BASIN_SCENARIO_064_COEF = {
  k0: 2.2000,
  k1: 2.4000,
  k2: 2.6000,
  k3: 2.8000,
  k4: 3.0000,
  k5: 3.2000,
  k6: 3.4000,
  k7: 3.6000,
  k8: 3.8000,
  k9: 4.0000,
  k10: 4.2000,
  k11: 4.4000,
  k12: 4.6000,
  k13: 4.8000,
  k14: 5.0000,
  k15: 5.2000,
  k16: 5.4000,
  k17: 5.6000,
  k18: 5.8000,
  k19: 6.0000,
  k20: 6.2000,
  k21: 6.4000,
  k22: 6.6000,
  k23: 6.8000,
  k24: 7.0000,
  k25: 7.2000,
  k26: 7.4000,
  k27: 7.6000,
  k28: 7.8000,
  k29: 8.0000,
  k30: 8.2000,
  k31: 8.4000,
  k32: 8.6000,
  k33: 8.8000,
  k34: 9.0000,
  k35: 9.2000,
  k36: 9.4000,
  k37: 9.6000,
  k38: 9.8000,
  k39: 10.0000,
  k40: 10.2000,
  k41: 10.4000,
  k42: 10.6000,
  k43: 10.8000,
  k44: 11.0000,
  k45: 11.2000,
  k46: 11.4000,
  k47: 11.6000,
  k48: 11.8000,
  k49: 12.0000,
  k50: 12.2000,
  k51: 12.4000,
  k52: 12.6000,
  k53: 12.8000,
  k54: 13.0000,
  k55: 13.2000,
  k56: 13.4000,
  k57: 13.6000,
  k58: 13.8000,
  k59: 14.0000,
  k60: 14.2000,
  k61: 14.4000,
  k62: 14.6000,
  k63: 14.8000,
  k64: 15.0000,
  k65: 15.2000,
  k66: 15.4000,
  k67: 15.6000,
  k68: 15.8000,
  k69: 16.0000,
  k70: 16.2000,
  k71: 16.4000,
} as const;

export function V1027_WSEC_BASIN_SCENARIO_064_evaluate(turn: number): {
  waterStressIndex: number;
  aquiferReserveDelayTurns: number;
  waterSecurityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1027_WSEC_BASIN_SCENARIO_064_COEF) as Array<
    keyof typeof V1027_WSEC_BASIN_SCENARIO_064_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1027_WSEC_BASIN_SCENARIO_064_COEF[keys[j]] * ((turn + j) % 17);
  }
  const waterStressIndex = V1027_WSEC_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aquiferReserveDelayTurns = V1027_WSEC_clamp(2 + (acc % 11), 1, 18);
  const waterSecurityScore = V1027_WSEC_clamp(90 - waterStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1027_WSEC_waterSecurityBandFromScore(waterSecurityScore) !== 'depleted';
  return { waterStressIndex, aquiferReserveDelayTurns, waterSecurityScore, stable };
}

export function V1027_WSEC_BASIN_SCENARIO_064_snapshot(turn: number): V1027WsecBasinSnapshot {
  const r = V1027_WSEC_BASIN_SCENARIO_064_evaluate(turn);
  return {
    scenarioId: V1027_WSEC_BASIN_SCENARIO_064_META.id,
    regionId: V1027_WSEC_BASIN_SCENARIO_064_META.regionId,
    waterSecurityChannel: V1027_WSEC_BASIN_SCENARIO_064_META.primaryChannel,
    waterSecurityBand: V1027_WSEC_BASIN_SCENARIO_064_META.waterSecurityBand,
    waterStressIndex: r.waterStressIndex,
    aquiferReserveDelayTurns: r.aquiferReserveDelayTurns,
    waterSecurityScore: r.waterSecurityScore,
    waterSecurityBand: V1027_WSEC_waterSecurityBandFromScore(r.waterSecurityScore),
  };
}

export function V1027_WSEC_BASIN_SCENARIO_064_regressionAssert(turn: number): boolean {
  const r = V1027_WSEC_BASIN_SCENARIO_064_evaluate(turn);
  return typeof r.waterStressIndex === 'number' && r.waterSecurityScore <= 100;
}
