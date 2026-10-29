import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 009 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_009_META = {
  id: 'transfer_009',
  regionId: 'VIC' as V1018FfedRegionId,
  primarySystem: 'finance' as V1018FfedSystemDomain,
  transferBand: 'recovering' as V1018FfedTransferBand,
  seed: 7934,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_009_COEF = {
  k0: 4.2000,
  k1: 4.8000,
  k2: 5.4000,
  k3: 6.0000,
  k4: 6.6000,
  k5: 7.2000,
  k6: 7.8000,
  k7: 8.4000,
  k8: 9.0000,
  k9: 9.6000,
  k10: 10.2000,
  k11: 10.8000,
  k12: 11.4000,
  k13: 12.0000,
  k14: 12.6000,
  k15: 13.2000,
  k16: 13.8000,
  k17: 14.4000,
  k18: 15.0000,
  k19: 15.6000,
  k20: 16.2000,
  k21: 16.8000,
  k22: 17.4000,
  k23: 18.0000,
  k24: 18.6000,
  k25: 19.2000,
  k26: 19.8000,
  k27: 20.4000,
  k28: 21.0000,
  k29: 21.6000,
  k30: 22.2000,
  k31: 22.8000,
  k32: 23.4000,
  k33: 24.0000,
  k34: 24.6000,
  k35: 25.2000,
  k36: 25.8000,
  k37: 26.4000,
  k38: 27.0000,
  k39: 27.6000,
  k40: 28.2000,
  k41: 28.8000,
  k42: 29.4000,
  k43: 30.0000,
  k44: 30.6000,
  k45: 31.2000,
  k46: 31.8000,
  k47: 32.4000,
  k48: 33.0000,
  k49: 33.6000,
  k50: 34.2000,
  k51: 34.8000,
  k52: 35.4000,
  k53: 36.0000,
  k54: 36.6000,
  k55: 37.2000,
  k56: 37.8000,
  k57: 38.4000,
  k58: 39.0000,
  k59: 39.6000,
  k60: 40.2000,
  k61: 40.8000,
  k62: 41.4000,
  k63: 42.0000,
  k64: 42.6000,
  k65: 43.2000,
  k66: 43.8000,
  k67: 44.4000,
  k68: 45.0000,
  k69: 45.6000,
  k70: 46.2000,
  k71: 46.8000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_009_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_009_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_009_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_009_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_009_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_009_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_009_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_009_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_009_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_009_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_009_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_009_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
